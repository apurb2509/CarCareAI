import React, { Suspense, Component } from 'react';
import { Box, Spinner, Text, VStack } from '@chakra-ui/react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  Stage, 
  Html, 
  useProgress, 
  ContactShadows 
} from '@react-three/drei';

// Import our advanced external component with hover mechanics
import PartModel from './PartModel'; 

// ==========================================
// 1. CUSTOM ERROR BOUNDARY (CATCHES FAILED 3D DOWNLOADS)
// ==========================================
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// ==========================================
// 2. THE LOADING FALLBACK
// ==========================================
const CanvasLoader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <VStack spacing={3} bg="rgba(15, 23, 42, 0.8)" p={6} borderRadius="xl" backdropFilter="blur(10px)">
        <Spinner size="xl" color="cyan.400" thickness="3px" />
        <Text color="cyan.100" fontWeight="bold" fontSize="sm">
          LOADING ASSET
        </Text>
        <Text color="whiteAlpha.700" fontSize="xs">
          {progress.toFixed(0)}%
        </Text>
      </VStack>
    </Html>
  );
};

// ==========================================
// 3. THE MAIN CANVAS WRAPPER
// ==========================================
const ThreeCanvas = ({ part }) => {
  if (!part || !part.modelUrl) return null;

  // --- OPEN SOURCE FALLBACK LOGIC ---
  // If the database URL is our fake placeholder, replace it with a real, open-source 3D Car/Buggy model
  const activeModelUrl = part.modelUrl.includes('example.com') 
    ? 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Buggy/glTF-Binary/Buggy.glb'
    : part.modelUrl;

  const safePart = { ...part, modelUrl: activeModelUrl };

  return (
    <Box w="100%" h="100%" cursor="grab" _active={{ cursor: "grabbing" }}>
      <Canvas 
        shadows 
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        <Suspense fallback={<CanvasLoader />}>
          
          <Stage 
            environment="city" 
            intensity={0.6}
            contactShadow={{ resolution: 1024, scale: 10, blur: 2, opacity: 0.5 }}
            adjustCamera={1.2} 
          >
            {/* Our Custom Error Boundary intercepts any broken GLB files so the page doesn't crash */}
            <ErrorBoundary 
              fallback={
                <Html center>
                  <Box bg="rgba(255, 0, 0, 0.8)" p={4} borderRadius="md" backdropFilter="blur(5px)">
                    <Text color="white" fontWeight="bold">Failed to load 3D Model</Text>
                  </Box>
                </Html>
              }
            >
              <PartModel part={safePart} />
            </ErrorBoundary>
          </Stage>

          <ContactShadows 
            position={[0, -1.5, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2} 
            far={4} 
          />

        </Suspense>

        <OrbitControls 
          makeDefault 
          autoRotate 
          autoRotateSpeed={1} 
          enablePan={false}
          minDistance={2}
          maxDistance={10}
          maxPolarAngle={Math.PI / 2 + 0.1}
        />
      </Canvas>
    </Box>
  );
};

export default ThreeCanvas;