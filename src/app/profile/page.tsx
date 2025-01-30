"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Dialog } from "@headlessui/react";
import { useAuth } from "@/lib/hooks/useAuth";
import { getUserResearch, deleteResearchAnalysis } from "@/lib/firebase/researchUtils";
import { VideoAnalysis } from "@/lib/types/research";

interface SavedAnalysis extends VideoAnalysis {
  id: string;
  isHidden?: boolean;
}

const ITEMS_PER_PAGE = 15;

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTranscript, setActiveTranscript] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Calculate pagination
  const totalPages = Math.ceil(analyses.length / ITEMS_PER_PAGE);
  const paginatedAnalyses = analyses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    const loadAnalyses = async () => {
      try {
        const userAnalyses = await getUserResearch(user.uid);
        setAnalyses(userAnalyses.map(analysis => ({ ...analysis, isHidden: false })));
      } catch (err) {
        setError("Failed to load your research analyses");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalyses();
  }, [user, router]);

  const confirmDelete = (analysisId: string) => {
    setDeleteTargetId(analysisId);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!user || !deleteTargetId) return;
    
    try {
      await deleteResearchAnalysis(user.uid, deleteTargetId);
      setAnalyses(prev => prev.filter(a => a.id !== deleteTargetId));
      
      // Adjust current page if needed
      const newTotalPages = Math.ceil((analyses.length - 1) / ITEMS_PER_PAGE);
      if (currentPage > newTotalPages) {
        setCurrentPage(Math.max(1, newTotalPages));
      }
    } catch (err) {
      console.error("Failed to delete analysis:", err);
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
    }
  };

  const toggleResults = (analysisId: string) => {
    setAnalyses(prev => 
      prev.map(analysis => 
        analysis.id === analysisId 
          ? { ...analysis, isHidden: !analysis.isHidden }
          : analysis
      )
    );
  };

  const showTranscript = (transcript: string) => {
    setActiveTranscript(transcript);
    setIsModalOpen(true);
  };

  const copyTranscript = () => {
    navigator.clipboard.writeText(activeTranscript);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto text-center text-white">
          Loading your research...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center text-gray-100 mb-8">
          Your Research
        </h1>

        {error && (
          <div className="mb-8 p-4 bg-red-900/50 text-red-200 rounded-lg border border-red-700">
            {error}
          </div>
        )}

        <div className="space-y-8">
          {analyses.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p>You haven't saved any research analyses yet.</p>
              <Link href="/research" className="text-blue-400 hover:text-blue-300 mt-2 inline-block">
                Start researching videos
              </Link>
            </div>
          ) : (
            <>
              {paginatedAnalyses.map((analysis) => (
                <div key={analysis.id} className="space-y-4">
                  <div className="flex gap-4 bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
                    <div className="flex-shrink-0 w-48 h-27">
                      <img
                        src={analysis.thumbnailUrl}
                        alt={analysis.videoTitle}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold text-white truncate">
                        <Link href={analysis.videoUrl} target="_blank" className="hover:text-blue-400">
                          {analysis.videoTitle}
                        </Link>
                      </h2>
                      <p className="text-sm text-gray-400 mt-1">
                        {analysis.channelName}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <span>{analysis.views.toLocaleString()} views</span>
                        <span>•</span>
                        <span>{analysis.publishedDate}</span>
                      </div>
                      <div className="mt-2 text-gray-300">
                        <strong className="text-blue-400">Research Question:</strong>
                        <p className="mt-1 text-sm">{analysis.researchQuestion}</p>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => showTranscript(analysis.transcript)}
                          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                          Show Transcript
                        </button>
                        <button
                          onClick={() => toggleResults(analysis.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          {analysis.isHidden ? "Show Results" : "Hide Results"}
                        </button>
                        <button
                          onClick={() => confirmDelete(analysis.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {!analysis.isHidden && analysis.analysis && (
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
              ))}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-gray-300">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Transcript Modal */}
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
                    className={`px-4 py-2 text-white rounded transition-all duration-300 ${
                      copyFeedback 
                        ? "bg-green-500 hover:bg-green-600" 
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {copyFeedback ? "Copied! ✓" : "Copy Transcript"}
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

        {/* Delete Confirmation Modal */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md bg-gray-900 rounded-lg p-6 border border-gray-700">
              <Dialog.Title className="text-xl font-semibold text-gray-100 mb-4">
                Confirm Deletion
              </Dialog.Title>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this analysis? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </main>
  );
} 