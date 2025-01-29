"use client";

import { useState } from "react";
import Link from "next/link";
import { Dialog } from "@headlessui/react";

interface VideoResult {
  title: string;
  link: string;
  thumbnail: {
    static: string;
  };
  channel: {
    name: string;
    link: string;
  };
  published_date: string;
  views: number;
  description: string;
  duration: string;
}

interface ResearchCard {
  title: string;
  analysis: string;
}

interface VideoAnalysis {
  videoId: string;
  transcript: string;
  analysis: {
    cards: ResearchCard[];
  } | null;
  isAnalyzing: boolean;
  error?: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [researchQuestion, setResearchQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<VideoResult[]>([]);
  const [error, setError] = useState("");
  const [videoAnalyses, setVideoAnalyses] = useState<{ [key: string]: VideoAnalysis }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTranscript, setActiveTranscript] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setVideoAnalyses({});
    
    try {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error("Failed to search videos");
      }
      
      const data = await response.json();
      setResults(data.video_results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const getVideoIdFromUrl = (url: string): string => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/v\/))([^"&?\/\s]{11})/);
    return match ? match[1] : "";
  };

  const analyzeVideo = async (video: VideoResult) => {
    const videoId = getVideoIdFromUrl(video.link);
    if (!videoId) return;

    // Initialize or update video analysis state
    setVideoAnalyses(prev => ({
      ...prev,
      [videoId]: {
        videoId,
        transcript: "",
        analysis: null,
        isAnalyzing: true,
        error: undefined
      }
    }));

    try {
      // Fetch transcript
      const transcriptResponse = await fetch(`/api/youtube/transcript?url=${encodeURIComponent(video.link)}&text=true`);
      if (!transcriptResponse.ok) {
        throw new Error("Failed to fetch transcript");
      }
      const transcriptData = await transcriptResponse.json();
      const transcript = transcriptData.content;

      // Update state with transcript
      setVideoAnalyses(prev => ({
        ...prev,
        [videoId]: {
          ...prev[videoId],
          transcript
        }
      }));

      // Analyze with research question
      const analysisResponse = await fetch("/api/deepseek/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript,
          question: researchQuestion
        }),
      });

      if (!analysisResponse.ok) {
        throw new Error("Failed to analyze transcript");
      }

      const analysisData = await analysisResponse.json();
      
      // Update state with analysis
      setVideoAnalyses(prev => ({
        ...prev,
        [videoId]: {
          ...prev[videoId],
          analysis: analysisData,
          isAnalyzing: false
        }
      }));
    } catch (err) {
      setVideoAnalyses(prev => ({
        ...prev,
        [videoId]: {
          ...prev[videoId],
          error: err instanceof Error ? err.message : "Failed to analyze video",
          isAnalyzing: false
        }
      }));
    }
  };

  const showTranscript = (videoId: string) => {
    const analysis = videoAnalyses[videoId];
    if (analysis?.transcript) {
      setActiveTranscript(analysis.transcript);
      setIsModalOpen(true);
    }
  };

  const copyTranscript = () => {
    navigator.clipboard.writeText(activeTranscript);
  };

  const isValidResearchQuestion = researchQuestion.length >= 20 && researchQuestion.length <= 10000;

  return (
    <main className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center text-gray-100 mb-8">
          YouTube Video Research
        </h1>
        
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for YouTube videos..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {results.length > 0 && (
          <div className="mb-8">
            <textarea
              value={researchQuestion}
              onChange={(e) => setResearchQuestion(e.target.value)}
              placeholder="Enter your research question (minimum 20 characters)..."
              className="w-full px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500 min-h-[100px]"
            />
            <div className="text-sm text-gray-400 mt-2">
              {researchQuestion.length}/10000 characters
            </div>
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-900/50 text-red-200 rounded-lg border border-red-700">
            {error}
          </div>
        )}

        <div className="space-y-8">
          {results.map((video) => {
            const videoId = getVideoIdFromUrl(video.link);
            const analysis = videoAnalyses[videoId];
            
            return (
              <div key={video.link} className="space-y-4">
                <div className="flex gap-4 bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
                  <div className="flex-shrink-0 w-48 h-27">
                    <img
                      src={video.thumbnail.static}
                      alt={video.title}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-white truncate">
                      <Link href={video.link} target="_blank" className="hover:text-blue-400">
                        {video.title}
                      </Link>
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      <Link href={video.channel.link} target="_blank" className="hover:text-blue-400">
                        {video.channel.name}
                      </Link>
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <span>{video.views.toLocaleString()} views</span>
                      <span>•</span>
                      <span>{video.published_date}</span>
                      <span>•</span>
                      <span>{video.duration}</span>
                    </div>
                    <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                      {video.description}
                    </p>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => analyzeVideo(video)}
                        disabled={!isValidResearchQuestion || analysis?.isAnalyzing}
                        className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {analysis?.isAnalyzing ? "Analyzing..." : "Analyze"}
                      </button>
                      {analysis?.transcript && (
                        <button
                          onClick={() => showTranscript(videoId)}
                          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                          Show Transcript
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {analysis?.error && (
                  <div className="p-4 bg-red-900/50 text-red-200 rounded-lg border border-red-700">
                    {analysis.error}
                  </div>
                )}

                {analysis?.analysis && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {analysis.analysis.cards.map((card, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-emerald-400 mb-2">
                          {card.title}
                        </h3>
                        <p className="text-gray-300">
                          {card.analysis}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-4xl bg-gray-900 rounded-lg p-6 max-h-[80vh] overflow-y-auto border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <Dialog.Title className="text-xl font-semibold text-gray-100">
                  Video Transcript
                </Dialog.Title>
                <div className="flex gap-2">
                  <button
                    onClick={copyTranscript}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Copy Transcript
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="whitespace-pre-wrap text-gray-200">
                {activeTranscript}
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </main>
  );
} 