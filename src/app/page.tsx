"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";

interface Analysis {
  introAnalysis: {
    text: string;
    technique: string;
  }[];
  bodyOutline: string[];
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"hook" | "transcript">("hook");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setAnalysis(null);
    
    try {
      // Fetch transcript
      const response = await fetch(`/api/youtube/transcript?url=${encodeURIComponent(url)}&text=true`, {
        method: "GET",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch transcript");
      }
      
      const data = await response.json();
      setTranscript(data.content);

      // Start analysis
      setIsAnalyzing(true);
      const analysisResponse = await fetch("/api/deepseek/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcript: data.content }),
      });

      if (!analysisResponse.ok) {
        throw new Error("Failed to analyze transcript");
      }

      const analysisData = await analysisResponse.json();
      setAnalysis(analysisData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
      setIsAnalyzing(false);
    }
  };

  const copyTranscript = () => {
    navigator.clipboard.writeText(transcript);
  };

  const openModal = (tab: "hook" | "transcript") => {
    setActiveTab(tab);
    setIsOpen(true);
  };

  return (
    <main className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center text-gray-100 mb-8">
          YouTube Transcript Analyzer
        </h1>
        
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube URL here..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Analyze Video"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-8 p-4 bg-red-900/50 text-red-200 rounded-lg border border-red-700">
            {error}
          </div>
        )}

        {(transcript || isAnalyzing || analysis) && !isLoading && (
          <div className="flex gap-4">
            <button
              onClick={() => openModal("hook")}
              disabled={isAnalyzing || !analysis}
              className="flex-1 bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? "Analyzing..." : "View Hook Analysis"}
            </button>
            <button
              onClick={() => openModal("transcript")}
              className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700"
            >
              View Full Transcript
            </button>
          </div>
        )}

        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-4xl bg-gray-900 rounded-lg p-6 max-h-[80vh] overflow-y-auto border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <Dialog.Title className="text-xl font-semibold text-gray-100">
                  {activeTab === "hook" ? "Hook Analysis" : "Full Transcript"}
                </Dialog.Title>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {activeTab === "hook" ? (
                <div className="space-y-6 text-gray-200">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-blue-400">Intro Analysis</h3>
                    {analysis?.introAnalysis.map((item, index) => (
                      <div key={index} className="space-y-2 bg-gray-800 rounded-lg p-4">
                        <p className="text-emerald-400">{item.text}</p>
                        <p className="text-gray-400 text-sm">{item.technique}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-blue-400">Body Outline</h3>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <ul className="list-disc list-inside space-y-2">
                        {analysis?.bodyOutline.map((point, index) => (
                          <li key={index} className="text-gray-200">{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={copyTranscript}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Copy Transcript
                    </button>
                  </div>
                  <div className="whitespace-pre-wrap text-gray-200">{transcript}</div>
                </div>
              )}
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </main>
  );
}
