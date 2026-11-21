# Python Integration Guide

A complete, production-ready Python example demonstrating how to interact with ObservEarth: creating a farm geometry, discovering Sentinel-2 imagery, computing NDVI statistics, and retrieving current weather.

---

## Installation

```bash
pip install requests python-dotenv
```

---

## Complete Integration Script

```python
import os
import requests
import json

BASE_URL = "https://observearth.com/api"
API_KEY = os.getenv("OBSERVEARTH_API_KEY", "YOUR_API_KEY_HERE")

headers = {
    "X-API-Key": API_KEY,
    "Content-Type": "application/json"
}

def verify_key():
    url = f"{BASE_URL}/verify-api-key/"
    res = requests.post(url, headers=headers, json={"api_key": API_KEY})
    print("API Key Verification:", res.json())

def create_farm_aoi():
    url = f"{BASE_URL}/geometry/"
    payload = {
        "name": "Demo Vineyard",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [-120.450, 36.520],
                    [-120.440, 36.520],
                    [-120.440, 36.530],
                    [-120.450, 36.530],
                    [-120.450, 36.520]
                ]
            ]
        },
        "lookback_months": 1
    }
    res = requests.post(url, headers=headers, json=payload)
    if res.status_code == 201:
        data = res.json()
        print(f"Created AOI ID: {data['id']} (Area: {data['properties']['area']} ha)")
        return data["id"]
    else:
        print("Error creating geometry:", res.status_code, res.text)
        return None

def search_satellite_imagery(geometry_id):
    url = f"{BASE_URL}/s2/search/"
    payload = {
        "geometry_id": geometry_id,
        "start_date": "2026-05-01",
        "end_date": "2026-05-31",
        "cloud_cover": 20
    }
    res = requests.post(url, headers=headers, json=payload)
    results = res.json().get("results", [])
    print(f"Found {len(results)} clean Sentinel-2 passes.")
    return results

def get_ndvi_statistics(geometry_id, item_id):
    url = f"{BASE_URL}/s2/stats/{geometry_id}/"
    params = {
        "item_id": item_id,
        "index": "ndvi"
    }
    res = requests.get(url, headers=headers, params=params)
    print("NDVI Stats:", json.dumps(res.json(), indent=2))

def get_current_weather(geometry_id):
    url = f"{BASE_URL}/weather/current/"
    params = {"geometry_id": geometry_id}
    res = requests.get(url, headers=headers, params=params)
    weather = res.json().get("current", {})
    print(f"Temperature: {weather.get('temp')}°C | Humidity: {weather.get('relative_humidity')}% | Soil Temp (Surface): {weather.get('soil_temperature_surface')}°C")

if __name__ == "__main__":
    verify_key()
    geom_id = create_farm_aoi()
    if geom_id:
        scenes = search_satellite_imagery(geom_id)
        if scenes:
            best_scene = scenes[0]["id"]
            get_ndvi_statistics(geom_id, best_scene)
        get_current_weather(geom_id)
```
