const express = require("express");
const Response = require("../models/Response");
const Form = require("../models/Form");
const User = require("../models/User");
const { airtableCreateRecord } = require("../config/airtable");

const router = express.Router();

router.post("/:formId", async (req, res) => {
  const { formId } = req.params;
  const form = await Form.findById(formId);
  const user = await User.findOne({});

  const mapped = {};
  form.fields.forEach((f) => {
    mapped[f.label] = req.body[f.airtableFieldId];
  });

  const airtableResponse = await airtableCreateRecord(
    user.accessToken,
    form.baseId,
    form.tableId,
    mapped
  );

  const saved = await Response.create({
    formId,
    userSubmission: req.body,
    airtableRecordId: airtableResponse.records[0].id
  });

  res.json(saved);
});

module.exports = router;
