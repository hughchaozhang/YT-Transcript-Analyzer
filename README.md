# YouTube Analysis Tools

A modern web application that provides powerful tools for YouTube content analysis, including transcript extraction, hook analysis, and video search capabilities.

## Features

### Transcript Analyzer
- **Transcript Extraction**: Extract transcripts from any YouTube video using the Supadata API
- **Hook Analysis**: AI-powered analysis of video introductions and content structure using DeepSeek API
- **Clean UI**: Modern, dark-themed interface with responsive design
- **Modal Views**: Full-screen modal views for both analysis and transcript content
- **Copy Functionality**: Easy transcript copying with a single click

### YouTube Search
- **Video Search**: Search YouTube videos using SERP API
- **Rich Results**: View video thumbnails, titles, views, channel info, and descriptions
- **Clean Interface**: Modern, responsive design matching the analyzer tool
- **Direct Links**: Quick access to videos and channels

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI
- **APIs**:
  - Supadata API for transcript extraction
  - DeepSeek API for content analysis
  - SERP API for YouTube search

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
   SERP_API_KEY=your_serp_api_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Usage

### Transcript Analysis
1. Navigate to the Transcript Analyzer page
2. Enter a YouTube URL in the input field
3. Click "Analyze Video" to process
4. Once processed, you can:
   - Click "View Hook Analysis" to see the AI analysis
   - Click "View Full Transcript" to see the complete transcript

### Video Search
1. Navigate to the Video Search page
2. Enter your search query
3. View the list of matching videos with details
4. Click on video titles or channel names to visit them

## Features in Detail

### Hook Analysis
- Breaks down each sentence from the video's introduction
- Identifies specific hook techniques used
- Provides concise explanations of each technique
- Shows up to 6 main points from the video's content

### Search Results
- Video thumbnails
- Titles with direct links
- Channel information
- View counts
- Publication dates
- Video duration
- Description previews

## API Integration

### Supadata API
- Used for extracting transcripts from YouTube videos
- Handles various YouTube URL formats
- Returns formatted transcript text

### DeepSeek API
- Analyzes video content using AI
- Identifies hook techniques and content structure
- Returns structured JSON with analysis results

### SERP API
- Provides comprehensive YouTube search functionality
- Returns detailed video metadata
- Supports rich search results

## Environment Variables

Required environment variables:
- `SUPADATA_API_KEY`: API key for Supadata transcript service
- `DEEPSEEK_API_KEY`: API key for DeepSeek AI analysis
- `SERP_API_KEY`: API key for YouTube search functionality

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.