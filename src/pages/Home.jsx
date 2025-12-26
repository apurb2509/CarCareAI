import React, { useLayoutEffect, useRef } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Container,
  Stack,
  SimpleGrid,
  Icon,
} from "@chakra-ui/react";
// 1. Correct Import for keyframes
import { keyframes } from "@emotion/react";
import {
  FaSearch,
  FaArrowRight,
  FaCogs,
  FaDatabase,
  FaMagic,
} from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "../layout/Footer";

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

// 2. Define Animation OUTSIDE the component to avoid scope errors
const blink = keyframes`
  0% { opacity: 1; box-shadow: 0 0 10px #48BB78; }
  50% { opacity: 0.4; box-shadow: 0 0 2px #48BB78; }
  100% { opacity: 1; box-shadow: 0 0 10px #48BB78; }
`;

const Home = () => {
  const mainRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. HERO PARALLAX
      gsap.to(".hero-content", {
        yPercent: 50,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // 2. BLUR REVEAL
      const blurSections = gsap.utils.toArray(".gsap-blur-reveal");
      blurSections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, filter: "blur(15px)", y: 60 },
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 90%",
              end: "top 60%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // 3. NEON LINE
      gsap.fromTo(
        ".neon-line",
        {
          scaleY: 0,
          boxShadow: "0px 0px 0px rgba(0, 255, 255, 0)",
          backgroundColor: "#333",
        },
        {
          scaleY: 1,
          backgroundColor: "#0BC5EA",
          boxShadow:
            "0px 0px 20px rgba(11, 197, 234, 0.8), 0px 0px 40px rgba(11, 197, 234, 0.4)",
          ease: "none",
          scrollTrigger: {
            trigger: ".vision-section",
            start: "top 60%",
            end: "bottom 80%",
            scrub: 1,
          },
        }
      );

      // 4. STAGGERED CARDS
      gsap.from(".feature-card", {
        y: 80,
        opacity: 0,
        filter: "blur(10px)",
        duration: 1,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".features-grid",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <Box ref={mainRef}>
      {/* 1. HERO SECTION */}
      <Box
        className="hero-section"
        h="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
      >
        <Container maxW="container.xl" className="hero-content">
          <Stack spacing={8} textAlign="center" alignItems="center">
            
            {/* HACKER GREEN BADGE */}
            <Box
              className="gsap-blur-reveal"
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              px={4}
              py={2}
              bg="rgba(0, 20, 0, 0.6)"
              border="1px solid"
              borderColor="green.500"
              borderRadius="sm"
              boxShadow="0 0 20px rgba(72, 187, 120, 0.3), inset 0 0 10px rgba(72, 187, 120, 0.1)"
              backdropFilter="blur(5px)"
            >
              {/* Beeping Dot */}
              <Box
                w="8px"
                h="8px"
                bg="green.400"
                borderRadius="full"
                mr={3}
                animation={`${blink} 1.5s infinite ease-in-out`}
              />

              {/* Text */}
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                letterSpacing="0.2em"
                fontWeight="bold"
                color="green.400"
                textTransform="uppercase"
                fontFamily="'Courier New', Courier, monospace"
                textShadow="0 0 8px rgba(72, 187, 120, 0.8)"
              >
                Server Online
              </Text>
            </Box>

            {/* LARGE HERO HEADING */}
            <Heading
              className="gsap-blur-reveal"
              fontSize={{ base: "50px", md: "55px", lg: "60px", xl: "70px" }}
              fontWeight="900"
              lineHeight="0.9"
              letterSpacing="-0.03em"
              bgGradient="linear(to-b, white, gray.600)"
              bgClip="text"
              py={4}
            >
              INTELLIGENT <br />
              AUTOMOTIVE CARE
            </Heading>

            {/* SUBTEXT */}
            <Text
              className="gsap-blur-reveal"
              fontSize={{ base: "xl", md: "3xl" }}
              color="gray.400"
              maxW="4xl"
              lineHeight="1.4"
            >
              The first AI-driven ecosystem bridging the gap between <br />
              modern machines and master mechanics.
            </Text>

            {/* BUTTONS */}
            <Stack
              className="gsap-blur-reveal"
              direction={{ base: "column", sm: "row" }}
              spacing={8}
              pt={10}
            >
              <Button
                size="lg"
                h="70px"
                px="50px"
                fontSize="xl"
                bg="white"
                color="black"
                rounded="full"
                _hover={{ bg: "gray.200", transform: "scale(1.05)" }}
                rightIcon={<FaSearch />}
              >
                Locate Service
              </Button>
              <Button
                size="lg"
                h="70px"
                px="50px"
                fontSize="xl"
                variant="outline"
                color="white"
                rounded="full"
                borderColor="whiteAlpha.400"
                _hover={{ bg: "whiteAlpha.100" }}
                rightIcon={<FaArrowRight />}
              >
                Register Garage
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* 2. ABOUT SECTION */}
      <Box py={32} bg="blackAlpha.600">
        <Container maxW="container.lg">
          <Stack spacing={12}>
            <Text
              className="gsap-blur-reveal"
              color="cyan.500"
              fontWeight="bold"
              letterSpacing="widest"
              fontSize={{ base: "sm", md: "lg", lg: "2xl" }}
            >
              01 — THE MISSION
            </Text>
            <Heading
              className="gsap-blur-reveal"
              size={{ base: "3xl", md: "6xl", lg: "7xl", xl: "8xl" }}
              lineHeight="1.1"
            >
              We are removing the guesswork <br /> from vehicle maintenance.
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={16}>
              <Text
                className="gsap-blur-reveal"
                fontSize="xl"
                color="gray.400"
                lineHeight="1.8"
              >
                CarCareAI is not just a directory. It is a real-time
                intelligence engine. We analyze your vehicle's specific make,
                model, and mileage to predict needs before they become failures.
              </Text>
              <Text
                className="gsap-blur-reveal"
                fontSize="xl"
                color="gray.400"
                lineHeight="1.8"
              >
                By connecting you directly with service centers that have your
                specific parts in stock, we reduce repair times by an average of
                40%. No more waiting. No more uncertainty.
              </Text>
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      {/* 3. VISION & GOALS */}
      <Box py={24} className="vision-section" position="relative">
        <Container maxW="container.xl">
          <Stack
            direction={{ base: "column", lg: "row" }}
            spacing={0}
            align="stretch"
          >
            <Box flex={1} py={10} pr={{ lg: 20 }}>
              <Heading
                className="gsap-blur-reveal"
                size="3xl"
                mb={8}
                color="white"
              >
                Vision
              </Heading>
              <Text
                className="gsap-blur-reveal"
                fontSize="2xl"
                color="gray.500"
              >
                To create a frictionless world where your car communicates its
                own needs to a network of trusted professionals, handling the
                logistics so you don't have to.
              </Text>
            </Box>
            <Box
              position="relative"
              w={{ base: "0px", lg: "2px" }}
              display={{ base: "none", lg: "block" }}
            >
              <Box
                position="absolute"
                top="0"
                bottom="0"
                left="0"
                w="2px"
                bg="gray.800"
              />
              <Box
                className="neon-line"
                position="absolute"
                top="0"
                left="0"
                w="2px"
                h="100%"
                transformOrigin="top"
              />
            </Box>
            <Box flex={1} py={10} pl={{ lg: 20 }}>
              <Heading
                className="gsap-blur-reveal"
                size="3xl"
                mb={8}
                color="white"
              >
                Goals
              </Heading>
              <Stack spacing={8}>
                <Box className="gsap-blur-reveal">
                  <Text fontSize="xl" fontWeight="bold" color="cyan.200">
                    Accuracy
                  </Text>
                  <Text color="gray.500">
                    99.9% match rate for spare parts.
                  </Text>
                </Box>
                <Box className="gsap-blur-reveal">
                  <Text fontSize="xl" fontWeight="bold" color="cyan.200">
                    Speed
                  </Text>
                  <Text color="gray.500">
                    Instant booking confirmation via AI.
                  </Text>
                </Box>
                <Box className="gsap-blur-reveal">
                  <Text fontSize="xl" fontWeight="bold" color="cyan.200">
                    Trust
                  </Text>
                  <Text color="gray.500">
                    Blockchain-verified service history.
                  </Text>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* 4. UNIQUE FEATURES */}
      <Box py={32}>
        <Container maxW="container.xl">
          <Heading
            className="gsap-blur-reveal"
            textAlign="center"
            size="2xl"
            mb={20}
          >
            Engineered for Excellence
          </Heading>
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={10}
            className="features-grid"
          >
            <Box
              className="feature-card"
              p={8}
              bg="rgba(255,255,255,0.03)"
              border="1px solid rgba(255,255,255,0.1)"
              borderRadius="2xl"
            >
              <Icon as={FaMagic} w={10} h={10} color="purple.400" mb={6} />
              <Heading size="lg" mb={4}>
                Predictive AI
              </Heading>
              <Text color="gray.400" fontSize="lg">
                Our model doesn't just find mechanics; it finds specialists for
                your specific engine fault codes.
              </Text>
            </Box>
            <Box
              className="feature-card"
              p={8}
              bg="rgba(255,255,255,0.03)"
              border="1px solid rgba(255,255,255,0.1)"
              borderRadius="2xl"
            >
              <Icon as={FaDatabase} w={10} h={10} color="cyan.400" mb={6} />
              <Heading size="lg" mb={4}>
                Live Inventory
              </Heading>
              <Text color="gray.400" fontSize="lg">
                We sync with garage databases to ensure the parts you need are
                physically on the shelf.
              </Text>
            </Box>
            <Box
              className="feature-card"
              p={8}
              bg="rgba(255,255,255,0.03)"
              border="1px solid rgba(255,255,255,0.1)"
              borderRadius="2xl"
            >
              <Icon as={FaCogs} w={10} h={10} color="pink.400" mb={6} />
              <Heading size="lg" mb={4}>
                3D Diagnostics
              </Heading>
              <Text color="gray.400" fontSize="lg">
                Visualize your car's health with our immersive 3D digital twin
                technology.
              </Text>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Home;