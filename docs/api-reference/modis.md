# MODIS Satellite API

The **MODIS API** provides access to the Moderate Resolution Imaging Spectroradiometer (MODIS) aboard NASA's Terra and Aqua satellites, delivering daily global surface reflectance observations at 250m and 500m spatial resolution.

---

## 1. Search MODIS Scenes

### Endpoint
`POST /api/modis/search/`

### Operation Summary
`modis_search_create`

### Why It's Used
Query available daily MODIS composite acquisitions intersecting your geometry over a specified date range.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |
| `Content-Type` | String | `application/json` | Yes |

### Request Body
```json
{
  "geometry_id": "123e4567-e89b-12d3-a456-426614174000",
  "start_date": "2026-05-01",
  "end_date": "2026-05-31"
}
```

### Responses
* **`200 OK`**: GeoJSON FeatureCollection of matching MODIS items.

### cURL Example
```bash
curl -X POST "https://observearth.com/api/modis/search/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "geometry_id": "YOUR_GEOMETRY_ID",
       "start_date": "2026-05-01",
       "end_date": "2026-05-31"
     }'
```

---

## 2. Single Scene MODIS Statistics

### Endpoint
`GET /api/modis/stats/{geometry_id}/`

### Operation Summary
`modis_stats_read`

### Why It's Used
Calculates zonal statistics (mean, median, min, max, std) for a specific MODIS scene item and index.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Query Parameters
| Parameter | Type | Description | Required |
|---|---|---|---|
| `item_id` | String | MODIS Scene Item ID | Yes |
| `index` | String | Index name (e.g. `ndvi`, `evi`, `ndwi`) | Yes |

### Responses
* **`200 OK`**: Statistical summary object.

### cURL Example
```bash
curl -X GET "https://observearth.com/api/modis/stats/YOUR_GEOMETRY_ID/?item_id=MOD09GQ.A2026138.h08v05.061.2026140032015&index=ndvi" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## 3. Date Range MODIS Statistics (Time-Series)

### Endpoint
`POST /api/modis/stats/`

### Operation Summary
`modis_stats_create`

### Why It's Used
Computes a daily time-series statistical progression across all MODIS passes within a date range.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |
| `Content-Type` | String | `application/json` | Yes |

### Request Body
```json
{
  "geometry_id": "123e4567-e89b-12d3-a456-426614174000",
  "start_date": "2026-05-01",
  "end_date": "2026-05-31",
  "index": "ndvi"
}
```

### Responses
* **`200 OK`**: Array of daily statistical summaries.

### cURL Example
```bash
curl -X POST "https://observearth.com/api/modis/stats/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "geometry_id": "YOUR_GEOMETRY_ID",
       "start_date": "2026-05-01",
       "end_date": "2026-05-31",
       "index": "ndvi"
     }'
```

---

## 4. Render MODIS Image

### Endpoint
`GET /api/modis/image/{geometry_id}/`

### Operation Summary
`modis_image_read`

### Why It's Used
Renders a colormapped PNG or single-band 32-bit floating-point GeoTIFF clipped to the geometry boundary.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Query Parameters
| Parameter | Type | Description | Required | Default |
|---|---|---|---|---|
| `item_id` | String | MODIS Scene Item ID | Yes | - |
| `index` | String | Index (e.g. `ndvi`, `evi`, `ndwi`) | No | `ndvi` |
| `image_type` | String | `png` or `tif` | No | `png` |
| `colormap` | String | Visualization palette (e.g. `rdylgn`) | No | `rdylgn` |

### Responses
* **`200 OK`**: Image binary stream (`image/png` or `image/tiff`).

### cURL Example
```bash
curl -X GET "https://observearth.com/api/modis/image/YOUR_GEOMETRY_ID/?item_id=MOD09GQ.A2026138.h08v05.061.2026140032015&index=ndvi&image_type=png&colormap=rdylgn" \
     -H "X-API-Key: YOUR_API_KEY" \
     --output modis_ndvi.png
```

---

## 5. All-in-One Multi-Index Bundle

### Endpoint
`POST /api/modis/all-in-one/`

### Operation Summary
`modis_all-in-one_create`

### Why It's Used
Calculate multiple MODIS vegetation and water indices in a single parallel query.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |
| `Content-Type` | String | `application/json` | Yes |

### Request Body
```json
{
  "geometry_id": "123e4567-e89b-12d3-a456-426614174000",
  "item_id": "MOD09GQ.A2026138.h08v05.061.2026140032015",
  "indices": ["ndvi", "evi", "ndwi"]
}
```

### Responses
* **`200 OK`**: Multi-index statistics payload.

### cURL Example
```bash
curl -X POST "https://observearth.com/api/modis/all-in-one/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "geometry_id": "YOUR_GEOMETRY_ID",
       "item_id": "MOD09GQ.A2026138.h08v05.061.2026140032015",
       "indices": ["ndvi", "evi", "ndwi"]
     }'
```

---

## 6. List MODIS Indices by Collection

### Endpoint
`GET /api/modis/indices/`

### Operation Summary
`modis_indices_list`

### Why It's Used
Get a list of MODIS indices grouped by sensor collection (e.g. MOD09GQ, MOD09GA, MYD09GQ).

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Responses
* **`200 OK`**: Array of index collections and formula mappings:
```json
[
  {
    "collection": "MOD09GQ",
    "indices": ["ndvi", "evi2"]
  },
  {
    "collection": "MOD09GA",
    "indices": ["ndwi", "evi", "savi", "ndsi"]
  }
]
```

### cURL Example
```bash
curl -X GET "https://observearth.com/api/modis/indices/" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## 7. MODIS Index Metadata & Collections

### Endpoint
`GET /api/modis/info/`

### Operation Summary
`modis_info_list`

### Why It's Used
Returns comprehensive metadata for all supported MODIS collections, spectral formulas, and colormap scaling bounds.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Responses
* **`200 OK`**: MODIS metadata schema definitions.

### cURL Example
```bash
curl -X GET "https://observearth.com/api/modis/info/" \
     -H "X-API-Key: YOUR_API_KEY"
```
