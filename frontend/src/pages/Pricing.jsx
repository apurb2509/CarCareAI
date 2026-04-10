import React from 'react';
import { Box, Container, Heading, Text, SimpleGrid, Card, CardHeader, CardBody, VStack, HStack, Divider, Badge, Icon } from '@chakra-ui/react';
import { FaWrench, FaCarSide, FaCarBattery, FaOilCan, FaSnowflake, FaShower } from 'react-icons/fa';

const Pricing = () => {
  const categories = [
    {
      title: "General Servicing",
      icon: FaWrench,
      items: [
        { name: "Basic Service", price: "₹1,499 - ₹2,499", desc: "Oil change, air filter, basic checkup" },
        { name: "Comprehensive Service", price: "₹3,999 - ₹6,499", desc: "Full engine check, fluid top-ups, alignment" },
        { name: "AC Servicing", price: "₹1,200 - ₹2,500", desc: "Gas top-up, filter clean, vent sanitization" }
      ]
    },
    {
      title: "Common Parts",
      icon: FaOilCan,
      items: [
        { name: "Engine Oil (Synthetic 4L)", price: "₹2,500 - ₹4,500", desc: "Premium grade 5W-30 / 5W-40" },
        { name: "Brake Pads (Pair)", price: "₹1,500 - ₹3,500", desc: "OEM or premium ceramic replacements" },
        { name: "Spark Plugs (Set of 4)", price: "₹800 - ₹1,800", desc: "Iridium / Platinum long life" },
        { name: "Cabin Air Filter", price: "₹350 - ₹900", desc: "Charcoal activated filters" }
      ]
    },
    {
      title: "Washing & Detailing",
      icon: FaShower,
      items: [
        { name: "Exterior Foam Wash", price: "₹399 - ₹699", desc: "Deep cleaning, underbody, tyre polish" },
        { name: "Interior Dry Cleaning", price: "₹999 - ₹1,800", desc: "Seat shampoo, roof liner, vacuuming" },
        { name: "Teflon / Rubbing Polish", price: "₹1,500 - ₹3,000", desc: "Scratch removal, paint protection" },
        { name: "Ceramic Coating", price: "₹9,000 - ₹25,000", desc: "9H+ hardness, 2-5 year protection" }
      ]
    },
    {
      title: "Accessories & Upgrades",
      icon: FaCarSide,
      items: [
        { name: "Dashboard Cameras", price: "₹3,500 - ₹12,000", desc: "Dual channel, parking monitor" },
        { name: "PU Leather Seat Covers", price: "₹4,500 - ₹15,000", desc: "Custom fit, bucket styling" },
        { name: "Android Infotainment", price: "₹7,500 - ₹22,000", desc: "9-inch, wireless CarPlay / Android Auto" }
      ]
    }
  ];

  return (
    <Box pt={24} pb={20} px={6} minH="100vh" color="white" bg="transparent">
      <Container maxW="container.xl">
        <VStack spacing={4} textAlign="center" mb={16}>
          <Heading size="2xl" bgGradient="linear(to-r, cyan.400, blue.500)" bgClip="text" fontWeight="900">
            Transparent Pricing
          </Heading>
          <Text color="gray.400" fontSize="lg" maxW="2xl">
            A comprehensive guide to standard Indian automotive costs. Prices vary based on vehicle make, model, and city. You can book custom quotes from local garages.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
          {categories.map((cat, index) => (
            <Card 
              key={index} 
              bg="rgba(15, 23, 42, 0.75)" 
              backdropFilter="blur(20px)" 
              border="1px solid" 
              borderColor="#1E293B"
              borderRadius="2xl"
              boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(14, 165, 233, 0.05)"
              transition="all 0.3s"
              _hover={{ transform: "translateY(-5px)", borderColor: "cyan.500", boxShadow: "0 15px 30px -10px rgba(14, 165, 233, 0.2)" }}
            >
              <CardHeader pb={0}>
                <HStack spacing={4}>
                  <Box p={3} bg="rgba(30, 41, 59, 0.8)" borderRadius="lg" color="cyan.400">
                    <Icon as={cat.icon} boxSize={6} />
                  </Box>
                  <Heading size="md" color="white">{cat.title}</Heading>
                </HStack>
              </CardHeader>

              <CardBody>
                <VStack spacing={4} align="stretch" mt={2}>
                  {cat.items.map((item, idx) => (
                    <Box key={idx}>
                      {idx > 0 && <Divider borderColor="#1E293B" mb={4} />}
                      <HStack justify="space-between" align="start">
                        <VStack align="start" spacing={1} maxW="70%">
                          <Text fontWeight="bold" fontSize="lg" color="white">{item.name}</Text>
                          <Text fontSize="sm" color="gray.400">{item.desc}</Text>
                        </VStack>
                        <Badge 
                          px={3} py={1} 
                          borderRadius="md" 
                          bg="rgba(14, 165, 233, 0.15)" 
                          color="cyan.300"
                          border="1px solid rgba(14, 165, 233, 0.3)"
                          fontSize="sm"
                        >
                          {item.price}
                        </Badge>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default Pricing;
