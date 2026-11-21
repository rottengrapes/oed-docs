# Weather API

The **Weather API** provides hyper-local meteorological telemetry, microclimate forecasting, and agronomic sub-surface soil metrics centered directly on your registered farm's geographic centroid.

---

## 1. Current Weather & Agronomic Telemetry

### Endpoint
`GET /api/weather/current/`

### Operation Summary
`weather_current_list`

### Why It's Used
Provides real-time atmospheric observations along with multi-depth soil temperature and volumetric moisture readings.

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
  "temperature": 28.6,
  "feels_like": 27.5,
  "humidity": 24,
  "dew_point": 6.1,
  "precipitation": 0.0,
  "rain": 0.0,
  "pressure": 945.6,
  "surface_pressure": 945.6,
  "wind_speed": 11.2,
  "wind_direction": 45,
  "wind_direction_cardinal": "NE",
  "wind_gusts": 18.4,
  "cloud_cover": 25,
  "uv_index": 6.95,
  "et0_fao_evapotranspiration": 2.5,
  "soil_temperature_0_to_7cm": 24.2,
  "soil_temperature_7_to_28cm": 22.8,
  "soil_moisture_0_to_7cm": 0.18,
  "soil_moisture_7_to_28cm": 0.22,
  "units": {
    "temperature": "°C",
    "humidity": "%",
    "wind_speed": "km/h",
    "pressure": "hPa",
    "precipitation": "mm",
    "et0": "mm",
    "soil_moisture": "m³/m³"
  }
}
```

### cURL Example
```bash
curl -X GET "https://observearth.com/api/weather/current/?geometry_id=YOUR_GEOMETRY_ID" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## 2. Today's Hourly Weather Forecast

### Endpoint
`GET /api/weather/today/`

### Operation Summary
`weather_today_list`

### Why It's Used
Provides a 24-hour chronological breakdown of expected meteorological conditions for the current calendar day.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Query Parameters
| Parameter | Type | Description | Required |
|---|---|---|---|
| `geometry_id` | String (UUID) | UUID of the registered geometry | Yes |

### Responses
* **`200 OK`**: Chronological hourly forecast objects for today.

### cURL Example
```bash
curl -X GET "https://observearth.com/api/weather/today/?geometry_id=YOUR_GEOMETRY_ID" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## 3. 16-Day Weather Forecast

### Endpoint
`GET /api/weather/forecast/`

### Operation Summary
`weather_forecast_list`

### Why It's Used
Daily forecasts extending up to 16 days forward, covering min/max temperatures, precipitation probability, daily accumulated rain, and potential evapotranspiration.

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
  "daily": [
    {
      "date": "2026-11-21",
      "temperature_max": 30.2,
      "temperature_min": 16.4,
      "precipitation_sum": 0.0,
      "precipitation_probability_max": 5,
      "wind_speed_max": 14.2,
      "et0_fao_evapotranspiration": 3.1
    }
  ]
}
```

### cURL Example
```bash
curl -X GET "https://observearth.com/api/weather/forecast/?geometry_id=YOUR_GEOMETRY_ID" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## 4. Historical Weather Archive

### Endpoint
`GET /api/weather/historical/`

### Operation Summary
`weather_historical_list`

### Why It's Used
Access past meteorological and soil moisture telemetry over custom historical date ranges.

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
* **`200 OK`**: Timeseries of recorded hourly and daily weather observations.

### cURL Example
```bash
curl -X GET "https://observearth.com/api/weather/historical/?geometry_id=YOUR_GEOMETRY_ID&start_date=2026-10-01&end_date=2026-10-15" \
     -H "X-API-Key: YOUR_API_KEY"
```
