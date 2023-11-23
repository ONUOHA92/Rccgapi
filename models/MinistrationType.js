const mongoose = require("mongoose");
const Schema = mongoose.Schema;



// Define a schema for Ministry
const ministryTypeSchema = Schema({
    user: { type: Schema.Types.ObjectId, required: "User ID is requred", ref: 'User' },
    days: { type: String, required: true },
    nameType: { type: String, required: true },
    minDateType: { type: Date, required: true }

});

// Create a Ministry model
const MinistryType = mongoose.model('MinistryType', ministryTypeSchema);

module.exports = { MinistryType };
