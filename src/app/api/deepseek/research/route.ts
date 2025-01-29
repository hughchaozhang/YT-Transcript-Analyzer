import { NextResponse } from "next/server";
import OpenAI from "openai";
import { logTokenUsage } from "../utils/tokenLogger";

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

const SYSTEM_PROMPT = `You are an expert at analyzing YouTube video transcripts in the context of specific research questions. Your task is to:

1. Analyze the transcript and identify key points that are relevant to the research question
2. Break down the analysis into distinct, focused cards
3. Each card should have:
   - A clear, concise title that summarizes the key point
   - A brief analysis (maximum 5 sentences) explaining how it relates to the research question

Return your response as a JSON object (not wrapped in any markdown code blocks) with this structure:
{
  "cards": [
    {
      "title": "Clear, action-oriented title",
      "analysis": "Concise analysis text (max 5 sentences)"
    }
  ]
}`;

function cleanJsonResponse(text: string): string {
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }
  return text.trim();
}

export async function POST(request: Request) {
  try {
    const { transcript, question } = await request.json();

    if (!transcript || !question) {
      return NextResponse.json(
        { error: "Both transcript and research question are required" },
        { status: 400 }
      );
    }

    if (question.length < 20 || question.length > 10000) {
      return NextResponse.json(
        { error: "Research question must be between 20 and 10,000 characters" },
        { status: 400 }
      );
    }

    // Limit to 100,000 characters as specified
    const truncatedTranscript = transcript.slice(0, 100000);

    console.log('Making request to DeepSeek API for research analysis...');
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Research Question: ${question}\n\nTranscript: ${truncatedTranscript}` }
      ],
      model: "deepseek-chat",
      temperature: 0.7,
      max_tokens: 4000,
    });

    // Log token usage
    if (completion.usage) {
      logTokenUsage({
        timestamp: new Date().toISOString(),
        inputTokens: completion.usage.prompt_tokens,
        outputTokens: completion.usage.completion_tokens,
        totalTokens: completion.usage.total_tokens,
        endpoint: "research",
      });
    }

    if (!completion.choices[0]?.message?.content) {
      throw new Error("No response content from DeepSeek API");
    }

    const analysisText = completion.choices[0].message.content;
    console.log('DeepSeek response:', analysisText);

    try {
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