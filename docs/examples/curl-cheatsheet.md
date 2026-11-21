# cURL Command Cheatsheet

Quick reference of ready-to-run `curl` commands for all 56 ObservEarth endpoints. Replace `YOUR_API_KEY`, `YOUR_GEOMETRY_ID`, `SCENE_ID`, `JOB_ID`, and `ALERT_ID` with your actual values.

---

## Authentication & Verification

```bash
# Verify API Key status and quota
curl -X POST "https://observearth.com/api/verify-api-key/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"api_key": "YOUR_API_KEY"}'
```

---

## Geometry / AOI Management

```bash
# 1. List Geometries (Paginated)
curl -X GET "https://observearth.com/api/geometry/?page=1&page_size=20" \
     -H "X-API-Key: YOUR_API_KEY"

# 2. Register New Geometry / AOI
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

# 3. Get Geometry Details & GeoJSON Boundary
curl -X GET "https://observearth.com/api/geometry/YOUR_GEOMETRY_ID/" \
     -H "X-API-Key: YOUR_API_KEY"

# 4. Update Geometry Name / Daily Cron
curl -X PUT "https://observearth.com/api/geometry/YOUR_GEOMETRY_ID/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"name": "Central Valley Field 4 - North Sector", "daily_cron": true}'

# 5. Delete Geometry (Releases Allocated Hectares)
curl -X DELETE "https://observearth.com/api/geometry/YOUR_GEOMETRY_ID/" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## Sentinel-2 (Optical Imagery & Indices)

```bash
# 1. Search Filtered Sentinel-2 Scenes
curl -X POST "https://observearth.com/api/s2/search/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "geometry_id": "YOUR_GEOMETRY_ID",
       "start_date": "2026-05-01",
       "end_date": "2026-05-31",
       "cloud_cover": 20
     }'

# 2. Single Item Statistics (NDVI)
curl -X GET "https://observearth.com/api/s2/stats/YOUR_GEOMETRY_ID/?item_id=S2A_MSIL2A_20260517T183921_R070_T11SKB_20260517T221543&index=ndvi" \
     -H "X-API-Key: YOUR_API_KEY"

# 3. Multi-Scene Time-Series Statistics across Date Range
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

# 4. Render Colormapped Index Image (PNG)
curl -X POST "https://observearth.com/api/s2/image/YOUR_GEOMETRY_ID/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "item_id": "S2A_MSIL2A_20260517T183921_R070_T11SKB_20260517T221543",
       "index": "ndvi",
       "image_type": "png",
       "colormap": "rdylgn"
     }' --output s2_ndvi.png

# 5. All-in-One Multi-Index Bundle (8+ Indices Computed Together)
curl -X POST "https://observearth.com/api/s2/all-in-one/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "geometry_id": "YOUR_GEOMETRY_ID",
       "item_id": "S2A_MSIL2A_20260517T183921_R070_T11SKB_20260517T221543",
       "indices": ["ndvi", "ndwi", "evi", "savi", "ndre", "msavi", "vari"]
     }'

# 6. Fetch Raw Calibrated Spectral Band (NIR Band 8)
curl -X GET "https://observearth.com/api/s2/raw-band/YOUR_GEOMETRY_ID/?item_id=S2A_MSIL2A_20260517T183921_R070_T11SKB_20260517T221543&band=nir&image_type=tif" \
     -H "X-API-Key: YOUR_API_KEY" \
     --output s2_nir_band.tif

# 7. Submit Asynchronous Batch Extraction Job
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

# 8. Poll Asynchronous Batch Job Status
curl -X GET "https://observearth.com/api/s2/data-request/status/JOB_ID/" \
     -H "X-API-Key: YOUR_API_KEY"

# 9. View Asynchronous Job Request History
curl -X GET "https://observearth.com/api/s2/data-request/history/" \
     -H "X-API-Key: YOUR_API_KEY"

# 10. List All 45+ Supported Sentinel-2 Indices
curl -X GET "https://observearth.com/api/s2/info/" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## SEN2SR (2.5m Super-Resolution)

```bash
# 1. Trigger 2.5m Super-Resolution Inference Job
curl -X POST "https://observearth.com/api/s2/sen2sr/generate/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "geometry_id": "YOUR_GEOMETRY_ID",
       "item_id": "S2A_MSIL2A_20260517T183921_R070_T11SKB_20260517T221543",
       "date": "2026-05-17"
     }'

# 2. Check 2.5m Super-Resolution Status
curl -X GET "https://observearth.com/api/s2/sen2sr/status/S2A_MSIL2A_20260517T183921_R070_T11SKB_20260517T221543/" \
     -H "X-API-Key: YOUR_API_KEY"

# 3. Get 2.5m High-Resolution Statistics
curl -X GET "https://observearth.com/api/s2/sen2sr/stats/YOUR_GEOMETRY_ID/?item_id=S2A_MSIL2A_20260517T183921_R070_T11SKB_20260517T221543&index=ndvi" \
     -H "X-API-Key: YOUR_API_KEY"

# 4. Render 2.5m Super-Resolved Raster
curl -X POST "https://observearth.com/api/s2/sen2sr/image/YOUR_GEOMETRY_ID/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "item_id": "S2A_MSIL2A_20260517T183921_R070_T11SKB_20260517T221543",
       "index": "ndvi",
       "image_type": "png",
       "colormap": "rdylgn"
     }' --output sen2sr_ndvi_2_5m.png
```

---

## Sentinel-1 (Radar SAR)

```bash
# 1. Search SAR Scenes
curl -X POST "https://observearth.com/api/s1/search/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "geometry_id": "YOUR_GEOMETRY_ID",
       "start_date": "2026-05-01",
       "end_date": "2026-05-31",
       "polarization": "VV+VH"
     }'

# 2. Single Scene SAR Statistics (e.g. Radar Vegetation Index)
curl -X GET "https://observearth.com/api/s1/stats/YOUR_GEOMETRY_ID/?item_id=S1A_IW_GRDH_1SDV_20260518T014522_053912_068BC1_F321&index=rvi" \
     -H "X-API-Key: YOUR_API_KEY"

# 3. Multi-Scene SAR Time-Series Statistics across Date Range
curl -X POST "https://observearth.com/api/s1/stats/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "geometry_id": "YOUR_GEOMETRY_ID",
       "start_date": "2026-05-01",
       "end_date": "2026-05-31",
       "index": "vv"
     }'

# 4. Render Colormapped SAR Backscatter Image (PNG)
curl -X POST "https://observearth.com/api/s1/image/YOUR_GEOMETRY_ID/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "item_id": "S1A_IW_GRDH_1SDV_20260518T014522_053912_068BC1_F321",
       "index": "vv",
       "image_type": "png",
       "colormap": "gray"
     }' --output s1_vv.png

# 5. All-in-One SAR Multi-Metric Bundle
curl -X POST "https://observearth.com/api/s1/all-in-one/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "geometry_id": "YOUR_GEOMETRY_ID",
       "item_id": "S1A_IW_GRDH_1SDV_20260518T014522_053912_068BC1_F321",
       "indices": ["vv", "vh", "cross_ratio", "rvi", "dprvi"]
     }'

# 6. Fetch Raw SAR Backscatter Band (GeoTIFF)
curl -X GET "https://observearth.com/api/s1/raw-band/YOUR_GEOMETRY_ID/?item_id=S1A_IW_GRDH_1SDV_20260518T014522_053912_068BC1_F321&band=vv&image_type=tif" \
     -H "X-API-Key: YOUR_API_KEY" \
     --output s1_raw_vv.tif

# 7. Submit Asynchronous SAR Batch Request
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

# 8. Poll SAR Batch Status
curl -X GET "https://observearth.com/api/s1/data-request/status/JOB_ID/" \
     -H "X-API-Key: YOUR_API_KEY"

# 9. View SAR Batch History
curl -X GET "https://observearth.com/api/s1/data-request/history/" \
     -H "X-API-Key: YOUR_API_KEY"

# 10. List Supported SAR Metrics & Polarizations
curl -X GET "https://observearth.com/api/s1/info/" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## Landsat 8 & 9 (Operational Land Imager)

```bash
# 1. Search Landsat Scenes
curl -X POST "https://observearth.com/api/landsat/search/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "geometry_id": "YOUR_GEOMETRY_ID",
       "start_date": "2026-05-01",
       "end_date": "2026-05-31",
       "cloud_cover": 20
     }'

# 2. Single Scene Landsat Statistics (NDVI)
curl -X GET "https://observearth.com/api/landsat/stats/YOUR_GEOMETRY_ID/?item_id=LC09_L2SP_042035_20260516_02_T1&index=ndvi" \
     -H "X-API-Key: YOUR_API_KEY"

# 3. Multi-Scene Landsat Time-Series Statistics across Date Range
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

# 4. Render Landsat Colormapped Index Image (PNG)
curl -X POST "https://observearth.com/api/landsat/image/YOUR_GEOMETRY_ID/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "item_id": "LC09_L2SP_042035_20260516_02_T1",
       "index": "ndvi",
       "image_type": "png",
       "colormap": "rdylgn"
     }' --output landsat_ndvi.png

# 5. All-in-One Landsat Multi-Index Bundle
curl -X POST "https://observearth.com/api/landsat/all-in-one/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "geometry_id": "YOUR_GEOMETRY_ID",
       "item_id": "LC09_L2SP_042035_20260516_02_T1",
       "indices": ["ndvi", "ndwi", "evi", "savi"]
     }'

# 6. Fetch Raw Landsat Spectral Band (GeoTIFF)
curl -X GET "https://observearth.com/api/landsat/raw-band/YOUR_GEOMETRY_ID/?item_id=LC09_L2SP_042035_20260516_02_T1&band=nir&image_type=tif" \
     -H "X-API-Key: YOUR_API_KEY" \
     --output landsat_nir.tif

# 7. List Supported Landsat Indices & Bands
curl -X GET "https://observearth.com/api/landsat/info/" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## MODIS (Terra & Aqua Daily Composites)

```bash
# 1. Search MODIS Daily Scenes
curl -X POST "https://observearth.com/api/modis/search/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "geometry_id": "YOUR_GEOMETRY_ID",
       "start_date": "2026-05-01",
       "end_date": "2026-05-31"
     }'

# 2. Single Scene MODIS Statistics
curl -X GET "https://observearth.com/api/modis/stats/YOUR_GEOMETRY_ID/?item_id=MOD09GQ.A2026138.h08v05.061.2026140032015&index=ndvi" \
     -H "X-API-Key: YOUR_API_KEY"

# 3. Multi-Scene MODIS Time-Series Statistics across Date Range
curl -X POST "https://observearth.com/api/modis/stats/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "geometry_id": "YOUR_GEOMETRY_ID",
       "start_date": "2026-05-01",
       "end_date": "2026-05-31",
       "index": "ndvi"
     }'

# 4. Render MODIS Colormapped Index Image
curl -X POST "https://observearth.com/api/modis/image/YOUR_GEOMETRY_ID/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "item_id": "MOD09GQ.A2026138.h08v05.061.2026140032015",
       "index": "ndvi",
       "image_type": "png",
       "colormap": "rdylgn"
     }' --output modis_ndvi.png

# 5. All-in-One MODIS Multi-Index Bundle
curl -X POST "https://observearth.com/api/modis/all-in-one/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "geometry_id": "YOUR_GEOMETRY_ID",
       "item_id": "MOD09GQ.A2026138.h08v05.061.2026140032015",
       "indices": ["ndvi", "evi", "ndwi"]
     }'

# 6. List Supported MODIS Indices & Bands
curl -X GET "https://observearth.com/api/modis/info/" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## Weather & Meteorological Telemetry

```bash
# 1. Current Weather & Sub-Surface Soil Telemetry
curl -X GET "https://observearth.com/api/weather/current/?geometry_id=YOUR_GEOMETRY_ID" \
     -H "X-API-Key: YOUR_API_KEY"

# 2. Hourly Weather Forecast for Today (24 Hours)
curl -X GET "https://observearth.com/api/weather/today/?geometry_id=YOUR_GEOMETRY_ID" \
     -H "X-API-Key: YOUR_API_KEY"

# 3. 16-Day Weather Forecast
curl -X GET "https://observearth.com/api/weather/forecast/?geometry_id=YOUR_GEOMETRY_ID" \
     -H "X-API-Key: YOUR_API_KEY"

# 4. Historical Meteorological Archive
curl -X GET "https://observearth.com/api/weather/historical/?geometry_id=YOUR_GEOMETRY_ID&start_date=2026-05-01&end_date=2026-05-15" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## Air Quality & Atmospheric Pollutants

```bash
# 1. Current Air Quality & European AQI
curl -X GET "https://observearth.com/api/air-quality/current/?geometry_id=YOUR_GEOMETRY_ID" \
     -H "X-API-Key: YOUR_API_KEY"

# 2. Hourly Air Quality Forecast (Next 96 Hours)
curl -X GET "https://observearth.com/api/air-quality/forecast/?geometry_id=YOUR_GEOMETRY_ID" \
     -H "X-API-Key: YOUR_API_KEY"

# 3. Historical Atmospheric Pollutants Archive
curl -X GET "https://observearth.com/api/air-quality/historical/?geometry_id=YOUR_GEOMETRY_ID&start_date=2026-05-01&end_date=2026-05-15" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## Elevation & Topographic Terrain (DEM)

```bash
# 1. Elevation Statistical Summary (JSON)
curl -X GET "https://observearth.com/api/dem/?geometry_id=YOUR_GEOMETRY_ID&format=json" \
     -H "X-API-Key: YOUR_API_KEY"

# 2. Clipped DEM GeoTIFF Raster (30m Copernicus GLO-30)
curl -X GET "https://observearth.com/api/dem/?geometry_id=YOUR_GEOMETRY_ID&format=geotiff" \
     -H "X-API-Key: YOUR_API_KEY" \
     --output elevation_dem.tif

# 3. Topographic Contour Line Vectors (GeoJSON, 10m interval)
curl -X GET "https://observearth.com/api/contours/?geometry_id=YOUR_GEOMETRY_ID&interval=10&format=geojson" \
     -H "X-API-Key: YOUR_API_KEY"

# 4. Slope Incline Analysis
curl -X GET "https://observearth.com/api/slope/?geometry_id=YOUR_GEOMETRY_ID&format=json" \
     -H "X-API-Key: YOUR_API_KEY"

# 5. Aspect Direction Analysis (Degrees Azimuth)
curl -X GET "https://observearth.com/api/aspect/?geometry_id=YOUR_GEOMETRY_ID&format=json" \
     -H "X-API-Key: YOUR_API_KEY"

# 6. Hillshade Relief Raster (PNG)
curl -X GET "https://observearth.com/api/hillshade/?geometry_id=YOUR_GEOMETRY_ID&format=png" \
     -H "X-API-Key: YOUR_API_KEY" \
     --output hillshade.png
```

---

## Automated Alerts & Notifications

```bash
# 1. Create Automated Monitoring Rule
curl -X POST "https://observearth.com/api/alerts/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "geometry_id": "YOUR_GEOMETRY_ID",
       "name": "Vegetation Stress & Drought Watch",
       "logic": "AND",
       "monitor_until": "2026-11-30",
       "conditions": [
         {"index": "ndvi", "operator": "<", "threshold": 0.35},
         {"index": "ndwi", "operator": "<", "threshold": -0.10}
       ]
     }'

# 2. List All Active and Archived Alert Rules
curl -X GET "https://observearth.com/api/alerts/" \
     -H "X-API-Key: YOUR_API_KEY"

# 3. Get Alert Rule Details
curl -X GET "https://observearth.com/api/alerts/ALERT_ID/" \
     -H "X-API-Key: YOUR_API_KEY"

# 4. Update Alert Rule Parameters
curl -X PUT "https://observearth.com/api/alerts/ALERT_ID/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Vegetation Stress - Tightened",
       "logic": "AND",
       "monitor_until": "2026-12-31",
       "conditions": [{"index": "ndvi", "operator": "<", "threshold": 0.30}]
     }'

# 5. Toggle Alert Rule Active / Inactive State
curl -X PATCH "https://observearth.com/api/alerts/ALERT_ID/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"is_active": false}'

# 6. Delete Alert Rule
curl -X DELETE "https://observearth.com/api/alerts/ALERT_ID/" \
     -H "X-API-Key: YOUR_API_KEY"

# 7. List Triggered Alert Notifications
curl -X GET "https://observearth.com/api/alert-notifications/" \
     -H "X-API-Key: YOUR_API_KEY"

# 8. Mark Triggered Notification as Read
curl -X POST "https://observearth.com/api/alert-notifications/NOTIFICATION_ID/read/" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## Platform Analytics & API Usage

```bash
# 1. Current Month API Usage Breakdown
curl -X GET "https://observearth.com/api/analytics/summary/current/" \
     -H "X-API-Key: YOUR_API_KEY"

# 2. Historical Monthly Consumption Summary
curl -X GET "https://observearth.com/api/analytics/summary/history/" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## Utility & Palettes

```bash
# 1. List Supported Raster Colormaps
curl -X GET "https://observearth.com/api/colormaps/" \
     -H "X-API-Key: YOUR_API_KEY"

# 2. Preview Colormap SVG Gradient
curl -X GET "https://observearth.com/api/colormaps/preview/?name=rdylgn" \
     -H "X-API-Key: YOUR_API_KEY"
```
