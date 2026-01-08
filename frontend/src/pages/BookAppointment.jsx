import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  Box, VStack, Heading, FormControl, FormLabel, Input, SimpleGrid, Select, 
  RadioGroup, Radio, Stack, Button, Text, Icon, Divider, useToast, Textarea, 
  Center, HStack, Spinner // Added HStack and Spinner
} from '@chakra-ui/react';
import { FaCloudUploadAlt, FaCar, FaMapMarkerAlt, FaWrench, FaDownload, FaCheckCircle } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';
import { State, City } from 'country-state-city';
import html2pdf from 'html2pdf.js';

const BookAppointment = () => {
  const toast = useToast();
  const pdfRef = useRef();
  const [carImage, setCarImage] = useState(null);
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [faultCategory, setFaultCategory] = useState("");
  const [otherElaboration, setOtherElaboration] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form State for PDF tracking
  const [formData, setFormData] = useState({
    ownerName: '', pincode: '', block: '', locality: '', city: '', state: '',
    carModel: '', purchaseDate: '', transmission: 'manual', fuel: 'petrol',
    services: '0', distance: '', condition: '', tuned: 'no'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const allStates = useMemo(() => State.getStatesOfCountry('IN'), []);
  
  const citiesOfSelectedState = useMemo(() => {
    return selectedStateCode ? City.getCitiesOfState('IN', selectedStateCode) : [];
  }, [selectedStateCode]);

  const onDrop = useCallback(acceptedFiles => {
    setCarImage(acceptedFiles[0]);
    toast({ title: "Image Uploaded", status: "success", duration: 2000 });
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, accept: {'image/*': []}, multiple: false 
  });

  const handleDownloadPDF = () => {
    setIsGenerating(true);
    const element = pdfRef.current;
    const opt = {
      margin: 10,
      filename: `Booking_Receipt_${formData.ownerName || 'Customer'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        setIsGenerating(false);
        toast({ title: "PDF Downloaded", status: "success", duration: 2000 });
    });
  };

  const handleSubmit = () => {
    // Basic validation check
    if(!formData.ownerName || !formData.carModel) {
        toast({ title: "Please fill required fields", status: "warning", position: "top" });
        return;
    }
    setIsSubmitted(true);
    toast({ 
      title: "Booking Confirmed", 
      description: "You can now download your receipt.", 
      status: "success", 
      duration: 5000,
      isClosable: true,
      position: "top"
    });
  };

  return (
    <Box minH="100vh" bg="#0a0a0a" py={10}>
      {/* --- HIDDEN PDF TEMPLATE (A4 STYLE) --- */}
      <div style={{ display: 'none' }}>
        <div ref={pdfRef} style={{ padding: '20mm', color: '#000', fontFamily: 'Arial', width: '210mm' }}>
          <div style={{ borderBottom: '3px solid #0BC5EA', paddingBottom: '10px', marginBottom: '20px' }}>
            <h1 style={{ color: '#0BC5EA', margin: 0, fontSize: '28px' }}>CarCareAI</h1>
            <p style={{ fontSize: '14px', fontWeight: 'bold' }}>OFFICIAL SERVICE BOOKING RECEIPT</p>
            <p style={{ fontSize: '11px' }}>Generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Customer Details</h3>
            <p><strong>Name:</strong> {formData.ownerName}</p>
            <p><strong>Address:</strong> {`${formData.block}, ${formData.locality}, ${formData.city}, ${formData.state} - ${formData.pincode}`}</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Vehicle Details</h3>
            <table style={{ width: '100%', fontSize: '12px' }}>
                <tr><td><strong>Model:</strong> {formData.carModel}</td><td><strong>Purchase Date:</strong> {formData.purchaseDate}</td></tr>
                <tr><td><strong>Transmission:</strong> {formData.transmission}</td><td><strong>Fuel Type:</strong> {formData.fuel}</td></tr>
                <tr><td><strong>Condition:</strong> {formData.condition}</td><td><strong>Tuned:</strong> {formData.tuned}</td></tr>
                <tr><td><strong>Total Distance:</strong> {formData.distance} km</td><td><strong>Services Done:</strong> {formData.services}</td></tr>
            </table>
          </div>

          <div style={{ padding: '15px', background: '#f9f9f9', borderRadius: '5px' }}>
            <p><strong>Reported Issue:</strong> {faultCategory === 'other' ? otherElaboration : faultCategory}</p>
          </div>

          <div style={{ marginTop: '100px', textAlign: 'center', fontSize: '10px', color: '#888' }}>
            This is an industry-ready digital booking confirmation. Please present this PDF at the service station.
          </div>
        </div>
      </div>

      {/* --- MAIN INTERFACE (A4 UI) --- */}
      <Center>
        <VStack 
          spacing={6} 
          w={{ base: "95%", md: "210mm" }} 
          minH="297mm" 
          bg="rgba(20, 20, 20, 0.98)" 
          p={{ base: 6, md: 16 }} 
          borderRadius="xl" 
          boxShadow="dark-lg"
          border="1px solid rgba(255,255,255,0.05)"
          color="white"
          position="relative"
        >
          <Heading size="xl" bgGradient="linear(to-r, cyan.400, blue.500)" bgClip="text">Appointment Booking</Heading>
          <Text color="whiteAlpha.600" fontSize="sm">A4 Industry Standard Format</Text>
          
          <Divider borderColor="whiteAlpha.200" />

          {/* 1. Owner Section */}
          <Heading size="md" w="full" color="cyan.400">1. Personal & Address Details</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
            <FormControl isRequired>
              <FormLabel fontSize="xs" color="gray.500">OWNER NAME</FormLabel>
              <Input name="ownerName" placeholder="John Doe" bg="whiteAlpha.50" border="none" onChange={handleInputChange}/>
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontSize="xs" color="gray.500">PINCODE</FormLabel>
              <Input name="pincode" type="number" placeholder="000000" bg="whiteAlpha.50" border="none" onChange={handleInputChange}/>
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontSize="xs" color="gray.500">BLOCK / HOUSE NO</FormLabel>
              <Input name="block" placeholder="Flat / Plot No" bg="whiteAlpha.50" border="none" onChange={handleInputChange}/>
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontSize="xs" color="gray.500">LOCALITY</FormLabel>
              <Input name="locality" placeholder="Area Name" bg="whiteAlpha.50" border="none" onChange={handleInputChange}/>
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontSize="xs" color="gray.500">STATE</FormLabel>
              <Select placeholder="Select State" bg="gray.800" border="none" name="state" onChange={(e) => {setSelectedStateCode(e.target.value); handleInputChange(e)}}>
                {allStates.map(s => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontSize="xs" color="gray.500">CITY</FormLabel>
              <Select placeholder="Select City" bg="gray.800" border="none" isDisabled={!selectedStateCode} name="city" onChange={handleInputChange}>
                {citiesOfSelectedState.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </Select>
            </FormControl>
          </SimpleGrid>

          <Divider borderColor="whiteAlpha.200" />

          {/* 2. Car Specifications */}
          <Heading size="md" w="full" color="cyan.400">2. Vehicle Specifications</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
            <FormControl isRequired>
              <FormLabel fontSize="xs" color="gray.500">CAR MODEL</FormLabel>
              <Input name="carModel" placeholder="e.g. Maruti Swift" bg="whiteAlpha.50" border="none" onChange={handleInputChange}/>
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontSize="xs" color="gray.500">PURCHASE DATE</FormLabel>
              <Input name="purchaseDate" type="date" bg="whiteAlpha.50" border="none" onChange={handleInputChange} css={{ "&::-webkit-calendar-picker-indicator": { filter: "invert(1)" }}}/>
            </FormControl>
          </SimpleGrid>

          <Box w="full" p={5} bg="whiteAlpha.50" borderRadius="lg" border="1px solid rgba(255,255,255,0.05)">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
              <FormControl>
                <FormLabel fontSize="xs" color="gray.500">TRANSMISSION</FormLabel>
                <RadioGroup onChange={(v) => setFormData({...formData, transmission: v})} value={formData.transmission}>
                  <Stack direction="row"><Radio value="automatic" colorScheme="cyan">Automatic</Radio><Radio value="manual" colorScheme="cyan">Manual</Radio></Stack>
                </RadioGroup>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="xs" color="gray.500">FUEL TYPE</FormLabel>
                <RadioGroup onChange={(v) => setFormData({...formData, fuel: v})} value={formData.fuel}>
                  <SimpleGrid columns={2} spacing={2}><Radio value="petrol">Petrol</Radio><Radio value="diesel">Diesel</Radio><Radio value="hybrid">Hybrid</Radio><Radio value="ev">EV</Radio></SimpleGrid>
                </RadioGroup>
              </FormControl>
            </SimpleGrid>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
            <FormControl isRequired>
                <FormLabel fontSize="xs" color="gray.500">CONDITION</FormLabel>
                <Select name="condition" placeholder="Select" bg="gray.800" border="none" onChange={handleInputChange}><option value="stocked">Stocked</option><option value="modified">Modified</option></Select>
            </FormControl>
            <FormControl isRequired>
                <FormLabel fontSize="xs" color="gray.500">DISTANCE TRAVELLED</FormLabel>
                <Select name="distance" placeholder="Select Range" bg="gray.800" border="none" onChange={handleInputChange}>
                    <option value="5000">Under 5,000</option><option value="20000">Under 20,000</option><option value="50000">Under 50,000</option><option value="above">Above 100,000</option>
                </Select>
            </FormControl>
          </SimpleGrid>

          <FormControl isRequired>
            <FormLabel fontSize="xs" color="gray.500">FAULT CATEGORY</FormLabel>
            <Select placeholder="Select primary issue" bg="gray.800" border="none" value={faultCategory} onChange={(e) => setFaultCategory(e.target.value)}>
              <option value="engine">Engine Issues</option><option value="brake">Braking System</option><option value="electrical">Electrical / Battery</option><option value="general">Periodic Service</option><option value="other">Other Issues</option>
            </Select>
            {faultCategory === "other" && <Textarea mt={3} placeholder="Describe the issue specifically..." bg="whiteAlpha.100" border="none" onChange={(e) => setOtherElaboration(e.target.value)}/>}
          </FormControl>

          {/* 3. Image Upload (Bottom) */}
          <Box w="full">
            <FormLabel fontSize="xs" color="gray.500">CAR PHOTOGRAPH (OPTIONAL)</FormLabel>
            <Box {...getRootProps()} p={8} border="2px dashed" borderColor={isDragActive ? "cyan.400" : "whiteAlpha.200"} borderRadius="xl" textAlign="center" cursor="pointer" _hover={{ bg: "whiteAlpha.50" }}>
              <input {...getInputProps()} />
              <Icon as={FaCloudUploadAlt} w={8} h={8} color="cyan.400" mb={2} />
              <Text fontSize="xs">{carImage ? carImage.name : "Drag & drop car image for visual diagnostics"}</Text>
            </Box>
          </Box>

          <VStack w="full" spacing={4} pt={6}>
            {!isSubmitted ? (
              <Button size="lg" w="full" bgGradient="linear(to-r, cyan.400, blue.600)" color="white" onClick={handleSubmit} _hover={{ transform: "scale(1.02)", boxShadow: "0 5px 15px rgba(0, 255, 255, 0.3)" }}>
                Confirm Booking
              </Button>
            ) : (
              <HStack w="full" spacing={4}>
                <Button leftIcon={<FaCheckCircle />} colorScheme="green" flex={1} variant="solid" cursor="default">Booking Confirmed</Button>
                <Button 
                    leftIcon={isGenerating ? <Spinner size="xs" /> : <FaDownload />} 
                    colorScheme="cyan" 
                    variant="outline" 
                    onClick={handleDownloadPDF}
                    isDisabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Download Receipt"}
                </Button>
              </HStack>
            )}
          </VStack>
        </VStack>
      </Center>
    </Box>
  );
};

export default BookAppointment;