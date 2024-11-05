import { Box } from "@chakra-ui/react";
import Footer from "@/components/general/footer";
import GridContainer from "@/components/general/grid";
import { lazy, Suspense } from "react";

const IPInfo = lazy(() => import("@/components/cards/ipinfo"));
const Navbar = lazy(() => import("@/components/general/navbar"));
const RequestInfo = lazy(() => import("@/components/cards/requestInfo"));
const Logo = lazy(() => import("@/components/general/logo"));
const PingJitterChart = lazy(() => import("@/components/cards/pingjittergraph"));
const SpeedTestCard = lazy(() => import("@/components/cards/newBandwidth"));


// Componente principal
function App() {

  console.dir(`                                                                                                                   
           ███      ███  ▒▒▒▒▒▒▒▒▒▒▒     ▒▒▒▒▒▒▒▒▒▒▒                                                               
          ▓█▒█▓    ██▓██  ▒▒░      ▒▒   ▒▒▒      ▒▒                                           ▓░▒▓                 
         ██░  █▓  ▓██  ██  ▒▒       ▒▒ ▒▒▒      ▒▒        ▒███░  ▒███▓   █     █   ██  ░███▓  ▓███░  ▒████  ▓███░  
        ██░    ██  ▓    ██  ▒▒       ▒▒▒▒      ▒▒░        █▒    ▒█   ▓▓  █     █   ██  █     ██   █  ██     █░     
       ▓█▒      ██       ██  ▒▒       ▒▒      ▒▒░          ░██  ██   ▓█  █     █   ██ ░█     █▓   █░ █████   ▒██   
      ▓█▒      ███▓       ██  ▒▒    ░  ▒▒    ▒▒░             ▓█ ░█   █▒  █     █▓  █▒  █░    ██   █  ██        ▓█  
     ▓█▒      ███░██       ██  ▒▒  ▒▒░  ▒▒  ░▒▒           ▒▒▓▒    ▒▓▒    ▒▓▓▒▒  ▒▓▒░    ▒█▓▒  ░▒▓▒    ▒▓▓▒  ▒▓▓▒   
    ▒██░░░░░░██▓  ░██░░░░░░▒██  ▒▒▒▒▒    ▒▒▒▒▒                                            █                        
   ░▓▓▓▓▓▓▓▓▓▓▒     ▓▓▓▓▓▓▓▓▓▓▓  ▒▒▒      ▒▒░                                                                      
   We love dev ❤️
   By Isaac Diniz | @drksbr (github)
   `);

  return (
    <Box display="flex" flexDirection="column" minH="100vh">
      {/* Navbar */}
      <Navbar />

      {/* Conteúdo principal */}
      <Box>
        {/* Adiciona a logmarca centralizada e com espaçamento inferior */}
        <Box textAlign="center">
          <Logo className="md:w-1/5 w-3/4 mx-auto" />
        </Box>

        {/* Grid Container centralizado */}
        <GridContainer>
          {/* Suspense */}
          <Suspense fallback={<p>Carregando...</p>}>
            <IPInfo />
            <RequestInfo />
            <PingJitterChart />
            <SpeedTestCard />
          </Suspense>
        </GridContainer>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}

export default App;
