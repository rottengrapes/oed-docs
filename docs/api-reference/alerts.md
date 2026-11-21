# Automated Index Alerts & Notifications API

The **Alerts API** allows you to configure real-time threshold monitoring on your farms and retrieve triggered alert notifications. Whenever a new satellite scene (Sentinel-2, Sentinel-1, etc.) is ingested, ObservEarth automatically computes your specified index conditions and logs an alert event.

---

## 1. List Index Alerts

### Endpoint
`GET /api/alerts/`

### Operation Summary
`alerts_list`

### Why It's Used
Retrieve all monitoring alert rules configured for your account.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Responses
* **`200 OK`**: Array of active and paused alert rule definitions:
```json
[
  {
    "id": "c1d2e3f4-a5b6-7890-1234-56789abcdef0",
    "geometry_id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Low NDVI Warning",
    "logic": "AND",
    "is_active": true,
    "monitor_until": "2026-11-30",
    "conditions": [
      {
        "index": "ndvi",
        "operator": "<",
        "threshold": 0.35
      }
    ],
    "created_at": "2026-05-01T10:00:00Z"
  }
]
```

### cURL Example
```bash
curl -X GET "https://observearth.com/api/alerts/" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## 2. Create Index Alert

### Endpoint
`POST /api/alerts/`

### Operation Summary
`alerts_create`

### Why It's Used
Register a new automated satellite threshold monitoring rule against an existing geometry.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |
| `Content-Type` | String | `application/json` | Yes |

### Request Body
```json
{
  "geometry_id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Vegetation Stress Watch",
  "logic": "AND",
  "monitor_until": "2026-12-31",
  "conditions": [
    {
      "index": "ndvi",
      "operator": "<",
      "threshold": 0.35
    },
    {
      "index": "ndwi",
      "operator": "<",
      "threshold": -0.10
    }
  ]
}
```

| Field | Type | Description | Required | Default |
|---|---|---|---|---|
| `geometry_id` | String (UUID) | Target farm UUID | Yes | - |
| `name` | String | Descriptive name | Yes | - |
| `logic` | String | `AND` or `OR` boolean operator | No | `AND` |
| `monitor_until` | String | Expiry date (`YYYY-MM-DD`) | Yes | - |
| `conditions` | Array | List of index condition objects | Yes | - |

### Condition Object Schema
| Property | Type | Description | Valid Values |
|---|---|---|---|
| `index` | String | Spectral or SAR index | `ndvi`, `ndwi`, `evi`, `savi`, `ndre`, `vv`, `vh`, `rvi`, etc. |
| `operator` | String | Comparison operator | `<`, `<=`, `>`, `>=`, `==` |
| `threshold` | Number | Numerical cutoff | Any float |

### Responses
* **`201 Created`**: Returns created alert object.
* **`400 Bad Request`**: Validation error (invalid index, operator, or past date).

### cURL Example
```bash
curl -X POST "https://observearth.com/api/alerts/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "geometry_id": "YOUR_GEOMETRY_ID",
       "name": "Vegetation Stress Watch",
       "logic": "AND",
       "monitor_until": "2026-12-31",
       "conditions": [
         {"index": "ndvi", "operator": "<", "threshold": 0.35}
       ]
     }'
```

---

## 3. Toggle Alert Active Status

### Endpoint
`PATCH /api/alerts/{alert_id}/`

### Operation Summary
`alerts_partial_update`

### Why It's Used
Pause or re-enable an existing alert rule without modifying its conditions.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |
| `Content-Type` | String | `application/json` | Yes |

### Request Body
```json
{
  "is_active": false
}
```

### Responses
* **`200 OK`**:
```json
{
  "id": "c1d2e3f4-a5b6-7890-1234-56789abcdef0",
  "is_active": false
}
```

### cURL Example
```bash
curl -X PATCH "https://observearth.com/api/alerts/ALERT_ID/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"is_active": false}'
```

---

## 4. Delete Alert

### Endpoint
`DELETE /api/alerts/{alert_id}/`

### Operation Summary
`alerts_delete`

### Why It's Used
Permanently remove an alert rule.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Responses
* **`204 No Content`**: Alert successfully deleted.

### cURL Example
```bash
curl -X DELETE "https://observearth.com/api/alerts/ALERT_ID/" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## 5. List Alert Notifications

### Endpoint
`GET /api/alert-notifications/`

### Operation Summary
`alert-notifications_list`

### Why It's Used
Retrieve the audit feed of all triggered alert events across your geometries, including timestamps and recorded sensor values.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Responses
* **`200 OK`**:
```json
[
  {
    "id": "f1e2d3c4-b5a6-7890-1234-56789abcdef0",
    "alert_id": "c1d2e3f4-a5b6-7890-1234-56789abcdef0",
    "geometry_id": "123e4567-e89b-12d3-a456-426614174000",
    "message": "Alert triggered: NDVI fell below 0.35 (observed value: 0.28)",
    "timestamp": "2026-11-20T14:32:10Z",
    "is_read": false
  }
]
```

### cURL Example
```bash
curl -X GET "https://observearth.com/api/alert-notifications/" \
     -H "X-API-Key: YOUR_API_KEY"
```
