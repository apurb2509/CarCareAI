import React from 'react';
import { VStack, Icon, Tooltip, Box, Text } from '@chakra-ui/react';
import { FaHome, FaSearch, FaWrench, FaUserCircle, FaCog } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const Sidebar = () => {
  const navItems = [
    { icon: FaHome, label: "Home" },
    { icon: FaSearch, label: "Find Services" }, // Core feature: Search
    { icon: FaWrench, label: "My Garage" },
    { icon: FaUserCircle, label: "Profile" },
    { icon: FaCog, label: "Settings" },
  ];

  return (
    <VStack
      pos="fixed"
      left="0"
      h="100vh"
      w="80px"
      bg="rgba(20, 20, 20, 0.6)" // Glassmorphism background
      backdropFilter="blur(10px)"
      borderRight="1px solid rgba(255, 255, 255, 0.1)"
      py={8}
      spacing={8}
      zIndex={100}
    >
      {/* Brand Icon */}
      <Text fontSize="2xl" fontWeight="bold" bgGradient="linear(to-b, cyan.400, purple.500)" bgClip="text" mb={4}>
        CC
      </Text>

      {/* Navigation Icons */}
      {navItems.map((item, index) => (
        <Tooltip key={index} label={item.label} placement="right" hasArrow bg="gray.700">
          <MotionBox
            whileHover={{ scale: 1.2, color: "#0BC5EA" }} // Cyan hover effect
            whileTap={{ scale: 0.9 }}
            cursor="pointer"
            color="gray.400"
          >
            <Icon as={item.icon} w={6} h={6} />
          </MotionBox>
        </Tooltip>
      ))}
    </VStack>
  );
};

export default Sidebar;