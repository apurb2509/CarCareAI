import { Box } from "@chakra-ui/react";
import Sidebar from "./layout/Sidebar";
// We removed MobileNav import because Sidebar now handles everything
import ThreeBackground from "./components/ThreeBackground";
import Home from "./pages/Home";
import ChatWidget from "./components/ChatWidget"; // <--- 1. Import ChatWidget

function App() {
  return (
    <Box minH="100vh" w="100vw" bg="black" position="relative">
      
      {/* 1. Background (Fixed) */}
      <Box position="fixed" top="0" left="0" w="100%" h="100%" zIndex="0">
        <ThreeBackground />
      </Box>

      {/* 2. Unified Sidebar (Hamburger + Drawer) */}
      <Sidebar />

      {/* 3. Main Content */}
      <Box 
        position="relative" 
        zIndex="10" 
        w="100%"
        // REMOVED ml="80px" -> Content is now centered/full width by default
        // The sidebar will overlay on top of this when opened
      >
        <Home />
      </Box>
      
      {/* 4. Chat Widget */}
      {/* The component handles its own fixed positioning (bottom-right) */}
      <ChatWidget /> 

    </Box>
  );
}

export default App;