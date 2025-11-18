import tkinter as tk
from tkinter import ttk, filedialog, messagebox, scrolledtext
import pandas as pd
import json
import os
from datetime import datetime
import re


class LocationProcessorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Location Data Processor")
        self.root.geometry("900x700")
        self.root.resizable(True, True)
        
        # Variables
        self.location_file_path = tk.StringVar()
        self.order_file_path = tk.StringVar()
        self.output_file = tk.StringVar(value="jason/locations.json")
        
        # Setup UI
        self.setup_ui()
        
    def setup_ui(self):
        # Main container with padding
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Configure grid weights
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(1, weight=1)
        
        # Title
        title_label = ttk.Label(main_frame, text="Location Data Processor", 
                               font=('Arial', 16, 'bold'))
        title_label.grid(row=0, column=0, columnspan=3, pady=10)
        
        # Location File Section
        ttk.Label(main_frame, text="Location File:", font=('Arial', 10, 'bold')).grid(
            row=1, column=0, sticky=tk.W, pady=5)
        ttk.Entry(main_frame, textvariable=self.location_file_path, width=60).grid(
            row=2, column=0, columnspan=2, sticky=(tk.W, tk.E), padx=5)
        ttk.Button(main_frame, text="Browse", command=self.browse_location_file).grid(
            row=2, column=2, padx=5)
        
        # Order File Section
        ttk.Label(main_frame, text="Order File:", font=('Arial', 10, 'bold')).grid(
            row=3, column=0, sticky=tk.W, pady=5)
        ttk.Entry(main_frame, textvariable=self.order_file_path, width=60).grid(
            row=4, column=0, columnspan=2, sticky=(tk.W, tk.E), padx=5)
        ttk.Button(main_frame, text="Browse", command=self.browse_order_file).grid(
            row=4, column=2, padx=5)
        
        # Output File Section
        ttk.Label(main_frame, text="Output JSON File:", font=('Arial', 10, 'bold')).grid(
            row=5, column=0, sticky=tk.W, pady=5)
        ttk.Entry(main_frame, textvariable=self.output_file, width=60).grid(
            row=6, column=0, columnspan=2, sticky=(tk.W, tk.E), padx=5)
        ttk.Button(main_frame, text="Save As", command=self.browse_output_file).grid(
            row=6, column=2, padx=5)
        
        # Process Button
        process_btn = ttk.Button(main_frame, text="Process Files", 
                                command=self.process_files, style='Accent.TButton')
        process_btn.grid(row=7, column=0, columnspan=3, pady=20)
        
        # Progress Section
        ttk.Label(main_frame, text="Processing Log:", font=('Arial', 10, 'bold')).grid(
            row=8, column=0, sticky=tk.W, pady=5)
        
        # Scrolled text for log
        self.log_text = scrolledtext.ScrolledText(main_frame, height=20, width=80, 
                                                  wrap=tk.WORD, state='disabled')
        self.log_text.grid(row=9, column=0, columnspan=3, sticky=(tk.W, tk.E, tk.N, tk.S), 
                          pady=5)
        
        # Configure text tags for colored output
        self.log_text.tag_config('info', foreground='black')
        self.log_text.tag_config('success', foreground='green')
        self.log_text.tag_config('warning', foreground='orange')
        self.log_text.tag_config('error', foreground='red')
        
        # Configure grid weights for log area
        main_frame.rowconfigure(9, weight=1)
        
    def browse_location_file(self):
        filename = filedialog.askopenfilename(
            title="Select Location File",
            filetypes=[("Excel files", "*.xlsx *.xls"), ("All files", "*.*")]
        )
        if filename:
            self.location_file_path.set(filename)
            self.log_message(f"Location file selected: {filename}", 'info')
    
    def browse_order_file(self):
        filename = filedialog.askopenfilename(
            title="Select Order File",
            filetypes=[("Excel files", "*.xlsx *.xls"), ("All files", "*.*")]
        )
        if filename:
            self.order_file_path.set(filename)
            self.log_message(f"Order file selected: {filename}", 'info')
    
    def browse_output_file(self):
        filename = filedialog.asksaveasfilename(
            title="Save Output JSON As",
            defaultextension=".json",
            filetypes=[("JSON files", "*.json"), ("All files", "*.*")]
        )
        if filename:
            self.output_file.set(filename)
            self.log_message(f"Output file set to: {filename}", 'info')
    
    def log_message(self, message, tag='info'):
        self.log_text.config(state='normal')
        timestamp = datetime.now().strftime("%H:%M:%S")
        self.log_text.insert(tk.END, f"[{timestamp}] {message}\n", tag)
        self.log_text.see(tk.END)
        self.log_text.config(state='disabled')
        self.root.update()
    
    def parse_geotag(self, geotag):
        """Parse GeoTag string to extract latitude and longitude"""
        if pd.isna(geotag) or not geotag:
            return None, None
        
        geotag_str = str(geotag).strip()
        
        # Try different patterns
        # Pattern 1: "lat,lng" or "lat, lng"
        pattern1 = r'^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$'
        match = re.match(pattern1, geotag_str)
        if match:
            return float(match.group(1)), float(match.group(2))
        
        # Pattern 2: "latitude: lat, longitude: lng"
        pattern2 = r'latitude:\s*(-?\d+\.?\d*)\s*,\s*longitude:\s*(-?\d+\.?\d*)'
        match = re.search(pattern2, geotag_str, re.IGNORECASE)
        if match:
            return float(match.group(1)), float(match.group(2))
        
        # Pattern 3: "lat: lat, lng: lng"
        pattern3 = r'lat:\s*(-?\d+\.?\d*)\s*,\s*lng:\s*(-?\d+\.?\d*)'
        match = re.search(pattern3, geotag_str, re.IGNORECASE)
        if match:
            return float(match.group(1)), float(match.group(2))
        
        return None, None
    
    def process_files(self):
        # Validation
        if not self.location_file_path.get():
            messagebox.showerror("Error", "Please select a location file")
            return
        
        if not self.order_file_path.get():
            messagebox.showerror("Error", "Please select an order file")
            return
        
        if not self.output_file.get():
            messagebox.showerror("Error", "Please specify an output file")
            return
        
        try:
            self.log_message("=" * 60, 'info')
            self.log_message("Starting processing...", 'info')
            
            # Read location file
            self.log_message("Reading location file...", 'info')
            location_file = self.location_file_path.get()
            
            # Check if it's a multi-sheet Excel file
            try:
                xl = pd.ExcelFile(location_file)
                if len(xl.sheet_names) > 1:
                    self.log_message(f"Multi-sheet Excel file detected. Sheets: {', '.join(xl.sheet_names)}", 'info')
                    
                    # Look for a sheet with "location" in the name
                    location_sheet = None
                    for sheet in xl.sheet_names:
                        if 'location' in sheet.lower():
                            location_sheet = sheet
                            break
                    
                    if location_sheet:
                        self.log_message(f"Using sheet: '{location_sheet}'", 'success')
                        # Try reading with different header rows
                        location_df = pd.read_excel(location_file, sheet_name=location_sheet, header=None)
                        
                        # Find the header row (look for "Location" keywords)
                        header_row = 0
                        for idx in range(min(10, len(location_df))):
                            row_str = ' '.join([str(x).lower() for x in location_df.iloc[idx].values if pd.notna(x)])
                            if 'location name' in row_str and 'reference' in row_str:
                                header_row = idx
                                self.log_message(f"Found header row at row {header_row}", 'info')
                                break
                        
                        # Re-read with proper header
                        location_df = pd.read_excel(location_file, sheet_name=location_sheet, header=header_row)
                    else:
                        # Use first sheet
                        self.log_message(f"No location sheet found, using first sheet: '{xl.sheet_names[0]}'", 'warning')
                        location_df = pd.read_excel(location_file, sheet_name=xl.sheet_names[0])
                else:
                    location_df = pd.read_excel(location_file)
            except:
                # Fallback to simple read
                location_df = pd.read_excel(location_file)
            
            self.log_message(f"Loaded {len(location_df)} rows", 'success')
            self.log_message(f"Location columns: {', '.join([str(c) for c in location_df.columns.tolist()])}", 'info')
            
            # Read order file
            self.log_message("Reading order file...", 'info')
            order_df = pd.read_excel(self.order_file_path.get())
            self.log_message(f"Loaded {len(order_df)} orders", 'success')
            self.log_message(f"Order columns: {', '.join(order_df.columns.tolist())}", 'info')
            
            # Process locations
            locations_dict = {}
            
            # Normalize location data column names (case-insensitive search, remove spaces)
            location_columns = {col.lower().replace(' ', '').replace('_', '').replace('-', ''): col for col in location_df.columns}
            
            # Find relevant columns in location file
            ref_id_col = None
            name_col = None
            lat_col = None
            lng_col = None
            
            # More comprehensive column name variations
            for key in ['locationreferenceid', 'location_reference_id', 'locationrefid', 'location_ref_id',
                       'refid', 'ref_id', 'id', 'locationid', 'location_id', 
                       'organizationshortname', 'organization_short_name']:
                if key in location_columns:
                    ref_id_col = location_columns[key]
                    break
            
            for key in ['locationname', 'location_name', 'name', 'location', 'site_name', 'sitename',
                       'organizationshortname', 'organization_short_name']:
                if key in location_columns:
                    name_col = location_columns[key]
                    break
            
            # Check for combined coordinates column first (like "Google Coordinates")
            coordinates_col = None
            for key in ['googlecoordinates', 'google_coordinates', 'coordinates', 'coords', 
                       'latlng', 'lat_lng', 'latlong', 'lat_long']:
                if key in location_columns:
                    coordinates_col = location_columns[key]
                    break
            
            # If no combined column, look for separate lat/lng columns
            if not coordinates_col:
                for key in ['latitude', 'lat', 'lat_coordinate', 'latcoordinate']:
                    if key in location_columns:
                        lat_col = location_columns[key]
                        break
                
                for key in ['longitude', 'lng', 'lon', 'long', 'lng_coordinate', 'lngcoordinate', 
                           'lon_coordinate', 'loncoordinate']:
                    if key in location_columns:
                        lng_col = location_columns[key]
                        break
            
            # Validate columns
            has_coordinates = coordinates_col or (lat_col and lng_col)
            
            if not all([ref_id_col, name_col]) or not has_coordinates:
                self.log_message(f"ERROR: Missing columns in location file!", 'error')
                self.log_message(f"Available columns: {', '.join(location_df.columns.tolist())}", 'info')
                if not ref_id_col:
                    self.log_message("  Missing: Location Reference ID column", 'error')
                if not name_col:
                    self.log_message("  Missing: Location Name column", 'error')
                if not has_coordinates:
                    self.log_message("  Missing: Coordinate columns (need either 'Coordinates' or 'Lat'+'Lng')", 'error')
            else:
                if coordinates_col:
                    self.log_message(f"✓ Identified columns - RefID: {ref_id_col}, Name: {name_col}, Coordinates: {coordinates_col}", 'success')
                else:
                    self.log_message(f"✓ Identified columns - RefID: {ref_id_col}, Name: {name_col}, Lat: {lat_col}, Lng: {lng_col}", 'success')
            
            # Build location lookup dictionaries
            location_by_refid = {}
            location_by_name = {}
            
            if (ref_id_col and name_col) and (coordinates_col or (lat_col and lng_col)):
                if coordinates_col:
                    self.log_message(f"Building location lookup from columns: {ref_id_col}, {name_col}, {coordinates_col}", 'info')
                else:
                    self.log_message(f"Building location lookup from columns: {ref_id_col}, {name_col}, {lat_col}, {lng_col}", 'info')
                
                for idx, row in location_df.iterrows():
                    ref_id = str(row[ref_id_col]).strip() if pd.notna(row[ref_id_col]) else None
                    name = str(row[name_col]).strip() if pd.notna(row[name_col]) else None
                    
                    # Get coordinates
                    lat = None
                    lng = None
                    
                    if coordinates_col:
                        # Parse combined coordinates (format: "lat,lng")
                        coords = row[coordinates_col] if pd.notna(row[coordinates_col]) else None
                        if coords:
                            lat, lng = self.parse_geotag(coords)
                    else:
                        # Use separate lat/lng columns
                        lat = row[lat_col] if pd.notna(row[lat_col]) else None
                        lng = row[lng_col] if pd.notna(row[lng_col]) else None
                    
                    if ref_id and name and lat is not None and lng is not None:
                        # Store with original ref_id as key (preserving case)
                        location_by_refid[ref_id] = {
                            'name': name,
                            'locationReferenceId': ref_id,
                            'latitude': float(lat),
                            'longitude': float(lng)
                        }
                        # Also store with uppercase key for case-insensitive lookup
                        location_by_refid[ref_id.upper()] = location_by_refid[ref_id]
                        
                        location_by_name[name.upper()] = {
                            'name': name,
                            'locationReferenceId': ref_id,
                            'latitude': float(lat),
                            'longitude': float(lng)
                        }
                        
                        if idx < 5:  # Show first 5 locations as sample
                            self.log_message(f"  Sample location: {ref_id} -> {name} ({lat}, {lng})", 'info')
            else:
                self.log_message("WARNING: Could not find all required columns in location file!", 'error')
            
            self.log_message(f"Built lookup tables with {len(set(location_by_refid.keys()))} unique locations", 'success')
            
            # Process order file (normalize column names - remove spaces, underscores, hyphens)
            order_columns = {col.lower().replace(' ', '').replace('_', '').replace('-', ''): col for col in order_df.columns}
            
            # Find pickup and dropoff columns
            pickup_col = None
            dropoff_col = None
            geotag_col = None
            
            for key in ['pickuplocationid', 'pickup_location_id', 'pickupid', 'pickup_id', 
                       'pickup', 'origin', 'originid', 'origin_id', 'fromlocation', 'from_location']:
                if key in order_columns:
                    pickup_col = order_columns[key]
                    break
            
            for key in ['dropofflocationid', 'dropoff_location_id', 'drop-offlocationid', 
                       'dropoffid', 'dropoff_id', 'dropoff', 'destination', 'destinationid', 
                       'destination_id', 'tolocation', 'to_location', 'delivery', 'deliveryid']:
                if key in order_columns:
                    dropoff_col = order_columns[key]
                    break
            
            for key in ['geotag', 'geo_tag', 'geo-tag', 'coordinates', 'coords', 'latlng', 
                       'lat_lng', 'location', 'gps', 'gpscoordinates', 'gps_coordinates']:
                if key in order_columns:
                    geotag_col = order_columns[key]
                    break
            
            if not pickup_col and not dropoff_col:
                self.log_message(f"ERROR: Could not find pickup or dropoff columns in order file!", 'error')
                self.log_message(f"Available columns: {', '.join(order_df.columns.tolist())}", 'info')
            else:
                self.log_message(f"✓ Order columns - Pickup: {pickup_col}, Dropoff: {dropoff_col}, GeoTag: {geotag_col}", 'success')
            
            # Process pickup and dropoff locations
            processed_refids = set()
            unique_pickup_ids = set()
            unique_dropoff_ids = set()
            unmatched_ids = set()
            
            if pickup_col:
                self.log_message("Processing pickup locations...", 'info')
                for idx, row in order_df.iterrows():
                    pickup_id = str(row[pickup_col]).strip() if pd.notna(row[pickup_col]) else None
                    if pickup_id:
                        unique_pickup_ids.add(pickup_id)
                        found = self.add_location(pickup_id, location_by_refid, location_by_name, 
                                        locations_dict, processed_refids)
                        if not found:
                            unmatched_ids.add(pickup_id)
                
                self.log_message(f"Found {len(unique_pickup_ids)} unique pickup location IDs in orders", 'info')
            
            if dropoff_col:
                self.log_message("Processing dropoff locations...", 'info')
                for idx, row in order_df.iterrows():
                    dropoff_id = str(row[dropoff_col]).strip() if pd.notna(row[dropoff_col]) else None
                    if dropoff_id:
                        unique_dropoff_ids.add(dropoff_id)
                        found = self.add_location(dropoff_id, location_by_refid, location_by_name, 
                                        locations_dict, processed_refids)
                        if not found:
                            unmatched_ids.add(dropoff_id)
                
                self.log_message(f"Found {len(unique_dropoff_ids)} unique dropoff location IDs in orders", 'info')
            
            # Report unmatched IDs
            if unmatched_ids:
                self.log_message(f"WARNING: {len(unmatched_ids)} location IDs could not be matched:", 'warning')
                for unmatched_id in list(unmatched_ids)[:10]:  # Show first 10
                    self.log_message(f"  - {unmatched_id}", 'warning')
                if len(unmatched_ids) > 10:
                    self.log_message(f"  ... and {len(unmatched_ids) - 10} more", 'warning')
            
            self.log_message(f"Successfully matched {len(locations_dict)} locations from order file", 'success')
            
            # Process GeoTag locations (cash customers)
            if geotag_col:
                self.log_message("Processing GeoTag locations (cash customers)...", 'info')
                processed_geotags = set()
                cash_counter = 1
                
                for idx, row in order_df.iterrows():
                    geotag = row[geotag_col] if geotag_col else None
                    lat, lng = self.parse_geotag(geotag)
                    
                    if lat is not None and lng is not None:
                        # Create unique key for this geotag
                        geotag_key = f"{lat},{lng}"
                        
                        if geotag_key not in processed_geotags:
                            processed_geotags.add(geotag_key)
                            cash_ref_id = f"CASH-{cash_counter:04d}"
                            
                            locations_dict[cash_ref_id] = {
                                'name': 'Cash Customer',
                                'locationReferenceId': cash_ref_id,
                                'latitude': lat,
                                'longitude': lng
                            }
                            cash_counter += 1
                
                self.log_message(f"Added {len(processed_geotags)} unique cash customer locations", 'success')
            
            # Convert to list
            locations_list = list(locations_dict.values())
            
            # Create output folder if it doesn't exist
            output_file = self.output_file.get()
            output_folder = os.path.dirname(output_file)
            if output_folder and not os.path.exists(output_folder):
                os.makedirs(output_folder)
                self.log_message(f"Created output folder: {output_folder}", 'info')
            
            # Save all locations to one JSON file
            self.log_message(f"Saving {len(locations_list)} locations to JSON file...", 'info')
            
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(locations_list, f, indent=2, ensure_ascii=False)
            
            self.log_message(f"✓ JSON file saved: {output_file}", 'success')
            
            # Also save as Excel file
            excel_file = output_file.replace('.json', '.xlsx')
            self.log_message(f"Creating Excel file...", 'info')
            
            # Prepare data for Excel
            excel_data = []
            for loc in locations_list:
                excel_data.append({
                    'Location Name': loc['name'],
                    'Location Reference ID': loc['locationReferenceId'],
                    'Latitude': loc['latitude'],
                    'Longitude': loc['longitude'],
                    'Google Maps Format': f"{loc['latitude']},{loc['longitude']}"
                })
            
            # Create DataFrame and save to Excel
            df_output = pd.DataFrame(excel_data)
            df_output.to_excel(excel_file, index=False, sheet_name='Locations')
            
            self.log_message(f"✓ Excel file saved: {excel_file}", 'success')
            self.log_message("=" * 60, 'info')
            self.log_message(f"SUCCESS! Processed {len(locations_list)} unique locations", 'success')
            self.log_message(f"JSON file: {output_file}", 'success')
            self.log_message(f"Excel file: {excel_file}", 'success')
            self.log_message("=" * 60, 'info')
            
            messagebox.showinfo("Success", 
                              f"Processing complete!\n\n{len(locations_list)} locations saved to:\n\nJSON: {output_file}\nExcel: {excel_file}")
            
        except Exception as e:
            self.log_message(f"ERROR: {str(e)}", 'error')
            messagebox.showerror("Error", f"An error occurred:\n\n{str(e)}")
            import traceback
            self.log_message(traceback.format_exc(), 'error')
    
    def sanitize_filename(self, filename):
        """Remove or replace invalid characters from filename"""
        # Replace invalid characters with underscore
        invalid_chars = '<>:"/\\|?*'
        for char in invalid_chars:
            filename = filename.replace(char, '_')
        
        # Remove leading/trailing spaces and dots
        filename = filename.strip('. ')
        
        # Limit length
        if len(filename) > 100:
            filename = filename[:100]
        
        # If empty, use default
        if not filename:
            filename = "location"
        
        return filename
    
    def add_location(self, location_id, location_by_refid, location_by_name, 
                    locations_dict, processed_refids):
        """Add a location to the output dictionary if not already added"""
        if location_id in processed_refids:
            return True  # Already processed
        
        # Try to find by reference ID first (exact match)
        location_data = location_by_refid.get(location_id)
        match_type = "RefID (exact)"
        
        # If not found, try uppercase
        if not location_data:
            location_data = location_by_refid.get(location_id.upper())
            match_type = "RefID (case-insensitive)"
        
        # If not found, try by name
        if not location_data:
            location_data = location_by_name.get(location_id.upper())
            match_type = "Name"
        
        if location_data:
            ref_id = location_data['locationReferenceId']
            if ref_id not in locations_dict:
                locations_dict[ref_id] = location_data
                self.log_message(f"✓ Matched '{location_id}' -> {location_data['name']} ({ref_id}) [{match_type}]", 'success')
            processed_refids.add(location_id)
            return True
        else:
            return False  # Not found


def main():
    root = tk.Tk()
    app = LocationProcessorApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()

