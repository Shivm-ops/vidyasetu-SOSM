"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Mesh } from "three";

export function CareerSimulatorScene() {
  const [activeCareer, setActiveCareer] = useState<string | null>(null);

  const careers = [
    { id: "doctor", name: "डॉक्टर (Doctor)", pos: [-2, 0, 0], type: "box", color: "#38bdf8", desc: "रुग्णांची सेवा आणि उपचार करणारे वैद्यकीय व्यावसायिक." },
    { id: "engineer", name: "अभियंता (Engineer)", pos: [0, 0, -2], type: "cylinder", color: "#f97316", desc: "नवीन तंत्रज्ञान, पूल आणि यंत्रे तयार करणारे व्यावसायिक." },
    { id: "farmer", name: "आधुनिक शेतकरी", pos: [2, 0, 0], type: "sphere", color: "#22c55e", desc: "तंत्रज्ञानाचा वापर करून शेती उत्पादनात क्रांती घडवणारे." },
    { id: "drone", name: "ड्रोन ऑपरेटर", pos: [0, 2, 0], type: "box", color: "#a855f7", desc: "शेती, सर्वेक्षण आणि संरक्षणासाठी ड्रोन उडवणारे तज्ज्ञ." }
  ];

  return (
    <group position={[0, -0.5, 0]}>
      {/* Central Hub */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1.2, 0.2, 32]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* Career Nodes */}
      {careers.map((career) => (
        <group key={career.id} position={career.pos as [number, number, number]}>
          <mesh 
            castShadow
            onClick={(e) => {
              e.stopPropagation();
              setActiveCareer(activeCareer === career.id ? null : career.id);
            }}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}
          >
            {career.type === "box" && <boxGeometry args={[0.8, 0.8, 0.8]} />}
            {career.type === "cylinder" && <cylinderGeometry args={[0.5, 0.5, 1, 32]} />}
            {career.type === "sphere" && <sphereGeometry args={[0.5, 32, 32]} />}
            
            <meshStandardMaterial 
              color={activeCareer === career.id ? "#ffffff" : career.color} 
              emissive={activeCareer === career.id ? career.color : "#000000"}
              emissiveIntensity={0.6}
            />
          </mesh>

          {/* Connectors to center */}
          <mesh position={[-career.pos[0]/2, -career.pos[1]/2, -career.pos[2]/2]}>
             {/* Abstract connector logic */}
          </mesh>

          {activeCareer === career.id && (
            <Html position={[0, 1.2, 0]} center>
              <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl w-56 border-2 border-orange-200 animate-in fade-in zoom-in-95">
                <h4 className="font-bold text-gray-900 font-marathi mb-1">{career.name}</h4>
                <p className="text-xs text-gray-600 font-marathi leading-relaxed">{career.desc}</p>
                <button className="mt-2 text-[10px] uppercase font-bold text-white bg-orange-500 w-full py-2 rounded-lg hover:bg-orange-600 transition-colors">
                  🚀 सिम्युलेटर सुरू करा
                </button>
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}
