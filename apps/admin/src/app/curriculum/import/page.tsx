"use client";

import React, { useState } from "react";
import { Upload, CheckCircle, AlertTriangle, FileJson, Database } from "lucide-react";
import { api } from "@/lib/api";

export default function CurriculumImporter() {
  const [jsonText, setJsonText] = useState("");
  const [status, setStatus] = useState<"IDLE" | "VALIDATING" | "IMPORTING" | "SUCCESS" | "ERROR">("IDLE");
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState<any>(null);

  const handleValidate = () => {
    setStatus("VALIDATING");
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed.classes || !Array.isArray(parsed.classes)) {
        throw new Error("Invalid schema: Root must contain a 'classes' array.");
      }
      setStatus("IDLE");
      setMessage("JSON is valid! Ready to import.");
    } catch (e: any) {
      setStatus("ERROR");
      setMessage("Invalid JSON format: " + e.message);
    }
  };

  const handleImport = async () => {
    try {
      setStatus("IMPORTING");
      const parsed = JSON.parse(jsonText);
      const res = await api.post("/curriculum/import", parsed);
      
      setStatus("SUCCESS");
      setMessage("Curriculum imported successfully!");
      setStats(res.data.data);
    } catch (e: any) {
      setStatus("ERROR");
      setMessage(e.response?.data?.message || e.message || "Failed to import");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-marathi">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Database className="w-6 h-6 text-indigo-600" />
              अभ्यासक्रम आयात (Curriculum Intelligence Importer)
            </h1>
            <p className="text-gray-500 mt-1">
              Bulk import structured JSON for Phase 4 Content Intelligence Engine.
            </p>
          </div>
        </header>

        <main className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="font-bold text-gray-700 flex items-center gap-2">
              <FileJson className="w-5 h-5 text-gray-400" />
              JSON Payload
            </h2>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleValidate}
                className="px-4 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Validate JSON
              </button>
              <button 
                onClick={handleImport}
                disabled={status === "IMPORTING" || !jsonText.trim()}
                className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Run Bulk Import
              </button>
            </div>
          </div>

          <div className="p-6">
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="w-full h-96 p-4 font-mono text-sm bg-gray-900 text-green-400 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder='{\n  "classes": [\n    {\n      "grade": 5,\n      "subjects": [...]\n    }\n  ]\n}'
              spellCheck="false"
            />
          </div>

          {/* Status Console */}
          {(message || status !== "IDLE") && (
            <div className={`p-4 border-t ${
              status === "ERROR" ? "bg-red-50 border-red-100" :
              status === "SUCCESS" ? "bg-green-50 border-green-100" :
              "bg-blue-50 border-blue-100"
            }`}>
              <div className="flex items-start gap-3">
                {status === "ERROR" && <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />}
                {status === "SUCCESS" && <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />}
                {status === "IMPORTING" && <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mt-0.5" />}
                
                <div>
                  <h3 className={`font-bold ${
                    status === "ERROR" ? "text-red-800" :
                    status === "SUCCESS" ? "text-green-800" :
                    "text-blue-800"
                  }`}>{status}</h3>
                  <p className={`text-sm mt-1 ${
                    status === "ERROR" ? "text-red-600" :
                    status === "SUCCESS" ? "text-green-600" :
                    "text-blue-600"
                  }`}>{message}</p>

                  {stats && (
                    <div className="mt-3 bg-white/50 rounded-lg p-3 inline-flex gap-6 border border-green-200">
                      <div>
                        <span className="block text-xs font-bold text-green-600 uppercase">Chapters Added</span>
                        <span className="text-xl font-bold text-green-800">{stats.chapters}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-green-600 uppercase">Concepts Parsed</span>
                        <span className="text-xl font-bold text-green-800">{stats.concepts}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-green-600 uppercase">Graph Edges Created</span>
                        <span className="text-xl font-bold text-green-800">{stats.graphEdges}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
