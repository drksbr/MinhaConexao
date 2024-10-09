import { Box } from "@chakra-ui/react";
import Footer from "@/components/general/footer";
import GridContainer from "@/components/general/grid";
import IPInfo from "@/components/cards/ipinfo";
import Navbar from "@/components/general/navbar";
import RequestInfo from "@/components/cards/requestInfo";
import Logo from "@/components/general/logo";
import PingJitterChart from "@/components/cards/pingjittergraph";

function App() {

  return (
    <Box display="flex" flexDirection="column" minH="100vh">
      {/* Navbar */}
      <Navbar />

      {/* Conteúdo principal */}
      <Box flex="1" p={5}>
        {/* Adiciona a logmarca centralizada e com espaçamento inferior */}
        <Box textAlign="center">
          <Logo className="md:w-1/5 w-3/4 mx-auto" />
        </Box>

        {/* Grid Container centralizado */}
        <GridContainer>
          <IPInfo />
          <RequestInfo />
          {/* <PingJitterGraph /> */}
          <PingJitterChart />
        </GridContainer>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}

export default App;
