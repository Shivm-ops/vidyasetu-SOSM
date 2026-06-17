"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Mesh, Group } from "three";

// --- SUGARCANE SCENE with growth stages ---
export function SugarcaneScene({ stage }: { stage: number }) {
  // stage: 0=seedling, 1=growing, 2=mature, 3=harvest
  const heights = [0.3, 0.8, 1.8, 2.2];
  const height = heights[stage] ?? 1.8;
  const colors = ["#86efac", "#4ade80", "#16a34a", "#ca8a04"];
  const color = colors[stage];

  return (
    <group>
      {/* Soil */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[2, 2, 0.5, 32]} />
        <meshStandardMaterial color="#78350f" roughness={1} />
      </mesh>
      {/* Main stalk */}
      <mesh position={[0, (height / 2) - 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, height, 8]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Leaves */}
      {stage > 0 && Array.from({ length: Math.max(2, stage * 2) }).map((_, i) => (
        <mesh key={i} position={[0, (i * 0.4) - 0.8, 0]} rotation={[0.3, (i * Math.PI) / 2, 0.4]} castShadow>
          <boxGeometry args={[0.6, 0.05, 0.15]} />
          <meshStandardMaterial color="#16a34a" />
        </mesh>
      ))}
      {/* Top flower/harvest indication */}
      {stage === 3 && (
        <mesh position={[0, height - 1.1, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.3} />
        </mesh>
      )}
    </group>
  );
}

// --- RICE FIELD SCENE ---
export function RiceScene({ stage }: { stage: number }) {
  const heights = [0.1, 0.3, 0.7, 1.0];
  const h = heights[stage];

  return (
    <group>
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial color={stage < 3 ? "#93c5fd" : "#78350f"} />
      </mesh>
      {/* Grid of rice plants */}
      {Array.from({ length: 5 }).flatMap((_, row) =>
        Array.from({ length: 5 }).map((_, col) => (
          <group key={`${row}-${col}`} position={[(col - 2) * 0.8, (h / 2) - 1.4, (row - 2) * 0.8]}>
            <mesh>
              <cylinderGeometry args={[0.03, 0.03, h, 6]} />
              <meshStandardMaterial color="#22c55e" />
            </mesh>
            {stage >= 2 && (
              <mesh position={[0, h / 2, 0]}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshStandardMaterial color="#f59e0b" />
              </mesh>
            )}
          </group>
        ))
      )}
    </group>
  );
}

// --- IRRIGATION SCENE ---
export function IrrigationScene() {
  const [active, setActive] = useState<string | null>(null);
  const waterRef = useRef<Mesh>(null);
  useFrame(state => {
    if (waterRef.current) waterRef.current.rotation.z += 0.01;
  });

  const systems = [
    { id: "drip", name: "ठिबक सिंचन (Drip)", pos: [-1.5, 0, 0] as [number,number,number], color: "#60a5fa", desc: "थेट मुळापाशी पाणी. 90% पाणी बचत. आधुनिक पद्धत." },
    { id: "sprinkler", name: "तुषार सिंचन (Sprinkler)", pos: [1.5, 0, 0] as [number,number,number], color: "#22d3ee", desc: "फवार्याद्वारे सिंचन. 50% पाणी बचत. मोठ्या शेतासाठी." },
    { id: "canal", name: "कालवा सिंचन (Canal)", pos: [0, 0, -1.5] as [number,number,number], color: "#3b82f6", desc: "कालव्याद्वारे पाणी. पारंपारिक पद्धत. सर्वात जुनी." },
  ];

  return (
    <group>
      {/* Ground */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#a16207" />
      </mesh>

      {systems.map(s => (
        <group key={s.id} position={s.pos}>
          {/* Irrigation equipment */}
          <mesh castShadow onClick={(e) => { e.stopPropagation(); setActive(active === s.id ? null : s.id); }}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}>
            <cylinderGeometry args={[0.15, 0.15, 1, 8]} />
            <meshStandardMaterial color={active === s.id ? "#fff" : s.color} emissive={s.color} emissiveIntensity={0.4} />
          </mesh>
          {/* Water spray */}
          <mesh ref={s.id === "sprinkler" ? waterRef : undefined} position={[0, 0.7, 0]}>
            <torusGeometry args={[0.3, 0.02, 8, 32]} />
            <meshStandardMaterial color="#93c5fd" transparent opacity={0.5} />
          </mesh>
          {active === s.id && (
            <Html position={[0, 1.2, 0]} center>
              <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl w-52 border-2 border-blue-300 animate-in fade-in">
                <h4 className="font-bold text-gray-900 font-marathi mb-1">{s.name}</h4>
                <p className="text-xs text-gray-600 font-marathi leading-relaxed">{s.desc}</p>
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}
