import { Box } from "@chakra-ui/react";
import Footer from "./components/general/footer";
import GridContainer from "./components/general/grid";
import IPInfo from "./components/cards/ipinfo";
import Navbar from "./components/general/navbar";
import RequestInfo from "./components/cards/requestInfo";
// import PingJitterGraph from "./components/cards/pingjittergraph";
import Logo from "./components/general/logo";
import TesteCard from "./components/cards/testeCard";

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
          <TesteCard />
        </GridContainer>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}

export default App;
