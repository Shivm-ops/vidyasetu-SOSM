"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Bot, Send, Sparkles, HelpCircle, Volume2, BookOpen, Lightbulb, Briefcase, Activity, ChevronRight, Star, X } from "lucide-react";

// ============================================================
// ANIMATED SVG DIAGRAMS
// ============================================================

function HeartDiagram({ onPartClick, activePart }: { onPartClick: (id: string) => void; activePart: string | null }) {
  return (
    <div className="relative w-full flex items-center justify-center" style={{ minHeight: 320 }}>
      <svg viewBox="0 0 320 320" className="w-full max-w-sm" style={{ maxHeight: 320 }}>
        <defs>
          <radialGradient id="heartGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ff6b8a" />
            <stop offset="100%" stopColor="#c0392b" />
          </radialGradient>
          <radialGradient id="blueBlood" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6baed6" />
            <stop offset="100%" stopColor="#2171b5" />
          </radialGradient>
          {/* Heartbeat animation */}
          <style>{`
            @keyframes beat { 0%,100%{transform:scale(1)} 25%{transform:scale(1.05)} 50%{transform:scale(0.97)} 75%{transform:scale(1.04)} }
            @keyframes flowRight { 0%{stroke-dashoffset:200} 100%{stroke-dashoffset:0} }
            @keyframes flowLeft { 0%{stroke-dashoffset:-200} 100%{stroke-dashoffset:0} }
            @keyframes pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
            .heart-beat { animation: beat 1s infinite ease-in-out; transform-origin: 160px 160px; }
            .flow-r { stroke-dasharray:200; animation: flowRight 2s linear infinite; }
            .flow-l { stroke-dasharray:200; animation: flowLeft 2s linear infinite; }
            .pulse-dot { animation: pulse 1s infinite; }
          `}</style>
        </defs>

        {/* Blood vessels — Aorta (top) */}
        <rect x="145" y="30" width="30" height="55" rx="15" fill="#e74c3c"
          className={`cursor-pointer transition-all ${activePart === "aorta" ? "opacity-100" : "opacity-80"}`}
          onClick={() => onPartClick("aorta")} />
        <text x="160" y="20" textAnchor="middle" fontSize="9" fill="#fca5a5" fontFamily="Noto Sans Devanagari,sans-serif">महाधमनी</text>

        {/* Pulmonary Artery (top-left) */}
        <path d="M 130 70 Q 90 50 70 40" stroke="#3b82f6" strokeWidth="16" fill="none" strokeLinecap="round"
          className={`cursor-pointer ${activePart === "pulmonary" ? "opacity-100" : "opacity-70"}`}
          onClick={() => onPartClick("pulmonary")} />
        <text x="75" y="30" textAnchor="middle" fontSize="8" fill="#93c5fd" fontFamily="Noto Sans Devanagari,sans-serif">फुफ्फुस धमनी</text>

        {/* Main heart body */}
        <g className="heart-beat">
          {/* Right Atrium */}
          <ellipse cx="110" cy="115" rx="45" ry="40" fill="#f87171"
            className={`cursor-pointer transition-all ${activePart === "right-atrium" ? "brightness-125" : ""}`}
            style={{ filter: activePart === "right-atrium" ? "drop-shadow(0 0 8px #f87171)" : "none" }}
            onClick={() => onPartClick("right-atrium")} />
          {/* Left Atrium */}
          <ellipse cx="210" cy="115" rx="45" ry="40" fill="#ef4444"
            className={`cursor-pointer transition-all ${activePart === "left-atrium" ? "brightness-125" : ""}`}
            style={{ filter: activePart === "left-atrium" ? "drop-shadow(0 0 8px #ef4444)" : "none" }}
            onClick={() => onPartClick("left-atrium")} />
          {/* Septum line */}
          <line x1="160" y1="80" x2="160" y2="200" stroke="#7f1d1d" strokeWidth="3" strokeDasharray="5,3" />
          {/* Right Ventricle */}
          <path d="M 70 145 Q 65 210 115 250 Q 155 270 160 265 L 160 160 Q 120 155 70 145 Z" fill="#dc2626"
            className={`cursor-pointer ${activePart === "right-ventricle" ? "brightness-125" : ""}`}
            style={{ filter: activePart === "right-ventricle" ? "drop-shadow(0 0 8px #dc2626)" : "none" }}
            onClick={() => onPartClick("right-ventricle")} />
          {/* Left Ventricle */}
          <path d="M 250 145 Q 255 210 205 250 Q 165 270 160 265 L 160 160 Q 200 155 250 145 Z" fill="#b91c1c"
            className={`cursor-pointer ${activePart === "left-ventricle" ? "brightness-125" : ""}`}
            style={{ filter: activePart === "left-ventricle" ? "drop-shadow(0 0 10px #b91c1c)" : "none" }}
            onClick={() => onPartClick("left-ventricle")} />
        </g>

        {/* Blood flow animation — Red (oxygenated) */}
        <circle r="5" fill="#ef4444" className="pulse-dot" opacity="0.9">
          <animateMotion dur="2s" repeatCount="indefinite" path="M 170 80 Q 200 60 210 75" />
        </circle>
        <circle r="4" fill="#ef4444" opacity="0.7">
          <animateMotion dur="2s" begin="0.5s" repeatCount="indefinite" path="M 170 80 Q 200 60 210 75" />
        </circle>
        {/* Blue (deoxygenated) */}
        <circle r="5" fill="#3b82f6" className="pulse-dot" opacity="0.9">
          <animateMotion dur="2.2s" repeatCount="indefinite" path="M 115 130 Q 130 145 160 160" />
        </circle>
        <circle r="4" fill="#3b82f6" opacity="0.7">
          <animateMotion dur="2.2s" begin="0.7s" repeatCount="indefinite" path="M 115 130 Q 130 145 160 160" />
        </circle>

        {/* Labels */}
        <text x="110" y="118" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold" fontFamily="Noto Sans Devanagari,sans-serif">उ. अट्रियम</text>
        <text x="210" y="118" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold" fontFamily="Noto Sans Devanagari,sans-serif">डा. अट्रियम</text>
        <text x="98" y="210" textAnchor="middle" fontSize="8" fill="#fecaca" fontFamily="Noto Sans Devanagari,sans-serif">उ. वेंट्रिकल</text>
        <text x="222" y="210" textAnchor="middle" fontSize="8" fill="#fecaca" fontFamily="Noto Sans Devanagari,sans-serif">डा. वेंट्रिकल</text>

        {/* Click hint */}
        <text x="160" y="305" textAnchor="middle" fontSize="9" fill="#6b7280" fontFamily="sans-serif">👆 भाग क्लिक करा</text>
      </svg>

      {/* Active part indicator */}
      {activePart && (
        <div className="absolute top-2 left-2 bg-red-500/20 border border-red-400/40 rounded-lg px-2 py-1 text-xs text-red-300 font-bold">
          ✓ निवडलेले
        </div>
      )}
    </div>
  );
}

function BrainDiagram({ onPartClick, activePart }: { onPartClick: (id: string) => void; activePart: string | null }) {
  return (
    <div className="relative w-full flex items-center justify-center" style={{ minHeight: 320 }}>
      <svg viewBox="0 0 320 300" className="w-full max-w-sm" style={{ maxHeight: 300 }}>
        <defs>
          <style>{`
            @keyframes glow { 0%,100%{opacity:0.6} 50%{opacity:1} }
            @keyframes spark { 0%{opacity:0;transform:scale(0)} 50%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(0)} }
            .neuron-pulse { animation: glow 1.5s infinite; }
            .spark { animation: spark 2s infinite; }
          `}</style>
          <radialGradient id="brainGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#f9a8d4" />
            <stop offset="100%" stopColor="#db2777" />
          </radialGradient>
        </defs>

        {/* Brain outline */}
        <ellipse cx="160" cy="145" rx="120" ry="100" fill="url(#brainGrad)" opacity="0.9" />
        {/* Brain stem */}
        <rect x="145" y="230" width="30" height="45" rx="15" fill="#be185d" />

        {/* Brain wrinkles / sulci */}
        {[
          "M 80 100 Q 100 85 120 100", "M 200 95 Q 220 80 240 95",
          "M 60 140 Q 85 125 110 140", "M 210 140 Q 235 125 260 140",
          "M 75 175 Q 100 160 125 175", "M 195 175 Q 220 160 245 175"
        ].map((d, i) => <path key={i} d={d} stroke="#f472b6" strokeWidth="2.5" fill="none" opacity="0.7" />)}

        {/* Midline */}
        <line x1="160" y1="60" x2="160" y2="230" stroke="#9d174d" strokeWidth="2.5" strokeDasharray="6,4" opacity="0.8" />

        {/* Frontal Lobe */}
        <ellipse cx="160" cy="90" rx="55" ry="30" fill="#f97316" opacity="0"
          className="cursor-pointer" onClick={() => onPartClick("frontal")} />
        <rect x="105" y="60" width="110" height="55" rx="10" fill="transparent"
          className="cursor-pointer" onClick={() => onPartClick("frontal")} />
        <text x="160" y="92" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold" fontFamily="sans-serif"
          className="pointer-events-none">Frontal</text>
        <circle cx="160" cy="82" r="18" fill="#f9731620" stroke="#f97316" strokeWidth="2"
          className={`cursor-pointer ${activePart === "frontal" ? "opacity-100" : "opacity-60"}`}
          style={{ filter: activePart === "frontal" ? "drop-shadow(0 0 8px #f97316)" : "none" }}
          onClick={() => onPartClick("frontal")} />

        {/* Temporal Lobe */}
        <circle cx="90" cy="155" r="22" fill="#06b6d420" stroke="#06b6d4" strokeWidth="2"
          className={`cursor-pointer ${activePart === "temporal" ? "opacity-100" : "opacity-60"}`}
          style={{ filter: activePart === "temporal" ? "drop-shadow(0 0 8px #06b6d4)" : "none" }}
          onClick={() => onPartClick("temporal")} />
        <text x="90" y="159" textAnchor="middle" fontSize="7" fill="#67e8f9" fontWeight="bold" fontFamily="sans-serif">Temporal</text>

        {/* Parietal Lobe */}
        <circle cx="230" cy="130" r="22" fill="#8b5cf620" stroke="#8b5cf6" strokeWidth="2"
          className={`cursor-pointer ${activePart === "parietal" ? "opacity-100" : "opacity-60"}`}
          style={{ filter: activePart === "parietal" ? "drop-shadow(0 0 8px #8b5cf6)" : "none" }}
          onClick={() => onPartClick("parietal")} />
        <text x="230" y="134" textAnchor="middle" fontSize="7" fill="#c4b5fd" fontWeight="bold" fontFamily="sans-serif">Parietal</text>

        {/* Cerebellum */}
        <ellipse cx="160" cy="210" rx="38" ry="22" fill="#10b98120" stroke="#10b981" strokeWidth="2"
          className={`cursor-pointer ${activePart === "cerebellum" ? "opacity-100" : "opacity-60"}`}
          style={{ filter: activePart === "cerebellum" ? "drop-shadow(0 0 8px #10b981)" : "none" }}
          onClick={() => onPartClick("cerebellum")} />
        <text x="160" y="213" textAnchor="middle" fontSize="7" fill="#6ee7b7" fontWeight="bold" fontFamily="sans-serif">Cerebellum</text>

        {/* Neural spark animations */}
        {[[120,100],[200,110],[150,150],[100,180]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r="3" fill="#fde68a" className="neuron-pulse"
            style={{ animationDelay: `${i*0.4}s` }} />
        ))}

        <text x="160" y="285" textAnchor="middle" fontSize="9" fill="#6b7280" fontFamily="sans-serif">👆 भाग क्लिक करा</text>
      </svg>
    </div>
  );
}

function LungsDiagram({ onPartClick, activePart }: { onPartClick: (id: string) => void; activePart: string | null }) {
  return (
    <div className="relative w-full flex items-center justify-center" style={{ minHeight: 320 }}>
      <svg viewBox="0 0 320 310" className="w-full max-w-sm" style={{ maxHeight: 310 }}>
        <defs>
          <style>{`
            @keyframes breathe { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(1.06)} }
            .breathing { animation: breathe 3s ease-in-out infinite; transform-origin: 160px 160px; }
          `}</style>
          <radialGradient id="lungGrad" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#2563eb" />
          </radialGradient>
        </defs>

        {/* Trachea */}
        <rect x="150" y="30" width="20" height="60" rx="10" fill="#60a5fa"
          className={`cursor-pointer ${activePart === "trachea" ? "opacity-100" : "opacity-80"}`}
          onClick={() => onPartClick("trachea")} />
        <text x="160" y="22" textAnchor="middle" fontSize="9" fill="#93c5fd" fontFamily="Noto Sans Devanagari,sans-serif">श्वासनलिका</text>

        {/* Bronchi split */}
        <path d="M 155 88 Q 110 100 100 120" stroke="#3b82f6" strokeWidth="10" fill="none" strokeLinecap="round"
          className="cursor-pointer" onClick={() => onPartClick("bronchi")} />
        <path d="M 165 88 Q 210 100 220 120" stroke="#3b82f6" strokeWidth="10" fill="none" strokeLinecap="round"
          className="cursor-pointer" onClick={() => onPartClick("bronchi")} />

        <g className="breathing">
          {/* Right lung (bigger) */}
          <path d="M 50 120 Q 40 160 55 200 Q 70 240 110 255 Q 130 260 145 240 L 148 110 Q 100 100 50 120 Z"
            fill="url(#lungGrad)" opacity="0.85"
            className={`cursor-pointer ${activePart === "right-lung" ? "brightness-125" : ""}`}
            style={{ filter: activePart === "right-lung" ? "drop-shadow(0 0 10px #3b82f6)" : "none" }}
            onClick={() => onPartClick("right-lung")} />
          {/* Left lung (smaller — heart space) */}
          <path d="M 270 120 Q 280 160 265 200 Q 250 240 210 255 Q 190 260 175 240 L 172 110 Q 220 100 270 120 Z"
            fill="url(#lungGrad)" opacity="0.8"
            className={`cursor-pointer ${activePart === "left-lung" ? "brightness-125" : ""}`}
            style={{ filter: activePart === "left-lung" ? "drop-shadow(0 0 10px #3b82f6)" : "none" }}
            onClick={() => onPartClick("left-lung")} />

          {/* Lobe lines */}
          <path d="M 65 155 Q 100 145 140 155" stroke="#1d4ed8" strokeWidth="1.5" fill="none" opacity="0.7" />
          <path d="M 60 195 Q 100 185 140 195" stroke="#1d4ed8" strokeWidth="1.5" fill="none" opacity="0.7" />
          <path d="M 180 170 Q 220 160 260 170" stroke="#1d4ed8" strokeWidth="1.5" fill="none" opacity="0.7" />

          {/* Air flow particles */}
          {[0,0.5,1,1.5].map((delay, i) => (
            <circle key={i} r="3" fill="#bfdbfe" opacity="0.8">
              <animateMotion dur="2s" begin={`${delay}s`} repeatCount="indefinite"
                path={i % 2 === 0 ? "M 155 88 Q 115 110 95 145" : "M 165 88 Q 205 110 225 145"} />
            </circle>
          ))}
        </g>

        {/* Labels */}
        <text x="95" y="185" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold" fontFamily="Noto Sans Devanagari,sans-serif">उजवे (3 लोब)</text>
        <text x="225" y="185" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold" fontFamily="Noto Sans Devanagari,sans-serif">डावे (2 लोब)</text>

        {/* O2 / CO2 indicators */}
        <rect x="60" y="260" width="40" height="18" rx="9" fill="#22c55e40" stroke="#22c55e" strokeWidth="1" />
        <text x="80" y="272" textAnchor="middle" fontSize="8" fill="#86efac" fontFamily="sans-serif">O₂ आत</text>
        <rect x="220" y="260" width="44" height="18" rx="9" fill="#ef444440" stroke="#ef4444" strokeWidth="1" />
        <text x="242" y="272" textAnchor="middle" fontSize="8" fill="#fca5a5" fontFamily="sans-serif">CO₂ बाहेर</text>

        <text x="160" y="295" textAnchor="middle" fontSize="9" fill="#6b7280" fontFamily="sans-serif">👆 भाग क्लिक करा</text>
      </svg>
    </div>
  );
}

function AtomDiagram({ onPartClick, activePart }: { onPartClick: (id: string) => void; activePart: string | null }) {
  return (
    <div className="relative w-full flex items-center justify-center" style={{ minHeight: 300 }}>
      <svg viewBox="0 0 300 300" className="w-full max-w-xs" style={{ maxHeight: 300 }}>
        <defs>
          <style>{`
            @keyframes orbit1 { from{transform:rotate(0deg) translateX(90px) rotate(0deg)} to{transform:rotate(360deg) translateX(90px) rotate(-360deg)} }
            @keyframes orbit2 { from{transform:rotate(120deg) translateX(80px) rotate(-120deg)} to{transform:rotate(480deg) translateX(80px) rotate(-480deg)} }
            @keyframes orbit3 { from{transform:rotate(240deg) translateX(70px) rotate(-240deg)} to{transform:rotate(600deg) translateX(70px) rotate(-600deg)} }
            @keyframes nucGlow { 0%,100%{filter:drop-shadow(0 0 4px #fbbf24)} 50%{filter:drop-shadow(0 0 12px #fbbf24)} }
            .orb1 { animation: orbit1 3s linear infinite; transform-origin: 150px 150px; }
            .orb2 { animation: orbit2 2.5s linear infinite; transform-origin: 150px 150px; }
            .orb3 { animation: orbit3 3.5s linear infinite; transform-origin: 150px 150px; }
            .nuc-glow { animation: nucGlow 2s ease-in-out infinite; }
          `}</style>
          <radialGradient id="nucGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#d97706" />
          </radialGradient>
        </defs>

        {/* Orbit paths */}
        <ellipse cx="150" cy="150" rx="90" ry="35" fill="none" stroke="#6366f1" strokeWidth="1.5" opacity="0.5" />
        <ellipse cx="150" cy="150" rx="80" ry="35" fill="none" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.5"
          transform="rotate(60 150 150)" />
        <ellipse cx="150" cy="150" rx="70" ry="35" fill="none" stroke="#ec4899" strokeWidth="1.5" opacity="0.5"
          transform="rotate(120 150 150)" />

        {/* Nucleus */}
        <circle cx="150" cy="150" r="22" fill="url(#nucGrad)" className="nuc-glow cursor-pointer"
          onClick={() => onPartClick("nucleus")}
          style={{ filter: activePart === "nucleus" ? "drop-shadow(0 0 16px #fbbf24)" : "drop-shadow(0 0 6px #fbbf24)" }} />
        {/* Proton & neutron markers */}
        <circle cx="143" cy="146" r="6" fill="#ef4444" opacity="0.9" className="cursor-pointer" onClick={() => onPartClick("proton")} />
        <circle cx="157" cy="154" r="6" fill="#6b7280" opacity="0.9" className="cursor-pointer" onClick={() => onPartClick("neutron")} />
        <text x="143" y="149" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">p+</text>
        <text x="157" y="157" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">n</text>

        {/* Orbiting electrons */}
        <g className="orb1">
          <circle cx="240" cy="150" r="7" fill="#6366f1" className="cursor-pointer"
            style={{ filter: "drop-shadow(0 0 4px #6366f1)" }}
            onClick={() => onPartClick("electron")} />
          <text x="240" y="153" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">e-</text>
        </g>
        <g className="orb2">
          <circle cx="230" cy="150" r="7" fill="#8b5cf6" className="cursor-pointer"
            style={{ filter: "drop-shadow(0 0 4px #8b5cf6)" }}
            onClick={() => onPartClick("electron")} />
          <text x="230" y="153" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">e-</text>
        </g>
        <g className="orb3">
          <circle cx="220" cy="150" r="7" fill="#ec4899" className="cursor-pointer"
            style={{ filter: "drop-shadow(0 0 4px #ec4899)" }}
            onClick={() => onPartClick("electron")} />
          <text x="220" y="153" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">e-</text>
        </g>

        {/* Labels */}
        <text x="150" y="153" textAnchor="middle" fontSize="8" fill="#fef3c7" fontWeight="bold" fontFamily="Noto Sans Devanagari,sans-serif">केंद्रक</text>
        <text x="150" y="285" textAnchor="middle" fontSize="9" fill="#6b7280" fontFamily="sans-serif">👆 भाग क्लिक करा</text>
      </svg>
    </div>
  );
}

function SolarSystemDiagram({ onPartClick, activePart }: { onPartClick: (id: string) => void; activePart: string | null }) {
  const planets = [
    { id: "mercury", name: "बुध", r: 40, color: "#94a3b8", size: 4, speed: "4s" },
    { id: "venus", name: "शुक्र", r: 60, color: "#fbbf24", size: 5, speed: "6s" },
    { id: "earth", name: "पृथ्वी", r: 82, color: "#3b82f6", size: 6, speed: "9s" },
    { id: "mars", name: "मंगळ", r: 105, color: "#ef4444", size: 5, speed: "12s" },
    { id: "jupiter", name: "बृहस्पती", r: 130, color: "#f97316", size: 11, speed: "20s" },
  ];
  return (
    <div className="relative w-full flex items-center justify-center" style={{ minHeight: 300 }}>
      <svg viewBox="0 0 300 300" className="w-full max-w-xs" style={{ maxHeight: 300 }}>
        <defs>
          <style>{planets.map((p, i) => `
            @keyframes orbit-${p.id} { from{transform:rotate(${i*72}deg) translateX(${p.r}px) rotate(-${i*72}deg)} to{transform:rotate(${360+i*72}deg) translateX(${p.r}px) rotate(-${360+i*72}deg)} }
            .orbit-${p.id} { animation: orbit-${p.id} ${p.speed} linear infinite; transform-origin: 150px 150px; }
          `).join("")}</style>
          <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#f97316" />
          </radialGradient>
        </defs>

        {/* Orbit rings */}
        {planets.map(p => (
          <circle key={p.id} cx="150" cy="150" r={p.r} fill="none" stroke="white" strokeWidth="0.5" opacity="0.2" />
        ))}

        {/* Sun */}
        <circle cx="150" cy="150" r="18" fill="url(#sunGrad)" className="cursor-pointer"
          style={{ filter: "drop-shadow(0 0 12px #f97316)" }}
          onClick={() => onPartClick("sun")} />
        <text x="150" y="154" textAnchor="middle" fontSize="7" fill="#7c2d12" fontWeight="bold" fontFamily="Noto Sans Devanagari,sans-serif">सूर्य</text>

        {/* Planets */}
        {planets.map(p => (
          <g key={p.id} className={`orbit-${p.id} cursor-pointer`} onClick={() => onPartClick(p.id)}>
            <circle cx={150 + p.r} cy="150" r={p.size} fill={p.color}
              style={{ filter: activePart === p.id ? `drop-shadow(0 0 8px ${p.color})` : "none" }} />
            {activePart !== p.id && (
              <text x={150 + p.r} y={150 - p.size - 3} textAnchor="middle" fontSize="6" fill={p.color} fontFamily="Noto Sans Devanagari,sans-serif">{p.name}</text>
            )}
          </g>
        ))}

        <text x="150" y="290" textAnchor="middle" fontSize="9" fill="#6b7280" fontFamily="sans-serif">👆 ग्रह क्लिक करा</text>
      </svg>
    </div>
  );
}

function EarthDiagram({ onPartClick, activePart }: { onPartClick: (id: string) => void; activePart: string | null }) {
  return (
    <div className="relative w-full flex items-center justify-center" style={{ minHeight: 300 }}>
      <svg viewBox="0 0 300 300" className="w-full max-w-xs" style={{ maxHeight: 300 }}>
        <defs>
          <style>{`
            @keyframes earthSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
            @keyframes cloudFloat { 0%,100%{transform:translateX(0)} 50%{transform:translateX(8px)} }
            .earth-spin { animation: earthSpin 20s linear infinite; transform-origin: 150px 150px; }
            .cloud-float { animation: cloudFloat 4s ease-in-out infinite; }
          `}</style>
          <radialGradient id="earthGrad" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </radialGradient>
          <clipPath id="earthClip">
            <circle cx="150" cy="150" r="100" />
          </clipPath>
        </defs>

        {/* Earth base */}
        <circle cx="150" cy="150" r="100" fill="url(#earthGrad)"
          style={{ filter: "drop-shadow(0 0 16px #3b82f6)" }} />

        {/* Continents (simplified) */}
        <g clipPath="url(#earthClip)" className="earth-spin">
          <ellipse cx="130" cy="130" rx="35" ry="28" fill="#22c55e" opacity="0.85" />
          <ellipse cx="180" cy="155" rx="28" ry="22" fill="#22c55e" opacity="0.8" />
          <ellipse cx="115" cy="170" rx="20" ry="15" fill="#22c55e" opacity="0.75" />
          <ellipse cx="195" cy="120" rx="18" ry="12" fill="#22c55e" opacity="0.7" />
          <ellipse cx="145" cy="195" rx="25" ry="12" fill="#16a34a" opacity="0.7" />
        </g>

        {/* Atmosphere ring */}
        <circle cx="150" cy="150" r="108" fill="none" stroke="#93c5fd" strokeWidth="5" opacity="0.3" />

        {/* Layers info */}
        <rect x="15" y="80" width="55" height="18" rx="9" fill="#3b82f620" stroke="#3b82f6" strokeWidth="1"
          className="cursor-pointer" onClick={() => onPartClick("ocean")} />
        <text x="42" y="92" textAnchor="middle" fontSize="8" fill="#93c5fd" fontFamily="Noto Sans Devanagari,sans-serif">71% पाणी</text>
        <line x1="70" y1="89" x2="100" y2="130" stroke="#3b82f6" strokeWidth="1" opacity="0.6" />

        <rect x="230" y="80" width="60" height="18" rx="9" fill="#22c55e20" stroke="#22c55e" strokeWidth="1"
          className="cursor-pointer" onClick={() => onPartClick("land")} />
        <text x="260" y="92" textAnchor="middle" fontSize="8" fill="#86efac" fontFamily="Noto Sans Devanagari,sans-serif">29% जमीन</text>
        <line x1="230" y1="89" x2="200" y2="130" stroke="#22c55e" strokeWidth="1" opacity="0.6" />

        <rect x="15" y="200" width="70" height="18" rx="9" fill="#8b5cf620" stroke="#8b5cf6" strokeWidth="1"
          className="cursor-pointer" onClick={() => onPartClick("atmosphere")} />
        <text x="50" y="212" textAnchor="middle" fontSize="8" fill="#c4b5fd" fontFamily="Noto Sans Devanagari,sans-serif">वातावरण</text>
        <line x1="85" y1="209" x2="110" y2="195" stroke="#8b5cf6" strokeWidth="1" opacity="0.6" />

        <text x="150" y="280" textAnchor="middle" fontSize="9" fill="#6b7280" fontFamily="sans-serif">👆 भाग क्लिक करा</text>
      </svg>
    </div>
  );
}

// ============================================================
// TOPIC DATA
// ============================================================

interface PartInfo {
  name: string;
  desc: string;
  fact: string;
}

interface TopicData {
  title: string;
  titleEn: string;
  emoji: string;
  bg: string;
  accent: string;
  diagram: React.ComponentType<{ onPartClick: (id: string) => void; activePart: string | null }>;
  parts: Record<string, PartInfo>;
  steps: string[];
  quiz: { q: string; options: string[]; answer: number }[];
  activities: { title: string; desc: string }[];
  careers: { role: string; path: string }[];
  skills: string[];
}

const TOPICS: Record<string, TopicData> = {
  heart: {
    title: "हृदय", titleEn: "Heart", emoji: "🫀",
    bg: "from-red-900 via-rose-950 to-slate-950",
    accent: "red",
    diagram: HeartDiagram,
    parts: {
      "right-atrium": { name: "उजवा अट्रियम (Right Atrium)", desc: "शरीरातून डिऑक्सिजनयुक्त रक्त स्वीकारतो आणि उजव्या वेंट्रिकलकडे पाठवतो.", fact: "हे हृदयाचा वरचा-उजवा कप्पा आहे." },
      "left-atrium": { name: "डावा अट्रियम (Left Atrium)", desc: "फुफ्फुसातून ऑक्सिजनयुक्त रक्त स्वीकारतो आणि डाव्या वेंट्रिकलकडे पाठवतो.", fact: "फुफ्फुसातून आलेले शुद्ध रक्त येथे येते." },
      "right-ventricle": { name: "उजवा वेंट्रिकल (Right Ventricle)", desc: "डिऑक्सिजनयुक्त रक्त फुफ्फुसाकडे पंप करतो.", fact: "हे फुफ्फुसाकडे रक्त पाठवणारे पंपिंग चेंबर आहे." },
      "left-ventricle": { name: "डावा वेंट्रिकल (Left Ventricle)", desc: "ऑक्सिजनयुक्त रक्त संपूर्ण शरीरात पंप करतो. सर्वात जाड भिंत असलेला कप्पा.", fact: "हा हृदयाचा सर्वात शक्तिशाली भाग आहे!" },
      "aorta": { name: "महाधमनी (Aorta)", desc: "शरीरातील सर्वात मोठी धमनी. डाव्या वेंट्रिकलमधून ऑक्सिजनयुक्त रक्त संपूर्ण शरीरात वाहून नेतो.", fact: "महाधमनीचा व्यास 2-3 सेंटीमीटर असतो." },
      "pulmonary": { name: "फुफ्फुस धमनी (Pulmonary Artery)", desc: "उजव्या वेंट्रिकलमधून डिऑक्सिजनयुक्त रक्त फुफ्फुसांकडे नेते.", fact: "ही एकमेव धमनी आहे जी डिऑक्सिजनयुक्त रक्त वाहून नेते." },
    },
    steps: [
      "हृदय हा एक शक्तिशाली स्नायू आहे जो आपले रक्त पंप करतो — दिवसाला सुमारे 1,00,000 वेळा!",
      "हृदयाचे 4 कप्पे असतात: 2 अट्रिया (वरचे) आणि 2 वेंट्रिकल (खालचे).",
      "उजव्या बाजूने डिऑक्सिजनयुक्त रक्त (निळे) फुफ्फुसांकडे जाते. फुफ्फुसात रक्त शुद्ध होते.",
      "डाव्या बाजूने ऑक्सिजनयुक्त रक्त (लाल) महाधमनीमार्गे संपूर्ण शरीरात जाते.",
      "हृदयाचा आकार तुमच्या मुठीएवढा असतो आणि वजन सुमारे 300 ग्रॅम असते.",
    ],
    quiz: [
      { q: "हृदयाचे किती कप्पे असतात?", options: ["2", "3", "4", "5"], answer: 2 },
      { q: "कोणता कप्पा संपूर्ण शरीरात रक्त पंप करतो?", options: ["उजवा अट्रियम", "डावा वेंट्रिकल", "उजवा वेंट्रिकल", "डावा अट्रियम"], answer: 1 },
      { q: "महाधमनी कोणत्या कप्प्यातून निघते?", options: ["उजव्या वेंट्रिकलमधून", "डाव्या अट्रियममधून", "डाव्या वेंट्रिकलमधून", "उजव्या अट्रियममधून"], answer: 2 },
    ],
    activities: [
      { title: "हृदयाचे ठोके मोजा", desc: "व्यायाम केल्यानंतर आणि आराम केल्यानंतर 1 मिनिटाचे ठोके मोजा. फरक नोंदवा." },
      { title: "मॉडेल बनवा", desc: "मातीने किंवा चिकणमातीने हृदयाचे 4 कप्पे असलेले मॉडेल तयार करा." },
    ],
    careers: [
      { role: "हृदयरोग तज्ज्ञ (Cardiologist)", path: "10वी → विज्ञान शाखा → MBBS → MD Cardiology" },
      { role: "हृदय शल्यचिकित्सक (Cardiac Surgeon)", path: "MBBS → MS → MCh Cardiac Surgery" },
      { role: "ECG तंत्रज्ञ", path: "12वी विज्ञान → B.Sc. Cardiac Technology" },
    ],
    skills: ["जैविक विज्ञान", "शरीरशास्त्र", "वैद्यकीय ज्ञान", "समस्या निराकरण"],
  },
  brain: {
    title: "मेंदू", titleEn: "Brain", emoji: "🧠",
    bg: "from-pink-900 via-fuchsia-950 to-slate-950",
    accent: "pink",
    diagram: BrainDiagram,
    parts: {
      frontal: { name: "पुढील लोब (Frontal Lobe)", desc: "निर्णय घेणे, व्यक्तिमत्व, भाषण आणि नियोजन यावर नियंत्रण ठेवतो.", fact: "मानव इतर प्राण्यांपेक्षा वेगळा असण्याचे कारण म्हणजे मोठा पुढील लोब!" },
      temporal: { name: "ऐहिक लोब (Temporal Lobe)", desc: "ऐकणे, बोलणे समजून घेणे आणि दीर्घकालीन स्मृती यासाठी जबाबदार.", fact: "संगीत ऐकणे आणि ओळखणे या लोबमुळे होते." },
      parietal: { name: "खंड लोब (Parietal Lobe)", desc: "स्पर्श, तापमान, वेदना या जाणिवांवर नियंत्रण. शरीराच्या जाणिवेसाठी महत्त्वाचा.", fact: "वाचन आणि अंकगणित या लोबशी संबंधित आहे." },
      cerebellum: { name: "अनुमस्तिष्क (Cerebellum)", desc: "शारीरिक संतुलन, हालचालींचे समन्वय आणि बारीक मोटर कौशल्ये नियंत्रित करतो.", fact: "तुम्ही सायकल चालवायला शिकता तेव्हा हा भाग वापरतो!" },
    },
    steps: [
      "मेंदू हे आपल्या शरीराचे सर्वोच्च नियंत्रण केंद्र आहे — जणू मुख्य संगणक!",
      "मेंदूत 86 अब्ज न्यूरॉन्स (चेतापेशी) असतात जे विद्युत संकेत पाठवतात.",
      "मेंदू 4 मुख्य लोब (विभाग) मध्ये विभागला जातो: Frontal, Parietal, Temporal आणि Occipital.",
      "डावा मेंदू भाषा आणि तर्कशक्ती नियंत्रित करतो; उजवा मेंदू सर्जनशीलता आणि भावना.",
      "मेंदू शरीराच्या केवळ 2% वजन असूनही 20% ऊर्जा वापरतो!",
    ],
    quiz: [
      { q: "मेंदूत किती न्यूरॉन्स असतात?", options: ["86 लाख", "86 कोटी", "86 अब्ज", "86 हजार"], answer: 2 },
      { q: "संतुलन राखणारा भाग कोणता?", options: ["पुढील लोब", "ऐहिक लोब", "अनुमस्तिष्क", "खंड लोब"], answer: 2 },
      { q: "भाषण नियंत्रण कोणता लोब करतो?", options: ["ऐहिक लोब", "पुढील लोब", "अनुमस्तिष्क", "खंड लोब"], answer: 1 },
    ],
    activities: [
      { title: "स्मृती खेळ", desc: "10 वस्तू 1 मिनिट पाहा, मग डोळे मिटून सर्व आठवा. किती आठवल्या?" },
      { title: "उजव्या-डाव्या हाताचा प्रयोग", desc: "तुमच्या न वापरत्या हाताने स्वतःचे नाव लिहा. मेंदू नवे काम कसे शिकतो ते अनुभवा." },
    ],
    careers: [
      { role: "न्यूरोलॉजिस्ट (Neurologist)", path: "12वी विज्ञान → MBBS → MD Neurology" },
      { role: "मानसशास्त्रज्ञ (Psychologist)", path: "12वी → BA/BSc Psychology → MA/MSc" },
      { role: "न्यूरोसायन्स संशोधक", path: "12वी → BSc → MSc Neuroscience → PhD" },
    ],
    skills: ["जैवरसायन", "न्यूरोसायन्स", "संगणकीय विचार", "संशोधन कौशल्ये"],
  },
  lungs: {
    title: "फुफ्फुसे", titleEn: "Lungs", emoji: "🫁",
    bg: "from-blue-900 via-sky-950 to-slate-950",
    accent: "blue",
    diagram: LungsDiagram,
    parts: {
      trachea: { name: "श्वासनलिका (Trachea)", desc: "घशापासून फुफ्फुसापर्यंत हवा नेणारी मुख्य नळी. 10-12 सेमी लांब.", fact: "श्वासनलिकेत C आकाराच्या उपास्थींची रचना असते." },
      bronchi: { name: "ब्रॉन्की (Bronchi)", desc: "श्वासनलिका दोन शाखांमध्ये विभागते — उजव्या आणि डाव्या फुफ्फुसाकडे.", fact: "उजवी ब्रॉन्की डाव्यापेक्षा रुंद आणि सरळ असते." },
      "right-lung": { name: "उजवे फुफ्फुस (Right Lung)", desc: "3 लोबमध्ये विभागलेले — Superior, Middle, Inferior. डाव्यापेक्षा मोठे.", fact: "उजवे फुफ्फुस डाव्यापेक्षा 10% मोठे असते." },
      "left-lung": { name: "डावे फुफ्फुस (Left Lung)", desc: "2 लोबमध्ये विभागलेले. हृदयासाठी 'Cardiac Notch' असल्याने लहान आहे.", fact: "हृदय डाव्या बाजूला असल्याने डावे फुफ्फुस थोडे लहान असते." },
      ocean: { name: "श्वसन कार्य", desc: "श्वास घेताना O₂ रक्तात जातो आणि CO₂ बाहेर टाकला जातो.", fact: "आपण दिवसाला सुमारे 20,000 वेळा श्वास घेतो!" },
      land: { name: "फुफ्फुसाचे क्षेत्र", desc: "फुफ्फुसाचे एकूण क्षेत्र 70 चौरस मीटर असते — टेनिस कोर्टाएवढे!", fact: "लाखो लहान हवेच्या पिशव्या (alveoli) यामुळे हे शक्य आहे." },
      atmosphere: { name: "वायुकोश (Alveoli)", desc: "अत्यंत लहान 300 मिलियन हवेच्या पिशव्या जेथे O₂-CO₂ ची देवाणघेवाण होते.", fact: "प्रत्येक alveolus चा व्यास फक्त 0.2 मिमी असतो!" },
    },
    steps: [
      "फुफ्फुसे हे श्वसनसंस्थेचे मुख्य अवयव आहेत — ते श्वास घेतात आणि रक्त शुद्ध करतात.",
      "उजवे फुफ्फुस 3 लोब आणि डावे 2 लोब मध्ये विभागले आहे (हृदयासाठी जागा).",
      "श्वास घेताना हवा श्वासनलिका → ब्रॉन्की → ब्रॉन्किओल्स → वायुकोश (Alveoli) मध्ये जाते.",
      "वायुकोशात O₂ रक्तात शोषले जाते आणि CO₂ बाहेर टाकले जाते.",
      "फुफ्फुसाचे एकूण क्षेत्र 70 चौरस मीटर — एका टेनिस कोर्टाएवढे!",
    ],
    quiz: [
      { q: "उजव्या फुफ्फुसाचे किती लोब असतात?", options: ["1", "2", "3", "4"], answer: 2 },
      { q: "O₂-CO₂ देवाणघेवाण कोठे होते?", options: ["ब्रॉन्की", "श्वासनलिका", "वायुकोश", "फुफ्फुस"], answer: 2 },
      { q: "फुफ्फुसाचे एकूण क्षेत्र किती?", options: ["7 चौ.मी.", "70 चौ.मी.", "700 चौ.मी.", "0.7 चौ.मी."], answer: 1 },
    ],
    activities: [
      { title: "फुगा प्रयोग", desc: "एका फुग्यात श्वास सोडा आणि दुसऱ्यात मेणबत्तीची हवा. CO₂ मेणबत्ती विझवतो का?" },
      { title: "श्वास क्षमता मोजा", desc: "एका मोठ्या बाटलीत पाणी भरून तोंडाने हवा सोडून किती पाणी बाहेर काढता येते ते मोजा." },
    ],
    careers: [
      { role: "फुफ्फुसरोग तज्ज्ञ (Pulmonologist)", path: "MBBS → MD Pulmonology" },
      { role: "श्वसनचिकित्सक (Respiratory Therapist)", path: "12वी → B.Sc. Respiratory Therapy" },
      { role: "वायू प्रदूषण संशोधक", path: "BSc → MSc Environmental Science" },
    ],
    skills: ["श्वसनशास्त्र", "शरीरक्रियाविज्ञान", "वैद्यकीय उपकरणे", "संशोधन"],
  },
  atom: {
    title: "अणू", titleEn: "Atom", emoji: "⚛️",
    bg: "from-violet-900 via-purple-950 to-slate-950",
    accent: "violet",
    diagram: AtomDiagram,
    parts: {
      nucleus: { name: "केंद्रक (Nucleus)", desc: "अणूचे केंद्र जेथे प्रोटॉन आणि न्यूट्रॉन असतात. अणूच्या एकूण वस्तुमानाचा 99.97% भाग येथे असतो.", fact: "केंद्रक अत्यंत लहान असतो — जर अणू फुटबॉलच्या मैदानाएवढा असता, केंद्रक मैदानाच्या मध्यभागी एका मार्बलएवढे असते!" },
      proton: { name: "प्रोटॉन (Proton)", desc: "केंद्रकात असणारा धन (+) चार्ज असलेला कण. प्रोटॉनची संख्या = अणुक्रमांक.", fact: "हायड्रोजनमध्ये फक्त 1 प्रोटॉन असतो — सर्वात साधा अणू!" },
      neutron: { name: "न्यूट्रॉन (Neutron)", desc: "केंद्रकात असणारा तटस्थ (0) चार्ज असलेला कण. प्रोटॉनपेक्षा थोडा जड.", fact: "न्यूट्रॉन अणूला स्थैर्य देतो — न्यूट्रॉनशिवाय हायड्रोजन वगळता बहुतेक अणू अस्थिर असतात." },
      electron: { name: "इलेक्ट्रॉन (Electron)", desc: "केंद्रकाभोवती कक्षेत फिरणारा ऋण (-) चार्ज असलेला कण. अत्यंत हलका.", fact: "इलेक्ट्रॉनचे वस्तुमान प्रोटॉनच्या फक्त 1/1836 आहे!" },
    },
    steps: [
      "अणू हे सर्व पदार्थांचे मूलभूत घटक आहेत — प्रत्येक वस्तू अणूंनी बनलेली आहे!",
      "अणूत 3 मूलभूत कण असतात: प्रोटॉन (+), न्यूट्रॉन (0) आणि इलेक्ट्रॉन (-).",
      "प्रोटॉन आणि न्यूट्रॉन केंद्रकात (Nucleus) असतात; इलेक्ट्रॉन बाहेर कक्षेत फिरतात.",
      "प्रोटॉनची संख्या = अणुक्रमांक (Atomic Number). हेच त्या मूलद्रव्याची ओळख असते.",
      "अणूचा आकार ~0.1 नॅनोमीटर असतो — इतका लहान की एका मानवी केसाच्या रुंदीत दशलक्ष अणू मावतात!",
    ],
    quiz: [
      { q: "अणूत ऋण (-) चार्ज असणारा कण कोणता?", options: ["प्रोटॉन", "न्यूट्रॉन", "इलेक्ट्रॉन", "फोटॉन"], answer: 2 },
      { q: "केंद्रकात कोणते कण असतात?", options: ["फक्त इलेक्ट्रॉन", "प्रोटॉन + न्यूट्रॉन", "फक्त प्रोटॉन", "सर्व कण"], answer: 1 },
      { q: "प्रोटॉनची संख्या = ?", options: ["आण्विक वस्तुमान", "अणुक्रमांक", "न्यूट्रॉन संख्या", "इलेक्ट्रॉन कक्षा"], answer: 1 },
    ],
    activities: [
      { title: "अणू मॉडेल बनवा", desc: "थर्मोकोल चेंडू, काठ्या आणि रंगाने हायड्रोजन (1p, 0n, 1e) चे मॉडेल तयार करा." },
      { title: "मूलद्रव्य कार्ड गेम", desc: "आवर्त सारणीतील 10 मूलद्रव्यांचे कार्ड बनवा — नाव, प्रतीक, अणुक्रमांक लिहा." },
    ],
    careers: [
      { role: "रसायनशास्त्रज्ञ (Chemist)", path: "12वी विज्ञान → BSc Chemistry → MSc/PhD" },
      { role: "अणुऊर्जा अभियंता", path: "12वी → B.Tech Nuclear Engineering → BARC" },
      { role: "फार्माकोलॉजिस्ट", path: "12वी → BSc/B.Pharm → MSc Pharmacology" },
    ],
    skills: ["रसायनशास्त्र", "भौतिकशास्त्र", "गणितीय विश्लेषण", "प्रयोगशाळा कौशल्ये"],
  },
  solar: {
    title: "सूर्यमाला", titleEn: "Solar System", emoji: "🪐",
    bg: "from-indigo-900 via-blue-950 to-slate-950",
    accent: "indigo",
    diagram: SolarSystemDiagram,
    parts: {
      sun: { name: "सूर्य (Sun)", desc: "आपल्या सूर्यमालेचे केंद्र. एक तारा जो प्रचंड उर्जा सोडतो.", fact: "सूर्यात 99.86% सूर्यमालेचे वस्तुमान आहे!" },
      mercury: { name: "बुध (Mercury)", desc: "सूर्याचा सर्वात जवळचा ग्रह. अत्यंत गरम दिवस आणि थंड रात्र.", fact: "बुधावर कोणतेही वातावरण नाही!" },
      venus: { name: "शुक्र (Venus)", desc: "पृथ्वीपेक्षा गरम — 465°C तापमान. घनदाट CO₂ वातावरण.", fact: "शुक्र सूर्यमालेतील सर्वात गरम ग्रह आहे, बुध नाही!" },
      earth: { name: "पृथ्वी (Earth)", desc: "जीवसृष्टी असलेला एकमेव ज्ञात ग्रह. 71% पृष्ठभाग पाण्याने व्यापला आहे.", fact: "पृथ्वी सूर्यापासून 15 कोटी किमी दूर आहे!" },
      mars: { name: "मंगळ (Mars)", desc: "लाल रंगाचा ग्रह. सौरमालेतील सर्वात उंच पर्वत येथे आहे — Olympus Mons.", fact: "मंगळावर 1 दिवस = 24 तास 37 मिनिटे!" },
      jupiter: { name: "बृहस्पती (Jupiter)", desc: "सूर्यमालेतील सर्वात मोठा ग्रह. 79+ चंद्र आहेत. प्रचंड वादळे.", fact: "पृथ्वी बृहस्पतीत 1,300 वेळा मावेल!" },
    },
    steps: [
      "आपली सूर्यमाला 4.6 अब्ज वर्षांपूर्वी तयार झाली. केंद्रस्थानी सूर्य आहे.",
      "सूर्यमालेत 8 ग्रह आहेत: बुध, शुक्र, पृथ्वी, मंगळ, बृहस्पती, शनी, युरेनस, नेपच्यून.",
      "पृथ्वी सूर्याभोवती 365.25 दिवसांत एक प्रदक्षिणा करते — हेच एक वर्ष!",
      "बृहस्पती सर्वात मोठा ग्रह आहे आणि शनीला सुंदर कड्या आहेत.",
      "सूर्यापासून प्रकाश पृथ्वीपर्यंत पोहोचण्यास 8 मिनिटे 20 सेकंद लागतात!",
    ],
    quiz: [
      { q: "सूर्यमालेत किती ग्रह आहेत?", options: ["7", "8", "9", "10"], answer: 1 },
      { q: "पृथ्वी कितवा ग्रह आहे?", options: ["1ला", "2रा", "3रा", "4था"], answer: 2 },
      { q: "सर्वात मोठा ग्रह कोणता?", options: ["शनी", "पृथ्वी", "बृहस्पती", "नेपच्यून"], answer: 2 },
    ],
    activities: [
      { title: "सूर्यमाला मॉडेल", desc: "चेंडूंचा वापर करून सूर्यमालेचे आकार-प्रमाण मॉडेल तयार करा. सूर्य = बास्केटबॉल, पृथ्वी = मटार." },
      { title: "ग्रहांची माहिती पुस्तिका", desc: "8 ग्रहांची माहिती गोळा करून एक सचित्र पुस्तिका तयार करा." },
    ],
    careers: [
      { role: "खगोलशास्त्रज्ञ (Astronomer)", path: "12वी गणित → BSc Physics/Astronomy → MSc/PhD" },
      { role: "ISRO अंतराळयान अभियंता", path: "12वी → B.Tech Aerospace Engineering → ISRO" },
      { role: "विज्ञान शिक्षक", path: "12वी → BSc → B.Ed → शाळेत शिक्षक" },
    ],
    skills: ["भौतिकशास्त्र", "गणित", "संगणकीय मॉडेलिंग", "वैज्ञानिक संशोधन"],
  },
  earth: {
    title: "पृथ्वी", titleEn: "Earth", emoji: "🌍",
    bg: "from-cyan-900 via-teal-950 to-slate-950",
    accent: "cyan",
    diagram: EarthDiagram,
    parts: {
      ocean: { name: "महासागर (Oceans)", desc: "पृथ्वीच्या 71% पृष्ठभागावर पाणी आहे. 5 मुख्य महासागर आहेत.", fact: "महासागर पृथ्वीच्या हवामान नियमनात महत्त्वपूर्ण भूमिका बजावतात!" },
      land: { name: "महाद्वीप (Continents)", desc: "पृथ्वीवर 7 महाद्वीप आहेत. 29% जमीन सर्व जीव-सृष्टीचे घर आहे.", fact: "सर्व महाद्वीप एकेकाळी एकत्र होते — Pangaea!" },
      atmosphere: { name: "वातावरण (Atmosphere)", desc: "5 थर: Troposphere, Stratosphere, Mesosphere, Thermosphere, Exosphere.", fact: "ओझोन थर सूर्याच्या हानिकारक UV किरणांपासून आपले संरक्षण करतो." },
    },
    steps: [
      "पृथ्वी आपल्या सूर्यमालेचा तिसरा ग्रह असून एकमेव जीवसृष्टी असलेला ग्रह आहे.",
      "पृथ्वीचा व्यास 12,742 किमी आणि वस्तुमान 5.97 × 10²⁴ किलोग्रॅम आहे.",
      "पृथ्वी 24 तासांत स्वतःभोवती एक प्रदक्षिणा करते — हेच दिवस-रात्र होण्याचे कारण!",
      "पृथ्वीवर 71% महासागर, 29% जमीन आणि संपूर्ण जीवसृष्टी वातावरणाने संरक्षित आहे.",
      "पृथ्वीचे अंतर्गत थर: भूकवच → आवरण → बाह्य गाभा → अंतर्गत गाभा (लोह-निकेल).",
    ],
    quiz: [
      { q: "पृथ्वीच्या पृष्ठभागावर किती % पाणी आहे?", options: ["50%", "60%", "71%", "85%"], answer: 2 },
      { q: "पृथ्वी स्वतःभोवती किती वेळात फिरते?", options: ["12 तास", "24 तास", "365 दिवस", "7 दिवस"], answer: 1 },
      { q: "पृथ्वीवर किती महाद्वीप आहेत?", options: ["5", "6", "7", "8"], answer: 2 },
    ],
    activities: [
      { title: "वातावरण थर मॉडेल", desc: "एका बाटलीत वेगवेगळ्या घनतेच्या द्रवांनी वातावरणाचे 5 थर दाखवा." },
      { title: "पृथ्वीचा नकाशा", desc: "महाद्वीप आणि महासागर रंगवून पृथ्वीचा सचित्र नकाशा तयार करा." },
    ],
    careers: [
      { role: "भूगर्भशास्त्रज्ञ (Geologist)", path: "12वी → BSc Geology → MSc/PhD" },
      { role: "पर्यावरण शास्त्रज्ञ", path: "BSc Environmental Science → MSc → NGO/सरकारी काम" },
      { role: "हवामान शास्त्रज्ञ (Meteorologist)", path: "BSc → MSc Meteorology → IMD" },
    ],
    skills: ["भूगोल", "पर्यावरण शास्त्र", "हवामान विश्लेषण", "नकाशाशास्त्र"],
  },
};

const SUGGESTIONS = [
  { text: "हृदय समजावून सांगा", key: "heart", emoji: "🫀" },
  { text: "मेंदू कसा काम करतो?", key: "brain", emoji: "🧠" },
  { text: "सूर्यमाला दाखवा", key: "solar", emoji: "🪐" },
  { text: "फुफ्फुसे म्हणजे काय?", key: "lungs", emoji: "🫁" },
  { text: "अणू समजावून सांगा", key: "atom", emoji: "⚛️" },
  { text: "पृथ्वी विषयी सांगा", key: "earth", emoji: "🌍" },
];

function detectTopic(input: string): string | null {
  const t = input.toLowerCase();
  if (t.includes("हृदय") || t.includes("heart")) return "heart";
  if (t.includes("मेंदू") || t.includes("brain")) return "brain";
  if (t.includes("फुफ्फुस") || t.includes("lung")) return "lungs";
  if (t.includes("सूर्यमाला") || t.includes("solar") || t.includes("ग्रह") || t.includes("planet")) return "solar";
  if (t.includes("अणू") || t.includes("atom")) return "atom";
  if (t.includes("पृथ्वी") || t.includes("earth")) return "earth";
  return null;
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function VisualTeacherPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [topicKey, setTopicKey] = useState<string | null>(null);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<"learn" | "quiz" | "activity" | "career">("learn");
  const [activePart, setActivePart] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const topicData = topicKey ? TOPICS[topicKey] : null;

  const ask = async (q?: string, key?: string) => {
    const query = q ?? input;
    if (!query.trim()) return;

    setLoading(true);
    setTopicKey(null);
    setNotFound(false);
    setVisibleSteps(0);
    setShowQuiz(false);
    setAnswers({});
    setQuizSubmitted(false);
    setActiveTab("learn");
    setActivePart(null);

    await new Promise(r => setTimeout(r, 1000));

    const detected = key ?? detectTopic(query);
    setLoading(false);

    if (!detected) {
      setNotFound(true);
      return;
    }

    setTopicKey(detected);
    const resp = TOPICS[detected];
    let i = 0;
    const reveal = () => {
      i++;
      setVisibleSteps(i);
      if (i < resp.steps.length) setTimeout(reveal, 600);
      else setTimeout(() => setShowQuiz(true), 700);
    };
    setTimeout(reveal, 300);
  };

  const score = quizSubmitted && topicData
    ? topicData.quiz.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0)
    : 0;

  const handlePartClick = (partId: string) => {
    setActivePart(prev => prev === partId ? null : partId);
  };

  const accentColors: Record<string, string> = {
    red: "from-red-500 to-rose-600",
    pink: "from-pink-500 to-fuchsia-600",
    blue: "from-blue-500 to-sky-600",
    violet: "from-violet-500 to-purple-600",
    indigo: "from-indigo-500 to-blue-600",
    cyan: "from-cyan-500 to-teal-600",
  };

  return (
    <div className={`min-h-screen font-marathi text-white flex flex-col transition-all duration-700 ${
      topicData ? `bg-gradient-to-br ${topicData.bg}` : "bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950"
    }`}>

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Link href="/classroom" className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Bot className="w-6 h-6 text-violet-400" />
          <div>
            <h1 className="text-lg font-bold leading-tight">AI व्हिज्युअल शिक्षक</h1>
            <p className="text-[11px] text-white/50">मराठीत विचारा — AI व्हिज्युअल डायग्रामसह शिकवेल</p>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-1.5 bg-violet-500/20 border border-violet-400/30 rounded-full px-3 py-1 text-xs font-bold text-violet-300">
            <Sparkles className="w-3 h-3" /> VISUAL LEARNING ENGINE
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-5 flex flex-col gap-5">

        {/* ── Search ── */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5">
          <div className="flex gap-2 mb-4">
            <input
              type="text" value={input} onChange={e => setInput(e.target.value)}
              placeholder="मला हृदय समजावून सांगा, सूर्यमाला दाखवा..."
              className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-400 font-medium"
              onKeyDown={e => e.key === "Enter" && ask()}
            />
            <motion.button onClick={() => ask()} disabled={loading || !input.trim()} whileTap={{ scale: 0.95 }}
              className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-bold px-5 py-3 rounded-2xl flex items-center gap-2 transition-colors">
              {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </motion.button>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map(s => (
              <button key={s.key} onClick={() => { setInput(s.text); ask(s.text, s.key); }}
                className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-violet-500/20 border border-white/20 hover:border-violet-400/40 text-white/70 hover:text-white px-3 py-1.5 rounded-full transition-all font-medium">
                {s.emoji} {s.text}
              </button>
            ))}
          </div>
        </div>

        {/* ── States ── */}
        <AnimatePresence mode="wait">

          {/* Loading */}
          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-10 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 bg-violet-500/20 rounded-full flex items-center justify-center">
                <Bot className="w-8 h-8 text-violet-400 animate-pulse" />
              </div>
              <p className="font-bold text-violet-200 text-lg">व्हिज्युअल डायग्राम तयार करत आहे...</p>
              <div className="flex gap-2">
                {[0,1,2].map(i => <div key={i} className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}} />)}
              </div>
            </motion.div>
          )}

          {/* Not found */}
          {notFound && !loading && (
            <motion.div key="notfound" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-center">
              <div className="text-5xl mb-3">🤔</div>
              <p className="font-bold text-white/70 text-lg">हा विषय अजून शिकतोय!</p>
              <p className="text-sm text-white/40 mt-2">खालीलपैकी एक विचारा:</p>
              <div className="flex flex-wrap gap-2 justify-center mt-3">
                {SUGGESTIONS.map(s => (
                  <button key={s.key} onClick={() => { setInput(s.text); ask(s.text, s.key); }}
                    className="text-sm bg-white/10 hover:bg-violet-500/20 border border-white/20 px-3 py-1.5 rounded-full text-white/70 hover:text-white transition-all">
                    {s.emoji} {s.text}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Empty state */}
          {!topicData && !loading && !notFound && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-14 flex flex-col items-center gap-5 text-center">
              <div className="text-7xl">🔬</div>
              <div>
                <p className="text-2xl font-extrabold text-white/90">मराठी व्हिज्युअल लर्निंग</p>
                <p className="text-white/50 mt-2 max-w-md mx-auto text-sm">
                  विषय लिहा किंवा वरील सुचना निवडा — AI लगेच इंटरएक्टिव्ह डायग्राम, स्पष्टीकरण आणि क्विझ देईल!
                </p>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {SUGGESTIONS.map(s => (
                  <button key={s.key} onClick={() => { setInput(s.text); ask(s.text, s.key); }}
                    className="bg-white/10 hover:bg-violet-500/20 border border-white/20 hover:border-violet-400/30 rounded-2xl p-3 flex flex-col items-center gap-1.5 transition-all group">
                    <span className="text-2xl group-hover:scale-110 transition-transform">{s.emoji}</span>
                    <span className="text-[10px] text-white/60 group-hover:text-white font-medium leading-tight text-center">{s.text.replace("समजावून सांगा","").replace("कसा काम करतो?","").replace("दाखवा","").replace("म्हणजे काय?","").replace("विषयी सांगा","").trim()}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── MAIN LEARNING VIEW ── */}
          {topicData && !loading && (
            <motion.div key={topicKey} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-5">

              {/* Topic title bar */}
              <div className={`bg-gradient-to-r ${accentColors[topicData.accent]} rounded-3xl px-6 py-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{topicData.emoji}</span>
                  <div>
                    <h2 className="text-xl font-extrabold">{topicData.title}</h2>
                    <p className="text-white/70 text-sm">{topicData.titleEn} — Interactive Visual Learning</p>
                  </div>
                </div>
                <button onClick={() => { setTopicKey(null); setInput(""); }}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Two-column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

                {/* LEFT: Diagram (spans 2 cols) */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                  <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-3xl p-4">
                    <p className="text-xs text-white/50 mb-3 text-center font-medium">🎨 इंटरएक्टिव्ह व्हिज्युअल डायग्राम</p>
                    <topicData.diagram onPartClick={handlePartClick} activePart={activePart} />
                  </div>

                  {/* Part info panel */}
                  <AnimatePresence>
                    {activePart && topicData.parts[activePart] && (
                      <motion.div key={activePart} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-3xl p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-bold text-white text-sm leading-tight">{topicData.parts[activePart].name}</h3>
                          <button onClick={() => setActivePart(null)} className="text-white/40 hover:text-white text-xs flex-shrink-0">✕</button>
                        </div>
                        <p className="text-sm text-white/75 leading-relaxed mb-2">{topicData.parts[activePart].desc}</p>
                        <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl px-3 py-2">
                          <p className="text-xs text-yellow-300">💡 {topicData.parts[activePart].fact}</p>
                        </div>
                      </motion.div>
                    )}
                    {!activePart && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="bg-black/20 border border-white/10 rounded-3xl p-4 text-center text-sm text-white/40">
                        वरील डायग्रामवर कोणताही भाग क्लिक करा — माहिती येथे दिसेल 👆
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* RIGHT: Tabs content (spans 3 cols) */}
                <div className="lg:col-span-3 flex flex-col gap-4">
                  {/* Tab bar */}
                  <div className="flex gap-1 bg-black/30 rounded-2xl p-1.5">
                    {[
                      { id: "learn", icon: BookOpen, label: "📚 शिका" },
                      { id: "quiz", icon: HelpCircle, label: "📝 क्विझ" },
                      { id: "activity", icon: Activity, label: "🧪 उपक्रम" },
                      { id: "career", icon: Briefcase, label: "🚀 करिअर" },
                    ].map(tab => (
                      <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 text-xs font-bold py-2 px-2 rounded-xl transition-all ${
                          activeTab === tab.id
                            ? `bg-gradient-to-r ${accentColors[topicData.accent]} text-white shadow-lg`
                            : "text-white/50 hover:text-white hover:bg-white/10"
                        }`}>
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab content */}
                  <AnimatePresence mode="wait">

                    {/* LEARN tab */}
                    {activeTab === "learn" && (
                      <motion.div key="learn" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                        className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-3xl p-5">
                        <h3 className="font-bold text-violet-300 mb-4 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" /> AI स्पष्टीकरण — {topicData.title}
                        </h3>
                        <div className="flex flex-col gap-3">
                          {topicData.steps.slice(0, visibleSteps).map((step, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                              className="flex gap-3 items-start bg-white/5 rounded-2xl p-3">
                              <span className={`w-6 h-6 shrink-0 bg-gradient-to-r ${accentColors[topicData.accent]} rounded-full flex items-center justify-center text-[11px] font-bold mt-0.5`}>{i+1}</span>
                              <p className="text-sm text-white/85 leading-relaxed">{step}</p>
                            </motion.div>
                          ))}
                          {visibleSteps < topicData.steps.length && (
                            <div className="flex gap-2 pl-1">
                              {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse" style={{animationDelay:`${i*0.2}s`}} />)}
                            </div>
                          )}
                        </div>

                        {/* Skills */}
                        <div className="mt-5 pt-4 border-t border-white/10">
                          <p className="text-xs font-bold text-white/50 mb-2">🚀 या विषयातून मिळणारी कौशल्ये</p>
                          <div className="flex flex-wrap gap-2">
                            {topicData.skills.map(s => (
                              <span key={s} className="text-xs bg-white/10 border border-white/20 px-3 py-1 rounded-full text-white/70">{s}</span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* QUIZ tab */}
                    {activeTab === "quiz" && (
                      <motion.div key="quiz" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                        className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-3xl p-5">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-orange-300">
                          <HelpCircle className="w-4 h-4" /> ज्ञान तपासा — {topicData.title}
                        </h3>

                        {!showQuiz ? (
                          <div className="text-center py-8">
                            <div className="text-4xl mb-3">⏳</div>
                            <p className="text-white/60 text-sm">स्पष्टीकरण पूर्ण झाल्यावर क्विझ उपलब्ध होईल...</p>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-5">
                            {topicData.quiz.map((q, qi) => (
                              <div key={qi} className="bg-white/5 rounded-2xl p-4">
                                <p className="text-sm font-bold text-white/90 mb-3">{qi+1}. {q.q}</p>
                                <div className="grid grid-cols-2 gap-2">
                                  {q.options.map((opt, oi) => {
                                    const sel = answers[qi] === oi;
                                    const correct = quizSubmitted && oi === q.answer;
                                    const wrong = quizSubmitted && sel && oi !== q.answer;
                                    return (
                                      <button key={oi} onClick={() => !quizSubmitted && setAnswers(a => ({...a, [qi]: oi}))}
                                        className={`text-xs font-medium py-2.5 px-3 rounded-xl border transition-all text-left ${
                                          correct ? "border-green-400 bg-green-500/20 text-green-300" :
                                          wrong ? "border-red-400 bg-red-500/20 text-red-300" :
                                          sel ? `border-white/60 bg-gradient-to-r ${accentColors[topicData.accent]} text-white` :
                                          "border-white/15 hover:border-white/40 text-white/65"
                                        }`}>
                                        {correct ? "✓ " : wrong ? "✗ " : ""}{opt}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                            {!quizSubmitted ? (
                              <button onClick={() => setQuizSubmitted(true)}
                                disabled={Object.keys(answers).length < topicData.quiz.length}
                                className={`w-full bg-gradient-to-r ${accentColors[topicData.accent]} disabled:opacity-40 text-white font-bold py-3 rounded-2xl transition-all text-sm shadow-lg`}>
                                उत्तरे तपासा →
                              </button>
                            ) : (
                              <div className={`p-4 rounded-2xl text-center ${score === topicData.quiz.length ? "bg-green-500/20 border border-green-400/30" : "bg-amber-500/20 border border-amber-400/30"}`}>
                                <div className="text-2xl mb-1">{score === topicData.quiz.length ? "🏆" : "📚"}</div>
                                <p className="font-bold text-lg">{score === topicData.quiz.length ? "शाब्बास! सर्व बरोबर!" : `${score}/${topicData.quiz.length} बरोबर`}</p>
                                {score < topicData.quiz.length && <p className="text-xs text-white/50 mt-1">स्पष्टीकरण पुन्हा वाचा आणि पुन्हा प्रयत्न करा</p>}
                                {score < topicData.quiz.length && (
                                  <button onClick={() => { setAnswers({}); setQuizSubmitted(false); }}
                                    className="mt-3 text-xs bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-full text-white/70 hover:text-white transition-all">
                                    पुन्हा प्रयत्न करा
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* ACTIVITY tab */}
                    {activeTab === "activity" && (
                      <motion.div key="activity" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                        className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-3xl p-5">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-emerald-300">
                          <Activity className="w-4 h-4" /> 🧪 हस्तक्रिया उपक्रम
                        </h3>
                        <div className="flex flex-col gap-4">
                          {topicData.activities.map((act, i) => (
                            <div key={i} className="bg-emerald-500/10 border border-emerald-400/20 rounded-2xl p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-emerald-400 text-lg">{["🔬","🧪","🔭","🎯"][i] || "⚗️"}</span>
                                <h4 className="font-bold text-emerald-300 text-sm">{act.title}</h4>
                              </div>
                              <p className="text-sm text-white/75 leading-relaxed">{act.desc}</p>
                            </div>
                          ))}

                          <div className="bg-amber-500/10 border border-amber-400/20 rounded-2xl p-4">
                            <h4 className="font-bold text-amber-300 text-sm mb-2">💡 प्रकल्प कल्पना</h4>
                            <p className="text-sm text-white/70">{topicData.title} वर एक सचित्र पुस्तिका तयार करा. सर्व भागांची नावे, कार्ये आणि मराठी माहिती लिहा.</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* CAREER tab */}
                    {activeTab === "career" && (
                      <motion.div key="career" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                        className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-3xl p-5">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-blue-300">
                          <Briefcase className="w-4 h-4" /> 🎯 करिअर संधी
                        </h3>
                        <p className="text-xs text-white/50 mb-4">{topicData.title} विषयाचा अभ्यास करून या उत्कृष्ट करिअरच्या वाटा उघडतात:</p>
                        <div className="flex flex-col gap-3">
                          {topicData.careers.map((c, i) => (
                            <div key={i} className="bg-blue-500/10 border border-blue-400/20 rounded-2xl p-4 hover:border-blue-400/40 transition-colors">
                              <div className="flex items-center gap-2 mb-2">
                                <Star className="w-4 h-4 text-blue-400" />
                                <h4 className="font-bold text-white text-sm">{c.role}</h4>
                              </div>
                              <div className="flex flex-wrap items-center gap-1">
                                {c.path.split("→").map((step, j, arr) => (
                                  <React.Fragment key={j}>
                                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-lg">{step.trim()}</span>
                                    {j < arr.length - 1 && <ChevronRight className="w-3 h-3 text-blue-500" />}
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 bg-gradient-to-r from-violet-500/20 to-blue-500/20 border border-violet-400/20 rounded-2xl p-4">
                          <p className="text-xs text-violet-300 font-bold mb-1">🌟 विद्यासेतू करिअर मार्गदर्शन</p>
                          <p className="text-xs text-white/60">या करिअर पर्यायांसाठी विशेष मार्गदर्शन, शिष्यवृत्ती माहिती आणि प्रश्नोत्तरे AI कडून मिळवा.</p>
                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
