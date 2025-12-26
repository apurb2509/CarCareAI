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

// 1. Blink Animation
const blink = keyframes`
  0% { opacity: 1; box-shadow: 0 0 10px #48BB78; }
  50% { opacity: 0.4; box-shadow: 0 0 2px #48BB78; }
  100% { opacity: 1; box-shadow: 0 0 10px #48BB78; }
`;

const Home = () => {
  const mainRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // =========================================================
      // 1. HERO ANIMATIONS
      // =========================================================
      
      // Initial Reveal (Timeline)
      const tl = gsap.timeline();
      tl.from(".hero-animate", {
        y: 50,
        opacity: 0,
        filter: "blur(10px)",
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2,
      });

      // Blur OUT on Scroll (The effect you want replicated)
      gsap.to(".hero-top-content", {
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        opacity: 0,
        filter: "blur(5px)",
        y: -50,
        ease: "none",
      });

      // Parallax
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

      // =========================================================
      // 2. MISSION & VISION ANIMATIONS
      // =========================================================

      // A. ENTRY ANIMATION (Slide Up - existing)
      const slideSections = gsap.utils.toArray(".gsap-slide-up");
      slideSections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              end: "top 60%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // B. EXIT ANIMATION (Blur OUT - NEW)
      // This replicates the Hero blur effect for Mission Section
      gsap.to(".mission-content", {
        scrollTrigger: {
          trigger: ".mission-content",
          start: "top 20%", // Start blurring when it nears the top
          end: "bottom top", // Fully blurred when it leaves
          scrub: true,
        },
        opacity: 0,
        filter: "blur(5px)", // Same blur amount as hero
        y: -50,
        ease: "none",
      });

      // C. EXIT ANIMATION (Blur OUT - NEW)
      // This replicates the Hero blur effect for Vision/Goals Section
      gsap.to(".vision-goals-content", {
        scrollTrigger: {
          trigger: ".vision-goals-content",
          start: "top 20%",
          end: "bottom top",
          scrub: true,
        },
        opacity: 0,
        filter: "blur(5px)",
        y: -50,
        ease: "none",
      });

      // =========================================================
      // 3. OTHER ANIMATIONS
      // =========================================================

      // Long Neon Line
      gsap.fromTo(
        ".neon-line-long",
        { scaleY: 0, backgroundColor: "#333", boxShadow: "none" },
        {
          scaleY: 1,
          backgroundColor: "#0BC5EA",
          boxShadow: "0px 0px 20px rgba(11, 197, 234, 0.6)",
          ease: "none",
          scrollTrigger: {
            trigger: ".mission-vision-wrapper",
            start: "top 40%",
            end: "bottom 80%",
            scrub: 1,
          },
        }
      );

      // Staggered Cards (Unique Features)
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
    <Box ref={mainRef} w="100%" overflowX="hidden">
      {/* 1. HERO SECTION */}
      <Box
        className="hero-section"
        h="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        position="relative"
      >
        <Container maxW="container.xl" className="hero-content">
          <Box className="hero-top-content">
            <Stack spacing={6} textAlign="center" alignItems="center">
              {/* BADGE */}
              <Box
                className="hero-animate"
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
                <Box
                  w="8px"
                  h="8px"
                  bg="green.400"
                  borderRadius="full"
                  mr={3}
                  animation={`${blink} 1.5s infinite ease-in-out`}
                />
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

              <Heading
                className="hero-animate"
                fontSize={{ base: "50px", md: "55px", lg: "60px", xl: "70px" }}
                fontWeight="900"
                lineHeight="0.9"
                letterSpacing="-0.03em"
                bgGradient="linear(to-b, white, gray.600)"
                bgClip="text"
                py={2}
              >
                INTELLIGENT <br />
                AUTOMOTIVE CARE
              </Heading>

              <Text
                className="hero-animate"
                fontSize={{ base: "xl", md: "3xl" }}
                color="gray.400"
                maxW="4xl"
                lineHeight="1.3"
              >
                The first AI-driven ecosystem bridging the gap between <br />
                modern machines and master mechanics.
              </Text>

              <Stack
                className="hero-animate"
                direction={{ base: "column", sm: "row" }}
                spacing={8}
                pt={6}
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
          </Box>
        </Container>
      </Box>

      {/* WRAPPER FOR MISSION & VISION */}
      <Box
        className="mission-vision-wrapper"
        position="relative"
        bg="blackAlpha.600"
      >
        <Container maxW="container.lg" position="relative">
          {/* THE LONG NEON LINE */}
          <Box
            position="absolute"
            left="50%"
            top={{ lg: "280px" }}
            bottom="0"
            w="2px"
            bg="gray.800"
            transform="translateX(-50%)"
            display={{ base: "none", lg: "block" }}
            zIndex="0"
          >
            <Box
              className="neon-line-long"
              w="100%"
              h="100%"
              bg="#0BC5EA"
              transformOrigin="top"
            />
          </Box>

          {/* 2. ABOUT SECTION */}
          {/* Added 'mission-content' class here to target for blur */}
          <Box py={32} position="relative" zIndex="1" className="mission-content">
            <Stack spacing={12}>
              <Box textAlign={{ base: "left", lg: "center" }}>
                <Heading
                  className="gsap-slide-up"
                  size="3xl"
                  mb={6}
                  color="white"
                >
                  THE MISSION
                </Heading>
                <Text
                  className="gsap-slide-up"
                  fontSize="2xl"
                  color="gray.500"
                  lineHeight="1.4"
                >
                  We are removing the guesswork <br /> from vehicle maintenance.
                </Text>
              </Box>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={32}>
                <Text
                  className="gsap-slide-up"
                  fontSize="xl"
                  color="gray.400"
                  lineHeight="1.8"
                  textAlign={{ base: "left", lg: "right" }}
                >
                  CarCareAI is not just a directory. It is a real-time
                  intelligence engine. We analyze your vehicle's specific make,
                  model, and mileage to predict needs before they become
                  failures.
                </Text>
                <Text
                  className="gsap-slide-up"
                  fontSize="xl"
                  color="gray.400"
                  lineHeight="1.8"
                  textAlign="left"
                >
                  By connecting you directly with service centers that have your
                  specific parts in stock, we reduce repair times by an average
                  of 40%. No more waiting. No more uncertainty.
                </Text>
              </SimpleGrid>
            </Stack>
          </Box>

          {/* 3. VISION & GOALS */}
          <Box py={24} position="relative" zIndex="1">
            {/* Added 'vision-goals-content' class here to target for blur */}
            <Stack
              className="vision-goals-content"
              direction={{ base: "column", lg: "row" }}
              spacing={0}
              align="stretch"
            >
              <Box flex={1} py={10} pr={{ lg: 20 }}>
                <Heading
                  className="gsap-slide-up"
                  size="3xl"
                  mb={8}
                  color="white"
                  textAlign={{ lg: "right" }}
                >
                  Vision
                </Heading>
                <Text
                  className="gsap-slide-up"
                  fontSize="2xl"
                  color="gray.500"
                  textAlign={{ lg: "right" }}
                >
                  To create a frictionless world where your car communicates its
                  own needs to a network of trusted professionals, handling the
                  logistics so you don't have to.
                </Text>
              </Box>

              <Box w={{ base: "0px", lg: "2px" }} />

              <Box flex={1} py={10} pl={{ lg: 20 }}>
                <Heading
                  className="gsap-slide-up"
                  size="3xl"
                  mb={8}
                  color="white"
                >
                  Goals
                </Heading>
                <Stack spacing={8}>
                  <Box className="gsap-slide-up">
                    <Text fontSize="xl" fontWeight="bold" color="cyan.200">
                      Accuracy
                    </Text>
                    <Text color="gray.500">
                      99.9% match rate for spare parts.
                    </Text>
                  </Box>
                  <Box className="gsap-slide-up">
                    <Text fontSize="xl" fontWeight="bold" color="cyan.200">
                      Speed
                    </Text>
                    <Text color="gray.500">
                      Instant booking confirmation via AI.
                    </Text>
                  </Box>
                  <Box className="gsap-slide-up">
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
          </Box>
        </Container>
      </Box>

      {/* 4. UNIQUE FEATURES */}
      <Box py={32}>
        <Container maxW="container.xl">
          <Heading
            className="gsap-slide-up"
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