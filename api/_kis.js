const fetch = require('node-fetch');

const BASE = 'https://openapivts.koreainvestment.com:29443';
const APP_KEY = process.env.KIS_APP_KEY;
const APP_SECRET = process.env.KIS_APP_SECRET;

let _token = null;
let _tokenExpiry = null;

async function getToken() {
  if (_token && _tokenExpiry && Date.now() < _tokenExpiry) return _token;
  const res = await fetch(`${BASE}/oauth2/tokenP`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      appkey: APP_KEY,
      appsecret: APP_SECRET,
    }),
  });
  const data = await res.json();
  _token = data.access_token;
  _tokenExpiry = Date.now() + 23 * 60 * 60 * 1000; // 23시간
  return _token;
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Content-Type': 'application/json',
  };
}

async function kisGet(path, trId) {
  const token = await getToken();
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
      appkey: APP_KEY,
      appsecret: APP_SECRET,
      tr_id: trId,
      custtype: 'P',
    },
  });
  return res.json();
}

module.exports = { kisGet, corsHeaders };
