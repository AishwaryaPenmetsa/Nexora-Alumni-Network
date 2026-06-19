import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// An animated component inside the 3D Canvas
const SphereNetwork = () => {
  const pointsRef = useRef();
  const lineRef = useRef();

  // Generate random points on a sphere
  const count = 120;
  const radius = 2.5;
  
  const [positions] = useState(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = radius * Math.cos(phi);
    }
    return arr;
  });

  // Animate rotation
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = elapsed * 0.05;
      pointsRef.current.rotation.x = elapsed * 0.02;
    }
  });

  // Build connecting lines between close points
  const indices = [];
  const posArr = Array.from(positions);
  for (let i = 0; i < count; i++) {
    const p1 = new THREE.Vector3(posArr[i*3], posArr[i*3+1], posArr[i*3+2]);
    for (let j = i + 1; j < count; j++) {
      const p2 = new THREE.Vector3(posArr[j*3], posArr[j*3+1], posArr[j*3+2]);
      if (p1.distanceTo(p2) < 1.1) {
        indices.push(i, j);
      }
    }
  }

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  lineGeometry.setIndex(indices);

  return (
    <group ref={pointsRef}>
      {/* Glow sphere background */}
      <mesh>
        <sphereGeometry args={[2.45, 32, 32]} />
        <meshBasicMaterial 
          color="#6366F1" 
          wireframe
          transparent 
          opacity={0.06} 
        />
      </mesh>

      {/* Node Points */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#06B6D4"
          size={0.07}
          sizeAttenuation
          transparent
          opacity={0.8}
        />
      </points>

      {/* Network Connections */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial 
          color="#8B5CF6" 
          transparent 
          opacity={0.15} 
          linewidth={1}
        />
      </lineSegments>

      {/* Small floating orbits simulating graduation caps/nodes */}
      <mesh position={[1.5, 1.5, 0.5]}>
        <dodecahedronGeometry args={[0.08]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>
      <mesh position={[-1.8, -1.0, 1.2]}>
        <octahedronGeometry args={[0.06]} />
        <meshBasicMaterial color="#10B981" />
      </mesh>
      <mesh position={[0.2, -2.0, -1.0]}>
        <tetrahedronGeometry args={[0.08]} />
        <meshBasicMaterial color="#6366F1" />
      </mesh>
    </group>
  );
};

const NetworkGlobe = () => {
  const [hasWebGL, setHasWebGL] = useState(true);

  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const supports = !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      setHasWebGL(supports);
    } catch (e) {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    // Elegant fallback gradient sphere
    return (
      <div className="relative w-full h-[400px] flex items-center justify-center">
        <div className="absolute w-64 h-64 rounded-full bg-gradient-to-tr from-primary via-secondary to-accent opacity-20 filter blur-2xl animate-pulse-slow"></div>
        <div className="w-56 h-56 rounded-full border border-dashed border-primary/20 animate-spin flex items-center justify-center duration-10000">
          <div className="w-40 h-40 rounded-full border border-double border-secondary/30 animate-ping flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-accent text-xs">
              GLOBAL NET
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[380px] md:h-[450px] relative z-10 cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <SphereNetwork />
        <OrbitControls 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={0.8}
          enablePan={false}
        />
      </Canvas>
      {/* Decorative glow overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none z-0"></div>
    </div>
  );
};

export default NetworkGlobe;
