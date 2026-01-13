import React, { useRef, useState } from "react";
import {
  Box,
  VStack,
  Text,
  Icon,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  IconButton,
  Button,
  Stack,
  Divider,
  Avatar,
  HStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import {
  FaBars,
  FaSearch,
  FaWrench,
  FaUserCircle,
  FaCog,
  FaSignInAlt,
  FaSignOutAlt,
  FaPhone,
  FaCalendarCheck,
  FaClipboardList,
  FaBoxOpen,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Sidebar = ({ onAuthOpen, onLogout }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const navigate = useNavigate();
  const { user } = useUser();

  // --- LOGOUT ALERT STATE ---
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const cancelRef = useRef();

  const handleLogoutClick = () => {
    onClose(); // Close the Sidebar Drawer first
    setIsLogoutOpen(true); // Open the Confirmation Card
  };

  const confirmLogout = () => {
    onLogout(); // Execute actual logout logic
    setIsLogoutOpen(false); // Close alert
    navigate("/"); // Redirect to Home
  };

  const handleProfileClick = () => {
    if (user) {
      if (user.role === "service") {
        navigate("/profile/service");
      } else {
        navigate("/profile/user");
      }
    } else {
      navigate("/profile/user");
    }
    onClose();
  };

  const getNavItems = () => {
    const baseItems = [
      { icon: FaUserCircle, label: "Profile", onClick: handleProfileClick },
    ];

    if (user?.role === "service") {
      return [
        ...baseItems,
        {
          icon: FaClipboardList,
          label: "Incoming Bookings",
          onClick: () => {
            navigate("/profile/service", { state: { section: "bookings" } });
            onClose();
          },
        },
        {
          icon: FaBoxOpen,
          label: "My Inventory",
          onClick: () => {
            navigate("/profile/service", { state: { section: "inventory" } });
            onClose();
          },
        },
        { icon: FaPhone, label: "Help Centre" },
        { icon: FaCog, label: "Settings" },
      ];
    } else {
      return [
        ...baseItems,
        { icon: FaWrench, label: "My Garage" },
        {
          icon: FaSearch,
          label: "Find Services",
          onClick: () => {
            navigate("/find-services");
            onClose();
          },
        },
        {
          icon: FaCalendarCheck,
          label: "Book Appointment",
          onClick: () => {
            navigate("/book-appointment");
            onClose();
          },
        },
        { icon: FaPhone, label: "Help Centre" },
        { icon: FaCog, label: "Settings" },
      ];
    }
  };

  const navItems = getNavItems();
  const smoothTransition = "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)";

  return (
    <>
      {/* 1. HAMBURGER BUTTON */}
      <IconButton
        ref={btnRef}
        icon={<FaBars />}
        fontSize="24px"
        onClick={onOpen}
        variant="unstyled"
        color="white"
        aria-label="Open Menu"
        position="fixed"
        top={8}
        left={8}
        zIndex={100}
        display="flex"
        alignItems="center"
        justifyContent="center"
        _hover={{ transform: "scale(1.1)", opacity: 0.8 }}
        transition={smoothTransition}
      />

      {/* 2. SIDEBAR DRAWER */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
        blockScrollOnMount={false}
      >
        <DrawerOverlay
          backdropFilter="blur(8px)"
          bg="rgba(0,0,0,0.4)"
          transition={smoothTransition}
        />

        <DrawerContent
          bg="rgba(15, 15, 15, 0.85)"
          backdropFilter="blur(24px)"
          boxShadow="0 0 40px rgba(0,0,0,0.5)"
          borderRight="1px solid rgba(255,255,255,0.05)"
          maxW={{ base: "100vw", md: "320px" }}
        >
          <DrawerCloseButton
            color="whiteAlpha.600"
            size="lg"
            mt={6}
            mr={6}
            _hover={{ color: "white", bg: "transparent" }}
          />

          <DrawerBody
            py={8}
            px={0}
            display="flex"
            flexDirection="column"
            css={{ "&::-webkit-scrollbar": { display: "none" } }}
          >
            <Stack spacing={2} mb={8} px={10}>
              <Text
                fontSize="2xl"
                fontWeight="700"
                color="white"
                letterSpacing="-0.5px"
              >
                CarCareAI
              </Text>
              <Text
                color="whiteAlpha.400"
                fontSize="11px"
                fontWeight="600"
                letterSpacing="1px"
                textTransform="uppercase"
              >
                Menu
              </Text>
            </Stack>

            <VStack spacing={0} align="stretch" flex="1">
              {navItems.map((item, index) => (
                <Box key={index}>
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    h="64px"
                    w="100%"
                    fontSize="md"
                    fontWeight="500"
                    color="whiteAlpha.700"
                    rounded="none"
                    pl={10}
                    leftIcon={
                      <Icon
                        as={item.icon}
                        color="whiteAlpha.500"
                        boxSize={4}
                        mr={4}
                      />
                    }
                    _hover={{
                      bg: "whiteAlpha.100",
                      color: "white",
                      paddingLeft: "46px",
                      "& svg": { color: "#0BC5EA" },
                    }}
                    onClick={item.onClick || onClose}
                  >
                    {item.label}
                  </Button>
                  <Divider borderColor="whiteAlpha.5" />
                </Box>
              ))}
            </VStack>

            <Box px={10} mt="auto" mb={6}>
              {user ? (
                <HStack
                  spacing={4}
                  p={3}
                  bg="whiteAlpha.100"
                  borderRadius="xl"
                  border="1px solid rgba(255,255,255,0.05)"
                >
                  <Avatar
                    size="sm"
                    name={user.name}
                    bgGradient="linear(to-r, cyan.400, blue.500)"
                    border="2px solid"
                    borderColor="cyan.200"
                  />
                  <VStack align="start" spacing={0} flex={1}>
                    <Text
                      color="white"
                      fontWeight="bold"
                      fontSize="sm"
                      isTruncated
                      maxW="120px"
                    >
                      {user.name}
                    </Text>
                    <Text
                      color="cyan.400"
                      fontSize="10px"
                      textTransform="uppercase"
                      fontWeight="700"
                    >
                      {user.role === "service" ? "Partner" : "Member"}
                    </Text>
                  </VStack>
                  <IconButton
                    icon={<FaSignOutAlt />}
                    size="sm"
                    variant="ghost"
                    color="red.500"
                    _hover={{ bg: "whiteAlpha.200", color: "red.300" }}
                    onClick={handleLogoutClick} // CHANGED: Now opens the alert
                    aria-label="Logout"
                  />
                </HStack>
              ) : (
                <VStack spacing={1.5} w="full">
                  <Button
                    onClick={() => {
                      onClose();
                      onAuthOpen(false);
                    }}
                    variant="outline"
                    colorScheme="whiteAlpha"
                    color="cyan"
                    borderColor="whiteAlpha.500"
                    width="full"
                    h="50px"
                    leftIcon={<FaSignInAlt />}
                    _hover={{
                      bg: "cyan.400",
                      color: "black",
                      borderColor: "white",
                    }} // <--- ADD THIS
                    transition="all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)" // <--- ADD THIS
                  >
                    Register here
                  </Button>

                  <HStack spacing={1} justify="center" w="full">
                    <Text fontSize="xs" color="gray.500">
                      Already have an account?
                    </Text>
                    <Button
                      variant="link"
                      color="cyan.400"
                      fontSize="xs"
                      onClick={() => {
                        onClose();
                        onAuthOpen(true);
                      }}
                    >
                      Sign In
                    </Button>
                  </HStack>
                </VStack>
              )}
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* 3. LOGOUT CONFIRMATION CARD (ALERT DIALOG) */}
      <AlertDialog
        isOpen={isLogoutOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsLogoutOpen(false)}
        isCentered
      >
        <AlertDialogOverlay backdropFilter="blur(10px)" bg="blackAlpha.600" />

        <AlertDialogContent
          // 1. Card Background: Dark Cyan Gradient
          bgGradient="linear(to-br, cyan.900, blue.900)"
          // 2. Shadow: Cyan Glow (instead of a border line)
          boxShadow="0 0 25px rgba(0, 255, 255, 0.2)"
          color="white"
          borderRadius="2xl"
          border="none"
        >
          <AlertDialogHeader
            fontSize="xl"
            fontWeight="800"
            color="cyan.100"
            letterSpacing="tight"
          >
            Confirm Logout
          </AlertDialogHeader>

          <AlertDialogBody color="whiteAlpha.800" fontSize="md">
            Are you sure you want to log out of your account?
          </AlertDialogBody>

          <AlertDialogFooter>
            {/* "No" Button: Subtle Cyan Ghost */}
            <Button
              ref={cancelRef}
              onClick={() => setIsLogoutOpen(false)}
              variant="ghost"
              color="cyan.100"
              _hover={{ bg: "whiteAlpha.100", color: "cyan.100" }}
            >
              No
            </Button>

            {/* "Yes" Button: Solid Bright Cyan Primary Action */}
            <Button
              bg="cyan.400"
              color="gray.900" // Dark text on bright button for readability
              fontWeight="bold"
              _hover={{
                bg: "cyan.200",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0)",
              }}
              onClick={confirmLogout}
              ml={3}
            >
              Yes, Log Out
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Sidebar;
