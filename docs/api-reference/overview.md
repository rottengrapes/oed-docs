# API Overview & Standards

The ObservEarth REST API provides unified access to multi-constellation satellite imagery, meteorological telemetry, terrain elevation models, and environmental analytics.

---

## Base URL

All API requests are served over HTTPS:

```
Production: https://observearth.com/api/
Local Dev:   http://localhost:8000/api/
```

---

## Authentication Header

Every request requires your API key passed in the `X-API-Key` HTTP header:

```http
X-API-Key: 123e4567-e89b-12d3-a456-426614174000
Content-Type: application/json
```

---

## Standard HTTP Status Codes

ObservEarth adheres strictly to RESTful conventions and standard HTTP status codes:

| Code | Status | Meaning |
|---|---|---|
| `200 OK` | Success | Request succeeded. Response body contains requested resource or results. |
| `201 Created` | Created | Resource successfully created (e.g., Geometry, Alert). Location and details returned. |
| `202 Accepted` | Processing | Request accepted for asynchronous processing (e.g., Batch Data Request). |
| `204 No Content` | Deleted | Resource successfully deleted. No response body returned. |
| `400 Bad Request` | Validation Error | Missing parameters, invalid GeoJSON, bad date formats, or area limits exceeded. |
| `401 Unauthorized` | Auth Missing | No `X-API-Key` header provided or invalid key. |
| `403 Forbidden` | Auth Invalid | API key is inactive or lacks permission for the requested service. |
| `404 Not Found` | Not Found | Requested `geometry_id`, `job_id`, or `alert_id` does not exist. |
| `429 Too Many Requests`| Rate Limited | Exceeded per-minute or monthly call allowance. Includes `Retry-After` header. |
| `500 Server Error` | Internal Error | Unexpected server error. Contact office@rottengrapes.tech if persistent. |

---

## Universal Error Response Format

When an API call returns a `4xx` or `5xx` error, the response payload contains a standardized JSON error message:

```json
{
  "error": "Descriptive error message explaining what failed",
  "detail": "Optional auxiliary technical details or field validation breakdowns"
}
```

---

## Geometry Identification Convention

In ObservEarth, all satellite, weather, and terrain queries bind to a registered AOI identified by its `geometry_id` (a UUIDv4 string):

* **Path Parameter Style**: `/api/s2/image/{geometry_id}/`
* **Query Parameter Style**: `/api/weather/current/?geometry_id={geometry_id}`
* **JSON Body Parameter Style**: `{"geometry_id": "123e4567-e89b-12d3-a456-426614174000", ...}`

---

## Supported Output Formats

Depending on the endpoint, ObservEarth supports multiple response formats:

* **`application/json`**: GeoJSON FeatureCollections, statistical summaries, search results, weather forecasts, and usage logs.
* **`image/png`**: Rendered true-color RGB or colormapped vegetation index rasters with transparent backgrounds.
* **`image/tiff` / `image/geotiff`**: Calibrated multi-band or single-band 32-bit floating-point Cloud-Optimized GeoTIFFs (COG) with embedded geospatial metadata (CRS, Affine transformation).

---

## Complete API Route Index

Every endpoint registered in the ObservEarth public API is listed below:

| Domain / Tag | Method | Endpoint Path | Operation ID | Documentation |
|---|---|---|---|---|
| **air-quality** | `GET` | `/api/air-quality/current/` | `air-quality_current_list` | [Air Quality API](air-quality.md#1-current-air-quality) |
| | `GET` | `/api/air-quality/forecast/` | `air-quality_forecast_list` | [Air Quality API](air-quality.md#3-air-quality-forecast) |
| | `GET` | `/api/air-quality/historical/` | `air-quality_historical_list` | [Air Quality API](air-quality.md#4-historical-air-quality) |
| | `GET` | `/api/air-quality/today/` | `air-quality_today_list` | [Air Quality API](air-quality.md#2-todays-air-quality) |
| **alert-notifications** | `GET` | `/api/alert-notifications/` | `alert-notifications_list` | [Alerts API](alerts.md#5-list-alert-notifications) |
| **alerts** | `GET` | `/api/alerts/` | `alerts_list` | [Alerts API](alerts.md#1-list-index-alerts) |
| | `POST` | `/api/alerts/` | `alerts_create` | [Alerts API](alerts.md#2-create-index-alert) |
| | `PATCH` | `/api/alerts/{alert_id}/` | `alerts_partial_update` | [Alerts API](alerts.md#3-toggle-alert-active-status) |
| | `DELETE` | `/api/alerts/{alert_id}/` | `alerts_delete` | [Alerts API](alerts.md#4-delete-alert) |
| **analytics** | `GET` | `/api/analytics/logs/` | `analytics_logs_list` | [Analytics API](analytics.md#1-analytics-logs) |
| | `GET` | `/api/analytics/summary/` | `analytics_summary_list` | [Analytics API](analytics.md#2-monthly-historical-summary) |
| | `GET` | `/api/analytics/summary/current/` | `analytics_summary_current_list` | [Analytics API](analytics.md#3-current-month-analytics-summary) |
| **contours** | `POST` | `/api/contours/` | `contours_create` | [DEM & Contours API](dem-elevation.md#2-topographic-contours) |
| **dem** | `POST` | `/api/dem/` | `dem_create` | [DEM & Contours API](dem-elevation.md#1-digital-elevation-model-dem) |
| **geometry** | `GET` | `/api/geometry/` | `geometry_list` | [Geometry API](geometry.md#1-list-geometries) |
| | `POST` | `/api/geometry/` | `geometry_create` | [Geometry API](geometry.md#2-create-geometry) |
| | `GET` | `/api/geometry/{geometry_id}/` | `geometry_read` | [Geometry API](geometry.md#3-get-geometry-details) |
| | `PUT` | `/api/geometry/{geometry_id}/` | `geometry_update` | [Geometry API](geometry.md#4-update-geometry) |
| | `DELETE` | `/api/geometry/{geometry_id}/` | `geometry_delete` | [Geometry API](geometry.md#5-delete-geometry) |
| **landsat** | `POST` | `/api/landsat/all-in-one/` | `landsat_all-in-one_create` | [Landsat API](landsat.md#5-all-in-one-multi-index-bundle) |
| | `GET` | `/api/landsat/image/{geometry_id}/` | `landsat_image_read` | [Landsat API](landsat.md#4-render-landsat-image) |
| | `GET` | `/api/landsat/info/` | `landsat_info_list` | [Landsat API](landsat.md#6-list-supported-landsat-indices) |
| | `POST` | `/api/landsat/search/` | `landsat_search_create` | [Landsat API](landsat.md#1-search-landsat-scenes) |
| | `POST` | `/api/landsat/stats/` | `landsat_stats_create` | [Landsat API](landsat.md#3-date-range-landsat-statistics-time-series) |
| | `GET` | `/api/landsat/stats/{geometry_id}/` | `landsat_stats_read` | [Landsat API](landsat.md#2-single-scene-landsat-statistics) |
| **misc** | `GET` | `/api/misc/colors/` | `misc_colors_list` | [Utility API](misc.md#1-list-colormaps) |
| | `GET` | `/api/misc/legend/` | `misc_legend_list` | [Utility API](misc.md#2-generate-dynamic-legend) |
| **modis** | `POST` | `/api/modis/all-in-one/` | `modis_all-in-one_create` | [MODIS API](modis.md#5-all-in-one-multi-index-bundle) |
| | `GET` | `/api/modis/image/{geometry_id}/` | `modis_image_read` | [MODIS API](modis.md#4-render-modis-image) |
| | `GET` | `/api/modis/indices/` | `modis_indices_list` | [MODIS API](modis.md#6-list-modis-indices-by-collection) |
| | `GET` | `/api/modis/info/` | `modis_info_list` | [MODIS API](modis.md#7-modis-index-metadata--collections) |
| | `POST` | `/api/modis/search/` | `modis_search_create` | [MODIS API](modis.md#1-search-modis-scenes) |
| | `POST` | `/api/modis/stats/` | `modis_stats_create` | [MODIS API](modis.md#3-date-range-modis-statistics-time-series) |
| | `GET` | `/api/modis/stats/{geometry_id}/` | `modis_stats_read` | [MODIS API](modis.md#2-single-scene-modis-statistics) |
| **s1** | `POST` | `/api/s1/all-in-one/` | `s1_all-in-one_create` | [Sentinel-1 API](sentinel-1.md#5-all-in-one-sar-multi-metric-bundle) |
| | `POST` | `/api/s1/data-request/` | `s1_data-request_create` | [Sentinel-1 API](sentinel-1.md#7-submit-asynchronous-sar-data-request) |
| | `GET` | `/api/s1/data-request/history/` | `s1_data-request_history_list` | [Sentinel-1 API](sentinel-1.md#9-asynchronous-sar-job-history) |
| | `GET` | `/api/s1/data-request/status/{job_id}/` | `s1_data-request_status_read` | [Sentinel-1 API](sentinel-1.md#8-asynchronous-sar-job-status) |
| | `GET` | `/api/s1/image/{geometry_id}/` | `s1_image_read` | [Sentinel-1 API](sentinel-1.md#4-render-sar-image) |
| | `GET` | `/api/s1/info/` | `s1_info_list` | [Sentinel-1 API](sentinel-1.md#10-list-supported-sar-polarizations--metrics) |
| | `GET` | `/api/s1/raw-band/{geometry_id}/` | `s1_raw-band_read` | [Sentinel-1 API](sentinel-1.md#6-raw-sar-backscatter-band) |
| | `POST` | `/api/s1/search/` | `s1_search_create` | [Sentinel-1 API](sentinel-1.md#1-search-sar-scenes) |
| | `POST` | `/api/s1/stats/` | `s1_stats_create` | [Sentinel-1 API](sentinel-1.md#3-date-range-sar-statistics-time-series) |
| | `GET` | `/api/s1/stats/{geometry_id}/` | `s1_stats_read` | [Sentinel-1 API](sentinel-1.md#2-single-scene-sar-statistics) |
| **s2** | `POST` | `/api/s2/all-in-one/` | `s2_all-in-one_create` | [Sentinel-2 API](sentinel-2.md#5-all-in-one-multi-index-bundle) |
| | `POST` | `/api/s2/data-request/` | `s2_data-request_create` | [Sentinel-2 API](sentinel-2.md#7-submit-asynchronous-data-request) |
| | `GET` | `/api/s2/data-request/history/` | `s2_data-request_history_list` | [Sentinel-2 API](sentinel-2.md#9-asynchronous-job-request-history) |
| | `GET` | `/api/s2/data-request/status/{job_id}/` | `s2_data-request_status_read` | [Sentinel-2 API](sentinel-2.md#8-asynchronous-job-status) |
| | `GET` | `/api/s2/image/{geometry_id}/` | `s2_image_read` | [Sentinel-2 API](sentinel-2.md#4-render-sentinel-2-image) |
| | `GET` | `/api/s2/info/` | `s2_info_list` | [Sentinel-2 API](sentinel-2.md#10-list-supported-sentinel-2-indices) |
| | `GET` | `/api/s2/raw-band/{geometry_id}/` | `s2_raw-band_read` | [Sentinel-2 API](sentinel-2.md#6-raw-spectral-band-geotiff) |
| | `POST` | `/api/s2/search/` | `s2_search_create` | [Sentinel-2 API](sentinel-2.md#1-search-for-imagery) |
| | `POST` | `/api/s2/stats/` | `s2_stats_create` | [Sentinel-2 API](sentinel-2.md#3-date-range-sentinel-2-statistics-time-series) |
| | `GET` | `/api/s2/stats/{geometry_id}/` | `s2_stats_read` | [Sentinel-2 API](sentinel-2.md#2-single-scene-sentinel-2-statistics) |
| **verify-api-key** | `POST` | `/api/verify-api-key/` | `verify-api-key_create` | [Utility API](misc.md#3-verify-api-key) |
| **weather** | `GET` | `/api/weather/current/` | `weather_current_list` | [Weather API](weather.md#1-current-weather--agronomic-telemetry) |
| | `GET` | `/api/weather/forecast/` | `weather_forecast_list` | [Weather API](weather.md#3-16-day-weather-forecast) |
| | `GET` | `/api/weather/historical/` | `weather_historical_list` | [Weather API](weather.md#4-historical-weather-archive) |
| | `GET` | `/api/weather/today/` | `weather_today_list` | [Weather API](weather.md#2-todays-hourly-weather-forecast) |
