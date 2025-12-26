import { Box } from "@chakra-ui/react";
import Sidebar from "./layout/Sidebar";
import MobileNav from "./layout/MobileNav";
import ThreeBackground from "./components/ThreeBackground";
import Home from "./pages/Home";

function App() {
  return (
    <Box minH="100vh" w="100vw" bg="black" position="relative">
      
      {/* 1. Background (Fixed to viewport) */}
      <Box position="fixed" top="0" left="0" w="100%" h="100%" zIndex="0">
        <ThreeBackground />
      </Box>

      {/* 2. Sidebar (Fixed to left) */}
      <Box 
        display={{ base: "none", md: "block" }} 
        position="fixed" 
        top="0" 
        left="0" 
        h="100vh" 
        zIndex="50"
      >
        <Sidebar />
      </Box>

      {/* 3. Mobile Nav (Fixed to top) */}
      <Box position="relative" zIndex="50">
        <MobileNav />
      </Box>

      {/* 4. Main Content (Flows naturally with native scroll) */}
      <Box 
        ml={{ base: 0, md: "80px" }} // Push content right to make room for sidebar
        position="relative" 
        zIndex="10" 
        // No overflow-y hidden here! We let the window scroll.
      >
        <Home />
      </Box>
      
    </Box>
  );
}

export default App;