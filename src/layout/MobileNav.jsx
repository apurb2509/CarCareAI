import React from 'react';
import { 
  Box, IconButton, Drawer, DrawerBody, DrawerOverlay, DrawerContent, 
  DrawerCloseButton, VStack, Text, Icon, useDisclosure 
} from '@chakra-ui/react';
import { FaBars, FaHome, FaSearch, FaWrench, FaUserCircle, FaCog } from 'react-icons/fa';

const MobileNav = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const navItems = [
    { icon: FaHome, label: "Home" },
    { icon: FaSearch, label: "Find Services" },
    { icon: FaWrench, label: "My Garage" },
    { icon: FaUserCircle, label: "Profile" },
    { icon: FaCog, label: "Settings" },
  ];

  return (
    <>
      {/* Hamburger Button (Visible only on Mobile) */}
      <Box 
        display={{ base: "block", md: "none" }} 
        position="fixed" 
        top={4} 
        left={4} 
        zIndex={200}
      >
        <IconButton
          icon={<FaBars />}
          variant="outline"
          colorScheme="cyan"
          onClick={onOpen}
          aria-label="Open Menu"
          bg="rgba(0,0,0,0.6)"
        />
      </Box>

      {/* Drawer Menu */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay backdropFilter="blur(5px)" />
        <DrawerContent bg="#0a0a0a" borderRight="1px solid rgba(255,255,255,0.1)">
          <DrawerCloseButton color="white" />
          <DrawerBody py={10}>
             <VStack spacing={8} align="start">
                <Text fontSize="2xl" fontWeight="bold" bgGradient="linear(to-r, cyan.400, purple.500)" bgClip="text">
                  CarCareAI
                </Text>
                {navItems.map((item, index) => (
                  <Box key={index} display="flex" alignItems="center" color="gray.300" fontSize="xl" onClick={onClose}>
                    <Icon as={item.icon} mr={4} color="cyan.500" />
                    <Text>{item.label}</Text>
                  </Box>
                ))}
             </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MobileNav;