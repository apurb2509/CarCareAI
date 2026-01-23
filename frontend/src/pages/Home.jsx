import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Container,
  Stack,
  SimpleGrid,
  Icon,
  useToast,
  VStack, // <--- ADDED
  HStack, // <--- ADDED
  Flex,   // <--- ADDED
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import {
  FaSearch,
  FaArrowRight,
  FaCogs,
  FaDatabase,
  FaRobot,
  FaMapMarkerAlt,
  FaUserPlus,       // Registration
  FaMapMarkedAlt,   // Geo Location
  FaSyncAlt,        // Parts Sync
  FaFileInvoiceDollar, // Pricing
  FaChevronDown, // Added icon for loading state
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

const blinkRed = keyframes`
  0% { opacity: 1; box-shadow: 0 0 10px #F56565; }
  50% { opacity: 0.4; box-shadow: 0 0 2px #F56565; }
  100% { opacity: 1; box-shadow: 0 0 10px #F56565; }
`;

// ============================================================================
// COMPLEX ROAD MATH
// ============================================================================

// X-Axis: Sines and Cosines for irregular turns
const getRoadX = (progress, centerX, amplitude) => {
  const wave1 = Math.sin(progress * Math.PI * 5);
  const wave2 = Math.cos(progress * Math.PI * 8) * 0.2;
  return centerX + (wave1 + wave2) * amplitude;
};

// Y-Axis: Edge-to-edge
const getRoadY = (progress, height) => {
  return progress * height;
};

// Sub-component for typing effect
const TypewriterText = () => {
  const fullText = "SMART AUTOMOTIVE CARE";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    let timeoutId;

    const type = () => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
        const randomDelay = Math.random() * 100 + 50;
        timeoutId = setTimeout(type, randomDelay);
      }
    };

    type();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <Box as="span" display="inline-flex" alignItems="center">
      <Text
        as="span"
        bgGradient="linear(to-b, white, gray.600)"
        bgClip="text"
        color="transparent"
      >
        {displayedText}
      </Text>
      <Box
        as="span"
        ml={2}
        w="4px"
        h="0.9em"
        bg="gray.500"
        animation={`${blink} 0.9s step-end infinite`}
      />
    </Box>
  );
};

// --- UPDATED: Home component now accepts onRegisterGarageClick prop ---
const Home = ({ onRegisterGarageClick }) => {
  const mainRef = useRef(null);
  const wrapperRef = useRef(null);
  const carRef = useRef(null);
  const [pathData, setPathData] = useState("");

  // -- NEW STATE FOR LOCATION --
  const [isLocating, setIsLocating] = useState(false);
  const toast = useToast();

  // --- NEW: SERVER STATUS CHECK ---
  const [isServerOnline, setIsServerOnline] = useState(false);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5002/");
        if (response.ok) {
          setIsServerOnline(true);
        } else {
          setIsServerOnline(false);
        }
      } catch (error) {
        console.error("Server check failed:", error);
        setIsServerOnline(false);
      }
    };

    checkServerStatus();
    const intervalId = setInterval(checkServerStatus, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // -- LOCATION HANDLER (UPDATED) --
  const handleLocateService = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const query = "car service stations near me";
        const mapUrl = `https://www.google.com/maps/search/${query}/@${latitude},${longitude},13z`;
        setIsLocating(false);
        window.open(mapUrl, "_blank");
      },
      (error) => {
        setIsLocating(false);
        let errorMessage = "Unable to retrieve your location.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable it in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "The request to get your location timed out. Please try again.";
            break;
          default:
            errorMessage = "An unknown error occurred.";
            break;
        }

        toast({
          title: "Location Error",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 60000,
      }
    );
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. HERO ANIMATIONS
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

      // 2. CONTENT REVEAL ANIMATIONS
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

      gsap.to(".mission-content", {
        scrollTrigger: {
          trigger: ".mission-content",
          start: "top 20%",
          end: "bottom top",
          scrub: true,
        },
        opacity: 0,
        filter: "blur(5px)",
        y: -50,
        ease: "none",
      });

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

      // 3. ROAD GENERATION
      if (wrapperRef.current) {
        const height = wrapperRef.current.offsetHeight;
        const width = wrapperRef.current.offsetWidth;
        const centerX = width / 2;
        const amplitude = width > 768 ? width * 0.18 : width * 0.3;

        const points = [];
        const steps = 500;
        for (let i = 0; i <= steps; i++) {
          const p = i / steps;
          const px = getRoadX(p, centerX, amplitude);
          const py = getRoadY(p, height);
          points.push(`${px},${py}`);
        }
        setPathData(`M${points.join(" L")}`);

        const progressObj = { val: 0 };
        let previousVal = 0;

        gsap.to(progressObj, {
          val: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
          onUpdate: () => {
            const p = progressObj.val;
            const y = getRoadY(p, height);
            const x = getRoadX(p, centerX, amplitude);
            const nextP = p + 0.005;
            const nextY = getRoadY(nextP, height);
            const nextX = getRoadX(nextP, centerX, amplitude);
            const deltaX = nextX - x;
            const deltaY = nextY - y;
            let angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
            if (p < previousVal) angle += 180;
            previousVal = p;
            if (carRef.current) {
              gsap.set(carRef.current, {
                x: x,
                y: y,
                rotation: angle + 90,
                overwrite: "auto",
              });
            }
          },
        });
      }

      // 4. OTHER ANIMATIONS
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
    <Box
      ref={mainRef}
      w="100%"
      overflowX="hidden"
      bg="transparent"
      position="relative"
    >
      {/* 1. HERO SECTION */}
      <Box
        className="hero-section"
        h="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        position="relative"
        zIndex="20"
      >
        <Container maxW="container.xl" className="hero-content">
          <Box className="hero-top-content">
            <Stack spacing={6} textAlign="center" alignItems="center">
              {/* BADGE (DYNAMIC) */}
              <Box
                className="hero-animate"
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                px={4}
                py={2}
                bg={isServerOnline ? "rgba(0, 20, 0, 0.6)" : "rgba(20, 0, 0, 0.6)"}
                border="1px solid"
                borderColor={isServerOnline ? "green.500" : "red.500"}
                borderRadius="sm"
                boxShadow={
                  isServerOnline
                    ? "0 0 20px rgba(72, 187, 120, 0.3), inset 0 0 10px rgba(72, 187, 120, 0.1)"
                    : "0 0 20px rgba(245, 101, 101, 0.3), inset 0 0 10px rgba(245, 101, 101, 0.1)"
                }
                backdropFilter="blur(5px)"
                transition="all 0.3s ease"
              >
                <Box
                  w="8px"
                  h="8px"
                  bg={isServerOnline ? "green.400" : "red.400"}
                  borderRadius="full"
                  mr={3}
                  animation={
                    isServerOnline
                      ? `${blink} 1.5s infinite ease-in-out`
                      : `${blinkRed} 1.5s infinite ease-in-out`
                  }
                />
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  letterSpacing="0.2em"
                  fontWeight="bold"
                  color={isServerOnline ? "green.400" : "red.400"}
                  textTransform="uppercase"
                  fontFamily="'Courier New', Courier, monospace"
                  textShadow={
                    isServerOnline
                      ? "0 0 8px rgba(72, 187, 120, 0.8)"
                      : "0 0 8px rgba(245, 101, 101, 0.8)"
                  }
                >
                  {isServerOnline ? "Server Online" : "Server Offline"}
                </Text>
              </Box>

              <Heading
                className="hero-animate"
                fontSize={{ base: "40px", md: "45px", lg: "55px", xl: "65px" }}
                fontWeight="900"
                lineHeight="0.9"
                letterSpacing="-0.03em"
                py={2}
              >
                <Text
                  as="span"
                  fontSize={{
                    base: "50px",
                    md: "60px",
                    lg: "70px",
                    xl: "95px",
                  }}
                  bgGradient="linear(to-r, cyan.300, blue.500)"
                  bgClip="text"
                >
                  CARCARE AI
                </Text>
                <br />
                <TypewriterText />
              </Heading>

              <Text
                className="hero-animate"
                fontSize={{ base: "xl", md: "2xl" }}
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
                  rightIcon={isLocating ? <FaMapMarkerAlt /> : <FaSearch />}
                  onClick={handleLocateService}
                  isLoading={isLocating}
                  loadingText="Locating..."
                >
                  Nearby Services
                </Button>

                {/* --- REGISTER GARAGE BUTTON: Now calls the redirect trigger --- */}
                <Button
                  onClick={onRegisterGarageClick}
                  size="lg"
                  h="70px"
                  px="50px"
                  fontSize="xl"
                  variant="outline"
                  color="white"
                  rounded="full"
                  borderColor="whiteAlpha.700"
                  _hover={{ bg: "whiteAlpha.300" }}
                  rightIcon={<FaArrowRight />}
                >
                  Register Garage
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* 2. MAIN WRAPPER (ROAD + CONTENT) */}
      <Box
        ref={wrapperRef}
        className="main-content-wrapper"
        position="relative"
        bg="transparent"
        zIndex="10"
        overflow="hidden"
      >
        {/* ROAD SVG LAYER */}
        <Box
          position="absolute"
          top="0"
          left="0"
          w="100%"
          h="100%"
          zIndex="0"
          pointerEvents="none"
        >
          <svg
            width="100%"
            height="100%"
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <path
              d={pathData}
              fill="none"
              stroke="#222"
              strokeWidth="140"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={pathData}
              fill="none"
              stroke="#333"
              strokeWidth="120"
              strokeLinecap="round"
              strokeOpacity="0.4"
            />
            <path
              d={pathData}
              fill="none"
              stroke="#444"
              strokeWidth="150"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.5"
              style={{ mixBlendMode: "overlay" }}
            />
            <path
              d={pathData}
              fill="none"
              stroke="white"
              strokeWidth="4"
              strokeDasharray="40 60"
              strokeOpacity="0.7"
            />
          </svg>

          <Box
            ref={carRef}
            position="absolute"
            top={0}
            left={0}
            w="60px"
            h="100px"
            zIndex="2"
            transform="translate(-50%, -50%)"
            filter="drop-shadow(0px 20px 20px rgba(0,0,0,0.9))"
          >
            <svg
              viewBox="0 0 200 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20,80 Q10,120 10,200 Q10,350 30,380 L170,380 Q190,350 190,200 Q190,120 180,80 Q180,30 100,20 Q20,30 20,80"
                fill="url(#carGradient)"
                stroke="#111"
                strokeWidth="2"
              />
              <path
                d="M40,110 L160,110 L150,160 L50,160 Z"
                fill="#222"
                stroke="#444"
                strokeWidth="2"
              />
              <path d="M50,165 L150,165 L145,260 L55,260 Z" fill="#111" />
              <path d="M55,265 L145,265 L155,300 L45,300 Z" fill="#333" />
              <ellipse
                cx="35"
                cy="70"
                rx="10"
                ry="15"
                fill="#0BC5EA"
                filter="blur(2px)"
              />
              <ellipse
                cx="165"
                cy="70"
                rx="10"
                ry="15"
                fill="#0BC5EA"
                filter="blur(2px)"
              />
              <rect
                x="30"
                y="380"
                width="40"
                height="10"
                rx="2"
                fill="#ff0000"
              />
              <rect
                x="130"
                y="380"
                width="40"
                height="10"
                rx="2"
                fill="#ff0000"
              />
              <path
                d="M90,20 L110,20 L110,380 L90,380 Z"
                fill="rgba(0,0,0,0.3)"
              />
              <defs>
                <linearGradient
                  id="carGradient"
                  x1="100"
                  y1="0"
                  x2="100"
                  y2="400"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0BC5EA" />
                  <stop offset="0.5" stopColor="#006080" />
                  <stop offset="1" stopColor="#002030" />
                </linearGradient>
              </defs>
            </svg>
          </Box>
        </Box>

        {/* CONTENT LAYER */}
        <Container maxW="container.lg" position="relative" zIndex="10">
          {/* A. MISSION SECTION */}
          <Box py={32} className="mission-content">
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

          {/* --- START: HOW IT WORKS (FLOWCHART TIMELINE) --- */}
          <Box py={20} position="relative" zIndex="10">
            <Container maxW="container.md">
              <Heading
                className="gsap-slide-up"
                textAlign="center"
                size="2xl"
                mb={16}
                color="white"
                letterSpacing="tight"
              >
                How CarCare AI Works
              </Heading>

              <VStack spacing={0} w="100%">
                
                {/* STEP 1: REGISTRATION */}
                <Box className="gsap-slide-up" w="100%">
                  <HStack align="start" spacing={6}>
                    <Flex direction="column" align="center">
                      <Box
                        p={4}
                        borderRadius="full"
                        bg="linear-gradient(135deg, #0987A0 0%, #00B5D8 100%)"
                        color="white"
                        boxShadow="0 0 20px rgba(0, 181, 216, 0.4)"
                        zIndex="2"
                      >
                        <Icon as={FaUserPlus} w={6} h={6} />
                      </Box>
                      <Box w="2px" h="100px" bg="whiteAlpha.200" my={2} />
                    </Flex>
                    <Box pb={10}>
                      <Heading size="md" color="cyan.300" mb={2}>
                        01. Ecosystem Onboarding
                      </Heading>
                      <Text color="gray.400" fontSize="lg" lineHeight="1.6">
                        The journey begins with the creation of digital identities. 
                        Service stations register their facilities, cataloging their specific 
                        capabilities and inventory systems, while vehicle owners create 
                        profiles that lock in their car's make, model, and mileage data 
                        for personalized service matching.
                      </Text>
                    </Box>
                  </HStack>
                </Box>

                {/* STEP 2: GEOLOCATION */}
                <Box className="gsap-slide-up" w="100%">
                  <HStack align="start" spacing={6}>
                    <Flex direction="column" align="center">
                      <Box
                        p={4}
                        borderRadius="full"
                        bg="gray.800"
                        border="1px solid"
                        borderColor="cyan.500"
                        color="cyan.400"
                        zIndex="2"
                      >
                        <Icon as={FaMapMarkedAlt} w={6} h={6} />
                      </Box>
                      <Box w="2px" h="100px" bg="whiteAlpha.200" my={2} />
                    </Flex>
                    <Box pb={10}>
                      <Heading size="md" color="white" mb={2}>
                        02. Geospatial Availability
                      </Heading>
                      <Text color="gray.400" fontSize="lg" lineHeight="1.6">
                        Upon initiation, our algorithm scans the immediate vicinity. 
                        It doesn't just look for open garages; it filters for 
                        <strong> real-time slot availability</strong>, ensuring that 
                        when a user books a service, the bay is actually empty and 
                        ready for their vehicle arrival.
                      </Text>
                    </Box>
                  </HStack>
                </Box>

                {/* STEP 3: PARTS SYNC */}
                <Box className="gsap-slide-up" w="100%">
                  <HStack align="start" spacing={6}>
                    <Flex direction="column" align="center">
                      <Box
                        p={4}
                        borderRadius="full"
                        bg="gray.800"
                        border="1px solid"
                        borderColor="cyan.500"
                        color="cyan.400"
                        zIndex="2"
                      >
                        <Icon as={FaSyncAlt} w={6} h={6} />
                      </Box>
                      <Box w="2px" h="100px" bg="whiteAlpha.200" my={2} />
                    </Flex>
                    <Box pb={10}>
                      <Heading size="md" color="white" mb={2}>
                        03. Inventory Synchronization
                      </Heading>
                      <Text color="gray.400" fontSize="lg" lineHeight="1.6">
                        This is our core differentiator. The system performs a handshake 
                        with local garage databases. We cross-reference the required repairs 
                        against physical stock levels, ensuring that the specific brake pads, 
                        filters, or spark plugs needed for your car are physically on the shelf.
                      </Text>
                    </Box>
                  </HStack>
                </Box>

                {/* STEP 4: CARLO BOT */}
                <Box className="gsap-slide-up" w="100%">
                  <HStack align="start" spacing={6}>
                    <Flex direction="column" align="center">
                      <Box
                        p={4}
                        borderRadius="full"
                        bg="gray.800"
                        border="1px solid"
                        borderColor="cyan.500"
                        color="cyan.400"
                        zIndex="2"
                      >
                        <Icon as={FaRobot} w={6} h={6} />
                      </Box>
                      <Box w="2px" h="100px" bg="whiteAlpha.200" my={2} />
                    </Flex>
                    <Box pb={10}>
                      <Heading size="md" color="white" mb={2}>
                        04. AI-Driven Diagnostics
                      </Heading>
                      <Text color="gray.400" fontSize="lg" lineHeight="1.6">
                        For complex or unknown issues, users interact with <strong>Carlo Bot</strong>. 
                        Trained on thousands of technical manuals, Carlo analyzes symptoms 
                        (sounds, vibrations, warning lights) to predict potential fault codes 
                        before a mechanic even lifts the hood.
                      </Text>
                    </Box>
                  </HStack>
                </Box>

                {/* STEP 5: PRICING */}
                <Box className="gsap-slide-up" w="100%">
                  <HStack align="start" spacing={6}>
                    <Flex direction="column" align="center">
                      <Box
                        p={4}
                        borderRadius="full"
                        bg="gray.800"
                        border="1px solid"
                        borderColor="green.400"
                        color="green.400"
                        boxShadow="0 0 15px rgba(72, 187, 120, 0.3)"
                        zIndex="2"
                      >
                        <Icon as={FaFileInvoiceDollar} w={6} h={6} />
                      </Box>
                    </Flex>
                    <Box pb={0}>
                      <Heading size="md" color="green.300" mb={2}>
                        05. Valuation & Execution
                      </Heading>
                      <Text color="gray.400" fontSize="lg" lineHeight="1.6">
                        Finally, our ML Price Estimator calculates a transparent cost range 
                        based on labor rates and part prices. The user confirms the booking, 
                        secures the slot, and navigates to the station with total confidence 
                        in the cost and turnaround time.
                      </Text>
                    </Box>
                  </HStack>
                </Box>
              </VStack>
            </Container>
          </Box>
          {/* --- END: HOW IT WORKS --- */}

          {/* B. VISION & GOALS SECTION */}
          <Box py={24}>
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

              <Box w={{ base: "0px", lg: "20px" }} />

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
                      Customer-verified service history.
                    </Text>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Container>

        {/* C. FEATURES (ENGINEERED FOR EXCELLENCE) */}
        <Box py={32} position="relative" zIndex="10">
          <Container maxW="container.xl">
            <Heading
              className="gsap-slide-up"
              textAlign="center"
              size="2xl"
              mb={20}
              color="white"
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
                h="full"
                transition="transform 0.1s ease-out"
                style={{
                  transformStyle: "preserve-3d",
                  willChange: "transform",
                }}
                onMouseMove={(e) => {
                  const card = e.currentTarget;
                  const rect = card.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const centerX = rect.width / 2;
                  const centerY = rect.height / 2;
                  const rotateX = ((centerY - y) / centerY) * 20;
                  const rotateY = ((x - centerX) / centerX) * 20;
                  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
                }}
              >
                <Icon as={FaRobot} w={10} h={10} color="purple.400" mb={6} />
                <Heading size="lg" mb={4} color="white">
                  Predictive AI
                </Heading>
                <Text color="gray.400" fontSize="lg">
                  Our model doesn't just find mechanics; it finds specialists
                  for your specific engine fault codes.
                </Text>
              </Box>

              <Box
                className="feature-card"
                p={8}
                bg="rgba(255,255,255,0.03)"
                border="1px solid rgba(255,255,255,0.1)"
                borderRadius="2xl"
                h="full"
                transition="transform 0.1s ease-out"
                style={{
                  transformStyle: "preserve-3d",
                  willChange: "transform",
                }}
                onMouseMove={(e) => {
                  const card = e.currentTarget;
                  const rect = card.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const centerX = rect.width / 2;
                  const centerY = rect.height / 2;
                  const rotateX = ((centerY - y) / centerY) * 20;
                  const rotateY = ((x - centerX) / centerX) * 20;
                  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
                }}
              >
                <Icon as={FaDatabase} w={10} h={10} color="cyan.400" mb={6} />
                <Heading size="lg" mb={4} color="white">
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
                h="full"
                transition="transform 0.1s ease-out"
                style={{
                  transformStyle: "preserve-3d",
                  willChange: "transform",
                }}
                onMouseMove={(e) => {
                  const card = e.currentTarget;
                  const rect = card.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const centerX = rect.width / 2;
                  const centerY = rect.height / 2;
                  const rotateX = ((centerY - y) / centerY) * 20;
                  const rotateY = ((x - centerX) / centerX) * 20;
                  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
                }}
              >
                <Icon as={FaCogs} w={10} h={10} color="pink.400" mb={6} />
                <Heading size="lg" mb={4} color="white">
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
      </Box>

      <Footer />
    </Box>
  );
};

export default Home;