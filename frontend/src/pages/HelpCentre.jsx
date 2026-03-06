import React, { useState } from 'react';
import {
  Box, Container, Heading, Text, VStack, HStack, FormControl, FormLabel, Input,
  Textarea, Select, Button, useToast, InputGroup, InputLeftAddon, Card, CardBody, Icon,
} from '@chakra-ui/react';
import { FaHeadset, FaPaperPlane } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

const HelpCentre = () => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    country_code: '+91', // Default to India
    phone_number: '',
    issue_type: '',
    message: '',
  });

  const countryCodes = [
    { code: '+91', country: 'IN' },
    { code: '+1', country: 'US/CA' },
    { code: '+44', country: 'UK' },
    { code: '+61', country: 'AU' },
    { code: '+971', country: 'AUS' },
  ];

  const issueOptions = [
    'General Servicing',
    'Major Repair',
    'Parts & Inventory',
    'Booking & Appointments',
    'Pricing & Billing',
    'CRM / Account Issue',
    'Other',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // ==========================================
    // YOUR ACTUAL EMAILJS IDs
    // ==========================================
    const serviceID = 'carcareai_gmail'; 
    const adminTemplateID = 'template_0ej0ehr';   // Your Contact Us Template
    const userTemplateID = 'template_osfinwl';    // Your New Auto-Reply Template
    const publicKey = 'Nefz7HTuVlasibv7f'; 

    // The keys in this object must perfectly match the {{variables}} in your EmailJS template!
    const templateParams = {
      user_name: formData.user_name,
      user_email: formData.user_email,
      country_code: formData.country_code,
      phone_number: formData.phone_number,
      issue_type: formData.issue_type,
      message: formData.message,
    };

    // Send BOTH emails simultaneously
    Promise.all([
      // 1. Sends the notification to Admin (carcareai00@gmail.com)
      emailjs.send(serviceID, adminTemplateID, templateParams, publicKey),
      
      // 2. Sends the Auto-Reply to the User
      emailjs.send(serviceID, userTemplateID, templateParams, publicKey)
    ])
      .then((responses) => {
        console.log('SUCCESS! Both emails sent.', responses);
        toast({
          title: "Request Sent Successfully!",
          description: "We've sent a confirmation to your email. Our team will contact you soon.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        // Clear form
        setFormData({
          user_name: '', user_email: '', country_code: '+91', phone_number: '', issue_type: '', message: ''
        });
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('FAILED...', err);
        toast({
          title: "Failed to send request.",
          description: "Something went wrong. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setIsLoading(false);
      });
  };

  return (
    <Box pt={24} pb={10} px={6} minH="100vh" color="white">
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
          
          <Box textAlign="center">
            <Icon as={FaHeadset} w={12} h={12} color="cyan.400" mb={4} />
            <Heading size="2xl" mb={4} bgGradient="linear(to-r, cyan.300, blue.500)" bgClip="text">
              How can we help you?
            </Heading>
            <Text color="gray.400" fontSize="lg">
              Fill out the form below and our support team will get back to you within 24 hours.
            </Text>
          </Box>

          <Card 
            bg="rgba(15, 23, 42, 0.6)" 
            backdropFilter="blur(16px)" 
            border="1px solid" 
            borderColor="whiteAlpha.200"
            borderRadius="2xl"
            boxShadow="0 0 40px rgba(0, 255, 255, 0.05)"
          >
            <CardBody p={{ base: 6, md: 10 }}>
              <form onSubmit={handleSubmit}>
                <VStack spacing={6}>
                  
                  {/* NAME */}
                  <FormControl isRequired>
                    <FormLabel color="cyan.300">Full Name</FormLabel>
                    <Input 
                      name="user_name"
                      value={formData.user_name}
                      onChange={handleChange}
                      placeholder="Write your name.." 
                      bg="blackAlpha.400" 
                      border="1px solid" 
                      borderColor="whiteAlpha.200"
                      _focus={{ borderColor: "cyan.400", boxShadow: "0 0 0 1px #0BC5EA" }}
                    />
                  </FormControl>

                  <HStack w="full" spacing={6} align="flex-start" flexDirection={{ base: "column", md: "row" }}>
                    {/* EMAIL */}
                    <FormControl isRequired>
                      <FormLabel color="cyan.300">Email Address</FormLabel>
                      <Input 
                        type="email"
                        name="user_email"
                        value={formData.user_email}
                        onChange={handleChange}
                        placeholder="Email ID" 
                        bg="blackAlpha.400" 
                        border="1px solid" 
                        borderColor="whiteAlpha.200"
                        _focus={{ borderColor: "cyan.400", boxShadow: "0 0 0 1px #0BC5EA" }}
                      />
                    </FormControl>

                    {/* PHONE */}
                    <FormControl isRequired>
                      <FormLabel color="cyan.300">Phone Number</FormLabel>
                      <InputGroup>
                        <InputLeftAddon bg="blackAlpha.500" border="1px solid" borderColor="whiteAlpha.200" p={0}>
                          <Select 
                            name="country_code"
                            value={formData.country_code}
                            onChange={handleChange}
                            border="none" 
                            _focus={{ boxShadow: 'none' }}
                            w="80px"
                            cursor="pointer"
                          >
                            {countryCodes.map((c) => (
                              <option key={c.code} value={c.code} style={{ color: 'black' }}>
                                {c.code}
                              </option>
                            ))}
                          </Select>
                        </InputLeftAddon>
                        <Input 
                          type="tel"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleChange}
                          placeholder="9876543210" 
                          bg="blackAlpha.400" 
                          border="1px solid" 
                          borderColor="whiteAlpha.200"
                          _focus={{ borderColor: "cyan.400", boxShadow: "0 0 0 1px #0BC5EA" }}
                        />
                      </InputGroup>
                    </FormControl>
                  </HStack>

                  {/* ISSUE TYPE */}
                  <FormControl isRequired>
                    <FormLabel color="cyan.300">Issue Type</FormLabel>
                    <Select 
                      name="issue_type"
                      value={formData.issue_type}
                      onChange={handleChange}
                      placeholder="Select the type of issue" 
                      bg="blackAlpha.400" 
                      border="1px solid" 
                      borderColor="whiteAlpha.200"
                      _focus={{ borderColor: "cyan.400", boxShadow: "0 0 0 1px #0BC5EA" }}
                      color={formData.issue_type ? "white" : "gray.400"}
                    >
                      {issueOptions.map((issue) => (
                        <option key={issue} value={issue} style={{ color: 'black' }}>{issue}</option>
                      ))}
                    </Select>
                  </FormControl>

                  {/* MESSAGE */}
                  <FormControl isRequired>
                    <FormLabel color="cyan.300">Detailed Message</FormLabel>
                    <Textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please describe your issue in detail..." 
                      rows={5}
                      bg="blackAlpha.400" 
                      border="1px solid" 
                      borderColor="whiteAlpha.200"
                      _focus={{ borderColor: "cyan.400", boxShadow: "0 0 0 1px #0BC5EA" }}
                    />
                  </FormControl>

                  {/* SUBMIT BUTTON */}
                  <Button 
                    type="submit"
                    w="full" 
                    size="lg" 
                    bg="cyan.500" 
                    color="gray.900"
                    fontWeight="bold"
                    _hover={{ bg: "cyan.400", transform: "translateY(-2px)", boxShadow: "0 5px 15px rgba(0, 255, 255, 0.4)" }}
                    transition="all 0.3s ease"
                    leftIcon={<FaPaperPlane />}
                    isLoading={isLoading}
                    loadingText="Sending..."
                  >
                    Submit Request
                  </Button>

                </VStack>
              </form>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default HelpCentre;