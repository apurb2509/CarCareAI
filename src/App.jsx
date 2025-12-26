import { Box, Heading, Text, Container } from "@chakra-ui/react";
import Sidebar from "./layout/Sidebar";
import ThreeBackground from "./components/ThreeBackground";

function App() {
  return (
    <Box h="100vh" w="100vw" overflow="hidden" position="relative">
      {/* 1. The 3D Layer (Background) */}
      <ThreeBackground />

      {/* 2. The Sidebar (Navigation) */}
      <Sidebar />

      {/* 3. The Main Content Layer */}
      <Box ml="80px" h="100%" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Container maxW="container.md" centerContent>
          <Heading 
            as="h1" 
            size="4xl" 
            bgGradient="linear(to-r, cyan.400, purple.500)" 
            bgClip="text"
            letterSpacing="tight"
          >
            CarCareAI
          </Heading>
          <Text fontSize="xl" mt={4} color="gray.300" textAlign="center">
            Intelligent Vehicle Service & Diagnostics
          </Text>
        </Container>
      </Box>
    </Box>
  );
}

export default App;