"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Sphere } from "@react-three/drei";
import { Mesh, Group } from "three";

// --- ENHANCED EARTH SCENE ---
export function EarthScene() {
  const earthRef = useRef<Mesh>(null);
  const atmosphereRef = useRef<Mesh>(null);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  useFrame((_, delta) => {
    if (!activeRegion && earthRef.current) earthRef.current.rotation.y += delta * 0.08;
    if (atmosphereRef.current) atmosphereRef.current.rotation.y -= delta * 0.03;
  });

  const regions = [
    { id: "maharashtra", name: "महाराष्ट्र", pos: [1.7, 0.9, 1.4] as [number,number,number], color: "#fb923c", desc: "क्षेत्र: 3,07,713 km². राजधानी: मुंबई. 36 जिल्हे." },
    { id: "himalayas", name: "हिमालय पर्वत", pos: [1.3, 1.6, 1.3] as [number,number,number], color: "#e0f2fe", desc: "जगातील सर्वात उंच पर्वतरांग. माउंट एव्हरेस्ट 8,848 मी." },
    { id: "amazon", name: "अॅमेझॉन जंगल", pos: [-1.8, 0.3, 1.2] as [number,number,number], color: "#22c55e", desc: "जगातील सर्वात मोठे उष्णकटिबंधीय जंगल." },
    { id: "pacific", name: "प्रशांत महासागर", pos: [-0.5, 0.2, -2.4] as [number,number,number], color: "#3b82f6", desc: "जगातील सर्वात मोठा महासागर. क्षेत्र: 165 दशलक्ष km²." },
  ];

  return (
    <group>
      {/* Earth */}
      <mesh ref={earthRef} castShadow>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial color="#2563eb" roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Land masses (green blotches) */}
      {[[-0.5,1.5,1.5], [1.2,0.8,1.5], [-1.5,-0.5,1.5], [0.5,-1,1.8]].map((pos, i) => (
        <mesh key={i} position={pos as [number,number,number]}>
          <sphereGeometry args={[[0.6,0.5,0.7,0.4][i], 16, 16]} />
          <meshStandardMaterial color="#16a34a" roughness={1} />
        </mesh>
      ))}
      {/* Atmosphere glow */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[2.12, 32, 32]} />
        <meshStandardMaterial color="#93c5fd" transparent opacity={0.08} side={2} />
      </mesh>
      {/* Wireframe grid */}
      <mesh>
        <sphereGeometry args={[2.02, 18, 18]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.05} wireframe />
      </mesh>
      {/* Region markers */}
      {regions.map(r => (
        <group key={r.id} position={r.pos}>
          <mesh onClick={(e) => { e.stopPropagation(); setActiveRegion(activeRegion === r.id ? null : r.id); }}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color={activeRegion === r.id ? "#fff" : r.color} emissive={r.color} emissiveIntensity={0.8} />
          </mesh>
          {activeRegion === r.id && (
            <Html position={[0.2, 0.2, 0]} center>
              <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl w-52 border-2 border-blue-300 animate-in fade-in">
                <h4 className="font-bold text-gray-900 font-marathi mb-1 text-sm">{r.name}</h4>
                <p className="text-xs text-gray-600 font-marathi leading-relaxed">{r.desc}</p>
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}

// --- MAHARASHTRA MAP SCENE ---
export function MaharashtraScene() {
  const [activeDistrict, setActiveDistrict] = useState<string | null>(null);
  const districts = [
    { id: "mumbai", name: "मुंबई", pos: [-0.5, -0.5, 0.5] as [number,number,number], color: "#ef4444", desc: "महाराष्ट्राची राजधानी व आर्थिक केंद्र. लोकसंख्या: 2 कोटी+." },
    { id: "pune", name: "पुणे", pos: [0.2, -0.2, 0.5] as [number,number,number], color: "#3b82f6", desc: "शिक्षण व IT हब. सांस्कृतिक राजधानी. लोकसंख्या: 70 लाख+" },
    { id: "nashik", name: "नाशिक", pos: [0.1, 0.5, 0.5] as [number,number,number], color: "#22c55e", desc: "द्राक्षे व कांद्यासाठी प्रसिद्ध. धार्मिक नगर." },
    { id: "nagpur", name: "नागपूर", pos: [1.2, 0.3, 0.5] as [number,number,number], color: "#f97316", desc: "संत्र्यांचे शहर. उपराजधानी. मध्य भारताचे केंद्र." },
    { id: "aurangabad", name: "छत्रपती संभाजीनगर", pos: [0.5, 0.1, 0.5] as [number,number,number], color: "#8b5cf6", desc: "अजिंठा-वेरूळ लेणींसाठी प्रसिद्ध. ऐतिहासिक नगर." },
  ];

  return (
    <group>
      {/* Maharashtra base shape */}
      <mesh>
        <boxGeometry args={[3, 2, 0.2]} />
        <meshStandardMaterial color="#d4a574" roughness={1} />
      </mesh>
      {/* Rivers */}
      {[[-0.5, 0, 0.12], [0.5, -0.3, 0.12]].map((pos, i) => (
        <mesh key={i} position={pos as [number,number,number]} rotation={[0, 0, i * 0.5]}>
          <boxGeometry args={[0.05, 2, 0.05]} />
          <meshStandardMaterial color="#60a5fa" />
        </mesh>
      ))}

      {districts.map(d => (
        <group key={d.id} position={d.pos}>
          <mesh onClick={(e) => { e.stopPropagation(); setActiveDistrict(activeDistrict === d.id ? null : d.id); }}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}>
            <cylinderGeometry args={[0.1, 0.1, 0.4, 16]} />
            <meshStandardMaterial color={activeDistrict === d.id ? "#fff" : d.color} emissive={d.color} emissiveIntensity={0.5} />
          </mesh>
          {activeDistrict === d.id && (
            <Html position={[0, 0.5, 0]} center>
              <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl w-52 border-2 border-orange-300 animate-in fade-in">
                <h4 className="font-bold text-gray-900 font-marathi mb-1">{d.name}</h4>
                <p className="text-xs text-gray-600 font-marathi leading-relaxed">{d.desc}</p>
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}

// --- MOUNTAINS SCENE ---
export function MountainsScene() {
  const [active, setActive] = useState<string | null>(null);
  const mountains = [
    { id: "everest", name: "माउंट एव्हरेस्ट", pos: [0, 2, 0] as [number,number,number], height: 2, color: "#e2e8f0", desc: "8,848 मीटर. जगातील सर्वात उंच शिखर. हिमालयात." },
    { id: "sahyadri", name: "सह्याद्री (Western Ghats)", pos: [-1.5, 1.2, 0] as [number,number,number], height: 1.2, color: "#86efac", desc: "महाराष्ट्राची पर्वतरांग. 1,600 km लांब. जैवविविधता केंद्र." },
    { id: "vindhya", name: "विंध्य पर्वत", pos: [1.5, 0.8, 0] as [number,number,number], height: 0.8, color: "#a78bfa", desc: "मध्य भारतातील पर्वतरांग. उत्तर-दक्षिण विभाजन करते." },
  ];

  return (
    <group position={[0, -1, 0]}>
      {/* Ground */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[6, 0.3, 4]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      {mountains.map(m => (
        <group key={m.id} position={m.pos}>
          <mesh onClick={(e) => { e.stopPropagation(); setActive(active === m.id ? null : m.id); }}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'} castShadow>
            <coneGeometry args={[0.8, m.height * 1.5, 8]} />
            <meshStandardMaterial color={m.color} roughness={0.8} />
          </mesh>
          {/* Snow cap */}
          <mesh position={[0, m.height * 0.5, 0]}>
            <coneGeometry args={[0.25, 0.4, 8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          {active === m.id && (
            <Html position={[0.5, m.height * 0.8, 0]} center>
              <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl w-52 border-2 border-slate-300 animate-in fade-in">
                <h4 className="font-bold text-gray-900 font-marathi mb-1">{m.name}</h4>
                <p className="text-xs text-gray-600 font-marathi leading-relaxed">{m.desc}</p>
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}

// --- RIVERS SCENE ---
export function RiversScene() {
  const [active, setActive] = useState<string | null>(null);
  const rivers = [
    { id: "godavari", name: "गोदावरी", pos: [0, 0.5, 0] as [number,number,number], color: "#22d3ee", desc: "महाराष्ट्रातील सर्वात मोठी नदी. दक्षिण गंगा म्हणतात." },
    { id: "krishna", name: "कृष्णा", pos: [0, -0.3, 0] as [number,number,number], color: "#60a5fa", desc: "महाराष्ट्र, कर्नाटक, आंध्र प्रदेशमधून वाहते." },
    { id: "narmada", name: "नर्मदा", pos: [0, 1.2, 0] as [number,number,number], color: "#34d399", desc: "मध्य प्रदेश व गुजरातमधून वाहणारी पवित्र नदी." },
  ];

  return (
    <group>
      <mesh position={[0, 0, -0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial color="#d4a574" roughness={1} />
      </mesh>
      {rivers.map(r => (
        <group key={r.id} position={r.pos}>
          <mesh onClick={(e) => { e.stopPropagation(); setActive(active === r.id ? null : r.id); }}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}
            rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 5, 8]} />
            <meshStandardMaterial color={r.color} emissive={r.color} emissiveIntensity={0.3} />
          </mesh>
          {active === r.id && (
            <Html position={[0, 0.5, 0]} center>
              <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl w-48 border-2 border-cyan-300 animate-in fade-in">
                <h4 className="font-bold text-gray-900 font-marathi mb-1">{r.name} नदी</h4>
                <p className="text-xs text-gray-600 font-marathi leading-relaxed">{r.desc}</p>
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}
