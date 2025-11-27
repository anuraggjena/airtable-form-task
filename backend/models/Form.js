const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema(
  {
    airtableFieldId: { type: String, required: true },
    label: { type: String, required: true },
    required: { type: Boolean, default: false },
    type: { type: String, required: true }
  },
  { _id: false }
);

const formSchema = new mongoose.Schema(
  {
    ownerUserId: { type: String, required: true },
    baseId: { type: String, required: true },
    tableId: { type: String, required: true },
    title: { type: String, required: true },
    fields: {
      type: [fieldSchema],
      validate: v => Array.isArray(v) && v.length > 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Form", formSchema);
