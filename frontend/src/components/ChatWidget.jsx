import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  IconButton,
  // Removed 'useColorModeValue' to fix the warning
  Flex,
  Avatar,
  SlideFade,
} from "@chakra-ui/react";
import { FaRobot, FaPaperPlane, FaTimes, FaCommentDots } from "react-icons/fa";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
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
        text: "Hello! I am Carlo. How can I help you today?",
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
      // Call the Python Chatbot API (Port 5001)
      const response = await fetch("http://127.0.0.1:5001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text }),
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

  // Render
  return (
    <Box position="fixed" bottom="30px" right="30px" zIndex="1000">
      {/* CHAT WINDOW */}
      <SlideFade in={isOpen} offsetY="20px">
        {isOpen && (
          <Box
            w={{ base: "300px", md: "350px" }}
            h="500px"
            bg="gray.900"
            border="1px solid"
            borderColor="whiteAlpha.200"
            borderRadius="xl"
            boxShadow="2xl"
            overflow="hidden"
            display="flex"
            flexDirection="column"
            mb={4}
          >
            {/* Header */}
            <Flex
              bgGradient="linear(to-r, cyan.600, blue.600)"
              p={4}
              align="center"
              justify="space-between"
              boxShadow="md"
            >
              <HStack>
                <Avatar icon={<FaRobot />} bg="white" color="cyan.600" size="sm" />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold" color="white" fontSize="md">
                    CarloBot
                  </Text>
                  <Text fontSize="xs" color="cyan.100">
                    Online • AI Assistant
                  </Text>
                </VStack>
              </HStack>
              <IconButton
                icon={<FaTimes />}
                size="sm"
                variant="ghost"
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
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
              css={{
                "&::-webkit-scrollbar": { width: "4px" },
                "&::-webkit-scrollbar-track": { width: "6px" },
                "&::-webkit-scrollbar-thumb": { background: "#555", borderRadius: "24px" },
              }}
            >
              {messages.map((msg, index) => {
                // Date Logic: Show header if it's the first msg OR day changed from previous msg
                const currentDate = formatDate(msg.timestamp);
                const prevDate =
                  index > 0 ? formatDate(messages[index - 1].timestamp) : null;
                const showDateHeader = currentDate !== prevDate;

                return (
                  <React.Fragment key={index}>
                    {showDateHeader && (
                      <Flex justify="center" my={2}>
                        <Text fontSize="xs" color="gray.500" bg="gray.800" px={2} py={1} borderRadius="md">
                          {currentDate}
                        </Text>
                      </Flex>
                    )}
                    <Flex justify={msg.sender === "user" ? "flex-end" : "flex-start"}>
                      <Box
                        maxW="80%"
                        bg={msg.sender === "user" ? "cyan.600" : "gray.700"}
                        color="white"
                        px={4}
                        py={2}
                        borderRadius={
                          msg.sender === "user"
                            ? "20px 20px 0 20px"
                            : "20px 20px 20px 0"
                        }
                        boxShadow="md"
                      >
                        <Text fontSize="sm">{msg.text}</Text>
                        <Text
                          fontSize="10px"
                          color={msg.sender === "user" ? "cyan.100" : "gray.400"}
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
                  <Box bg="gray.700" px={4} py={2} borderRadius="20px 20px 20px 0">
                    <Text fontSize="xs" color="gray.400">
                      Carlo is typing...
                    </Text>
                  </Box>
                </Flex>
              )}
              <div ref={messagesEndRef} />
            </VStack>

            {/* Input Area */}
            <HStack p={3} bg="gray.800" borderTop="1px solid" borderColor="whiteAlpha.100">
              <Input
                placeholder="Ask about your car..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                bg="gray.900"
                border="none"
                color="white"
                _focus={{ boxShadow: "none", bg: "black" }}
              />
              <IconButton
                icon={<FaPaperPlane />}
                colorScheme="cyan"
                borderRadius="full"
                onClick={handleSend}
                disabled={!input.trim()}
              />
            </HStack>
          </Box>
        )}
      </SlideFade>

      {/* TOGGLE BUTTON (Sticky Logo) */}
      {!isOpen && (
        <Button
          w="60px"
          h="60px"
          borderRadius="full"
          bgGradient="linear(to-r, cyan.500, blue.500)"
          color="white"
          boxShadow="0 0 20px rgba(0, 150, 255, 0.5)"
          _hover={{ transform: "scale(1.1)", boxShadow: "0 0 30px rgba(0, 150, 255, 0.7)" }}
          onClick={() => setIsOpen(true)}
          transition="all 0.3s ease"
        >
          <FaCommentDots size="24px" />
        </Button>
      )}
    </Box>
  );
};

export default ChatWidget;