import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// import { ThemeProvider } from './context/ThemeContext.tsx'
import { ChakraProvider, ColorModeScript, ThemeConfig } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Importações do react-query


const queryClient = new QueryClient();

const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {localStorage.getItem('chakra-ui-color-mode') ? <></> : <>{localStorage.setItem('chakra-ui-color-mode', 'dark')}</>}
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <ColorModeScript initialColorMode={config.initialColorMode} />
        <App />
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
