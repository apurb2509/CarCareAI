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
} from "@chakra-ui/react";
import { FaRobot, FaPaperPlane, FaTimes, FaCommentDots } from "react-icons/fa";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // 1. Load Chat History from LocalStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem("carloChatHistory");
    if (savedChats) {
      setMessages(JSON.parse(savedChats));
    } else {
      // Default welcome message if no history
      const welcomeMsg = {
        text: "Hello! I am Carlo, your intelligent automotive assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMsg]);
    }
  }, []);

  // 2. Save Chat History whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("carloChatHistory", JSON.stringify(messages));
      scrollToBottom();
    }
  }, [messages]);

  // Auto-scroll to bottom
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

    // Update UI immediately
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5002/api/chat', { 
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
        text: "Sorry, I am having trouble connecting to the CarCare network. Please try again later.",
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Helper: Format Date for Headers
  const formatDate = (isoString) => {
    const options = { weekday: "long", year: "numeric", month: "short", day: "numeric" };
    return new Date(isoString).toLocaleDateString("en-IN", options);
  };

  // Helper: Format Time for Messages
  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Add this NEW useEffect to auto-scroll when the chat window opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [isOpen]);

  // NEW: Check Server Status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("http://localhost:5002/");
        setIsOnline(res.ok);
      } catch (error) {
        setIsOnline(false);
      }
    };

    checkStatus(); 
    const interval = setInterval(checkStatus, 10000); 
    return () => clearInterval(interval);
  }, []);

  // Render
  return (
    <Box position="fixed" bottom={{ base: "20px", md: "30px" }} right={{ base: "20px", md: "30px" }} zIndex="1000">
      {/* CHAT WINDOW */}
      <SlideFade in={isOpen} offsetY="20px">
        {isOpen && (
          <Box
            w={{ base: "calc(100vw - 40px)", md: "380px" }}
            h={{ base: "500px", md: "600px" }}
            bg="rgba(15, 23, 42, 0.75)"
            backdropFilter="blur(20px)"
            border="1px solid"
            borderColor="#1E293B"
            borderRadius="2xl"
            boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(14, 165, 233, 0.15)"
            overflow="hidden"
            display="flex"
            flexDirection="column"
            mb={4}
          >
            {/* Minimalist Premium Header */}
            <Flex
              bg="#0B1120"
              p={4}
              align="center"
              justify="space-between"
              borderBottom="1px solid"
              borderColor="#1E293B"
            >
              <HStack spacing={3}>
                <Box 
                  p={2.5} 
                  borderRadius="xl" 
                  bgGradient="linear(to-br, cyan.400, blue.500)"
                  boxShadow="0 4px 10px rgba(14, 165, 233, 0.4)"
                >
                  <FaRobot color="white" size="18px" />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontWeight="700" color="white" fontSize="md" letterSpacing="wide">
                    Carlo AI
                  </Text>
                  <HStack spacing={1.5}>
                    <Box 
                      w="6px" h="6px" 
                      borderRadius="full" 
                      bg={isOnline ? "green.400" : "red.400"} 
                      boxShadow={isOnline ? "0 0 8px rgba(74, 222, 128, 0.6)" : "0 0 8px rgba(248, 113, 113, 0.6)"}
                    />
                    <Text fontSize="xs" color="gray.400" fontWeight="medium">
                      {isOnline ? "System Online" : "Offline"}
                    </Text>
                  </HStack>
                </VStack>
              </HStack>
              <IconButton
                icon={<FaTimes />}
                size="sm"
                variant="ghost"
                color="gray.400"
                _hover={{ bg: "#1E293B", color: "white" }}
                onClick={() => setIsOpen(false)}
              />
            </Flex>

            {/* Messages Area */}
            <VStack
              flex="1"
              overflowY="auto"
              p={5}
              spacing={5}
              align="stretch"
              css={{
                "&::-webkit-scrollbar": { width: "4px" },
                "&::-webkit-scrollbar-track": { width: "6px" },
                "&::-webkit-scrollbar-thumb": { background: "#334155", borderRadius: "24px" },
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
                        <Text fontSize="10px" fontWeight="600" textTransform="uppercase" letterSpacing="wider" color="gray.500" bg="#0B1120" px={3} py={1} borderRadius="full" border="1px solid" borderColor="#1E293B">
                          {currentDate}
                        </Text>
                      </Flex>
                    )}
                    <Flex justify={msg.sender === "user" ? "flex-end" : "flex-start"}>
                      <Box
                        maxW="85%"
                        bg={msg.sender === "user" ? "linear-gradient(135deg, #0EA5E9 0%, #3B82F6 100%)" : "#1E293B"}
                        color="white"
                        px={4}
                        py={3}
                        borderRadius={
                          msg.sender === "user"
                            ? "20px 20px 4px 20px"
                            : "20px 20px 20px 4px"
                        }
                        boxShadow={msg.sender === "user" ? "0 4px 15px rgba(14, 165, 233, 0.3)" : "0 4px 15px rgba(0, 0, 0, 0.2)"}
                        border={msg.sender === "bot" ? "1px solid" : "none"}
                        borderColor="#334155"
                      >
                        <Text fontSize="sm" lineHeight="1.6">{msg.text}</Text>
                        <Text
                          fontSize="9px"
                          color={msg.sender === "user" ? "cyan.100" : "gray.400"}
                          textAlign="right"
                          mt={1.5}
                          fontWeight="500"
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
                  <Box bg="#1E293B" px={4} py={3} borderRadius="20px 20px 20px 4px" border="1px solid" borderColor="#334155">
                    <HStack spacing={1.5} h="20px" align="center">
                      <Box w="6px" h="6px" bg="gray.400" borderRadius="full" opacity="0.4" animation="pulse 1.5s infinite ease-in-out" />
                      <Box w="6px" h="6px" bg="gray.400" borderRadius="full" opacity="0.4" animation="pulse 1.5s infinite ease-in-out 0.2s" />
                      <Box w="6px" h="6px" bg="gray.400" borderRadius="full" opacity="0.4" animation="pulse 1.5s infinite ease-in-out 0.4s" />
                    </HStack>
                  </Box>
                </Flex>
              )}
              <div ref={messagesEndRef} />
            </VStack>

            {/* Input Area */}
            <Box p={4} bg="#0B1120" borderTop="1px solid" borderColor="#1E293B">
              <HStack 
                bg="#0F172A" 
                borderRadius="full" 
                border="1px solid" 
                borderColor="#334155"
                px={2} 
                py={1}
                transition="all 0.2s"
                _focusWithin={{ borderColor: "cyan.500", boxShadow: "0 0 0 1px #0EA5E9" }}
              >
                <Input
                  placeholder="Ask Carlo..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  bg="transparent"
                  border="none"
                  color="white"
                  fontSize="sm"
                  _focus={{ boxShadow: "none" }}
                  _placeholder={{ color: "gray.500" }}
                />
                <IconButton
                  icon={<FaPaperPlane size="12px" />}
                  bg={input.trim() ? "cyan.500" : "gray.600"}
                  color="white"
                  borderRadius="full"
                  size="sm"
                  onClick={handleSend}
                  isDisabled={!input.trim()}
                  _hover={input.trim() ? { bg: "cyan.400", boxShadow: "0 0 10px rgba(14,165,233,0.5)" } : {}}
                  transition="all 0.2s"
                />
              </HStack>
            </Box>
          </Box>
        )}
      </SlideFade>

      {/* FLOATING ACTION BUTTON */}
      {!isOpen && (
        <Button
          w="64px"
          h="64px"
          borderRadius="full"
          bgGradient="linear(to-br, cyan.400, blue.500)"
          color="white"
          boxShadow="0 10px 25px -5px rgba(14, 165, 233, 0.5)"
          _hover={{ 
            transform: "translateY(-4px)", 
            boxShadow: "0 15px 35px -5px rgba(14, 165, 233, 0.6)" 
          }}
          _active={{
            transform: "translateY(0px)",
          }}
          onClick={() => setIsOpen(true)}
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        >
          <FaCommentDots size="26px" />
        </Button>
      )}

      {/* Add global keyframes for typing pulse */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }
        `}
      </style>
    </Box>
  );
};

export default ChatWidget;