// src/components/GridContainer.jsx
import React, { ReactNode } from 'react';
import { Grid, Box } from '@chakra-ui/react';

interface GridContainerProps {
    children: ReactNode;
}

const GridContainer: React.FC<GridContainerProps> = ({ children }) => {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            <Grid
                templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(2, 1fr)' }} // Ajusta o número de colunas conforme o tamanho da tela
                gap={6} // Espaçamento entre os cards
                maxW="1200px" // Largura máxima para limitar o tamanho do grid
                w="100%" // Largura total do grid
                p={6}
            >
                {children}
            </Grid>
        </Box>
    );
};

export default GridContainer;
