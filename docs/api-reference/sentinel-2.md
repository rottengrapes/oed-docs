# Sentinel-2 (Optical) API

The **Sentinel-2 API** provides access to high-resolution (10m and 20m) multispectral imagery acquired by the Copernicus Sentinel-2 constellation (Sentinel-2A and Sentinel-2B). ObservEarth processes Sentinel-2 Level-2A Bottom-Of-Atmosphere (BOA) surface reflectance with automatic cloud masking and index computation.

---

## 1. Search for Imagery

### Endpoint
`POST /api/s2/search/`

### Operation Summary
`s2_search_create`

### Why It's Used
Query the planetary STAC catalog for cloud-filtered Sentinel-2 Level-2A scenes intersecting your registered geometry within a specified date window.

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
* **`200 OK`**: GeoJSON FeatureCollection containing discovered scenes with cloud cover percentages, acquisition timestamps, and STAC item IDs.

### cURL Example
```bash
curl -X POST "https://observearth.com/api/s2/search/" \
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

## 2. Single Scene Sentinel-2 Statistics

### Endpoint
`GET /api/s2/stats/{geometry_id}/`

### Operation Summary
`s2_stats_read`

### Why It's Used
Calculates field-level zonal statistics (mean, median, min, max, std, valid/masked pixels, percentiles) for a specific Sentinel-2 scene and spectral index.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Query Parameters
| Parameter | Type | Description | Required | Default |
|---|---|---|---|---|
| `item_id` | String | Sentinel-2 Scene Item ID | Yes | - |
| `index` | String | Spectral Index (e.g. `ndvi`, `ndwi`, `evi`, `savi`) | Yes | - |

### Responses
* **`200 OK`**:
```json
{
  "item_id": "S2A_MSIL2A_20260517T183921_R070_T11SKB_20260517T221543",
  "index": "ndvi",
  "mean": 0.542,
  "median": 0.531,
  "min": 0.124,
  "max": 0.887,
  "std": 0.112,
  "sum": 889.96,
  "p2": 0.184,
  "p98": 0.812,
  "valid_pixels": 1642,
  "masked_pixels": 45,
  "coverage_percentage": 97.33
}
```

### cURL Example
```bash
curl -X GET "https://observearth.com/api/s2/stats/YOUR_GEOMETRY_ID/?item_id=S2A_MSIL2A_20260517T183921_R070_T11SKB_20260517T221543&index=ndvi" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## 3. Date Range Sentinel-2 Statistics (Time-Series)

### Endpoint
`POST /api/s2/stats/`

### Operation Summary
`s2_stats_create`

### Why It's Used
Calculates an aggregate statistical timeseries for an index across all valid Sentinel-2 acquisitions within a date range.

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
curl -X POST "https://observearth.com/api/s2/stats/" \
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

## 4. Render Sentinel-2 Image

### Endpoint
`GET /api/s2/image/{geometry_id}/`

### Operation Summary
`s2_image_read`

### Why It's Used
Renders a colormapped PNG or single-band 32-bit floating-point GeoTIFF clipped to the geometry boundary.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Query Parameters
| Parameter | Type | Description | Required | Default |
|---|---|---|---|---|
| `item_id` | String | Sentinel-2 Scene Item ID | Yes | - |
| `index` | String | Index or RGB (e.g. `ndvi`, `rgb`, `ndwi`) | No | `rgb` |
| `image_type` | String | `png` or `tif` | No | `png` |
| `colormap` | String | Visualization palette (e.g. `rdylgn`) | No | `rdylgn` |
| `min` | Number | Custom stretch minimum | No | - |
| `max` | Number | Custom stretch maximum | No | - |
| `pixelized` | Boolean | True disables bilinear interpolation | No | `false` |

### Responses
* **`200 OK`**: Image binary stream (`image/png` or `image/tiff`).

### cURL Example
```bash
curl -X GET "https://observearth.com/api/s2/image/YOUR_GEOMETRY_ID/?item_id=S2A_MSIL2A_20260517T183921_R070_T11SKB_20260517T221543&index=ndvi&image_type=png&colormap=rdylgn" \
     -H "X-API-Key: YOUR_API_KEY" \
     --output s2_ndvi.png
```

---

## 5. All-in-One Multi-Index Bundle

### Endpoint
`POST /api/s2/all-in-one/`

### Operation Summary
`s2_all-in-one_create`

### Why It's Used
Calculates statistical summaries across 8+ spectral indices simultaneously in a single parallel payload for a Sentinel-2 scene.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |
| `Content-Type` | String | `application/json` | Yes |

### Request Body
```json
{
  "geometry_id": "123e4567-e89b-12d3-a456-426614174000",
  "item_id": "S2A_MSIL2A_20260517T183921_R070_T11SKB_20260517T221543",
  "indices": ["ndvi", "ndwi", "evi", "savi", "ndre", "msavi", "vari"]
}
```

### Responses
* **`200 OK`**: Object mapping index names to computed statistics.

### cURL Example
```bash
curl -X POST "https://observearth.com/api/s2/all-in-one/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "geometry_id": "YOUR_GEOMETRY_ID",
       "item_id": "S2A_MSIL2A_20260517T183921_R070_T11SKB_20260517T221543",
       "indices": ["ndvi", "ndwi", "evi", "savi", "ndre", "msavi", "vari"]
     }'
```

---

## 6. Raw Spectral Band GeoTIFF

### Endpoint
`GET /api/s2/raw-band/{geometry_id}/`

### Operation Summary
`s2_raw-band_read`

### Why It's Used
Download raw calibrated Bottom-Of-Atmosphere reflectance bands (B02 Blue, B03 Green, B04 Red, B08 NIR, B11 SWIR1, B12 SWIR2, etc.) as unscaled Cloud-Optimized GeoTIFFs.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Query Parameters
| Parameter | Type | Description | Required | Default |
|---|---|---|---|---|
| `item_id` | String | Sentinel-2 Scene Item ID | Yes | - |
| `band` | String | Spectral band name (`blue`, `green`, `red`, `nir`, `swir16`, `swir22`, `rededge1`, etc.) | Yes | - |
| `image_type` | String | `png` or `tif` | No | `tif` |

### Responses
* **`200 OK`**: GeoTIFF raster stream.

### cURL Example
```bash
curl -X GET "https://observearth.com/api/s2/raw-band/YOUR_GEOMETRY_ID/?item_id=S2A_MSIL2A_20260517T183921_R070_T11SKB_20260517T221543&band=nir&image_type=tif" \
     -H "X-API-Key: YOUR_API_KEY" \
     --output s2_nir_band.tif
```

---

## 7. Submit Asynchronous Data Request

### Endpoint
`POST /api/s2/data-request/`

### Operation Summary
`s2_data-request_create`

### Why It's Used
Submits an asynchronous background Celery batch extraction job for multi-date Sentinel-2 rasters or timeseries.

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
  "cloud_cover": 15,
  "format": "geotiff"
}
```

### Responses
* **`202 Accepted`**:
```json
{
  "job_id": "c7d8e9f0-1234-5678-90ab-cdef01234567",
  "status": "pending",
  "message": "Batch extraction job submitted successfully."
}
```

### cURL Example
```bash
curl -X POST "https://observearth.com/api/s2/data-request/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "geometry_id": "YOUR_GEOMETRY_ID",
       "start_date": "2026-05-01",
       "end_date": "2026-05-31",
       "index": "ndvi",
       "cloud_cover": 15,
       "format": "geotiff"
     }'
```

---

## 8. Asynchronous Job Status

### Endpoint
`GET /api/s2/data-request/status/{job_id}/`

### Operation Summary
`s2_data-request_status_read`

### Why It's Used
Poll status and download artifact URL for a queued Sentinel-2 batch extraction job.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Responses
* **`200 OK`**:
```json
{
  "job_id": "c7d8e9f0-1234-5678-90ab-cdef01234567",
  "status": "completed",
  "download_url": "https://observearth.com/media/exports/s2_ndvi_batch.zip"
}
```

### cURL Example
```bash
curl -X GET "https://observearth.com/api/s2/data-request/status/JOB_ID/" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## 9. Asynchronous Job Request History

### Endpoint
`GET /api/s2/data-request/history/`

### Operation Summary
`s2_data-request_history_list`

### Why It's Used
View all past background Sentinel-2 extraction jobs and archive download links.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Responses
* **`200 OK`**: Array of historical batch extraction jobs.

### cURL Example
```bash
curl -X GET "https://observearth.com/api/s2/data-request/history/" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## 10. List Supported Sentinel-2 Indices

### Endpoint
`GET /api/s2/info/`

### Operation Summary
`s2_info_list`

### Why It's Used
Retrieve the catalog of over 45 supported Sentinel-2 spectral indices, required bands, mathematical formulas, and colormap stretch boundaries.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Responses
* **`200 OK`**: Array of index metadata specifications.

### cURL Example
```bash
curl -X GET "https://observearth.com/api/s2/info/" \
     -H "X-API-Key: YOUR_API_KEY"
```
