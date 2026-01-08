import React, { useState } from "react";
import {
  Box, VStack, HStack, Text, Avatar, Button, Input, FormControl, FormLabel,
  SimpleGrid, Checkbox, Card, CardHeader, CardBody, Badge, Stat, StatLabel, StatNumber, StatHelpText, Icon
} from "@chakra-ui/react";
import { FaEdit, FaSave, FaTools, FaLock } from "react-icons/fa";
import { useUser } from "../context/UserContext";

// Accept onAuthOpen prop
const ServicePartnerProfile = ({ onAuthOpen }) => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [sameAsOwner, setSameAsOwner] = useState(false);

  const [profileData, setProfileData] = useState({
    ownerName: user?.name || "",
    stationName: "My Auto Garage",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.locality || "",
    city: user?.state || "", 
    registeredSince: "2024",
    totalVisits: 142
  });

  const handleCheckbox = (e) => {
    setSameAsOwner(e.target.checked);
    if(e.target.checked) {
      setProfileData(prev => ({...prev, stationName: prev.ownerName + "'s Station"}));
    }
  };

  // --- RESTRICTED ACCESS VIEW ---
  if (!user) {
    return (
      <Box 
        h="100vh" 
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        px={4}
        backdropFilter="blur(12px)" // Blurs the background stars
        bg="rgba(0, 0, 0, 0.4)"
      >
        <Box 
          p={10} 
          maxW="md" 
          w="full"
          textAlign="center"
          bg="linear-gradient(145deg, #0f172a 0%, #1e293b 100%)"
          backdropFilter="blur(20px)"
          border="1px solid"
          borderColor="rgba(100, 200, 255, 0.15)"
          borderRadius="3xl"
          boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.8)"
        >
          <VStack spacing={6}>
            <Box 
              p={5} 
              bg="rgba(59, 130, 246, 0.1)" 
              borderRadius="full" 
              border="1px solid"
              borderColor="cyan.500"
              color="cyan.400"
            >
              <Icon as={FaLock} boxSize={8} />
            </Box>
            
            <VStack spacing={2}>
              <Text fontSize="2xl" fontWeight="800" color="white" letterSpacing="tight">
                Access Restricted
              </Text>
              
              {/* INTERACTIVE TEXT LINKS */}
              <Text color="gray.400" fontSize="md">
                Please{' '}
                <Button 
                  variant="link" 
                  color="cyan.400" 
                  fontWeight="bold" 
                  verticalAlign="baseline"
                  onClick={() => onAuthOpen(false)} // Trigger Register
                >
                  Register
                </Button>
                {' '}or{' '}
                <Button 
                  variant="link" 
                  color="cyan.400" 
                  fontWeight="bold"
                  verticalAlign="baseline"
                  onClick={() => onAuthOpen(true)} // Trigger Login
                >
                  Login
                </Button>
                {' '}to view and manage your dashboard.
              </Text>
            </VStack>
          </VStack>
        </Box>
      </Box>
    );
  }

  // --- NORMAL DASHBOARD CONTENT ---
  return (
    <Box pt={24} pb={10} px={6} maxW="container.xl" mx="auto" color="white">
      {/* 1. DASHBOARD HEADER */}
      <Card bg="linear-gradient(135deg, rgba(6, 11, 25, 0.95) 0%, rgba(10, 25, 41, 0.9) 100%)" border="1px solid cyan">
        <CardBody>
          <HStack spacing={6} align="center">
            <Avatar size="2xl" icon={<FaTools fontSize="3rem" />} bg="cyan.600" />
            <VStack align="start" flex={1}>
              <Text fontSize="3xl" fontWeight="900" color="cyan.300">{profileData.stationName}</Text>
              <Text fontSize="lg">Owner: {profileData.ownerName}</Text>
              <Badge colorScheme="purple" fontSize="0.8em">Premium Partner</Badge>
            </VStack>
            <Button 
              leftIcon={isEditing ? <FaSave /> : <FaEdit />} 
              colorScheme="cyan" 
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Save Profile" : "Edit Details"}
            </Button>
          </HStack>
        </CardBody>
      </Card>

      {/* 2. STATS ROW */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mt={8}>
        <Card bg="whiteAlpha.100"><CardBody><Stat><StatLabel>Total Visits</StatLabel><StatNumber color="cyan.400">{profileData.totalVisits}</StatNumber><StatHelpText>All time clients</StatHelpText></Stat></CardBody></Card>
        <Card bg="whiteAlpha.100"><CardBody><Stat><StatLabel>Rating</StatLabel><StatNumber color="yellow.400">4.8 / 5.0</StatNumber><StatHelpText>Based on 56 reviews</StatHelpText></Stat></CardBody></Card>
        <Card bg="whiteAlpha.100"><CardBody><Stat><StatLabel>Inventory Status</StatLabel><StatNumber color="green.400">Healthy</StatNumber><StatHelpText>Last sync: 2 hours ago</StatHelpText></Stat></CardBody></Card>
      </SimpleGrid>

      {/* 3. DETAILS FORM */}
      <Card mt={8} bg="rgba(255,255,255,0.03)" borderColor="whiteAlpha.200">
        <CardHeader borderBottom="1px solid gray" pb={4}>
          <Text fontSize="xl" fontWeight="bold">Station Configuration</Text>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl>
              <FormLabel color="cyan.300">Owner Name</FormLabel>
              <Input value={profileData.ownerName} isReadOnly bg="whiteAlpha.100" border="none" />
            </FormControl>
            <VStack align="start" spacing={0}>
              <FormControl>
                <FormLabel color="cyan.300">Service Station Name</FormLabel>
                <Input 
                  value={profileData.stationName} 
                  isReadOnly={!isEditing} 
                  onChange={(e) => setProfileData({...profileData, stationName: e.target.value})}
                  bg="whiteAlpha.100" border="none" 
                />
              </FormControl>
              {isEditing && (
                <Checkbox size="sm" colorScheme="cyan" mt={2} isChecked={sameAsOwner} onChange={handleCheckbox}>
                  <Text fontSize="xs" color="gray.400">Use Owner Name as Station Name</Text>
                </Checkbox>
              )}
            </VStack>
            <FormControl>
              <FormLabel color="cyan.300">Contact Number</FormLabel>
              <Input value={profileData.phone} isReadOnly bg="whiteAlpha.100" border="none" />
            </FormControl>
            <FormControl>
              <FormLabel color="cyan.300">Station Address</FormLabel>
              <Input value={`${profileData.address}, ${profileData.city}`} isReadOnly={!isEditing} bg="whiteAlpha.100" border="none" />
            </FormControl>
          </SimpleGrid>
        </CardBody>
      </Card>
    </Box>
  );
};

export default ServicePartnerProfile;