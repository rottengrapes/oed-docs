# Digital Elevation Model (DEM) & Contours API

The **DEM & Contours API** provides access to the Copernicus 30m Global Digital Elevation Model (COP-DEM-GLO-30) for extracting terrain elevation rasters and parametric topographic contour line vectors.

---

## 1. Digital Elevation Model (DEM)

### Endpoint
`POST /api/dem/`

### Operation Summary
`dem_create`

### Why It's Used
Retrieve Digital Elevation Model (DEM) imagery for a geometry from the COP-DEM-GLO-30 collection clipped to parcel boundaries as PNG or 32-bit floating-point GeoTIFF.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |
| `Content-Type` | String | `application/json` | Yes |

### Request Body
```json
{
  "geometry_id": "123e4567-e89b-12d3-a456-426614174000",
  "format": "png",
  "colormap": "greys"
}
```

| Field | Type | Description | Required | Default |
|---|---|---|---|---|
| `geometry_id` | String (UUID) | UUID of the registered geometry | Yes | - |
| `format` | String | Output format: `png` or `tif` | No | `png` |
| `colormap` | String | Visualization colormap (e.g. `greys`, `terrain`, `viridis`) | No | `greys` |

### Responses
* **`200 OK`**: Elevation imagery raster stream (`image/png` or `image/tiff`).
* **`400 Bad Request`**: Missing `geometry_id` or invalid format.
* **`401 Unauthorized`**: Authentication missing or invalid.
* **`404 Not Found`**: Geometry does not exist.

### cURL Example
```bash
curl -X POST "https://observearth.com/api/dem/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "geometry_id": "YOUR_GEOMETRY_ID",
       "format": "png",
       "colormap": "terrain"
     }' --output elevation_dem.png
```

---

## 2. Topographic Contours

### Endpoint
`POST /api/contours/`

### Operation Summary
`contours_create`

### Why It's Used
Generates parametric elevation contour line vector rings from the COP-DEM-GLO-30 dataset as GeoJSON MultiLineString features.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |
| `Content-Type` | String | `application/json` | Yes |

### Request Body
```json
{
  "geometry_id": "123e4567-e89b-12d3-a456-426614174000",
  "start_elevation": 100,
  "interval": 10
}
```

| Field | Type | Description | Required | Default |
|---|---|---|---|---|
| `geometry_id` | String (UUID) | UUID of the registered geometry | Yes | - |
| `start_elevation` | Number | Starting elevation baseline in meters | No | `0` |
| `interval` | Number | Vertical contour line step interval in meters | Yes | `10` |

### Responses
* **`200 OK`**: GeoJSON FeatureCollection of contour line geometries:
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "MultiLineString",
        "coordinates": [
          [[-120.450, 36.520], [-120.449, 36.521], [-120.448, 36.520]]
        ]
      },
      "properties": {
        "elevation": 110.0
      }
    }
  ]
}
```
* **`400 Bad Request`**: Missing required parameters.
* **`401 Unauthorized`**: Authentication missing or invalid.
* **`404 Not Found`**: Geometry does not exist.

### cURL Example
```bash
curl -X POST "https://observearth.com/api/contours/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "geometry_id": "YOUR_GEOMETRY_ID",
       "start_elevation": 0,
       "interval": 10
     }'
```
