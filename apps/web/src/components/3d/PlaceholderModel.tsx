"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { Text } from "@react-three/drei";

interface PlaceholderModelProps {
  type: "sphere" | "box" | "cylinder";
  color?: string;
  label?: string;
  position?: [number, number, number];
  scale?: number;
  animate?: boolean;
}

export function PlaceholderModel({ 
  type, 
  color = "#4338ca", 
  label, 
  position = [0, 0, 0],
  scale = 1,
  animate = true
}: PlaceholderModelProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (animate && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.x += delta * 0.2;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} scale={scale} castShadow receiveShadow>
        {type === "sphere" && <sphereGeometry args={[1, 32, 32]} />}
        {type === "box" && <boxGeometry args={[1.5, 1.5, 1.5]} />}
        {type === "cylinder" && <cylinderGeometry args={[1, 1, 2, 32]} />}
        <meshStandardMaterial 
          color={color} 
          roughness={0.4} 
          metalness={0.1}
        />
      </mesh>
      
      {label && (
        <Text
          position={[0, scale + 0.5, 0]}
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="white"
        >
          {label}
        </Text>
      )}
    </group>
  );
}
