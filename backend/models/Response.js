const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  formId: String,
  userSubmission: Object,
  airtableRecordId: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Response", responseSchema);
