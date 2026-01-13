import React, { useState, useEffect } from "react";
import {
  Box, VStack, HStack, Text, Input, InputGroup, InputLeftElement,
  Button, SimpleGrid, Card, CardBody, Badge, Icon, Select,
  useToast, Divider, Tag, TagLabel, TagLeftIcon
} from "@chakra-ui/react";
import { FaSearch, FaFilter, FaMapMarkerAlt, FaCar, FaTools, FaCalendarCheck } from "react-icons/fa";

const FindServices = () => {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All"); // All, Service, Part
  const [filteredResults, setFilteredResults] = useState([]);

  // --- MOCK DATABASE (Simulating Data from Service Partners) ---
  // In a real app, this data comes from: GET /api/services/all
  const allListings = [
    { 
      id: 1, 
      stationName: "My Auto Garage", 
      type: "Service", 
      name: "Synthetic Oil Change", 
      price: "₹1,499", 
      location: "Indiranagar, Bangalore", 
      rating: "4.8",
      available: true 
    },
    { 
      id: 2, 
      stationName: "My Auto Garage", 
      type: "Part", 
      name: "Shell Helix Ultra 5W-40", 
      price: "₹3,500", 
      location: "Indiranagar, Bangalore", 
      rating: "4.8",
      available: true 
    },
    { 
      id: 3, 
      stationName: "Speedy Fix Hub", 
      type: "Service", 
      name: "Premium Car Wash", 
      price: "₹499", 
      location: "Koramangala, Bangalore", 
      rating: "4.5",
      available: true 
    },
    { 
      id: 4, 
      stationName: "Mechanic Bros", 
      type: "Part", 
      name: "Bosch Brake Pads (Front)", 
      price: "₹2,100", 
      location: "Whitefield, Bangalore", 
      rating: "4.2",
      available: false 
    },
    { 
      id: 5, 
      stationName: "CarCare Pro", 
      type: "Service", 
      name: "AC Gas Refill", 
      price: "₹1,200", 
      location: "Jayanagar, Bangalore", 
      rating: "4.9",
      available: true 
    },
  ];

  // --- SEARCH LOGIC ---
  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    
    const results = allListings.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(lowerQuery) || 
        item.stationName.toLowerCase().includes(lowerQuery) ||
        item.location.toLowerCase().includes(lowerQuery);
      
      const matchesFilter = filterType === "All" || item.type === filterType;

      return matchesSearch && matchesFilter;
    });

    setFilteredResults(results);
  }, [searchQuery, filterType]);

  // --- BOOKING HANDLER ---
  const handleBookNow = (serviceName, stationName) => {
    // In real app: POST /api/bookings/create
    toast({
      title: "Request Sent!",
      description: `Booking request for ${serviceName} at ${stationName} has been sent.`,
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top"
    });
  };

  return (
    <Box pt={24} pb={10} px={6} maxW="container.xl" mx="auto" minH="100vh" color="white">
      
      {/* 1. HEADER & SEARCH SECTION */}
      <VStack spacing={6} align="center" mb={12}>
        <Text 
          fontSize={{ base: "3xl", md: "5xl" }} 
          fontWeight="900" 
          bgGradient="linear(to-r, cyan.400, blue.500)" 
          bgClip="text"
          textAlign="center"
        >
          Find Services & Parts
        </Text>
        <Text color="gray.400" fontSize="lg" maxW="600px" textAlign="center">
          Search for nearby mechanics, service stations, and spare parts available in your area.
        </Text>

        <HStack w="full" maxW="800px" spacing={4} flexDirection={{ base: "column", md: "row" }}>
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <Icon as={FaSearch} color="gray.500" />
            </InputLeftElement>
            <Input 
              placeholder="Search 'Oil Change', 'Brake Pads', or 'Location'..." 
              bg="whiteAlpha.100" 
              border="1px solid" 
              borderColor="whiteAlpha.200"
              _focus={{ borderColor: "cyan.400", boxShadow: "0 0 0 1px cyan.400" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <Select 
            size="lg" 
            maxW={{ base: "full", md: "200px" }} 
            bg="whiteAlpha.100" 
            borderColor="whiteAlpha.200"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            sx={{ '> option': { background: '#1A202C' } }}
          >
            <option value="All">All Categories</option>
            <option value="Service">Services</option>
            <option value="Part">Car Parts</option>
          </Select>
        </HStack>
      </VStack>

      {/* 2. RESULTS GRID */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
        {filteredResults.length > 0 ? (
          filteredResults.map((item) => (
            <Card 
              key={item.id} 
              bg="rgba(255,255,255,0.03)" 
              border="1px solid" 
              borderColor="whiteAlpha.200"
              transition="all 0.3s"
              _hover={{ transform: "translateY(-5px)", borderColor: "cyan.500", boxShadow: "0 10px 20px -10px rgba(0, 255, 255, 0.3)" }}
            >
              <CardBody>
                <VStack align="start" spacing={4}>
                  <HStack justify="space-between" w="full">
                    <Badge colorScheme={item.type === "Service" ? "cyan" : "purple"} fontSize="0.8em" px={2} py={1} borderRadius="md">
                      {item.type}
                    </Badge>
                    <HStack spacing={1}>
                      <Icon as={FaMapMarkerAlt} color="gray.500" size="sm" />
                      <Text fontSize="xs" color="gray.400">{item.location}</Text>
                    </HStack>
                  </HStack>

                  <Box>
                    <Text fontSize="xl" fontWeight="bold" color="white" mb={1}>{item.name}</Text>
                    <Text fontSize="sm" color="cyan.300" fontWeight="600">{item.stationName}</Text>
                  </Box>

                  <Divider borderColor="whiteAlpha.200" />

                  <HStack justify="space-between" w="full" align="center">
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" color="gray.500">Price</Text>
                      <Text fontSize="lg" fontWeight="bold" color="green.300">{item.price}</Text>
                    </VStack>
                    
                    {item.available ? (
                      <Button 
                        size="sm" 
                        colorScheme="cyan" 
                        leftIcon={<FaCalendarCheck />}
                        onClick={() => handleBookNow(item.name, item.stationName)}
                      >
                        Book Now
                      </Button>
                    ) : (
                      <Button size="sm" colorScheme="red" isDisabled variant="outline">
                        Out of Stock
                      </Button>
                    )}
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))
        ) : (
          <Box gridColumn="1 / -1" textAlign="center" py={20}>
            <Icon as={FaSearch} boxSize={12} color="gray.600" mb={4} />
            <Text fontSize="xl" color="gray.500">No services or parts found matching your search.</Text>
            <Text fontSize="sm" color="gray.600">Try adjusting your filters or search for something else.</Text>
          </Box>
        )}
      </SimpleGrid>
    </Box>
  );
};

export default FindServices;