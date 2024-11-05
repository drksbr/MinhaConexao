import { useState, useRef } from 'react';

interface SpeedTestResults {
    downloadSpeed: number;
    uploadSpeed: number;
    ping: number;
    jitter: number;
}

interface RealTimeData {
    currentDownloadSpeed: number;
    currentUploadSpeed: number;
    progress: number;
}

interface UseSpeedTestOptions {
    baseUrls: string[]; // Array de URLs base
    testDuration?: number;
    initialFileSize?: number; // Tamanho inicial do arquivo de download em bytes
    numberOfConnections?: number; // Número de conexões paralelas
    correctionCoefficient?: number; // Coeficiente de correção opcional
}

export const useSpeedTest = (options: UseSpeedTestOptions) => {
    const {
        baseUrls,
        testDuration = 10,
        initialFileSize = 262_144, // Tamanho inicial menor (256 KB)
        numberOfConnections = 4,
        correctionCoefficient = 1.04, // Coeficiente de correção padrão
    } = options;

    const [results, setResults] = useState<SpeedTestResults | null>(null);
    const [isTesting, setIsTesting] = useState(false);

    const [realTimeData, setRealTimeData] = useState<RealTimeData>({
        currentDownloadSpeed: 0,
        currentUploadSpeed: 0,
        progress: 0,
    });

    const downloadBytesTransferred = useRef(0);
    const uploadBytesTransferred = useRef(0);
    const downloadStartTime = useRef<number>(0);
    const uploadStartTime = useRef<number>(0);
    const pingTimes = useRef<number[]>([]);

    const currentUrlIndex = useRef(0); // Índice atual para round-robin

    const calculateSpeed = (bytes: number, duration: number) => {
        return (bytes * 8) / (duration * 1_000_000); // Mbps
    };

    const getNextUrl = () => {
        const url = baseUrls[currentUrlIndex.current];
        currentUrlIndex.current = (currentUrlIndex.current + 1) % baseUrls.length;
        return url;
    };

    const performPingTest = async () => {
        const pingSamples = 10;
        const pings: number[] = [];

        for (let i = 0; i < pingSamples; i++) {
            const url = getNextUrl();
            const start = performance.now();
            try {
                await fetch(`${url}/ping?n=${Math.random()}`, {
                    method: 'HEAD',
                    cache: 'no-store',
                });
                const latency = performance.now() - start;
                pings.push(latency);
            } catch {
                pings.push(performance.now() - start);
            }
        }

        const ping = pings.reduce((a, b) => a + b, 0) / pings.length;
        const jitter =
            pings.reduce((a, b) => a + Math.abs(b - ping), 0) / (pings.length - 1);

        pingTimes.current = pings;

        return { ping, jitter };
    };

    const startTest = async () => {
        setIsTesting(true);
        setResults(null);
        setRealTimeData({
            currentDownloadSpeed: 0,
            currentUploadSpeed: 0,
            progress: 0,
        });
        downloadBytesTransferred.current = 0;
        uploadBytesTransferred.current = 0;

        // Realiza o teste de Ping
        const { ping, jitter } = await performPingTest();

        // Realiza o teste de Download
        const downloadSpeedRaw = await performDownloadTest();

        // Realiza o teste de Upload
        const uploadSpeedRaw = await performUploadTest();

        // Aplicar o coeficiente de correção às velocidades finais
        const downloadSpeed = downloadSpeedRaw * correctionCoefficient;
        const uploadSpeed = uploadSpeedRaw * correctionCoefficient;

        setResults({
            ping,
            jitter,
            downloadSpeed,
            uploadSpeed,
        });
        setIsTesting(false);
    };

    const performDownloadTest = async (): Promise<number> => {
        const controllers = Array.from({ length: numberOfConnections }, () => new AbortController());

        let dynamicFileSize = initialFileSize;
        let adjustInterval: number;

        return new Promise<number>((resolve) => {
            let isTestRunning = true;
            downloadStartTime.current = performance.now();

            const updateProgress = () => {
                const elapsed = (performance.now() - downloadStartTime.current) / 1000;
                const totalBytesReceived = downloadBytesTransferred.current;

                // Calcular velocidade de download atual e aplicar o coeficiente de correção
                const currentSpeed =
                    calculateSpeed(totalBytesReceived, elapsed) * correctionCoefficient;

                setRealTimeData((prevData) => ({
                    ...prevData,
                    currentDownloadSpeed: currentSpeed,
                    progress: (elapsed / (testDuration * 2)) * 100, // Download é 50% do teste
                }));

                if (elapsed >= testDuration) {
                    isTestRunning = false;
                    controllers.forEach(controller => controller.abort());
                    clearInterval(adjustInterval); // Limpar o intervalo
                    const speed = calculateSpeed(totalBytesReceived, testDuration);
                    resolve(speed); // Retorna a velocidade sem correção, aplicada posteriormente
                } else {
                    requestAnimationFrame(updateProgress);
                }
            };

            const startFetch = (i: number) => {
                if (!isTestRunning) return;
                const url = getNextUrl();
                controllers[i] = new AbortController();
                const signal = controllers[i].signal;

                fetch(`${url}/download?size=${Math.floor(dynamicFileSize)}&n=${Math.random()}`, {
                    signal,
                    cache: 'no-store',
                })
                    .then((response) => {
                        if (!response.body) return;
                        const reader = response.body.getReader();

                        const read = () => {
                            if (!isTestRunning) return;
                            reader
                                .read()
                                .then(({ done, value }) => {
                                    if (done) {
                                        if (isTestRunning) {
                                            // Reiniciar o download
                                            startFetch(i);
                                        }
                                        return;
                                    }
                                    const chunkSize = value?.length ?? 0;
                                    downloadBytesTransferred.current += chunkSize;
                                    read();
                                })
                                .catch(() => {
                                    if (isTestRunning) {
                                        // Reiniciar o download em caso de erro
                                        startFetch(i);
                                    }
                                });
                        };
                        read();
                    })
                    .catch(() => {
                        if (isTestRunning) {
                            // Reiniciar o download em caso de erro
                            startFetch(i);
                        }
                    });
            };

            // Iniciar as requisições de download
            for (let i = 0; i < numberOfConnections; i++) {
                startFetch(i);
            }

            // Ajustar o tamanho do arquivo a cada segundo
            adjustInterval = window.setInterval(() => {
                if (!isTestRunning) return;

                // Ajustar o tamanho do arquivo com base na velocidade atual
                const elapsed = (performance.now() - downloadStartTime.current) / 1000;
                const totalBytesReceived = downloadBytesTransferred.current;
                const currentSpeed = calculateSpeed(totalBytesReceived, elapsed);

                dynamicFileSize = Math.min(
                    Math.max((currentSpeed * 1_000_000) / 8, initialFileSize), // Baseado na velocidade atual
                    50 * 1024 * 1024 // Limite máximo de 50 MB
                );

                // As novas requisições utilizarão o tamanho atualizado
            }, 1000);

            updateProgress();
        });
    };

    const performUploadTest = async (): Promise<number> => {
        const bytesSentArray = Array(numberOfConnections).fill(0);

        let dynamicChunkSize = initialFileSize;
        let data = new Uint8Array(dynamicChunkSize).fill(0);
        let blob = new Blob([data]);
        let adjustInterval: number;

        return new Promise<number>((resolve) => {
            let isTestRunning = true;
            uploadStartTime.current = performance.now();

            const updateProgress = () => {
                const elapsed = (performance.now() - uploadStartTime.current) / 1000;
                const totalBytesSent = uploadBytesTransferred.current;

                // Calcular velocidade de upload atual e aplicar o coeficiente de correção
                const currentSpeed =
                    calculateSpeed(totalBytesSent, elapsed) * correctionCoefficient;

                setRealTimeData((prevData) => ({
                    ...prevData,
                    currentUploadSpeed: currentSpeed,
                    progress: 50 + (elapsed / (testDuration * 2)) * 100, // Upload é a segunda metade
                }));

                if (elapsed >= testDuration) {
                    isTestRunning = false;
                    clearInterval(adjustInterval); // Limpar o intervalo
                    const speed = calculateSpeed(totalBytesSent, testDuration);
                    resolve(speed); // Retorna a velocidade sem correção, aplicada posteriormente
                } else {
                    requestAnimationFrame(updateProgress);
                }
            };

            const sendData = (i: number) => {
                if (!isTestRunning) return;
                const url = getNextUrl();
                const xhr = new XMLHttpRequest();

                xhr.open('POST', `${url}/upload?n=${Math.random()}`, true);
                xhr.setRequestHeader('Cache-Control', 'no-store');

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const bytesSent = event.loaded - bytesSentArray[i];
                        bytesSentArray[i] = event.loaded;
                        uploadBytesTransferred.current += bytesSent;
                    }
                };

                xhr.onload = () => {
                    if (!isTestRunning) return;
                    sendData(i); // Continuar enviando dados
                };

                xhr.onerror = () => {
                    if (isTestRunning) {
                        // Reiniciar o upload em caso de erro
                        sendData(i);
                    }
                };

                xhr.send(blob);
            };

            // Iniciar as requisições de upload
            for (let i = 0; i < numberOfConnections; i++) {
                sendData(i);
            }

            // Ajustar o tamanho do chunk a cada segundo
            adjustInterval = window.setInterval(() => {
                if (!isTestRunning) return;

                // Ajustar o tamanho do chunk com base na velocidade atual
                const elapsed = (performance.now() - uploadStartTime.current) / 1000;
                const totalBytesSent = uploadBytesTransferred.current;
                const currentSpeed = calculateSpeed(totalBytesSent, elapsed);

                dynamicChunkSize = Math.min(
                    Math.max((currentSpeed * 1_000_000) / 8, initialFileSize), // Baseado na velocidade atual
                    50 * 1024 * 1024 // Limite máximo de 50 MB
                );

                data = new Uint8Array(Math.floor(dynamicChunkSize)).fill(0);
                blob = new Blob([data]);

                // Resetar bytesSentArray para acompanhar o progresso corretamente
                for (let i = 0; i < numberOfConnections; i++) {
                    bytesSentArray[i] = 0;
                }

                // As novas requisições utilizarão o tamanho atualizado
            }, 1000);

            updateProgress();
        });
    };

    return {
        startTest,
        results,
        isTesting,
        realTimeData,
        downloadBytesTransferred,
        uploadBytesTransferred,
    };
};
