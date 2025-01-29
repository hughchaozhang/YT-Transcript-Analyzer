import { NextResponse } from "next/server";
import OpenAI from "openai";

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

    // Limit context window to ~4000 tokens by truncating to ~12000 characters
    const truncatedTranscript = transcript.slice(0, 12000);

    console.log('Making request to DeepSeek API...');
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: truncatedTranscript }
      ],
      model: "deepseek-chat",
      temperature: 0.7,
      max_tokens: 2000,
    });

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