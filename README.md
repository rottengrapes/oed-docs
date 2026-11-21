# ObservEarth Zensical Documentation

This directory contains the complete **ObservEarth User & Developer Guide** configured for **Zensical** (and fully compatible with MkDocs Material).

---

## Quick Start with Docker Compose

To run the live documentation development server with instant hot-reloading:

```bash
docker compose up
```

Open your browser and navigate to:
[http://localhost:8000](http://localhost:8000)

Whenever you edit any `.md` file inside `docs/` or adjust `zensical.toml`, the site refreshes automatically.

---

## Alternative: Build Static Site

To compile static HTML/CSS/JS assets for production deployment:

```bash
docker run --rm -v $(pwd):/docs zensical/zensical build
```

The output will be generated into the `site/` directory.

---

## Running with Local Zensical CLI / Python

If you have Zensical installed locally:

```bash
# Preview locally
zensical serve

# Or with mkdocs
mkdocs serve
```

---

## Directory Layout

```
zensical/
├── docker-compose.yml       # Docker Compose setup for previewing docs
├── zensical.toml            # Modern Zensical project configuration
├── mkdocs.yml               # MkDocs Material dual-compatibility configuration
├── README.md                # This guide
└── docs/                    # Documentation Markdown source files
    ├── index.md             # Welcome & platform overview
    ├── get-started/         # Account creation, API keys, subscription plans & quotas
    ├── guides/              # Dashboard guide, AOI creation & management
    ├── api-reference/       # Detailed reference for every API endpoint
    │   ├── overview.md      # Base URL, headers, status codes, error format
    │   ├── geometry.md      # AOI / Farm CRUD APIs
    │   ├── sentinel-2.md    # Sentinel-2 search, stats, imagery, raw bands
    │   ├── sen2sr-super-resolution.md # 2.5m super-resolution pipeline
    │   ├── sentinel-1.md    # Sentinel-1 radar SAR search, stats, backscatter
    │   ├── landsat.md       # Landsat 8/9 C2L2 search, stats, imagery
    │   ├── modis.md         # MODIS daily & 16-day composite analytics
    │   ├── weather.md       # Current, today, 16-day forecast, historical weather
    │   ├── air-quality.md   # Current, hourly, forecast, historical air quality
    │   ├── dem-elevation.md # 30m Digital Elevation Model & vector contours
    │   ├── alerts.md        # Automated daily conditional index alerts
    │   ├── analytics.md     # Current/historical usage breakdown & audit logs
    │   └── misc.md          # Colormaps, palettes & legends
    └── examples/            # Copy-paste cURL cheatsheet, Python & JS guides
        ├── curl-cheatsheet.md
        ├── python-quickstart.md
        └── javascript-quickstart.md
```
