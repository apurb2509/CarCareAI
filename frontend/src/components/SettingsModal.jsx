import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  HStack,
  SimpleGrid,
  useToast
} from '@chakra-ui/react';
import { useUser } from '../context/UserContext';

const SettingsModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useUser();
  const toast = useToast();

  const [formData, setFormData] = useState({
    pronouns: '',
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    addressLine1: '',
    addressLine2: '',
    pincode: ''
  });

  // Populate data when modal opens if user exists
  useEffect(() => {
    if (user && isOpen) {
      // If user.name is available but not split, we try to split it as a fallback
      // Ideally, the unified user object stores these explicitly and we build name dynamically
      const names = user.name ? user.name.split(' ') : [];
      setFormData({
        pronouns: user.pronouns || '',
        firstName: user.firstName || names[0] || '',
        middleName: user.middleName || '',
        lastName: user.lastName || names.slice(1).join(' ') || '',
        dob: user.dob || '',
        addressLine1: user.addressLine1 || '',
        addressLine2: user.addressLine2 || '',
        pincode: user.pincode || ''
      });
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Reconstruct full display name
    const parts = [formData.firstName, formData.middleName, formData.lastName].filter(Boolean);
    const fullName = parts.join(' ');
    
    // Prefix if pronouns exist
    const displayName = formData.pronouns ? `${formData.pronouns} ${fullName}` : fullName;

    updateUser({
      ...formData,
      name: displayName // This syncs globally across the app
    });

    toast({
      title: "Settings Updated",
      description: "Your profile has been saved across CarCare AI.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.600" />
      <ModalContent 
        bg="glass-bg" 
        backdropFilter="blur(20px)" 
        border="1px solid" 
        borderColor="border-color" 
        boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        color="text-primary"
      >
        <ModalHeader borderBottom="1px solid" borderColor="border-color">Profile Settings</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody py={6}>
          <VStack spacing={5}>
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} w="full">
              <FormControl>
                <FormLabel color="cyan.500" fontSize="sm">Title</FormLabel>
                <Select name="pronouns" value={formData.pronouns} onChange={handleChange} bg="slate-bg" borderColor="border-color">
                  <option value="" style={{color: 'black'}}>None</option>
                  <option value="Mr." style={{color: 'black'}}>Mr.</option>
                  <option value="Ms." style={{color: 'black'}}>Ms.</option>
                  <option value="Mrs." style={{color: 'black'}}>Mrs.</option>
                  <option value="Dr." style={{color: 'black'}}>Dr.</option>
                  <option value="Mx." style={{color: 'black'}}>Mx.</option>
                </Select>
              </FormControl>
              
              <FormControl gridColumn={{md: 'span 3'}}>
                <FormLabel color="cyan.500" fontSize="sm">First Name</FormLabel>
                <Input name="firstName" value={formData.firstName} onChange={handleChange} bg="slate-bg" borderColor="border-color" />
              </FormControl>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
              <FormControl>
                <FormLabel color="cyan.500" fontSize="sm">Middle Name</FormLabel>
                <Input name="middleName" value={formData.middleName} onChange={handleChange} bg="slate-bg" borderColor="border-color" />
              </FormControl>
              
              <FormControl>
                <FormLabel color="cyan.500" fontSize="sm">Last Name</FormLabel>
                <Input name="lastName" value={formData.lastName} onChange={handleChange} bg="slate-bg" borderColor="border-color" />
              </FormControl>
            </SimpleGrid>

            <FormControl w="full">
              <FormLabel color="cyan.500" fontSize="sm">Date of Birth</FormLabel>
              <Input type="date" name="dob" value={formData.dob} onChange={handleChange} bg="slate-bg" borderColor="border-color" />
            </FormControl>

            <FormControl w="full">
              <FormLabel color="cyan.500" fontSize="sm">Address Line 1 (Area)</FormLabel>
              <Input name="addressLine1" value={formData.addressLine1} onChange={handleChange} bg="slate-bg" borderColor="border-color" placeholder="Street, Sector, or Locality" />
            </FormControl>

            <HStack spacing={4} w="full">
              <FormControl flex={2}>
                <FormLabel color="cyan.500" fontSize="sm">Address Line 2</FormLabel>
                <Input name="addressLine2" value={formData.addressLine2} onChange={handleChange} bg="slate-bg" borderColor="border-color" placeholder="Landmark or City" />
              </FormControl>
              
              <FormControl flex={1}>
                <FormLabel color="cyan.500" fontSize="sm">Pincode</FormLabel>
                <Input name="pincode" value={formData.pincode} onChange={handleChange} bg="slate-bg" borderColor="border-color" placeholder="e.g. 110001" />
              </FormControl>
            </HStack>
          </VStack>
        </ModalBody>

        <ModalFooter borderTop="1px solid" borderColor="border-color">
          <Button variant="ghost" mr={3} onClick={onClose} _hover={{ bg: "slate-bg" }}>Cancel</Button>
          <Button colorScheme="cyan" onClick={handleSave}>Save Changes</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SettingsModal;
