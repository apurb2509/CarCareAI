import React from 'react';
import { Box, Container, Stack, Text, SimpleGrid, Icon, Input, Button, Heading } from '@chakra-ui/react';
import { FaTwitter, FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Footer = ({ onRegisterGarageClick }) => {
  const navigate = useNavigate();
  return (
    <Box bg="slate-bg" borderTop="1px solid" borderColor="border-color" color="text-muted" mt={20} position="relative" zIndex="10">
      <Container maxW="container.xl" py={16}>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10}>
          
          {/* Brand */}
          <Stack spacing={4} gridColumn={{ md: "span 2" }}>
             <Heading size="lg" color="text-primary">CarCareAI</Heading>
             <Text fontSize="sm" maxW="md">
               Bridging the gap between vehicle owners and service providers with advanced AI intelligence. 
               Experience the future of automotive care today.
             </Text>
             <Stack direction="row" spacing={4}>
               <Icon as={FaTwitter} w={5} h={5} _hover={{ color: "cyan.400" }} cursor="pointer" />
               <Icon as={FaGithub} w={5} h={5} _hover={{ color: "white" }} cursor="pointer" />
               <Icon as={FaLinkedin} w={5} h={5} _hover={{ color: "blue.500" }} cursor="pointer" />
             </Stack>
          </Stack>

          {/* Links */}
          <Stack align="flex-start">
            <Text fontWeight="bold" color="text-primary" mb={2}>Platform</Text>
            <Text cursor="pointer" _hover={{ color: "cyan.400" }} onClick={() => navigate('/find-services')}>Find a Garage</Text>
            <Text cursor="pointer" _hover={{ color: "cyan.400" }} onClick={onRegisterGarageClick}>Register Service Center</Text>
            <Text cursor="pointer" _hover={{ color: "cyan.400" }} onClick={() => navigate('/pricing')}>Pricing</Text>
            <Text cursor="pointer" _hover={{ color: "cyan.400" }} onClick={() => navigate('/my-garage')}>Mechanic Portal</Text>
          </Stack>

          {/* Newsletter */}
          <Stack align="flex-start">
            <Text fontWeight="bold" color="text-primary" mb={2}>Stay Updated</Text>
            <Stack direction="row">
              <Input placeholder="Your email" bg="slate-bg" border="1px solid" borderColor="border-color" _focus={{ borderColor: "cyan.500", boxShadow: "0 0 0 1px #0EA5E9" }} />
              <Button bg="cyan.500" color="gray.900" _hover={{ bg: "cyan.400" }}><Icon as={FaEnvelope} /></Button>
            </Stack>
          </Stack>
          
        </SimpleGrid>
        
        <Text pt={10} fontSize="xs" textAlign="center" borderTop="1px solid" borderColor="border-color" mt={10}>
          © 2026 CarCareAI. Built for the Future.
        </Text>
      </Container>
    </Box>
  );
};

export default Footer;