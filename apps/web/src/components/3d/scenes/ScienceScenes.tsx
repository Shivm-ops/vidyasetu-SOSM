"use client";

import React, { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, Text } from "@react-three/drei";
import { Mesh, MeshStandardMaterial } from "three";

// --- BRAIN SCENE ---
export function BrainScene() {
  const [active, setActive] = useState<string | null>(null);
  const brainRef = useRef<Mesh>(null);
  useFrame((_, delta) => { if (brainRef.current) brainRef.current.rotation.y += delta * 0.2; });

  const regions = [
    { id: "frontal", name: "पुढील लोब (Frontal Lobe)", pos: [0, 0.8, 0.8] as [number,number,number], color: "#f97316", desc: "निर्णय, व्यक्तिमत्व, भाषण नियंत्रण करतो." },
    { id: "temporal", name: "ऐहिक लोब (Temporal Lobe)", pos: [1.1, 0, 0] as [number,number,number], color: "#06b6d4", desc: "ऐकणे आणि स्मृती यांचे केंद्र." },
    { id: "cerebellum", name: "अनुमस्तिष्क (Cerebellum)", pos: [0, -0.8, -0.8] as [number,number,number], color: "#8b5cf6", desc: "संतुलन आणि हालचालींवर नियंत्रण." },
  ];

  return (
    <group>
      {/* Main brain mass */}
      <mesh ref={brainRef} castShadow>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color="#fda4af" roughness={0.7} metalness={0} />
      </mesh>
      {/* Hemisphere division */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[1.21, 0.03, 16, 64, Math.PI]} />
        <meshStandardMaterial color="#fb7185" />
      </mesh>

      {regions.map(r => (
        <group key={r.id} position={r.pos}>
          <mesh onClick={(e) => { e.stopPropagation(); setActive(active === r.id ? null : r.id); }}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color={active === r.id ? "#ffffff" : r.color} emissive={r.color} emissiveIntensity={active === r.id ? 1 : 0.3} />
          </mesh>
          {active === r.id && (
            <Html position={[0.3, 0.3, 0]} center>
              <InfoPanel title={r.name} desc={r.desc} color={r.color} />
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}

// --- HEART SCENE ---
export interface SelectedLabPart {
  id: string;
  name: string;
  nameEn: string;
  desc: string;
  color: string;
}

export function HeartScene() {
  const [selectedPart, setSelectedPart] = useState<SelectedLabPart | null>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  
  // Lab Controls State
  const [heartRate, setHeartRate] = useState(72);
  const [showFlow, setShowFlow] = useState(true);
  const [xrayMode, setXrayMode] = useState(false);
  const [labTab, setLabTab] = useState<"info" | "quiz" | "activity" | "career">("info");

  // Track viewport width dynamically to match Tailwind's lg (1024px) breakpoint for responsive 3D layout
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Position and scale offset to center the heart model inside the remaining visible screen space (between left toggles and right dashboard)
  const heartPosition: [number, number, number] = isDesktop ? [-0.85, -0.1, 0] : [0, 0.2, 0];
  const heartScale: [number, number, number] = isDesktop ? [0.85, 0.85, 0.85] : [0.95, 0.95, 0.95];

  // Animations References
  const atriaGroupRef = useRef<any>(null);
  const ventricleGroupRef = useRef<any>(null);
  const aortaRef = useRef<any>(null);
  const pulmonaryRef = useRef<any>(null);

  // Blood Flow Particles Animation
  const aortaParticlesRef = useRef<any[]>([]);
  const pulmonaryParticlesRef = useRef<any[]>([]);

  // Local Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const QUIZ_QUESTIONS = [
    {
      q: "हृदयाचा कोणता शक्तिशाली कप्पा संपूर्ण शरीराला शुद्ध रक्त पाठवतो?",
      options: ["उजवा अट्रियम", "डावा वेंट्रिकल", "डावा अट्रियम", "उजवा वेंट्रिकल"],
      answer: 1,
      exp: "डावा वेंट्रिकल महाधमनीद्वारे ऑक्सिजनयुक्त रक्त दाबाने संपूर्ण शरीरात पंप करतो."
    },
    {
      q: "अशुद्ध रक्त शुद्धीकरणासाठी फुफ्फुसात नेणारी धमनी कोणती?",
      options: ["महाधमनी (Aorta)", "फुफ्फुसीय धमनी (Pulmonary Artery)", "केशवाहिन्या", "शीर"],
      answer: 1,
      exp: "फुफ्फुसीय धमनी उजव्या वेंट्रिकलमधून अशुद्ध रक्त दोन्ही फुफ्फुसांत घेऊन जाते."
    },
    {
      q: "सामान्य विश्रांतीच्या वेळी मानवी हृदयाचे ठोके प्रति मिनिट सुमारे किती असतात?",
      options: ["५० ठोके", "७२ ठोके", "१२० ठोके", "१५० ठोके"],
      answer: 1,
      exp: "सामान्य आणि निरोगी विश्रांतीच्या स्थितीत हृदय दर मिनिटाला सुमारे ७२ वेळा धडधडते."
    }
  ];

  const HEART_PARTS = [
    {
      id: "aorta",
      name: "महाधमनी",
      nameEn: "Aorta",
      pos: [0.15, 0.9, -0.1] as [number, number, number],
      color: "#dc2626",
      desc: "महाधमनी (Aorta) ही मानवी शरीरातील सर्वात मोठी धमनी आहे. ही डाव्या वेंट्रिकलमधून ऑक्सिजनयुक्त शुद्ध रक्त मिळवून संपूर्ण शरीराला पुरवण्याचे काम करते."
    },
    {
      id: "pulmonary_artery",
      name: "फुफ्फुसीय धमनी",
      nameEn: "Pulmonary Artery",
      pos: [-0.25, 0.6, 0.2] as [number, number, number],
      color: "#2563eb",
      desc: "फुफ्फुसीय धमनी (Pulmonary Artery) उजव्या वेंट्रिकलमधून निघते. ही शरीरातून गोळा झालेले अशुद्ध (CO₂ युक्त) रक्त शुद्ध करण्यासाठी फुफ्फुसात वाहून नेते."
    },
    {
      id: "left_atrium",
      name: "डावा अट्रियम",
      nameEn: "Left Atrium",
      pos: [0.55, 0.3, -0.1] as [number, number, number],
      color: "#f87171",
      desc: "डावा अट्रियम (Left Atrium) हा डाव्या बाजूचा वरचा कप्पा आहे. हा फुफ्फुसाकडून आलेले ऑक्सिजनयुक्त शुद्ध रक्त स्वीकारतो आणि ते डाव्या वेंट्रिकलमध्ये पाठवतो."
    },
    {
      id: "right_atrium",
      name: "उजवा अट्रियम",
      nameEn: "Right Atrium",
      pos: [-0.55, 0.3, -0.1] as [number, number, number],
      color: "#60a5fa",
      desc: "उजवा अट्रियम (Right Atrium) हा उजव्या बाजूचा वरचा कप्पा आहे. हा संपूर्ण शरीरातून गोळा केलेले अशुद्ध (CO₂ युक्त) रक्त प्राप्त करतो."
    },
    {
      id: "left_ventricle",
      name: "डावा वेंट्रिकल",
      nameEn: "Left Ventricle",
      pos: [0.3, -0.4, 0.15] as [number, number, number],
      color: "#ef4444",
      desc: "डावा वेंट्रिकल (Left Ventricle) हा सर्वात शक्तिशाली आणि जाड भिंत असलेला कप्पा आहे. हा ऑक्सिजनयुक्त शुद्ध रक्त मोठ्या दाबाने महाधमनीद्वारे संपूर्ण शरीरात पंप करतो."
    },
    {
      id: "right_ventricle",
      name: "उजवा वेंट्रिकल",
      nameEn: "Right Ventricle",
      pos: [-0.3, -0.4, 0.15] as [number, number, number],
      color: "#3b82f6",
      desc: "उजवा वेंट्रिकल (Right Ventricle) हा उजव्या बाजूचा खालचा कप्पा आहे. हा अशुद्ध रक्त फुफ्फुसीय धमनीद्वारे फुफ्फुसाकडे पंप करतो जेणेकरून तिथे वायूंचे देवाणघेवाण होऊ शकेल."
    }
  ];

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Peristaltic heart contraction rate
    const speed = (heartRate / 60) * Math.PI * 2;
    const pulseAtria = 1 + Math.sin(time * speed) * 0.08;
    const pulseVentricles = 1 + Math.sin(time * speed + Math.PI) * 0.08;

    // Apply offset scale animations for actual pumping simulation
    if (atriaGroupRef.current) {
      atriaGroupRef.current.scale.set(pulseAtria, 1 + Math.sin(time * speed) * 0.04, pulseAtria);
    }
    if (ventricleGroupRef.current) {
      ventricleGroupRef.current.scale.set(pulseVentricles, 1 + Math.sin(time * speed + Math.PI) * 0.05, pulseVentricles);
    }

    // Aorta blood flow path interpolation (red particles)
    const flowSpeed = (heartRate / 60) * 0.45;
    aortaParticlesRef.current.forEach((mesh, index) => {
      if (mesh) {
        const offset = index / aortaParticlesRef.current.length;
        const progress = (time * flowSpeed + offset) % 1;
        
        // Define path: Left Ventricle -> Aorta Arch -> Downwards
        if (progress < 0.4) {
          const t = progress / 0.4;
          mesh.position.set(0.15, -0.3 + t * 0.8, 0.1 - t * 0.1);
        } else if (progress < 0.7) {
          const t = (progress - 0.4) / 0.3;
          const ang = t * Math.PI;
          mesh.position.set(0.025 + Math.cos(ang) * 0.125, 0.5 + Math.sin(ang) * 0.3, 0);
        } else {
          const t = (progress - 0.7) / 0.3;
          mesh.position.set(-0.1 - t * 0.1, 0.5 - t * 0.3, -0.1 - t * 0.1);
        }
        mesh.visible = showFlow;
      }
    });

    // Pulmonary blood flow path interpolation (blue particles)
    pulmonaryParticlesRef.current.forEach((mesh, index) => {
      if (mesh) {
        const offset = index / pulmonaryParticlesRef.current.length;
        const progress = (time * flowSpeed + offset) % 1;
        
        // Path: Right Ventricle -> Pulmonary trunk -> split left/right Lungs
        if (progress < 0.5) {
          const t = progress / 0.5;
          mesh.position.set(-0.15, -0.3 + t * 0.6, 0.15 - t * 0.05);
        } else {
          const t = (progress - 0.5) / 0.5;
          const direction = index % 2 === 0 ? -1 : 1;
          mesh.position.set(-0.15 + direction * t * 0.6, 0.3 + t * 0.2, 0.1 - t * 0.1);
        }
        mesh.visible = showFlow;
      }
    });
  });

  return (
    <group>
      {/* 3D Lab Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />

      <group position={heartPosition} scale={heartScale}>
        {/* --- ATRIA GROUP --- */}
      <group ref={atriaGroupRef}>
        {/* Right Atrium (RA) - Blue */}
        <mesh 
          position={[-0.45, 0.3, -0.1]} 
          onClick={(e) => { e.stopPropagation(); setSelectedPart(HEART_PARTS[3]); }}
          onPointerOver={() => { setHoveredPart("right_atrium"); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { setHoveredPart(null); document.body.style.cursor = "auto"; }}
        >
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial 
            color="#3b82f6" 
            roughness={0.4} 
            wireframe={xrayMode}
            emissive="#3b82f6"
            emissiveIntensity={selectedPart?.id === "right_atrium" ? 0.6 : (hoveredPart === "right_atrium" ? 0.3 : 0.05)}
          />
        </mesh>

        {/* Left Atrium (LA) - Red */}
        <mesh 
          position={[0.45, 0.3, -0.1]} 
          onClick={(e) => { e.stopPropagation(); setSelectedPart(HEART_PARTS[2]); }}
          onPointerOver={() => { setHoveredPart("left_atrium"); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { setHoveredPart(null); document.body.style.cursor = "auto"; }}
        >
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial 
            color="#ef4444" 
            roughness={0.4} 
            wireframe={xrayMode}
            emissive="#ef4444"
            emissiveIntensity={selectedPart?.id === "left_atrium" ? 0.6 : (hoveredPart === "left_atrium" ? 0.3 : 0.05)}
          />
        </mesh>
      </group>

      {/* --- VENTRICLE GROUP --- */}
      <group ref={ventricleGroupRef}>
        {/* Right Ventricle (RV) - Blue, Bottom Left relative to front viewer */}
        <mesh 
          position={[-0.28, -0.3, 0.1]} 
          scale={[1, 1.4, 1]} 
          onClick={(e) => { e.stopPropagation(); setSelectedPart(HEART_PARTS[5]); }}
          onPointerOver={() => { setHoveredPart("right_ventricle"); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { setHoveredPart(null); document.body.style.cursor = "auto"; }}
        >
          <sphereGeometry args={[0.48, 32, 32]} />
          <meshStandardMaterial 
            color="#2563eb" 
            roughness={0.4}
            wireframe={xrayMode}
            emissive="#2563eb"
            emissiveIntensity={selectedPart?.id === "right_ventricle" ? 0.6 : (hoveredPart === "right_ventricle" ? 0.3 : 0.05)}
          />
        </mesh>

        {/* Left Ventricle (LV) - Red, Bottom Right relative to front viewer */}
        <mesh 
          position={[0.25, -0.35, 0.1]} 
          scale={[1, 1.5, 1]} 
          onClick={(e) => { e.stopPropagation(); setSelectedPart(HEART_PARTS[4]); }}
          onPointerOver={() => { setHoveredPart("left_ventricle"); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { setHoveredPart(null); document.body.style.cursor = "auto"; }}
        >
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial 
            color="#dc2626" 
            roughness={0.3}
            wireframe={xrayMode}
            emissive="#dc2626"
            emissiveIntensity={selectedPart?.id === "left_ventricle" ? 0.6 : (hoveredPart === "left_ventricle" ? 0.3 : 0.05)}
          />
        </mesh>
      </group>

      {/* --- ARTERIAL VESSELS --- */}
      {/* Aorta (Red Arching Cylinder path) */}
      <group>
        {/* Aorta Trunk */}
        <mesh 
          position={[0.15, 0.3, 0]} 
          rotation={[0.1, 0, -0.25]}
          onClick={(e) => { e.stopPropagation(); setSelectedPart(HEART_PARTS[0]); }}
          onPointerOver={() => { setHoveredPart("aorta"); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { setHoveredPart(null); document.body.style.cursor = "auto"; }}
        >
          <cylinderGeometry args={[0.16, 0.18, 0.8, 16]} />
          <meshStandardMaterial 
            color="#c2410c" 
            wireframe={xrayMode}
            emissive="#c2410c"
            emissiveIntensity={selectedPart?.id === "aorta" ? 0.6 : (hoveredPart === "aorta" ? 0.3 : 0.05)}
          />
        </mesh>
        {/* Aorta Arch */}
        <mesh 
          position={[0.025, 0.6, 0]} 
          rotation={[0, 0, 0]}
          onClick={(e) => { e.stopPropagation(); setSelectedPart(HEART_PARTS[0]); }}
          onPointerOver={() => { setHoveredPart("aorta"); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { setHoveredPart(null); document.body.style.cursor = "auto"; }}
        >
          <torusGeometry args={[0.125, 0.15, 16, 64, Math.PI]} />
          <meshStandardMaterial 
            color="#c2410c" 
            wireframe={xrayMode}
            emissive="#c2410c"
            emissiveIntensity={selectedPart?.id === "aorta" ? 0.6 : (hoveredPart === "aorta" ? 0.3 : 0.05)}
          />
        </mesh>
        {/* Branching vessels on Aorta (three small tubes at top) */}
        {[[-0.05, 0.8, 0.05], [0.025, 0.82, 0.02], [0.1, 0.8, -0.02]].map((pos, idx) => (
          <mesh key={idx} position={pos as [number,number,number]} rotation={[0.2, 0, 0.1]}>
            <cylinderGeometry args={[0.04, 0.04, 0.3, 8]} />
            <meshStandardMaterial color="#b91c1c" wireframe={xrayMode} />
          </mesh>
        ))}
      </group>

      {/* Pulmonary Artery (Blue Branching Tube) */}
      <group>
        {/* Main Trunk */}
        <mesh 
          position={[-0.15, 0.1, 0.15]} 
          rotation={[-0.2, 0, 0.2]}
          onClick={(e) => { e.stopPropagation(); setSelectedPart(HEART_PARTS[1]); }}
          onPointerOver={() => { setHoveredPart("pulmonary_artery"); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { setHoveredPart(null); document.body.style.cursor = "auto"; }}
        >
          <cylinderGeometry args={[0.13, 0.15, 0.6, 16]} />
          <meshStandardMaterial 
            color="#1d4ed8" 
            wireframe={xrayMode}
            emissive="#1d4ed8"
            emissiveIntensity={selectedPart?.id === "pulmonary_artery" ? 0.6 : (hoveredPart === "pulmonary_artery" ? 0.3 : 0.05)}
          />
        </mesh>
        {/* Left Branch */}
        <mesh 
          position={[-0.45, 0.4, 0.05]} 
          rotation={[0, 0, Math.PI / 4]}
          onClick={(e) => { e.stopPropagation(); setSelectedPart(HEART_PARTS[1]); }}
          onPointerOver={() => { setHoveredPart("pulmonary_artery"); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { setHoveredPart(null); document.body.style.cursor = "auto"; }}
        >
          <cylinderGeometry args={[0.09, 0.09, 0.5, 16]} />
          <meshStandardMaterial 
            color="#1d4ed8" 
            wireframe={xrayMode}
            emissive="#1d4ed8"
            emissiveIntensity={selectedPart?.id === "pulmonary_artery" ? 0.6 : (hoveredPart === "pulmonary_artery" ? 0.3 : 0.05)}
          />
        </mesh>
        {/* Right Branch */}
        <mesh 
          position={[0.15, 0.4, 0.05]} 
          rotation={[0, 0, -Math.PI / 4]}
          onClick={(e) => { e.stopPropagation(); setSelectedPart(HEART_PARTS[1]); }}
          onPointerOver={() => { setHoveredPart("pulmonary_artery"); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { setHoveredPart(null); document.body.style.cursor = "auto"; }}
        >
          <cylinderGeometry args={[0.09, 0.09, 0.5, 16]} />
          <meshStandardMaterial 
            color="#1d4ed8" 
            wireframe={xrayMode}
            emissive="#1d4ed8"
            emissiveIntensity={selectedPart?.id === "pulmonary_artery" ? 0.6 : (hoveredPart === "pulmonary_artery" ? 0.3 : 0.05)}
          />
        </mesh>
      </group>

      {/* --- FLOW PARTICLES --- */}
      {/* Red particles flowing through Aorta */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`aorta-p-${i}`} ref={(el) => (aortaParticlesRef.current[i] = el)}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#fca5a5" />
        </mesh>
      ))}

      {/* Blue particles flowing through Pulmonary Artery */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`pulm-p-${i}`} ref={(el) => (pulmonaryParticlesRef.current[i] = el)}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#93c5fd" />
        </mesh>
      ))}

      {/* --- HOVER LABELS IN 3D SPACE --- */}
      {HEART_PARTS.map((p) => {
        const isHovered = hoveredPart === p.id;
        const isSelected = selectedPart?.id === p.id;
        if (!isHovered && !isSelected) return null;
        return (
          <Html key={`label-${p.id}`} position={p.pos} center>
            <div className={`px-2.5 py-1 rounded-lg text-[10px] md:text-xs font-bold font-marathi shadow-lg border pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-90 ${
              isSelected ? "bg-brand-500 text-white border-brand-400" : "bg-slate-900/90 text-slate-100 border-slate-700"
            }`}>
              {p.name} ({p.nameEn})
            </div>
          </Html>
        );
      })}
      </group>

      {/* --- INTERACTIVE SCIENCE LAB OVERLAY PANEL --- */}
      <Html fullscreen style={{ pointerEvents: "none" }}>
        {/* Left Side Quick Toggle Controls */}
        <div className="absolute top-4 left-4 pointer-events-auto z-40 flex flex-col gap-2">
          {/* Quick Info Badge */}
          <div className="bg-slate-900/95 border border-white/10 rounded-2xl p-3 shadow-xl backdrop-blur-md w-52 flex flex-col gap-1.5 font-marathi">
            <span className="text-[10px] text-brand-400 font-extrabold uppercase tracking-wide">🔬 सायन्स लॅब सिम्युलेटर</span>
            <h4 className="font-extrabold text-sm text-slate-100 leading-none">इंटरएक्टिव्ह हृदय मॉडेल</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed mt-1">हृदयाच्या भागावर क्लिक करून माहिती, क्विझ आणि करिअर पर्याय तपासा.</p>
          </div>

          {/* Quick Mode Switches */}
          <div className="bg-slate-900/95 border border-white/10 rounded-2xl p-3 shadow-xl backdrop-blur-md w-52 flex flex-col gap-2 font-marathi">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">दृश्य मोड (View Mode)</span>
            
            {/* X-Ray Mode */}
            <button 
              onClick={() => setXrayMode(!xrayMode)}
              className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold border transition-colors flex items-center justify-between ${
                xrayMode ? "bg-amber-500/20 text-amber-300 border-amber-500/40" : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
              }`}
            >
              <span>🩻 एक्स-रे (Wireframe)</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-black/40">{xrayMode ? "ON" : "OFF"}</span>
            </button>

            {/* Blood Flow Particles */}
            <button 
              onClick={() => setShowFlow(!showFlow)}
              className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold border transition-colors flex items-center justify-between ${
                showFlow ? "bg-brand-500/20 text-brand-300 border-brand-500/40" : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
              }`}
            >
              <span>💧 रक्तप्रवाह (Flow)</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-black/40">{showFlow ? "ON" : "OFF"}</span>
            </button>
          </div>
        </div>

        {/* Right Side Responsive Interactive Dashboard Drawer */}
        <div className="absolute bottom-0 left-0 w-full lg:top-0 lg:right-0 lg:left-auto lg:h-full lg:w-[340px] bg-slate-950/95 border-t lg:border-t-0 lg:border-l border-white/10 p-4 font-marathi text-white flex flex-col pointer-events-auto backdrop-blur-md shadow-2xl z-40 overflow-y-auto max-h-[320px] lg:max-h-none">
          {/* Lab Tabs */}
          <div className="flex gap-1 border-b border-white/10 pb-2 mb-4 overflow-x-auto shrink-0">
            {[
              { id: "info", label: "माहिती", emoji: "🫀" },
              { id: "quiz", label: "क्विझ", emoji: "📝" },
              { id: "activity", label: "कृती", emoji: "🧪" },
              { id: "career", label: "करिअर", emoji: "🎯" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setLabTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1 border shrink-0 ${
                  labTab === tab.id 
                    ? "bg-brand-500 text-white border-brand-400" 
                    : "bg-white/5 text-slate-400 border-transparent hover:bg-white/10"
                }`}
              >
                <span>{tab.emoji}</span> <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto pr-1">
            
            {/* INFO TAB */}
            {labTab === "info" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {selectedPart ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-brand-400 tracking-wider">निवडलेला भाग</span>
                      <button 
                        onClick={() => setSelectedPart(null)}
                        className="text-[10px] text-slate-400 hover:text-white bg-white/5 px-2 py-0.5 rounded border border-white/10"
                      >
                        रीसेट
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedPart.color }} />
                      <h3 className="text-base font-extrabold text-slate-100">{selectedPart.name}</h3>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide -mt-2">
                      {selectedPart.nameEn}
                    </p>
                    <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl">
                      <p className="text-xs text-slate-300 leading-relaxed font-marathi">
                        {selectedPart.desc}
                      </p>
                    </div>

                    <button className="w-full flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-bold py-2 px-4 rounded-xl transition-all">
                      📢 ऑडिओ स्पष्टीकरण ऐका
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6 space-y-3">
                    <div className="text-3xl animate-pulse">🫀</div>
                    <h3 className="font-extrabold text-sm text-slate-200">भाग निवडा (Select a part)</h3>
                    <p className="text-xs text-slate-500 max-w-[220px] mx-auto leading-relaxed">
                      3D मॉडेलमधील कोणत्याही भागावर किंवा रक्तवाहिनीवर टॅप करा जेणेकरून तिची सविस्तर माहिती उघडेल.
                    </p>
                  </div>
                )}

                {/* Heart Rate controls */}
                <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-3 pt-3">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block">
                    हृदय गती नियंत्रण (Heart Rate)
                  </span>
                  
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-300">ठोके दर (Heart Rate):</span>
                    <span className="text-brand-400 text-sm">{heartRate} BPM</span>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => setHeartRate(72)}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-colors ${
                        heartRate === 72 ? "bg-blue-500/20 text-blue-300 border-blue-500/40" : "bg-white/5 text-slate-400 border-transparent hover:bg-white/10"
                      }`}
                    >
                      🧘 विश्रांती (72 BPM)
                    </button>
                    <button 
                      onClick={() => setHeartRate(120)}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-colors ${
                        heartRate === 120 ? "bg-rose-500/20 text-rose-300 border-rose-500/40" : "bg-white/5 text-slate-400 border-transparent hover:bg-white/10"
                      }`}
                    >
                      🏃 व्यायाम (120 BPM)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* QUIZ TAB */}
            {labTab === "quiz" && (
              <div className="space-y-4 animate-in fade-in duration-200 font-marathi">
                {!quizDone ? (
                  <div className="space-y-3.5 bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                      <span>प्रश्न {quizIndex + 1} / {QUIZ_QUESTIONS.length}</span>
                      <span>गुण: {quizScore}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-100 leading-normal">
                      {QUIZ_QUESTIONS[quizIndex].q}
                    </h4>

                    <div className="flex flex-col gap-2">
                      {QUIZ_QUESTIONS[quizIndex].options.map((opt, i) => {
                        const isSelected = quizSelected === i;
                        const isCorrect = quizChecked && i === QUIZ_QUESTIONS[quizIndex].answer;
                        const isWrong = quizChecked && isSelected && i !== QUIZ_QUESTIONS[quizIndex].answer;

                        return (
                          <button
                            key={i}
                            disabled={quizChecked}
                            onClick={() => setQuizSelected(i)}
                            className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all ${
                              isCorrect ? "bg-green-500/20 border-green-500 text-green-300" :
                              isWrong ? "bg-red-500/20 border-red-500 text-red-300" :
                              isSelected ? "bg-amber-500/20 border-amber-500 text-amber-200" :
                              "bg-white/5 border-white/10 text-slate-300 hover:border-white/20"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {quizChecked && (
                      <div className="bg-slate-900 border border-white/10 p-2.5 rounded-xl text-[10px] text-slate-300 leading-relaxed">
                        💡 <span className="font-bold text-slate-100">स्पष्टीकरण:</span> {QUIZ_QUESTIONS[quizIndex].exp}
                      </div>
                    )}

                    {!quizChecked ? (
                      <button
                        disabled={quizSelected === null}
                        onClick={() => {
                          setQuizChecked(true);
                          if (quizSelected === QUIZ_QUESTIONS[quizIndex].answer) {
                            setQuizScore(s => s + 1);
                          }
                        }}
                        className="w-full bg-brand-500 hover:bg-brand-400 disabled:opacity-40 text-white font-bold py-2 rounded-xl text-xs transition-colors"
                      >
                        तपासा
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setQuizChecked(false);
                          setQuizSelected(null);
                          if (quizIndex + 1 < QUIZ_QUESTIONS.length) {
                            setQuizIndex(i => i + 1);
                          } else {
                            setQuizDone(true);
                          }
                        }}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-xl text-xs transition-colors"
                      >
                        {quizIndex + 1 === QUIZ_QUESTIONS.length ? "निकाल पहा" : "पुढील प्रश्न"}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl text-center space-y-4">
                    <div className="text-4xl">🏆</div>
                    <h3 className="font-extrabold text-sm text-slate-100">क्विझ पूर्ण झाली!</h3>
                    <p className="text-xs text-slate-300">तुमचा स्कोअर: <span className="text-amber-400 font-black">{quizScore} / {QUIZ_QUESTIONS.length}</span></p>
                    
                    <button
                      onClick={() => {
                        setQuizIndex(0);
                        setQuizSelected(null);
                        setQuizChecked(false);
                        setQuizScore(0);
                        setQuizDone(false);
                      }}
                      className="w-full bg-brand-500 hover:bg-brand-400 text-white font-bold py-2 rounded-xl text-xs transition-colors"
                    >
                      पुन्हा सुरू करा
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ACTIVITY TAB */}
            {labTab === "activity" && (
              <div className="space-y-4 animate-in fade-in duration-200 font-marathi">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                    <span>🧪</span> <span>हृदय गती मोजण्याचा प्रयोग</span>
                  </div>
                  
                  <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                    <p className="font-medium">घरी किंवा वर्गात नाडीचे ठोके मोजण्यासाठी खालील कृती करा:</p>
                    
                    <div className="flex gap-2">
                      <span className="bg-emerald-500/20 text-emerald-300 font-bold w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px]">१</span>
                      <p>तुमच्या एका हाताचे मनगट वर करा आणि दुसऱ्या हाताची २ बोटे नाडीवर ठेवा.</p>
                    </div>

                    <div className="flex gap-2">
                      <span className="bg-emerald-500/20 text-emerald-300 font-bold w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px]">२</span>
                      <p>३० सेकंदांचे ठोके मोजा आणि त्या संख्येला २ ने गुणा. हा विश्रांतीचा दर आहे.</p>
                    </div>

                    <div className="flex gap-2">
                      <span className="bg-emerald-500/20 text-emerald-300 font-bold w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px]">३</span>
                      <p>आता १ मिनिट जागेवर धावून किंवा उड्या मारून पुन्हा ठोके मोजा.</p>
                    </div>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl text-[10px] text-emerald-300 font-medium">
                    💡 <span className="font-bold">निरीक्षण:</span> व्यायाम केल्यावर शरीराला जास्त ऑक्सिजन हवा असतो, म्हणून हृदय जास्त वेगाने रक्त पंप करते!
                  </div>
                </div>
              </div>
            )}

            {/* CAREER TAB */}
            {labTab === "career" && (
              <div className="space-y-4 animate-in fade-in duration-200 font-marathi">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-orange-400 font-bold">
                    <span>🩺</span> <span>करिअर मार्ग: हृदयरोग तज्ज्ञ</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    या अवयवाचा आणि त्याच्या आजारांचा सखोल अभ्यास करून तुम्ही भविष्यात **हृदयरोग तज्ज्ञ (Cardiologist)** बनू शकता.
                  </p>

                  <div className="space-y-2 border-l border-white/10 pl-3.5 ml-1 my-2">
                    {[
                      { step: "१", title: "एम.बी.बी.एस (MBBS)", desc: "५.५ वर्षे वैद्यकीय अभ्यासक्रम" },
                      { step: "२", title: "एम.डी. (MD Medicine)", desc: "३ वर्षे सामान्य औषधशास्त्र विशेषीकरण" },
                      { step: "३", title: "डी.एम. (DM Cardiology)", desc: "३ वर्षे हृदय उपचारातील सर्वोच्च पदवी" }
                    ].map((cStep) => (
                      <div key={cStep.step} className="relative">
                        <div className="absolute -left-[20px] top-1.5 w-2 h-2 rounded-full bg-orange-400" />
                        <h5 className="font-bold text-xs text-orange-300 leading-none">{cStep.title}</h5>
                        <p className="text-[10px] text-slate-500 mt-0.5">{cStep.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-orange-500/10 border border-orange-500/20 p-2.5 rounded-xl text-[10px] text-orange-300">
                    💡 <span className="font-bold">इतर करिअर:</span> कार्डियाक टेक्नॉलॉजिस्ट (Cardiac Tech), परफ्युझनिस्ट (बायपास मशीन तज्ज्ञ).
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </Html>
    </group>
  );
}

// --- LUNGS SCENE ---
export function LungsScene() {
  const leftRef = useRef<Mesh>(null);
  const rightRef = useRef<Mesh>(null);
  const [active, setActive] = useState<string | null>(null);

  useFrame((state) => {
    const breathe = 1 + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.1;
    if (leftRef.current) leftRef.current.scale.setScalar(breathe);
    if (rightRef.current) rightRef.current.scale.setScalar(breathe);
  });

  return (
    <group>
      {/* Left lung */}
      <mesh ref={leftRef} position={[-0.8, 0, 0]}
        onClick={(e) => { e.stopPropagation(); setActive(active === "left" ? null : "left"); }}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="#93c5fd" roughness={0.6} />
        {active === "left" && (
          <Html position={[0, 1.2, 0]} center>
            <InfoPanel title="डावे फुफ्फुस (Left Lung)" desc="दोन लोब असतात. ऑक्सिजन शोषतो व CO₂ सोडतो." color="#3b82f6" />
          </Html>
        )}
      </mesh>
      {/* Right lung */}
      <mesh ref={rightRef} position={[0.8, 0, 0]}
        onClick={(e) => { e.stopPropagation(); setActive(active === "right" ? null : "right"); }}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#7dd3fc" roughness={0.6} />
        {active === "right" && (
          <Html position={[0, 1.2, 0]} center>
            <InfoPanel title="उजवे फुफ्फुस (Right Lung)" desc="तीन लोब असतात. शरीरात ऑक्सिजन पुरवतो." color="#0284c7" />
          </Html>
        )}
      </mesh>
      {/* Trachea */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1.5, 16]} />
        <meshStandardMaterial color="#e0f2fe" />
      </mesh>
    </group>
  );
}

// --- SKELETON SCENE ---
export function SkeletonScene() {
  const [active, setActive] = useState<string | null>(null);
  const skelRef = useRef<Mesh>(null);
  useFrame((_, delta) => { if (skelRef.current) skelRef.current.rotation.y += delta * 0.15; });

  const bones = [
    { id: "skull", name: "कवटी (Skull)", pos: [0, 2, 0] as [number,number,number], type: "sphere", color: "#fef9c3", desc: "मेंदूचे संरक्षण करते. 22 हाडांनी बनलेली आहे." },
    { id: "spine", name: "मणका (Spine)", pos: [0, 0.5, 0] as [number,number,number], type: "cylinder", color: "#fef9c3", desc: "33 मणके. शरीराचा आधारस्तंभ." },
    { id: "femur", name: "मांडीचे हाड (Femur)", pos: [0, -1.5, 0] as [number,number,number], type: "cylinder", color: "#fef9c3", desc: "शरीरातील सर्वात मोठे आणि मजबूत हाड." },
  ];

  return (
    <group ref={skelRef as any}>
      {bones.map(b => (
        <group key={b.id} position={b.pos}>
          <mesh onClick={(e) => { e.stopPropagation(); setActive(active === b.id ? null : b.id); }}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}
            scale={active === b.id ? 1.15 : 1}>
            {b.type === "sphere" ? <sphereGeometry args={[0.45, 32, 32]} /> : <cylinderGeometry args={[0.18, 0.18, 1.5, 16]} />}
            <meshStandardMaterial color={b.color} emissive={active === b.id ? "#fef08a" : "#000"} emissiveIntensity={0.4} />
          </mesh>
          {active === b.id && (
            <Html position={[0.8, 0, 0]} center>
              <InfoPanel title={b.name} desc={b.desc} color="#92400e" />
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}

// --- DIGESTIVE SYSTEM SCENE ---
export function DigestiveScene() {
  const [active, setActive] = useState<string | null>(null);
  const organs = [
    { id: "stomach", name: "पोट (Stomach)", pos: [0, 0.5, 0] as [number,number,number], color: "#fde047", desc: "अन्न पचवण्याचे मुख्य केंद्र. आम्ल स्रवते." },
    { id: "liver", name: "यकृत (Liver)", pos: [0.8, 0.8, 0] as [number,number,number], color: "#f97316", desc: "शरीरातील सर्वात मोठे ग्रंथी. रक्त शुद्ध करते." },
    { id: "intestine", name: "लहान आतडे (Small Intestine)", pos: [0, -0.5, 0] as [number,number,number], color: "#a3e635", desc: "पोषण शोषण्याचे प्रमुख केंद्र. ७ मीटर लांब." },
  ];
  return (
    <group>
      {organs.map(o => (
        <group key={o.id} position={o.pos}>
          <mesh onClick={(e) => { e.stopPropagation(); setActive(active === o.id ? null : o.id); }}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}>
            <sphereGeometry args={[0.35, 32, 32]} />
            <meshStandardMaterial color={o.color} emissive={active === o.id ? o.color : "#000"} emissiveIntensity={0.4} />
          </mesh>
          {active === o.id && (
            <Html position={[0.5, 0.5, 0]} center>
              <InfoPanel title={o.name} desc={o.desc} color="#15803d" />
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}

// --- ATOM SCENE ---
export function AtomScene() {
  const [active, setActive] = useState<string | null>(null);
  const e1 = useRef<Mesh>(null);
  const e2 = useRef<Mesh>(null);
  const e3 = useRef<Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (e1.current) { e1.current.position.x = Math.cos(t * 2) * 1.5; e1.current.position.z = Math.sin(t * 2) * 1.5; }
    if (e2.current) { e2.current.position.x = Math.cos(t * 2 + 2.1) * 1.5; e2.current.position.z = Math.sin(t * 2 + 2.1) * 1.5; }
    if (e3.current) { e3.current.position.x = Math.cos(t * 2 + 4.2) * 1.5; e3.current.position.z = Math.sin(t * 2 + 4.2) * 1.5; }
  });

  return (
    <group>
      {/* Nucleus */}
      <mesh onClick={(e) => { e.stopPropagation(); setActive(active === "nucleus" ? null : "nucleus"); }}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={0.4} />
        {active === "nucleus" && (
          <Html position={[0.6, 0.6, 0]} center>
            <InfoPanel title="केंद्रक (Nucleus)" desc="प्रोटॉन (+) आणि न्यूट्रॉन (0) असतात. अणूचे केंद्र." color="#ea580c" />
          </Html>
        )}
      </mesh>

      {/* Electron orbitals */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.48, 1.52, 64]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.3} side={2} />
      </mesh>

      {/* Electrons */}
      {[e1, e2, e3].map((ref, i) => (
        <mesh key={i} ref={ref}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// --- Shared Info Panel ---
function InfoPanel({ title, desc, color }: { title: string; desc: string; color: string }) {
  return (
    <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl w-52 border-2 animate-in fade-in zoom-in-95" style={{ borderColor: color }}>
      <h4 className="font-bold text-gray-900 font-marathi mb-1 text-sm">{title}</h4>
      <p className="text-xs text-gray-600 font-marathi leading-relaxed">{desc}</p>
      <button className="mt-2 text-[10px] font-bold w-full py-1.5 rounded-lg transition-colors" style={{ background: color + "20", color: color }}>
        🔊 माहिती ऐका
      </button>
    </div>
  );
}
