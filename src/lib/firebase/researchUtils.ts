import { addDocument, getDocuments, deleteDocument } from './firebaseUtils';
import { VideoAnalysis } from '../types/research';

const COLLECTION_NAME = 'research_analyses';

// Save research analysis to Firestore
export async function saveResearchAnalysis(userId: string, analysis: VideoAnalysis) {
  try {
    // Add userId to identify the owner
    const data = {
      ...analysis,
      userId,
      createdAt: Date.now(),
    };
    
    // Save to Firestore
    const docRef = await addDocument(COLLECTION_NAME, data);
    
    // Save to localStorage for caching
    const cachedData = getCachedResearch(userId);
    cachedData.push({ ...data, id: docRef.id });
    localStorage.setItem(`research_${userId}`, JSON.stringify(cachedData));
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving research analysis:', error);
    throw error;
  }
}

// Get all research analyses for a user
export async function getUserResearch(userId: string, forceRefresh = false): Promise<(VideoAnalysis & { id: string })[]> {
  try {
    // Check cache first if not forcing refresh
    if (!forceRefresh) {
      const cachedData = getCachedResearch(userId);
      if (cachedData.length > 0) {
        return cachedData;
      }
    }
    
    // Get from Firestore
    const docs = await getDocuments(COLLECTION_NAME);
    const userDocs = docs
      .filter((doc): doc is VideoAnalysis & { id: string; userId: string } => 
        'userId' in doc && doc.userId === userId
      )
      .sort((a, b) => b.createdAt - a.createdAt);
    
    // Update cache
    localStorage.setItem(`research_${userId}`, JSON.stringify(userDocs));
    
    return userDocs;
  } catch (error) {
    console.error('Error getting user research:', error);
    throw error;
  }
}

// Delete a research analysis
export async function deleteResearchAnalysis(userId: string, analysisId: string) {
  try {
    await deleteDocument(COLLECTION_NAME, analysisId);
    
    // Update cache
    const cachedData = getCachedResearch(userId).filter(item => item.id !== analysisId);
    localStorage.setItem(`research_${userId}`, JSON.stringify(cachedData));
  } catch (error) {
    console.error('Error deleting research analysis:', error);
    throw error;
  }
}

// Helper function to get cached research
function getCachedResearch(userId: string): (VideoAnalysis & { id: string })[] {
  try {
    const cached = localStorage.getItem(`research_${userId}`);
    return cached ? JSON.parse(cached) : [];
  } catch {
    return [];
  }
} 