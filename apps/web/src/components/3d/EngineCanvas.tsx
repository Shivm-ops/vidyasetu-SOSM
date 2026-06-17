"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Html, useProgress } from "@react-three/drei";

interface EngineCanvasProps {
  children: React.ReactNode;
  cameraPosition?: [number, number, number];
  enableZoom?: boolean;
  enablePan?: boolean;
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl min-w-[150px]">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-3"></div>
        <p className="text-brand-600 font-bold font-marathi">लोड होत आहे... {progress.toFixed(0)}%</p>
      </div>
    </Html>
  );
}

export function EngineCanvas({ 
  children, 
  cameraPosition = [0, 0, 5],
  enableZoom = true,
  enablePan = false
}: EngineCanvasProps) {
  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[600px] bg-gradient-to-b from-blue-50 to-indigo-50 rounded-3xl overflow-hidden border border-gray-200 shadow-inner relative">
      <Canvas
        shadows
        camera={{ position: cameraPosition, fov: 50 }}
        dpr={[1, 2]} // Optimize for mobile vs retina
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <Suspense fallback={<Loader />}>
          {/* Default Lighting for all modules */}
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1} 
            castShadow 
            shadow-mapSize-width={1024} 
            shadow-mapSize-height={1024} 
          />
          <Environment preset="city" />

          {/* Module Content */}
          {children}

          {/* Controls */}
          <OrbitControls 
            enableZoom={enableZoom} 
            enablePan={enablePan}
            makeDefault
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
