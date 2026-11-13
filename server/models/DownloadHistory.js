const mongoose = require('mongoose');

const downloadHistorySchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    required: true,
    enum: ['MP3', 'MP4'],
  },
  quality: {
    type: String,
    required: true,
    enum: ['144p', '360p', '720p'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('DownloadHistory', downloadHistorySchema);