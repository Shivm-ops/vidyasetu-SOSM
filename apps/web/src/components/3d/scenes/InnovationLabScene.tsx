"use client";

import React, { useState } from "react";
import { Html } from "@react-three/drei";

export function InnovationLabScene() {
  const [activeProject, setActiveProject] = useState<string | null>(null);

  const projects = [
    { id: "solar", name: "सौर गाव (Solar Village)", pos: [-1.5, 0.5, -1], type: "panel", color: "#0ea5e9", desc: "संपूर्ण गावाला सौर ऊर्जेवर चालवणारा प्रकल्प." },
    { id: "water", name: "जल शुद्धीकरण (Water System)", pos: [1.5, 0.5, 1], type: "tank", color: "#3b82f6", desc: "पावसाचे पाणी साठवून शुद्ध करणारी स्वयंचलित यंत्रणा." },
    { id: "waste", name: "बायोगॅस (Waste Management)", pos: [0, 0.5, -2], type: "dome", color: "#22c55e", desc: "कचऱ्यापासून इंधन आणि खत तयार करण्याचा प्रकल्प." }
  ];

  return (
    <group position={[0, -0.5, 0]}>
      {/* Village Base Platform */}
      <mesh receiveShadow position={[0, -0.1, 0]}>
        <cylinderGeometry args={[4, 4.2, 0.2, 64]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>

      {/* Projects */}
      {projects.map((project) => (
        <group key={project.id} position={project.pos as [number, number, number]}>
          <mesh 
            castShadow
            onClick={(e) => {
              e.stopPropagation();
              setActiveProject(activeProject === project.id ? null : project.id);
            }}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}
          >
            {project.type === "panel" && <boxGeometry args={[1, 0.05, 1.5]} />}
            {project.type === "tank" && <cylinderGeometry args={[0.5, 0.5, 1.5, 32]} />}
            {project.type === "dome" && <sphereGeometry args={[0.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />}
            
            <meshStandardMaterial 
              color={activeProject === project.id ? "#ffffff" : project.color} 
              emissive={activeProject === project.id ? project.color : "#000000"}
              emissiveIntensity={0.4}
            />
          </mesh>

          {activeProject === project.id && (
            <Html position={[0, 1.5, 0]} center>
              <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl w-56 border-2 border-yellow-300 animate-in fade-in zoom-in-95">
                <h4 className="font-bold text-gray-900 font-marathi mb-1">{project.name}</h4>
                <p className="text-xs text-gray-600 font-marathi leading-relaxed">{project.desc}</p>
                <button className="mt-2 text-[10px] uppercase font-bold text-yellow-700 bg-yellow-100 w-full py-1.5 rounded-lg hover:bg-yellow-200 transition-colors">
                  🛠️ प्रोजेक्ट बिल्डर उघडा
                </button>
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}
