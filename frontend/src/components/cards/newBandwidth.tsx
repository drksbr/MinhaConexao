import {
    Box,
    Flex,
    Text,
    IconButton,
    Divider,
    Grid,
    Heading,
    useColorModeValue,
    Spacer,
} from '@chakra-ui/react';
import { Share2Icon, RefreshCcw, RotateCwIcon, Settings } from 'lucide-react';
import useShare from '@/hooks/useShare';
import { useSpeedTest } from '@/hooks/useBtest2';

const SpeedTestCard: React.FC = () => {
    const {
        startTest,
        results,
        isTesting,
        realTimeData,
        downloadBytesTransferred,
        uploadBytesTransferred,
    } = useSpeedTest({
        baseUrls: [
            'https://mc-srv1.provedorveloz.com.br',
            'https://mc-srv2.provedorveloz.com.br',
        ], // Substitua pelas suas URLs
        testDuration: 10, // Duração do teste em segundos
        numberOfConnections: 8, // Número de conexões simultâneas
        correctionCoefficient: 1.04, // Coeficiente de correção ajustado
    });

    // Referência do card para captura de tela
    const { ref, share } = useShare();

    const refreshFunction = () => {
        startTest(); // Inicia o teste
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
            <Flex justifyContent="space-between" alignItems="center" mb={5}>
                <Heading size="md">Teste de Velocidade</Heading>

                {/* Botões */}
                <Box alignContent="end">
                    <IconButton
                        aria-label="Share"
                        icon={<Share2Icon size={18} />}
                        onClick={share}
                        size="sm"
                        variant="ghost"
                    />
                    <IconButton
                        aria-label="Refresh"
                        icon={<RefreshCcw size={18} />}
                        onClick={refreshFunction}
                        size="sm"
                        variant="ghost"
                    />
                </Box>
            </Flex>

            {/* Conteúdo do card */}
            <Flex justify="center" align="center" direction="row">
                <Text fontSize="9xl" fontWeight="bold">
                    {isTesting
                        ? Math.round(realTimeData.currentDownloadSpeed)
                        : results
                            ? Math.round(results.downloadSpeed)
                            : 0}
                </Text>
                <Flex direction="column" ml={4}>
                    <Text fontSize="3xl" fontWeight="medium">
                        Mbps
                    </Text>
                    <IconButton
                        aria-label="Repetir teste"
                        icon={<RotateCwIcon />}
                        onClick={refreshFunction}
                        mt={2}
                        rounded={'full'}
                        colorScheme="green"
                    />
                </Flex>
            </Flex>

            {/* Latência e Upload */}
            <Grid templateColumns="repeat(2, 1fr)" gap={5} mt={4}>
                <Box>
                    <Text fontWeight="bold">Latência</Text>
                    <Divider />
                    <Flex justify="space-between" align="center">
                        <Box>
                            <Text fontSize="sm" fontWeight="medium">
                                Ping
                            </Text>
                            <Text fontSize="3xl" fontWeight="bold">
                                {results ? Math.round(results.ping) : 0}{' '}
                                <Text as="span" fontSize="sm">
                                    ms
                                </Text>
                            </Text>
                        </Box>
                        <Box>
                            <Text fontSize="sm" fontWeight="medium">
                                Jitter
                            </Text>
                            <Text fontSize="3xl" fontWeight="bold">
                                {results ? Math.round(results.jitter) : 0}{' '}
                                <Text as="span" fontSize="sm">
                                    ms
                                </Text>
                            </Text>
                        </Box>
                    </Flex>
                </Box>

                <Box>
                    <Text fontWeight="bold">Upload</Text>
                    <Divider />
                    <Text fontSize="sm" fontWeight="medium">
                        Velocidade de Upload
                    </Text>
                    <Text fontSize="3xl" fontWeight="bold">
                        {isTesting
                            ? Math.round(realTimeData.currentUploadSpeed)
                            : results
                                ? Math.round(results.uploadSpeed)
                                : 0}{' '}
                        <Text as="span" fontSize="sm">
                            Mbps
                        </Text>
                    </Text>
                </Box>
            </Grid>

            <Divider />

            {/* Configurações de Download/Upload */}
            <Flex justify="space-between" align="center" mt={4}>
                <IconButton
                    aria-label="Repetir teste"
                    icon={<Settings />}
                    onClick={() => alert('Configurações')}
                />
                <Spacer />
                <Box mr={2}>
                    <Text fontWeight="medium" fontSize="md">
                        Uso de Dados:
                    </Text>
                </Box>
                <Box mr={2}>
                    <Text fontWeight="medium" fontSize="md">
                        {(
                            (downloadBytesTransferred.current || 0) /
                            (1024 * 1024)
                        ).toFixed(2)}
                        MB{' '}
                        <Text as="span" fontSize="md">
                            ↓
                        </Text>
                    </Text>
                </Box>
                <Box>
                    <Text fontWeight="medium" fontSize="md">
                        {(
                            (uploadBytesTransferred.current || 0) /
                            (1024 * 1024)
                        ).toFixed(2)}
                        MB{' '}
                        <Text as="span" fontSize="md">
                            ↑
                        </Text>
                    </Text>
                </Box>
            </Flex>
        </Box>
    );
};

export default SpeedTestCard;
