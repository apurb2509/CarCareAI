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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const navigate = useNavigate(); 
  const { user } = useUser(); 

  const handleProfileClick = () => {
    if (user) {
      // Logged In: Route based on role
      if (user.role === 'service') {
        navigate('/profile/service');
      } else {
        navigate('/profile/user');
      }
    } else {
      // Not Logged In: Navigate to User Profile anyway to show the "Restricted" card
      navigate('/profile/user');
    }
    onClose();
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

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
        blockScrollOnMount={false}
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
            transition: { duration: 0.4, ease: [0.25, 0.8, 0.25, 1] },
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
            py={8} 
            px={0} 
            display="flex" 
            flexDirection="column"
            css={{ '&::-webkit-scrollbar': { display: 'none' } }}
          >
            <Stack spacing={2} mb={8} px={10}>
              <Text fontSize="2xl" fontWeight="700" color="white" letterSpacing="-0.5px">
                CarCareAI
              </Text>
              <Text color="whiteAlpha.400" fontSize="11px" fontWeight="600" letterSpacing="1px" textTransform="uppercase">
                Menu
              </Text>
            </Stack>

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

            <Box px={10} mt="auto" mb={6}>
              {user ? (
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
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    aria-label="Logout"
                  />
                </HStack>
              ) : (
                <VStack spacing={1.5} w="full">
                  <Button 
                    onClick={() => {
                      onClose();
                      onAuthOpen(false); 
                    }}
                    variant="outline" 
                    colorScheme="whiteAlpha"
                    color="cyan"
                    borderColor="whiteAlpha.500"
                    width="full" 
                    h="50px"
                    fontSize="sm"
                    fontWeight="500"
                    leftIcon={<FaSignInAlt />}
                    _hover={{ bg: "cyan.400", color: "black", borderColor: "white" }}
                    transition={smoothTransition}
                  >
                    Register here
                  </Button>

                  <HStack spacing={1} justify="center" w="full">
                    <Text fontSize="xs" color="gray.500" fontWeight="500">
                      Already have an account?
                    </Text>
                    <Button 
                      variant="link" 
                      color="blue.400" 
                      fontSize="xs" 
                      fontWeight="600"
                      _hover={{ color: "blue.300" }}
                      onClick={() => {
                        onClose(); 
                        onAuthOpen(true);
                      }}
                    >
                      Sign In
                    </Button>
                  </HStack>
                </VStack>
              )}
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;