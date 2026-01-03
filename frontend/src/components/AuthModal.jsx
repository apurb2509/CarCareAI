import React, { useState } from 'react';
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
  Divider,
} from '@chakra-ui/react';
import { FaUser, FaTools, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle, FaArrowLeft } from 'react-icons/fa';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const toast = useToast();

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Mumbai"
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

  // FIX: Derived state (No useEffect needed, solves the error)
  const passwordsMatch = confirmPassword && formData.password && confirmPassword === formData.password;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const validatePassword = (pass) => {
    // Uppercase, Lowercase, Number/Special Char
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
    // Pass the user name back to parent to show Profile Icon
    onLoginSuccess({ name: formData.name, role: role });
    
    toast({ 
      title: "Welcome aboard!", 
      description: `You are now signed in as ${formData.name}`, 
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top"
    });
    onClose();
  };

  // Card Style (Compact & Cyan Theme)
  const cardStyle = {
    bg: "rgba(10, 15, 30, 0.95)", // Deep Navy
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(0, 245, 255, 0.2)",
    boxShadow: "0 0 40px rgba(0,0,0,0.8), 0 0 10px rgba(0,255,255,0.1)",
    color: "white",
  };

  // Input Style
  const inputStyle = {
    bg: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.05)",
    _focus: { borderColor: "cyan.400", bg: "rgba(0,255,255,0.05)", boxShadow: "0 0 8px rgba(0,255,255,0.2)" },
    _hover: { bg: "rgba(255,255,255,0.06)" },
    fontSize: "sm",
    borderRadius: "md"
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      isCentered 
      size="sm" // Compact size
      scrollBehavior="inside" // Prevents overflow on small screens
    >
      <ModalOverlay bg="rgba(0, 0, 0, 0.85)" backdropFilter="blur(5px)" />
      
      <ModalContent {...cardStyle} borderRadius="2xl" my="auto">
        <ModalCloseButton zIndex={10} />
        
        <ModalBody p={0}>
          {step === 1 ? (
            // STEP 1: ROLE SELECTION
            <VStack spacing={6} p={8} align="center" justify="center" minH="400px">
              <VStack spacing={2}>
                <Text fontSize="2xl" fontWeight="800" letterSpacing="tight">
                  Welcome to <Text as="span" color="cyan.400">CarCare</Text>
                </Text>
                <Text fontSize="sm" color="gray.400">Choose your account type</Text>
              </VStack>

              <VStack w="full" spacing={4}>
                <RoleCard 
                  icon={FaUser} 
                  title="Vehicle Owner" 
                  desc="I want to book services"
                  onClick={() => { setRole('user'); setStep(2); }} 
                />
                <RoleCard 
                  icon={FaTools} 
                  title="Service Partner" 
                  desc="I own a garage/station"
                  onClick={() => { setRole('service'); setStep(2); }} 
                />
              </VStack>
            </VStack>
          ) : (
            // STEP 2: REGISTRATION FORM
            <Box>
              {/* Header */}
              <HStack p={6} pb={2} justify="space-between" align="center">
                <IconButton 
                  icon={<FaArrowLeft />} 
                  variant="ghost" 
                  color="cyan.400" 
                  size="sm" 
                  onClick={() => setStep(1)}
                  _hover={{ bg: "whiteAlpha.100" }}
                />
                <Text fontSize="lg" fontWeight="bold">Create Account</Text>
                <Box w={8} /> {/* Spacer for centering */}
              </HStack>
              
              <Divider borderColor="whiteAlpha.100" />

              {/* Form Fields */}
              <VStack spacing={4} p={6} align="stretch">
                
                <FormControl isRequired>
                  <Input name="name" placeholder="Full Name" {...inputStyle} onChange={handleInputChange} />
                </FormControl>

                <HStack>
                  <FormControl isRequired>
                    <Input name="phone" type="number" placeholder="WhatsApp No." {...inputStyle} onChange={handleInputChange} />
                  </FormControl>
                  <FormControl>
                     <Input name="email" type="email" placeholder="Email (Opt)" {...inputStyle} onChange={handleInputChange} />
                  </FormControl>
                </HStack>

                <HStack>
                  <FormControl isRequired>
                    <Input name="locality" placeholder="Locality" {...inputStyle} onChange={handleInputChange} />
                  </FormControl>
                  <FormControl isRequired w="40%">
                    <Input name="pincode" placeholder="Pin" type="number" {...inputStyle} onChange={handleInputChange} />
                  </FormControl>
                </HStack>

                <FormControl isRequired>
                  <Select 
                    name="state" 
                    placeholder="Select State" 
                    {...inputStyle}
                    onChange={handleInputChange}
                    sx={{ '> option': { background: '#0a1929', color: 'white' } }}
                  >
                    {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <InputGroup>
                    <Input 
                      name="password"
                      placeholder="Password (Abc@123)"
                      type={showPassword ? "text" : "password"} 
                      {...inputStyle}
                      onChange={handleInputChange}
                    />
                    <InputRightElement width="3rem">
                      <IconButton h="1.5rem" size="sm" variant="link" color="gray.400" onClick={() => setShowPassword(!showPassword)} icon={showPassword ? <FaEyeSlash /> : <FaEye />} />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <InputGroup>
                    <Input 
                      placeholder="Confirm Password"
                      type="password"
                      {...inputStyle}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement>
                      {confirmPassword && (
                        <Icon as={passwordsMatch ? FaCheckCircle : FaTimesCircle} color={passwordsMatch ? "green.400" : "red.400"} />
                      )}
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Checkbox 
                  name="agreed" 
                  colorScheme="cyan" 
                  size="sm" 
                  onChange={handleInputChange}
                  pt={2}
                >
                  <Text fontSize="xs" color="gray.400">I agree to Terms & Conditions</Text>
                </Checkbox>

                <Button 
                  w="full" 
                  h="45px"
                  mt={2}
                  bg={isFormValid ? "linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%)" : "whiteAlpha.100"}
                  color={isFormValid ? "white" : "whiteAlpha.400"}
                  cursor={isFormValid ? "pointer" : "not-allowed"}
                  _hover={isFormValid ? { transform: "translateY(-1px)", boxShadow: "0 0 15px rgba(0,210,255,0.4)" } : {}}
                  transition="all 0.3s"
                  onClick={isFormValid ? handleSubmit : undefined}
                >
                  Create Account
                </Button>

              </VStack>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

// Sub-component for Role Selection
const RoleCard = ({ icon, title, desc, onClick }) => (
  <HStack 
    w="full" 
    p={4} 
    bg="whiteAlpha.50" 
    borderRadius="xl" 
    cursor="pointer" 
    transition="all 0.2s"
    border="1px solid transparent"
    _hover={{ bg: "whiteAlpha.100", borderColor: "cyan.500", transform: "scale(1.02)" }}
    onClick={onClick}
  >
    <Box p={3} bg="rgba(0,255,255,0.1)" borderRadius="lg" color="cyan.400">
      <Icon as={icon} boxSize={5} />
    </Box>
    <VStack align="start" spacing={0}>
      <Text fontWeight="bold" fontSize="md">{title}</Text>
      <Text fontSize="xs" color="gray.500">{desc}</Text>
    </VStack>
  </HStack>
);

export default AuthModal;