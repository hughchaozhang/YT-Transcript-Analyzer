import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const youtubeUrl = searchParams.get("url");
  const text = searchParams.get("text") === "true";

  if (!youtubeUrl) {
    return NextResponse.json({ error: "YouTube URL is required" }, { status: 400 });
  }

  try {
    const apiUrl = new URL("https://api.supadata.ai/v1/youtube/transcript");
    apiUrl.searchParams.set("url", youtubeUrl);
    apiUrl.searchParams.set("text", text.toString());

    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "x-api-key": process.env.SUPADATA_API_KEY || "",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch transcript");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return NextResponse.json(
      { error: "Failed to fetch transcript" },
      { status: 500 }
    );
  }
} 