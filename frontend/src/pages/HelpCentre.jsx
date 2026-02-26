import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  IconButton,
  Avatar,
  Flex,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { FaPaperPlane, FaPhoneAlt, FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const HelpCentre = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can we help you today?", sender: "admin" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef();

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulate Admin Response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: "An agent will be with you shortly.", sender: "admin" },
      ]);
    }, 1500);
  };

  const handleCall = () => {
    window.open("tel:+1234567890"); // Replace with your admin number
  };

  return (
    <Box bg="black" minH="100vh" color="white" p={{ base: 4, md: 8 }}>
      <Flex maxW="800px" mx="auto" direction="column" h="85vh" 
            bg="rgba(255, 255, 255, 0.05)" borderRadius="2xl" 
            border="1px solid" borderColor="whiteAlpha.100" overflow="hidden">
        
        {/* Header */}
        <HStack p={4} bg="whiteAlpha.100" justify="space-between">
          <HStack spacing={4}>
            <IconButton 
              icon={<FaChevronLeft />} 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              aria-label="Back"
            />
            <Avatar size="sm" name="Admin Support" src="" />
            <Box>
              <Text fontWeight="bold" fontSize="sm">Support Admin</Text>
              <HStack spacing={1}>
                <Box boxSize="8px" bg="green.400" borderRadius="full" />
                <Text fontSize="xs" color="whiteAlpha.600">Online</Text>
              </HStack>
            </Box>
          </HStack>
          
          <IconButton
            icon={<FaPhoneAlt />}
            colorScheme="cyan"
            variant="solid"
            rounded="full"
            onClick={handleCall}
            aria-label="Call Support"
          />
        </HStack>

        {/* Chat Area */}
        <VStack 
          flex={1} 
          p={4} 
          overflowY="auto" 
          spacing={4} 
          align="stretch"
          ref={scrollRef}
          css={{ "&::-webkit-scrollbar": { display: "none" } }}
        >
          {messages.map((msg) => (
            <Flex key={msg.id} justify={msg.sender === "user" ? "flex-end" : "flex-start"}>
              <Box
                maxW="70%"
                bg={msg.sender === "user" ? "cyan.500" : "whiteAlpha.200"}
                color={msg.sender === "user" ? "black" : "white"}
                p={3}
                borderRadius="xl"
                borderBottomRightRadius={msg.sender === "user" ? "0" : "xl"}
                borderBottomLeftRadius={msg.sender === "admin" ? "0" : "xl"}
              >
                <Text fontSize="sm">{msg.text}</Text>
              </Box>
            </Flex>
          ))}
        </VStack>

        {/* Input Area */}
        <Box p={4} bg="whiteAlpha.50">
          <HStack spacing={2}>
            <Input
              placeholder="Type your message..."
              variant="filled"
              bg="whiteAlpha.100"
              border="none"
              _hover={{ bg: "whiteAlpha.200" }}
              _focus={{ bg: "whiteAlpha.200", border: "1px solid", borderColor: "cyan.400" }}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <IconButton
              icon={<FaPaperPlane />}
              colorScheme="cyan"
              onClick={handleSendMessage}
              aria-label="Send Message"
            />
          </HStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default HelpCentre;