import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Heading,
    IconButton,
    useColorModeValue,
    Spinner,
    Center,
    Flex,
    Text,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import {
    LineChart,
    Line,
    ResponsiveContainer,
    Legend,
    Tooltip
} from 'recharts';

interface Measurement {
    timestamp: number;
    ping: number;
    jitter: number;
}

const PingJitterChart: React.FC = () => {
    const [data, setData] = useState<Measurement[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const previousPingRef = useRef<number | null>(null);
    const measurementCountRef = useRef<number>(0); // Contador de medições

    const measurePing = async () => {
        const startTime = performance.now();

        try {
            // Envia uma requisição GET simples para o servidor
            await fetch('/ping', { cache: 'no-store' }); // Usamos 'no-store' para evitar cache

            const endTime = performance.now();
            let ping = endTime - startTime; // Latência em milissegundos

            // Arredonda o ping para um número inteiro
            ping = Math.round(ping);

            const timestamp = Date.now();

            // Atualiza o contador de medições
            measurementCountRef.current += 1;

            // Calcula o jitter
            let jitter = 0;
            if (previousPingRef.current !== null) {
                jitter = Math.abs(ping - previousPingRef.current);
            }

            previousPingRef.current = ping;

            // Se o número de medições for maior que 5, adiciona ao estado
            if (measurementCountRef.current > 5) {
                setData((prevData) => {
                    const newData = [...prevData, { timestamp, ping, jitter }];
                    // Limita o número de pontos no gráfico (opcional)
                    return newData.slice(-15); // Mantém apenas os últimos 100 itens
                });
            }
        } catch (error) {
            console.error('Erro ao medir o ping:', error);
        }
    };

    useEffect(() => {
        const startMeasuring = () => {
            setIsLoading(false);
            setIsFetching(true);

            measurePing(); // Medição inicial imediata

            intervalRef.current = setInterval(() => {
                measurePing();
            }, 500); // Medir a cada 1 segundo (ajuste conforme necessário)
        };

        startMeasuring();

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            // Resetar refs e estado ao desmontar o componente
            previousPingRef.current = null;
            measurementCountRef.current = 0;
            setData([]);
        };
    }, []);

    const refreshFunction = () => {
        // Reinicia as medições
        setData([]);
        previousPingRef.current = null;
        measurementCountRef.current = 0;
    };

    return (
        <Box
            bg={useColorModeValue('white', 'gray.700')}
            borderRadius="md"
            p={5}
            boxShadow="md"
            position="relative"
            _hover={{ boxShadow: 'xl', transform: 'scale(1.05)' }}
            transition="0.3s"
            maxW="full"
            minH="400px"
        >
            {/* Header do card com título e botão de refresh */}
            <Flex justifyContent="space-between" alignItems="center" mb={5}>
                <Heading size="lg">Ping e Jitter</Heading>
                <Box>
                    <Text fontSize='sm'>
                        {data.length > 0 && `Ping: ${data[data.length - 1].ping} ms | Jitter: ${data[data.length - 1].jitter} ms`}
                    </Text>
                    <Text fontSize='sm'>
                        {/* media de ping e jitter */}
                        {data.length > 0 && `Média Ping/Jitter: ${Math.round(data.reduce((acc, curr) => acc + curr.ping, 0) / data.length)} ms / ${Math.round(data.reduce((acc, curr) => acc + curr.jitter, 0) / data.length)} ms`}
                    </Text>
                </Box>
                <IconButton
                    aria-label="Refresh"
                    icon={<RepeatIcon />}
                    onClick={refreshFunction}
                    size="sm"
                    variant="ghost"
                    isLoading={isFetching}
                />
            </Flex>

            {/* Conteúdo do Card */}
            {isLoading ? (
                <Center>
                    <Spinner size="xl" />
                </Center>
            ) : data.length === 0 ? (
                <Center>
                    <Text>Coletando dados...</Text>
                </Center>
            ) : (
                <ResponsiveContainer maxHeight={300}>
                    <LineChart data={data}>
                        <Legend />
                        <Tooltip
                            labelFormatter={(label) => new Date(label).toLocaleString()}
                            formatter={(value, name) => [`${value} ms`, name]}
                        />
                        {/* <CartesianGrid color='grey' /> */}

                        <Line
                            type="monotone"
                            dataKey="ping"
                            stroke="#8884d8"
                            name="Ping (ms)"
                            isAnimationActive={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="jitter"
                            stroke="#82ca9d"
                            name="Jitter (ms)"
                            isAnimationActive={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </Box>
    );
};

export default PingJitterChart;
