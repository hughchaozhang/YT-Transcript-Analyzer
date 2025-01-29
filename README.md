# YouTube Transcript Analyzer

A modern web application that extracts and analyzes YouTube video transcripts, providing insights into video hooks and content structure.

## Features

- **Transcript Extraction**: Extract transcripts from any YouTube video using the Supadata API
- **Hook Analysis**: AI-powered analysis of video introductions and content structure using DeepSeek API
- **Clean UI**: Modern, dark-themed interface with responsive design
- **Modal Views**: Full-screen modal views for both analysis and transcript content
- **Copy Functionality**: Easy transcript copying with a single click

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI
- **APIs**:
  - Supadata API for transcript extraction
  - DeepSeek API for content analysis

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```
   SUPADATA_API_KEY=your_supadata_api_key
   DEEPSEEK_API_KEY=your_deepseek_api_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Enter a YouTube URL in the input field
2. Click "Analyze Video" to process the video
3. Once processed, you can:
   - Click "View Hook Analysis" to see the AI analysis of the video's hook and structure
   - Click "View Full Transcript" to see the complete transcript

## Hook Analysis Features

The hook analysis provides two main sections:

### Intro Analysis
- Breaks down each sentence from the video's introduction
- Identifies specific hook techniques used
- Provides concise explanations of each technique

### Body Outline
- Extracts up to 6 main points from the video
- Presents a clear structure of the video's content
- Helps understand the video's flow and organization

## API Integration

### Supadata API
- Used for extracting transcripts from YouTube videos
- Handles various YouTube URL formats
- Returns formatted transcript text

### DeepSeek API
- Analyzes video content using AI
- Identifies hook techniques and content structure
- Returns structured JSON with analysis results

## Environment Variables

Required environment variables:
- `SUPADATA_API_KEY`: API key for Supadata transcript service
- `DEEPSEEK_API_KEY`: API key for DeepSeek AI analysis

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.