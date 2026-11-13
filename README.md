# Y2Mate YouTube Downloader

A MERN stack web application for downloading YouTube videos and audio.

## Tech Stack

- **Frontend**: React.js (functional components and hooks)
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Tools**: yt-dlp and FFmpeg

## Project Structure

```
/client → React frontend
/server → Express backend
/server/models → MongoDB schemas
/server/routes → API routes
/server/downloads → temporary files
```

## Prerequisites

- Node.js (already installed)
- MongoDB (already installed locally)
- yt-dlp: Install using `pip install yt-dlp`
- FFmpeg: Install using `winget install ffmpeg`

## Setup Instructions

1. Clone or download the project.

2. Install dependencies:

   ```bash
   # Backend
   cd server
   npm install

   # Frontend
   cd ../client
   npm install
   ```

3. Start MongoDB (if not running):
   ```bash
   mongod
   ```

4. Start the backend:
   ```bash
   cd server
   npm run dev
   ```

5. Start the frontend:
   ```bash
   cd client
   npm start
   ```

6. Open http://localhost:3000 in your browser.

## Features

- Download YouTube videos in MP4 format (144p, 360p, 720p)
- Download audio in MP3 format
- Preview video title and thumbnail before downloading
- Download history stored in MongoDB
- Temporary files auto-deleted after 1 hour

## API Endpoints

- `POST /api/video-info`: Fetch video title and thumbnail
- `POST /api/download`: Download video/audio
- `GET /api/history`: Get download history

## Important Note

This project is strictly for learning and local use only. Do not deploy or share publicly.