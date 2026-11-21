# Sentinel-1 (SAR Radar) API

The **Sentinel-1 API** provides all-weather, day-and-night Synthetic Aperture Radar (SAR) imagery acquired by the Copernicus Sentinel-1 constellation (C-band radar, 5.405 GHz). It is used for soil moisture tracking, flood mapping, and crop canopy structure analysis.

---

## 1. Search SAR Scenes

### Endpoint
`POST /api/s1/search/`

### Operation Summary
`s1_search_create`

### Why It's Used
Search the catalog for Sentinel-1 Ground Range Detected (GRD) scenes intersecting a registered geometry.

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
  "polarization": "VV+VH"
}
```

### Responses
* **`200 OK`**: GeoJSON FeatureCollection of matching SAR scenes.

### cURL Example
```bash
curl -X POST "https://observearth.com/api/s1/search/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "geometry_id": "YOUR_GEOMETRY_ID",
       "start_date": "2026-05-01",
       "end_date": "2026-05-31",
       "polarization": "VV+VH"
     }'
```

---

## 2. Single Scene SAR Statistics

### Endpoint
`GET /api/s1/stats/{geometry_id}/`

### Operation Summary
`s1_stats_read`

### Why It's Used
Calculates backscatter statistics (dB) or dual-polarization index values for a single Sentinel-1 SAR acquisition.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Query Parameters
| Parameter | Type | Description | Required |
|---|---|---|---|
| `item_id` | String | Sentinel-1 Scene Item ID | Yes |
| `index` | String | SAR Metric: `vv`, `vh`, `cross_ratio`, `rvi`, `dprvi` | Yes |

### Responses
* **`200 OK`**: Zonal statistics object (mean, median, min, max, std).

### cURL Example
```bash
curl -X GET "https://observearth.com/api/s1/stats/YOUR_GEOMETRY_ID/?item_id=S1A_IW_GRDH_1SDV_20260518T014522_053912_068BC1_F321&index=vv" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## 3. Date Range SAR Statistics (Time-Series)

### Endpoint
`POST /api/s1/stats/`

### Operation Summary
`s1_stats_create`

### Why It's Used
Calculates a timeseries of backscatter or radar vegetation indices across all SAR passes within a date range.

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
  "index": "vv"
}
```

### Responses
* **`200 OK`**: Array of SAR statistical metrics per acquisition date.

### cURL Example
```bash
curl -X POST "https://observearth.com/api/s1/stats/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "geometry_id": "YOUR_GEOMETRY_ID",
       "start_date": "2026-05-01",
       "end_date": "2026-05-31",
       "index": "vv"
     }'
```

---

## 4. Render SAR Image

### Endpoint
`GET /api/s1/image/{geometry_id}/`

### Operation Summary
`s1_image_read`

### Why It's Used
Renders a colormapped PNG or single-band 32-bit floating-point decibel GeoTIFF clipped to the geometry boundary.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Query Parameters
| Parameter | Type | Description | Required | Default |
|---|---|---|---|---|
| `item_id` | String | Sentinel-1 Scene Item ID | Yes | - |
| `index` | String | Metric: `vv`, `vh`, `cross_ratio`, `rvi`, `dprvi` | No | `vv` |
| `image_type` | String | `png` or `tif` | No | `png` |
| `colormap` | String | Colormap palette (e.g. `gray`, `viridis`) | No | `gray` |

### Responses
* **`200 OK`**: Image binary stream (`image/png` or `image/tiff`).

### cURL Example
```bash
curl -X GET "https://observearth.com/api/s1/image/YOUR_GEOMETRY_ID/?item_id=S1A_IW_GRDH_1SDV_20260518T014522_053912_068BC1_F321&index=vv&image_type=png&colormap=gray" \
     -H "X-API-Key: YOUR_API_KEY" \
     --output s1_vv.png
```

---

## 5. All-in-One SAR Multi-Metric Bundle

### Endpoint
`POST /api/s1/all-in-one/`

### Operation Summary
`s1_all-in-one_create`

### Why It's Used
Calculates all core SAR polarizations and radar indices simultaneously in a single parallel payload.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |
| `Content-Type` | String | `application/json` | Yes |

### Request Body
```json
{
  "geometry_id": "123e4567-e89b-12d3-a456-426614174000",
  "item_id": "S1A_IW_GRDH_1SDV_20260518T014522_053912_068BC1_F321",
  "indices": ["vv", "vh", "cross_ratio", "rvi", "dprvi"]
}
```

### Responses
* **`200 OK`**: Object mapping SAR metric names to statistical results.

### cURL Example
```bash
curl -X POST "https://observearth.com/api/s1/all-in-one/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "geometry_id": "YOUR_GEOMETRY_ID",
       "item_id": "S1A_IW_GRDH_1SDV_20260518T014522_053912_068BC1_F321",
       "indices": ["vv", "vh", "cross_ratio", "rvi", "dprvi"]
     }'
```

---

## 6. Raw SAR Backscatter Band

### Endpoint
`GET /api/s1/raw-band/{geometry_id}/`

### Operation Summary
`s1_raw-band_read`

### Why It's Used
Download calibrated raw Sentinel-1 radar backscatter amplitude or decibel GeoTIFF for external SAR processing.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Query Parameters
| Parameter | Type | Description | Required | Default |
|---|---|---|---|---|
| `item_id` | String | Sentinel-1 Scene Item ID | Yes | - |
| `band` | String | Polarization band: `vv` or `vh` | Yes | - |
| `image_type` | String | `png` or `tif` | No | `tif` |

### Responses
* **`200 OK`**: GeoTIFF raster stream.

### cURL Example
```bash
curl -X GET "https://observearth.com/api/s1/raw-band/YOUR_GEOMETRY_ID/?item_id=S1A_IW_GRDH_1SDV_20260518T014522_053912_068BC1_F321&band=vv&image_type=tif" \
     -H "X-API-Key: YOUR_API_KEY" \
     --output s1_raw_vv.tif
```

---

## 7. Submit Asynchronous SAR Data Request

### Endpoint
`POST /api/s1/data-request/`

### Operation Summary
`s1_data-request_create`

### Why It's Used
Submits an asynchronous background Celery batch extraction job for multi-date SAR rasters.

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
  "index": "vv",
  "format": "geotiff"
}
```

### Responses
* **`202 Accepted`**:
```json
{
  "job_id": "e4f5a6b7-c8d9-0123-4567-89abcdef0123",
  "status": "pending",
  "message": "SAR batch extraction queued."
}
```

### cURL Example
```bash
curl -X POST "https://observearth.com/api/s1/data-request/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "geometry_id": "YOUR_GEOMETRY_ID",
       "start_date": "2026-05-01",
       "end_date": "2026-05-31",
       "index": "vv",
       "format": "geotiff"
     }'
```

---

## 8. Asynchronous SAR Job Status

### Endpoint
`GET /api/s1/data-request/status/{job_id}/`

### Operation Summary
`s1_data-request_status_read`

### Why It's Used
Poll status and download artifact URL for a queued SAR batch job.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Responses
* **`200 OK`**:
```json
{
  "job_id": "e4f5a6b7-c8d9-0123-4567-89abcdef0123",
  "status": "completed",
  "download_url": "https://observearth.com/media/exports/s1_vv_batch.zip"
}
```

### cURL Example
```bash
curl -X GET "https://observearth.com/api/s1/data-request/status/JOB_ID/" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## 9. Asynchronous SAR Job History

### Endpoint
`GET /api/s1/data-request/history/`

### Operation Summary
`s1_data-request_history_list`

### Why It's Used
View all past background SAR extraction jobs and archive download links.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Responses
* **`200 OK`**: Array of historical SAR batch jobs.

### cURL Example
```bash
curl -X GET "https://observearth.com/api/s1/data-request/history/" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## 10. List Supported SAR Polarizations & Metrics

### Endpoint
`GET /api/s1/info/`

### Operation Summary
`s1_info_list`

### Why It's Used
Retrieve specifications of supported Sentinel-1 polarizations (`VV`, `VH`, `HH`, `HV`) and radar indices (`RVI`, `DpRVI`).

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Responses
* **`200 OK`**: Supported radar index formulations and scaling metadata.

### cURL Example
```bash
curl -X GET "https://observearth.com/api/s1/info/" \
     -H "X-API-Key: YOUR_API_KEY"
```
