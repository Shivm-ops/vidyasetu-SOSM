"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Mesh } from "three";

export function ScienceLabScene() {
  const [activeConcept, setActiveConcept] = useState<string | null>(null);

  // Solar System Logic
  const sunRef = useRef<Mesh>(null);
  const earthRef = useRef<Mesh>(null);
  const moonRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (sunRef.current) sunRef.current.rotation.y += delta * 0.1;
    if (earthRef.current) {
      // Earth orbits the Sun
      const t = state.clock.getElapsedTime() * 0.5;
      earthRef.current.position.x = Math.cos(t) * 3;
      earthRef.current.position.z = Math.sin(t) * 3;
      earthRef.current.rotation.y += delta * 0.5;
    }
    if (moonRef.current && earthRef.current) {
      // Moon orbits Earth
      const t = state.clock.getElapsedTime() * 2;
      moonRef.current.position.x = earthRef.current.position.x + Math.cos(t) * 0.8;
      moonRef.current.position.z = earthRef.current.position.z + Math.sin(t) * 0.8;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Sun */}
      <mesh 
        ref={sunRef} 
        onClick={(e) => { e.stopPropagation(); setActiveConcept("sun"); }}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#facc15" emissive="#ca8a04" emissiveIntensity={0.5} />
      </mesh>

      {/* Earth */}
      <mesh 
        ref={earthRef}
        onClick={(e) => { e.stopPropagation(); setActiveConcept("earth"); }}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>

      {/* Moon */}
      <mesh ref={moonRef}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#d1d5db" />
      </mesh>

      {/* Orbit Paths (Visual only) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.98, 3.02, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} side={2} />
      </mesh>

      {/* UI Overlays */}
      {activeConcept === "sun" && (
        <Html position={[0, 1.5, 0]} center>
           <InfoCard title="सूर्य (Sun)" desc="सूर्य हा आपल्या सूर्यमालेचा केंद्रबिंदू आहे. तो एक तारा आहे जो प्रकाश आणि उष्णता देतो." />
        </Html>
      )}
      {activeConcept === "earth" && (
        <Html position={[earthRef.current?.position.x || 3, 1, earthRef.current?.position.z || 0]} center>
           <InfoCard title="पृथ्वी (Earth)" desc="आपला ग्रह, जिथे जीवसृष्टी अस्तित्वात आहे. पृथ्वी सूर्याभोवती ३६५ दिवसांत एक प्रदक्षिणा पूर्ण करते." />
        </Html>
      )}
    </group>
  );
}

function InfoCard({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl w-56 border-2 border-brand-200 animate-in fade-in zoom-in-95">
      <h4 className="font-bold text-gray-900 font-marathi mb-1">{title}</h4>
      <p className="text-xs text-gray-600 font-marathi leading-relaxed">{desc}</p>
      <button className="mt-2 text-[10px] uppercase font-bold text-brand-600 bg-brand-50 w-full py-1.5 rounded-lg hover:bg-brand-100 transition-colors">
        🔊 अधिक माहिती
      </button>
    </div>
  );
}
