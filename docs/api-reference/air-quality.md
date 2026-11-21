# Air Quality API

The **Air Quality API** provides atmospheric chemical concentration metrics, aerosol optical telemetry, and the European Air Quality Index (AQI) centered directly on your registered farm's geographic coordinates.

---

## 1. Current Air Quality

### Endpoint
`GET /api/air-quality/current/`

### Operation Summary
`air-quality_current_list`

### Why It's Used
Retrieve real-time atmospheric pollutant concentrations (PM2.5, PM10, NO₂, SO₂, CO, O₃) and computed air quality indices for a geometry.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Query Parameters
| Parameter | Type | Description | Required |
|---|---|---|---|
| `geometry_id` | String (UUID) | UUID of the registered geometry | Yes |

### Responses
* **`200 OK`**:
```json
{
  "geometry_id": "123e4567-e89b-12d3-a456-426614174000",
  "european_aqi": 32,
  "aqi_category": "Good",
  "pm2_5": 8.4,
  "pm10": 14.2,
  "nitrogen_dioxide": 12.1,
  "sulphur_dioxide": 2.3,
  "ozone": 48.6,
  "carbon_monoxide": 210.0,
  "units": {
    "pm2_5": "μg/m³",
    "pm10": "μg/m³",
    "nitrogen_dioxide": "μg/m³",
    "sulphur_dioxide": "μg/m³",
    "ozone": "μg/m³",
    "carbon_monoxide": "μg/m³"
  }
}
```

### cURL Example
```bash
curl -X GET "https://observearth.com/api/air-quality/current/?geometry_id=YOUR_GEOMETRY_ID" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## 2. Today's Air Quality

### Endpoint
`GET /api/air-quality/today/`

### Operation Summary
`air-quality_today_list`

### Why It's Used
Provides current-day diurnal hourly air quality breakdown for the target geometry.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Query Parameters
| Parameter | Type | Description | Required |
|---|---|---|---|
| `geometry_id` | String (UUID) | UUID of the registered geometry | Yes |

### Responses
* **`200 OK`**:
```json
{
  "geometry_id": "123e4567-e89b-12d3-a456-426614174000",
  "date": "2026-11-21",
  "hourly": [
    {
      "time": "2026-11-21T00:00:00Z",
      "european_aqi": 28,
      "pm2_5": 7.2,
      "pm10": 11.5,
      "nitrogen_dioxide": 9.4
    }
  ]
}
```

### cURL Example
```bash
curl -X GET "https://observearth.com/api/air-quality/today/?geometry_id=YOUR_GEOMETRY_ID" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## 3. Air Quality Forecast

### Endpoint
`GET /api/air-quality/forecast/`

### Operation Summary
`air-quality_forecast_list`

### Why It's Used
Forecasts hourly atmospheric pollutant concentrations up to 96 hours forward.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Query Parameters
| Parameter | Type | Description | Required |
|---|---|---|---|
| `geometry_id` | String (UUID) | UUID of the registered geometry | Yes |

### Responses
* **`200 OK`**:
```json
{
  "geometry_id": "123e4567-e89b-12d3-a456-426614174000",
  "forecast": [
    {
      "timestamp": "2026-11-22T06:00:00Z",
      "european_aqi": 34,
      "pm2_5": 9.1,
      "pm10": 15.3,
      "ozone": 52.1
    }
  ]
}
```

### cURL Example
```bash
curl -X GET "https://observearth.com/api/air-quality/forecast/?geometry_id=YOUR_GEOMETRY_ID" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## 4. Historical Air Quality

### Endpoint
`GET /api/air-quality/historical/`

### Operation Summary
`air-quality_historical_list`

### Why It's Used
Retrieve historical atmospheric pollutant logs across custom date ranges.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Query Parameters
| Parameter | Type | Description | Required |
|---|---|---|---|
| `geometry_id` | String (UUID) | UUID of the registered geometry | Yes |
| `start_date` | String | Start date (`YYYY-MM-DD`) | Yes |
| `end_date` | String | End date (`YYYY-MM-DD`) | Yes |

### Responses
* **`200 OK`**: Timeseries array of recorded atmospheric parameters.

### cURL Example
```bash
curl -X GET "https://observearth.com/api/air-quality/historical/?geometry_id=YOUR_GEOMETRY_ID&start_date=2026-10-01&end_date=2026-10-15" \
     -H "X-API-Key: YOUR_API_KEY"
```
