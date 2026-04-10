import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

// 1. Mouse Interaction Tracker
// Safely tracks pointer mapping strictly isolated from DOM events
const usePointerWorld = () => {
  const { camera } = useThree();
  const mouse = useRef(new THREE.Vector2(-999, -999)); 
  const worldPos = useRef(new THREE.Vector3(-999, -999, -999));

  useEffect(() => {
    const onMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    
    const onTouchMove = (e) => {
      mouse.current.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  useFrame(() => {
    const targetZ = 0; // Intersection plane for collision detection
    const vec = new THREE.Vector3(mouse.current.x, mouse.current.y, 0.5);
    vec.unproject(camera);
    
    // Project ray and find plane intersection point
    const dir = vec.sub(camera.position).normalize();
    if (dir.z !== 0) {
      const distance = (targetZ - camera.position.z) / dir.z;
      worldPos.current.copy(camera.position).add(dir.multiplyScalar(distance));
    }
  });

  return worldPos;
};

// 2. Ultra-Professional SaaS Ambient Spotlight
// Emulates high-end radial ambient glow without external textures
const spotlightMaterial = new THREE.ShaderMaterial({
  uniforms: {
    color: { value: new THREE.Color("#0EA5E9") }, // Sky Blue aura
    maxOpacity: { value: 0.15 } // Extremely subtle, completely non-distracting
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    uniform float maxOpacity;
    varying vec2 vUv;
    void main() {
      float dist = distance(vUv, vec2(0.5));
      float strength = smoothstep(0.5, 0.0, dist); // Beautiful gradient drop-off
      gl_FragColor = vec4(color, strength * maxOpacity);
    }
  `,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});

const MouseSpotlight = ({ worldPointer }) => {
  const meshRef = useRef();
  
  useFrame(() => {
    if (worldPointer.current.x !== -999) {
      // Elegant, buttery smooth trailing delay 
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, worldPointer.current.x, 0.08);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, worldPointer.current.y, 0.08);
    }
  });

  return (
    // Resides deeply behind the interactive network grid
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <planeGeometry args={[14, 14]} />
      <primitive object={spotlightMaterial} attach="material" />
    </mesh>
  );
};

// 3. High-Performance Elegant SaaS Grid
// Replaces frantic physics with deeply professional, soothing color gradients
const ProfessionalSaaSGrid = ({ worldPointer, scrollMomentum, colorMode }) => {
  const gridX = 120;
  const gridY = 60;
  const count = gridX * gridY; // 7,200 performant particles
  const meshRef = useRef();

  const baseColor = useMemo(() => new THREE.Color(colorMode === 'light' ? '#E2E8F0' : '#101D33'), [colorMode]);  
  const hoverColor = useMemo(() => new THREE.Color(colorMode === 'light' ? '#3182CE' : '#0EA5E9'), [colorMode]); 
  const scratchColor = useMemo(() => new THREE.Color(), []);

  const particles = useMemo(() => {
    const temp = [];
    const spacingX = 0.55;
    const spacingY = 0.55;
    const offsetX = (gridX * spacingX) / 2;
    const offsetY = (gridY * spacingY) / 2;
    
    for (let i = 0; i < gridX; i++) {
        for (let j = 0; j < gridY; j++) {
            temp.push({
                x: i * spacingX - offsetX,
                y: j * spacingY - offsetY,
                z: 0,
                // Organic breathing offset
                offset: (i * 0.15) + (j * 0.15)
            });
        }
    }
    return temp;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const scrollOffset = useRef(0);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const mx = worldPointer.current.x;
    const my = worldPointer.current.y;
    const isMouse = mx !== -999;
    
    // Minute influence from page scrolling to softly sway the grid
    scrollOffset.current += scrollMomentum.current * 0.0003; 
    const effectiveTime = time * 0.4 + scrollOffset.current;

    for (let i = 0; i < count; i++) {
       const p = particles[i];
       
       // Base ocean wave
       let targetZ = Math.sin(p.x * 0.2 + effectiveTime + p.offset) * 0.25;

       let colorMix = 0;
       if (isMouse) {
           const distSq = Math.pow(p.x - mx, 2) + Math.pow(p.y - my, 2);
           const radius = 6.0;
           const radiusSq = radius * radius;
           
           if (distSq < radiusSq) { // Wider activation radius for a more dramatic, wide fold
               const dist = Math.sqrt(distSq);
               // Quadratic falloff mapping to both depth and color illumination
               colorMix = Math.pow(1 - dist / radius, 2); 
               
               // The Gravity Fold: Deeply indent the fabric of the mesh
               targetZ -= colorMix * 5.0; 
           }
       }
       
       // Slower, smoother elastic lerp allows the fabric to feel heavier and 'more foldable'
       p.z = THREE.MathUtils.lerp(p.z, targetZ, 0.08);

       dummy.position.set(p.x, p.y, p.z);
       dummy.updateMatrix();
       meshRef.current.setMatrixAt(i, dummy.matrix);
       
       // Structure maintains position securely while lighting up
       scratchColor.copy(baseColor).lerp(hoverColor, colorMix);
       meshRef.current.setColorAt(i, scratchColor);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
        meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} rotation={[-0.15, 0, 0]}>
      <circleGeometry args={[0.015, 8]} />
      <meshBasicMaterial 
        color={colorMode === 'light' ? "#A0AEC0" : "#ffffff"} 
        transparent 
        opacity={0.85} 
        depthWrite={false} 
        blending={colorMode === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
};

// Global Environment Container (Manages momentum)
const EnvironmentContainer = ({ colorMode }) => {
  const scrollMomentum = useRef(0);
  const worldPointer = usePointerWorld();

  useEffect(() => {
    const onWheel = (e) => { scrollMomentum.current += e.deltaY; };
    
    let lastTouchY = 0;
    const onTouchStart = (e) => { lastTouchY = e.touches[0].clientY; };
    const onTouchMove = (e) => {
        const deltaY = lastTouchY - e.touches[0].clientY;
        scrollMomentum.current += deltaY * 2.0;
        lastTouchY = e.touches[0].clientY;
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  useFrame(() => {
    scrollMomentum.current *= 0.94; 
  });

  return (
    <>
      <ProfessionalSaaSGrid scrollMomentum={scrollMomentum} worldPointer={worldPointer} colorMode={colorMode} />
      <MouseSpotlight worldPointer={worldPointer} />
      
      {/* Ghosting typography, fully embedded and completely non-distracting */}
      <Float speed={1.0} rotationIntensity={0.02} floatIntensity={0.05} position={[0, -1, -5]}>
        <Text
          fontSize={1.8}
          color={colorMode === 'light' ? "#CBD5E1" : "#1E293B"} // Deep Slate or Light Slate
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.12}
          letterSpacing={0.25}
        >
          CARCARE AI
        </Text>
      </Float>
    </>
  );
};

// Application Mount
const ThreeBackground = ({ colorMode }) => {
  const bgColor = colorMode === 'light' ? '#FFFFFF' : '#030712';
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 0, pointerEvents: 'none' }}>
      {/* Deep, luxurious SaaS visual configuration */}
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 60, near: 0.1, far: 50 }}
        dpr={[1, 2]} 
        gl={{ alpha: false, antialias: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={[bgColor]} />
        <fog attach="fog" args={[bgColor, 6, 25]} />

        <EnvironmentContainer colorMode={colorMode} />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;