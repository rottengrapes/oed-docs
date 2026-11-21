# Utility, Palettes & Verification API

The **Utility API** provides palette color tables, dynamic color ramp legend generators for map clients, and instant API key verification.

---

## 1. List Colormaps

### Endpoint
`GET /api/misc/colors/`

### Operation Summary
`misc_colors_list`

### Why It's Used
Returns the complete dictionary of supported colormap identifiers and their recommended visualization domains (e.g. `rdylgn` for vegetative health, `blues` for water moisture).

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Responses
* **`200 OK`**:
```json
{
  "colormaps": {
    "viridis": "Perceptually uniform colormap, good for most visualizations",
    "plasma": "Perceptually uniform colormap with high contrast",
    "inferno": "Perceptually uniform colormap, excellent for heatmaps",
    "magma": "Perceptually uniform colormap, dark to light",
    "rdylgn": "Red-Yellow-Green, standard for vegetation indices like NDVI",
    "rdylbu": "Red-Yellow-Blue, excellent for moisture and water indices",
    "terrain": "Topographic map colors, ideal for DEM",
    "greys": "Monochrome greyscale"
  }
}
```

### cURL Example
```bash
curl -X GET "https://observearth.com/api/misc/colors/" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## 2. Generate Dynamic Legend

### Endpoint
`GET /api/misc/legend/`

### Operation Summary
`misc_legend_list`

### Why It's Used
Renders a calibrated colorbar legend image or base64 data URI with labeled ticks, min/max values, and orientation for displaying on GIS map overlays.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |

### Query Parameters
| Parameter | Type | Description | Required | Default |
|---|---|---|---|---|
| `min` | Number | Minimum value threshold | Yes | - |
| `max` | Number | Maximum value threshold | Yes | - |
| `colormap` | String | Name of colormap (e.g. `rdylgn`) | Yes | - |
| `reverse` | String | Reverse color order (`true`/`false`) | No | `false` |
| `orientation` | String | `horizontal` or `vertical` | No | `horizontal` |
| `width` | Integer | Legend image width in pixels | No | - |
| `height` | Integer | Legend image height in pixels | No | - |
| `text` | String | Display numerical values (`true`/`false`) | No | `true` |
| `label` | String | Custom title label (e.g. `NDVI`) | No | - |
| `show_label` | String | Display title label (`true`/`false`) | No | `true` |

### Responses
* **`200 OK`**: Base64 encoded PNG legend payload or image stream.
* **`400 Bad Request`**: Missing `min`, `max`, or `colormap`.

### cURL Example
```bash
curl -X GET "https://observearth.com/api/misc/legend/?min=-0.2&max=0.9&colormap=rdylgn&orientation=horizontal&label=NDVI" \
     -H "X-API-Key: YOUR_API_KEY"
```

---

## 3. Verify API Key

### Endpoint
`POST /api/verify-api-key/`

### Operation Summary
`verify-api-key_create`

### Why It's Used
Verifies API key validity, active user account association, subscription tier, and current monitored area quota without consuming rate limits.

### Headers
| Header | Type | Description | Required |
|---|---|---|---|
| `X-API-Key` | String (UUID) | Secret API Key | Yes |
| `Content-Type` | String | `application/json` | Yes |

### Request Body
```json
{
  "api_key": "123e4567-e89b-12d3-a456-426614174000"
}
```

### Responses
* **`200 OK`**:
```json
{
  "valid": true,
  "username": "agri_corp",
  "email": "dev@agricorp.com",
  "plan": "Paid",
  "allocated_hectares": 5000.00,
  "used_hectares": 2199.14,
  "is_active": true
}
```
* **`400 Bad Request`**: Missing `api_key` in request body.
* **`401 Unauthorized`**: Key is invalid or inactive.

### cURL Example
```bash
curl -X POST "https://observearth.com/api/verify-api-key/" \
     -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"api_key": "YOUR_API_KEY"}'
```
