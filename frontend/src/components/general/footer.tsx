import { Box, Text, useColorModeValue } from '@chakra-ui/react';

const Footer = () => {
    return (
        <Box
            as="footer"
            w="100%"
            py={4}
            textAlign="center"
            bg={useColorModeValue('gray.100', 'gray.900')}
            color={useColorModeValue('gray.600', 'gray.400')}
        >
            <Text fontSize="sm">
                Desenvolvido por MW DevTeam ❤️ © {new Date().getFullYear()}
            </Text>
        </Box>
    );
};
export default Footer;
