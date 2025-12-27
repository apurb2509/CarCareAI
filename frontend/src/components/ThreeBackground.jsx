import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

// FIX: Generate the stars OUTSIDE the component.
// This ensures the calculation happens once and keeps the component "pure".
const generateStars = () => {
  const count = 5000;
  const positions = new Float32Array(count * 3); // x, y, z for each star
  
  for (let i = 0; i < count; i++) {
    // Generate x, y, z coordinates between -1.5 and 1.5
    positions[i * 3] = (Math.random() - 0.5) * 3;     // X axis
    positions[i * 3 + 1] = (Math.random() - 0.5) * 3; // Y axis
    positions[i * 3 + 2] = (Math.random() - 0.5) * 3; // Z axis
  }
  return positions;
};

// Calculate once globally
const starPositions = generateStars();

const Stars = (props) => {
  const ref = useRef();

  useFrame((state, delta) => {
    // Check if ref exists to prevent runtime errors during unmount
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      {/* Pass the global starPositions here */}
      <Points ref={ref} positions={starPositions} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#f272c8"
          size={0.003}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const ThreeBackground = () => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Stars />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;