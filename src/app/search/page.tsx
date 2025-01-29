"use client";

import { useState } from "react";
import Link from "next/link";

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

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<VideoResult[]>([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
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

  function formatViews(views: number): string {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views} views`;
  }

  return (
    <main className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center text-gray-100 mb-8">
          YouTube Video Search
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

        {error && (
          <div className="mb-8 p-4 bg-red-900/50 text-red-200 rounded-lg border border-red-700">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {results.map((video, index) => (
            <div
              key={index}
              className="flex gap-4 bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
            >
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
                  <span>{formatViews(video.views)}</span>
                  <span>•</span>
                  <span>{video.published_date}</span>
                  <span>•</span>
                  <span>{video.duration}</span>
                </div>
                <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                  {video.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {results.length === 0 && !isLoading && !error && (
          <div className="text-center text-gray-400 mt-8">
            No results to display. Try searching for something!
          </div>
        )}
      </div>
    </main>
  );
} 