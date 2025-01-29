# Supadata API Documentation

## Getting Started
Welcome to the Supadata documentation. Our API provides powerful tools for extracting content from YouTube videos and web pages.

## Overview
Supadata offers two main services:
- YouTube Transcripts - Extract transcripts and subtitles from YouTube videos
- Web Scraper - Extract content from any website

## Getting an API Key
All requests to Supadata require authentication using an API key. The same key also works with the SDKs and no-code integrations.

To get your API key:
1. Sign up for an account at [dash.supadata.ai](https://dash.supadata.ai)
2. Choose a subscription plan
3. Your API key will be generated automatically

## Integrations and SDKs
This documentation provides examples for how to use the Supadata API and its various parameters.

Available SDKs and integrations:
- JavaScript SDK
- Python SDK
- Make, Zapier, Active Pieces: [See here](#)

## Rate Limits
API requests are rate-limited based on your subscription plan. Current limits are:

| Plan  | Rate limit    |
|-------|---------------|
| Basic | 1 / second    |
| Pro   | 50 / second   |
| Ultra | 50 / second   |
| Mega  | 200 / second  |
| Giga  | 500 / second  |

> Note: It is possible to increase rate limits upon request.

## API Usage

### Authentication
All API requests require authentication using an API key. Include your API key in the request headers:

curl -H "x-api-key: YOUR_API_KEY" https://api.supadata.ai/v1/...

Never share your API key or commit it to version control. Use environment variables to store your API key securely. Only access the API from a secure server environment.

### Base URL
All API endpoints use the following base URL:

https://api.supadata.ai/v1

### Response Format
All API responses are returned in JSON format.

## Get Transcript API

This API fetches transcript/subtitles from YouTube videos in various formats and languages.

### Quick Start

#### Request

curl -X GET 'https://api.supadata.ai/v1/youtube/transcript?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ&text=true' \
  -H 'x-api-key: YOUR_API_KEY'

#### Response

{
  "content": "Never gonna give you up, never gonna let you down...",
  "lang": "en",
  "availableLangs": ["en", "es", "zh-TW"]
}

### Specification

#### Endpoint
GET https://api.supadata.ai/v1/youtube/transcript

Each request requires an x-api-key header with your API key available after signing up. Find out more about Authentication.

#### Query Parameters
Parameter	Type	Required	Description
url	string	Yes*	YouTube video URL. See Supported YouTube URL Formats.
videoId	string	Yes*	YouTube video ID. Alternative to URL
lang	string	No	Preferred language code of the transcript (ISO 639-1). See Languages.
text	boolean	No	When true, returns plain text transcript. Default: false
chunkSize	number	No	Maximum characters per transcript chunk (only when text=false)
* Either url or videoId must be provided

#### Response Format
When text=true:

{
  "content": string,
  "lang": string             // ISO 639-1 language code
  "availableLangs": string[] // List of available languages 
}
When text=false:

{
  "content": [
    {
      "text": string,        // Transcript segment
      "offset": number,      // Start time in milliseconds
      "duration": number,    // Duration in milliseconds
      "lang": string         // ISO 639-1 language code of chunk
    }
  ],
  "lang": string             // ISO 639-1 language code of transcript
  "availableLangs": string[] // List of available languages 
}

### Error Codes
The API returns HTTP status codes and error codes. See this page for more details.

### Supported YouTube URL Formats
url parameter supports various YouTube URL formats. See this page for more details.