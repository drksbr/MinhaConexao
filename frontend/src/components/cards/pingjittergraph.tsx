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
import { RefreshCcw } from 'lucide-react';
import {
    LineChart,
    Line,
    ResponsiveContainer,
    Legend,
    Tooltip
} from 'recharts';
import usePing from '@/hooks/usePing';

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
    const { ping, jitter } = usePing(`${window.location.origin.replace(/^http/, 'ws')}/wsping`, 500, 30);

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
            _hover={{ boxShadow: 'xl', transform: 'scale(1.05)' }}
            transition="0.3s"
            maxW="full"
            minH="400px"
        >
            {/* Header do card com título e botão de refresh */}
            <Flex justifyContent="space-between" alignItems="center" mb={2}>
                <Heading size="lg">Ping e Jitter</Heading>
                <IconButton
                    aria-label="Refresh"
                    icon={<RefreshCcw />}
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
                <Box>
                    <Box mb={5}>
                        <Flex direction={{ base: 'column', md: 'row' }} gap={5} justifyContent="center">
                            <Text fontSize='sm'>
                                {data.length > 0 && `Ping: ${data[data.length - 1].ping} ms | Jitter: ${data[data.length - 1].jitter} ms`}
                            </Text>
                            <Text fontSize='sm'>
                                {/* Média de ping e jitter */}
                                {data.length > 0 && `Média Ping/Jitter: ${Math.round(data.reduce((acc, curr) => acc + curr.ping, 0) / data.length)} ms / ${Math.round(data.reduce((acc, curr) => acc + curr.jitter, 0) / data.length)} ms`}
                            </Text>
                        </Flex>
                    </Box>
                    <ResponsiveContainer width="100%" height={300}>
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
                </Box>
            )}
        </Box>
    );
};

export default PingJitterChart;
