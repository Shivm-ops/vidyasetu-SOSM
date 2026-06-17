"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, FlaskConical, BookOpen, HelpCircle, Lightbulb } from "lucide-react";

// ─────────────────────────────────────────────────────────────
//  INLINE SVG DIAGRAMS (no 3D / WebGL dependency)
// ─────────────────────────────────────────────────────────────

function HeartSVG() {
  const [active, setActive] = useState<string | null>(null);
  const parts = [
    { id: "la", cx: 195, cy: 108, rx: 38, ry: 32, fill: "#ef4444", label: "डा. अट्रियम" },
    { id: "ra", cx: 118, cy: 108, rx: 38, ry: 32, fill: "#f87171", label: "उ. अट्रियम" },
  ];
  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 320 300" className="w-full" style={{ maxHeight: 240 }}>
        <defs>
          <style>{`@keyframes hbeat{0%,100%{transform:scale(1)}40%{transform:scale(1.04)}70%{transform:scale(0.97)}}.hbeat{animation:hbeat 1s infinite;transform-origin:160px 150px;}`}</style>
        </defs>
        <rect x="148" y="30" width="24" height="50" rx="12" fill="#e74c3c" className="cursor-pointer" onClick={() => setActive(active==="aorta"?null:"aorta")} style={{filter:active==="aorta"?"drop-shadow(0 0 6px #e74c3c)":undefined}} />
        <path d="M135 65 Q100 50 78 42" stroke="#3b82f6" strokeWidth="13" fill="none" strokeLinecap="round" className="cursor-pointer" onClick={() => setActive(active==="pa"?null:"pa")} style={{filter:active==="pa"?"drop-shadow(0 0 6px #3b82f6)":undefined}} />
        <g className="hbeat">
          <ellipse cx="118" cy="108" rx="40" ry="33" fill="#f87171" className="cursor-pointer" onClick={() => setActive(active==="ra"?null:"ra")} style={{filter:active==="ra"?"drop-shadow(0 0 8px #f87171)":undefined}} />
          <ellipse cx="202" cy="108" rx="40" ry="33" fill="#ef4444" className="cursor-pointer" onClick={() => setActive(active==="la"?null:"la")} style={{filter:active==="la"?"drop-shadow(0 0 8px #ef4444)":undefined}} />
          <line x1="160" y1="78" x2="160" y2="195" stroke="#7f1d1d" strokeWidth="2.5" strokeDasharray="5,3" />
          <path d="M72 138 Q65 200 112 242 Q148 262 160 258 L160 158 Q118 150 72 138Z" fill="#dc2626" className="cursor-pointer" onClick={() => setActive(active==="rv"?null:"rv")} style={{filter:active==="rv"?"drop-shadow(0 0 8px #dc2626)":undefined}} />
          <path d="M248 138 Q255 200 208 242 Q172 262 160 258 L160 158 Q202 150 248 138Z" fill="#b91c1c" className="cursor-pointer" onClick={() => setActive(active==="lv"?null:"lv")} style={{filter:active==="lv"?"drop-shadow(0 0 10px #b91c1c)":undefined}} />
        </g>
        <circle r="4" fill="#ef4444" opacity="0.9"><animateMotion dur="1.8s" repeatCount="indefinite" path="M 165 75 Q 195 55 205 80" /></circle>
        <circle r="3" fill="#3b82f6" opacity="0.9"><animateMotion dur="2s" repeatCount="indefinite" path="M 118 125 Q 130 140 155 155" /></circle>
        <text x="118" y="111" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold" fontFamily="Noto Sans Devanagari,sans-serif">उ. अट्रियम</text>
        <text x="202" y="111" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold" fontFamily="Noto Sans Devanagari,sans-serif">डा. अट्रियम</text>
        <text x="100" y="205" textAnchor="middle" fontSize="7" fill="#fecaca" fontFamily="Noto Sans Devanagari,sans-serif">उ. वेंट्रिकल</text>
        <text x="220" y="205" textAnchor="middle" fontSize="7" fill="#fecaca" fontFamily="Noto Sans Devanagari,sans-serif">डा. वेंट्रिकल</text>
        <text x="160" y="32" textAnchor="middle" fontSize="7" fill="#fca5a5" fontFamily="Noto Sans Devanagari,sans-serif">महाधमनी</text>
        <text x="72" y="35" textAnchor="middle" fontSize="7" fill="#93c5fd" fontFamily="Noto Sans Devanagari,sans-serif">फु. धमनी</text>
        <text x="160" y="285" textAnchor="middle" fontSize="8" fill="#6b7280" fontFamily="sans-serif">👆 भाग क्लिक करा</text>
      </svg>
      <AnimatePresence>
        {active && (
          <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}
            className="text-xs text-center text-white/80 bg-red-500/20 border border-red-400/30 rounded-xl px-3 py-2 w-full">
            {active === "ra" && "उजवा अट्रियम — शरीरातून डिऑक्सिजनयुक्त रक्त स्वीकारतो."}
            {active === "la" && "डावा अट्रियम — फुफ्फुसातून ऑक्सिजनयुक्त रक्त स्वीकारतो."}
            {active === "rv" && "उजवा वेंट्रिकल — रक्त फुफ्फुसाकडे पंप करतो."}
            {active === "lv" && "डावा वेंट्रिकल — संपूर्ण शरीरात रक्त पंप करतो. सर्वात शक्तिशाली!"}
            {active === "aorta" && "महाधमनी — शरीरातील सर्वात मोठी रक्तवाहिनी."}
            {active === "pa" && "फुफ्फुस धमनी — डिऑक्सिजनयुक्त रक्त फुफ्फुसाकडे नेते."}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BrainSVG() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 300 280" className="w-full" style={{ maxHeight: 240 }}>
        <defs><style>{`@keyframes nglow{0%,100%{opacity:0.5}50%{opacity:1}}.nglow{animation:nglow 1.5s infinite;}`}</style></defs>
        <ellipse cx="150" cy="140" rx="118" ry="98" fill="#fda4af" opacity="0.9" />
        <rect x="143" y="228" width="14" height="30" rx="7" fill="#be185d" />
        {["M 80 100 Q100 85 118 100","M 182 95 Q202 80 220 95","M 62 135 Q84 122 108 135","M 192 135 Q216 122 238 135","M 70 170 Q95 157 118 170","M 182 170 Q207 157 232 170"].map((d,i)=><path key={i} d={d} stroke="#f472b6" strokeWidth="2.5" fill="none" opacity="0.7"/>)}
        <line x1="150" y1="50" x2="150" y2="228" stroke="#9d174d" strokeWidth="2" strokeDasharray="6,4" opacity="0.8"/>
        <circle cx="150" cy="82" r="20" fill="#f9731620" stroke="#f97316" strokeWidth="2"
          className={`cursor-pointer ${active==="frontal"?"opacity-100":"opacity-60"}`}
          style={{filter:active==="frontal"?"drop-shadow(0 0 8px #f97316)":undefined}}
          onClick={()=>setActive(active==="frontal"?null:"frontal")}/>
        <text x="150" y="86" textAnchor="middle" fontSize="7" fill="#fed7aa" fontFamily="sans-serif">Frontal</text>
        <circle cx="85" cy="152" r="20" fill="#06b6d420" stroke="#06b6d4" strokeWidth="2"
          className={`cursor-pointer ${active==="temporal"?"opacity-100":"opacity-60"}`}
          style={{filter:active==="temporal"?"drop-shadow(0 0 8px #06b6d4)":undefined}}
          onClick={()=>setActive(active==="temporal"?null:"temporal")}/>
        <text x="85" y="156" textAnchor="middle" fontSize="6" fill="#67e8f9" fontFamily="sans-serif">Temporal</text>
        <circle cx="215" cy="130" r="20" fill="#8b5cf620" stroke="#8b5cf6" strokeWidth="2"
          className={`cursor-pointer ${active==="parietal"?"opacity-100":"opacity-60"}`}
          style={{filter:active==="parietal"?"drop-shadow(0 0 8px #8b5cf6)":undefined}}
          onClick={()=>setActive(active==="parietal"?null:"parietal")}/>
        <text x="215" y="134" textAnchor="middle" fontSize="6" fill="#c4b5fd" fontFamily="sans-serif">Parietal</text>
        <ellipse cx="150" cy="205" rx="34" ry="18" fill="#10b98120" stroke="#10b981" strokeWidth="2"
          className={`cursor-pointer ${active==="cerebellum"?"opacity-100":"opacity-60"}`}
          style={{filter:active==="cerebellum"?"drop-shadow(0 0 8px #10b981)":undefined}}
          onClick={()=>setActive(active==="cerebellum"?null:"cerebellum")}/>
        <text x="150" y="209" textAnchor="middle" fontSize="6" fill="#6ee7b7" fontFamily="sans-serif">Cerebellum</text>
        {[[118,100],[182,110],[140,145],[100,175]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="3" fill="#fde68a" className="nglow" style={{animationDelay:`${i*0.4}s`}}/>
        ))}
        <text x="150" y="268" textAnchor="middle" fontSize="8" fill="#6b7280" fontFamily="sans-serif">👆 भाग क्लिक करा</text>
      </svg>
      <AnimatePresence>
        {active && (
          <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}
            className="text-xs text-center text-white/80 bg-pink-500/20 border border-pink-400/30 rounded-xl px-3 py-2 w-full">
            {active === "frontal" && "पुढील लोब — निर्णय, व्यक्तिमत्व, भाषण नियंत्रण करतो."}
            {active === "temporal" && "ऐहिक लोब — ऐकणे आणि दीर्घकालीन स्मृतीसाठी."}
            {active === "parietal" && "खंड लोब — स्पर्श, तापमान जाणीव आणि वाचन."}
            {active === "cerebellum" && "अनुमस्तिष्क — संतुलन आणि हालचालींचे समन्वय."}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AtomSVG() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 280 280" className="w-full" style={{ maxHeight: 240 }}>
        <defs>
          <style>{`
            @keyframes o1{from{transform:rotate(0deg) translateX(85px) rotate(0deg)}to{transform:rotate(360deg) translateX(85px) rotate(-360deg)}}
            @keyframes o2{from{transform:rotate(120deg) translateX(75px) rotate(-120deg)}to{transform:rotate(480deg) translateX(75px) rotate(-480deg)}}
            @keyframes o3{from{transform:rotate(240deg) translateX(65px) rotate(-240deg)}to{transform:rotate(600deg) translateX(65px) rotate(-600deg)}}
            @keyframes ng{0%,100%{filter:drop-shadow(0 0 4px #fbbf24)}50%{filter:drop-shadow(0 0 12px #fbbf24)}}
            .ao1{animation:o1 3s linear infinite;transform-origin:140px 140px}
            .ao2{animation:o2 2.5s linear infinite;transform-origin:140px 140px}
            .ao3{animation:o3 3.5s linear infinite;transform-origin:140px 140px}
            .ng{animation:ng 2s ease-in-out infinite}
          `}</style>
          <radialGradient id="ng2" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fcd34d"/><stop offset="100%" stopColor="#d97706"/></radialGradient>
        </defs>
        <ellipse cx="140" cy="140" rx="85" ry="33" fill="none" stroke="#6366f1" strokeWidth="1.5" opacity="0.5"/>
        <ellipse cx="140" cy="140" rx="75" ry="33" fill="none" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.5" transform="rotate(60 140 140)"/>
        <ellipse cx="140" cy="140" rx="65" ry="33" fill="none" stroke="#ec4899" strokeWidth="1.5" opacity="0.5" transform="rotate(120 140 140)"/>
        <circle cx="140" cy="140" r="22" fill="url(#ng2)" className="ng cursor-pointer" onClick={()=>setActive(active==="nucleus"?null:"nucleus")} style={{filter:active==="nucleus"?"drop-shadow(0 0 16px #fbbf24)":"drop-shadow(0 0 6px #fbbf24)"}}/>
        <circle cx="133" cy="136" r="6" fill="#ef4444" opacity="0.9" className="cursor-pointer" onClick={()=>setActive(active==="proton"?null:"proton")}/>
        <circle cx="147" cy="144" r="6" fill="#6b7280" opacity="0.9" className="cursor-pointer" onClick={()=>setActive(active==="neutron"?null:"neutron")}/>
        <text x="133" y="139" textAnchor="middle" fontSize="5.5" fill="white" fontWeight="bold">p+</text>
        <text x="147" y="147" textAnchor="middle" fontSize="5.5" fill="white" fontWeight="bold">n</text>
        <g className="ao1 cursor-pointer" onClick={()=>setActive(active==="electron"?null:"electron")}>
          <circle cx="225" cy="140" r="7" fill="#6366f1" style={{filter:"drop-shadow(0 0 4px #6366f1)"}}/>
          <text x="225" y="143" textAnchor="middle" fontSize="5.5" fill="white" fontWeight="bold">e-</text>
        </g>
        <g className="ao2 cursor-pointer" onClick={()=>setActive(active==="electron"?null:"electron")}>
          <circle cx="215" cy="140" r="7" fill="#8b5cf6" style={{filter:"drop-shadow(0 0 4px #8b5cf6)"}}/>
          <text x="215" y="143" textAnchor="middle" fontSize="5.5" fill="white" fontWeight="bold">e-</text>
        </g>
        <g className="ao3 cursor-pointer" onClick={()=>setActive(active==="electron"?null:"electron")}>
          <circle cx="205" cy="140" r="7" fill="#ec4899" style={{filter:"drop-shadow(0 0 4px #ec4899)"}}/>
          <text x="205" y="143" textAnchor="middle" fontSize="5.5" fill="white" fontWeight="bold">e-</text>
        </g>
        <text x="140" y="143" textAnchor="middle" fontSize="7" fill="#fef3c7" fontWeight="bold" fontFamily="Noto Sans Devanagari,sans-serif">केंद्रक</text>
        <text x="140" y="270" textAnchor="middle" fontSize="8" fill="#6b7280" fontFamily="sans-serif">👆 भाग क्लिक करा</text>
      </svg>
      <AnimatePresence>
        {active && (
          <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}
            className="text-xs text-center text-white/80 bg-violet-500/20 border border-violet-400/30 rounded-xl px-3 py-2 w-full">
            {active === "nucleus" && "केंद्रक — अणूचे केंद्र. प्रोटॉन (+) आणि न्यूट्रॉन (0) येथे असतात."}
            {active === "proton" && "प्रोटॉन — धन (+) चार्ज. संख्या = अणुक्रमांक."}
            {active === "neutron" && "न्यूट्रॉन — तटस्थ (0). अणूला स्थैर्य देतो."}
            {active === "electron" && "इलेक्ट्रॉन — ऋण (-) चार्ज. केंद्रकाभोवती कक्षेत फिरतो."}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PhotosynthesisSVG() {
  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 300 280" className="w-full" style={{ maxHeight: 240 }}>
        <defs>
          <style>{`
            @keyframes sun-ray{0%,100%{opacity:0.5;transform:scale(1)}50%{opacity:1;transform:scale(1.1)}}
            @keyframes bubble{0%{cy:200;opacity:1}100%{cy:60;opacity:0}}
            .sray{animation:sun-ray 2s ease-in-out infinite;transform-origin:240px 60px}
          `}</style>
          <radialGradient id="leafG" cx="50%" cy="30%" r="70%"><stop offset="0%" stopColor="#86efac"/><stop offset="100%" stopColor="#15803d"/></radialGradient>
        </defs>
        {/* Sun */}
        <circle cx="240" cy="60" r="28" fill="#fef08a" style={{filter:"drop-shadow(0 0 10px #f97316)"}} className="sray"/>
        {[[265,40],[265,80],[240,35],[218,42],[218,78],[242,85]].map(([x,y],i)=>(
          <line key={i} x1="240" y1="60" x2={x} y2={y} stroke="#fbbf24" strokeWidth="2" opacity="0.7" className="sray" style={{animationDelay:`${i*0.15}s`}}/>
        ))}
        <text x="240" y="64" textAnchor="middle" fontSize="7" fill="#92400e" fontWeight="bold">☀️ सूर्यप्रकाश</text>
        {/* Arrows from sun to leaf */}
        <path d="M 220 75 L 175 130" stroke="#fbbf24" strokeWidth="2" strokeDasharray="5,3" markerEnd="url(#arr)"/>
        <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" stroke="#fbbf24" fill="none" strokeWidth="1.5"/></marker></defs>
        {/* Leaf */}
        <ellipse cx="140" cy="155" rx="80" ry="50" fill="url(#leafG)" opacity="0.92" transform="rotate(-15 140 155)"/>
        {/* Leaf veins */}
        <path d="M 75 165 Q 140 140 205 150" stroke="#15803d" strokeWidth="2" fill="none"/>
        <path d="M 100 155 Q 130 130 145 110" stroke="#15803d" strokeWidth="1.5" fill="none" opacity="0.7"/>
        <path d="M 165 155 Q 180 130 190 115" stroke="#15803d" strokeWidth="1.5" fill="none" opacity="0.7"/>
        <path d="M 115 168 Q 120 190 108 210" stroke="#15803d" strokeWidth="1.5" fill="none" opacity="0.7"/>
        <path d="M 155 165 Q 162 188 155 210" stroke="#15803d" strokeWidth="1.5" fill="none" opacity="0.7"/>
        {/* CO2 input */}
        <rect x="18" y="140" width="50" height="20" rx="10" fill="#6b728020" stroke="#6b7280" strokeWidth="1.5"/>
        <text x="43" y="153" textAnchor="middle" fontSize="8" fill="#d1d5db" fontFamily="sans-serif">CO₂ + H₂O</text>
        <path d="M 68 150 L 88 155" stroke="#6b7280" strokeWidth="2" strokeDasharray="4,3" markerEnd="url(#arr2)"/>
        <defs><marker id="arr2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" stroke="#6b7280" fill="none" strokeWidth="1.5"/></marker></defs>
        {/* O2 bubbles output */}
        <circle r="4" fill="#bfdbfe" opacity="0"><animate attributeName="cy" from="160" to="60" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/><animateMotion dur="2s" repeatCount="indefinite" path="M 185 155 Q 220 100 240 80"/></circle>
        <circle r="3" fill="#bfdbfe" opacity="0"><animateMotion dur="2s" begin="0.7s" repeatCount="indefinite" path="M 175 155 Q 215 105 235 85"/><animate attributeName="opacity" values="0;1;0" dur="2s" begin="0.7s" repeatCount="indefinite"/></circle>
        <text x="245" y="95" textAnchor="middle" fontSize="7" fill="#93c5fd" fontFamily="sans-serif">O₂ बाहेर</text>
        {/* Glucose output */}
        <rect x="68" y="215" width="60" height="20" rx="10" fill="#fde68a20" stroke="#fbbf24" strokeWidth="1.5"/>
        <text x="98" y="228" textAnchor="middle" fontSize="8" fill="#fcd34d" fontFamily="sans-serif">ग्लुकोज तयार</text>
        <path d="M 120 205 L 110 215" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4,3"/>
        <text x="150" y="265" textAnchor="middle" fontSize="8" fill="#6b7280" fontFamily="sans-serif">प्रकाशसंश्लेषण प्रक्रिया</text>
      </svg>
    </div>
  );
}

function WaterCycleSVG() {
  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 300 270" className="w-full" style={{ maxHeight: 240 }}>
        <defs>
          <style>{`
            @keyframes rain{0%{transform:translateY(0);opacity:1}100%{transform:translateY(40px);opacity:0}}
            @keyframes evap{0%{transform:translateY(0);opacity:0.8}100%{transform:translateY(-40px);opacity:0}}
            .rain{animation:rain 1.5s linear infinite}
            .evap{animation:evap 2s linear infinite}
          `}</style>
          <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1e40af"/><stop offset="100%" stopColor="#93c5fd30"/></linearGradient>
          <radialGradient id="sunG2" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fef08a"/><stop offset="100%" stopColor="#f59e0b"/></radialGradient>
        </defs>
        {/* Sky background */}
        <rect x="0" y="0" width="300" height="200" rx="12" fill="url(#skyG)" opacity="0.3"/>
        {/* Sun */}
        <circle cx="255" cy="45" r="22" fill="url(#sunG2)" style={{filter:"drop-shadow(0 0 8px #f97316)"}}/>
        {/* Cloud */}
        <g>
          <ellipse cx="95" cy="65" rx="45" ry="22" fill="white" opacity="0.85"/>
          <ellipse cx="68" cy="72" rx="28" ry="18" fill="white" opacity="0.85"/>
          <ellipse cx="122" cy="72" rx="28" ry="18" fill="white" opacity="0.85"/>
          <text x="95" y="69" textAnchor="middle" fontSize="8" fill="#1e40af" fontWeight="bold">☁️ बाष्पीभवन</text>
        </g>
        {/* Rain drops */}
        {[78,92,106,120].map((x,i)=>(
          <line key={i} x1={x} y1="92" x2={x-3} y2="110" stroke="#60a5fa" strokeWidth="1.5" className="rain" style={{animationDelay:`${i*0.3}s`}}/>
        ))}
        {/* Mountain */}
        <polygon points="160,200 220,100 280,200" fill="#374151" opacity="0.8"/>
        <polygon points="210,200 255,130 300,200" fill="#4b5563" opacity="0.7"/>
        {/* Snow cap */}
        <polygon points="220,100 210,130 230,130" fill="white" opacity="0.9"/>
        {/* River */}
        <path d="M 220 180 Q 180 195 140 205 Q 100 215 40 220" stroke="#3b82f6" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.8"/>
        {/* Ocean */}
        <ellipse cx="50" cy="230" rx="50" ry="20" fill="#1d4ed8" opacity="0.7"/>
        <text x="50" y="234" textAnchor="middle" fontSize="7" fill="#bfdbfe">महासागर</text>
        {/* Evaporation dots */}
        {[30,45,60].map((x,i)=>(
          <circle key={i} cx={x} cy="210" r="3" fill="#60a5fa" opacity="0.8" className="evap" style={{animationDelay:`${i*0.5}s`}}/>
        ))}
        {/* Labels */}
        <text x="255" y="49" textAnchor="middle" fontSize="7" fill="#92400e" fontWeight="bold">☀️</text>
        <text x="220" y="250" textAnchor="middle" fontSize="7" fill="#9ca3af" fontFamily="sans-serif">पर्वत / हिमवर्षाव</text>
        <text x="255" y="185" textAnchor="middle" fontSize="7" fill="#d1d5db" fontFamily="sans-serif">पर्जन्य ↓</text>
        <text x="20" y="200" textAnchor="middle" fontSize="7" fill="#93c5fd" fontFamily="sans-serif">↑ बाष्प</text>
        <text x="150" y="260" textAnchor="middle" fontSize="8" fill="#6b7280" fontFamily="sans-serif">पाण्याचे चक्र (Water Cycle)</text>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────────────────────

interface TabData {
  id: string;
  label: string;
  subtitle: string;
  emoji: string;
  bg: string;
  accent: string;
  diagram: React.ComponentType;
  facts: string[];
  quiz: { q: string; options: string[]; answer: number }[];
}

const TABS: TabData[] = [
  {
    id: "heart", label: "🫀 हृदय", subtitle: "Heart", emoji: "🫀",
    bg: "from-red-600 to-rose-700", accent: "red",
    diagram: HeartSVG,
    facts: [
      "हृदय दिवसाला सुमारे 1,00,000 वेळा धडधडते",
      "हृदयाचे वजन सुमारे 300 ग्रॅम — तुमच्या मुठीएवढे",
      "4 कप्पे: 2 अट्रिया + 2 वेंट्रिकल",
      "महाधमनी शरीरातील सर्वात मोठी रक्तवाहिनी",
    ],
    quiz: [
      { q: "हृदयाचे किती कप्पे?", options: ["2","3","4","6"], answer: 2 },
      { q: "डावा वेंट्रिकल काय करतो?", options: ["रक्त साठवतो","शरीरात रक्त पाठवतो","फुफ्फुसात पाठवतो","ऑक्सिजन देतो"], answer: 1 },
    ],
  },
  {
    id: "brain", label: "🧠 मेंदू", subtitle: "Brain", emoji: "🧠",
    bg: "from-pink-600 to-fuchsia-700", accent: "pink",
    diagram: BrainSVG,
    facts: [
      "86 अब्ज न्यूरॉन्स असतात",
      "शरीराच्या 20% ऊर्जा वापरतो",
      "डावा भाग भाषा, उजवा सर्जनशीलता नियंत्रित करतो",
      "अनुमस्तिष्क संतुलन राखतो",
    ],
    quiz: [
      { q: "मेंदूत किती न्यूरॉन्स?", options: ["86 लाख","86 कोटी","86 अब्ज","86 हजार"], answer: 2 },
      { q: "संतुलन कोण राखतो?", options: ["पुढील लोब","ऐहिक लोब","अनुमस्तिष्क","खंड लोब"], answer: 2 },
    ],
  },
  {
    id: "atom", label: "⚛️ अणू", subtitle: "Atom", emoji: "⚛️",
    bg: "from-violet-600 to-purple-700", accent: "violet",
    diagram: AtomSVG,
    facts: [
      "प्रोटॉन (+), न्यूट्रॉन (0), इलेक्ट्रॉन (-) तीन मूलभूत कण",
      "अणू व्यास ~0.1 नॅनोमीटर",
      "प्रोटॉन संख्या = अणुक्रमांक",
      "केंद्रकात 99.97% वस्तुमान",
    ],
    quiz: [
      { q: "ऋण (-) चार्ज कण कोणता?", options: ["प्रोटॉन","न्यूट्रॉन","इलेक्ट्रॉन","फोटॉन"], answer: 2 },
      { q: "प्रोटॉन = ?", options: ["आण्विक वस्तुमान","अणुक्रमांक","इलेक्ट्रॉन","न्यूट्रॉन"], answer: 1 },
    ],
  },
  {
    id: "photosynthesis", label: "🌿 प्रकाशसंश्लेषण", subtitle: "Photosynthesis", emoji: "🌿",
    bg: "from-green-600 to-emerald-700", accent: "green",
    diagram: PhotosynthesisSVG,
    facts: [
      "CO₂ + H₂O + सूर्यप्रकाश → ग्लुकोज + O₂",
      "पानांतील क्लोरोफिल प्रकाश शोषतो",
      "ग्लुकोज वनस्पतींचे अन्न आहे",
      "O₂ उत्पादन — मानवी जीवनाचा आधार",
    ],
    quiz: [
      { q: "प्रकाशसंश्लेषणात काय तयार होते?", options: ["CO₂","H₂O","ग्लुकोज","N₂"], answer: 2 },
      { q: "प्रकाश शोषण कोण करते?", options:["मुळे","क्लोरोफिल","फळे","साल"], answer: 1 },
    ],
  },
  {
    id: "watercycle", label: "💧 पाण्याचे चक्र", subtitle: "Water Cycle", emoji: "💧",
    bg: "from-cyan-600 to-blue-700", accent: "cyan",
    diagram: WaterCycleSVG,
    facts: [
      "बाष्पीभवन → संघनन → पर्जन्यवर्षा → प्रवाह",
      "सूर्याची उष्णता चक्र चालवते",
      "पाण्याचे प्रमाण पृथ्वीवर स्थिर असते",
      "दरवर्षी 5,05,000 km³ पाणी बाष्पीभवन होते",
    ],
    quiz: [
      { q: "बाष्पीभवन कशामुळे होते?", options: ["पाऊस","सूर्याची उष्णता","वारा","हिम"], answer: 1 },
      { q: "ढगातून पाणी खाली पडणे?", options: ["बाष्पीभवन","संघनन","पर्जन्य","प्रवाह"], answer: 2 },
    ],
  },
  {
    id: "lungs", label: "🫁 फुफ्फुसे", subtitle: "Lungs", emoji: "🫁",
    bg: "from-blue-600 to-sky-700", accent: "blue",
    diagram: () => (
      <svg viewBox="0 0 280 260" className="w-full" style={{ maxHeight: 220 }}>
        <defs>
          <style>{`@keyframes brth{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.07)}}.brth{animation:brth 3s ease-in-out infinite;transform-origin:140px 145px;}`}</style>
          <radialGradient id="lgG" cx="50%" cy="50%" r="60%"><stop offset="0%" stopColor="#93c5fd"/><stop offset="100%" stopColor="#2563eb"/></radialGradient>
        </defs>
        <rect x="133" y="25" width="14" height="45" rx="7" fill="#60a5fa"/>
        <path d="M137 68 Q108 78 98 100" stroke="#3b82f6" strokeWidth="8" fill="none" strokeLinecap="round"/>
        <path d="M143 68 Q172 78 182 100" stroke="#3b82f6" strokeWidth="8" fill="none" strokeLinecap="round"/>
        <g className="brth">
          <path d="M 45 105 Q 35 145 50 188 Q 65 228 100 240 Q 120 248 134 230 L136 98 Q 92 88 45 105Z" fill="url(#lgG)" opacity="0.85"/>
          <path d="M 235 105 Q 245 145 230 188 Q 215 228 180 240 Q 160 248 146 230 L144 98 Q 188 88 235 105Z" fill="url(#lgG)" opacity="0.8"/>
        </g>
        <text x="90" y="170" textAnchor="middle" fontSize="7.5" fill="white" fontWeight="bold" fontFamily="Noto Sans Devanagari,sans-serif">उजवे (3 लोब)</text>
        <text x="190" y="170" textAnchor="middle" fontSize="7.5" fill="white" fontWeight="bold" fontFamily="Noto Sans Devanagari,sans-serif">डावे (2 लोब)</text>
        <rect x="52" y="242" width="36" height="14" rx="7" fill="#22c55e30" stroke="#22c55e" strokeWidth="1"/>
        <text x="70" y="252" textAnchor="middle" fontSize="7" fill="#86efac" fontFamily="sans-serif">O₂ आत</text>
        <rect x="192" y="242" width="40" height="14" rx="7" fill="#ef444430" stroke="#ef4444" strokeWidth="1"/>
        <text x="212" y="252" textAnchor="middle" fontSize="7" fill="#fca5a5" fontFamily="sans-serif">CO₂ बाहेर</text>
        <text x="140" y="20" textAnchor="middle" fontSize="8" fill="#93c5fd" fontFamily="Noto Sans Devanagari,sans-serif">श्वासनलिका</text>
      </svg>
    ),
    facts: [
      "उजवे फुफ्फुस 3 लोब, डावे 2 लोब",
      "फुफ्फुसाचे क्षेत्र 70 चौ.मी. — टेनिस कोर्टाएवढे",
      "दिवसाला 20,000 वेळा श्वास",
      "लाखो alveoli मध्ये O₂-CO₂ देवाणघेवाण",
    ],
    quiz: [
      { q: "उजव्या फुफ्फुसाचे किती लोब?", options: ["1","2","3","4"], answer: 2 },
      { q: "O₂-CO₂ देवाणघेवाण कोठे?", options: ["ब्रॉन्की","श्वासनलिका","वायुकोश","फुफ्फुस"], answer: 2 },
    ],
  },
];

export default function ScienceLabPage() {
  const [activeId, setActiveId] = useState("heart");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [activeView, setActiveView] = useState<"diagram" | "facts" | "quiz">("diagram");

  const tab = TABS.find(t => t.id === activeId)!;

  const handleTabChange = (id: string) => {
    setActiveId(id);
    setAnswers({});
    setSubmitted(false);
    setActiveView("diagram");
  };

  const score = submitted ? tab.quiz.reduce((a, q, i) => a + (answers[i] === q.answer ? 1 : 0), 0) : 0;

  const accentBorderMap: Record<string, string> = {
    red: "border-red-400/50",
    pink: "border-pink-400/50",
    violet: "border-violet-400/50",
    green: "border-green-400/50",
    cyan: "border-cyan-400/50",
    blue: "border-blue-400/50",
  };

  return (
    <div className="min-h-screen bg-slate-950 font-marathi text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <Link href="/classroom" className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <FlaskConical className="w-6 h-6 text-rose-400" />
          <div>
            <h1 className="text-lg font-bold">विज्ञान व्हिज्युअल लॅब</h1>
            <p className="text-[11px] text-white/50">Interactive Visual Science Lab — मराठीत शिका</p>
          </div>
        </div>
      </header>

      {/* Topic tabs */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 border-b border-white/10 bg-black/20" style={{ scrollbarWidth: "none" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => handleTabChange(t.id)}
            className={`shrink-0 px-4 py-2 rounded-2xl text-sm font-bold transition-all border ${
              activeId === t.id
                ? `bg-gradient-to-br ${t.bg} text-white border-white/20 shadow-lg`
                : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white"
            }`}>
            {t.label}
            <span className="block text-[10px] font-normal opacity-70">{t.subtitle}</span>
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-5">
        <AnimatePresence mode="wait">
          <motion.div key={activeId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* LEFT: Diagram */}
            <div className={`bg-black/30 backdrop-blur-sm border ${accentBorderMap[tab.accent] || "border-white/10"} rounded-3xl p-5`}>
              <div className={`bg-gradient-to-br ${tab.bg} rounded-2xl px-4 py-2 flex items-center gap-2 mb-4`}>
                <span className="text-xl">{tab.emoji}</span>
                <div>
                  <h2 className="font-extrabold">{tab.label}</h2>
                  <p className="text-white/70 text-xs">{tab.subtitle} — Interactive Visual Diagram</p>
                </div>
              </div>
              <tab.diagram />
            </div>

            {/* RIGHT: Info + Quiz */}
            <div className="flex flex-col gap-4">
              {/* View selector */}
              <div className="flex gap-1 bg-black/30 rounded-2xl p-1.5">
                {[
                  { id: "diagram", icon: BookOpen, label: "📚 माहिती" },
                  { id: "facts", icon: Lightbulb, label: "💡 तथ्ये" },
                  { id: "quiz", icon: HelpCircle, label: "📝 क्विझ" },
                ].map(v => (
                  <button key={v.id} onClick={() => setActiveView(v.id as any)}
                    className={`flex-1 text-xs font-bold py-2 rounded-xl transition-all ${
                      activeView === v.id
                        ? `bg-gradient-to-r ${tab.bg} text-white shadow-lg`
                        : "text-white/50 hover:text-white hover:bg-white/10"
                    }`}>
                    {v.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {/* FACTS */}
                {activeView === "diagram" || activeView === "facts" ? (
                  <motion.div key="facts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="bg-black/30 border border-white/10 rounded-3xl p-5">
                    <h3 className="font-bold mb-4 text-white/80">{tab.label} — महत्त्वाची माहिती</h3>
                    <ul className="flex flex-col gap-3">
                      {tab.facts.map((f, i) => (
                        <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-3 bg-white/5 rounded-2xl p-3">
                          <span className={`w-6 h-6 shrink-0 bg-gradient-to-r ${tab.bg} rounded-full flex items-center justify-center text-[11px] font-bold`}>{i+1}</span>
                          <p className="text-sm text-white/85">{f}</p>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                ) : null}

                {/* QUIZ */}
                {activeView === "quiz" && (
                  <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="bg-black/30 border border-white/10 rounded-3xl p-5">
                    <h3 className="font-bold mb-4 text-orange-300 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" /> ज्ञान चाचणी
                    </h3>
                    <div className="flex flex-col gap-4">
                      {tab.quiz.map((q, qi) => (
                        <div key={qi} className="bg-white/5 rounded-2xl p-4">
                          <p className="text-sm font-bold text-white/90 mb-3">{qi+1}. {q.q}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {q.options.map((opt, oi) => {
                              const sel = answers[qi] === oi;
                              const correct = submitted && oi === q.answer;
                              const wrong = submitted && sel && oi !== q.answer;
                              return (
                                <button key={oi} onClick={() => !submitted && setAnswers(a => ({...a, [qi]: oi}))}
                                  className={`text-xs py-2.5 px-3 rounded-xl border transition-all text-left font-medium ${
                                    correct ? "border-green-400 bg-green-500/20 text-green-300" :
                                    wrong ? "border-red-400 bg-red-500/20 text-red-300" :
                                    sel ? `border-white/60 bg-gradient-to-r ${tab.bg} text-white` :
                                    "border-white/15 hover:border-white/40 text-white/65"
                                  }`}>
                                  {correct ? "✓ " : wrong ? "✗ " : ""}{opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                      {!submitted ? (
                        <button onClick={() => setSubmitted(true)}
                          disabled={Object.keys(answers).length < tab.quiz.length}
                          className={`w-full bg-gradient-to-r ${tab.bg} disabled:opacity-40 text-white font-bold py-3 rounded-2xl text-sm`}>
                          उत्तरे तपासा →
                        </button>
                      ) : (
                        <div className={`p-4 rounded-2xl text-center ${score === tab.quiz.length ? "bg-green-500/20 border border-green-400/30" : "bg-amber-500/20 border border-amber-400/30"}`}>
                          <p className="font-bold text-lg">{score === tab.quiz.length ? "🏆 शाब्बास!" : `${score}/${tab.quiz.length} बरोबर`}</p>
                          {score < tab.quiz.length && (
                            <button onClick={() => { setAnswers({}); setSubmitted(false); }}
                              className="mt-2 text-xs text-white/60 hover:text-white underline">
                              पुन्हा प्रयत्न करा
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Voice guide card */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-4 flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${tab.bg} rounded-2xl flex items-center justify-center shrink-0`}>
                  <span className="text-lg">{tab.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white/80">🔊 मराठी व्हॉइस गाइड</p>
                  <p className="text-xs text-white/40">AI कडून श्रव्य स्पष्टीकरण मिळवा</p>
                </div>
                <button className="shrink-0 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors">
                  ▶ ऐका
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
