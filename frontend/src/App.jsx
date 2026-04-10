import { Box, useDisclosure, useColorMode, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import Sidebar from "./layout/Sidebar";
import ThreeBackground from "./components/ThreeBackground";
import Home from "./pages/Home";
import ChatWidget from "./components/ChatWidget";
import AuthModal from "./components/AuthModal";
import { Routes, Route } from 'react-router-dom';
import UserProfile from './pages/UserProfile';
import ServicePartnerProfile from './pages/ServicePartnerProfile';
import { useUser } from './context/UserContext'; 
import BookAppointment from './pages/BookAppointment'; 
import FindServices from './pages/FindServices';
import HelpCentre from './pages/HelpCentre';
import MyGarage from './pages/MyGarage'; 
import Pricing from './pages/Pricing'; // <-- NEW IMPORT FOR PRICING

function App() {
  const { isOpen: isAuthOpen, onOpen: onAuthOpen, onClose: onAuthClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  
  // 1. ADD 'isLogin' to state (default false)
  const [authProps, setAuthProps] = useState({ step: 1, role: '', isLogin: false });
  
  const { user, login, logout } = useUser();

  // 1. Function to open modal specifically for Garage Registration (From Home Page)
  const triggerGarageReg = () => {
    // Explicitly set isLogin to false for registration
    setAuthProps({ step: 2, role: 'service', isLogin: false });
    onAuthOpen();
  };

  // 2. Function to open modal for standard Auth (From Sidebar or Profile Card)
  // Accepts 'loginMode' boolean. If true, opens Sign In. If false, opens Register.
  const triggerStandardAuth = (loginMode = false) => {
    setAuthProps({ step: 1, role: '', isLogin: loginMode });
    onAuthOpen();
  };

  const handleLoginSuccess = (userData) => login(userData);

  return (
    <Box minH="100vh" w="100%" overflowX="hidden" bg="page-bg" position="relative">
      
      {/* Background */}
      <Box position="fixed" top="0" left="0" w="100%" h="100%" zIndex="0">
        <ThreeBackground colorMode={colorMode} />
      </Box>

      {/* Theme Toggler */}
      <Box position="fixed" top={8} right={8} zIndex={100}>
        <IconButton
          icon={colorMode === 'light' ? <FaMoon color="white" /> : <FaSun color="#EAB308" />}
          onClick={toggleColorMode}
          isRound
          size="lg"
          bg={colorMode === 'light' ? 'gray.800' : 'white'}
          _hover={{ transform: 'scale(1.1) rotate(15deg)', bg: colorMode === 'light' ? 'black' : 'gray.100' }}
          boxShadow="0 4px 15px rgba(0,0,0,0.2)"
          aria-label="Toggle Theme"
        />
      </Box>

      {/* Sidebar */}
      <Sidebar 
        onLogout={logout} 
        onAuthOpen={triggerStandardAuth} // This function now handles the argument
      />

      {/* Routes & Pages */}
      <Box position="relative" zIndex="10" w="100%">
          <Routes>
            <Route path="/" element={<Home onRegisterGarageClick={triggerGarageReg} />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/find-services" element={<FindServices />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/help-centre" element={<HelpCentre />} /> 
            <Route path="/my-garage" element={<MyGarage />} /> {/* <-- NEW ROUTE FOR 3D FEATURE */}
            <Route path="/profile/user" element={<UserProfile onAuthOpen={triggerStandardAuth} />} />
            <Route path="/profile/service" element={<ServicePartnerProfile onAuthOpen={triggerStandardAuth} />} />
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