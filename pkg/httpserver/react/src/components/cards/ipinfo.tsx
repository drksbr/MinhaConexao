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
    Image,
    Link,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import { useQuery } from '@tanstack/react-query';

interface IPInfoData {
    ip: string;
    hostname?: string;
    city: string;
    region: string;
    country: string;
    loc: string;
    org: string;
    timezone: string;
    postal?: string;
}

const IPInfo: React.FC = () => {
    const fetchIPInfo = async (): Promise<IPInfoData> => {
        const response = await fetch('https://ipinfo.io/json'); // Substitua 'YOUR_TOKEN' pelo seu token real, se necessário
        if (!response.ok) {
            throw new Error('Falha na resposta da rede');
        }

        return response.json();
    };

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery<IPInfoData, Error>({
        queryKey: ['ipInfo'],
        queryFn: fetchIPInfo,
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
                <Heading size="lg">Informações IP</Heading>
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
                            <Text>{data.ip}</Text>
                        </GridItem>

                        {/* Linha 2 */}
                        <GridItem borderRight="1px dashed gray" pr={4}>
                            <Text fontWeight="extrabold" textAlign={'right'}>Hostname</Text>
                        </GridItem>
                        <GridItem pl={2}>
                            <Text>{data.hostname || 'N/A'}</Text>
                        </GridItem>

                        {/* Linha 3 */}
                        <GridItem borderRight="1px dashed gray" pr={4}>
                            <Text fontWeight="extrabold" textAlign={'right'}>Cidade</Text>
                        </GridItem>
                        <GridItem pl={2}>
                            <Text>{data.city}</Text>
                        </GridItem>

                        {/* Linha 4 */}
                        <GridItem borderRight="1px dashed gray" pr={4}>
                            <Text fontWeight="extrabold" textAlign={'right'}>Região</Text>
                        </GridItem>
                        <GridItem pl={2}>
                            <Text>{data.region}</Text>
                        </GridItem>

                        {/* Linha 5 */}
                        <GridItem borderRight="1px dashed gray" pr={4}>
                            <Text fontWeight="extrabold" textAlign={'right'}>País</Text>
                        </GridItem>
                        <GridItem pl={2}>
                            <Flex alignItems="center">
                                <Text mr={1}>{data.country}</Text>
                                <Image width={'5'} src={`https://flagcdn.com/32x24/${data.country.toLocaleLowerCase()}.png`} alt={data.country} />
                            </Flex>
                        </GridItem>

                        {/* Linha 6 */}
                        <GridItem borderRight="1px dashed gray" pr={4}>
                            <Text fontWeight="extrabold" textAlign={'right'}>Localização</Text>
                        </GridItem>
                        <GridItem pl={2}>
                            <Flex alignItems="center">
                                <Text color={'blue.300'} mr={1}>{data.loc}</Text>
                                <Link
                                    href={`https://www.google.com/maps/search/?api=1&query=${data.loc}`}
                                    isExternal
                                >
                                    <Image width={'5'} src="/img/maps.png" alt="Google Maps" />
                                </Link>
                            </Flex>
                        </GridItem>

                        {/* Linha 7 */}
                        <GridItem borderRight="1px dashed gray" pr={4}>
                            <Text fontWeight="extrabold" textAlign={'right'}>Organização</Text>
                        </GridItem>
                        <GridItem pl={2}>
                            <Text>{data.org}</Text>
                        </GridItem>

                        {/* Linha 8 */}
                        <GridItem borderRight="1px dashed gray" pr={4}>
                            <Text fontWeight="extrabold" textAlign={'right'}>Timezone</Text>
                        </GridItem>
                        <GridItem pl={2}>
                            <Text>{data.timezone}</Text>
                        </GridItem>

                        {/* Linha 9 */}
                        <GridItem borderRight="1px dashed gray" pr={4}>
                            <Text fontWeight="extrabold" textAlign={'right'}>Postal</Text>
                        </GridItem>
                        <GridItem pl={2}>
                            <Text>{data.postal || 'N/A'}</Text>
                        </GridItem>
                    </Grid>
                </Box>
            ) : null}
        </Box>
    );
};

export default IPInfo;
