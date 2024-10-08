// src/components/IPInfo.tsx
import React from 'react';
import {
    Text,
    Box,
    Flex,
    Heading,
    IconButton,
    useColorModeValue,
    Spinner,
    Grid,
    GridItem,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import { useQuery } from '@tanstack/react-query';


export interface RequestInfoData {
    XRealIP: string;
    XForwardedSourcePort: string;
    Timestamp: Date;
}


const RequestInfo: React.FC = () => {
    const fetchRequestInfo = async (): Promise<RequestInfoData> => {
        const response = await fetch('/requestinfo');
        if (!response.ok) {
            throw new Error('Falha na resposta da rede');
        }
        const data = await response.json();

        return {
            XRealIP: data.XRealIP,
            XForwardedSourcePort: data.XForwardedSourcePort,
            Timestamp: new Date(data.Timestamp),
        };
    };

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery<RequestInfoData, Error>({
        queryKey: ['requestInfo'],
        queryFn: fetchRequestInfo,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });

    const refreshFunction = () => {
        refetch();
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
            minH={"400px"}
        >
            {/* Header do card com título e botão de refresh */}
            <Flex justifyContent="space-between" alignItems="center" mb={5}>
                <Heading size="lg">Requisição HTTP</Heading>
                {/* Botão de Refresh */}
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
                <Flex justifyContent="center" alignItems="center" height="70%">
                    <Spinner size="xl" />
                </Flex>
            ) : isError ? (
                <Text>Erro ao obter as informações: {error.message}</Text>
            ) : data ? (
                <Box>
                    <Grid templateColumns="auto 1fr" gap={3}>
                        {/* Linha 1 */}
                        <GridItem borderRight="1px dashed gray" pr={4}>
                            <Text fontWeight="bold" textAlign={'right'}>IP</Text>
                        </GridItem>
                        <GridItem pl={2}>
                            <Text>{data.XRealIP}</Text>
                        </GridItem>

                        {/* Linha 2 */}
                        <GridItem borderRight="1px dashed gray" pr={4}>
                            <Text fontWeight="extrabold" textAlign={'right'}>Porta de Origem</Text>
                        </GridItem>
                        <GridItem pl={2}>
                            <Text>{data.XForwardedSourcePort || 'N/A'}</Text>
                        </GridItem>

                        {/* Linha 3 */}
                        <GridItem borderRight="1px dashed gray" pr={4}>
                            <Text fontWeight="extrabold" textAlign={'right'}>Data</Text>
                        </GridItem>
                        <GridItem pl={2}>
                            <Text>{data.Timestamp.toDateString()}</Text>
                        </GridItem>

                        {/* Linha 4 */}
                        <GridItem borderRight="1px dashed gray" pr={4}>
                            <Text fontWeight="extrabold" textAlign={'right'}>Hora</Text>
                        </GridItem>
                        <GridItem pl={2}>
                            <Text>{data.Timestamp.toTimeString()}</Text>
                        </GridItem>

                        {/* Linha 5 */}
                        <GridItem borderRight="1px dashed gray" pr={4}>
                            <Text fontWeight="extrabold" textAlign={'right'}>Timestamp</Text>
                        </GridItem>
                        <GridItem pl={2}>
                            <Text>{data.Timestamp.toISOString()}</Text>
                        </GridItem>
                    </Grid>
                </Box>
            ) : null}
        </Box>
    );
};

export default RequestInfo;
