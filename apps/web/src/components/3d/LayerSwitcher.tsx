"use client";

import React from "react";
import { Layers } from "lucide-react";

interface LayerSwitcherProps {
  activeLayers: string[];
  onChange: (layers: string[]) => void;
}

export function LayerSwitcher({ activeLayers, onChange }: LayerSwitcherProps) {
  const layers = [
    { id: "skin", name: "त्वचा (Skin)" },
    { id: "muscle", name: "स्नायू (Muscle)" },
    { id: "skeleton", name: "सांगाडा (Skeleton)" },
    { id: "organ", name: "अवयव (Organs)" },
    { id: "nervous", name: "मज्जासंस्था (Nervous)" },
    { id: "circulatory", name: "रक्ताभिसरण (Circulatory)" }
  ];

  const toggleLayer = (id: string) => {
    if (activeLayers.includes(id)) {
      // Don't allow unselecting everything
      if (activeLayers.length === 1) return;
      onChange(activeLayers.filter(l => l !== id));
    } else {
      onChange([...activeLayers, id]);
    }
  };

  return (
    <div className="absolute left-4 top-20 z-10 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-gray-100 hidden sm:block">
      <div className="flex items-center gap-2 mb-3 px-1 text-gray-800 border-b pb-2">
        <Layers className="w-4 h-4 text-brand-500" />
        <h3 className="font-bold text-sm font-marathi">स्तर (Layers)</h3>
      </div>
      <div className="flex flex-col gap-2">
        {layers.map((layer) => {
          const isActive = activeLayers.includes(layer.id);
          return (
            <button
              key={layer.id}
              onClick={() => toggleLayer(layer.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-marathi transition-all text-left ${
                isActive 
                  ? "bg-brand-500 text-white font-medium shadow-md shadow-brand-200" 
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div className={`w-3 h-3 rounded-full border-2 ${isActive ? "border-white bg-white" : "border-gray-400 bg-transparent"}`} />
              {layer.name}
            </button>
          )
        })}
      </div>
    </div>
  );
}
