import React, { useState, useEffect } from 'react';
import {
  Box, Container, Grid, GridItem, Heading, Text, VStack, HStack,
  Button, useDisclosure, Spinner, Icon, Badge, useToast, Flex
} from '@chakra-ui/react';
import { FaCar, FaCogs, FaMapMarkerAlt, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// We will build these two components next!
import CarSelectorModal from '../components/Garage/CarSelectorModal';
import ThreeCanvas from '../components/Garage/ThreeCanvas';
import { API_BASE_URL } from '../utils/api';

const MyGarage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [availableCars, setAvailableCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  
  const [compatibleParts, setCompatibleParts] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  
  const [isLoadingCars, setIsLoadingCars] = useState(true);
  const [isLoadingParts, setIsLoadingParts] = useState(false);

  // 1. Fetch all available cars when the page loads
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/inventory/cars`);
        const data = await response.json();
        if (data.success) {
          setAvailableCars(data.data);
          // If no car is selected yet, automatically open the selector modal
          if (!selectedCar) onOpen();
        }
      } catch (error) {
        console.error("Failed to fetch cars", error);
        toast({ title: "Error loading vehicles", status: "error", position: "top" });
      } finally {
        setIsLoadingCars(false);
      }
    };
    fetchCars();
  }, []);

  // 2. Fetch parts whenever a new car is selected
  useEffect(() => {
    if (!selectedCar) return;

    const fetchParts = async () => {
      setIsLoadingParts(true);
      setSelectedPart(null); // Reset the 3D canvas
      try {
        const response = await fetch(`${API_BASE_URL}/api/inventory/parts/${selectedCar._id}`);
        const data = await response.json();
        
        if (data.success) {
          setCompatibleParts(data.data);
        } else {
          setCompatibleParts([]);
          toast({ title: data.message, status: "info", position: "top" });
        }
      } catch (error) {
        console.error("Failed to fetch parts", error);
        toast({ title: "Error loading parts inventory", status: "error", position: "top" });
      } finally {
        setIsLoadingParts(false);
      }
    };

    fetchParts();
  }, [selectedCar]);

  // Handle the "Find Installers" action
  const handleFindInstallers = () => {
    if (!selectedPart) return;
    // Navigate to FindServices page and pass the part ID in the state/URL
    navigate('/find-services', { state: { searchPartId: selectedPart._id, partName: selectedPart.name } });
  };

  // Group parts by Category for a clean UI menu
  const groupedParts = compatibleParts.reduce((acc, part) => {
    if (!acc[part.category]) acc[part.category] = [];
    acc[part.category].push(part);
    return acc;
  }, {});

  return (
    <Box pt={24} pb={10} px={6} minH="100vh" bg="transparent" color="text-primary">
      <Container maxW="container.xl">
        
        {/* HEADER SECTION */}
        <Flex justify="space-between" align="center" mb={8} flexDir={{ base: "column", md: "row" }} gap={4}>
          <HStack>
            <Icon as={FaCar} w={8} h={8} color="accent-cyan" />
            <Heading size="xl" bgGradient="linear(to-r, cyan.300, blue.500)" bgClip="text">
              Digital Garage
            </Heading>
          </HStack>
          
          <Button 
            onClick={onOpen} 
            colorScheme="cyan" 
            variant="outline" 
            size="md"
            isLoading={isLoadingCars}
          >
            {selectedCar ? `${selectedCar.make} ${selectedCar.modelName}` : "Select Vehicle"}
          </Button>
        </Flex>

        {/* MAIN CONTENT GRID */}
        {!selectedCar ? (
          // Empty State
          <Flex h="50vh" justify="center" align="center" flexDir="column" border="2px dashed" borderColor="border-color" borderRadius="2xl" bg="glass-bg" backdropFilter="blur(10px)">
            <Icon as={FaCogs} w={16} h={16} color="text-muted" mb={4} />
            <Text fontSize="xl" color="text-muted">Please select a vehicle to view compatible parts.</Text>
            <Button mt={6} colorScheme="cyan" onClick={onOpen}>Choose Vehicle</Button>
          </Flex>
        ) : (
          <Grid templateColumns={{ base: "1fr", lg: "350px 1fr" }} gap={8}>
            
            {/* LEFT COLUMN: PARTS CATALOG */}
            <GridItem>
              <Box bg="glass-bg" backdropFilter="blur(20px)" border="1px solid" borderColor="border-color" borderRadius="2xl" boxShadow="0 25px 50px -12px rgba(0,0,0,0.5)" p={5} h="70vh" overflowY="auto" css={{ "&::-webkit-scrollbar": { display: "none" } }}>
                <Heading size="md" mb={6} color="cyan.500">Compatible Parts</Heading>
                
                {isLoadingParts ? (
                  <Flex justify="center" py={10}><Spinner color="accent-cyan" /></Flex>
                ) : compatibleParts.length === 0 ? (
                  <Text color="text-muted">No parts found for this vehicle.</Text>
                ) : (
                  Object.keys(groupedParts).map((category) => (
                    <Box key={category} mb={6}>
                      <Text fontSize="sm" fontWeight="bold" color="accent-cyan" textTransform="uppercase" letterSpacing="wider" mb={3}>
                        {category}
                      </Text>
                      <VStack align="stretch" spacing={2}>
                        {groupedParts[category].map((part) => (
                          <Button
                            key={part._id}
                            variant="ghost"
                            justifyContent="flex-start"
                            h="auto"
                            py={3}
                            px={4}
                            bg={selectedPart?._id === part._id ? "whiteAlpha.200" : "transparent"}
                            borderLeft="3px solid"
                            borderColor={selectedPart?._id === part._id ? "cyan.400" : "transparent"}
                            _hover={{ bg: "rgba(30, 41, 59, 0.8)" }}
                            onClick={() => setSelectedPart(part)}
                          >
                            <VStack align="start" spacing={1}>
                              <Text fontSize="md" fontWeight="600" color="text-primary" whiteSpace="normal" textAlign="left">{part.name}</Text>
                              <Text fontSize="xs" color="text-muted" whiteSpace="normal" textAlign="left">{part.shortDescription}</Text>
                            </VStack>
                          </Button>
                        ))}
                      </VStack>
                    </Box>
                  ))
                )}
              </Box>
            </GridItem>

            {/* RIGHT COLUMN: 3D VIEWER & DETAILS */}
            <GridItem>
              <Box bg="rgba(11, 17, 32, 0.6)" backdropFilter="blur(10px)" border="1px solid" borderColor="border-color" borderRadius="2xl" boxShadow="0 25px 50px -12px rgba(0,0,0,0.5)" h="70vh" position="relative" overflow="hidden" display="flex" flexDirection="column">
                
                {/* 3D Canvas Area */}
                <Box flex="1" position="relative">
                  {selectedPart ? (
                    // We will build this wrapper for React Three Fiber next
                    <ThreeCanvas part={selectedPart} />
                  ) : (
                    <Flex h="full" justify="center" align="center" flexDir="column">
                      <Icon as={FaInfoCircle} w={12} h={12} color="text-muted" mb={4} />
                      <Text color="text-muted">Select a part from the menu to interact with its 3D model.</Text>
                    </Flex>
                  )}
                </Box>

                {/* Part Details Overlay (Bottom Panel) */}
                {selectedPart && (
                  <Box p={6} bg="glass-bg" backdropFilter="blur(10px)" borderTop="1px solid" borderColor="border-color">
                    <Flex justify="space-between" align="flex-start" flexDir={{ base: "column", md: "row" }} gap={4}>
                      <Box flex="1">
                        <HStack mb={2}>
                          <Heading size="lg" color="text-primary">{selectedPart.name}</Heading>
                          <Badge colorScheme="cyan" variant="subtle">{selectedPart.category}</Badge>
                        </HStack>
                        <Text color="pale-gray" fontSize="md" mb={1}>{selectedPart.detailedFunction}</Text>
                      </Box>
                      
                      <Button 
                        size="lg" 
                        colorScheme="cyan" 
                        leftIcon={<FaMapMarkerAlt />}
                        onClick={handleFindInstallers}
                        flexShrink={0}
                        boxShadow="0 4px 14px 0 rgba(11, 197, 234, 0.39)"
                      >
                        Find Installers
                      </Button>
                    </Flex>
                  </Box>
                )}
              </Box>
            </GridItem>

          </Grid>
        )}
      </Container>

      {/* Modal for picking Make/Model */}
      <CarSelectorModal 
        isOpen={isOpen} 
        onClose={onClose} 
        cars={availableCars} 
        onSelectCar={setSelectedCar} 
        currentCar={selectedCar}
      />
    </Box>
  );
};

export default MyGarage;