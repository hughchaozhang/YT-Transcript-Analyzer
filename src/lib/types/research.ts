export interface ResearchCard {
  title: string;
  analysis: string;
}

export interface VideoAnalysis {
  videoId: string;
  videoTitle: string;
  videoUrl: string;
  thumbnailUrl: string;
  channelName: string;
  views: number;
  publishedDate: string;
  transcript: string;
  researchQuestion: string;
  analysis: {
    cards: ResearchCard[];
  } | null;
  createdAt: number;
} 