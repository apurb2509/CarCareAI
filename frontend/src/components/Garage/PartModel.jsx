import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Box, Text, VStack, Badge } from '@chakra-ui/react';

const PartModel = ({ part }) => {
  // 1. Load the GLTF/GLB model from the CDN URL
  const { scene } = useGLTF(part.modelUrl);
  
  // 2. State and Refs for hover mechanics
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef();

  // 3. Preload the model into cache & clean up memory on unmount
  useEffect(() => {
    return () => {
      useGLTF.preload(part.modelUrl);
    };
  }, [part.modelUrl]);

  // 4. Change the browser cursor to a pointer when hovering over the 3D mesh
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto'; // cleanup
    };
  }, [hovered]);

  // 5. Smoothly animate the scale of the object on hover (Hardware Accelerated)
  useFrame((state, delta) => {
    if (groupRef.current) {
      // If hovered, scale up to 1.1x. If not, return to 1.0x
      const targetScale = hovered ? 1.1 : 1.0;
      
      // lerp (Linear Interpolation) creates a buttery smooth transition
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale), 
        0.1 // speed of the transition
      );
    }
  });

  return (
    <Float 
      speed={1.5} // Animation speed
      rotationIntensity={0.5} // XYZ rotation intensity
      floatIntensity={0.5} // Up/down float intensity
    >
      <group
        ref={groupRef}
        // --- RAYCASTING EVENTS ---
        onPointerOver={(e) => {
          e.stopPropagation(); // Prevents the event from passing through to objects behind this one
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
      >
        {/* Render the actual 3D geometry */}
        <primitive object={scene} />

        {/* --- DYNAMIC HTML TOOLTIP --- */}
        {hovered && (
          <Html
            distanceFactor={10} // Scales the HTML UI based on how far the camera is zoomed out
            position={[0, 1.5, 0]} // Anchors the tooltip slightly above the center of the object
            center
            zIndexRange={[100, 0]} // Ensures the HTML renders above the WebGL canvas
          >
            <Box
              bg="rgba(15, 23, 42, 0.9)"
              backdropFilter="blur(12px)"
              border="1px solid"
              borderColor="cyan.500"
              borderRadius="xl"
              p={4}
              boxShadow="0 10px 30px rgba(11, 197, 234, 0.3)"
              minW="220px"
              pointerEvents="none" // CRITICAL: Prevents the tooltip itself from triggering pointerOut events
              transform="translate3d(0, 0, 0)" 
            >
              <VStack align="start" spacing={1}>
                <Badge colorScheme="cyan" variant="solid" mb={1}>
                  {part.category}
                </Badge>
                <Text color="white" fontWeight="800" fontSize="lg" lineHeight="tight">
                  {part.name}
                </Text>
                <Text color="gray.300" fontSize="sm">
                  {part.shortDescription}
                </Text>
              </VStack>
            </Box>
          </Html>
        )}
      </group>
    </Float>
  );
};

export default PartModel;