import React, { useState } from "react";
import {
  Box, VStack, HStack, Text, Avatar, Button, Input, FormControl, FormLabel,
  SimpleGrid, Divider, Badge, Card, CardHeader, CardBody, Select,
  IconButton, Icon
} from "@chakra-ui/react";
import { FaEdit, FaSave, FaCamera, FaLock } from "react-icons/fa";
import { useUser } from "../context/UserContext";

// Accept onAuthOpen prop to trigger the modal
const UserProfile = ({ onAuthOpen }) => {
  const { user } = useUser(); 
  const [isEditing, setIsEditing] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || "User Name",
    email: user?.email || "user@example.com",
    phone: user?.phone || "",
    gender: "",
    dob: "",
    bio: "Car enthusiast and daily commuter.",
    area: user?.locality || "",
    state: user?.state || "",
    pincode: user?.pincode || ""
  });

  const serviceHistory = [
    { id: 1, station: "Speedy Fix Garage", date: "2025-12-20", service: "Oil Change", cost: "₹1,200", status: "Completed" },
    { id: 2, station: "Bangalore Auto Works", date: "2025-11-15", service: "Brake Pad Replacement", cost: "₹3,500", status: "Completed" },
  ];

  const handleSave = () => {
    setIsEditing(false);
  };

  // --- RESTRICTED ACCESS VIEW ---
  if (!user) {
    return (
      // Added backdropFilter to blur the 3D background behind this box
      <Box 
        h="100vh" 
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        px={4}
        backdropFilter="blur(12px)" 
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
              color="accent-cyan"
            >
              <Icon as={FaLock} boxSize={8} />
            </Box>
            
            <VStack spacing={2}>
              <Text fontSize="2xl" fontWeight="800" color="text-primary" letterSpacing="tight">
                Access Restricted
              </Text>
              
              {/* INTERACTIVE TEXT LINKS */}
              <Text color="text-muted" fontSize="md">
                Please{' '}
                <Button 
                  variant="link" 
                  color="accent-cyan" 
                  fontWeight="bold" 
                  verticalAlign="baseline"
                  onClick={() => onAuthOpen(false)} // Open Register
                >
                  Register
                </Button>
                {' '}or{' '}
                <Button 
                  variant="link" 
                  color="accent-cyan" 
                  fontWeight="bold"
                  verticalAlign="baseline"
                  onClick={() => onAuthOpen(true)} // Open Login
                >
                  Login
                </Button>
                {' '}to view and manage your profile details.
              </Text>
            </VStack>
          </VStack>
        </Box>
      </Box>
    );
  }

  // --- NORMAL PROFILE CONTENT ---
  return (
    <Box pt={24} pb={10} px={6} maxW="container.xl" mx="auto" color="text-primary" bg="transparent">
      <Card bg="glass-bg" border="1px solid" borderColor="border-color" backdropFilter="blur(20px)" boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)">
        <CardBody>
          <HStack spacing={8} align="flex-start" flexDirection={{ base: "column", md: "row" }}>
            <Box position="relative">
              <Avatar size="2xl" name={profileData.name} border="4px solid cyan" />
              <IconButton 
                icon={<FaCamera />} 
                isRound 
                size="sm" 
                position="absolute" 
                bottom={0} 
                right={0} 
                colorScheme="cyan"
                aria-label="Upload Image"
              />
            </Box>
            <VStack align="flex-start" spacing={1} flex={1}>
              <HStack w="full" justify="space-between">
                <Text fontSize="3xl" fontWeight="bold">{profileData.name}</Text>
                <Button 
                  leftIcon={isEditing ? <FaSave /> : <FaEdit />} 
                  colorScheme={isEditing ? "green" : "cyan"} 
                  variant="outline"
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                >
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
              </HStack>
              <Text color="text-muted">{profileData.email} • {profileData.phone}</Text>
              <Badge colorScheme="green" mt={2}>Verified User</Badge>
              <Text mt={4} color="text-muted" fontStyle="italic">"{profileData.bio}"</Text>
            </VStack>
          </HStack>
        </CardBody>
      </Card>

      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8} mt={8}>
        <Box gridColumn={{ lg: "span 2" }}>
          <Card bg="glass-bg" backdropFilter="blur(20px)" border="1px solid" borderColor="border-color" boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)">
            <CardHeader>
              <Text fontSize="xl" fontWeight="bold" borderBottom="1px solid gray" pb={2}>Personal Information</Text>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl>
                  <FormLabel color="light-cyan">Full Name</FormLabel>
                  <Input 
                    value={profileData.name} 
                    isReadOnly={!isEditing} 
                    border="1px solid" borderColor="border-color" bg="slate-bg" _focus={{ borderColor: "cyan.500", boxShadow: "0 0 0 1px #0EA5E9" }}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color="light-cyan">Date of Birth</FormLabel>
                  <Input 
                    type="date" 
                    value={profileData.dob} 
                    isReadOnly={!isEditing} 
                    border="1px solid" borderColor="border-color" bg="slate-bg" _focus={{ borderColor: "cyan.500", boxShadow: "0 0 0 1px #0EA5E9" }}
                    onChange={(e) => setProfileData({...profileData, dob: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color="light-cyan">Gender</FormLabel>
                  <Select 
                    value={profileData.gender} 
                    isDisabled={!isEditing} 
                    border="1px solid" borderColor="border-color" bg="slate-bg" _focus={{ borderColor: "cyan.500", boxShadow: "0 0 0 1px #0EA5E9" }}
                    onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                    sx={{ '> option': { background: '#1A202C' } }}
                  >
                    <option value="">Select</option>
                    <option value="Male" style={{color: "black"}}>Male</option>
                    <option value="Female" style={{color: "black"}}>Female</option>
                    <option value="Other" style={{color: "black"}}>Other</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel color="light-cyan">Area / Locality</FormLabel>
                  <Input 
                    value={profileData.area} 
                    isReadOnly={!isEditing} 
                    border="1px solid" borderColor="border-color" bg="slate-bg" _focus={{ borderColor: "cyan.500", boxShadow: "0 0 0 1px #0EA5E9" }}
                    onChange={(e) => setProfileData({...profileData, area: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color="light-cyan">State</FormLabel>
                  <Input 
                    value={profileData.state} 
                    isReadOnly={!isEditing} 
                    border="1px solid" borderColor="border-color" bg="slate-bg" _focus={{ borderColor: "cyan.500", boxShadow: "0 0 0 1px #0EA5E9" }}
                    onChange={(e) => setProfileData({...profileData, state: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color="light-cyan">Pincode</FormLabel>
                  <Input 
                    value={profileData.pincode} 
                    isReadOnly={!isEditing} 
                    border="1px solid" borderColor="border-color" bg="slate-bg" _focus={{ borderColor: "cyan.500", boxShadow: "0 0 0 1px #0EA5E9" }}
                    onChange={(e) => setProfileData({...profileData, pincode: e.target.value})}
                  />
                </FormControl>
              </SimpleGrid>
            </CardBody>
          </Card>
        </Box>

        <Box>
          <Card bg="glass-bg" backdropFilter="blur(20px)" border="1px solid" borderColor="border-color" boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)" h="full">
            <CardHeader>
              <Text fontSize="xl" fontWeight="bold" borderBottom="1px solid gray" pb={2}>Service History</Text>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {serviceHistory.map((item) => (
                  <Box key={item.id} p={3} bg="rgba(30, 41, 59, 0.5)" borderRadius="md" borderLeft="4px solid cyan">
                    <Text fontWeight="bold" fontSize="md">{item.station}</Text>
                    <Text fontSize="sm" color="text-muted">{item.date}</Text>
                    <Divider my={2} />
                    <HStack justify="space-between">
                      <Text fontSize="sm">{item.service}</Text>
                      <Text fontWeight="bold" color="green.300">{item.cost}</Text>
                    </HStack>
                  </Box>
                ))}
                <Button variant="link" color="accent-cyan">View All History</Button>
              </VStack>
            </CardBody>
          </Card>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default UserProfile;