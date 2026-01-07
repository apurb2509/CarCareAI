import React, { useRef } from 'react';
import {
  Box,
  VStack,
  Text,
  Icon,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  IconButton,
  Button,
  Stack,
  Divider,
  Avatar,
  HStack,
} from '@chakra-ui/react';
import { FaBars, FaSearch, FaWrench, FaUserCircle, FaCog, FaSignInAlt, FaSignOutAlt, FaPhone, FaCalendarCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Sidebar = ({ onAuthOpen, onLogout }) => {
  // Primary disclosure for the Sidebar drawer
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const btnRef = useRef();
  const navigate = useNavigate(); 
  const { user } = useUser(); 

  // LOGIC: specific redirect based on role
  const handleProfileClick = () => {
    if (user) {
      if (user.role === 'service') {
        navigate('/profile/service');
      } else {
        navigate('/profile/user');
      }
      onClose(); // Close sidebar after navigation
    } else {
      // If not logged in, close sidebar and open auth modal
      onClose();
      onAuthOpen(); 
    }
  };

  const navItems = [
    { icon: FaUserCircle, label: "Profile", onClick: handleProfileClick },
    { icon: FaWrench, label: "My Garage" },
    { icon: FaSearch, label: "Find Services" },
    { icon: FaCalendarCheck, label: "Book Appointment" },
    { icon: FaPhone, label: "Help Centre" },
    { icon: FaCog, label: "Settings" },
  ];

  const smoothTransition = "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)";

  return (
    <>
      {/* HAMBURGER TRIGGER */}
      <IconButton
        ref={btnRef}
        icon={<FaBars />}
        fontSize="24px" 
        onClick={onOpen}
        variant="unstyled" 
        color="white"
        aria-label="Open Menu"
        position="fixed"
        top={8}
        left={8}
        zIndex={100}
        display="flex"
        alignItems="center"
        justifyContent="center"
        _hover={{ transform: "scale(1.1)", opacity: 0.8 }}
        transition={smoothTransition}
      />

      {/* DRAWER */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
        blockScrollOnMount={false}
        motionPreset="slideInLeft"
      >
        <DrawerOverlay 
          backdropFilter="blur(8px)" 
          bg="rgba(0,0,0,0.4)" 
          transition={smoothTransition}
        />

        <DrawerContent
          bg="rgba(15, 15, 15, 0.85)"
          backdropFilter="blur(24px)"
          boxShadow="0 0 40px rgba(0,0,0,0.5)"
          borderRight="1px solid rgba(255,255,255,0.05)"
          maxW={{ base: "100vw", md: "320px" }}
          motionProps={{
            transition: { duration: 0.6, ease: [0.4, 0.0, 0.6, 1] },
          }}
        >
          <DrawerCloseButton 
            color="whiteAlpha.600" 
            size="lg" 
            mt={6} 
            mr={6} 
            _hover={{ color: "white", bg: "transparent" }}
          />
          
          <DrawerBody 
            py={16} 
            px={0} 
            display="flex" 
            flexDirection="column"
            css={{ '&::-webkit-scrollbar': { display: 'none' } }}
          >
            {/* HEADER */}
            <Stack spacing={2} mb={12} px={10}>
              <Text fontSize="2xl" fontWeight="700" color="white" letterSpacing="-0.5px">
                CarCareAI
              </Text>
              <Text color="whiteAlpha.400" fontSize="11px" fontWeight="600" letterSpacing="1px" textTransform="uppercase">
                Menu
              </Text>
            </Stack>

            {/* NAV ITEMS */}
            <VStack spacing={0} align="stretch" flex="1">
              {navItems.map((item, index) => (
                <Box key={index}>
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    h="64px" 
                    w="100%"
                    fontSize="md"
                    fontWeight="500"
                    color="whiteAlpha.700"
                    rounded="none"
                    pl={10}
                    leftIcon={
                      <Icon as={item.icon} color="whiteAlpha.500" boxSize={4} mr={4} transition={smoothTransition} />
                    }
                    _hover={{ 
                      bg: "whiteAlpha.100", 
                      color: "white",
                      paddingLeft: "46px", 
                      '& svg': { color: "#0BC5EA" } 
                    }}
                    _active={{ bg: "whiteAlpha.200" }}
                    transition={smoothTransition}
                    onClick={item.onClick || onClose} 
                  >
                    {item.label}
                  </Button>
                  <Divider borderColor="whiteAlpha.5" />
                </Box>
              ))}
            </VStack>

            {/* FOOTER AREA */}
            <Box px={10} mt="auto" mb={8}>
              {user ? (
                // LOGGED IN
                <HStack 
                  spacing={4} 
                  p={3} 
                  bg="whiteAlpha.100" 
                  borderRadius="xl" 
                  border="1px solid rgba(255,255,255,0.05)"
                >
                  <Avatar 
                    size="sm" 
                    name={user.name} 
                    bgGradient="linear(to-r, cyan.400, blue.500)" 
                    border="2px solid"
                    borderColor="cyan.200"
                  />
                  <VStack align="start" spacing={0} flex={1}>
                    <Text color="white" fontWeight="bold" fontSize="sm" isTruncated maxW="120px">
                      {user.name}
                    </Text>
                    <Text color="cyan.400" fontSize="10px" textTransform="uppercase" fontWeight="700">
                      {user.role === 'service' ? 'Partner' : 'Member'}
                    </Text>
                  </VStack>
                  <IconButton
                    icon={<FaSignOutAlt />}
                    size="sm"
                    variant="ghost"
                    color="red.400"
                    _hover={{ bg: "whiteAlpha.200", color: "red.300" }}
                    onClick={onLogout}
                    aria-label="Logout"
                  />
                </HStack>
              ) : (
                // LOGGED OUT
                <Button 
                  onClick={() => {
                    onClose();
                    onAuthOpen(); 
                  }}
                  variant="outline" 
                  colorScheme="whiteAlpha"
                  color="white"
                  borderColor="whiteAlpha.300"
                  width="full" 
                  h="50px"
                  fontSize="sm"
                  fontWeight="500"
                  leftIcon={<FaSignInAlt />}
                  _hover={{ bg: "white", color: "black", borderColor: "white" }}
                  transition={smoothTransition}
                >
                  Sign In / Sign Up
                </Button>
              )}
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;