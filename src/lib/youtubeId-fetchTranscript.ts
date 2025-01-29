

export function getVideoIdFromUrl(url: string): string {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/v\/))([^"&?\/\s]{11})/);
  return match ? match[1] : "";
}

export async function fetchTranscript(videoUrl: string): Promise<string> {
  const response = await fetch(`/api/youtube/transcript?url=${encodeURIComponent(videoUrl)}&text=true`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch transcript");
  }
  
  const data = await response.json();
  return data.content;
} 