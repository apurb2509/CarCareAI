import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Input,
  Checkbox,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Icon,
  IconButton,
  useToast,
  Select,
  Box,
} from '@chakra-ui/react';
import { FaUser, FaTools, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const AuthModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const toast = useToast();

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", 
    "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", 
    "Lakshadweep", "Puducherry"
  ];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    locality: '',
    pincode: '',
    state: '',
    password: '',
    agreed: false
  });

  useEffect(() => {
    if (confirmPassword && formData.password) {
      setPasswordsMatch(confirmPassword === formData.password);
    } else {
      setPasswordsMatch(false);
    }
  }, [confirmPassword, formData.password]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const validatePassword = (pass) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d|.*[!@#$%^&*])/.test(pass);
  };

  const isFormValid = 
    formData.name.trim() !== '' &&
    formData.phone.length >= 10 &&
    formData.locality.trim() !== '' &&
    formData.pincode.trim() !== '' &&
    formData.state !== '' &&
    validatePassword(formData.password) &&
    passwordsMatch &&
    formData.agreed;

  const handleSubmit = () => {
    console.log("Registering as:", role, formData);
    toast({ 
      title: "Account Created!", 
      description: `Welcome to CarCareAI as a ${role}`, 
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top"
    });
    onClose();
  };

  // NEW: Refined Eye-Catchy Background Style (Deep Navy Glass)
  const glassStyle = {
    bg: "linear-gradient(135deg, rgba(6, 11, 25, 0.98) 0%, rgba(10, 25, 41, 0.95) 100%)",
    backdropFilter: "blur(30px) saturate(150%)",
    border: "1px solid rgba(0, 245, 255, 0.15)",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(0, 245, 255, 0.05)",
    color: "white"
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay backdropFilter="blur(15px)" bg="rgba(0, 0, 0, 0.75)" />
      <ModalContent {...glassStyle} borderRadius="3xl" mx={4} overflow="hidden">
        
        {/* Animated-look Gradient Header */}
        <Box bgGradient="linear(to-r, #00d2ff, #3a7bd5, #00d2ff)" h="5px" w="full" />
        
        <ModalHeader textAlign="center" fontSize="2xl" fontWeight="900" pt={10} letterSpacing="-0.8px">
          {step === 1 ? (
            <Text bgGradient="linear(to-b, #fff, #00f5ff)" bgClip="text">Get Started</Text>
          ) : (
            <VStack spacing={0}>
                <Text bgGradient="linear(to-b, #fff, #00f5ff)" bgClip="text" lineHeight="1.2">
                  {role === 'user' ? 'Join as User' : 'Partner with Us'}
                </Text>
                <Text fontSize="xs" fontWeight="400" color="whiteAlpha.500" mt={1}>Enter your details below</Text>
            </VStack>
          )}
        </ModalHeader>
        <ModalCloseButton color="whiteAlpha.600" borderRadius="full" _hover={{ color: "cyan.300", bg: "whiteAlpha.100" }} />
        
        <ModalBody pb={10} px={8}>
          {step === 1 ? (
            <VStack spacing={8} py={4}>
              <Text color="whiteAlpha.700" textAlign="center" fontSize="sm" fontWeight="500">
                Are you looking for services or providing them?
              </Text>
              <HStack spacing={6} w="full">
                <SelectionCard 
                  icon={FaUser} label="Customer" 
                  onClick={() => { setRole('user'); setStep(2); }} 
                />
                <SelectionCard 
                  icon={FaTools} label="Business" 
                  onClick={() => { setRole('service'); setStep(2); }} 
                />
              </HStack>
            </VStack>
          ) : (
            <VStack spacing={5}>
              <FormControl isRequired>
                <FormLabel fontSize="10px" fontWeight="800" color="cyan.300" textTransform="uppercase" mb={1} ml={1}>Owner Name</FormLabel>
                <Input name="name" placeholder="Full Name" variant="filled" h="48px" bg="rgba(255,255,255,0.05)" _hover={{bg: "rgba(255,255,255,0.08)"}} _focus={{ bg: "rgba(255,255,255,0.1)", borderColor: "cyan.400" }} onChange={handleInputChange} />
              </FormControl>

              <HStack w="full" spacing={4}>
                <FormControl isRequired>
                  <FormLabel fontSize="10px" fontWeight="800" color="cyan.300" textTransform="uppercase" mb={1} ml={1}>WhatsApp</FormLabel>
                  <Input name="phone" type="tel" placeholder="Mobile No." h="48px" variant="filled" bg="rgba(255,255,255,0.05)" onChange={handleInputChange} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="10px" fontWeight="800" color="whiteAlpha.400" textTransform="uppercase" mb={1} ml={1}>Email</FormLabel>
                  <Input name="email" type="email" placeholder="Optional" h="48px" variant="filled" bg="rgba(255,255,255,0.05)" onChange={handleInputChange} />
                </FormControl>
              </HStack>

              <HStack w="full" spacing={4}>
                <FormControl isRequired>
                  <Input name="locality" placeholder="Locality" h="48px" variant="filled" bg="rgba(255,255,255,0.05)" onChange={handleInputChange} />
                </FormControl>
                <FormControl isRequired>
                  <Input name="pincode" placeholder="Pincode" h="48px" variant="filled" bg="rgba(255,255,255,0.05)" onChange={handleInputChange} />
                </FormControl>
              </HStack>

              <FormControl isRequired>
                <Select 
                  name="state" 
                  placeholder="Select State" 
                  h="48px"
                  bg="rgba(255,255,255,0.05)" 
                  variant="filled" 
                  color="whiteAlpha.700"
                  _focus={{ bg: "rgba(255,255,255,0.1)" }}
                  onChange={handleInputChange}
                  sx={{ '> option': { background: '#0a1929', color: 'white' } }}
                >
                  {indianStates.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="10px" fontWeight="800" color="cyan.300" textTransform="uppercase" mb={1} ml={1}>Security</FormLabel>
                <InputGroup>
                  <Input 
                    name="password"
                    placeholder="Create Password"
                    h="48px"
                    type={showPassword ? "text" : "password"} 
                    bg="rgba(255,255,255,0.05)" variant="filled"
                    onChange={handleInputChange}
                  />
                  <InputRightElement h="48px">
                    <IconButton 
                      variant="unstyled" display="flex"
                      icon={showPassword ? <FaEyeSlash /> : <FaEye />} 
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <InputGroup>
                  <Input 
                    placeholder="Confirm Password"
                    h="48px"
                    type="password"
                    bg="rgba(255,255,255,0.05)" variant="filled"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <InputRightElement h="48px">
                    {confirmPassword && (
                      <Icon 
                        as={passwordsMatch ? FaCheckCircle : FaTimesCircle} 
                        color={passwordsMatch ? "green.300" : "red.400"} 
                      />
                    )}
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Checkbox name="agreed" colorScheme="cyan" size="sm" mt={2} onChange={handleInputChange}>
                <Text fontSize="xs" color="whiteAlpha.600" ml={1}>I accept the CarCareAI Terms</Text>
              </Checkbox>

              <Button 
                w="full" 
                bgGradient="linear(to-r, #00d2ff, #3a7bd5)"
                _hover={{ 
                    bgGradient: "linear(to-r, #00eaff, #4a8df5)", 
                    transform: "translateY(-2px)",
                    boxShadow: "0 0 20px rgba(0, 210, 255, 0.4)"
                }}
                _active={{ transform: "translateY(0)" }}
                color="white"
                mt={4} 
                h="56px"
                fontSize="md"
                fontWeight="bold"
                borderRadius="2xl"
                isDisabled={!isFormValid}
                onClick={handleSubmit}
              >
                CREATE ACCOUNT
              </Button>
              
              <Button 
                variant="link" 
                size="xs" 
                color="red.400" 
                fontWeight="bold"
                textTransform="uppercase"
                letterSpacing="1px"
                _hover={{ color: "red.300", textDecoration: "none" }}
                onClick={() => setStep(1)}
              >
                ← Back to Selection
              </Button>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const SelectionCard = ({ icon, label, onClick }) => (
  <VStack 
    as="button" 
    flex={1} 
    p={8} 
    bg="rgba(255,255,255,0.03)" 
    borderRadius="2xl"
    border="1px solid rgba(255,255,255,0.05)"
    transition="all 0.3s ease"
    _hover={{ 
        bg: "rgba(0, 210, 255, 0.1)", 
        transform: "scale(1.05)", 
        borderColor: "cyan.400", 
        boxShadow: "0 0 30px rgba(0, 210, 255, 0.2)" 
    }}
    onClick={onClick} 
  >
    <Box p={4} bg="rgba(0, 210, 255, 0.15)" borderRadius="2xl" mb={2}>
        <Icon as={icon} boxSize={7} color="cyan.300" />
    </Box>
    <Text fontWeight="800" fontSize="sm" color="white" letterSpacing="0.5px">{label}</Text>
  </VStack>
);

export default AuthModal;