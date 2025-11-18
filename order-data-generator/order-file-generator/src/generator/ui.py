"""
Tkinter UI for the order file generator.
"""
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import os
from typing import Optional, List
import pandas as pd
from datetime import datetime

from . import loaders, validators, builder


class OrderGeneratorApp:
    """Main application window for order file generation."""
    
    def __init__(self, root: tk.Tk):
        self.root = root
        self.root.title("Order File Generator - TMS Test Data Generator")
        self.root.geometry("1000x700")
        self.root.minsize(800, 600)
        
        # Hardcoded order spec columns (from Order List Spec - D7 Cash Customer-Kithulgala-OK DEMO.xlsx)
        self.spec_columns = [
            "OrderId",
            "ItemRefId", 
            "Item name",
            "Shipper",
            "Consignee",
            "PickupTime",
            "DeliverOnOrAfter",
            "DeliverOnOrBefore",
            "Priority",
            "Package Type",
            "PickupTimeWindow",
            "DeliveryTimeWindow",
            "PickupLocationId",
            "Loading Bay Name or Number",
            "Cargo Handling Rate per Hour by CBM @ Shippers location",
            "DropOffLocationId",
            "Unloading Bay Name or Number",
            "Cargo Handling Rate per Hour by CBM @ Consignee's location",
            "Qty",
            "Weight",
            "CBM",
            "MaxStackWeight",
            "PartialShipmentsAllowed",
            "MetaData",
            "Dimensions",
            "FootPrint",
            "Temprature Range",
            "Dangerous",
            "Fragile",
            "GeoTag",
            "PhoneNumber",
            "VehicleAccessibility",
            "OperatingHours",
            "Documents And Processing Time",
            "Loading Time Per CBM",
            "Unloading Time Per CBM",
        ]
        
        # Data storage
        self.location_df: Optional[pd.DataFrame] = None
        self.location_refs: List[str] = []
        self.manual_drop_locations: List[str] = []
        
        # File paths
        self.location_path: Optional[str] = None
        
        # Setup UI
        self._create_ui()
        
    def _create_ui(self):
        """Create the full UI layout with scrolling."""
        # Create main container with scrollbar
        main_canvas = tk.Canvas(self.root)
        main_scrollbar = ttk.Scrollbar(self.root, orient="vertical", command=main_canvas.yview)
        scrollable_frame = ttk.Frame(main_canvas)
        
        scrollable_frame.bind(
            "<Configure>",
            lambda e: main_canvas.configure(scrollregion=main_canvas.bbox("all"))
        )
        
        main_canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        main_canvas.configure(yscrollcommand=main_scrollbar.set)
        
        # Pack the canvas and scrollbar
        main_canvas.pack(side="left", fill="both", expand=True)
        main_scrollbar.pack(side="right", fill="y")
        
        # Configure grid weights
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        
        main_frame = ttk.Frame(scrollable_frame, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        main_frame.columnconfigure(1, weight=1)
        
        # Bind mousewheel to canvas
        def _on_mousewheel(event):
            main_canvas.yview_scroll(int(-1*(event.delta/120)), "units")
        main_canvas.bind_all("<MouseWheel>", _on_mousewheel)
        
        row = 0
        
        # === File Selection Section ===
        file_frame = ttk.LabelFrame(main_frame, text="1. Load Location Master", padding="10")
        file_frame.grid(row=row, column=0, sticky=(tk.W, tk.E), pady=5)
        row += 1
        
        # Order Spec (hardcoded - show info)
        ttk.Label(file_frame, text="Order Spec:").grid(row=0, column=0, sticky=tk.W, pady=5)
        spec_info = tk.StringVar(value="Hardcoded (40 columns from Order List Spec - D7 Cash Customer-Kithulgala-OK DEMO.xlsx)")
        ttk.Entry(file_frame, textvariable=spec_info, width=60, state='readonly').grid(
            row=0, column=1, padx=5, pady=5
        )
        
        # Location Master
        ttk.Label(file_frame, text="Location Master:").grid(row=1, column=0, sticky=tk.W, pady=5)
        self.location_path_var = tk.StringVar()
        ttk.Entry(file_frame, textvariable=self.location_path_var, width=60, state='readonly').grid(
            row=1, column=1, padx=5, pady=5
        )
        ttk.Button(file_frame, text="Browse...", command=self._browse_location).grid(
            row=1, column=2, padx=5, pady=5
        )
        
        # Process button
        self.process_button = ttk.Button(file_frame, text="Process Location File", command=self._process_location, state='disabled')
        self.process_button.grid(row=2, column=1, padx=5, pady=10, sticky=tk.W)
        
        
        # === Generation Parameters Section ===
        params_frame = ttk.LabelFrame(main_frame, text="2. Generation Parameters", padding="10")
        params_frame.grid(row=row, column=0, sticky=(tk.W, tk.E), pady=5)
        row += 1
        
        # Pickup Location (searchable)
        ttk.Label(params_frame, text="Pickup Location:").grid(row=0, column=0, sticky=tk.W, pady=5)
        pickup_frame = ttk.Frame(params_frame)
        pickup_frame.grid(row=0, column=1, padx=5, pady=5, sticky=(tk.W, tk.E))
        
        self.pickup_var = tk.StringVar()
        self.pickup_combo = ttk.Combobox(pickup_frame, textvariable=self.pickup_var, width=35)
        self.pickup_combo.grid(row=0, column=0, sticky=(tk.W, tk.E))
        self.pickup_combo.bind('<KeyRelease>', self._filter_pickup_locations)
        
        # Search button
        ttk.Button(pickup_frame, text="Search", command=self._show_location_search, width=8).grid(row=0, column=1, padx=(5, 0))
        
        # Number of unloading locations
        ttk.Label(params_frame, text="Number of Unloading Locations:").grid(row=1, column=0, sticky=tk.W, pady=5)
        drops_frame = ttk.Frame(params_frame)
        drops_frame.grid(row=1, column=1, padx=5, pady=5, sticky=(tk.W, tk.E))
        
        self.num_drops_var = tk.IntVar(value=5)
        ttk.Spinbox(drops_frame, from_=1, to=100, textvariable=self.num_drops_var, width=10).grid(row=0, column=0, sticky=tk.W)
        
        # Manual selection button
        ttk.Button(drops_frame, text="Select Manually", command=self._select_drop_locations, width=12).grid(row=0, column=1, padx=(10, 0))
        
        # Selection mode
        self.selection_mode_var = tk.StringVar(value="random")
        selection_frame = ttk.Frame(params_frame)
        selection_frame.grid(row=2, column=1, padx=5, pady=5, sticky=tk.W)
        
        ttk.Radiobutton(selection_frame, text="Random Selection", variable=self.selection_mode_var, value="random").grid(row=0, column=0, sticky=tk.W, padx=(0, 10))
        ttk.Radiobutton(selection_frame, text="Manual Selection", variable=self.selection_mode_var, value="manual").grid(row=0, column=1, sticky=tk.W)
        
        # Orders per location
        ttk.Label(params_frame, text="Orders per Location:").grid(row=3, column=0, sticky=tk.W, pady=5)
        orders_frame = ttk.Frame(params_frame)
        orders_frame.grid(row=3, column=1, sticky=tk.W, padx=5, pady=5)
        
        self.orders_per_drop_var = tk.IntVar(value=3)
        ttk.Spinbox(orders_frame, from_=1, to=50, textvariable=self.orders_per_drop_var, width=10).pack(side=tk.LEFT)
        
        self.random_orders_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(orders_frame, text="Use random (1 to N)", variable=self.random_orders_var).pack(
            side=tk.LEFT, padx=10
        )
        
        # Shipper
        ttk.Label(params_frame, text="Shipper Name:").grid(row=4, column=0, sticky=tk.W, pady=5)
        self.shipper_var = tk.StringVar(value="Default Shipper")
        ttk.Entry(params_frame, textvariable=self.shipper_var, width=40).grid(
            row=4, column=1, padx=5, pady=5, sticky=(tk.W, tk.E)
        )
        
        # Order ID Prefix
        ttk.Label(params_frame, text="Order ID Prefix:").grid(row=5, column=0, sticky=tk.W, pady=5)
        self.order_prefix_var = tk.StringVar(value="ORD")
        ttk.Entry(params_frame, textvariable=self.order_prefix_var, width=20).grid(
            row=5, column=1, padx=5, pady=5, sticky=tk.W
        )
        
        # Start Index
        ttk.Label(params_frame, text="Start Index:").grid(row=6, column=0, sticky=tk.W, pady=5)
        self.start_index_var = tk.IntVar(value=1)
        ttk.Spinbox(params_frame, from_=0, to=99999, textvariable=self.start_index_var, width=10).grid(
            row=6, column=1, padx=5, pady=5, sticky=tk.W
        )
        
        # === Test Scenarios Section ===
        scenarios_frame = ttk.LabelFrame(main_frame, text="3. Test Scenarios (Optional)", padding="10")
        scenarios_frame.grid(row=row, column=0, sticky=(tk.W, tk.E), pady=5)
        row += 1
        
        # Create notebook for organized tabs
        notebook = ttk.Notebook(scenarios_frame)
        notebook.grid(row=0, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=5)
        
        # Tab 1: Presence/Required Checks
        tab1 = ttk.Frame(notebook)
        notebook.add(tab1, text="1. Required Checks")
        
        self.missing_orderid_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(tab1, text="Missing OrderId (blank)", variable=self.missing_orderid_var).grid(row=0, column=0, sticky=tk.W, pady=2, padx=5)
        
        self.missing_item_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(tab1, text="Missing ItemRefId/Item Name", variable=self.missing_item_var).grid(row=1, column=0, sticky=tk.W, pady=2, padx=5)
        
        self.missing_shipper_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(tab1, text="Missing Shipper", variable=self.missing_shipper_var).grid(row=2, column=0, sticky=tk.W, pady=2, padx=5)
        
        self.missing_consignee_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(tab1, text="Missing Consignee", variable=self.missing_consignee_var).grid(row=3, column=0, sticky=tk.W, pady=2, padx=5)
        
        self.missing_delivery_time_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(tab1, text="Missing DeliverOnOrAfter/Before", variable=self.missing_delivery_time_var).grid(row=4, column=0, sticky=tk.W, pady=2, padx=5)
        
        self.missing_locations_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(tab1, text="Missing PickupLocationId/DropOffLocationId", variable=self.missing_locations_var).grid(row=5, column=0, sticky=tk.W, pady=2, padx=5)
        
        self.missing_qty_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(tab1, text="Missing Qty or CBM", variable=self.missing_qty_var).grid(row=6, column=0, sticky=tk.W, pady=2, padx=5)
        
        # Tab 2: Format/Type Validation
        tab2 = ttk.Frame(notebook)
        notebook.add(tab2, text="2. Format Validation")
        
        self.invalid_orderid_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(tab2, text="Invalid OrderId (chars, spaces, too long)", variable=self.invalid_orderid_var).grid(row=0, column=0, sticky=tk.W, pady=2, padx=5)
        
        self.bad_time_format_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(tab2, text="Bad Date Formats (2025/40/99)", variable=self.bad_time_format_var).grid(row=1, column=0, sticky=tk.W, pady=2, padx=5)
        
        self.bad_time_windows_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(tab2, text="End < Start (DeliverOnBefore < DeliverOnAfter)", variable=self.bad_time_windows_var).grid(row=2, column=0, sticky=tk.W, pady=2, padx=5)
        
        self.invalid_qty_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(tab2, text="Invalid Qty/CBM (non-numeric, zero, negative)", variable=self.invalid_qty_var).grid(row=3, column=0, sticky=tk.W, pady=2, padx=5)
        
        # Tab 3: Business Rules
        tab3 = ttk.Frame(notebook)
        notebook.add(tab3, text="3. Business Rules")
        
        self.mixed_pickup_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(tab3, text="Mixed PickupLocationId (multiple pickups)", variable=self.mixed_pickup_var).grid(row=0, column=0, sticky=tk.W, pady=2, padx=5)
        
        self.consignee_mismatch_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(tab3, text="Consignee Mismatch (wrong org name)", variable=self.consignee_mismatch_var).grid(row=1, column=0, sticky=tk.W, pady=2, padx=5)
        
        self.unknown_locations_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(tab3, text="Unknown Location IDs", variable=self.unknown_locations_var).grid(row=2, column=0, sticky=tk.W, pady=2, padx=5)
        
        # Tab 4: Duplicates & Conflicts
        tab4 = ttk.Frame(notebook)
        notebook.add(tab4, text="4. Duplicates")
        
        self.duplicate_ids_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(tab4, text="Duplicate Order IDs", variable=self.duplicate_ids_var).grid(row=0, column=0, sticky=tk.W, pady=2, padx=5)
        
        # Tab 5: Whitespace/Case
        tab5 = ttk.Frame(notebook)
        notebook.add(tab5, text="5. Whitespace/Case")
        
        self.whitespace_case_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(tab5, text="Leading/trailing spaces in IDs", variable=self.whitespace_case_var).grid(row=0, column=0, sticky=tk.W, pady=2, padx=5)
        
        self.case_sensitivity_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(tab5, text="Case differences (loc_001 vs LOC_001)", variable=self.case_sensitivity_var).grid(row=1, column=0, sticky=tk.W, pady=2, padx=5)
        
        # Quick select buttons
        button_frame = ttk.Frame(scenarios_frame)
        button_frame.grid(row=1, column=0, columnspan=3, pady=10)
        
        ttk.Button(button_frame, text="Select All", command=self._select_all_scenarios).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="Clear All", command=self._clear_all_scenarios).pack(side=tk.LEFT, padx=5)
        
        # === Action Buttons ===
        action_frame = ttk.Frame(main_frame)
        action_frame.grid(row=row, column=0, pady=20)
        row += 1
        
        ttk.Button(
            action_frame,
            text="Generate Order File",
            command=self._generate_orders,
            style='Accent.TButton'
        ).pack(side=tk.LEFT, padx=10)
        
        ttk.Button(
            action_frame,
            text="Quit",
            command=self.root.quit
        ).pack(side=tk.LEFT, padx=10)
        
        # === Status Bar ===
        self.status_var = tk.StringVar(value="Ready. Order spec is hardcoded. Please load and process location master file.")
        status_bar = ttk.Label(main_frame, textvariable=self.status_var, relief=tk.SUNKEN, anchor=tk.W)
        status_bar.grid(row=row, column=0, sticky=(tk.W, tk.E), pady=5)
        
    
    def _browse_location(self):
        """Browse for location master file."""
        initial_dir = os.path.join(os.getcwd(), 'data', 'locations')
        if not os.path.exists(initial_dir):
            initial_dir = os.getcwd()
            
        filename = filedialog.askopenfilename(
            title="Select Location Master File",
            initialdir=initial_dir,
            filetypes=[("Excel files", "*.xlsx *.xls"), ("All files", "*.*")]
        )
        
        if filename:
            self.location_path = filename
            self.location_path_var.set(filename)
            # Enable process button
            self.process_button.config(state='normal')
            self.status_var.set(f"Location file selected: {os.path.basename(filename)}. Click 'Process Location File' to continue.")
    
    def _process_location(self):
        """Process the selected location master file."""
        if not self.location_path:
            messagebox.showerror("Error", "Please select a location master file first.")
            return
            
        try:
            self.status_var.set("Processing location master...")
            self.root.update()
            
            # Load the location master
            self.location_df = loaders.load_location_master(self.location_path)
            
            # Get available columns and show them to user
            columns = self.location_df.columns.tolist()
            
            # Try to find the best matching columns
            ref_col = None
            org_col = None
            name_col = None
            
            # Look for the exact column names we need
            for col in columns:
                col_lower = str(col).lower().strip()
                # Look for "Location Reference ID" exactly
                if col_lower == 'location reference id':
                    ref_col = col
                    break
                # Also check for variations
                elif 'location' in col_lower and 'reference' in col_lower and 'id' in col_lower:
                    ref_col = col
                    break
            
            for col in columns:
                col_lower = str(col).lower().strip()
                # Look for "Organization Short Name" exactly
                if col_lower == 'organization short name':
                    org_col = col
                    break
                # Also check for variations
                elif 'organization' in col_lower and 'short' in col_lower and 'name' in col_lower:
                    org_col = col
                    break
            
            for col in columns:
                col_lower = str(col).lower().strip()
                # Look for "Location Name" exactly
                if col_lower == 'location name':
                    name_col = col
                    break
                # Also check for variations
                elif 'location' in col_lower and 'name' in col_lower:
                    name_col = col
                    break
            
            # If no specific columns found, use the first available column
            if not ref_col and columns:
                ref_col = columns[0]
            if not org_col and columns:
                org_col = columns[0] 
            if not name_col and columns:
                name_col = columns[0]
            
            # Store the found column names internally (no UI display needed)
            self.ref_col_name = ref_col or columns[0] if columns else None
            self.org_col_name = org_col or columns[0] if columns else None
            self.name_col_name = name_col or columns[0] if columns else None
            
            # Update pickup location dropdown (will be populated after column mapping)
            if ref_col:
                self._update_location_refs()
            
            # Disable process button
            self.process_button.config(state='disabled')
            
            self.status_var.set(f"✓ Processed location master with {len(self.location_df)} locations")
            
            # Show available columns in the message
            columns_list = "\n".join([f"  - {col}" for col in columns])
            
            messagebox.showinfo(
                "Success",
                f"Location master processed successfully!\n\n"
                f"Locations: {len(self.location_df)}\n"
                f"Available columns:\n{columns_list}\n\n"
                f"Column mappings set automatically:\n"
                f"  Ref ID: {ref_col}\n"
                f"  Org Name: {org_col}\n"
                f"  Location Name: {name_col}\n\n"
                f"Pickup location dropdown is now populated. Please select pickup location."
            )
        except Exception as e:
            messagebox.showerror("Error Processing Location Master", str(e))
            self.status_var.set("Error processing location master")
    
    
    def _update_location_refs(self):
        """Update the pickup location dropdown based on selected ref column."""
        ref_col = getattr(self, 'ref_col_name', None)
        if ref_col and self.location_df is not None:
            self.location_refs = loaders.get_location_references(self.location_df, ref_col)
            self.pickup_combo['values'] = self.location_refs
            if self.location_refs:
                self.pickup_var.set(self.location_refs[0])
    
    def _filter_pickup_locations(self, event):
        """Filter pickup locations as user types."""
        search_text = self.pickup_var.get().lower()
        if search_text:
            filtered_locations = [loc for loc in self.location_refs if search_text in loc.lower()]
            self.pickup_combo['values'] = filtered_locations
        else:
            self.pickup_combo['values'] = self.location_refs
    
    def _show_location_search(self):
        """Show a search dialog for locations."""
        if not self.location_refs:
            messagebox.showwarning("Warning", "No locations available. Please process location file first.")
            return
        
        # Create search window
        search_window = tk.Toplevel(self.root)
        search_window.title("Search Locations")
        search_window.geometry("600x400")
        search_window.transient(self.root)
        search_window.grab_set()
        
        # Search frame
        search_frame = ttk.Frame(search_window, padding="10")
        search_frame.pack(fill=tk.BOTH, expand=True)
        
        # Search entry
        ttk.Label(search_frame, text="Search Location:").pack(anchor=tk.W)
        search_var = tk.StringVar()
        search_entry = ttk.Entry(search_frame, textvariable=search_var, width=50)
        search_entry.pack(fill=tk.X, pady=5)
        search_entry.focus()
        
        # Listbox with scrollbar
        list_frame = ttk.Frame(search_frame)
        list_frame.pack(fill=tk.BOTH, expand=True, pady=5)
        
        listbox = tk.Listbox(list_frame)
        scrollbar = ttk.Scrollbar(list_frame, orient=tk.VERTICAL, command=listbox.yview)
        listbox.configure(yscrollcommand=scrollbar.set)
        
        listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Populate listbox
        def update_list(search_text=""):
            listbox.delete(0, tk.END)
            filtered = [loc for loc in self.location_refs if search_text.lower() in loc.lower()]
            for loc in filtered:
                listbox.insert(tk.END, loc)
        
        update_list()
        
        # Search function
        def on_search_change(*args):
            update_list(search_var.get())
        
        search_var.trace('w', on_search_change)
        
        # Selection function
        def on_select():
            selection = listbox.curselection()
            if selection:
                selected_location = listbox.get(selection[0])
                self.pickup_var.set(selected_location)
                search_window.destroy()
        
        listbox.bind('<Double-Button-1>', lambda e: on_select())
        
        # Buttons
        button_frame = ttk.Frame(search_frame)
        button_frame.pack(fill=tk.X, pady=5)
        
        ttk.Button(button_frame, text="Select", command=on_select).pack(side=tk.RIGHT, padx=5)
        ttk.Button(button_frame, text="Cancel", command=search_window.destroy).pack(side=tk.RIGHT)
    
    def _select_drop_locations(self):
        """Show a dialog for manually selecting drop-off locations."""
        if not self.location_refs:
            messagebox.showwarning("Warning", "No locations available. Please process location file first.")
            return
        
        pickup_ref = self.pickup_var.get()
        if not pickup_ref:
            messagebox.showwarning("Warning", "Please select a pickup location first.")
            return
        
        # Filter out pickup location from available drops
        available_drops = [ref for ref in self.location_refs if ref != pickup_ref]
        
        # Create selection window
        select_window = tk.Toplevel(self.root)
        select_window.title("Select Drop-off Locations")
        select_window.geometry("700x500")
        select_window.transient(self.root)
        select_window.grab_set()
        
        # Main frame
        main_frame = ttk.Frame(select_window, padding="10")
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Instructions
        ttk.Label(main_frame, text="Select drop-off locations (excluding pickup location):", 
                 font=('Arial', 10, 'bold')).pack(anchor=tk.W, pady=(0, 10))
        
        # Search frame
        search_frame = ttk.Frame(main_frame)
        search_frame.pack(fill=tk.X, pady=(0, 10))
        
        ttk.Label(search_frame, text="Search:").pack(side=tk.LEFT)
        search_var = tk.StringVar()
        search_entry = ttk.Entry(search_frame, textvariable=search_var, width=30)
        search_entry.pack(side=tk.LEFT, padx=5)
        search_entry.focus()
        
        # Selection frame
        selection_frame = ttk.Frame(main_frame)
        selection_frame.pack(fill=tk.BOTH, expand=True, pady=(0, 10))
        
        # Left side - Available locations
        left_frame = ttk.LabelFrame(selection_frame, text="Available Locations", padding="5")
        left_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(0, 5))
        
        available_listbox = tk.Listbox(left_frame, selectmode=tk.MULTIPLE)
        available_scrollbar = ttk.Scrollbar(left_frame, orient=tk.VERTICAL, command=available_listbox.yview)
        available_listbox.configure(yscrollcommand=available_scrollbar.set)
        
        available_listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        available_scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Right side - Selected locations
        right_frame = ttk.LabelFrame(selection_frame, text="Selected Locations", padding="5")
        right_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=(5, 0))
        
        selected_listbox = tk.Listbox(right_frame, selectmode=tk.MULTIPLE)
        selected_scrollbar = ttk.Scrollbar(right_frame, orient=tk.VERTICAL, command=selected_listbox.yview)
        selected_listbox.configure(yscrollcommand=selected_scrollbar.set)
        
        selected_listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        selected_scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Control buttons
        control_frame = ttk.Frame(selection_frame)
        control_frame.pack(side=tk.BOTTOM, fill=tk.X, pady=(10, 0))
        
        ttk.Button(control_frame, text="Add →", command=lambda: self._add_selected_location(
            available_listbox, selected_listbox, available_drops
        )).pack(side=tk.LEFT, padx=5)
        
        ttk.Button(control_frame, text="Remove ←", command=lambda: self._remove_selected_location(
            selected_listbox, available_listbox, available_drops
        )).pack(side=tk.LEFT, padx=5)
        
        # Populate available locations
        def update_available_list(search_text=""):
            available_listbox.delete(0, tk.END)
            filtered = [loc for loc in available_drops if search_text.lower() in loc.lower()]
            for loc in filtered:
                available_listbox.insert(tk.END, loc)
        
        update_available_list()
        
        # Search function
        def on_search_change(*args):
            update_available_list(search_var.get())
        
        search_var.trace('w', on_search_change)
        
        # Double-click to add
        available_listbox.bind('<Double-Button-1>', lambda e: self._add_selected_location(
            available_listbox, selected_listbox, available_drops
        ))
        
        # Double-click to remove
        selected_listbox.bind('<Double-Button-1>', lambda e: self._remove_selected_location(
            selected_listbox, available_listbox, available_drops
        ))
        
        # Bottom buttons
        bottom_frame = ttk.Frame(main_frame)
        bottom_frame.pack(fill=tk.X, pady=(10, 0))
        
        def on_ok():
            selected_count = selected_listbox.size()
            if selected_count == 0:
                messagebox.showwarning("Warning", "Please select at least one drop-off location.")
                return
            
            # Store selected locations
            self.manual_drop_locations = []
            for i in range(selected_count):
                self.manual_drop_locations.append(selected_listbox.get(i))
            
            # Update number of drops
            self.num_drops_var.set(selected_count)
            self.selection_mode_var.set("manual")
            
            select_window.destroy()
            messagebox.showinfo("Success", f"Selected {selected_count} drop-off locations for manual selection mode.")
        
        ttk.Button(bottom_frame, text="OK", command=on_ok).pack(side=tk.RIGHT, padx=5)
        ttk.Button(bottom_frame, text="Cancel", command=select_window.destroy).pack(side=tk.RIGHT)
    
    def _add_selected_location(self, source_listbox, target_listbox, available_drops):
        """Add selected locations from source to target listbox."""
        selection = source_listbox.curselection()
        for idx in reversed(selection):  # Reverse to maintain order
            location = source_listbox.get(idx)
            # Add to target if not already there
            if location not in target_listbox.get(0, tk.END):
                target_listbox.insert(tk.END, location)
                # Remove from source
                source_listbox.delete(idx)
    
    def _remove_selected_location(self, source_listbox, target_listbox, available_drops):
        """Remove selected locations from source and add back to target listbox."""
        selection = source_listbox.curselection()
        for idx in reversed(selection):  # Reverse to maintain order
            location = source_listbox.get(idx)
            # Remove from source
            source_listbox.delete(idx)
            # Add back to available if it's a valid location
            if location in available_drops:
                target_listbox.insert(tk.END, location)
    
    def _select_all_scenarios(self):
        """Select all test scenarios."""
        self.missing_orderid_var.set(True)
        self.missing_item_var.set(True)
        self.missing_shipper_var.set(True)
        self.missing_consignee_var.set(True)
        self.missing_delivery_time_var.set(True)
        self.missing_locations_var.set(True)
        self.missing_qty_var.set(True)
        self.invalid_orderid_var.set(True)
        self.bad_time_format_var.set(True)
        self.bad_time_windows_var.set(True)
        self.invalid_qty_var.set(True)
        self.mixed_pickup_var.set(True)
        self.consignee_mismatch_var.set(True)
        self.unknown_locations_var.set(True)
        self.duplicate_ids_var.set(True)
        self.whitespace_case_var.set(True)
        self.case_sensitivity_var.set(True)
    
    def _clear_all_scenarios(self):
        """Clear all test scenarios."""
        self.missing_orderid_var.set(False)
        self.missing_item_var.set(False)
        self.missing_shipper_var.set(False)
        self.missing_consignee_var.set(False)
        self.missing_delivery_time_var.set(False)
        self.missing_locations_var.set(False)
        self.missing_qty_var.set(False)
        self.invalid_orderid_var.set(False)
        self.bad_time_format_var.set(False)
        self.bad_time_windows_var.set(False)
        self.invalid_qty_var.set(False)
        self.mixed_pickup_var.set(False)
        self.consignee_mismatch_var.set(False)
        self.unknown_locations_var.set(False)
        self.duplicate_ids_var.set(False)
        self.whitespace_case_var.set(False)
        self.case_sensitivity_var.set(False)
    
    def _generate_orders(self):
        """Main order generation workflow."""
        try:
            # Validate all inputs
            self._validate_inputs()
            
            # Get parameters
            ref_col = getattr(self, 'ref_col_name', None)
            org_col = getattr(self, 'org_col_name', None)
            pickup_ref = self.pickup_var.get()
            num_drops = self.num_drops_var.get()
            
            # Select drop locations based on mode
            if self.selection_mode_var.get() == "manual":
                # Use manually selected locations
                if not self.manual_drop_locations:
                    raise validators.ValidationError("No manually selected drop locations. Please use 'Select Manually' button.")
                drop_refs = self.manual_drop_locations
                num_drops = len(drop_refs)  # Update num_drops to match manual selection
            else:
                # Random selection (original logic)
                available_drops = [ref for ref in self.location_refs if ref != pickup_ref]
                if len(available_drops) < num_drops:
                    raise validators.ValidationError(
                        f"Not enough drop locations. Need {num_drops}, but only {len(available_drops)} available "
                        f"(excluding pickup)"
                    )
                
                import random
                drop_refs = random.sample(available_drops, num_drops)
            
            # Prepare options with all test scenarios
            options = {
                'orders_per_drop': self.orders_per_drop_var.get(),
                'max_orders_per_drop': self.orders_per_drop_var.get(),
                'use_random_orders': self.random_orders_var.get(),
                'shipper': self.shipper_var.get(),
                'order_prefix': self.order_prefix_var.get(),
                'start_index': self.start_index_var.get(),
                'pickup_ref': pickup_ref,
                'num_drops': num_drops,
                
                # Test scenarios
                'missing_orderid': self.missing_orderid_var.get(),
                'missing_item': self.missing_item_var.get(),
                'missing_shipper': self.missing_shipper_var.get(),
                'missing_consignee': self.missing_consignee_var.get(),
                'missing_delivery_time': self.missing_delivery_time_var.get(),
                'missing_locations': self.missing_locations_var.get(),
                'missing_qty': self.missing_qty_var.get(),
                'invalid_orderid': self.invalid_orderid_var.get(),
                'bad_time_format': self.bad_time_format_var.get(),
                'bad_time_windows': self.bad_time_windows_var.get(),
                'invalid_qty': self.invalid_qty_var.get(),
                'mixed_pickup': self.mixed_pickup_var.get(),
                'consignee_mismatch': self.consignee_mismatch_var.get(),
                'unknown_locations': self.unknown_locations_var.get(),
                'duplicate_ids': self.duplicate_ids_var.get(),
                'whitespace_case': self.whitespace_case_var.get(),
                'case_sensitivity': self.case_sensitivity_var.get(),
            }
            
            # Generate orders
            self.status_var.set("Generating orders...")
            self.root.update()
            
            orders_df = builder.generate_dataframe(
                spec_cols=self.spec_columns,
                loc_df=self.location_df,
                ref_col=ref_col,
                org_col=org_col,
                pickup_ref=pickup_ref,
                drop_refs=drop_refs,
                options=options
            )
            
            # Save file
            self._save_orders(orders_df, options)
            
        except validators.ValidationError as e:
            messagebox.showerror("Validation Error", str(e))
            self.status_var.set("Validation failed")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to generate orders:\n{str(e)}")
            self.status_var.set("Generation failed")
    
    def _validate_inputs(self):
        """Validate all user inputs before generation."""
        # Check location file processed
        if self.location_df is None:
            raise validators.ValidationError("Please process a location master file first")
        
        # Validate column mappings
        ref_col = getattr(self, 'ref_col_name', None)
        org_col = getattr(self, 'org_col_name', None)
        
        if not ref_col:
            raise validators.ValidationError("Location Reference ID column not found")
        
        if not org_col:
            raise validators.ValidationError("Organization Short Name column not found")
        
        validators.ensure_location_mapping(self.location_df, ref_col, org_col)
        
        # Update location refs with selected column
        self.location_refs = loaders.get_location_references(self.location_df, ref_col)
        
        # Validate parameters
        pickup_ref = self.pickup_var.get()
        validators.ensure_pickup_in_master(self.location_df, ref_col, pickup_ref)
        
        validators.validate_generation_parameters(
            num_drops=self.num_drops_var.get(),
            orders_per_drop=self.orders_per_drop_var.get(),
            total_available_locations=len(self.location_refs),
            pickup_ref=pickup_ref
        )
        
        validators.validate_order_id_format(
            prefix=self.order_prefix_var.get(),
            start_index=self.start_index_var.get()
        )
        
        validators.validate_shipper_name(self.shipper_var.get())
    
    def _save_orders(self, orders_df: pd.DataFrame, options: dict):
        """Save generated orders to Excel file."""
        # Check for custom output directory (for user's specific requirement)
        custom_output = r"D:\ordermanger optimizer check\order file creation\Created file"
        if os.path.exists(custom_output):
            default_dir = custom_output
        else:
            # Default output directory
            default_dir = os.path.join(os.getcwd(), 'data', 'output')
            if not os.path.exists(default_dir):
                try:
                    os.makedirs(default_dir)
                except:
                    default_dir = os.getcwd()
        
        # Generate default filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        default_filename = f"Orders_{timestamp}.xlsx"
        
        # Ask user for save location
        filename = filedialog.asksaveasfilename(
            title="Save Generated Order File",
            initialdir=default_dir,
            initialfile=default_filename,
            defaultextension=".xlsx",
            filetypes=[("Excel files", "*.xlsx"), ("All files", "*.*")]
        )
        
        if filename:
            try:
                # Write to Excel with xlsxwriter engine for better formatting
                with pd.ExcelWriter(filename, engine='xlsxwriter', 
                                  datetime_format='YYYY-MM-DD HH:MM:SS',
                                  date_format='YYYY-MM-DD') as writer:
                    
                    # Ensure datetime columns are proper datetime objects
                    datetime_columns = ['PickupTime', 'DeliverOnOrAfter', 'DeliverOnOrBefore']
                    for col in datetime_columns:
                        if col in orders_df.columns:
                            # Convert to datetime if not already
                            if orders_df[col].dtype == 'object':
                                orders_df[col] = pd.to_datetime(orders_df[col], errors='coerce')
                    
                    # Main orders sheet
                    orders_df.to_excel(writer, sheet_name='Orders', index=False)
                    
                    # Test scenarios sheet
                    self._create_test_scenarios_sheet(writer, options)
                    
                    # Get workbook and worksheet objects
                    workbook = writer.book
                    worksheet = writer.sheets['Orders']
                    
                    # Format datetime columns
                    datetime_format = workbook.add_format({'num_format': 'YYYY-MM-DD HH:MM:SS'})
                    for idx, col in enumerate(orders_df.columns):
                        if col in datetime_columns:
                            worksheet.set_column(idx, idx, 20, datetime_format)
                        else:
                            max_len = max(
                                orders_df[col].astype(str).apply(len).max(),
                                len(str(col))
                            ) + 2
                            worksheet.set_column(idx, idx, min(max_len, 50))
                
                self.status_var.set(f"✓ Saved {len(orders_df)} orders to {os.path.basename(filename)}")
                messagebox.showinfo(
                    "Success",
                    f"Order file generated successfully!\n\n"
                    f"Orders: {len(orders_df)}\n"
                    f"File: {filename}\n"
                    f"Includes test scenarios sheet"
                )
            except Exception as e:
                messagebox.showerror("Save Error", f"Failed to save file:\n{str(e)}")
                self.status_var.set("Save failed")
    
    def _create_test_scenarios_sheet(self, writer, options):
        """Create a test scenarios information sheet."""
        scenarios_data = []
        
        # Mandatory fields info
        scenarios_data.append(["MANDATORY FIELDS", ""])
        scenarios_data.append(["OrderId", "Required - unique identifier"])
        scenarios_data.append(["ItemRefId", "Required - item reference"])
        scenarios_data.append(["Item name", "Required - item description"])
        scenarios_data.append(["Shipper", "Required - shipper name"])
        scenarios_data.append(["Consignee", "Required - consignee name"])
        scenarios_data.append(["DeliverOnOrAfter", "Required - delivery start time"])
        scenarios_data.append(["DeliverOnOrBefore", "Required - delivery end time"])
        scenarios_data.append(["PickupLocationId", "Required - pickup location reference"])
        scenarios_data.append(["DropOffLocationId", "Required - drop-off location reference"])
        scenarios_data.append(["Qty", "Required - quantity"])
        scenarios_data.append(["", ""])
        
        # Test scenarios info
        scenarios_data.append(["TEST SCENARIOS IN THIS FILE", ""])
        scenarios_data.append(["", ""])
        
        # 1. Presence/Required Checks
        scenarios_data.append(["1. PRESENCE/REQUIRED CHECKS", ""])
        scenarios_data.append(["Missing OrderId", "✓ Enabled" if options.get('missing_orderid') else "✗ Disabled"])
        scenarios_data.append(["Missing ItemRefId/Item Name", "✓ Enabled" if options.get('missing_item') else "✗ Disabled"])
        scenarios_data.append(["Missing Shipper", "✓ Enabled" if options.get('missing_shipper') else "✗ Disabled"])
        scenarios_data.append(["Missing Consignee", "✓ Enabled" if options.get('missing_consignee') else "✗ Disabled"])
        scenarios_data.append(["Missing DeliverOnOrAfter/Before", "✓ Enabled" if options.get('missing_delivery_time') else "✗ Disabled"])
        scenarios_data.append(["Missing PickupLocationId/DropOffLocationId", "✓ Enabled" if options.get('missing_locations') else "✗ Disabled"])
        scenarios_data.append(["Missing Qty or CBM", "✓ Enabled" if options.get('missing_qty') else "✗ Disabled"])
        scenarios_data.append(["", ""])
        
        # 2. Format/Type Validation
        scenarios_data.append(["2. FORMAT/TYPE VALIDATION", ""])
        scenarios_data.append(["Invalid OrderId", "✓ Enabled" if options.get('invalid_orderid') else "✗ Disabled"])
        scenarios_data.append(["Bad Date Formats", "✓ Enabled" if options.get('bad_time_format') else "✗ Disabled"])
        scenarios_data.append(["End < Start (DeliverOnBefore < DeliverOnAfter)", "✓ Enabled" if options.get('bad_time_windows') else "✗ Disabled"])
        scenarios_data.append(["Invalid Qty/CBM", "✓ Enabled" if options.get('invalid_qty') else "✗ Disabled"])
        scenarios_data.append(["", ""])
        
        # 3. Business Rules/Cross-field Checks
        scenarios_data.append(["3. BUSINESS RULES/CROSS-FIELD CHECKS", ""])
        scenarios_data.append(["Mixed PickupLocationId", "✓ Enabled" if options.get('mixed_pickup') else "✗ Disabled"])
        scenarios_data.append(["Consignee Mismatch", "✓ Enabled" if options.get('consignee_mismatch') else "✗ Disabled"])
        scenarios_data.append(["Unknown Location IDs", "✓ Enabled" if options.get('unknown_locations') else "✗ Disabled"])
        scenarios_data.append(["", ""])
        
        # 4. Duplicates/Conflicts
        scenarios_data.append(["4. DUPLICATES/CONFLICTS", ""])
        scenarios_data.append(["Duplicate Order IDs", "✓ Enabled" if options.get('duplicate_ids') else "✗ Disabled"])
        scenarios_data.append(["", ""])
        
        # 5. Whitespace/Case Sensitivity
        scenarios_data.append(["5. WHITESPACE/CASE SENSITIVITY", ""])
        scenarios_data.append(["Leading/trailing spaces", "✓ Enabled" if options.get('whitespace_case') else "✗ Disabled"])
        scenarios_data.append(["Case differences", "✓ Enabled" if options.get('case_sensitivity') else "✗ Disabled"])
        scenarios_data.append(["", ""])
        
        # Generation info
        scenarios_data.append(["GENERATION INFO", ""])
        scenarios_data.append(["Pickup Location", options.get('pickup_ref', 'N/A')])
        scenarios_data.append(["Number of Drop Locations", options.get('num_drops', 'N/A')])
        scenarios_data.append(["Orders per Location", options.get('orders_per_drop', 'N/A')])
        scenarios_data.append(["Use Random Orders", "Yes" if options.get('use_random_orders') else "No"])
        scenarios_data.append(["Shipper Name", options.get('shipper', 'N/A')])
        scenarios_data.append(["Order ID Prefix", options.get('order_prefix', 'N/A')])
        scenarios_data.append(["Start Index", options.get('start_index', 'N/A')])
        
        # Create DataFrame and write to sheet
        scenarios_df = pd.DataFrame(scenarios_data, columns=['Test Scenario', 'Status'])
        scenarios_df.to_excel(writer, sheet_name='Test Scenarios', index=False)
        
        # Format the scenarios sheet
        workbook = writer.book
        worksheet = writer.sheets['Test Scenarios']
        
        # Format headers
        header_format = workbook.add_format({'bold': True, 'bg_color': '#D7E4BC'})
        worksheet.set_row(0, None, header_format)
        
        # Auto-fit columns
        worksheet.set_column(0, 0, 40)
        worksheet.set_column(1, 1, 30)

