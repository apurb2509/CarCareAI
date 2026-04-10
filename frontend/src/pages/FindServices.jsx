import React, { useState, useEffect } from "react";
import "../styles/FindServices.css";
import {
  Box, VStack, HStack, Text, Input, InputGroup, InputLeftElement,
  Button, SimpleGrid, Card, CardBody, Badge, Icon, Select,
  useToast, Divider
} from "@chakra-ui/react";
import { FaSearch, FaMapMarkerAlt, FaCalendarCheck } from "react-icons/fa";

const FindServices = () => {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All"); // All, Service, Part
  const [filteredResults, setFilteredResults] = useState([]);

  // --- MOCK DATABASE (Simulating Data from Service Partners) ---
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
    <Box 
      className="find-services-container" 
      pt={24} pb={10} px={6} 
      maxW="container.xl" 
      mx="auto" 
      minH="100vh" 
      color="text-primary"
    >
      
      {/* 1. HEADER & SEARCH SECTION */}
      <VStack className="find-services-header" spacing={6} align="center" mb={12}>
        <Text 
          className="main-heading"
          fontSize={{ base: "3xl", md: "5xl" }} 
          fontWeight="900" 
          bgGradient="linear(to-r, cyan.400, blue.500)" 
          bgClip="text"
          textAlign="center"
        >
          Find Services & Parts
        </Text>
        <Text color="text-muted" fontSize="lg" maxW="600px" textAlign="center">
          Search for nearby mechanics, service stations, and spare parts available in your area.
        </Text>

        <HStack 
          className="search-stack" 
          w="full" 
          maxW="800px" 
          spacing={4} 
          flexDirection={{ base: "column", md: "row" }}
        >
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <Icon as={FaSearch} color="text-muted" />
            </InputLeftElement>
            <Input 
              placeholder="Search 'Oil Change', 'Brake Pads'..." 
              bg="slate-bg" 
              border="1px solid" 
              borderColor="border-color"
              _focus={{ borderColor: "cyan.500", boxShadow: "0 0 0 1px #0EA5E9" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <Select 
            size="lg" 
            maxW={{ base: "full", md: "200px" }} 
            bg="slate-bg" 
            borderColor="border-color"
            _focus={{ borderColor: "cyan.500", boxShadow: "0 0 0 1px #0EA5E9" }}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="category-select"
          >
            <option value="All" style={{color: "black"}}>All Categories</option>
            <option value="Service" style={{color: "black"}}>Services</option>
            <option value="Part" style={{color: "black"}}>Car Parts</option>
          </Select>
        </HStack>
      </VStack>

      {/* 2. RESULTS GRID */}
      <SimpleGrid className="results-grid" columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
        {filteredResults.length > 0 ? (
          filteredResults.map((item) => (
            <Card 
              key={item.id} 
              className="service-card"
              bg="glass-bg" 
              backdropFilter="blur(20px)"
              border="1px solid" 
              borderColor="border-color"
              transition="all 0.3s"
              _hover={{ transform: "translateY(-5px)", borderColor: "cyan.500", boxShadow: "0 15px 30px -10px rgba(14, 165, 233, 0.2)" }}
            >
              <CardBody>
                <VStack align="start" spacing={4}>
                  <HStack justify="space-between" w="full">
                    <Badge colorScheme={item.type === "Service" ? "cyan" : "purple"} fontSize="0.8em" px={2} py={1} borderRadius="md">
                      {item.type}
                    </Badge>
                    <HStack spacing={1}>
                      <Icon as={FaMapMarkerAlt} color="text-muted" size="sm" />
                      <Text fontSize="xs" color="text-muted">{item.location}</Text>
                    </HStack>
                  </HStack>

                  <Box>
                    <Text fontSize="xl" fontWeight="bold" color="text-primary" mb={1}>{item.name}</Text>
                    <Text fontSize="sm" color="light-cyan" fontWeight="600">{item.stationName}</Text>
                  </Box>

                  <Divider borderColor="border-color" />

                  <HStack justify="space-between" w="full" align="center">
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" color="text-muted">Price</Text>
                      <Text fontSize="lg" fontWeight="bold" color="green.300">{item.price}</Text>
                    </VStack>
                    
                    {item.available ? (
                      <Button 
                        className="book-btn"
                        size="sm" 
                        bg="cyan.500" 
                        color="gray.900"
                        _hover={{ bg: "cyan.400", boxShadow: "0 4px 12px rgba(14, 165, 233, 0.4)" }}
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
            <Text fontSize="xl" color="text-muted">No matching results.</Text>
            <Text fontSize="sm" color="gray.600">Try adjusting your filters.</Text>
          </Box>
        )}
      </SimpleGrid>
    </Box>
  );
};

export default FindServices;