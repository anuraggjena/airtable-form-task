const express = require("express");
const crypto = require("crypto");
const User = require("../models/User");
const { buildAuthorizeUrl, exchangeCodeForToken } = require("../config/airtable");

const router = express.Router();
const stateStore = {};

function toBase64Url(buffer) {
  return buffer
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

router.get("/airtable/login", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  const codeVerifier = toBase64Url(crypto.randomBytes(32));

  const hash = crypto.createHash("sha256").update(codeVerifier).digest();
  const codeChallenge = toBase64Url(hash);

  stateStore[state] = {
    codeVerifier,
    createdAt: Date.now()
  };

  const authorizeUrl = buildAuthorizeUrl({ state, codeChallenge });
  console.log("👉 Redirecting to Airtable authorize URL:\n", authorizeUrl);
  res.redirect(authorizeUrl);
});

router.get("/airtable/callback", async (req, res) => {
  const { code, error, error_description, state } = req.query;

  if (error) {
    console.error("❌ Airtable OAuth error:", error, error_description);
    return res
      .status(400)
      .send(`Airtable OAuth error: ${error} - ${error_description || "no description"}`);
  }

  if (!state) return res.status(400).send("Missing 'state' in callback");

  const entry = stateStore[state];
  if (!entry) return res.status(400).send("Unknown or expired 'state' value");

  const codeVerifier = entry.codeVerifier;
  delete stateStore[state];

  if (!code) return res.status(400).send("Missing 'code' in callback");

  try {
    const tokenData = await exchangeCodeForToken({ code, codeVerifier });

    const {
      access_token,
      refresh_token,
      token_type,
      expires_in,
      scope
    } = tokenData;

    const now = new Date();
    const expiresAt = new Date(now.getTime() + expires_in * 1000);
    const airtableUserId = `airtable-user-${now.getTime()}`;

    let user = await User.findOne({ airtableUserId });
    if (!user) {
      user = await User.create({
        airtableUserId,
        accessToken: access_token,
        refreshToken: refresh_token,
        tokenType: token_type,
        scope,
        expiresAt,
        lastLoginAt: now
      });
    } else {
      user.accessToken = access_token;
      user.refreshToken = refresh_token;
      user.tokenType = token_type;
      user.scope = scope;
      user.expiresAt = expiresAt;
      user.lastLoginAt = now;
      await user.save();
    }

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    console.log("✅ OAuth success, redirecting to frontend with userId:", user._id.toString());
    res.redirect(`${frontendUrl}/dashboard?userId=${user._id.toString()}`);
  } catch (err) {
    if (err.response) {
      console.error("❌ OAuth callback error:", err.response.status, err.response.data);
      return res
        .status(err.response.status)
        .send(`Airtable token error: ${JSON.stringify(err.response.data)}`);
    }

    console.error("❌ OAuth callback error:", err.message);
    res.status(500).send("Failed to complete Airtable OAuth: " + err.message);
  }
});

module.exports = router;
