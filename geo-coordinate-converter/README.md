# Geo Coordinate Converter

Python GUI tool for converting addresses to GPS coordinates and vice versa. Handles batch processing and exports to Excel.

![Geo Coordinate Converter](screenshots/geo-coordinate-ui.png)

---

## What It Does

- Convert addresses to GPS coordinates (geocoding)
- Convert coordinates to addresses (reverse geocoding)
- Batch process multiple locations from Excel/CSV
- Export results to Excel with all data

**Use case:** Generate realistic GPS test data for location-based testing

---

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Run the tool
python location_processor.py
```

Or use the batch script (Windows):
```bash
run_location_processor.bat
```

---

## Features

- Desktop GUI with Tkinter
- Batch processing support
- Excel import/export
- Progress tracking
- Error handling for failed lookups
- Caches results to avoid duplicate API calls

---

## Input Formats

**Address to Coordinates:**
```
Colombo Fort, Sri Lanka
Times Square, New York, USA
1600 Amphitheatre Parkway, Mountain View, CA
```

**Coordinates to Address:**
```
6.9271, 79.8612
40.7589, -73.9851
37.4220, -122.0841
```

---

## Tech Stack

- Python 3.7+
- Tkinter (GUI)
- Geocoding APIs (Nominatim/OpenStreetMap)
- Pandas (data processing)
- OpenPyXL (Excel handling)

---

*Quick utility for generating test location data. Saves time when you need realistic GPS coordinates for testing.*
