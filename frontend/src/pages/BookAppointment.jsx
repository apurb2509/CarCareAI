import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import "../styles/BookAppointment.css";
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Select,
  RadioGroup,
  Radio,
  Stack,
  Button,
  Text,
  Icon,
  Divider,
  useToast,
  Textarea,
  Center,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import {
  FaCloudUploadAlt,
  FaDownload,
  FaCheckCircle,
  FaCar,
  FaCalendarAlt,
} from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import { State, City } from "country-state-city";
import html2pdf from "html2pdf.js";
import QRCode from "qrcode";

// Mapping for full fault category names
const faultCategoryMap = {
  ac: "Air Conditioning / Climate Control",
  alignment: "Alignment & Balancing",
  battery: "Battery & Charging System",
  brakes: "Braking System",
  clutch: "Clutch & Transmission",
  cooling: "Cooling System / Radiator",
  diagnostics: "Diagnostics / Warning Lights",
  electrical: "Electrical & Wiring",
  engine: "Engine Issues",
  exhaust: "Exhaust System",
  fuel: "Fuel System",
  general: "General Inspection",
  insurance: "Insurance / Claim Assistance",
  oil: "Oil Change & Lubrication",
  periodic: "Periodic Service",
  pickup: "Pickup & Drop Request",
  suspension: "Suspension & Steering",
  tires: "Tires / Wheels",
  transmission: "Transmission Issues",
  wash: "Vehicle Cleaning / Detailing",
  wipers: "Wipers & Windshield",
  bodywork: "Bodywork / Dent & Paint",
  interior: "Interior / Upholstery",
  software: "Software / ECU Update",
  other: "Other Issues",
};

const BookAppointment = () => {
  const toast = useToast();
  const pdfRef = useRef();
  
  // State Management
  const [carImage, setCarImage] = useState(null);
  const [carPreview, setCarPreview] = useState(null);
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [faultCategory, setFaultCategory] = useState("");
  const [otherElaboration, setOtherElaboration] = useState("");
  
  // Booking Logic State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [bookingNumber, setBookingNumber] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  // Form Data State
  const [formData, setFormData] = useState({
    ownerName: "",
    pincode: "",
    block: "",
    locality: "",
    city: "",
    state: "",
    carModel: "",
    vehicleNumber: "", 
    purchaseDate: "",
    transmission: "manual",
    fuel: "petrol",
    services: "0",
    distance: "",
    condition: "",
    tuned: "no",
    appointmentSlot: "", 
  });

  // --- Logic: Generate Time Slots ---
  const availableSlots = useMemo(() => {
    const slots = [];
    const today = new Date();
    for (let i = 1; i <= 4; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      const dateStr = futureDate.toLocaleDateString('en-IN', { 
        weekday: 'short', day: 'numeric', month: 'short' 
      });
      const timeOptions = ["09:00 AM - 12:00 PM", "01:00 PM - 04:00 PM", "04:30 PM - 07:30 PM"];
      timeOptions.forEach(time => slots.push(`${dateStr} | ${time}`));
    }
    return slots;
  }, []); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const allStates = useMemo(() => State.getStatesOfCountry("IN"), []);
  const citiesOfSelectedState = useMemo(() => {
    return selectedStateCode ? City.getCitiesOfState("IN", selectedStateCode) : [];
  }, [selectedStateCode]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setCarImage(file);
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setCarPreview(objectUrl);
    }
    toast({ title: "Image Uploaded", status: "success", duration: 2000 });
  }, [toast]);

  useEffect(() => {
    return () => { if (carPreview) URL.revokeObjectURL(carPreview); };
  }, [carPreview]);

  const generateBookingDetails = async () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const bookingNum = `BK-${dateStr}-${randomStr}`;
    setBookingNumber(bookingNum);
    
    const baseUrl = "https://carcareai.com/verify"; 
    const queryParams = new URLSearchParams({
      id: bookingNum,
      customer: formData.ownerName,
      vehicle: formData.carModel,
      slot: formData.appointmentSlot,
    }).toString();

    try {
      const qrUrl = await QRCode.toDataURL(`${baseUrl}?${queryParams}`, {
        width: 200, margin: 1, color: { dark: "#000000", light: "#FFFFFF" },
      });
      setQrCodeUrl(qrUrl);
    } catch (err) { console.error(err); }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { "image/*": [] }, multiple: false,
  });

  const handleDownloadPDF = () => {
    setIsGenerating(true);
    const element = pdfRef.current;
    const opt = {
      margin: 0,
      filename: `Booking_Receipt_${bookingNumber}.pdf`,
      image: { type: "jpeg", quality: 0.98 }, 
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save().then(() => setIsGenerating(false));
  };

  const handleSubmit = async () => {
    if (!formData.ownerName || !formData.carModel || !formData.vehicleNumber || !formData.appointmentSlot) {
      toast({ title: "Please fill required fields", status: "warning", position: "top" });
      return;
    }
    await generateBookingDetails();
    setIsSubmitted(true);
    toast({ title: "Booking Confirmed", status: "success", position: "top" });
  };

  const headerGradient = "linear-gradient(90deg, #006192 0%, #0BC5EA 100%)";
  const labelStyle = { fontSize: "10px", color: "#64748b", marginBottom: "2px", textTransform: "uppercase" };
  const valueStyle = { fontSize: "12px", fontWeight: "600", color: "#1e293b", margin: 0 };
  const sectionTitleStyle = { fontSize: "13px", color: "#006192", fontWeight: "700", borderBottom: "1px solid #e2e8f0", paddingBottom: "5px", marginBottom: "12px" };

  return (
    <Box minH="100vh" bg="#0a0a0a" py={10} className="book-appointment-container">
      {/* --- HIDDEN PDF TEMPLATE --- */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div ref={pdfRef} style={{ width: "210mm", height: "296mm", backgroundColor: "#fff", display: "flex", flexDirection: "column" }}>
          <div style={{ background: headerGradient, padding: "25px 40px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "800" }}>CarCareAI</h1>
            <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: "12px", fontWeight: "bold" }}>BOOKING ID: {bookingNumber}</p>
            </div>
          </div>
          <div style={{ padding: "30px 40px", flex: 1 }}>
            <h3 style={sectionTitleStyle}>Appointment Details</h3>
            <p style={labelStyle}>SLOT</p>
            <p style={{...valueStyle, color: "#0BC5EA", fontSize: "16px"}}>{formData.appointmentSlot}</p>
            <Divider my={4} />
            <SimpleGrid columns={2} spacing={10}>
                <Box><p style={labelStyle}>CUSTOMER</p><p style={valueStyle}>{formData.ownerName}</p></Box>
                <Box><p style={labelStyle}>VEHICLE</p><p style={valueStyle}>{formData.carModel} ({formData.vehicleNumber})</p></Box>
            </SimpleGrid>
            {qrCodeUrl && <Center mt={10}><img src={qrCodeUrl} style={{width: "120px"}} alt="QR" /></Center>}
          </div>
        </div>
      </div>

      {/* --- MAIN INTERFACE --- */}
      <Center>
        <VStack
          spacing={6}
          w={{ base: "95%", md: "800px" }}
          bg="rgba(20, 20, 20, 0.98)"
          p={{ base: 6, md: 16 }}
          borderRadius="xl"
          boxShadow="dark-lg"
          border="1px solid rgba(255,255,255,0.05)"
          color="white"
          className="a4-container"
        >
          <Heading size="xl" bgGradient="linear(to-r, cyan.400, blue.500)" bgClip="text">Appointment Booking</Heading>
          <Text color="whiteAlpha.600" fontSize="sm">Reliable service that keeps you moving!</Text>
          <Divider borderColor="whiteAlpha.200" />

          <Heading size="md" w="full" color="cyan.400">1. Personal & Address Details</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
            <FormControl isRequired><FormLabel fontSize="xs" color="gray.500">OWNER NAME</FormLabel>
              <Input name="ownerName" placeholder="Name" bg="whiteAlpha.50" border="none" onChange={handleInputChange} />
            </FormControl>
            <FormControl isRequired><FormLabel fontSize="xs" color="gray.500">PINCODE</FormLabel>
              <Input name="pincode" type="number" placeholder="XXXXXX" bg="whiteAlpha.50" border="none" onChange={handleInputChange} />
            </FormControl>
            <FormControl isRequired><FormLabel fontSize="xs" color="gray.500">BLOCK / HOUSE NO</FormLabel>
              <Input name="block" placeholder="Flat No" bg="whiteAlpha.50" border="none" onChange={handleInputChange} />
            </FormControl>
            <FormControl isRequired><FormLabel fontSize="xs" color="gray.500">LOCALITY</FormLabel>
              <Input name="locality" placeholder="Area" bg="whiteAlpha.50" border="none" onChange={handleInputChange} />
            </FormControl>
            <FormControl isRequired><FormLabel fontSize="xs" color="gray.500">STATE</FormLabel>
              <Select placeholder="Select State" bg="gray.800" border="none" name="state" onChange={(e) => { setSelectedStateCode(e.target.value); handleInputChange(e); }}>
                {allStates.map((s) => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
              </Select>
            </FormControl>
            <FormControl isRequired><FormLabel fontSize="xs" color="gray.500">CITY</FormLabel>
              <Select placeholder="Select City" bg="gray.800" border="none" isDisabled={!selectedStateCode} name="city" onChange={handleInputChange}>
                {citiesOfSelectedState.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
              </Select>
            </FormControl>
          </SimpleGrid>

          <Divider borderColor="whiteAlpha.200" />
          <Heading size="md" w="full" color="cyan.400">2. Vehicle Specifications</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
            <FormControl isRequired><FormLabel fontSize="xs" color="gray.500">CAR MODEL</FormLabel>
              <Input name="carModel" placeholder="Swift" bg="whiteAlpha.50" border="none" onChange={handleInputChange} />
            </FormControl>
            <FormControl isRequired><FormLabel fontSize="xs" color="gray.500">VEHICLE NUMBER</FormLabel>
              <Input name="vehicleNumber" placeholder="MH 01 AB 1234" bg="whiteAlpha.50" border="none" onChange={handleInputChange} textTransform="uppercase" />
            </FormControl>
            <FormControl isRequired><FormLabel fontSize="xs" color="gray.500">PURCHASE DATE</FormLabel>
              <Input name="purchaseDate" type="date" bg="whiteAlpha.50" border="none" onChange={handleInputChange} css={{ "&::-webkit-calendar-picker-indicator": { filter: "invert(1)" }}} />
            </FormControl>
          </SimpleGrid>

          <Box w="full" pt={2}>
            <FormControl isRequired>
              <FormLabel fontSize="xs" color="cyan.400" fontWeight="bold"><Icon as={FaCalendarAlt} mr={2} />SELECT APPOINTMENT SLOT</FormLabel>
              <Select name="appointmentSlot" placeholder="Choose time..." bg="gray.800" border="1px solid" borderColor="cyan.800" onChange={handleInputChange}>
                {availableSlots.map((slot, index) => <option key={index} value={slot}>{slot}</option>)}
              </Select>
            </FormControl>
          </Box>

          <Box w="full" p={5} bg="whiteAlpha.50" borderRadius="lg">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
              <FormControl><FormLabel fontSize="xs" color="gray.500">TRANSMISSION</FormLabel>
                <RadioGroup onChange={(v) => setFormData({ ...formData, transmission: v })} value={formData.transmission}>
                  <Stack direction="row"><Radio value="automatic">Auto</Radio><Radio value="manual">Manual</Radio></Stack>
                </RadioGroup>
              </FormControl>
              <FormControl><FormLabel fontSize="xs" color="gray.500">FUEL TYPE</FormLabel>
                <RadioGroup onChange={(v) => setFormData({ ...formData, fuel: v })} value={formData.fuel}>
                  <SimpleGrid columns={2} spacing={2}><Radio value="petrol">Petrol</Radio><Radio value="diesel">Diesel</Radio></SimpleGrid>
                </RadioGroup>
              </FormControl>
            </SimpleGrid>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
            <FormControl isRequired><FormLabel fontSize="xs" color="gray.500">CONDITION</FormLabel>
              <Select name="condition" placeholder="Select" bg="gray.800" border="none" onChange={handleInputChange}>
                <option value="stocked">Stocked</option><option value="modified">Modified</option>
              </Select>
            </FormControl>
            <FormControl isRequired><FormLabel fontSize="xs" color="gray.500">DISTANCE TRAVELLED</FormLabel>
              <Select name="distance" placeholder="Select Range" bg="gray.800" border="none" onChange={handleInputChange}>
                <option value="5000">Under 5,000</option><option value="20000">Under 20,000</option>
              </Select>
            </FormControl>
          </SimpleGrid>

          <FormControl isRequired>
            <FormLabel fontSize="xs" color="gray.500">FAULT CATEGORY</FormLabel>
            <Select placeholder="Select Issue" bg="gray.800" border="none" value={faultCategory} onChange={(e) => setFaultCategory(e.target.value)}>
              {Object.entries(faultCategoryMap).map(([key, value]) => <option key={key} value={key}>{value}</option>)}
            </Select>
            {faultCategory === "other" && <Textarea mt={3} placeholder="Describe..." bg="whiteAlpha.100" border="none" onChange={(e) => setOtherElaboration(e.target.value)} />}
          </FormControl>

          <Box w="full">
            <FormLabel fontSize="xs" color="gray.500">CAR PHOTOGRAPH (OPTIONAL)</FormLabel>
            <Box {...getRootProps()} p={8} border="2px dashed" borderColor={isDragActive ? "cyan.400" : "whiteAlpha.200"} borderRadius="xl" textAlign="center" cursor="pointer">
              <input {...getInputProps()} /><Icon as={FaCloudUploadAlt} w={8} h={8} color="cyan.400" mb={2} />
              <Text fontSize="xs">{carImage ? carImage.name : "Drag & drop car image"}</Text>
            </Box>
          </Box>

          <VStack w="full" spacing={4} pt={6}>
            {!isSubmitted ? (
              <Button size="lg" w="full" bgGradient="linear(to-r, cyan.400, blue.600)" color="white" onClick={handleSubmit}>Confirm Booking</Button>
            ) : (
              <HStack w="full" spacing={4}>
                <Button leftIcon={<FaCheckCircle />} colorScheme="green" flex={1}>Confirmed</Button>
                <Button leftIcon={isGenerating ? <Spinner size="xs" /> : <FaDownload />} colorScheme="cyan" variant="outline" onClick={handleDownloadPDF} isDisabled={isGenerating}>
                  {isGenerating ? "Generating..." : "Download PDF"}
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