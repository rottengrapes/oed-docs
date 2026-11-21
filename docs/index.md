# ObservEarth Documentation

Welcome to the official developer and user documentation for **ObservEarth** — the next-generation Earth Observation (EO), satellite remote sensing, weather, and environmental analytics platform.

---

## What is ObservEarth?

ObservEarth empowers developers, agritech firms, researchers, forestry managers, urban planners, and environmental analysts to seamlessly access, analyze, and visualize high-resolution multi-spectral and radar satellite imagery alongside hyper-local weather and air quality datasets.

Instead of wrestling with complex raw geospatial data pipelines, gigabyte-sized GeoTIFFs, or complex atmospheric correction algorithms, ObservEarth provides unified RESTful APIs and an intuitive web dashboard.

```
                           +---------------------------+
                           |   ObservEarth API Gateway |
                           |  (Authentication: UUID)   |
                           +-------------+-------------+
                                         |
     +-------------------+---------------+-------------------+-------------------+
     |                   |                                   |                   |
+----+----+         +----+----+                         +----+----+         +----+----+
| Sentinel|         | Sentinel|                         | Landsat |         | Weather |
| -2 L2A  |         | -1 SAR  |                         |  8 & 9  |         |   & AQ  |
+----+----+         +----+----+                         +----+----+         +----+----+
     |                   |                                   |                   |
     |                   |                                   |                   |
+----+----+         +----+----+                         +----+----+         +----+----+
| 2.5m    |         | Radar   |                         | 30m     |         | Current |
| SEN2SR  |         | Polar   |                         | Thermal |         | Hourly  |
| SuperRes|         | Backscat|                         | Indices |         | Forecast|
+---------+         +---------+                         +---------+         +---------+
```

---

## Core Capabilities

### 🛰️ Multi-Constellation Satellite Imagery

* **Sentinel-2 L2A (10m / 20m)**: Complete European Space Agency (ESA) surface reflectance imagery with automated cloud masking and over 45 vegetation, water, soil, and fire indices.
* **SEN2SR 2.5m Super-Resolution**: Deep learning super-resolution pipeline upscaling 10-band Sentinel-2 imagery to ultra-sharp 2.5m resolution for precision agriculture.
* **Sentinel-1 C-Band SAR (10m)**: Cloud-penetrating all-weather Synthetic Aperture Radar for day and night moisture, flood, and surface structure monitoring across VV and VH polarizations.
* **Landsat 8 & 9 Collection 2 Level 2 (30m)**: USGS and NASA optical and thermal infrared bands for long-term multi-decadal environmental trend tracking.
* **MODIS Terra & Aqua (250m - 500m)**: High-temporal frequency daily observations and 16-day composited vegetation products.

### 🌤️ Hyper-Local Weather & Air Quality

* **Real-time weather observations**: Temperature, relative humidity, precipitation, wind speed, wind gusts, solar radiation, and FAO-56 evapotranspiration (ET0).
* **Sub-surface soil telemetry**: Soil temperature and volumetric soil moisture across 5 distinct depth layers (surface, 2 cm, 5 cm, 15 cm, 50 cm).
* **Multi-day forecasting & history**: 16-day forward weather forecasting and historical meteorological archives.
* **Comprehensive air quality**: Complete pollutant metrics including PM2.5, PM10, NO2, SO2, CO, O3, Aerosol Optical Depth (AOD), European AQI, and US EPA AQI.

### ⛰️ Elevation & Terrain Intelligence

* **Global 30-meter DEM rasters**: Topographic elevation models with dynamic elevation statistics (minimum, maximum, mean, and standard deviation).
* **Automated vector contour lines**: Contour extraction in GeoJSON and PNG formats with configurable contour intervals (e.g., 5m, 10m, 20m).

### ⚡ Automated Alerts & Notifications

* **Persistent spatial monitoring**: Continuous automated background scanning on your registered Areas of Interest (AOIs).
* **Conditional threshold triggers**: Immediate notifications when new satellite scenes detect threshold breaches (e.g., NDVI < 0.35 or NDWI < -0.1).

---

## Quick Navigation

<div class="grid cards" markdown>

-   :material-account-plus:{ .lg .middle } __Getting Started__

    ---

    Create your account, understand account tiers, and obtain your secret API Key.

    [:octicons-arrow-right-24: Account Setup](get-started/account-creation.md)

-   :material-key:{ .lg .middle } __Authentication__

    ---

    Learn how to pass `X-API-Key` headers and authenticate requests securely.

    [:octicons-arrow-right-24: Authentication Guide](get-started/api-keys-auth.md)

-   :material-view-dashboard:{ .lg .middle } __Dashboard Guide__

    ---

    Explore the interactive map interface, create AOIs, and view visual satellite layers.

    [:octicons-arrow-right-24: Dashboard Walkthrough](guides/walkthrough/dashboard.md)

-   :material-api:{ .lg .middle } __Full API Reference__

    ---

    Comprehensive endpoint specifications, payloads, responses, error codes, and cURL requests.

    [:octicons-arrow-right-24: Explore APIs](api-reference/overview.md)

</div>

---

## Quick Example: First API Call in 30 Seconds

All ObservEarth API endpoints require your API key passed in the `X-API-Key` HTTP header:

```bash
# Verify your API key
curl -X POST "https://observearth.com/api/verify-api-key/" \
     -H "X-API-Key: YOUR_API_KEY_HERE" \
     -H "Content-Type: application/json"
```

Expected response:
```json
{
  "valid": true
}
```
