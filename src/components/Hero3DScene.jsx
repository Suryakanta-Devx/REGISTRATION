import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotionPref } from '../hooks/useReducedMotionPref';

function FloatingShapes({ mouse }) {
  const groupRef = useRef(null);
  const torusRef = useRef(null);
  const icoRef = useRef(null);
  const octRef = useRef(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.current.x * 0.35, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouse.current.y * 0.25, 0.05);
    }
    if (torusRef.current) {
      torusRef.current.rotation.x += delta * 0.25;
      torusRef.current.rotation.y += delta * 0.35;
      torusRef.current.position.y = Math.sin(t * 0.9) * 0.28 + 0.4;
    }
    if (icoRef.current) {
      icoRef.current.rotation.y -= delta * 0.32;
      icoRef.current.rotation.z += delta * 0.18;
      icoRef.current.position.y = Math.cos(t * 1.1) * 0.3 - 0.5;
    }
    if (octRef.current) {
      octRef.current.rotation.x -= delta * 0.28;
      octRef.current.rotation.z -= delta * 0.22;
      octRef.current.position.y = Math.sin(t * 1.3 + 1.5) * 0.25 + 1.1;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={torusRef} position={[2.6, 0.4, -1.2]}>
        <torusKnotGeometry args={[0.72, 0.22, 96, 16]} />
        <meshStandardMaterial color="#7c3aed" emissive="#4c1d95" emissiveIntensity={0.7} wireframe />
      </mesh>

      <mesh ref={icoRef} position={[-2.9, -0.5, -1.6]}>
        <icosahedronGeometry args={[0.92, 1]} />
        <meshStandardMaterial color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.6} wireframe />
      </mesh>

      <mesh ref={octRef} position={[-0.6, 1.1, -2.4]}>
        <octahedronGeometry args={[0.68, 0]} />
        <meshStandardMaterial color="#ec4899" emissive="#9d174d" emissiveIntensity={0.65} wireframe />
      </mesh>
    </group>
  );
}

function ParticleField({ count = 140 }) {
  const pointsRef = useRef(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Deterministic pseudo-random spread for pure render
      const a = Math.sin(i * 12.9898) * 43758.5453;
      const b = Math.sin(i * 78.233) * 43758.5453;
      const c = Math.sin(i * 45.164) * 43758.5453;
      arr[i * 3] = ((a - Math.floor(a)) - 0.5) * 14;
      arr[i * 3 + 1] = ((b - Math.floor(b)) - 0.5) * 9;
      arr[i * 3 + 2] = ((c - Math.floor(c)) - 0.5) * 8 - 2;
    }
    return arr;
  }, [count]);

  useFrame((_state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.045} color="#93c5fd" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

const Hero3DScene = ({ mouseRef }) => {
  const reduced = useReducedMotionPref();

  if (reduced) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-0 opacity-85" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5.5], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[5, 5, 5]} intensity={1.4} color="#60a5fa" />
        <pointLight position={[-5, -4, 3]} intensity={1.2} color="#ec4899" />
        <FloatingShapes mouse={mouseRef} />
        <ParticleField count={130} />
      </Canvas>
    </div>
  );
};

export default Hero3DScene;
