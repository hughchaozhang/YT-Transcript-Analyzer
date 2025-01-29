import { NextResponse } from "next/server";
import OpenAI from "openai";
import { logTokenUsage } from "../utils/tokenLogger";

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

const SYSTEM_PROMPT = `You are an expert at analyzing YouTube video transcripts and identifying hook techniques and content structure. Analyze the transcript in two parts:

1. Intro Analysis: For each sentence in the introduction (first few sentences), explain the specific hook technique being used in a single concise sentence.

2. Body Outline: Extract up to 6 main points from the rest of the content, formatted as a simple outline.

Return your response as a JSON object (not wrapped in any markdown code blocks) with this structure:
{
  "introAnalysis": [
    {
      "text": "The actual sentence from the video",
      "technique": "One sentence explanation of the technique used"
    }
  ],
  "bodyOutline": [
    "Main point 1",
    "Main point 2"
  ]
}`;

function cleanJsonResponse(text: string): string {
  // Remove markdown code block syntax if present
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }
  return text.trim();
}

export async function POST(request: Request) {
  try {
    const { transcript } = await request.json();

    if (!transcript) {
      return NextResponse.json({ error: "Transcript is required" }, { status: 400 });
    }

    // Limit context window to ~64k tokens by truncating to ~180,000 characters
    // (assuming ~3 characters per token as a conservative estimate)
    const truncatedTranscript = transcript.slice(0, 180000);

    console.log('Making request to DeepSeek API...');
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: truncatedTranscript }
      ],
      model: "deepseek-chat",
      temperature: 1.0, // default temperature for consistent analysis
      max_tokens: 4000, // Increased token limit for longer analysis
    });

    // Log token usage
    if (completion.usage) {
      logTokenUsage({
        timestamp: new Date().toISOString(),
        inputTokens: completion.usage.prompt_tokens,
        outputTokens: completion.usage.completion_tokens,
        totalTokens: completion.usage.total_tokens,
        endpoint: "analyze",
      });
    }

    if (!completion.choices[0]?.message?.content) {
      throw new Error("No response content from DeepSeek API");
    }

    const analysisText = completion.choices[0].message.content;
    console.log('DeepSeek response:', analysisText);

    try {
      // Clean the response before parsing
      const cleanedText = cleanJsonResponse(analysisText);
      console.log('Cleaned response:', cleanedText);
      
      const analysis = JSON.parse(cleanedText);
      return NextResponse.json(analysis);
    } catch (parseError) {
      console.error('Failed to parse DeepSeek response:', analysisText);
      throw new Error("Invalid JSON response from DeepSeek API");
    }
  } catch (error) {
    console.error("Error analyzing transcript:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze transcript" },
      { status: 500 }
    );
  }
} 