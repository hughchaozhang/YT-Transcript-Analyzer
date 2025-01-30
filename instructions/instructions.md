#Youtube Transcribe function 

## Project Overview

This project is a web application that allows users to analyze YouTube videos and search for YouTube videos. It uses the Supadata API to transcribe YouTube videos and the DeepSeek API to analyze the transcripts. The application also includes Firebase authentication and a database to store the research analysis.

## Project file structure (it is built using a template so some files and apis are not used in the project)
.
├── README.md
├── instructions
│   ├── deepseek-api-doc.md
│   ├── instructions.md
│   ├── serp-api-doc.md
│   └── supadata-transcribe-doc.md
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── paths
│   ├── chat.md
│   ├── image-generation.md
│   ├── social-media.md
│   └── voice-notes.md
├── postcss.config.mjs
├── public
│   ├── next.svg
│   └── vercel.svg
├── src
│   ├── app
│   │   ├── api
│   │   │   ├── anthropic
│   │   │   │   └── chat
│   │   │   │       └── route.ts
│   │   │   ├── deepgram
│   │   │   │   └── route.ts
│   │   │   ├── deepseek
│   │   │   │   ├── analyze
│   │   │   │   │   └── route.ts
│   │   │   │   ├── research
│   │   │   │   │   └── route.ts
│   │   │   │   └── utils
│   │   │   │       └── tokenLogger.ts
│   │   │   ├── openai
│   │   │   │   ├── chat
│   │   │   │   │   └── route.ts
│   │   │   │   └── transcribe
│   │   │   │       └── route.ts
│   │   │   ├── replicate
│   │   │   │   └── generate-image
│   │   │   │       └── route.ts
│   │   │   └── youtube
│   │   │       ├── search
│   │   │       │   └── route.ts
│   │   │       └── transcript
│   │   │           └── route.ts
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── profile
│   │   │   └── page.tsx
│   │   └── research
│   │       └── page.tsx
│   ├── components
│   │   ├── ImageUpload.tsx
│   │   ├── NavBar.tsx
│   │   ├── SignInWithGoogle.tsx
│   │   └── VoiceRecorder.tsx
│   └── lib
│       ├── contexts
│       │   ├── AuthContext.tsx
│       │   └── DeepgramContext.tsx
│       ├── firebase
│       │   ├── firebase.ts
│       │   └── firebaseUtils.ts
│       ├── hooks
│       │   └── useAuth.ts
│       ├── types
│       │   └── research.ts
│       └── youtubeId-fetchTranscript.ts
├── tailwind.config.ts
├── token-usage.md
└── tsconfig.json

step 1: (completed)
I want to use the supadata api to extract The transcript from a YouTube link. (Supadata API Documentation here: /supdata-transcribe-doc.md) That is what this API does. I want you to create a very simple input search bar that looks clean in the center of the page. And that is where the user is going to put in the link for the YouTube video. You will have a loading indicator and once it's done loading you will show a button that says the transcript is done, that it is pulled and then if the user clicks on that button, they can open it up. And it opens up center peak full window and the viewer, where the user can see and read the transcript and have a copy transcript button in that pop up. I have put in SUPADATA_API_KEY in the flyio secrets, we are using fly.io for deployment. I want you to make this the main home page. This should completely replace all of the things that are on the main page in the template for this application. So take off everything and just have that search bar that you can paste a link that does exactly as l've stated above.


step 2: (completed)
I am using the deepseek api to analyze the transcript.
What I want you to do, is I want you to analyze the transcript, and I want you to analyze the hook and the intro.
You are going to take the full transcript that is generated from the supadata and feed it to deepseek... Do this automatically so as soon as the transcript is generated show me the same functionality that we have already, while indicating that the analysis is loading.
Whatever the context window is for deepseek, make it feed only the max amount into the deepseek model so it doesn't fail with too much context.
Here is how i want you to analyze this transcript. You are generating a "hook outline" for the video. 

Enter a YouTube URL in the input field press enter
Select "Hook Analysis" from the three options (Hook Analysis, Video Details, Full Transcript)
Results Display:
The analysis shows up in a dark themed card with two main sections:
Intro Analysis:
Every sentence from the video's introduction is broken down separately
For each sentence you see:
The actual line from the video (in green)
A detailed analysis explaining what technique that line uses (in gray) one sentence Identifies specific hook techniques like "Three-Step Hook Formula" or "Lead with
Benefits"
Body Outline:
Shows up to 6 main points from the rest of the video
Should be concise and simple like "1st tip explained (how to get started)" Gives you a clear overview of the video's structure after the introduction
Helps understand how the content flows

step 3: (completed)

 Create another page "Youtube Search" with a similiar search bar ... This page should be accessible by pressing a search button in the top bar. we will be using SERPAPI for this experience, the user is going to enter in a YouTube search, just like a search phrase for any topic they're interested in. And you are going to show the videos and all of the data that you will have access with the SERP API in a list and show the thumbnails and then amount of views and everything in a very clean list. SERP_API_KEY is stored in the environment variables. SERP API Documentation is here: /serp-api-doc.md. Follow the documentation to get the data you need.

step 4: (completed)
After I put in my search keywords and press enter on the Youtube Search page... Beneath the search input text box should be a new dialogue box that comes in, and that will be the research question. Once the user has typed in a research question that is over 20 characters long, maximum 10,000 characters, it will then allow users to hit the "Analyze" button on all of the search results. the Analyze button is going to pull the transcripts using the SERP API and then use the DeepSeek model to look at the full transcripts of the video, and it's going to use the research question to analyze the transcript.
If the transcripts are too long, you are going to just take in maximum 100,000 characters. I want for these analyses to show up below the section where the information about the video is shown and I want these to be shown as cards. So let's say my research question is, "show me ways to use Al as coding tools", and let's say a video that you're analyzing has 10 different ways to use Al with coding tools. Each of those should be one chunk so there should be ten different chunks for that video. And so you're going to want to format the output so that it is a maximum of like five sentences and they should look like cards rather than showing up as like one giant chunk of a document. Each card should have a title and then the body of the card should be the analysis. I am assuming you will need to create a new system prompt for this.

And once the transcript is pulled for that one, similar to the other page, I want you to have a Show transcript button. you're using the Supadata to pull the transcript and then you're using deepseek to analyze it. Same as before. So it should be the same process. Don't change the homepage of this application. You're just changing the search functionality right now.

step 5: (completed)
Add firebase authentication to the application.

step 6:
Create a profile page for users who have logged in. it will show all the research analysis that the user has done. the analysis should be shown in cards and presented the same way as the research page. The analysis should have the video title, video url, thumbnail image, channel name, views, published date, transcript (click to show), research question, and analysis (click to show and hide). basically the same as the research page but for the user who has logged in.
include these functions:
- pagination:display 15 results per page.
- delete button: delete the analysis from the database. confirmation required before deletion.




step 7:
add database functionality to the application, to save the research analysis to the database. (supabase documentation here: /supabase-doc.md) i saved the supabase key in the .env file.

in the research page, after an user, who has logged in, enters the research question and clicks analyze, the analysis should be saved to the database. and can be viewed in that users profile page. 

