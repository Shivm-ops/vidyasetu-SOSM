"use client";

import React, { useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";

export function AgricultureScene() {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const items = [
    { id: "sugarcane", name: "ऊस (Sugarcane)", pos: [-1, 1, 0], type: "tall_crop", color: "#84cc16", desc: "महाराष्ट्रातील प्रमुख पीक. याला भरपूर पाणी लागते." },
    { id: "cotton", name: "कापूस (Cotton)", pos: [1, 0.5, 0], type: "bush_crop", color: "#fef08a", desc: "काळ्या मातीत उत्तम वाढणारे पीक." },
    { id: "tractor", name: "ट्रॅक्टर (Tractor)", pos: [0, 0.25, 1.5], type: "equipment", color: "#ef4444", desc: "शेतीची कामे जलद करण्यासाठी आधुनिक यंत्र." },
    { id: "irrigation", name: "ठिबक सिंचन (Drip Irrigation)", pos: [0, -0.4, 0], type: "irrigation", color: "#3b82f6", desc: "पाण्याची बचत करणारी सिंचन पद्धत." },
  ];

  return (
    <group position={[0, -0.5, 0]}>
      {/* Soil Base */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[4, 0.5, 4]} />
        <meshStandardMaterial color="#78350f" roughness={1} />
      </mesh>

      {/* Grid Lines on Soil (Farm beds) */}
      <mesh position={[0, -0.24, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial color="#451a03" transparent opacity={0.5} />
      </mesh>

      {/* Farm Items */}
      {items.map((item) => (
        <group key={item.id} position={item.pos as [number, number, number]}>
          <mesh 
            castShadow
            onClick={(e) => {
              e.stopPropagation();
              setActiveItem(activeItem === item.id ? null : item.id);
            }}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}
          >
            {item.type === "tall_crop" && <cylinderGeometry args={[0.05, 0.05, 2]} />}
            {item.type === "bush_crop" && <sphereGeometry args={[0.3, 16, 16]} />}
            {item.type === "equipment" && <boxGeometry args={[0.8, 0.5, 0.5]} />}
            {item.type === "irrigation" && <tubeGeometry args={undefined} />} {/* Tube logic would be complex, using simple box for now */}
            {item.type === "irrigation" && <boxGeometry args={[3.8, 0.1, 0.1]} />}

            <meshStandardMaterial 
              color={activeItem === item.id ? "#ffffff" : item.color} 
              emissive={activeItem === item.id ? item.color : "#000000"}
              emissiveIntensity={0.6}
            />
          </mesh>

          {/* Item Tooltip */}
          {activeItem === item.id && (
            <Html position={[0, 1, 0]} center>
              <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl w-48 border-2 border-village-300 animate-in fade-in zoom-in-95">
                <h4 className="font-bold text-gray-900 font-marathi mb-1">{item.name}</h4>
                <p className="text-xs text-gray-600 font-marathi leading-relaxed">{item.desc}</p>
                <button className="mt-2 text-[10px] uppercase font-bold text-village-600 bg-village-50 w-full py-1.5 rounded-lg hover:bg-village-100 transition-colors">
                  🔊 माहिती ऐका
                </button>
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}
