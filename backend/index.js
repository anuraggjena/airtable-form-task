const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const airtableRoutes = require("./routes/airtable");
const formsRoutes = require("./routes/forms");
const submissionRoutes = require("./routes/submissions");

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("Mongo Error:", err));

app.use("/auth", authRoutes);
app.use("/airtable", airtableRoutes);
app.use("/forms", formsRoutes);
app.use("/submit", submissionRoutes);

app.get("/health", (req, res) => res.json({ ok: true }));

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
