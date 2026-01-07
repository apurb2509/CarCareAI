import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
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
  SimpleGrid,
  Progress,
  GridItem,
} from '@chakra-ui/react';
import { FaUser, FaTools, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle, FaArrowLeft } from 'react-icons/fa';

const initialFormState = {
  name: '',
  phone: '',
  email: '',
  locality: '',
  pincode: '',
  state: '',
  password: '',
  agreed: false
};

const AuthModal = ({ isOpen, onClose, onLoginSuccess, initialStep = 1, initialRole = '', initialLogin = false }) => {
  
  const [step, setStep] = useState(initialStep);
  const [role, setRole] = useState(initialRole);
  const [isLogin, setIsLogin] = useState(initialLogin); // Initialize state
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formData, setFormData] = useState(initialFormState);
  
  // Sign In Specific State
  const [loginId, setLoginId] = useState(''); 
  const [loginPassword, setLoginPassword] = useState('');
  
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
      setRole(initialRole);
      setIsLogin(initialLogin); // <--- SET THIS TO TRUE IF PROP IS TRUE
      
      setConfirmPassword('');
      setShowPassword(false);
      setLoginId('');
      setLoginPassword('');
    } else {
      setFormData(initialFormState);
      setIsLogin(false);
    }
  }, [isOpen, initialStep, initialRole, initialLogin]); // Add initialLogin to dependency array

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
    "Meghalaya", "Mizoram", "Mumbai", "Nagaland", "Odisha", "Punjab", 
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
    "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const passwordsMatch = confirmPassword && formData.password && confirmPassword === formData.password;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  // SIGN IN LOGIC (Verifies against MongoDB Cluster)
 const handleLogin = async () => {
  try {
    const response = await fetch('http://localhost:5002/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        identifier: loginId, // MUST match the key in authroutes.js
        password: loginPassword 
      }),
    });

    const data = await response.json();

    if (response.ok) {
      onLoginSuccess(data); // Injects data into App state for UserProfile
      toast({ title: "Welcome Onboard!", status: "success", position: "top" });
      onClose();
    } else {
      // This displays the "Invalid credentials" message from your backend
      toast({ title: "Sign In Failed", description: data.message, status: "error", position: "top" });
    }
  } catch (error) {
    console.error("Connection Error:", error);
  }
};
  // REGISTRATION LOGIC
  const handleSubmit = async () => {
    try {
      const registrationData = { ...formData, role };
      const response = await fetch('http://localhost:5002/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (response.ok) {
        onLoginSuccess(data); 
        toast({ 
          title: "Welcome Onboard!",
          description: "Account created successfully.", 
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top"
        });
        onClose();
      } else {
        toast({
          title: "Registration Failed",
          description: data.message || "Something went wrong",
          status: "error",
          duration: 4000,
          position: "top"
        });
      }
    } catch (error) {
      console.error("Connection Error:", error);
    }
  };

  const getPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length > 5) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strengthScore = getPasswordStrength(formData.password);
  const strengthColor = strengthScore < 3 ? "red" : strengthScore < 5 ? "orange" : "green";
  const strengthLabel = strengthScore < 3 ? "Weak" : strengthScore < 5 ? "Medium" : "Strong";
  
  const validatePassword = (pass) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d|.*[!@#$%^&*]).{6,}$/.test(pass);

  const isFormValid = 
    formData.name.trim() !== '' &&
    formData.phone.trim().length >= 10 &&
    formData.locality.trim() !== '' &&
    formData.pincode.trim() !== '' &&
    formData.state !== '' &&
    validatePassword(formData.password) &&
    passwordsMatch &&
    formData.agreed;

  const cardStyle = {
    bg: "linear-gradient(145deg, #0f172a 0%, #1e293b 100%)",
    backdropFilter: "blur(20px)",
    border: "1px solid",
    borderColor: "rgba(100, 200, 255, 0.15)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(59, 130, 246, 0.15)",
    color: "white",
  };

  const inputStyle = {
    bg: "rgba(30, 41, 59, 0.5)",
    border: "1px solid",
    borderColor: "rgba(148, 163, 184, 0.2)",
    _focus: { 
      borderColor: "rgb(59, 130, 246)", 
      bg: "rgba(30, 41, 59, 0.7)", 
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" 
    },
    _hover: { 
      borderColor: "rgba(148, 163, 184, 0.3)",
      bg: "rgba(30, 41, 59, 0.6)" 
    },
    fontSize: "sm",
    borderRadius: "lg",
    color: "white",
    h: "44px"
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={(step === 1 && !isLogin) ? "2xl" : "xl"} scrollBehavior="inside">
      <ModalOverlay bg="rgba(0, 0, 0, 0.9)" backdropFilter="blur(8px)" />
      <ModalContent {...cardStyle} borderRadius="3xl" my="auto" maxH="95vh" overflow="hidden">
        <ModalCloseButton zIndex={10} color="gray.400" _hover={{ bg: "whiteAlpha.200", color: "white" }} size="lg"/>
        <ModalBody p={0} sx={{ '&::-webkit-scrollbar': { display: 'none' }, '&': { msOverflowStyle: 'none', scrollbarWidth: 'none' }}}>
          
          {isLogin ? (
            /* --- SIGN IN INTERFACE --- */
            <VStack spacing={6} p={{ base: 8, md: 12 }} align="stretch">
              <VStack spacing={2} align="center" mb={4}>
                <Text fontSize="3xl" fontWeight="800" bgGradient="linear(to-r, cyan.300, blue.500)" bgClip="text">Welcome Back</Text>
                <Text color="gray.400" fontSize="sm">Please enter your registered credentials</Text>
              </VStack>

              <FormControl isRequired>
                <FormLabel fontSize="xs" color="gray.500">Email or WhatsApp Number</FormLabel>
                <Input placeholder="Enter Email / Phone" {...inputStyle} value={loginId} onChange={(e) => setLoginId(e.target.value)} />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="xs" color="gray.500">Password</FormLabel>
                <InputGroup>
                  <Input type={showPassword ? "text" : "password"} placeholder="Enter your password" {...inputStyle} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                  <InputRightElement h="44px">
                    <IconButton variant="ghost" icon={showPassword ? <FaEyeSlash /> : <FaEye />} onClick={() => setShowPassword(!showPassword)} color="gray.400" _hover={{color: "white"}} aria-label="Toggle password"/>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button w="full" h="50px" bgGradient="linear(to-r, blue.400, blue.600)" color="white" _hover={{ transform: "translateY(-2px)", boxShadow: "0 10px 20px rgba(59, 130, 246, 0.3)" }} transition="all 0.3s" onClick={handleLogin}>
                Confirm Sign In
              </Button>

              <HStack justify="center" pt={4}>
                <Text fontSize="sm" color="gray.500">New to CarCareAI?</Text>
                <Button variant="link" color="cyan.400" fontSize="sm" onClick={() => setIsLogin(false)}>Create Account</Button>
              </HStack>
            </VStack>

          ) : step === 1 ? (
            /* --- ROLE SELECTION --- */
            <VStack spacing={8} p={{ base: 8, md: 12 }} align="center" justify="center" minH="400px">
              <VStack spacing={2}>
                <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="800" letterSpacing="tight" bgGradient="linear(to-r, cyan.300, blue.500)" bgClip="text">Welcome to CarCare.AI</Text>
                <Text fontSize="md" color="gray.400" fontWeight="500">Select your account type to get started</Text>
              </VStack>
              <VStack spacing={4} w="full" maxW="600px">
                <RoleCard icon={FaUser} title="Individual Account" desc="For vehicle owners seeking maintenance services" onClick={() => { setRole('user'); setStep(2); }} />
                <RoleCard icon={FaTools} title="Service Partner" desc="For garages and service stations" onClick={() => { setRole('service'); setStep(2); }} />
              </VStack>
              <HStack spacing={1} pt={4}>
                <Text fontSize="sm" color="gray.500">Already have an account?</Text>
                <Button variant="link" color="blue.400" fontSize="sm" fontWeight="600" onClick={() => setIsLogin(true)}>Sign In</Button>
              </HStack>
            </VStack>
          ) : (
            /* --- REGISTRATION FORM --- */
            <Box>
              <HStack px={6} py={4} justify="space-between" align="center" borderBottom="1px solid" borderColor="whiteAlpha.200" bg="rgba(30, 41, 59, 0.3)">
                <IconButton icon={<FaArrowLeft />} variant="ghost" color="blue.400" size="sm" onClick={() => setStep(1)} aria-label="Back"/>
                <Text fontSize="lg" fontWeight="700" color="gray.100">{role === 'service' ? 'Service Partner Registration' : 'Individual Registration'}</Text>
                <Box w={8} /> 
              </HStack>
              <VStack spacing={4} p={6} align="stretch">
                <SimpleGrid columns={2} spacing={3} w="full">
                  <GridItem colSpan={2}>
                    <FormControl isRequired>
                      <Input name="name" value={formData.name} placeholder={role === 'service' ? "Garage / Station Name" : "Full Name"} {...inputStyle} onChange={handleInputChange} />
                    </FormControl>
                  </GridItem>
                  <FormControl isRequired>
                    <Input name="phone" value={formData.phone} type="number" placeholder="WhatsApp Number" {...inputStyle} onChange={handleInputChange} />
                  </FormControl>
                  <FormControl>
                     <Input name="email" value={formData.email} type="email" placeholder="Email (Optional)" {...inputStyle} onChange={handleInputChange} />
                  </FormControl>
                  <FormControl isRequired>
                    <Input name="locality" value={formData.locality} placeholder="Area / Locality" {...inputStyle} onChange={handleInputChange} />
                  </FormControl>
                  <FormControl isRequired>
                    <Input name="pincode" value={formData.pincode} placeholder="Pincode" type="number" {...inputStyle} onChange={handleInputChange} />
                  </FormControl>
                  <GridItem colSpan={2}>
                    <FormControl isRequired>
                      <Select name="state" value={formData.state} placeholder="Select State" {...inputStyle} onChange={handleInputChange} sx={{ '> option': { background: '#1e293b', color: 'white' } }}>
                        {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
                      </Select>
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl isRequired>
                      <InputGroup>
                        <Input name="password" value={formData.password} placeholder="Create Password" type={showPassword ? "text" : "password"} {...inputStyle} onChange={handleInputChange} />
                        <InputRightElement width="3rem" h="44px">
                          <IconButton h="1.75rem" size="sm" variant="ghost" color="gray.400" onClick={() => setShowPassword(!showPassword)} icon={showPassword ? <FaEyeSlash /> : <FaEye />} aria-label="Toggle password"/>
                        </InputRightElement>
                      </InputGroup>
                      {formData.password && (
                        <Box mt={2}>
                          <Progress value={(strengthScore / 5) * 100} size="xs" colorScheme={strengthColor} borderRadius="full" bg="whiteAlpha.200" />
                          <HStack justify="space-between" mt={1}>
                            <Text fontSize="10px" color={`${strengthColor}.400`} fontWeight="600">{strengthLabel}</Text>
                          </HStack>
                        </Box>
                      )}
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl isRequired>
                      <InputGroup>
                        <Input placeholder="Confirm Password" type="password" value={confirmPassword} {...inputStyle} onChange={(e) => setConfirmPassword(e.target.value)} />
                        <InputRightElement h="44px">
                          {confirmPassword && <Icon as={passwordsMatch ? FaCheckCircle : FaTimesCircle} color={passwordsMatch ? "green.400" : "red.400"} boxSize={4} />}
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                  </GridItem>
                </SimpleGrid>
                <Checkbox name="agreed" isChecked={formData.agreed} colorScheme="blue" size="sm" onChange={handleInputChange} sx={{ '.chakra-checkbox__control': { borderColor: 'rgba(148, 163, 184, 0.3)', bg: 'rgba(30, 41, 59, 0.5)' } }}>
                  <Text fontSize="xs" color="gray.400">I agree to Terms & Conditions</Text>
                </Checkbox>
                <Button w="full" h="48px" bg={isFormValid ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" : "rgba(71, 85, 105, 0.5)"} color={isFormValid ? "white" : "rgba(148, 163, 184, 0.5)"} isDisabled={!isFormValid} onClick={handleSubmit} fontSize="md" fontWeight="700" borderRadius="xl">
                  Create Account
                </Button>
                <HStack justify="center">
                  <Text fontSize="xs" color="gray.500">Already have an account?</Text>
                  <Button variant="link" color="blue.400" fontSize="xs" onClick={() => setIsLogin(true)}>Sign In</Button>
                </HStack>
              </VStack>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const RoleCard = ({ icon, title, desc, onClick }) => (
  <HStack as="button" p={6} bg="rgba(30, 41, 59, 0.5)" borderRadius="2xl" border="1px solid" borderColor="rgba(148, 163, 184, 0.2)" transition="all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)" _hover={{ bg: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%)", borderColor: "rgb(59, 130, 246)", transform: "translateY(-4px) scale(1.02)", boxShadow: "0 20px 40px -15px rgba(59, 130, 246, 0.4)" }} onClick={onClick} w="full" align="center" spacing={5}>
    <Box p={4} bg="linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.15) 100%)" borderRadius="xl" color="blue.400" border="1px solid" borderColor="rgba(59, 130, 246, 0.3)">
      <Icon as={icon} boxSize={7} />
    </Box>
    <VStack align="start" spacing={0.5} flex={1}>
      <Text fontWeight="700" fontSize="xl" color="white" letterSpacing="tight">{title}</Text>
      <Text fontSize="sm" color="gray.400" fontWeight="500">{desc}</Text>
    </VStack>
  </HStack>
);

export default AuthModal;