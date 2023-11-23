const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const BackUpSchema = require('./BackUp');
const SongSchema = require('./Song');


// Define a schema for Ministry
const ministrySchema = Schema({
    user: { type: Schema.Types.ObjectId, required: "User ID is requred", ref: 'User' },
    name: { type: String, required: true },
    ministrationType: { type: [String], required: true },
    ministrationDate: { type: Date, required: true },
    ministrationService: { type: [String], required: true },
    backup: [BackUpSchema],
    songs: [SongSchema],
    data: { type: Date, default: Date.now() }
});

// Create a Ministry model
const Ministry = mongoose.model('Ministry', ministrySchema);

module.exports = { Ministry };



