# Plans, Quotas & Limits

ObservEarth operates on an Area of Interest (AOI) footprint model combined with fair-use request rate limits to guarantee high availability and sub-second raster tile streaming.

---

## Subscription Plans & Area Allowances

When you define farm boundaries or geographic monitoring areas (AOIs), ObservEarth calculates the real-world surface area in **hectares** using UTM coordinate transformations. Your account plan determines the total cumulative area you can have active concurrently.

| Plan Tier | Display Name | Max Cumulative Area | Single Farm Size Limit | Target Audience |
|---|---|---|---|---|
| **Free** | Research & Non-commercial | 500 Hectares (5 km²) | Up to 100 Hectares | Students, independent researchers, pilots |
| **Startup** | Startup & Non-Profit | 5,000 Hectares (50 km²) | Up to 500 Hectares | Agritech startups, field trials, cooperatives |
| **Giant** | Giant Enterprise | 30,000 Hectares (300 km²) | Up to 2,000 Hectares | Forestry firms, regional irrigation boards |
| **Super Giant** | Super Giant Enterprise | 100,000+ Hectares (1,000+ km²) | Custom | National monitoring, multinational insurers |

> [!NOTE]
> The cumulative area limit applies to active geometries. If you delete an inactive geometry using `DELETE /api/geometry/<id>/`, that area is immediately released back to your available budget!

---

## Single Farm Size Enforcement

To prevent raster generation latency spikes on oversized polygons, individual geometries have maximum allowable single-farm size checks:

* **Free tier limit**: Single geometries cannot exceed **100 hectares**.
* **Startup tier limit**: Single geometries cannot exceed **500 hectares**.
* **Error handling**: If a polygon exceeds the limit, the API returns `400 Bad Request`:

```json
{
  "error": "Single farm size cannot exceed 100.00 hectares. This farm is 142.50 hectares."
}
```

---

## API Request Rate Limits

Every plan includes generous rate limits broken down by functional **API Types**:

| API Type | Scope & Endpoints Included | Per-Minute Limit | Monthly Limit |
|---|---|---|---|
| **API Type 1** | Satellite Catalog Search (`/api/s2/search/`, `/api/s1/search/`, `/api/landsat/search/`, `/api/modis/search/`) | 300 req / min | 50,000 req / month |
| **API Type 2** | Satellite Raster Data, Imagery & Stats (`/api/*/image/`, `/api/*/stats/`, `/api/*/raw-band/`, `/api/s2/sen2sr/*`) | 300 req / min | 50,000 req / month |
| **API Type 3** | Weather Data (`/api/weather/current/`, `/api/weather/today/`, `/api/weather/forecast/`, `/api/weather/historical/`) | 100 req / min | 20,000 req / month |
| **API Type 4** | Air Quality Data (`/api/air-quality/current/`, `/api/air-quality/today/`, `/api/air-quality/forecast/`, `/api/air-quality/historical/`) | 100 req / min | 5,000 req / month |

---

## Checking Your Current Usage

You can inspect your real-time cumulative area usage, percentage of plan utilized, and monthly call counts via both the web UI and programmatic APIs:

### 1. Web Dashboard

Navigate to `/dashboard/` or `/dashboard/api-usage/` to see visual progress bars showing:

* **Active farm count**: Number of monitored geometries currently saved in your account.
* **Hectares consumed**: Real-world footprint currently active versus your plan's maximum allowance.
* **Usage percentage**: Percentage of total area utilized with colored progress indicator.

### 2. Programmatic API

Call `GET /api/analytics/summary/current/` (detailed in the [API Analytics Guide](../api-reference/analytics.md)) to receive a machine-readable breakdown of your current month's calls across every satellite and weather service.
