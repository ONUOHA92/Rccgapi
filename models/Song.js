const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
    title: String,
    intro: String,
    lyrics: String,
    lyricslink: String,
    link: String
});

module.exports = SongSchema;

