import { Box, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import Sidebar from "./layout/Sidebar";
import ThreeBackground from "./components/ThreeBackground";
import Home from "./pages/Home";
import ChatWidget from "./components/ChatWidget";
import AuthModal from "./components/AuthModal";

function App() {
  // Centralized Auth Modal Disclosure
  const { isOpen: isAuthOpen, onOpen: onAuthOpen, onClose: onAuthClose } = useDisclosure();
  const [authProps, setAuthProps] = useState({ step: 1, role: '' });
  const [user, setUser] = useState(null);

  // Logic to jump straight to Service Partner registration
  const triggerGarageReg = () => {
    setAuthProps({ step: 2, role: 'service' });
    onAuthOpen();
  };

  // Logic for standard Login/Signup button
  const triggerStandardAuth = () => {
    setAuthProps({ step: 1, role: '' });
    onAuthOpen();
  };

  const handleLoginSuccess = (userData) => setUser(userData);
  const handleLogout = () => setUser(null);

  return (
    <Box minH="100vh" w="100vw" bg="black" position="relative">
      
      {/* 1. Background (Fixed) */}
      <Box position="fixed" top="0" left="0" w="100%" h="100%" zIndex="0">
        <ThreeBackground />
      </Box>

      {/* 2. Unified Sidebar */}
      <Sidebar 
        user={user} 
        onLogout={handleLogout} 
        onAuthOpen={triggerStandardAuth} 
      />

      {/* 3. Main Content */}
      <Box position="relative" zIndex="10" w="100%">
        <Home onRegisterGarageClick={triggerGarageReg} />
      </Box>

      {/* 4. Chatbot Widget */}
      <ChatWidget />

      {/* 5. Auth Modal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={onAuthClose} 
        onLoginSuccess={handleLoginSuccess}
        initialStep={authProps.step}
        initialRole={authProps.role}
      />
    </Box>
  );
}

export default App;