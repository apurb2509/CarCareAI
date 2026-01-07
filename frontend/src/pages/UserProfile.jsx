import React, { useState } from "react";
import {
  Box, VStack, HStack, Text, Avatar, Button, Input, FormControl, FormLabel,
  SimpleGrid, Divider, Badge, Card, CardHeader, CardBody, Select,
  IconButton
} from "@chakra-ui/react";
import { FaEdit, FaSave, FaCamera } from "react-icons/fa";
import { useUser } from "../context/UserContext"; // Import context

const UserProfile = () => {
  const { user } = useUser(); // Get real data
  const [isEditing, setIsEditing] = useState(false);
  
  // Local state for editable fields (pre-filled with context data)
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

  // Mock Service History Data
  const serviceHistory = [
    { id: 1, station: "Speedy Fix Garage", date: "2025-12-20", service: "Oil Change", cost: "₹1,200", status: "Completed" },
    { id: 2, station: "Bangalore Auto Works", date: "2025-11-15", service: "Brake Pad Replacement", cost: "₹3,500", status: "Completed" },
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Here you would send a PATCH request to your backend to save changes
  };

  return (
    <Box pt={24} pb={10} px={6} maxW="container.xl" mx="auto" color="white">
      {/* 1. HEADER SECTION */}
      <Card bg="rgba(255,255,255,0.05)" border="1px solid rgba(255,255,255,0.1)" backdropFilter="blur(10px)">
        <CardBody>
          <HStack spacing={8} align="flex-start" flexDirection={{ base: "column", md: "row" }}>
            <Box position="relative">
              <Avatar size="2xl" name={profileData.name} src="https://bit.ly/broken-link" border="4px solid cyan" />
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
              <Text color="gray.400">{profileData.email} • {profileData.phone}</Text>
              <Badge colorScheme="green" mt={2}>Verified User</Badge>
              <Text mt={4} color="whiteAlpha.800" fontStyle="italic">"{profileData.bio}"</Text>
            </VStack>
          </HStack>
        </CardBody>
      </Card>

      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8} mt={8}>
        
        {/* 2. PERSONAL DETAILS (Left Column - 2/3 width) */}
        <Box gridColumn={{ lg: "span 2" }}>
          <Card bg="rgba(255,255,255,0.03)" borderColor="whiteAlpha.200">
            <CardHeader>
              <Text fontSize="xl" fontWeight="bold" borderBottom="1px solid gray" pb={2}>Personal Information</Text>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl>
                  <FormLabel color="cyan.300">Full Name</FormLabel>
                  <Input 
                    value={profileData.name} 
                    isReadOnly={!isEditing} 
                    border="none" bg="whiteAlpha.100" 
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color="cyan.300">Date of Birth</FormLabel>
                  <Input 
                    type="date" 
                    value={profileData.dob} 
                    isReadOnly={!isEditing} 
                    border="none" bg="whiteAlpha.100" 
                    onChange={(e) => setProfileData({...profileData, dob: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color="cyan.300">Gender</FormLabel>
                  <Select 
                    value={profileData.gender} 
                    isDisabled={!isEditing} 
                    border="none" bg="whiteAlpha.100" 
                    onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                    sx={{ '> option': { background: '#1A202C' } }}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel color="cyan.300">Area / Locality</FormLabel>
                  <Input 
                    value={profileData.area} 
                    isReadOnly={!isEditing} 
                    border="none" bg="whiteAlpha.100" 
                    onChange={(e) => setProfileData({...profileData, area: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color="cyan.300">State</FormLabel>
                  <Input 
                    value={profileData.state} 
                    isReadOnly={!isEditing} 
                    border="none" bg="whiteAlpha.100" 
                    onChange={(e) => setProfileData({...profileData, state: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color="cyan.300">Pincode</FormLabel>
                  <Input 
                    value={profileData.pincode} 
                    isReadOnly={!isEditing} 
                    border="none" bg="whiteAlpha.100" 
                    onChange={(e) => setProfileData({...profileData, pincode: e.target.value})}
                  />
                </FormControl>
              </SimpleGrid>
            </CardBody>
          </Card>
        </Box>

        {/* 3. SERVICE HISTORY (Right Column - 1/3 width) */}
        <Box>
          <Card bg="rgba(255,255,255,0.03)" borderColor="whiteAlpha.200" h="full">
            <CardHeader>
              <Text fontSize="xl" fontWeight="bold" borderBottom="1px solid gray" pb={2}>Service History</Text>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {serviceHistory.map((item) => (
                  <Box key={item.id} p={3} bg="whiteAlpha.100" borderRadius="md" borderLeft="4px solid cyan">
                    <Text fontWeight="bold" fontSize="md">{item.station}</Text>
                    <Text fontSize="sm" color="gray.400">{item.date}</Text>
                    <Divider my={2} />
                    <HStack justify="space-between">
                      <Text fontSize="sm">{item.service}</Text>
                      <Text fontWeight="bold" color="green.300">{item.cost}</Text>
                    </HStack>
                  </Box>
                ))}
                <Button variant="link" color="cyan.400">View All History</Button>
              </VStack>
            </CardBody>
          </Card>
        </Box>

      </SimpleGrid>
    </Box>
  );
};

export default UserProfile;