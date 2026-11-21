# API Analytics & Request Logs API

The **Analytics API** allows account administrators and developers to track API consumption volume, monitor execution latency, and review per-call audit logs.

---

## 1. Analytics Logs

### Endpoint
`GET /api/analytics/logs/`

### Operation Summary
`analytics_logs_list`

### Why It's Used
Retrieve paginated per-request execution logs for the authenticated user, supporting date range and API type filtering.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Query Parameters
| Parameter | Type | Description | Required | Default |
|---|---|---|---|---|
| `start_date` | String | Start date (`YYYY-MM-DD`) | No | 3 months ago |
| `end_date` | String | End date (`YYYY-MM-DD`) | No | Today |
| `api_type` | String | Filter by API category (e.g. `s2`, `weather`, `stats`) | No | All |
| `page` | Integer | Page number | No | `1` |
| `page_size` | Integer | Number of logs per page | No | `20` |

### Responses
* **`200 OK`**:
```json
{
  "count": 142,
  "next": "https://observearth.com/api/analytics/logs/?page=2",
  "previous": null,
  "results": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "timestamp": "2026-11-21T08:15:22Z",
      "endpoint": "/api/s2/stats/",
      "method": "POST",
      "status_code": 200,
      "latency_ms": 1420,
      "area_hectares": 15.41,
      "ip_address": "198.51.100.4"
    }
  ]
}
```

### cURL Example
```bash
curl -X GET "https://observearth.com/api/analytics/logs/?start_date=2026-11-01&page=1&page_size=20" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## 2. Monthly Historical Summary

### Endpoint
`GET /api/analytics/summary/`

### Operation Summary
`analytics_summary_list`

### Why It's Used
Retrieve the aggregate monthly API analytics summary for any specific historical calendar month and year.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Query Parameters
| Parameter | Type | Description | Required |
|---|---|---|---|
| `year` | Integer | Calendar year (e.g. `2026`) | Yes |
| `month` | Integer | Calendar month (`1` to `12`) | Yes |

### Responses
* **`200 OK`**:
```json
{
  "year": 2026,
  "month": 10,
  "total_requests": 1450,
  "average_latency_ms": 1840,
  "breakdown": {
    "search": 420,
    "stats": 680,
    "image": 150,
    "weather": 180,
    "air_quality": 20
  },
  "satellites": {
    "sentinel2": 950,
    "sentinel1": 210,
    "landsat": 80,
    "modis": 10
  }
}
```

### cURL Example
```bash
curl -X GET "https://observearth.com/api/analytics/summary/?year=2026&month=10" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## 3. Current Month Analytics Summary

### Endpoint
`GET /api/analytics/summary/current/`

### Operation Summary
`analytics_summary_current_list`

### Why It's Used
Returns real-time aggregated consumption metrics for the current calendar month, including category counters, top endpoints, and daily volume trends.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Query Parameters
| Parameter | Type | Description | Required |
|---|---|---|---|
| `start_date` | String | Optional filter start date (`YYYY-MM-DD`) | No |
| `end_date` | String | Optional filter end date (`YYYY-MM-DD`) | No |

### Responses
* **`200 OK`**:
```json
{
  "total_requests": 10,
  "average_latency_ms": 2980,
  "satellite_queries": 6,
  "weather_aq_queries": 4,
  "categories": {
    "search": 2,
    "stats": 3,
    "image": 1,
    "all_in_one": 0,
    "weather": 3,
    "air_quality": 1
  },
  "satellites": {
    "sentinel2": 5,
    "sentinel1": 1,
    "landsat": 0,
    "modis": 0
  },
  "daily_trend": [
    {"date": "2026-11-15", "count": 1},
    {"date": "2026-11-18", "count": 4},
    {"date": "2026-11-21", "count": 5}
  ]
}
```

### cURL Example
```bash
curl -X GET "https://observearth.com/api/analytics/summary/current/" \
     -H "X-API-Key: YOUR_API_KEY"
```
