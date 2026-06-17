"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Sphere } from "@react-three/drei";
import { Mesh } from "three";

export function GeographyScene() {
  const earthRef = useRef<Mesh>(null);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  useFrame((state, delta) => {
    // Slow rotation of the Earth if no region is active
    if (earthRef.current && !activeRegion) {
      earthRef.current.rotation.y += delta * 0.05;
    }
  });

  const regions = [
    { id: "maharashtra", name: "महाराष्ट्र", pos: [1.8, 0.8, 1.2], desc: "भारतातील एक प्रमुख राज्य. राजधानी: मुंबई." },
    { id: "himalayas", name: "हिमालय", pos: [1.2, 1.5, 1.5], desc: "जगातील सर्वात उंच पर्वत रांग." },
    { id: "sahara", name: "सहारा वाळवंट", pos: [2.0, 0.5, -0.5], desc: "आफ्रिकेतील सर्वात मोठे उष्ण वाळवंट." }
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* Earth Sphere Prototype */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial 
          color="#0ea5e9" 
          roughness={0.6}
          metalness={0.1}
          wireframe={true} // Acts as a geographical grid for now
        />
        
        {/* Core inside wireframe for solid look */}
        <Sphere args={[2.45, 32, 32]}>
          <meshStandardMaterial color="#0284c7" />
        </Sphere>

        {/* Region Markers */}
        {regions.map((region) => (
          <group key={region.id} position={region.pos as [number, number, number]}>
            <mesh 
              onClick={(e) => {
                e.stopPropagation();
                setActiveRegion(activeRegion === region.id ? null : region.id);
              }}
              onPointerOver={() => document.body.style.cursor = 'pointer'}
              onPointerOut={() => document.body.style.cursor = 'auto'}
            >
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial 
                color={activeRegion === region.id ? "#fef08a" : "#ef4444"} 
                emissive={activeRegion === region.id ? "#fef08a" : "#ef4444"}
                emissiveIntensity={0.8}
              />
            </mesh>

            {/* Region Tooltip */}
            {activeRegion === region.id && (
              <Html position={[0, 0.3, 0]} center>
                <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl w-48 border border-gray-200 animate-in fade-in zoom-in-95">
                  <h4 className="font-bold text-gray-900 font-marathi mb-1">{region.name}</h4>
                  <p className="text-xs text-gray-600 font-marathi leading-relaxed">{region.desc}</p>
                </div>
              </Html>
            )}
          </group>
        ))}
      </mesh>
    </group>
  );
}
