# ObservEarth Documentation

Welcome to the official developer and user documentation for **ObservEarth** — the next-generation Earth Observation (EO), satellite remote sensing, weather, and environmental analytics platform.

---

## What is ObservEarth?

ObservEarth empowers developers, agritech firms, researchers, forestry managers, urban planners, and environmental analysts to seamlessly access, analyze, and visualize high-resolution multi-spectral and radar satellite imagery alongside hyper-local weather and air quality datasets.

Instead of wrestling with complex raw geospatial data pipelines, gigabyte-sized GeoTIFFs, or complex atmospheric correction algorithms, ObservEarth provides unified RESTful APIs and an intuitive web dashboard.

<div class="grid cards" markdown>

-   🌐 __ObservEarth Web__

    ---

    Access the main ObservEarth cloud platform, user portal, and web mapping interface.

    [Launch ObservEarth →](https://observearth.com){ target="_blank" }

-   🧭 __Platform Walkthrough__

    ---

    Step-by-step walkthrough covering signup, dashboard navigation, satellite analytics, and alerts.

    [Start Walkthrough →](guides/walkthrough/signup-login.md)

-   ⚡ __API Reference__

    ---

    Comprehensive RESTful endpoint specifications, authentication, headers, and code examples.

    [Explore APIs →](api-reference/overview.md)

</div>

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
