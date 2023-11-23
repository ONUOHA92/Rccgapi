const mongoose = require('mongoose');

const BackUpSchema = new mongoose.Schema({
    name: String
});

module.exports = BackUpSchema;


