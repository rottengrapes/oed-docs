# Geometry & AOI API

The **Geometry API** manages your Areas of Interest (AOIs). Every satellite, weather, and elevation request is bound to an active geometry registered through this API.

---

## 1. List Geometries

### Endpoint
`GET /api/geometry/`

### Operation Summary
`geometry_list`

### Why It's Used
Retrieve a paginated list of all AOIs registered under your account, including surface area calculations and background indexing status.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Query Parameters
| Parameter | Type | Description | Required | Default |
|---|---|---|---|---|
| `page` | Integer | Page number | No | `1` |
| `page_size` | Integer | Number of geometries per page (max: 100) | No | `20` |

### Responses
* **`200 OK`**: Paginated array of geometry objects.

### cURL Example
```bash
curl -X GET "https://observearth.com/api/geometry/?page=1&page_size=20" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## 2. Create Geometry

### Endpoint
`POST /api/geometry/`

### Operation Summary
`geometry_create`

### Why It's Used
Register a new agricultural parcel or AOI boundary polygon. Upon creation, ObservEarth validates size limits and triggers historical scene cataloging.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |
| `Content-Type` | String | `application/json` | Yes |

### Request Body
```json
{
  "name": "Central Valley Field 4",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [-120.45, 36.52],
        [-120.44, 36.52],
        [-120.44, 36.53],
        [-120.45, 36.53],
        [-120.45, 36.52]
      ]
    ]
  },
  "lookback_months": 1
}
```

| Field | Type | Description | Required | Default |
|---|---|---|---|---|
| `name` | String | Descriptive name (max: 255 chars) | Yes | - |
| `geometry` | Object | GeoJSON Polygon or MultiPolygon in WGS84 (EPSG:4326) | Yes | - |
| `lookback_months` | Integer | Historical satellite indexing depth (1 to 12 months) | No | `1` |

### Responses
* **`201 Created`**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Central Valley Field 4",
  "area_hectares": 15.41,
  "perimeter_km": 1.62,
  "daily_cron": false,
  "created_at": "2026-11-21T08:00:00Z"
}
```
* **`400 Bad Request`**: Invalid GeoJSON, unclosed ring, or plan hectare limit exceeded.

### cURL Example
```bash
curl -X POST "https://observearth.com/api/geometry/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Central Valley Field 4",
       "geometry": {
         "type": "Polygon",
         "coordinates": [[
           [-120.45, 36.52], [-120.44, 36.52],
           [-120.44, 36.53], [-120.45, 36.53],
           [-120.45, 36.52]
         ]]
       },
       "lookback_months": 1
     }'
```

---

## 3. Get Geometry Details

### Endpoint
`GET /api/geometry/{geometry_id}/`

### Operation Summary
`geometry_read`

### Why It's Used
Retrieve metadata, calculated area, centroid coordinates, and GeoJSON boundaries for a specific geometry.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Responses
* **`200 OK`**: Geometry detail object including full GeoJSON boundary.
* **`404 Not Found`**: Geometry does not exist.

### cURL Example
```bash
curl -X GET "https://observearth.com/api/geometry/YOUR_GEOMETRY_ID/" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## 4. Update Geometry

### Endpoint
`PUT /api/geometry/{geometry_id}/`

### Operation Summary
`geometry_update`

### Why It's Used
Update geometry name or toggle daily background cron ingestion for automated indexing.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |
| `Content-Type` | String | `application/json` | Yes |

### Request Body
```json
{
  "name": "Central Valley Field 4 - North Sector",
  "daily_cron": true
}
```

### Responses
* **`200 OK`**: Updated geometry object.

### cURL Example
```bash
curl -X PUT "https://observearth.com/api/geometry/YOUR_GEOMETRY_ID/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"name": "Central Valley Field 4 - North Sector", "daily_cron": true}'
```

---

## 5. Delete Geometry

### Endpoint
`DELETE /api/geometry/{geometry_id}/`

### Operation Summary
`geometry_delete`

### Why It's Used
Permanently deletes a geometry, cancels active alert rules associated with it, and immediately credits allocated hectares back to your account quota.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Responses
* **`204 No Content`**: Geometry deleted successfully.

### cURL Example
```bash
curl -X DELETE "https://observearth.com/api/geometry/YOUR_GEOMETRY_ID/" \
     -H "X-API-Key: YOUR_API_KEY"
```
