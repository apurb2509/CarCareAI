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
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import SettingsModal from "../components/SettingsModal";

const Sidebar = ({ onAuthOpen, onLogout }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  // --- LOGOUT ALERT STATE ---
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
        { 
          icon: FaPhone, 
          label: "Help Centre", 
          onClick: () => { navigate('/help-centre'); onClose(); } 
        },
        { icon: FaCog, label: "Settings", onClick: () => { setIsSettingsOpen(true); onClose(); } },
      ];
    } else {
      return [
        ...baseItems,
        { 
          icon: FaWrench, 
          label: "Car Parts", 
          onClick: () => { navigate('/my-garage'); onClose(); } 
        },
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
        { 
          icon: FaPhone, 
          label: "Help Centre", 
          onClick: () => { navigate('/help-centre'); onClose(); } 
        },
        { icon: FaCog, label: "Settings", onClick: () => { setIsSettingsOpen(true); onClose(); } },
      ];
    }
  };

  const navItems = getNavItems();
  const smoothTransition = "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)";

  return (
    <>
      {/* 1. HAMBURGER & BACK BUTTONS */}
      <HStack
        position="fixed"
        top={8}
        left={8}
        zIndex={100}
        spacing={4}
      >
        <IconButton
          ref={btnRef}
          icon={<FaBars />}
          fontSize="24px"
          onClick={onOpen}
          variant="unstyled"
          color="text-primary"
          aria-label="Open Menu"
          display="flex"
          alignItems="center"
          justifyContent="center"
          _hover={{ transform: "scale(1.1)", opacity: 0.8 }}
          transition={smoothTransition}
        />
        {location.pathname !== "/" && (
          <IconButton
            icon={<FaArrowLeft />}
            fontSize="24px"
            onClick={() => navigate(-1)}
            variant="unstyled"
            color="accent-cyan"
            aria-label="Go Back"
            display="flex"
            alignItems="center"
            justifyContent="center"
            _hover={{ transform: "scale(1.1)", color: "white" }}
            transition={smoothTransition}
          />
        )}
      </HStack>

      {/* 2. SIDEBAR DRAWER */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        blockScrollOnMount={false}
        returnFocusOnClose={false}
      >
        <DrawerOverlay
          backdropFilter="blur(8px)"
          bg="rgba(0,0,0,0.4)"
          transition={smoothTransition}
        />

        <DrawerContent
          bg="glass-bg"
          backdropFilter="blur(24px)"
          boxShadow="0 0 40px rgba(0, 0, 0, 0.2), 20px 0 40px -10px rgba(14, 165, 233, 0.1)"
          borderRight="1px solid"
          borderColor="border-color"
          maxW={{ base: "100vw", md: "320px" }}
        >
          <DrawerCloseButton
            color="text-muted"
            size="lg"
            mt={6}
            mr={6}
            _hover={{ color: "text-primary", bg: "transparent" }}
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
                fontWeight="800"
                color="text-primary"
                letterSpacing="-0.5px"
              >
                CarCareAI
              </Text>
              <Text
                color="text-muted"
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
                    color="text-muted"
                    rounded="none"
                    pl={10}
                    leftIcon={
                      <Icon
                        as={item.icon}
                        color="text-muted"
                        boxSize={4}
                        mr={4}
                      />
                    }
                    _hover={{
                      bg: "slate-bg",
                      color: "text-primary",
                      paddingLeft: "46px",
                      "& svg": { color: "#0BC5EA" },
                    }}
                    onClick={item.onClick || onClose}
                  >
                    {item.label}
                  </Button>
                  <Divider borderColor="border-color" />
                </Box>
              ))}
            </VStack>

            <Box px={10} mt="auto" mb={6}>
              {user ? (
                  <HStack
                  spacing={4}
                  p={3}
                  bg="slate-bg"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="border-color"
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
                      color="text-primary"
                      fontWeight="bold"
                      fontSize="sm"
                      isTruncated
                      maxW="120px"
                    >
                      {user.name}
                    </Text>
                    <Text
                      color="accent-cyan"
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
                    color="text-muted"
                    _hover={{ bg: "#1E293B", color: "red.400" }}
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
                    colorScheme="gray"
                    color="cyan"
                    borderColor="border-color"
                    width="full"
                    h="50px"
                    leftIcon={<FaSignInAlt />}
                    _hover={{
                      bg: "cyan.500",
                      color: "gray.900",
                      borderColor: "cyan.500",
                    }} // <--- ADD THIS
                    transition="all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)" // <--- ADD THIS
                  >
                    Register here
                  </Button>

                  <HStack spacing={1} justify="center" w="full">
                    <Text fontSize="xs" color="text-muted">
                      Already have an account?
                    </Text>
                    <Button
                      variant="link"
                      color="accent-cyan"
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
           bg="glass-bg"
           backdropFilter="blur(20px)"
           border="1px solid"
           borderColor="border-color"
           boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)"
           color="text-primary"
           borderRadius="2xl"
        >
          <AlertDialogHeader
            fontSize="xl"
            fontWeight="800"
            color="cyan.500"
            letterSpacing="tight"
          >
            Confirm Logout
          </AlertDialogHeader>

          <AlertDialogBody color="text-muted" fontSize="md">
            Are you sure you want to log out of your account?
          </AlertDialogBody>

          <AlertDialogFooter>
            {/* "No" Button */}
            <Button
              ref={cancelRef}
              onClick={() => setIsLogoutOpen(false)}
              variant="ghost"
              color="text-muted"
            >
              No
            </Button>

            {/* "Yes" Button */}
            <Button
               bg="cyan.500"
               color="text-primary"
               fontWeight="bold"
               onClick={confirmLogout}
               ml={3}
            >
              Yes, Log Out
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 4. SETTINGS MODAL */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};

export default Sidebar;
