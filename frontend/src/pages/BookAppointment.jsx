import React, { useState, useCallback, useMemo, useRef } from "react";
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
} from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import { State, City } from "country-state-city";
import html2pdf from "html2pdf.js";
import QRCode from "qrcode";

const BookAppointment = () => {
  const toast = useToast();
  const pdfRef = useRef();
  
  // State Management
  const [carImage, setCarImage] = useState(null);
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [faultCategory, setFaultCategory] = useState("");
  const [otherElaboration, setOtherElaboration] = useState("");
  
  // Booking Logic State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [bookingNumber, setBookingNumber] = useState("");
  const [bookingDateTime, setBookingDateTime] = useState(null);
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
    purchaseDate: "",
    transmission: "manual",
    fuel: "petrol",
    services: "0",
    distance: "",
    condition: "",
    tuned: "no",
  });

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

  const onDrop = useCallback(
    (acceptedFiles) => {
      setCarImage(acceptedFiles[0]);
      toast({ title: "Image Uploaded", status: "success", duration: 2000 });
    },
    [toast]
  );

  // --- Logic: Generate Booking ID & QR Code ---
  const generateBookingDetails = async () => {
    // 1. Generate booking number (format: BK-YYYYMMDD-XXXX)
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const bookingNum = `BK-${dateStr}-${randomStr}`;
    
    setBookingNumber(bookingNum);
    setBookingDateTime(date);
    
    // 2. Prepare Data for QR Code
    // In a real app, this might be a URL like: https://carcareai.com/verify/${bookingNum}
    const qrData = `BOOKING RECEIPT
ID: ${bookingNum}
Customer: ${formData.ownerName}
Car: ${formData.carModel}
Time: ${date.toLocaleString()}
Issue: ${faultCategory === "other" ? otherElaboration : faultCategory}`;
    
    // 3. Generate QR Data URL
    try {
      const qrUrl = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 1,
        color: {
          dark: "#0BC5EA", // Cyan color for the QR code
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
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 }, // Added scrollY: 0
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
    // Basic validation check
    if (!formData.ownerName || !formData.carModel) {
      toast({
        title: "Please fill required fields",
        status: "warning",
        position: "top",
      });
      return;
    }
    
    // Generate details before showing success
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

  return (
    <Box minH="100vh" bg="#0a0a0a" py={10}>
      
      {/* --- HIDDEN PDF TEMPLATE (Strict A4 Layout) --- */}
      {/* We keep this in the DOM but hidden from view using absolute positioning/z-index or a wrapper. 
          For html2pdf to work best, we usually leave it rendered but off-screen. */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div
          ref={pdfRef}
          style={{
            // SAFETY FIX: 296mm prevents the sub-pixel overflow causing the blank page
            width: "210mm",
            height: "296mm", 
            padding: "12mm",
            backgroundColor: "white",
            color: "#1a1a1a",
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            border: "1px solid #ddd", // Professional border
            position: "relative" // Helps contain absolute elements if needed
          }}
        >
          {/* PDF Header */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "flex-start",
            marginBottom: "15px",
            paddingBottom: "12px",
            borderBottom: "2px solid #0BC5EA"
          }}>
            <div>
              <h1 style={{ 
                color: "#0BC5EA", 
                margin: "0 0 5px 0", 
                fontSize: "26px",
                fontWeight: "700"
              }}>
                CarCare AI
              </h1>
              <p style={{ 
                fontSize: "10px", 
                color: "#666", 
                margin: 0 
              }}>
                Your All-in-One Vehicle Service & Maintenance Hub
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{
                background: "#0BC5EA",
                color: "white",
                padding: "5px 12px",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: "600",
                marginBottom: "5px"
              }}>
                SERVICE BOOKING
              </div>
              <p style={{ fontSize: "9px", color: "#666", margin: 0 }}>
                {bookingDateTime?.toLocaleDateString("en-IN", { 
                  day: "2-digit", 
                  month: "short", 
                  year: "numeric" 
                })}
              </p>
            </div>
          </div>

          {/* Booking Number & QR Section */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "15px",
            padding: "12px",
            background: "#f8f9fa",
            borderRadius: "6px",
            border: "1px solid #e0e0e0"
          }}>
            <div style={{ flex: 1 }}>
              <p style={{ 
                fontSize: "9px", 
                color: "#666", 
                margin: "0 0 4px 0",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                Booking Reference
              </p>
              <p style={{ 
                fontSize: "16px", 
                fontWeight: "700", 
                color: "#0BC5EA",
                margin: 0,
                fontFamily: "monospace"
              }}>
                {bookingNumber}
              </p>
              <p style={{ 
                fontSize: "9px", 
                color: "#666", 
                margin: "8px 0 0 0" 
              }}>
                Booked: {bookingDateTime?.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true
                })}
              </p>
            </div>
            {qrCodeUrl && (
              <div style={{ 
                padding: "8px",
                background: "white",
                borderRadius: "4px",
                border: "1px solid #e0e0e0"
              }}>
                <img 
                  src={qrCodeUrl} 
                  alt="Booking QR" 
                  style={{ 
                    width: "70px", 
                    height: "70px",
                    display: "block"
                  }} 
                />
                <p style={{
                  fontSize: "7px",
                  textAlign: "center",
                  margin: "4px 0 0 0",
                  color: "#999"
                }}>
                  Scan to verify
                </p>
              </div>
            )}
          </div>

          {/* Two Column Layout */}
          <div style={{ 
            display: "flex", 
            gap: "15px",
            marginBottom: "15px",
            flex: 1
          }}>
            {/* Left Column: Details */}
            <div style={{ flex: 1 }}>
              {/* Customer Details */}
              <div style={{ marginBottom: "15px" }}>
                <h3 style={{ 
                  fontSize: "11px", 
                  fontWeight: "700",
                  color: "#333",
                  margin: "0 0 8px 0",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Customer Information
                </h3>
                <div style={{
                  background: "white",
                  border: "1px solid #e0e0e0",
                  borderRadius: "4px",
                  padding: "10px"
                }}>
                  <table style={{ width: "100%", fontSize: "9px", lineHeight: "1.6" }}>
                    <tbody>
                      <tr>
                        <td style={{ color: "#666", paddingBottom: "5px" }}>Name:</td>
                        <td style={{ fontWeight: "600", paddingBottom: "5px" }}>{formData.ownerName}</td>
                      </tr>
                      <tr>
                        <td style={{ color: "#666", verticalAlign: "top", paddingTop: "5px" }}>Address:</td>
                        <td style={{ paddingTop: "5px" }}>
                          {formData.block}, {formData.locality}<br/>
                          {formData.city}, {formData.state}<br/>
                          PIN: {formData.pincode}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Vehicle Details */}
              <div>
                <h3 style={{ 
                  fontSize: "11px", 
                  fontWeight: "700",
                  color: "#333",
                  margin: "0 0 8px 0",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Vehicle Details
                </h3>
                <div style={{
                  background: "white",
                  border: "1px solid #e0e0e0",
                  borderRadius: "4px",
                  padding: "10px"
                }}>
                  <table style={{ width: "100%", fontSize: "9px", lineHeight: "1.8" }}>
                    <tbody>
                      <tr>
                        <td style={{ color: "#666", width: "45%" }}>Model:</td>
                        <td style={{ fontWeight: "600" }}>{formData.carModel}</td>
                      </tr>
                      <tr>
                        <td style={{ color: "#666" }}>Purchase Date:</td>
                        <td>{formData.purchaseDate}</td>
                      </tr>
                      <tr>
                        <td style={{ color: "#666" }}>Transmission:</td>
                        <td style={{ textTransform: "capitalize" }}>{formData.transmission}</td>
                      </tr>
                      <tr>
                        <td style={{ color: "#666" }}>Fuel Type:</td>
                        <td style={{ textTransform: "capitalize" }}>{formData.fuel}</td>
                      </tr>
                      <tr>
                        <td style={{ color: "#666" }}>Condition:</td>
                        <td style={{ textTransform: "capitalize" }}>{formData.condition}</td>
                      </tr>
                      <tr>
                        <td style={{ color: "#666" }}>Distance:</td>
                        <td>{formData.distance} km</td>
                      </tr>
                      <tr>
                        <td style={{ color: "#666" }}>Services Done:</td>
                        <td>{formData.services}</td>
                      </tr>
                      <tr>
                        <td style={{ color: "#666" }}>Tuned:</td>
                        <td style={{ textTransform: "uppercase" }}>{formData.tuned}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column: Request & Instructions */}
            <div style={{ flex: 1 }}>
              {/* Reported Issue */}
              <div style={{ marginBottom: "15px" }}>
                <h3 style={{ 
                  fontSize: "11px", 
                  fontWeight: "700",
                  color: "#333",
                  margin: "0 0 8px 0",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Service Request
                </h3>
                <div style={{
                  background: "#fff9e6",
                  border: "1px solid #ffd700",
                  borderRadius: "4px",
                  padding: "12px",
                  borderLeft: "4px solid #0BC5EA"
                }}>
                  <p style={{ 
                    fontSize: "9px", 
                    color: "#666", 
                    margin: "0 0 5px 0",
                    fontWeight: "600"
                  }}>
                    Primary Concern:
                  </p>
                  <p style={{ 
                    fontSize: "10px", 
                    margin: 0,
                    lineHeight: "1.6",
                    color: "#333"
                  }}>
                    {faultCategory === "other" ? otherElaboration : faultCategory}
                  </p>
                </div>
              </div>

              {/* Service Instructions */}
              <div style={{
                background: "#e6f7fb",
                border: "1px solid #0BC5EA",
                borderRadius: "4px",
                padding: "12px",
                marginBottom: "15px"
              }}>
                <h4 style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  color: "#0BC5EA",
                  margin: "0 0 8px 0"
                }}>
                  IMPORTANT INSTRUCTIONS
                </h4>
                <ul style={{
                  fontSize: "8px",
                  margin: 0,
                  paddingLeft: "15px",
                  lineHeight: "1.8",
                  color: "#333"
                }}>
                  <li>Please arrive 10 minutes before your scheduled time.</li>
                  <li>Bring this receipt and vehicle documents.</li>
                  <li>Service duration may vary based on diagnosis.</li>
                  <li>Contact us for any changes or cancellations.</li>
                </ul>
              </div>

              {/* Contact Info */}
              <div style={{
                background: "white",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                padding: "10px"
              }}>
                <h4 style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  color: "#333",
                  margin: "0 0 6px 0"
                }}>
                  Contact Information
                </h4>
                <p style={{ fontSize: "8px", margin: "0 0 3px 0", color: "#666" }}>
                  📞 +91 987-654-3210
                </p>
                <p style={{ fontSize: "8px", margin: "0 0 3px 0", color: "#666" }}>
                  ✉️ support@carcareai.com
                </p>
                <p style={{ fontSize: "8px", margin: 0, color: "#666" }}>
                  🌐 www.carcareai.com
                </p>
              </div>
            </div>
          </div>

          {/* PDF Footer */}
          <div style={{ 
            marginTop: "auto",
            paddingTop: "10px",
            borderTop: "1px solid #eaeaea",
            fontSize: "8px",
            color: "#666"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <p style={{ 
                fontSize: "8px", 
                color: "#999", 
                margin: 0 
              }}>
                © 2026 CarCareAI. All rights reserved.
              </p>
              <p style={{ 
                fontSize: "8px", 
                color: "#0BC5EA", 
                margin: 0,
                fontWeight: "600"
              }}>
                DIGITALLY VERIFIED BOOKING
              </p>
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
              <option value="ac">Air Conditioning / Climate Control</option>
              <option value="alignment">Alignment & Balancing</option>
              <option value="battery">Battery & Charging System</option>
              <option value="brakes">Braking System</option>
              <option value="clutch">Clutch & Transmission</option>
              <option value="cooling">Cooling System / Radiator</option>
              <option value="diagnostics">Diagnostics / Warning Lights</option>
              <option value="electrical">Electrical & Wiring</option>
              <option value="engine">Engine Issues</option>
              <option value="exhaust">Exhaust System</option>
              <option value="fuel">Fuel System</option>
              <option value="general">General Inspection</option>
              <option value="insurance">Insurance / Claim Assistance</option>
              <option value="oil">Oil Change & Lubrication</option>
              <option value="periodic">Periodic Service</option>
              <option value="pickup">Pickup & Drop Request</option>
              <option value="suspension">Suspension & Steering</option>
              <option value="tires">Tires / Wheels</option>
              <option value="transmission">Transmission Issues</option>
              <option value="wash">Vehicle Cleaning / Detailing</option>
              <option value="wipers">Wipers & Windshield</option>
              <option value="bodywork">Bodywork / Dent & Paint</option>
              <option value="interior">Interior / Upholstery</option>
              <option value="software">Software / ECU Update</option>
              <option value="other">Other Issues</option>
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