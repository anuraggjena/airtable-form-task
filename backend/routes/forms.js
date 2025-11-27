const express = require("express");
const router = express.Router();
const Form = require("../models/Form");
const User = require("../models/User");

async function attachUser(req, res, next) {
  const rawUserId = req.query.userId || req.header("x-user-id");

  if (!rawUserId || rawUserId === "null" || rawUserId === "undefined") {
    return res.status(401).json({ message: "Missing userId" });
  }

  let user;
  try {
    user = await User.findById(rawUserId);
  } catch {
    return res.status(401).json({ message: "Invalid user id" });
  }

  if (!user) return res.status(401).json({ message: "User not found" });

  req.user = user;
  next();
}

router.use(attachUser);

router.post("/", async (req, res) => {
  try {
    const { baseId, tableId, title, fields } = req.body;

    if (!baseId || !tableId || !title || !fields?.length) {
      return res.status(400).json({ message: "Missing form details" });
    }

    const form = await Form.create({
      ownerUserId: req.user._id.toString(),
      baseId,
      tableId,
      title,
      fields
    });

    res.status(201).json(form);
  } catch (err) {
    console.error("Error creating form", err);
    res.status(500).json({ message: "Failed to create form" });
  }
});

router.get("/", async (req, res) => {
  try {
    const forms = await Form.find({
      ownerUserId: req.user._id.toString()
    }).lean();
    res.json(forms);
  } catch (err) {
    console.error("Error fetching forms", err);
    res.status(500).json({ message: "Failed to fetch forms" });
  }
});

router.get("/single/:formId", async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId).lean();
    if (!form) return res.status(404).json({ message: "Form not found" });
    res.json(form);
  } catch (err) {
    console.error("Error fetching single form", err);
    res.status(500).json({ message: "Failed to fetch form" });
  }
});

module.exports = router;
