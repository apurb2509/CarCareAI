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
  
  // 1. ADD 'isLogin' to state (default false)
  const [authProps, setAuthProps] = useState({ step: 1, role: '', isLogin: false });
  
  const { user, login, logout } = useUser();

  // 1. Function to open modal specifically for Garage Registration (From Home Page)
  const triggerGarageReg = () => {
    // Explicitly set isLogin to false for registration
    setAuthProps({ step: 2, role: 'service', isLogin: false });
    onAuthOpen();
  };

  // 2. Function to open modal for standard Auth (From Sidebar)
  // Accepts 'loginMode' boolean. If true, opens Sign In. If false, opens Register.
  const triggerStandardAuth = (loginMode = false) => {
    setAuthProps({ step: 1, role: '', isLogin: loginMode });
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
        onAuthOpen={triggerStandardAuth} // This function now handles the argument
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
        initialLogin={authProps.isLogin} // 3. Pass the login state to the modal
      />
    </Box>
  );
}

export default App;