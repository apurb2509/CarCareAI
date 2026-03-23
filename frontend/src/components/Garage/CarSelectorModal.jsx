import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Select,
  Text,
  Icon,
  HStack,
  Box
} from '@chakra-ui/react';
import { FaCarSide, FaCheckCircle } from 'react-icons/fa';

const CarSelectorModal = ({ isOpen, onClose, cars, onSelectCar, currentCar }) => {
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');

  // If a user re-opens the modal, pre-fill it with their current car
  useEffect(() => {
    if (currentCar) {
      setSelectedMake(currentCar.make);
      setSelectedModelId(currentCar._id);
    } else {
      setSelectedMake('');
      setSelectedModelId('');
    }
  }, [currentCar, isOpen]);

  // 1. Extract a list of unique Makes (e.g., ['Hyundai', 'Maruti Suzuki', 'Tata'])
  const uniqueMakes = [...new Set(cars.map((car) => car.make))].sort();

  // 2. Filter the Models based on the selected Make
  const availableModels = cars.filter((car) => car.make === selectedMake);

  const handleSave = () => {
    const selectedCarObj = cars.find((car) => car._id === selectedModelId);
    if (selectedCarObj) {
      onSelectCar(selectedCarObj);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      {/* Dark blur overlay */}
      <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.700" />
      
      <ModalContent 
        bg="gray.900" 
        color="white" 
        border="1px solid" 
        borderColor="whiteAlpha.200"
        borderRadius="2xl"
        boxShadow="0 0 40px rgba(0, 255, 255, 0.1)"
      >
        <ModalHeader borderBottom="1px solid" borderColor="whiteAlpha.100" pb={4}>
          <HStack>
            <Box p={2} bg="cyan.500" borderRadius="lg">
              <Icon as={FaCarSide} w={5} h={5} color="gray.900" />
            </Box>
            <Text fontSize="xl" fontWeight="bold">Select Your Vehicle</Text>
          </HStack>
        </ModalHeader>
        
        {/* Only show close button if they already have a car selected (forces initial choice) */}
        {currentCar && <ModalCloseButton color="whiteAlpha.600" mt={2} />}

        <ModalBody py={6}>
          <VStack spacing={6}>
            <Text color="gray.400" fontSize="sm" textAlign="center">
              Choose your vehicle make and model to see compatible 3D parts and local inventory.
            </Text>

            {/* MAKE DROPDOWN */}
            <FormControl>
              <FormLabel color="cyan.300" fontWeight="600">Vehicle Make</FormLabel>
              <Select 
                placeholder="Select Make" 
                value={selectedMake}
                onChange={(e) => {
                  setSelectedMake(e.target.value);
                  setSelectedModelId(''); // Reset model when make changes
                }}
                bg="blackAlpha.400" 
                border="1px solid" 
                borderColor="whiteAlpha.200"
                _focus={{ borderColor: "cyan.400", boxShadow: "0 0 0 1px #0BC5EA" }}
                _hover={{ borderColor: "whiteAlpha.400" }}
                size="lg"
                color={selectedMake ? "white" : "gray.500"}
              >
                {uniqueMakes.map((make) => (
                  <option key={make} value={make} style={{ color: 'black' }}>
                    {make}
                  </option>
                ))}
              </Select>
            </FormControl>

            {/* MODEL DROPDOWN */}
            <FormControl isDisabled={!selectedMake}>
              <FormLabel color={selectedMake ? "cyan.300" : "gray.500"} fontWeight="600">
                Vehicle Model & Year
              </FormLabel>
              <Select 
                placeholder={selectedMake ? "Select Model" : "Select a Make first"} 
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                bg="blackAlpha.400" 
                border="1px solid" 
                borderColor="whiteAlpha.200"
                _focus={{ borderColor: "cyan.400", boxShadow: "0 0 0 1px #0BC5EA" }}
                _hover={{ borderColor: "whiteAlpha.400" }}
                size="lg"
                color={selectedModelId ? "white" : "gray.500"}
              >
                {availableModels.map((car) => (
                  <option key={car._id} value={car._id} style={{ color: 'black' }}>
                    {car.modelName} ({car.startYear} - {car.endYear ? car.endYear : 'Present'})
                  </option>
                ))}
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter borderTop="1px solid" borderColor="whiteAlpha.100" pt={4}>
          <Button 
            w="full" 
            size="lg"
            colorScheme="cyan" 
            leftIcon={<FaCheckCircle />}
            isDisabled={!selectedModelId}
            onClick={handleSave}
            boxShadow={selectedModelId ? "0 4px 14px 0 rgba(11, 197, 234, 0.39)" : "none"}
            _hover={{ transform: selectedModelId ? "translateY(-2px)" : "none" }}
            transition="all 0.2s"
          >
            Load Garage
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CarSelectorModal;