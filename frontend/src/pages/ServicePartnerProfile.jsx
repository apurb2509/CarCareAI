import React, { useState, useEffect } from "react";
import {
  Box, VStack, HStack, Text, Avatar, Button, Input, FormControl, FormLabel,
  SimpleGrid, Checkbox, Card, CardHeader, CardBody, Badge, Stat, StatLabel, 
  StatNumber, StatHelpText, Icon, Divider, Table, Thead, Tbody, Tr, Th, Td,
  Tabs, TabList, TabPanels, Tab, TabPanel, IconButton, useToast, Textarea
} from "@chakra-ui/react";
import { 
  FaEdit, FaSave, FaTools, FaLock, FaClipboardList, 
  FaBoxOpen, FaPlus, FaTrash, FaCheck, FaTimes, FaMapMarkedAlt, FaClock 
} from "react-icons/fa";
import { useUser } from "../context/UserContext";
import { useLocation } from "react-router-dom"; 

const ServicePartnerProfile = ({ onAuthOpen }) => {
  const { user } = useUser();
  const location = useLocation(); 
  const toast = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [sameAsOwner, setSameAsOwner] = useState(false);
  const [activeTab, setActiveTab] = useState(0); 
  
  // --- VIEW SWITCHING STATE ---
  // Default to 'profile'. sidebar will switch this to 'bookings' or 'inventory'
  const [activeView, setActiveView] = useState("profile");

  // --- HANDLE NAVIGATION FROM SIDEBAR ---
  useEffect(() => {
    if (location.state?.section) {
      setActiveView(location.state.section);
    }
  }, [location]);

  // --- MOCK DATA ---
  const [bookings, setBookings] = useState([
    { id: 101, user: "Rahul Verma", car: "Hyundai Creta", service: "General Service", date: "2025-10-28", time: "10:00 AM", status: "Pending" },
    { id: 102, user: "Sneha Gupta", car: "Maruti Swift", service: "Brake Pad Replacement", date: "2025-10-29", time: "02:00 PM", status: "Confirmed" },
  ]);

  const [myServices, setMyServices] = useState([
    { id: 1, name: "Premium Car Wash", price: "₹499" },
    { id: 2, name: "Synthetic Oil Change", price: "₹1,499" },
  ]);

  const [inventory, setInventory] = useState([
    { id: 1, name: "Bosch Brake Pads (Front)", stock: 12, price: "₹2,200" },
    { id: 2, name: "Shell Helix Ultra 5W-40", stock: 25, price: "₹3,500" },
  ]);

  const [profileData, setProfileData] = useState({
    ownerName: user?.name || "",
    stationName: "My Auto Garage",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.locality || "",
    city: user?.state || "", 
    mapLink: "https://goo.gl/maps/example",
    openTime: "09:00",
    closeTime: "20:00",
    about: "We are a premium multi-brand car service station specializing in luxury vehicles.",
    registeredSince: "2024",
    totalVisits: 142
  });

  // --- HANDLERS ---
  const toggleEditMode = () => {
    if (isEditing) {
      handleSaveProfile();
    } else {
      setIsEditing(true);
    }
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Changes saved successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top"
    });
  };

  const handleBookingStatus = (id, newStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    toast({ title: `Booking ${newStatus}`, status: newStatus === "Confirmed" ? "success" : "warning", duration: 2000 });
  };

  // Service & Inventory Handlers
  const handleAddService = () => { const newId = myServices.length + 1; setMyServices(prev => [...prev, { id: newId, name: "New Service", price: "₹0" }]); };
  const handleUpdateService = (id, field, value) => { setMyServices(prev => prev.map(svc => svc.id === id ? { ...svc, [field]: value } : svc)); };
  const handleRemoveService = (id) => { setMyServices(prev => prev.filter(s => s.id !== id)); };
  const handleAddPart = () => { const newId = inventory.length + 1; setInventory(prev => [...prev, { id: newId, name: "New Car Part", stock: 0, price: "₹0" }]); };
  const handleUpdateInventory = (id, field, value) => { setInventory(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item)); };
  const handleRemovePart = (id) => { setInventory(prev => prev.filter(i => i.id !== id)); };
  const handleCheckbox = (e) => { setSameAsOwner(e.target.checked); if(e.target.checked) { setProfileData(prev => ({...prev, stationName: prev.ownerName + "'s Station"})); }};

  // --- RESTRICTED ACCESS VIEW ---
  if (!user) {
    return (
      <Box h="100vh" display="flex" alignItems="center" justifyContent="center" px={4} backdropFilter="blur(12px)" bg="rgba(0, 0, 0, 0.4)">
        <Box p={10} maxW="md" w="full" textAlign="center" bg="linear-gradient(145deg, #0f172a 0%, #1e293b 100%)" backdropFilter="blur(20px)" border="1px solid" borderColor="rgba(100, 200, 255, 0.15)" borderRadius="3xl" boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.8)">
          <VStack spacing={6}>
            <Box p={5} bg="rgba(59, 130, 246, 0.1)" borderRadius="full" border="1px solid" borderColor="cyan.500" color="cyan.400"><Icon as={FaLock} boxSize={8} /></Box>
            <VStack spacing={2}>
              <Text fontSize="2xl" fontWeight="800" color="white" letterSpacing="tight">Access Restricted</Text>
              <Text color="gray.400" fontSize="md">Please <Button variant="link" color="cyan.400" fontWeight="bold" verticalAlign="baseline" onClick={() => onAuthOpen(false)}>Register</Button> or <Button variant="link" color="cyan.400" fontWeight="bold" verticalAlign="baseline" onClick={() => onAuthOpen(true)}>Login</Button> to view and manage your dashboard.</Text>
            </VStack>
          </VStack>
        </Box>
      </Box>
    );
  }

  // --- MAIN RENDER ---
  return (
    <Box pt={24} pb={10} px={6} maxW="container.xl" mx="auto" color="white">
      
      {/* 1. DASHBOARD HEADER (ALWAYS VISIBLE) */}
      <Card bg="linear-gradient(135deg, rgba(6, 11, 25, 0.95) 0%, rgba(10, 25, 41, 0.9) 100%)" border="1px solid cyan" mb={8}>
        <CardBody>
          <HStack spacing={6} align="center" flexDirection={{ base: "column", md: "row" }}>
            <Avatar size="2xl" icon={<FaTools fontSize="3rem" />} bg="cyan.600" />
            <VStack align={{ base: "center", md: "start" }} flex={1} spacing={1}>
              <Text fontSize="3xl" fontWeight="900" color="cyan.300">{profileData.stationName}</Text>
              <Text fontSize="lg" color="gray.300">Owner: {profileData.ownerName}</Text>
              <HStack mt={1}>
                <Badge colorScheme="purple" px={2} py={1} borderRadius="md">Premium Partner</Badge>
                <Badge colorScheme="green" px={2} py={1} borderRadius="md">Online</Badge>
              </HStack>
            </VStack>
            
            {/* ONLY SHOW EDIT BUTTON IN PROFILE VIEW */}
            {activeView === 'profile' && (
              <Button 
                leftIcon={isEditing ? <FaSave /> : <FaEdit />} 
                colorScheme="cyan" 
                variant={isEditing ? "solid" : "outline"}
                onClick={toggleEditMode}
              >
                {isEditing ? "Save Profile" : "Edit Details"}
              </Button>
            )}
          </HStack>
        </CardBody>
      </Card>

      {/* 2. CONDITIONAL VIEWS */}

      {/* === VIEW: PROFILE (Stats + Config) === */}
      {activeView === 'profile' && (
        <>
          {/* STATS ROW */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10}>
            <Card bg="whiteAlpha.100" borderLeft="4px solid" borderColor="cyan.400">
              <CardBody><Stat><StatLabel>Total Visits</StatLabel><StatNumber color="white">{profileData.totalVisits}</StatNumber><StatHelpText>All time clients</StatHelpText></Stat></CardBody>
            </Card>
            <Card bg="whiteAlpha.100" borderLeft="4px solid" borderColor="yellow.400">
              <CardBody><Stat><StatLabel>Rating</StatLabel><StatNumber color="white">4.8 / 5.0</StatNumber><StatHelpText>Based on 56 reviews</StatHelpText></Stat></CardBody>
            </Card>
            <Card bg="whiteAlpha.100" borderLeft="4px solid" borderColor="green.400">
              <CardBody><Stat><StatLabel>Live Bookings</StatLabel><StatNumber color="white">{bookings.length}</StatNumber><StatHelpText color="green.300">Action required</StatHelpText></Stat></CardBody>
            </Card>
          </SimpleGrid>

          {/* ENHANCED STATION CONFIGURATION */}
          <Card bg="rgba(255,255,255,0.03)" borderColor="whiteAlpha.200">
            <CardHeader borderBottom="1px solid gray" pb={4} display="flex" justifyContent="space-between" alignItems="center">
              <Text fontSize="xl" fontWeight="bold">Station Details & Configuration</Text>
              <Icon as={FaMapMarkedAlt} color="gray.500" />
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                
                {/* Left Column: Basic Info */}
                <VStack align="stretch" spacing={5}>
                  <FormControl>
                    <FormLabel color="cyan.300">Service Station Name</FormLabel>
                    <Input value={profileData.stationName} isReadOnly={!isEditing} onChange={(e) => setProfileData({...profileData, stationName: e.target.value})} bg="whiteAlpha.100" border="none" />
                    {isEditing && (
                      <Checkbox size="sm" colorScheme="cyan" mt={2} isChecked={sameAsOwner} onChange={handleCheckbox}>
                        <Text fontSize="xs" color="gray.400">Use Owner Name</Text>
                      </Checkbox>
                    )}
                  </FormControl>
                  <FormControl>
                    <FormLabel color="cyan.300">Owner Name</FormLabel>
                    <Input value={profileData.ownerName} isReadOnly={!isEditing} onChange={(e) => setProfileData({...profileData, ownerName: e.target.value})} bg="whiteAlpha.100" border="none" />
                  </FormControl>
                  <FormControl>
                    <FormLabel color="cyan.300">Contact Number</FormLabel>
                    <Input value={profileData.phone} isReadOnly={!isEditing} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} bg="whiteAlpha.100" border="none" />
                  </FormControl>
                </VStack>

                {/* Right Column: Address & Details */}
                <VStack align="stretch" spacing={5}>
                  <FormControl>
                    <FormLabel color="cyan.300">Address & City</FormLabel>
                    <Input value={profileData.address} isReadOnly={!isEditing} onChange={(e) => setProfileData({...profileData, address: e.target.value})} bg="whiteAlpha.100" border="none" />
                  </FormControl>
                  
                  {/* Google Map Link */}
                  <FormControl>
                    <FormLabel color="cyan.300">Google Map Link</FormLabel>
                    <Input 
                      placeholder="https://maps.google.com/..." 
                      value={profileData.mapLink} 
                      isReadOnly={!isEditing} 
                      onChange={(e) => setProfileData({...profileData, mapLink: e.target.value})} 
                      bg="whiteAlpha.100" border="none" 
                      color="blue.300"
                      textDecoration="underline"
                    />
                  </FormControl>

                  {/* Operating Hours */}
                  <FormControl>
                    <FormLabel color="cyan.300"><HStack><Icon as={FaClock} /><Text>Operating Hours</Text></HStack></FormLabel>
                    <HStack>
                      <Input type="time" value={profileData.openTime} isReadOnly={!isEditing} onChange={(e) => setProfileData({...profileData, openTime: e.target.value})} bg="whiteAlpha.100" border="none" />
                      <Text>to</Text>
                      <Input type="time" value={profileData.closeTime} isReadOnly={!isEditing} onChange={(e) => setProfileData({...profileData, closeTime: e.target.value})} bg="whiteAlpha.100" border="none" />
                    </HStack>
                  </FormControl>
                </VStack>

                {/* Full Width: About / Description */}
                <FormControl gridColumn={{ md: "span 2" }}>
                  <FormLabel color="cyan.300">About Service Station</FormLabel>
                  <Textarea 
                    value={profileData.about} 
                    isReadOnly={!isEditing} 
                    onChange={(e) => setProfileData({...profileData, about: e.target.value})} 
                    bg="whiteAlpha.100" border="none" 
                    placeholder="Tell users about your expertise..."
                    rows={3}
                  />
                </FormControl>

              </SimpleGrid>

              {isEditing && (
                <Box mt={8} display="flex" justifyContent="flex-end">
                  <Button leftIcon={<FaSave />} colorScheme="green" size="lg" onClick={handleSaveProfile}>Save Changes</Button>
                </Box>
              )}
            </CardBody>
          </Card>
        </>
      )}

      {/* === VIEW: INCOMING BOOKINGS === */}
      {activeView === 'bookings' && (
        <Box>
          <HStack mb={4} spacing={3}><Icon as={FaClipboardList} color="cyan.400" boxSize={6} /><Text fontSize="2xl" fontWeight="bold">Incoming Bookings</Text></HStack>
          <Card bg="rgba(255,255,255,0.03)" borderColor="whiteAlpha.200" overflowX="auto">
            <Table variant="simple" size="md">
              <Thead>
                <Tr><Th color="gray.400">Customer</Th><Th color="gray.400">Vehicle</Th><Th color="gray.400">Service</Th><Th color="gray.400">Date & Time</Th><Th color="gray.400">Status</Th><Th color="gray.400">Actions</Th></Tr>
              </Thead>
              <Tbody>
                {bookings.map((b) => (
                  <Tr key={b.id} _hover={{ bg: "whiteAlpha.50" }}>
                    <Td fontWeight="bold">{b.user}</Td>
                    <Td>{b.car}</Td>
                    <Td>{b.service}</Td>
                    <Td>{b.date} <br/> <Text fontSize="xs" color="gray.400">{b.time}</Text></Td>
                    <Td><Badge colorScheme={b.status === "Confirmed" ? "green" : b.status === "Rejected" ? "red" : "orange"}>{b.status}</Badge></Td>
                    <Td>
                      {b.status === "Pending" && (
                        <HStack>
                          <IconButton icon={<FaCheck />} size="sm" colorScheme="green" onClick={() => handleBookingStatus(b.id, "Confirmed")} />
                          <IconButton icon={<FaTimes />} size="sm" colorScheme="red" variant="outline" onClick={() => handleBookingStatus(b.id, "Rejected")} />
                        </HStack>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Card>
        </Box>
      )}

      {/* === VIEW: INVENTORY MANAGER === */}
      {activeView === 'inventory' && (
        <Box>
          <HStack mb={4} spacing={3}><Icon as={FaBoxOpen} color="purple.400" boxSize={6} /><Text fontSize="2xl" fontWeight="bold">Service & Inventory Manager</Text></HStack>
          <Card bg="rgba(255,255,255,0.03)" borderColor="whiteAlpha.200">
            <CardBody>
              <Tabs variant="soft-rounded" colorScheme="cyan" index={activeTab} onChange={(index) => setActiveTab(index)}>
                <TabList mb={4}>
                  <Tab color="gray.400" _selected={{ color: "black", bg: "cyan.400" }}>My Services</Tab>
                  <Tab color="gray.400" _selected={{ color: "white", bg: "purple.500" }}>Car Parts Inventory</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel px={0}>
                    <HStack justify="space-between" mb={4}><Text color="gray.400" fontSize="sm">Services you offer to customers</Text><Button leftIcon={<FaPlus />} size="sm" colorScheme="cyan" variant="outline" onClick={handleAddService}>Add Service</Button></HStack>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      {myServices.map((svc) => (
                        <HStack key={svc.id} p={4} bg="whiteAlpha.100" borderRadius="lg" justify="space-between">
                          <VStack align="start" spacing={2} w="full">
                            <Input size="md" fontWeight="bold" value={svc.name} onChange={(e) => handleUpdateService(svc.id, 'name', e.target.value)} placeholder="Service Name" bg="blackAlpha.300" border="1px solid" borderColor="whiteAlpha.200" _focus={{ borderColor: "cyan.400" }} />
                            <Input size="sm" color="cyan.300" value={svc.price} onChange={(e) => handleUpdateService(svc.id, 'price', e.target.value)} placeholder="Price (e.g. ₹499)" bg="blackAlpha.300" border="1px solid" borderColor="whiteAlpha.200" _focus={{ borderColor: "cyan.400" }} />
                          </VStack>
                          <IconButton icon={<FaTrash />} size="sm" colorScheme="red" variant="ghost" onClick={() => handleRemoveService(svc.id)} />
                        </HStack>
                      ))}
                    </SimpleGrid>
                  </TabPanel>
                  <TabPanel px={0}>
                    <HStack justify="space-between" mb={4}><Text color="gray.400" fontSize="sm">Spare parts available in your garage</Text><Button leftIcon={<FaPlus />} size="sm" colorScheme="purple" variant="outline" onClick={handleAddPart}>Add Part</Button></HStack>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      {inventory.map((item) => (
                        <HStack key={item.id} p={4} bg="whiteAlpha.100" borderRadius="lg" justify="space-between" borderLeft="4px solid" borderColor="purple.500">
                          <VStack align="start" spacing={2} w="full">
                            <Input size="md" fontWeight="bold" value={item.name} onChange={(e) => handleUpdateInventory(item.id, 'name', e.target.value)} placeholder="Part Name" bg="blackAlpha.300" border="1px solid" borderColor="whiteAlpha.200" _focus={{ borderColor: "purple.400" }} />
                            <HStack>
                              <Input size="sm" value={item.stock} onChange={(e) => handleUpdateInventory(item.id, 'stock', e.target.value)} placeholder="Qty" bg="blackAlpha.300" border="1px solid" borderColor="whiteAlpha.200" w="70px" textAlign="center" _focus={{ borderColor: "purple.400" }} />
                              <Input size="sm" value={item.price} onChange={(e) => handleUpdateInventory(item.id, 'price', e.target.value)} placeholder="Price" bg="blackAlpha.300" border="1px solid" borderColor="whiteAlpha.200" _focus={{ borderColor: "purple.400" }} />
                            </HStack>
                          </VStack>
                          <IconButton icon={<FaTrash />} size="sm" colorScheme="red" variant="ghost" onClick={() => handleRemovePart(item.id)} />
                        </HStack>
                      ))}
                    </SimpleGrid>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default ServicePartnerProfile;