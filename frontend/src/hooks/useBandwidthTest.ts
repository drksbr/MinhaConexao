import { useState, useRef } from 'react';
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';

type BandwidthTestConfig = {
    urlBase: string;
    duplex: boolean;
    downloadTestTime: number; // Tempo de teste para download (em ms)
    uploadTestTime: number; // Tempo de teste para upload (em ms)
    concurrentRequests: number; // número de downloads/uploads simultâneos
};

const useBandwidthTest = ({ urlBase, duplex, downloadTestTime, uploadTestTime, concurrentRequests }: BandwidthTestConfig) => {
    const [downloadState, setDownloadState] = useState({ speed: 0, data: 0 });
    const [uploadState, setUploadState] = useState({ speed: 0, data: 0 });
    const [latencyState, setLatencyState] = useState({ unloaded: 0, loaded: 0 });

    const totalDownloadData = useRef(0); // Total de dados baixados
    const totalUploadData = useRef(0); // Total de dados enviados
    const downloadProgress = useRef<number[]>([]); // Array para armazenar o progresso de cada requisição de download
    const uploadProgress = useRef<number[]>([]); // Array para armazenar o progresso de cada requisição de upload
    const isRunning = useRef(false);
    const cancelTokens = useRef<CancelTokenSource[]>([]);
    const startTimeRef = useRef(0); // Tempo de início do teste

    // Função para calcular largura de banda em Mbps
    const calculateBandwidth = (totalData: number, elapsedTime: number): number => {
        return (totalData / elapsedTime) * 8 / 1024 / 1024; // Converte bytes para Mbps
    };

    // Função para gerenciar o progresso de download
    const handleDownloadProgress = (requestIndex: number, loaded: number) => {
        downloadProgress.current[requestIndex] = loaded; // Atualiza o progresso dessa requisição
        totalDownloadData.current = downloadProgress.current.reduce((acc, value) => acc + value, 0); // Soma total
    };

    // Função para gerenciar o progresso de upload
    const handleUploadProgress = (requestIndex: number, loaded: number) => {
        uploadProgress.current[requestIndex] = loaded; // Atualiza o progresso dessa requisição
        totalUploadData.current = uploadProgress.current.reduce((acc, value) => acc + value, 0); // Soma total
    };

    // Função para download test
    const downloadTest = async () => {
        const downloadUrl = `${urlBase}/download`;

        totalDownloadData.current = 0; // Reinicia o total de dados baixados
        downloadProgress.current = Array(concurrentRequests).fill(0); // Reinicia o array de progresso

        const downloadPromises = [];
        for (let i = 0; i < concurrentRequests; i++) {
            const cancelToken = axios.CancelToken.source();
            cancelTokens.current.push(cancelToken);

            const config: AxiosRequestConfig = {
                responseType: 'blob',
                cancelToken: cancelToken.token,
                onDownloadProgress: (progressEvent) => {
                    // Atualiza o progresso de download para essa requisição
                    handleDownloadProgress(i, progressEvent.loaded);
                },
            };

            downloadPromises.push(axios.get(downloadUrl, config).catch((error) => {
                if (axios.isCancel(error)) {
                    console.log('Download cancelado');
                } else {
                    console.error('Erro no download:', error);
                }
            }));
        }

        await Promise.all(downloadPromises);
    };

    // Função para upload test
    const uploadTest = async () => {
        const uploadUrl = `${urlBase}/upload`;

        // Tamanho em bytes (50 MB)
        const sizeInBytes = 99 * 1024 * 1024;

        // Cria um buffer com zeros
        const buffer = new Uint8Array(sizeInBytes);

        // Opcional: preencher com dados aleatórios (descomente se necessário)
        // for (let i = 0; i < buffer.length; i++) {
        //   buffer[i] = Math.floor(Math.random() * 256);
        // }

        // Cria um Blob a partir do buffer
        const blob = new Blob([buffer], { type: 'application/octet-stream' });

        // Cria um objeto File a partir do Blob
        const file = new File([blob], 'arquivo_50mb.bin', { type: 'application/octet-stream' });

        totalUploadData.current = 0; // Reinicia o total de dados enviados
        uploadProgress.current = Array(concurrentRequests).fill(0); // Reinicia o array de progresso

        const uploadPromises = [];
        for (let i = 0; i < concurrentRequests; i++) {
            const cancelToken = axios.CancelToken.source();
            cancelTokens.current.push(cancelToken);

            // Cria um FormData e adiciona o arquivo
            const formData = new FormData();
            formData.append('file', file);

            const config: AxiosRequestConfig = {
                headers: { 'Content-Type': 'multipart/form-data' },
                cancelToken: cancelToken.token,
                onUploadProgress: (progressEvent) => {
                    // Atualiza o progresso de upload para essa requisição
                    handleUploadProgress(i, progressEvent.loaded);
                },
            };

            uploadPromises.push(
                axios.post(uploadUrl, formData, config).catch((error) => {
                    if (axios.isCancel(error)) {
                        console.log('Upload cancelado');
                    } else {
                        console.error('Erro no upload:', error);
                    }
                })
            );
        }

        await Promise.all(uploadPromises);
    };


    // Função para calcular a latência média a partir de múltiplas requisições HEAD
    const calculateLatency = async (endpoint: string): Promise<number> => {
        const latencies: number[] = [];
        for (let i = 0; i < 5; i++) {
            const start = performance.now();
            await fetch(endpoint, { method: 'HEAD' });
            const latency = performance.now() - start;
            latencies.push(latency);
        }
        return latencies.reduce((acc, val) => acc + val, 0) / latencies.length;
    };

    // Função para medir a latência antes e durante o download
    const measureLatency = async () => {
        console.log('Measuring unloaded latency (rede não carregada)');

        // Medir a latência antes de iniciar o download
        const unloadedLatency = await calculateLatency(`${urlBase}/ping`);
        setLatencyState((prev) => ({
            ...prev,
            unloaded: unloadedLatency,
        }));

        // Medir a latência durante os últimos 5 segundos do download
        const loadedLatencyTimeout = downloadTestTime - 5000; // Ajusta para 5 segundos antes do fim do download

        if (loadedLatencyTimeout > 0) {
            setTimeout(async () => {
                console.log('Measuring loaded latency (rede carregada)');
                const loadedLatency = await calculateLatency(`${urlBase}/ping`);
                setLatencyState((prev) => ({
                    ...prev,
                    loaded: loadedLatency,
                }));
            }, loadedLatencyTimeout);
        } else {
            console.log('Tempo de download muito curto para medir latência carregada.');
        }
    };

    // Função para calcular e atualizar a largura de banda
    const updateBandwidth = (isDownloadPhase: boolean) => {
        const elapsedTime = (performance.now() - startTimeRef.current) / 1000; // Tempo em segundos

        console.log("Tempo decorrido:", elapsedTime);
        console.log("Dados baixados:", totalDownloadData.current);
        console.log("Dados enviados:", totalUploadData.current);

        if (isDownloadPhase) {
            // Verifica se o download já terminou antes de atualizar
            if (totalDownloadData.current > 0) {
                const downloadSpeed = calculateBandwidth(totalDownloadData.current, elapsedTime);
                setDownloadState({
                    speed: downloadSpeed,
                    data: totalDownloadData.current,
                });
            }
        } else {
            // Verifica se o upload já iniciou e atualiza
            if (totalUploadData.current > 0) {
                const uploadSpeed = calculateBandwidth(totalUploadData.current, elapsedTime);
                setUploadState({
                    speed: uploadSpeed,
                    data: totalUploadData.current,
                });
            }
        }
    };


    // Start the bandwidth test
    const startTest = async () => {
        if (isRunning.current) return;
        isRunning.current = true;

        // Fase de Download
        console.log('Iniciando fase de download...');
        setTimeout(() => {
            console.log('Cancelando downloads após atingir o tempo de download.');
            cancelTokens.current.forEach((token) => token.cancel());
            cancelTokens.current = [];
            totalDownloadData.current = 0; // Parar atualizações de download
        }, downloadTestTime);

        // Atualiza a largura de banda a cada 200ms
        const interval = setInterval(() => {
            const elapsedTime = performance.now() - startTimeRef.current;
            const isDownloadPhase = elapsedTime < downloadTestTime;
            updateBandwidth(isDownloadPhase);
        }, 200);

        // Measure unloaded latency
        await measureLatency();

        if (duplex) {
            await Promise.all([downloadTest(), uploadTest()]);
        } else {
            // Executa o download e cancela automaticamente ao atingir o tempo de download
            startTimeRef.current = performance.now();
            await downloadTest();
            // clearTimeout(downloadTimeout);

            // Fase de Upload
            console.log('Iniciando fase de upload...');
            startTimeRef.current = performance.now(); // Reinicia o tempo para o upload
            setTimeout(() => {
                console.log('Cancelando uploads após atingir o tempo de upload.');
                cancelTokens.current.forEach((token) => token.cancel());
                cancelTokens.current = [];
                totalUploadData.current = 0; // Parar atualizações de upload
            }, uploadTestTime);

            await uploadTest();
            // clearTimeout(uploadTimeout);
        }

        clearInterval(interval);
        isRunning.current = false;
    };

    // Reset the test state
    const resetTest = () => {
        isRunning.current = false;
        cancelTokens.current.forEach((token) => token.cancel());
        cancelTokens.current = [];
        totalDownloadData.current = 0;
        totalUploadData.current = 0;
        downloadProgress.current = [];
        uploadProgress.current = [];
        setDownloadState({ speed: 0, data: 0 });
        setUploadState({ speed: 0, data: 0 });
        setLatencyState({ unloaded: 0, loaded: 0 });
    };

    return {
        downloadState,
        uploadState,
        latencyState,
        startTest,
        resetTest,
    };
};

export default useBandwidthTest;
