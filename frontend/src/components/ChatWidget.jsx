import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  IconButton,
  Flex,
  Avatar,
  SlideFade,
  // keyframes, <--- REMOVED from here
} from "@chakra-ui/react";
// ADD THIS IMPORT:
import { keyframes } from "@emotion/react"; 
import { FaRobot, FaPaperPlane, FaTimes, FaCommentDots } from "react-icons/fa";

// 1. Custom Animations
const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 181, 216, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(0, 181, 216, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 181, 216, 0); }
`;

const ChatWidget = () => {
  // --- LOGIC SECTION (UNCHANGED) ---
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // 1. Load Chat History
  useEffect(() => {
    const savedChats = localStorage.getItem("carloChatHistory");
    if (savedChats) {
      setMessages(JSON.parse(savedChats));
    } else {
      const welcomeMsg = {
        text: "Hello! I am Carlo. How can I help you today?",
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMsg]);
    }
  }, []);

  // 2. Save Chat History
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("carloChatHistory", JSON.stringify(messages));
      scrollToBottom();
    }
  }, [messages]);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 3. Handle Send Message
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = {
      text: input,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5001/api/chat', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMsg.text }) 
      });

      const data = await response.json();

      const botMsg = {
        text: data.response,
        sender: "bot",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      const errorMsg = {
        text: "Sorry, I am having trouble connecting to my server. Please try again later.",
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Helper: Format Date
  const formatDate = (isoString) => {
    const options = { weekday: "long", year: "numeric", month: "short", day: "numeric" };
    return new Date(isoString).toLocaleDateString("en-IN", options);
  };

  // Helper: Format Time
  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Auto-scroll on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [isOpen]);

  // Check Server Status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("http://localhost:5001/");
        setIsOnline(res.ok);
      } catch (error) {
        console.error("Server check failed:", error); 
        setIsOnline(false);
      }
    };

    checkStatus(); 
    const interval = setInterval(checkStatus, 10000); 

    return () => clearInterval(interval);
  }, []);

  // --- RENDER SECTION (UPDATED UI) ---
  return (
    <Box position="fixed" bottom="30px" right="30px" zIndex="9999">
      {/* CHAT WINDOW */}
      <SlideFade in={isOpen} offsetY="20px">
        {isOpen && (
          <Box
            w={{ base: "300px", md: "380px" }}
            h="550px"
            bg="rgba(15, 23, 42, 0.95)" // Dark navy/black with transparency
            backdropFilter="blur(12px)" // Glass effect
            border="1px solid"
            borderColor="cyan.500" // Tech border
            borderRadius="2xl"
            boxShadow="0 0 20px rgba(0, 181, 216, 0.3)" // Glowing shadow
            overflow="hidden"
            display="flex"
            flexDirection="column"
            mb={4}
          >
            {/* Header */}
            <Flex
              bgGradient="linear(to-r, gray.900, gray.800)"
              p={4}
              align="center"
              justify="space-between"
              borderBottom="1px solid"
              borderColor="whiteAlpha.200"
            >
              <HStack spacing={3}>
                <Box position="relative">
                  <Avatar 
                    icon={<FaRobot size="1.2em" />} 
                    bg="cyan.700" 
                    color="white" 
                    size="sm"
                    boxShadow="0 0 3px cyan"
                  />
                  {/* Status Dot */}
                  <Box
                    position="absolute"
                    bottom="-2px"
                    right="-2px"
                    w="10px"
                    h="10px"
                    borderRadius="full"
                    bg={isOnline ? "green.400" : "red.500"}
                    border="2px solid #1A202C"
                    boxShadow={isOnline ? "0 0 6px #48BB78" : "none"}
                  />
                </Box>
                
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold" color="white" fontSize="md" letterSpacing="wide">
                    Carlo Bot
                  </Text>
                  <Text fontSize="xs" color={isOnline ? "green.300" : "red.300"} fontWeight="medium">
                    {isOnline ? "Online" : "Offline"}
                  </Text>
                </VStack>
              </HStack>
              
              <IconButton
                icon={<FaTimes />}
                size="sm"
                variant="ghost"
                color="gray.400"
                _hover={{ bg: "whiteAlpha.200", color: "white" }}
                onClick={() => setIsOpen(false)}
              />
            </Flex>

            {/* Messages Area */}
            <VStack
              flex="1"
              overflowY="auto"
              p={4}
              spacing={4}
              align="stretch"
              bgImage="radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)" // Subtle radial background
              css={{
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-track": { background: "transparent" },
                "&::-webkit-scrollbar-thumb": { background: "#4A5568", borderRadius: "24px" },
              }}
            >
              {messages.map((msg, index) => {
                const currentDate = formatDate(msg.timestamp);
                const prevDate = index > 0 ? formatDate(messages[index - 1].timestamp) : null;
                const showDateHeader = currentDate !== prevDate;

                return (
                  <React.Fragment key={index}>
                    {showDateHeader && (
                      <Flex justify="center" my={2}>
                        <Text fontSize="10px" color="cyan.200" bg="whiteAlpha.100" px={3} py={1} borderRadius="full" textTransform="uppercase" letterSpacing="wider">
                          {currentDate}
                        </Text>
                      </Flex>
                    )}
                    <Flex justify={msg.sender === "user" ? "flex-end" : "flex-start"}>
                      <Box
                        maxW="85%"
                        bg={msg.sender === "user" 
                          ? "linear-gradient(135deg, #0987A0 0%, #00B5D8 100%)" // User: Cyan Gradient
                          : "whiteAlpha.200" // Bot: Glassy Gray
                        }
                        backdropFilter={msg.sender === "bot" ? "blur(4px)" : "none"}
                        color="white"
                        px={4}
                        py={3}
                        borderRadius={
                          msg.sender === "user"
                            ? "18px 18px 0 18px"
                            : "18px 18px 18px 0"
                        }
                        boxShadow="lg"
                        border="1px solid"
                        borderColor={msg.sender === "user" ? "transparent" : "whiteAlpha.100"}
                      >
                        <Text fontSize="sm" lineHeight="1.5">{msg.text}</Text>
                        <Text
                          fontSize="10px"
                          color={msg.sender === "user" ? "whiteAlpha.800" : "gray.400"}
                          textAlign="right"
                          mt={1}
                        >
                          {formatTime(msg.timestamp)}
                        </Text>
                      </Box>
                    </Flex>
                  </React.Fragment>
                );
              })}
              
              {isTyping && (
                <Flex justify="flex-start">
                  <Box bg="whiteAlpha.100" px={4} py={2} borderRadius="18px 18px 18px 0">
                    <HStack spacing={1}>
                      <Box w="6px" h="6px" bg="gray.400" borderRadius="full" className="typing-dot" />
                      <Box w="6px" h="6px" bg="gray.400" borderRadius="full" className="typing-dot" />
                      <Box w="6px" h="6px" bg="gray.400" borderRadius="full" className="typing-dot" />
                    </HStack>
                    <Text fontSize="xs" color="gray.500" mt={1}>Analyzing...</Text>
                  </Box>
                </Flex>
              )}
              <div ref={messagesEndRef} />
            </VStack>

            {/* Input Area */}
            <HStack 
              p={3} 
              bg="gray.900" 
              borderTop="1px solid" 
              borderColor="whiteAlpha.100"
              spacing={2}
            >
              <Input
                placeholder="Ask about maintenance, diagnostics..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                bg="whiteAlpha.100"
                border="1px solid"
                borderColor="whiteAlpha.200"
                color="white"
                borderRadius="full"
                _focus={{ 
                  boxShadow: "0 0 0 1px #00B5D8", 
                  borderColor: "cyan.400", 
                  bg: "black" 
                }}
                _placeholder={{ color: "gray.500" }}
                fontSize="sm"
              />
              <IconButton
                icon={<FaPaperPlane />}
                colorScheme="cyan"
                borderRadius="full"
                onClick={handleSend}
                disabled={!input.trim()}
                boxShadow="0 0 10px rgba(0, 181, 216, 0.4)"
                _hover={{ transform: "scale(1.05)" }}
                transition="all 0.2s"
              />
            </HStack>
          </Box>
        )}
      </SlideFade>

      {/* TOGGLE BUTTON (Floating Action Button) */}
      {!isOpen && (
        <Button
          w="64px"
          h="64px"
          borderRadius="full"
          bgGradient="linear(to-br, cyan.400, blue.600)"
          color="white"
          boxShadow="0 0 20px rgba(0, 181, 216, 0.6)"
          _hover={{ 
            transform: "scale(1.1)", 
            boxShadow: "0 0 30px rgba(0, 181, 216, 0.8)" 
          }}
          onClick={() => setIsOpen(true)}
          transition="all 0.3s ease"
          animation={`${pulse} 2s infinite`} // Added Pulse Animation
          zIndex="9999"
        >
          <FaCommentDots size="28px" />
        </Button>
      )}
    </Box>
  );
};

export default ChatWidget;