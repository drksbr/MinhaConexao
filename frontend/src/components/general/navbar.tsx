// src/components/Navbar.jsx
import { Box, Flex, Heading, Spacer, useColorMode, IconButton, Text } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from 'lucide-react';

const Navbar = () => {
    const { colorMode, toggleColorMode } = useColorMode();
const BUILDTAG = "v0.0.3-alpha-74";

    return (
        <Box as="nav" p={4} boxShadow="md" bg={colorMode === 'light' ? 'gray.100' : 'gray.900'}>
            <Flex alignItems="center" mx="auto">

                {/* Título do WebApp */}
                <Heading as="h1" size="md">
                    Minha Conexão
                </Heading>

                {/* Espaçador para empurrar o próximo item para a direita */}
                <Spacer />
                <Text fontSize='sm' className='mr-3'>{BUILDTAG}</Text>


                {/* Botão de Toggle de Tema */}
                <IconButton
                    aria-label="Toggle Theme"
                    icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                    onClick={toggleColorMode}
                    isRound
                    size="sm"
                />

            </Flex>
        </Box>
    );
};

export default Navbar;
