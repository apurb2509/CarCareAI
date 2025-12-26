import { Box, Heading, Text } from "@chakra-ui/react";

function App() {
  return (
    <Box h="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Heading as="h1" size="2xl" bgGradient="linear(to-r, cyan.400, purple.500)" bgClip="text">
        CarCareAI
      </Heading>
      <Text fontSize="xl" mt={4} color="gray.400">
        Premium Vehicle Service Intelligence
      </Text>
    </Box>
  );
}

export default App;