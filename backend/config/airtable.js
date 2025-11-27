const axios = require("axios");

const AUTHORIZE_URL = "https://airtable.com/oauth2/v1/authorize";
const TOKEN_URL = "https://airtable.com/oauth2/v1/token";
const AIRTABLE_API_BASE_URL = "https://api.airtable.com/v0";

function buildAuthorizeUrl({ state, codeChallenge }) {
  const url = new URL(AUTHORIZE_URL);

  url.searchParams.set("client_id", process.env.AIRTABLE_CLIENT_ID);
  url.searchParams.set("redirect_uri", process.env.AIRTABLE_REDIRECT_URI);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "data.records:read data.records:write schema.bases:read");
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");

  return url.toString();
}

async function exchangeCodeForToken({ code, codeVerifier }) {
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("code_verifier", codeVerifier);
  params.append("redirect_uri", process.env.AIRTABLE_REDIRECT_URI);

  const basicAuth = Buffer.from(
    `${process.env.AIRTABLE_CLIENT_ID}:${process.env.AIRTABLE_CLIENT_SECRET}`
  ).toString("base64");

  const response = await axios.post(TOKEN_URL, params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicAuth}`
    }
  });

  return response.data;
}

async function airtableGet(accessToken, path) {
  const res = await axios.get(`${AIRTABLE_API_BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}`, "X-Airtable-API-Version": "1" }
  });

  return res.data;
}

async function airtableCreateRecord(accessToken, baseId, tableName, data) {
  const res = await axios.post(
    `${AIRTABLE_API_BASE_URL}/${baseId}/${tableName}`,
    { records: [{ fields: data }] },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return res.data;
}

module.exports = { buildAuthorizeUrl, exchangeCodeForToken, airtableGet, airtableCreateRecord };
