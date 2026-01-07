import { Box, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import Sidebar from "./layout/Sidebar";
import ThreeBackground from "./components/ThreeBackground";
import Home from "./pages/Home";
import ChatWidget from "./components/ChatWidget";
import AuthModal from "./components/AuthModal";
import { Routes, Route } from 'react-router-dom';
import UserProfile from './pages/UserProfile';
import ServicePartnerProfile from './pages/ServicePartnerProfile';
import { useUser } from './context/UserContext'; 

function App() {
  const { isOpen: isAuthOpen, onOpen: onAuthOpen, onClose: onAuthClose } = useDisclosure();
  const [authProps, setAuthProps] = useState({ step: 1, role: '' });
  
  const { user, login, logout } = useUser();

  // 1. Function to open modal specifically for Garage Registration (From Home Page)
  const triggerGarageReg = () => {
    setAuthProps({ step: 2, role: 'service' });
    onAuthOpen();
  };

  // 2. Function to open modal for standard Sign In (From Sidebar)
  const triggerStandardAuth = () => {
    setAuthProps({ step: 1, role: '' });
    onAuthOpen();
  };

  const handleLoginSuccess = (userData) => login(userData);

  return (
    <Box minH="100vh" w="100vw" bg="black" position="relative">
      
      {/* Background */}
      <Box position="fixed" top="0" left="0" w="100%" h="100%" zIndex="0">
        <ThreeBackground />
      </Box>

      {/* Sidebar */}
      <Sidebar 
        onLogout={logout} 
        onAuthOpen={triggerStandardAuth} 
      />

      {/* Routes & Pages */}
      <Box position="relative" zIndex="10" w="100%">
        <Routes>
          {/* Pass the Garage Trigger to Home */}
          <Route path="/" element={<Home onRegisterGarageClick={triggerGarageReg} />} />
          <Route path="/profile/user" element={<UserProfile />} />
          <Route path="/profile/service" element={<ServicePartnerProfile />} />
        </Routes>
      </Box>

      {/* Widgets */}
      <ChatWidget />

      {/* Global Auth Modal */}
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