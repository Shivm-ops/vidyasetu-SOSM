"use client";

import React, { useState, useMemo } from "react";
import { Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function Human3DModel({ visible, onClick }: { visible: boolean, onClick: (e: any) => void }) {
  const { scene } = useGLTF("/models/anatomy.glb");
  
  // Apply a sci-fi hologram material to the entire 3D model
  useMemo(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: "#06b6d4", // Cyan
          emissive: "#0891b2",
          emissiveIntensity: 0.5,
          wireframe: true, // Gives that sci-fi grid look like the image
          transparent: true,
          opacity: 0.3,
          depthWrite: false
        });
      }
    });
  }, [scene]);

  return (
    <primitive 
      object={scene} 
      scale={2.5} 
      position={[0, -2.5, 0]} 
      rotation={[0, 0, 0]} 
      visible={visible}
      onClick={(e: any) => {
        e.stopPropagation();
        onClick(e);
      }}
      onPointerOver={(e: any) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    />
  );
}

interface AnatomySceneProps {
  activeLayers: string[];
  onSelectOrgan: (organId: string | null) => void;
  selectedOrganId: string | null;
}

export function AnatomyScene({ activeLayers, onSelectOrgan, selectedOrganId }: AnatomySceneProps) {

  // Positioned physically inside the 3D humanoid model (Xbot)
  const parts = [
    { id: "brain", name: "मेंदू", pos: [0, 1.6, 0.1], type: "sphere", color: "#60a5fa" },
    { id: "heart", name: "हृदय", pos: [0, 0.3, 0.15], type: "sphere", color: "#f43f5e" },
    { id: "lungs", name: "फुफ्फुसे", pos: [0, 0.5, 0.05], type: "box", color: "#38bdf8" },
    { id: "stomach", name: "पचनसंस्था", pos: [0, -0.2, 0.1], type: "cylinder", color: "#fbbf24" },
  ] as const;

  const showSkeleton = activeLayers.includes("skeleton");
  const showOrgans = activeLayers.includes("organ");

  return (
    <group position={[0, -0.5, 0]}>
      
      {/* True 3D Human Body Model (Wireframe Hologram representing Skin/Skeleton) */}
      <React.Suspense fallback={
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1, 1, 4, 32]} />
          <meshStandardMaterial color="#06b6d4" wireframe transparent opacity={0.2} />
        </mesh>
      }>
        <Human3DModel 
          visible={showSkeleton || activeLayers.includes("skin") || activeLayers.includes("muscle")} 
          onClick={() => onSelectOrgan("body")}
        />
      </React.Suspense>

      {/* Interactive 3D Organs inside the body */}
      {showOrgans && parts.map((part) => (
        <group key={part.id} position={part.pos as [number, number, number]}>
          <mesh 
            onClick={(e) => {
              e.stopPropagation();
              onSelectOrgan(part.id);
            }}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}
          >
            {part.type === "sphere" && <sphereGeometry args={[0.15, 32, 32]} />}
            {part.type === "box" && <boxGeometry args={[0.3, 0.3, 0.2]} />}
            {part.type === "cylinder" && <cylinderGeometry args={[0.2, 0.2, 0.3, 32]} />}
            
            <meshStandardMaterial 
              color={selectedOrganId === part.id ? "#ffffff" : part.color} 
              emissive={part.color}
              emissiveIntensity={selectedOrganId === part.id ? 2 : 0.8}
              transparent
              opacity={selectedOrganId === part.id ? 1 : 0.8}
            />
          </mesh>
          
          {/* Subtle Label floating over unselected organs */}
          {selectedOrganId !== part.id && (
             <Html position={[0, 0.3, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
                <div className="bg-black/40 backdrop-blur-sm text-white/80 text-[10px] px-2 py-0.5 rounded-full font-marathi opacity-0 hover:opacity-100 transition-opacity">
                  {part.name}
                </div>
             </Html>
          )}
        </group>
      ))}
    </group>
  );
}
