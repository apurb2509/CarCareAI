import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
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

  // --- Logic: Generate Time Slots (Next 3 Days, 24h from now) ---
  const availableSlots = useMemo(() => {
    const slots = [];
    const today = new Date();
    for (let i = 1; i <= 4; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      
      const dateStr = futureDate.toLocaleDateString('en-IN', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
      });

      const timeOptions = ["09:00 AM - 12:00 PM", "01:00 PM - 04:00 PM", "04:30 PM - 07:30 PM"];
      
      timeOptions.forEach(time => {
        slots.push(`${dateStr} | ${time}`);
      });
    }
    return slots;
  }, []); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const allStates = useMemo(() => State.getStatesOfCountry("IN"), []);

  const citiesOfSelectedState = useMemo(() => {
    return selectedStateCode
      ? City.getCitiesOfState("IN", selectedStateCode)
      : [];
  }, [selectedStateCode]);

  // Handle Image Drop & Preview
  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      setCarImage(file);
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        setCarPreview(objectUrl);
      }
      toast({ title: "Image Uploaded", status: "success", duration: 2000 });
    },
    [toast]
  );

  // Clean up memory
  useEffect(() => {
    return () => {
      if (carPreview) {
        URL.revokeObjectURL(carPreview);
      }
    };
  }, [carPreview]);

  // --- Logic: Generate Booking ID & QR Code ---
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

    const qrData = `${baseUrl}?${queryParams}`;
    
    try {
      const qrUrl = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrCodeUrl(qrUrl);
    } catch (err) {
      console.error("QR Code generation error:", err);
      toast({ title: "Error generating QR", status: "error" });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  // --- Logic: Download PDF ---
  const handleDownloadPDF = () => {
    setIsGenerating(true);
    const element = pdfRef.current;
    const opt = {
      margin: 0,
      filename: `Booking_Receipt_${bookingNumber}.pdf`,
      image: { type: "jpeg", quality: 0.98 }, 
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        scrollY: 0,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        setIsGenerating(false);
        toast({ title: "PDF Downloaded", status: "success", duration: 2000 });
      });
  };

  const handleSubmit = async () => {
    if (!formData.ownerName || !formData.carModel || !formData.vehicleNumber || !formData.appointmentSlot) {
      toast({
        title: "Please fill required fields",
        description: "Name, Model, Vehicle Number, and Slot are mandatory.",
        status: "warning",
        position: "top",
      });
      return;
    }
    
    await generateBookingDetails();
    setIsSubmitted(true);
    
    toast({
      title: "Booking Confirmed",
      description: "You can now download your receipt.",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top",
    });
  };

  // --- PDF STYLES ---
  const pdfHeight = "296mm"; 
  const pdfWidth = "210mm";
  const headerGradient = "linear-gradient(90deg, #006192 0%, #0BC5EA 100%)";

  // Shared Styles for PDF
  const labelStyle = { fontSize: "10px", color: "#64748b", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.5px" };
  const valueStyle = { fontSize: "12px", fontWeight: "600", color: "#1e293b", margin: 0, lineHeight: 1.4 };
  const sectionTitleStyle = { 
    fontSize: "13px", 
    color: "#006192", 
    fontWeight: "700", 
    textTransform: "uppercase", 
    borderBottom: "1px solid #e2e8f0", 
    paddingBottom: "5px", 
    marginBottom: "12px" 
  };

  return (
    <Box minH="100vh" bg="#0a0a0a" py={10}>
      
      {/* --- HIDDEN PDF TEMPLATE (Strict 1 Page, Aligned) --- */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div
          ref={pdfRef}
          style={{
            width: pdfWidth,
            height: pdfHeight, 
            backgroundColor: "#fff",
            fontFamily: "'Segoe UI', Helvetica, Arial, sans-serif",
            display: "flex",
            flexDirection: "column",
            color: "#1a202c",
            boxSizing: "border-box",
            overflow: "hidden"
          }}
        >
          {/* 1. Header */}
          <div style={{ 
            background: headerGradient, 
            padding: "25px 40px", 
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center" // Ensures vertical centering of left and right blocks
          }}>
            {/* Left Side: Logo & Subtitle */}
            <div>
              <div style={{ display: "flex", alignItems: "center" }}>
                 <Icon as={FaCar} w={7} h={7} color="white" mr={3} />
                 <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "800", letterSpacing: "0.5px", lineHeight: 1 }}>
                   CarCareAI
                 </h1>
              </div>
              <p style={{ margin: "5px 0 0 0", paddingLeft: "2px", fontSize: "10px", opacity: 0.85, letterSpacing: "1.2px", fontWeight: "500", textTransform: "uppercase" }}>
              Advanced Automotive Service & Maintenance
              </p>
            </div>
            
            {/* Right Side: Title & ID (Fixed Alignment) */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <h2 style={{ margin: 0, fontSize: "14px", fontWeight: "700", letterSpacing: "0.5px", opacity: 0.9, marginBottom: "6px" }}>APPOINTMENT BOOKING</h2>
                <div style={{ 
                    background: "rgba(255,255,255,0.2)", 
                    padding: "6px 12px", 
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center"
                }}>
                    <span style={{ fontSize: "11px", marginRight: "6px", fontWeight: "600", opacity: 0.9 }}>ID:</span>
                    <span style={{ fontSize: "15px", fontWeight: "700", fontFamily: "monospace", letterSpacing: "0.5px" }}>{bookingNumber}</span>
                </div>
            </div>
          </div>

          {/* 2. Main Body */}
          <div style={{ padding: "30px 40px", flex: 1, display: "flex", flexDirection: "column" }}>
            
            {/* Status Bar (Fixed Alignment) */}
            <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", // This centers items vertically
                background: "#f1f5f9", 
                borderLeft: "5px solid #0BC5EA",
                padding: "15px 20px",
                borderRadius: "0 4px 4px 0",
                marginBottom: "30px"
            }}>
                <div>
                    <p style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", fontWeight: "bold", marginBottom: "2px" }}>SELECTED SLOT</p>
                    <p style={{ fontSize: "14px", fontWeight: "700", color: "#006192", margin: 0, lineHeight: 1 }}>{formData.appointmentSlot}</p>
                </div>
                
                {/* Right side aligned vertically center with left */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <p style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", fontWeight: "bold", marginBottom: "2px" }}>STATUS</p>
                    <span style={{ 
                        background: "#d1fae5", 
                        color: "#047857", 
                        padding: "4px 12px", 
                        borderRadius: "12px", 
                        fontSize: "11px", 
                        fontWeight: "800", 
                        textTransform: "uppercase",
                        display: "inline-block",
                        lineHeight: 1
                    }}>
                        Confirmed
                    </span>
                </div>
            </div>

            {/* Section 1: Customer Information */}
            <div style={{ marginBottom: "25px" }}>
                <h3 style={sectionTitleStyle}>1. Customer Information</h3>
                <div style={{ display: "flex", gap: "40px" }}>
                    <div style={{ flex: 1 }}>
                        <p style={labelStyle}>OWNER NAME</p>
                        <p style={valueStyle}>{formData.ownerName}</p>
                    </div>
                    <div style={{ flex: 2 }}>
                        <p style={labelStyle}>ADDRESS</p>
                        <p style={valueStyle}>
                            {formData.block}, {formData.locality}, {formData.city}, {formData.state} - {formData.pincode}
                        </p>
                    </div>
                </div>
            </div>

            {/* Section 2: Vehicle Details */}
            <div style={{ marginBottom: "25px" }}>
                <h3 style={sectionTitleStyle}>2. Vehicle Details</h3>
                <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                    
                    {/* Data Grid */}
                    <div style={{ 
                        flex: 1.5, 
                        display: "grid", 
                        gridTemplateColumns: "1fr 1fr", 
                        gap: "15px 10px" 
                    }}>
                        <div><p style={labelStyle}>MODEL</p><p style={valueStyle}>{formData.carModel}</p></div>
                        <div><p style={labelStyle}>REGISTRATION NO</p><p style={{...valueStyle, textTransform: "uppercase"}}>{formData.vehicleNumber}</p></div>
                        
                        <div><p style={labelStyle}>FUEL TYPE</p><p style={{...valueStyle, textTransform: "capitalize"}}>{formData.fuel}</p></div>
                        <div><p style={labelStyle}>TRANSMISSION</p><p style={{...valueStyle, textTransform: "capitalize"}}>{formData.transmission}</p></div>
                        
                        <div><p style={labelStyle}>PURCHASE DATE</p><p style={valueStyle}>{formData.purchaseDate || "N/A"}</p></div>
                        <div><p style={labelStyle}>ODOMETER</p><p style={valueStyle}>{formData.distance} km</p></div>
                        
                        <div><p style={labelStyle}>CONDITION</p><p style={{...valueStyle, textTransform: "capitalize"}}>{formData.condition}</p></div>
                        <div><p style={labelStyle}>TUNED</p><p style={{...valueStyle, textTransform: "uppercase"}}>{formData.tuned}</p></div>
                    </div>

                    {/* Image Box */}
                    <div style={{ 
                        flex: 1, 
                        height: "140px", 
                        background: "#f8fafc", 
                        border: "1px solid #e2e8f0", 
                        borderRadius: "4px",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        {carPreview ? (
                            <img src={carPreview} alt="Car" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                            <div style={{textAlign: "center", color: "#94a3b8"}}>
                                <Icon as={FaCar} w={10} h={10} mb={1} />
                                <p style={{fontSize: "10px"}}>No Image</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Section 3: Service Summary */}
            <div>
                <h3 style={sectionTitleStyle}>3. Service Summary</h3>
                <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    background: "#f8fafc", 
                    border: "1px solid #e2e8f0", 
                    borderRadius: "6px", 
                    padding: "15px"
                }}>
                    <div style={{ flex: 1, paddingRight: "20px" }}>
                        <p style={labelStyle}>REPORTED ISSUE</p>
                        <p style={{ fontSize: "14px", fontWeight: "700", color: "#0BC5EA", marginBottom: "5px" }}>
                            {faultCategoryMap[faultCategory] || "General Service"}
                        </p>
                        <p style={{ fontSize: "11px", color: "#475569", lineHeight: "1.5" }}>
                            Description: {faultCategory === "other" ? otherElaboration : (faultCategoryMap[faultCategory] ? `Standard diagnostics and repair for ${faultCategoryMap[faultCategory]}.` : "General maintenance checkup.")}
                        </p>
                    </div>
                    
                    <div style={{ 
                        width: "80px", 
                        textAlign: "center", 
                        display: "flex", 
                        flexDirection: "column", 
                        alignItems: "center" 
                    }}>
                        {qrCodeUrl && (
                            <img src={qrCodeUrl} alt="QR" style={{ width: "70px", height: "70px", display: "block", marginBottom: "4px" }} />
                        )}
                        <p style={{ fontSize: "8px", color: "#64748b", textTransform: "uppercase" }}>Scan Entry</p>
                    </div>
                </div>
            </div>

          </div>

          {/* 3. Footer */}
          <div style={{ 
            background: headerGradient, 
            padding: "15px 40px", 
            color: "white", 
            fontSize: "10px",
            display: "flex", 
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "auto"
          }}>
             <div>
                 <p style={{ margin: 0, fontWeight: "600" }}>CarCareAI Services</p>
                 <p style={{ margin: 0, opacity: 0.8 }}>www.carcareai.com</p>
             </div>
             <div style={{ textAlign: "right" }}>
                 <p style={{ margin: 0, opacity: 0.8 }}>Support: +91 98765 43210</p>
                 <p style={{ margin: 0, opacity: 0.8 }}>System Generated Receipt</p>
             </div>
          </div>
        </div>
      </div>

      {/* --- MAIN INTERFACE (Form) --- */}
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
          position="relative"
        >
          <Heading
            size="xl"
            bgGradient="linear(to-r, cyan.400, blue.500)"
            bgClip="text"
          >
            Appointment Booking
          </Heading>
          <Text color="whiteAlpha.600" fontSize="sm">
            Reliable service that keeps you moving!
          </Text>

          <Divider borderColor="whiteAlpha.200" />

          {/* 1. Owner Section */}
          <Heading size="md" w="full" color="cyan.400">
            1. Personal & Address Details
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
            <FormControl isRequired>
              <FormLabel fontSize="xs" color="gray.500">
                OWNER NAME
              </FormLabel>
              <Input
                name="ownerName"
                placeholder="Write your name.."
                bg="whiteAlpha.50"
                border="none"
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontSize="xs" color="gray.500">
                PINCODE
              </FormLabel>
              <Input
                name="pincode"
                type="number"
                placeholder="XXXXXX"
                bg="whiteAlpha.50"
                border="none"
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontSize="xs" color="gray.500">
                BLOCK / HOUSE NO
              </FormLabel>
              <Input
                name="block"
                placeholder="Flat / Plot No"
                bg="whiteAlpha.50"
                border="none"
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontSize="xs" color="gray.500">
                LOCALITY
              </FormLabel>
              <Input
                name="locality"
                placeholder="Area Name"
                bg="whiteAlpha.50"
                border="none"
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontSize="xs" color="gray.500">
                STATE
              </FormLabel>
              <Select
                placeholder="Select State"
                bg="gray.800"
                border="none"
                name="state"
                onChange={(e) => {
                  setSelectedStateCode(e.target.value);
                  handleInputChange(e);
                }}
              >
                {allStates.map((s) => (
                  <option key={s.isoCode} value={s.isoCode}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontSize="xs" color="gray.500">
                CITY
              </FormLabel>
              <Select
                placeholder="Select City"
                bg="gray.800"
                border="none"
                isDisabled={!selectedStateCode}
                name="city"
                onChange={handleInputChange}
              >
                {citiesOfSelectedState.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </SimpleGrid>

          <Divider borderColor="whiteAlpha.200" />

          {/* 2. Car Specifications */}
          <Heading size="md" w="full" color="cyan.400">
            2. Vehicle Specifications
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
            <FormControl isRequired>
              <FormLabel fontSize="xs" color="gray.500">
                CAR MODEL
              </FormLabel>
              <Input
                name="carModel"
                placeholder="e.g. Swift Dzire"
                bg="whiteAlpha.50"
                border="none"
                onChange={handleInputChange}
              />
            </FormControl>
            
            {/* New Vehicle Number Input */}
            <FormControl isRequired>
              <FormLabel fontSize="xs" color="gray.500">
                VEHICLE NUMBER
              </FormLabel>
              <Input
                name="vehicleNumber"
                placeholder="OR 04 N 2355"
                bg="whiteAlpha.50"
                border="none"
                textTransform="uppercase"
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="xs" color="gray.500">
                PURCHASE DATE
              </FormLabel>
              <Input
                name="purchaseDate"
                type="date"
                bg="whiteAlpha.50"
                border="none"
                onChange={handleInputChange}
                css={{
                  "&::-webkit-calendar-picker-indicator": {
                    filter: "invert(1)",
                  },
                }}
              />
            </FormControl>
          </SimpleGrid>

          {/* Time Slot Selection */}
          <Box w="full" pt={2}>
             <FormControl isRequired>
              <FormLabel fontSize="xs" color="cyan.400" fontWeight="bold">
                <Icon as={FaCalendarAlt} mr={2} />
                SELECT APPOINTMENT SLOT (Starts 24h from now)
              </FormLabel>
              <Select
                name="appointmentSlot"
                placeholder="Choose a date and time..."
                bg="gray.800"
                border="1px solid"
                borderColor="cyan.800"
                _hover={{ borderColor: "cyan.400" }}
                onChange={handleInputChange}
              >
                {availableSlots.map((slot, index) => (
                  <option key={index} value={slot}>{slot}</option>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box
            w="full"
            p={5}
            bg="whiteAlpha.50"
            borderRadius="lg"
            border="1px solid rgba(255,255,255,0.05)"
          >
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
              <FormControl>
                <FormLabel fontSize="xs" color="gray.500">
                  TRANSMISSION
                </FormLabel>
                <RadioGroup
                  onChange={(v) =>
                    setFormData({ ...formData, transmission: v })
                  }
                  value={formData.transmission}
                >
                  <Stack direction="row">
                    <Radio value="automatic" colorScheme="cyan">
                      Automatic
                    </Radio>
                    <Radio value="manual" colorScheme="cyan">
                      Manual
                    </Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="xs" color="gray.500">
                  FUEL TYPE
                </FormLabel>
                <RadioGroup
                  onChange={(v) => setFormData({ ...formData, fuel: v })}
                  value={formData.fuel}
                >
                  <SimpleGrid columns={2} spacing={2}>
                    <Radio value="petrol">Petrol</Radio>
                    <Radio value="diesel">Diesel</Radio>
                    <Radio value="hybrid">Hybrid</Radio>
                    <Radio value="ev">EV</Radio>
                  </SimpleGrid>
                </RadioGroup>
              </FormControl>
            </SimpleGrid>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
            <FormControl isRequired>
              <FormLabel fontSize="xs" color="gray.500">
                CONDITION
              </FormLabel>
              <Select
                name="condition"
                placeholder="Select"
                bg="gray.800"
                border="none"
                onChange={handleInputChange}
              >
                <option value="stocked">Stocked</option>
                <option value="modified">Modified</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontSize="xs" color="gray.500">
                DISTANCE TRAVELLED
              </FormLabel>
              <Select
                name="distance"
                placeholder="Select Range"
                bg="gray.800"
                border="none"
                onChange={handleInputChange}
              >
                <option value="5000">Under 5,000</option>
                <option value="20000">Under 20,000</option>
                <option value="50000">Under 50,000</option>
                <option value="above">Above 100,000</option>
              </Select>
            </FormControl>
          </SimpleGrid>

          <FormControl isRequired>
            <FormLabel fontSize="xs" color="gray.500">
              FAULT CATEGORY
            </FormLabel>
            <Select
              placeholder="Select primary issue"
              bg="gray.800"
              border="none"
              value={faultCategory}
              onChange={(e) => setFaultCategory(e.target.value)}
            >
              {Object.entries(faultCategoryMap).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </Select>
            {faultCategory === "other" && (
              <Textarea
                mt={3}
                placeholder="Describe the issue specifically..."
                bg="whiteAlpha.100"
                border="none"
                onChange={(e) => setOtherElaboration(e.target.value)}
              />
            )}
          </FormControl>

          {/* 3. Image Upload (Bottom) */}
          <Box w="full">
            <FormLabel fontSize="xs" color="gray.500">
              CAR PHOTOGRAPH (OPTIONAL)
            </FormLabel>
            <Box
              {...getRootProps()}
              p={8}
              border="2px dashed"
              borderColor={isDragActive ? "cyan.400" : "whiteAlpha.200"}
              borderRadius="xl"
              textAlign="center"
              cursor="pointer"
              _hover={{ bg: "whiteAlpha.50" }}
            >
              <input {...getInputProps()} />
              <Icon as={FaCloudUploadAlt} w={8} h={8} color="cyan.400" mb={2} />
              <Text fontSize="xs">
                {carImage
                  ? carImage.name
                  : "Drag & drop car image for visual diagnostics"}
              </Text>
            </Box>
          </Box>

          <VStack w="full" spacing={4} pt={6}>
            {!isSubmitted ? (
              <Button
                size="lg"
                w="full"
                bgGradient="linear(to-r, cyan.400, blue.600)"
                color="white"
                onClick={handleSubmit}
                _hover={{
                  transform: "scale(1.02)",
                  boxShadow: "0 5px 15px rgba(0, 255, 255, 0.3)",
                }}
              >
                Confirm Booking
              </Button>
            ) : (
              <HStack w="full" spacing={4}>
                <Button
                  leftIcon={<FaCheckCircle />}
                  colorScheme="green"
                  flex={1}
                  variant="solid"
                  cursor="default"
                >
                  Booking Confirmed
                </Button>
                <Button
                  leftIcon={
                    isGenerating ? <Spinner size="xs" /> : <FaDownload />
                  }
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