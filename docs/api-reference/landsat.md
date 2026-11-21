# Landsat 8 & 9 API

The **Landsat API** provides access to the USGS / NASA Landsat 8 and Landsat 9 Operational Land Imager (OLI) and Thermal Infrared Sensor (TIRS) collections, delivering 30m multispectral imagery and thermal surface observations.

---

## 1. Search Landsat Scenes

### Endpoint
`POST /api/landsat/search/`

### Operation Summary
`landsat_search_create`

### Why It's Used
Query the planetary STAC catalog for cloud-filtered Landsat 8 and 9 Level-2 Collection 2 Tier 1 scenes intersecting your geometry.

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
  "cloud_cover": 20
}
```

| Field | Type | Description | Required | Default |
|---|---|---|---|---|
| `geometry_id` | String (UUID) | UUID of the registered geometry | Yes | - |
| `start_date` | String | Start date (`YYYY-MM-DD`) | Yes | - |
| `end_date` | String | End date (`YYYY-MM-DD`) | Yes | - |
| `cloud_cover` | Integer | Maximum cloud cover percentage (0-100) | No | `100` |

### Responses
* **`200 OK`**: GeoJSON FeatureCollection of matching Landsat scenes with metadata and asset URLs.

### cURL Example
```bash
curl -X POST "https://observearth.com/api/landsat/search/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "geometry_id": "YOUR_GEOMETRY_ID",
       "start_date": "2026-05-01",
       "end_date": "2026-05-31",
       "cloud_cover": 20
     }'
```

---

## 2. Single Scene Landsat Statistics

### Endpoint
`GET /api/landsat/stats/{geometry_id}/`

### Operation Summary
`landsat_stats_read`

### Why It's Used
Compute statistical summary metrics (mean, median, min, max, std, valid pixels) for a specified index across a single Landsat scene.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Query Parameters
| Parameter | Type | Description | Required |
|---|---|---|---|
| `item_id` | String | Landsat Scene Item ID | Yes |
| `index` | String | Index name (e.g. `ndvi`, `ndwi`, `evi`, `savi`) | Yes |

### Responses
* **`200 OK`**:
```json
{
  "item_id": "LC09_L2SP_042035_20260516_02_T1",
  "index": "ndvi",
  "mean": 0.421,
  "median": 0.410,
  "min": 0.082,
  "max": 0.795,
  "std": 0.124,
  "valid_pixels": 1520,
  "masked_pixels": 34
}
```

### cURL Example
```bash
curl -X GET "https://observearth.com/api/landsat/stats/YOUR_GEOMETRY_ID/?item_id=LC09_L2SP_042035_20260516_02_T1&index=ndvi" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## 3. Date Range Landsat Statistics (Time-Series)

### Endpoint
`POST /api/landsat/stats/`

### Operation Summary
`landsat_stats_create`

### Why It's Used
Calculates a multi-scene statistical timeseries for a specified index across all valid Landsat acquisitions within a date range.

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
  "index": "ndvi",
  "cloud_cover": 20
}
```

### Responses
* **`200 OK`**: Array of statistical summaries per acquisition date.

### cURL Example
```bash
curl -X POST "https://observearth.com/api/landsat/stats/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "geometry_id": "YOUR_GEOMETRY_ID",
       "start_date": "2026-05-01",
       "end_date": "2026-05-31",
       "index": "ndvi",
       "cloud_cover": 20
     }'
```

---

## 4. Render Landsat Image

### Endpoint
`GET /api/landsat/image/{geometry_id}/`

### Operation Summary
`landsat_image_read`

### Why It's Used
Renders a colormapped PNG or single-band 32-bit floating-point GeoTIFF clipped precisely to the geometry boundary.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Query Parameters
| Parameter | Type | Description | Required | Default |
|---|---|---|---|---|
| `item_id` | String | Landsat Scene Item ID | Yes | - |
| `index` | String | Index or RGB (e.g. `ndvi`, `rgb`, `ndwi`) | No | `rgb` |
| `image_type` | String | `png` or `tif` | No | `png` |
| `colormap` | String | Visualization palette (e.g. `rdylgn`) | No | `rdylgn` |
| `min` | Number | Custom stretch minimum | No | - |
| `max` | Number | Custom stretch maximum | No | - |

### Responses
* **`200 OK`**: Image binary stream (`image/png` or `image/tiff`).

### cURL Example
```bash
curl -X GET "https://observearth.com/api/landsat/image/YOUR_GEOMETRY_ID/?item_id=LC09_L2SP_042035_20260516_02_T1&index=ndvi&image_type=png&colormap=rdylgn" \
     -H "X-API-Key: YOUR_API_KEY" \
     --output landsat_ndvi.png
```

---

## 5. All-in-One Multi-Index Bundle

### Endpoint
`POST /api/landsat/all-in-one/`

### Operation Summary
`landsat_all-in-one_create`

### Why It's Used
Computes statistical zonal summaries across multiple spectral indices in a single parallel payload for a Landsat scene.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |
| `Content-Type` | String | `application/json` | Yes |

### Request Body
```json
{
  "geometry_id": "123e4567-e89b-12d3-a456-426614174000",
  "item_id": "LC09_L2SP_042035_20260516_02_T1",
  "indices": ["ndvi", "ndwi", "evi", "savi"]
}
```

### Responses
* **`200 OK`**: Object mapping index names to computed statistics.

### cURL Example
```bash
curl -X POST "https://observearth.com/api/landsat/all-in-one/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "geometry_id": "YOUR_GEOMETRY_ID",
       "item_id": "LC09_L2SP_042035_20260516_02_T1",
       "indices": ["ndvi", "ndwi", "evi", "savi"]
     }'
```

---

## 6. List Supported Landsat Indices

### Endpoint
`GET /api/landsat/info/`

### Operation Summary
`landsat_info_list`

### Why It's Used
Retrieve the catalog of all supported Landsat spectral indices, required sensor bands, mathematical formulas, and colormap stretch boundaries.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Responses
* **`200 OK`**: Array of index metadata specifications.

### cURL Example
```bash
curl -X GET "https://observearth.com/api/landsat/info/" \
     -H "X-API-Key: YOUR_API_KEY"
```
