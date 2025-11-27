const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { airtableGet } = require("../config/airtable");

async function attachUser(req, res, next) {
  const rawUserId = req.query.userId || req.header("x-user-id");

  if (!rawUserId || rawUserId === "null" || rawUserId === "undefined") {
    return res.status(401).json({ message: "Missing userId" });
  }

  let user;
  try {
    user = await User.findById(rawUserId);
  } catch (e) {
    return res.status(401).json({ message: "Invalid user id" });
  }

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  req.user = user;
  next();
}

router.use(attachUser);

router.get("/bases", async (req, res) => {
  try {
    const data = await airtableGet(req.user.accessToken, "/meta/bases");
    res.json(data);
  } catch (err) {
    console.error("Error fetching bases from Airtable", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to fetch bases" });
  }
});

router.get("/bases/:baseId/tables", async (req, res) => {
  const { baseId } = req.params;
  try {
    const data = await airtableGet(req.user.accessToken, `/meta/bases/${baseId}/tables`);
    res.json(data);
  } catch (err) {
    console.error("Error fetching tables from Airtable", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to fetch tables" });
  }
});

router.get("/bases/:baseId/tables/:tableId", async (req, res) => {
  const { baseId, tableId } = req.params;
  try {
    const data = await airtableGet(req.user.accessToken, `/meta/bases/${baseId}/tables`);
    const tables = data.tables || [];
    const table = tables.find((t) => t.id === tableId);

    if (!table) {
      return res.status(404).json({ message: "Table not found in Airtable meta schema" });
    }

    res.json(table);
  } catch (err) {
    console.error("Error fetching table fields from Airtable", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to fetch table fields" });
  }
});

module.exports = router;
