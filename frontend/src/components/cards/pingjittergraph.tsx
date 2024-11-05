// src/components/PingJitterChart.tsx
import React, { useState, useEffect } from 'react';
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
import { Share2Icon, TimerResetIcon } from 'lucide-react';
import {
    LineChart,
    Line,
    ResponsiveContainer,
    Legend,
    Tooltip,
    CartesianGrid
} from 'recharts';
import usePing from '@/hooks/usePing';
import useShare from '@/hooks/useShare';

interface Measurement {
    timestamp: number;
    ping: number;
    jitter: number;
}

const PingJitterChart: React.FC = () => {
    const [data, setData] = useState<Measurement[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    // Utiliza o hook usePing para obter ping e jitter
    // const { ping, jitter } = usePing(`ws://localhost:8080/wsping`, 500, 30);
    const { ping, jitter } = usePing(`${window.location.origin.replace(/^http/, 'ws')}/wsping`, 500, 30);

    // Referência do card para captura de tela
    const { ref, share } = useShare();

    // Atualiza o estado com as novas medições
    useEffect(() => {
        if (ping !== null && jitter !== null) {
            const newMeasurement: Measurement = {
                timestamp: Date.now(),
                ping: Math.round(ping),
                jitter: Math.round(jitter)
            };

            setData(prevData => {
                const updatedData = [...prevData, newMeasurement];
                // Limita o número de pontos no gráfico para os últimos 15
                return updatedData.slice(-15);
            });

            if (isLoading) {
                setIsLoading(false);
            }
        }
    }, [ping, jitter, isLoading]);

    // Função para reiniciar as medições
    const refreshFunction = () => {
        setIsFetching(true);
        setData([]);
        setIsLoading(true);
        setIsFetching(false);
    };

    return (
        <Box
            bg={useColorModeValue('white', 'gray.700')}
            borderRadius="md"
            p={5}
            boxShadow="md"
            position="relative"
            _hover={{ boxShadow: 'xl', transform: 'scale(1.02)' }}
            transition="0.3s"
            maxW="full"
            minH="400px"
            ref={ref}
        >
            {/* Header do card com título e botão de refresh */}
            <Flex justifyContent="space-between" alignItems="center" mb={2}>
                <Heading size="lg">Ping e Jitter</Heading>

                {/* Botões */}
                <Box alignContent={"end"}>
                    <IconButton
                        aria-label="Share"
                        icon={
                            <Share2Icon size={18} />
                        }
                        onClick={share}
                        size="sm"
                        variant="ghost"
                    />
                    <IconButton
                        aria-label="Refresh"
                        icon={
                            <TimerResetIcon size={18} />
                        }
                        onClick={refreshFunction}
                        size="sm"
                        variant="ghost"
                        isLoading={isFetching}
                    />
                </Box>
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
                <Box>
                    <Box mb={5}>
                        <Box width="100%">
                            <Text fontSize="md" fontWeight="bold">
                                Realtime:
                            </Text>
                            <Text fontSize={'sm'}>{data.length > 0 && `Atual Ping: ${data[data.length - 1].ping} ms | Jitter: ${data[data.length - 1].jitter} ms`}</Text>
                            <Text fontSize={'sm'}>{data.length > 0 && `Média Ping: ${Math.round(data.reduce((acc, curr) => acc + curr.ping, 0) / data.length)} ms | Jitter: ${Math.round(data.reduce((acc, curr) => acc + curr.jitter, 0) / data.length)} ms`}</Text>
                        </Box>
                    </Box>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={data}
                            margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid opacity={"20%"} />

                            <Legend />
                            <Tooltip
                                labelFormatter={(label) => new Date(label).toLocaleString()}
                                formatter={(value, name) => [`${value} ms`, name]}
                            />
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
                </Box>
            )}
        </Box>
    );
};

export default PingJitterChart;
