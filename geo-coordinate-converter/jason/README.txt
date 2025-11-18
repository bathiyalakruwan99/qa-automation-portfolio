================================================================================
                        OUTPUT FOLDER
================================================================================

This folder contains the OUTPUT files (JSON + Excel).

AFTER PROCESSING:
-----------------

You will find TWO files:

1. locations.json (or your custom filename)
   - JSON format for applications

2. locations.xlsx (same name as JSON, but .xlsx extension)
   - Excel format for viewing and Google Maps
   - Includes "Google Maps Format" column for easy searching


EXAMPLE JSON OUTPUT:
--------------------

See: locations_sample.json

[
  {
    "name": "Location Name",
    "locationReferenceId": "REF-ID",
    "latitude": 6.9271,
    "longitude": 79.8612
  },
  ... more locations
]


EXCEL FILE COLUMNS:
-------------------

The Excel file (locations.xlsx) contains these columns:

1. Location Name - Name of the location
2. Location Reference ID - Unique identifier
3. Latitude - GPS latitude coordinate
4. Longitude - GPS longitude coordinate
5. Google Maps Format - Ready to search in Google Maps!

HOW TO USE GOOGLE MAPS FORMAT:
-------------------------------

1. Open locations.xlsx in Excel
2. Find your location
3. Copy value from "Google Maps Format" column (e.g., "6.5328,80.3989")
4. Open Google Maps (maps.google.com)
5. Paste in search box
6. Press Enter - Location appears on map!


WHAT'S INCLUDED:
----------------

✓ All matched pickup locations from your order file
✓ All matched dropoff locations from your order file  
✓ All cash customer locations (from GeoTag column)
✓ Each location appears only once (no duplicates)


FILE FORMAT:
------------

Standard JSON array format:
  - Easy to parse
  - Compatible with most applications
  - Ready for route optimization tools
  - Can be imported into databases


HOW TO USE THE OUTPUT:
----------------------

1. Load the JSON file in your application
2. Parse the JSON array
3. Each object contains:
   - name: Location name
   - locationReferenceId: Unique identifier
   - latitude: GPS latitude coordinate
   - longitude: GPS longitude coordinate


PERFECT FOR:
------------

✓ Route optimization software
✓ Mapping applications
✓ Order management systems
✓ Delivery planning tools
✓ Database imports
✓ API integrations


================================================================================

