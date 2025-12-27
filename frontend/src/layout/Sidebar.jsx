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
} from '@chakra-ui/react';
import { FaBars, FaHome, FaSearch, FaWrench, FaUserCircle, FaCog, FaSignInAlt } from 'react-icons/fa';

const Sidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  const navItems = [
    { icon: FaHome, label: "Home" },
    { icon: FaSearch, label: "Find Services" },
    { icon: FaWrench, label: "My Garage" },
    { icon: FaUserCircle, label: "Profile" },
    { icon: FaCog, label: "Settings" },
  ];

  // Smooth custom transition curve
  const smoothTransition = "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)";

  return (
    <>
      {/* 1. HAMBURGER TRIGGER (Minimalist) */}
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

      {/* 2. THE DRAWER */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
        blockScrollOnMount={false} 
      >
        {/* Soft Dark Overlay */}
        <DrawerOverlay 
          backdropFilter="blur(8px)" 
          bg="rgba(0,0,0,0.4)" 
          transition={smoothTransition}
        />

        <DrawerContent 
          // Glassmorphism Background
          bg="rgba(15, 15, 15, 0.85)" 
          backdropFilter="blur(24px)"
          boxShadow="0 0 40px rgba(0,0,0,0.5)"
          borderRight="1px solid rgba(255,255,255,0.05)"
          maxW={{ base: "100vw", md: "320px" }} 
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
            css={{
              '&::-webkit-scrollbar': { display: 'none' }, 
            }}
          >
            
            {/* BRAND HEADER (Minimal) */}
            <Stack spacing={2} mb={12} px={10}>
              <Text 
                fontSize="2xl" 
                fontWeight="700" 
                color="white"
                letterSpacing="-0.5px"
              >
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
                      <Icon 
                        as={item.icon} 
                        color="whiteAlpha.500" 
                        boxSize={4} 
                        mr={4} 
                        transition={smoothTransition}
                      />
                    }
                    _hover={{ 
                      bg: "whiteAlpha.100", 
                      color: "white",
                      paddingLeft: "46px", 
                      '& svg': { color: "#0BC5EA" } 
                    }}
                    _active={{ bg: "whiteAlpha.200" }}
                    transition={smoothTransition}
                    onClick={onClose}
                  >
                    {item.label}
                  </Button>
                  {/* Ultra-subtle divider */}
                  <Divider borderColor="whiteAlpha.50" />
                </Box>
              ))}
            </VStack>

            {/* FOOTER AREA - FIXED */}
            <Box px={10} mt="auto" mb={8}>
              <Button 
                variant="outline" 
                colorScheme="whiteAlpha"
                color="white"
                borderColor="whiteAlpha.300"
                width="full" 
                h="50px"
                fontSize="sm"
                fontWeight="500"
                leftIcon={<FaSignInAlt />}
                _hover={{ 
                  bg: "white", 
                  color: "black", 
                  borderColor: "white" 
                }}
                transition={smoothTransition}
              >
                Sign In / Sign Up
              </Button>
            </Box>

          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;