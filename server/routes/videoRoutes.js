const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const DownloadHistory = require('../models/DownloadHistory');

const router = express.Router();

// POST /api/video-info
router.post('/video-info', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Use yt-dlp to get video info
    exec(`yt-dlp --js-runtimes node --dump-json "${url}"`, (error, stdout, stderr) => {
      if (error) {
        console.error('Error fetching video info:', error);
        return res.status(500).json({ error: 'Failed to fetch video info' });
      }

      try {
        const videoInfo = JSON.parse(stdout);
        res.json({
          title: videoInfo.title,
          thumbnail: videoInfo.thumbnail,
        });
      } catch (parseError) {
        console.error('Error parsing video info:', parseError);
        res.status(500).json({ error: 'Failed to parse video info' });
      }
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/download
router.post('/download', async (req, res) => {
  const { url, format, quality } = req.body;

  if (!url || !format || !quality) {
    return res.status(400).json({ error: 'URL, format, and quality are required' });
  }

  try {
    // Get video info first
    exec(`yt-dlp --dump-json "${url}"`, async (error, stdout, stderr) => {
      if (error) {
        console.error('Error fetching video info:', error);
        return res.status(500).json({ error: 'Failed to fetch video info' });
      }

      try {
        const videoInfo = JSON.parse(stdout);
        const title = videoInfo.title.replace(/[^a-zA-Z0-9]/g, '_'); // Sanitize title

        // Save to database
        const history = new DownloadHistory({
          url,
          title: videoInfo.title,
          format,
          quality,
        });
        await history.save();

        const outputPath = path.join(__dirname, '../downloads', `${title}.${format.toLowerCase()}`);

        let command;
        if (format === 'MP3') {
          // Download audio and convert to MP3
          command = `yt-dlp -x --audio-format mp3 --ffmpeg-location "C:\\Users\\ASUS\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1-full_build\\bin" -o "${outputPath}" "${url}"`;
        } else {
          // Download video
          const qualityMap = {
            '144p': '144',
            '360p': '360',
            '720p': '720',
          };
          command = `yt-dlp --js-runtimes node -f "best[height<=${qualityMap[quality]}]" -o "${outputPath}" "${url}"`;
        }

        exec(command, (downloadError, downloadStdout, downloadStderr) => {
          if (downloadError) {
            console.error('Error downloading video:', downloadError);
            return res.status(500).json({ error: 'Failed to download video' });
          }

          // Return download link
          res.json({
            message: 'Download completed',
            downloadUrl: `/downloads/${title}.${format.toLowerCase()}`,
          });

          // Auto-delete after 1 hour
          setTimeout(() => {
            fs.unlink(outputPath, (err) => {
              if (err) console.error('Error deleting file:', err);
            });
          }, 3600000); // 1 hour
        });
      } catch (parseError) {
        console.error('Error parsing video info:', parseError);
        res.status(500).json({ error: 'Failed to parse video info' });
      }
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/history
router.get('/history', async (req, res) => {
  try {
    const history = await DownloadHistory.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;