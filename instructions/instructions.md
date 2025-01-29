#Youtube Transcribe function 

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

step 3:

 Create another page "Youtube Search" with a similiar search bar ... This page should be accessible by pressing a search button in the top bar. we will be using SERPAPI for this experience, the user is going to enter in a YouTube search, just like a search phrase for any topic they're interested in. And you are going to show the videos and all of the data that you will have access with the SERP API in a list and show the thumbnails and then amount of views and everything in a very clean list. SERP_API_KEY is stored in the environment variables. SERP API Documentation is here: /serp-api-doc.md. Follow the documentation to get the data you need.

