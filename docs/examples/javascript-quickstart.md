# JavaScript / Node.js Guide

Interact with ObservEarth using modern JavaScript (ES Modules, `fetch`, or Axios) in Node.js or backend environments.

---

## Code Example (Node.js Fetch API)

```javascript
const BASE_URL = 'https://observearth.com/api';
const API_KEY = process.env.OBSERVEARTH_API_KEY || 'YOUR_API_KEY_HERE';

const headers = {
  'X-API-Key': API_KEY,
  'Content-Type': 'application/json'
};

// 1. Verify API Key
async function verifyKey() {
  const res = await fetch(`${BASE_URL}/verify-api-key/`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ api_key: API_KEY })
  });
  const data = await res.json();
  console.log('API Key Valid:', data.valid);
}

// 2. Register Farm AOI
async function registerAOI() {
  const payload = {
    name: 'Sector 4 Orchard',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-120.450, 36.520],
        [-120.440, 36.520],
        [-120.440, 36.530],
        [-120.450, 36.530],
        [-120.450, 36.520]
      ]]
    },
    lookback_months: 1
  };

  const res = await fetch(`${BASE_URL}/geometry/`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  if (res.status === 201) {
    const data = await res.json();
    console.log(`AOI Created: ${data.id} (${data.properties.area} ha)`);
    return data.id;
  } else {
    const err = await res.json();
    console.error('Error:', err);
    return null;
  }
}

// 3. Get Current Weather & Soil Telemetry
async function fetchWeather(geometryId) {
  const res = await fetch(`${BASE_URL}/weather/current/?geometry_id=${geometryId}`, {
    headers
  });
  const data = await res.json();
  console.log('Current Weather:', data.current);
}

async function main() {
  await verifyKey();
  const geometryId = await registerAOI();
  if (geometryId) {
    await fetchWeather(geometryId);
  }
}

main().catch(console.error);
```
