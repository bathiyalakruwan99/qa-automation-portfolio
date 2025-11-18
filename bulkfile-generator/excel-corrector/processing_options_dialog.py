import tkinter as tk
from tkinter import ttk

class ProcessingOptionsDialog:
    """Dialog for selecting processing options for each sheet and column"""
    
    def __init__(self, parent):
        self.parent = parent
        self.result = None
        
        # Create the dialog window
        self.dialog = tk.Toplevel(parent)
        self.dialog.title("Processing Options")
        self.dialog.geometry("900x700")
        self.dialog.resizable(True, True)
        self.dialog.transient(parent)
        self.dialog.grab_set()
        
        # Center the dialog
        self.center_dialog()
        
        # Create the options
        self.create_widgets()
        
        # Wait for the dialog to close
        self.parent.wait_window(self.dialog)
    
    def center_dialog(self):
        """Center the dialog on screen"""
        self.dialog.update_idletasks()
        width = self.dialog.winfo_width()
        height = self.dialog.winfo_height()
        x = (self.dialog.winfo_screenwidth() // 2) - (width // 2)
        y = (self.dialog.winfo_screenheight() // 2) - (height // 2)
        self.dialog.geometry(f'{width}x{height}+{x}+{y}')
    
    def create_widgets(self):
        """Create the dialog widgets"""
        # Main container
        main_frame = ttk.Frame(self.dialog, padding="20")
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Title
        title_label = ttk.Label(main_frame, text="🔧 Processing Options", font=('Arial', 16, 'bold'))
        title_label.pack(pady=(0, 20))
        
        # Description
        desc_label = ttk.Label(main_frame, text="Select which corrections to apply and whether to fill empty fields with dummy data:", 
                              font=('Arial', 10))
        desc_label.pack(pady=(0, 20))
        
        # Create notebook for tabs
        notebook = ttk.Notebook(main_frame)
        notebook.pack(fill=tk.BOTH, expand=True, pady=(0, 20))
        
        # Create tabs for each sheet
        self.create_organization_tab(notebook)
        self.create_divisions_tab(notebook)
        self.create_human_resources_tab(notebook)
        self.create_vehicles_tab(notebook)
        self.create_locations_tab(notebook)
        
        # Buttons frame
        button_frame = ttk.Frame(main_frame)
        button_frame.pack(fill=tk.X, pady=(20, 0))
        
        # Process button
        process_btn = ttk.Button(button_frame, text="Process with Selected Options", 
                                command=self.process_with_options)
        process_btn.pack(side=tk.RIGHT, padx=(10, 0))
        
        # Cancel button
        cancel_btn = ttk.Button(button_frame, text="Cancel", command=self.cancel)
        cancel_btn.pack(side=tk.RIGHT)
        
        # Apply to all button
        apply_all_btn = ttk.Button(button_frame, text="Apply All Corrections", 
                                  command=self.apply_all_corrections)
        apply_all_btn.pack(side=tk.LEFT)
        
        # Disable all button
        disable_all_btn = ttk.Button(button_frame, text="Disable All", 
                                    command=self.disable_all_corrections)
        disable_all_btn.pack(side=tk.LEFT, padx=(0, 10))
    
    def create_organization_tab(self, notebook):
        """Create the Organization Details tab"""
        frame = ttk.Frame(notebook, padding="15")
        notebook.add(frame, text="Organization Details")
        
        # Title
        ttk.Label(frame, text="Organization Details Sheet Options", font=('Arial', 12, 'bold')).pack(anchor=tk.W, pady=(0, 15))
        
        # Sheet-specific control buttons
        sheet_control_frame = ttk.Frame(frame)
        sheet_control_frame.pack(fill=tk.X, pady=(0, 15))
        
        # Apply All for this sheet
        apply_all_org_btn = ttk.Button(sheet_control_frame, text="Apply All for Organization", 
                                      command=lambda: self.apply_all_for_sheet(self.org_options))
        apply_all_org_btn.pack(side=tk.LEFT, padx=(0, 10))
        
        # Disable All for this sheet
        disable_all_org_btn = ttk.Button(sheet_control_frame, text="Disable All for Organization", 
                                        command=lambda: self.disable_all_for_sheet(self.org_options))
        disable_all_org_btn.pack(side=tk.LEFT)
        
        # Create options
        self.org_options = {}
        
        options = [
            ("Organization Name", "Fill empty names with dummy data"),
            ("Organization Short Name", "Fix duplicates and fill empty values"),
            ("Operations", "Fill empty operations with 'Default'"),
            ("Status", "Correct to 'NON_BOI' or 'BOI'"),
            ("Verticals", "Correct to valid verticals (e.g., VERT-TRN)"),
            ("Country", "Correct to 'Sri Lanka'"),
            ("State", "Correct to proper Sri Lankan districts"),
            ("Principle Contact First Name", "Fill empty names with dummy data"),
            ("Principle Contact Last Name", "Fill empty names with dummy data"),
            ("Address Line", "Fill empty addresses with dummy data"),
            ("City", "Fill empty cities with dummy data")
        ]
        
        for option_name, description in options:
            self.create_option_row(frame, option_name, description, self.org_options)
    
    def create_divisions_tab(self, notebook):
        """Create the Divisions tab"""
        frame = ttk.Frame(notebook, padding="15")
        notebook.add(frame, text="Divisions")
        
        # Title
        ttk.Label(frame, text="Divisions Sheet Options", font=('Arial', 12, 'bold')).pack(anchor=tk.W, pady=(0, 15))
        
        # Sheet-specific control buttons
        sheet_control_frame = ttk.Frame(frame)
        sheet_control_frame.pack(fill=tk.X, pady=(0, 15))
        
        # Apply All for this sheet
        apply_all_div_btn = ttk.Button(sheet_control_frame, text="Apply All for Divisions", 
                                      command=lambda: self.apply_all_for_sheet(self.div_options))
        apply_all_div_btn.pack(side=tk.LEFT, padx=(0, 10))
        
        # Disable All for this sheet
        disable_all_div_btn = ttk.Button(sheet_control_frame, text="Disable All for Divisions", 
                                        command=lambda: self.disable_all_for_sheet(self.div_options))
        disable_all_div_btn.pack(side=tk.LEFT)
        
        # Create options
        self.div_options = {}
        
        options = [
            ("Organization Short Name", "Fill empty values with 'EmptyDummy'"),
            ("Division Name", "Fill empty values with 'Admin'"),
            ("Purpose", "Fill empty values with 'PPS-STG' and validate existing values"),
            ("Principle Contact First Name", "Fill empty values with 'Admin'"),
            ("Principle Contact Last Name", "Fill empty values with 'Admin'")
        ]
        
        for option_name, description in options:
            self.create_option_row(frame, option_name, description, self.div_options)
    
    def create_human_resources_tab(self, notebook):
        """Create the Human Resources tab"""
        frame = ttk.Frame(notebook, padding="15")
        notebook.add(frame, text="Human Resources")
        
        # Title
        ttk.Label(frame, text="Human Resources Sheet Options", font=('Arial', 12, 'bold')).pack(anchor=tk.W, pady=(0, 15))
        
        # Sheet-specific control buttons
        sheet_control_frame = ttk.Frame(frame)
        sheet_control_frame.pack(fill=tk.X, pady=(0, 15))
        
        # Apply All for this sheet
        apply_all_hr_btn = ttk.Button(sheet_control_frame, text="Apply All for Human Resources", 
                                     command=lambda: self.apply_all_for_sheet(self.hr_options))
        apply_all_hr_btn.pack(side=tk.LEFT, padx=(0, 10))
        
        # Disable All for this sheet
        disable_all_hr_btn = ttk.Button(sheet_control_frame, text="Disable All for Human Resources", 
                                       command=lambda: self.disable_all_for_sheet(self.hr_options))
        disable_all_hr_btn.pack(side=tk.LEFT)
        
        # Create options
        self.hr_options = {}
        
        options = [
            ("First Name", "Fill empty values with 'First Name + Organization Short Name'"),
            ("Last Name", "Fill empty values with 'Last Name + Organization Short Name'"),
            ("Role", "Fill empty values with 'Driver'"),
            ("Division", "Correct to 'Admin'"),
            ("Designation", "Fill empty values with 'Manager'"),
            ("NIC", "Handle red cells and fill empty values"),
            ("Email", "Handle red cells and fill empty values"),
            ("Gender", "Standardize to Male/Female"),
            ("Operations", "Fill empty values with 'Default'"),
            ("Create a User Account", "Fill empty values with 'TRUE'")
        ]
        
        for option_name, description in options:
            self.create_option_row(frame, option_name, description, self.hr_options)
    
    def create_vehicles_tab(self, notebook):
        """Create the Vehicles tab"""
        frame = ttk.Frame(notebook, padding="15")
        notebook.add(frame, text="Vehicles")
        
        # Title
        ttk.Label(frame, text="Vehicles Sheet Options", font=('Arial', 12, 'bold')).pack(anchor=tk.W, pady=(0, 15))
        
        # Sheet-specific control buttons
        sheet_control_frame = ttk.Frame(frame)
        sheet_control_frame.pack(fill=tk.X, pady=(0, 15))
        
        # Apply All for this sheet
        apply_all_vehicle_btn = ttk.Button(sheet_control_frame, text="Apply All for Vehicles", 
                                          command=lambda: self.apply_all_for_sheet(self.vehicle_options))
        apply_all_vehicle_btn.pack(side=tk.LEFT, padx=(0, 10))
        
        # Disable All for this sheet
        disable_all_vehicle_btn = ttk.Button(sheet_control_frame, text="Disable All for Vehicles", 
                                            command=lambda: self.disable_all_for_sheet(self.vehicle_options))
        disable_all_vehicle_btn.pack(side=tk.LEFT)
        
        # Create options
        self.vehicle_options = {}
        
        options = [
            ("Division", "Correct to 'Admin'"),
            ("Vehicle Type", "Correct to 'TRUCK'"),
            ("Load Type", "Correct to 'LOADS'"),
            ("Categories", "Format categories (e.g., 20Ft)")
        ]
        
        for option_name, description in options:
            self.create_option_row(frame, option_name, description, self.vehicle_options)
    
    def create_locations_tab(self, notebook):
        """Create the Locations tab"""
        frame = ttk.Frame(notebook, padding="15")
        notebook.add(frame, text="Locations")
        
        # Title
        ttk.Label(frame, text="Locations Sheet Options", font=('Arial', 12, 'bold')).pack(anchor=tk.W, pady=(0, 15))
        
        # Sheet-specific control buttons
        sheet_control_frame = ttk.Frame(frame)
        sheet_control_frame.pack(fill=tk.X, pady=(0, 15))
        
        # Apply All for this sheet
        apply_all_location_btn = ttk.Button(sheet_control_frame, text="Apply All for Locations", 
                                           command=lambda: self.apply_all_for_sheet(self.location_options))
        apply_all_location_btn.pack(side=tk.LEFT, padx=(0, 10))
        
        # Disable All for this sheet
        disable_all_location_btn = ttk.Button(sheet_control_frame, text="Disable All for Locations", 
                                             command=lambda: self.disable_all_for_sheet(self.location_options))
        disable_all_location_btn.pack(side=tk.LEFT)
        
        # Create options
        self.location_options = {}
        
        options = [
            ("Location Reference ID", "Fill empty IDs and handle duplicates"),
            ("Location Name", "Fill empty names with dummy data"),
            ("Status", "Update to 'Create'")
        ]
        
        for option_name, description in options:
            self.create_option_row(frame, option_name, description, self.location_options)
    
    def create_option_row(self, parent, option_name, description, options_dict):
        """Create a row with correction and dummy data options"""
        frame = ttk.Frame(parent)
        frame.pack(fill=tk.X, pady=5)
        
        # Option name
        name_label = ttk.Label(frame, text=option_name, font=('Arial', 10, 'bold'), width=25)
        name_label.pack(side=tk.LEFT, padx=(0, 10))
        
        # Description
        desc_label = ttk.Label(frame, text=description, font=('Arial', 9), foreground='#666')
        desc_label.pack(side=tk.LEFT, padx=(0, 20))
        
        # Correction checkbox
        correct_var = tk.BooleanVar(value=True)
        correct_cb = ttk.Checkbutton(frame, text="Correct", variable=correct_var)
        correct_cb.pack(side=tk.RIGHT, padx=(0, 10))
        
        # Dummy data checkbox
        dummy_var = tk.BooleanVar(value=True)
        dummy_cb = ttk.Checkbutton(frame, text="Fill with Dummy Data", variable=dummy_var)
        dummy_cb.pack(side=tk.RIGHT, padx=(0, 10))
        
        # Store the variables
        options_dict[option_name] = {
            'correct': correct_var,
            'dummy_data': dummy_var
        }
    
    def apply_all_corrections(self):
        """Enable all corrections and dummy data filling"""
        for options_dict in [self.org_options, self.div_options, self.hr_options, self.vehicle_options, self.location_options]:
            for option in options_dict.values():
                option['correct'].set(True)
                option['dummy_data'].set(True)
    
    def disable_all_corrections(self):
        """Disable all corrections and dummy data filling"""
        for options_dict in [self.org_options, self.div_options, self.hr_options, self.vehicle_options, self.location_options]:
            for option in options_dict.values():
                option['correct'].set(False)
                option['dummy_data'].set(False)
    
    def apply_all_for_sheet(self, options_dict):
        """Enable all corrections and dummy data filling for a specific sheet"""
        for option in options_dict.values():
            option['correct'].set(True)
            option['dummy_data'].set(True)
    
    def disable_all_for_sheet(self, options_dict):
        """Disable all corrections and dummy data filling for a specific sheet"""
        for option in options_dict.values():
            option['correct'].set(False)
            option['dummy_data'].set(False)
    
    def process_with_options(self):
        """Process with the selected options"""
        # Convert BooleanVar objects to actual boolean values
        def convert_options(options_dict):
            converted = {}
            for option_name, option_data in options_dict.items():
                converted[option_name] = {
                    'correct': option_data['correct'].get(),
                    'dummy_data': option_data['dummy_data'].get()
                }
            return converted
        
        # Collect all options with converted boolean values
        self.result = {
            'organization': convert_options(self.org_options),
            'divisions': convert_options(self.div_options),
            'human_resources': convert_options(self.hr_options),
            'vehicles': convert_options(self.vehicle_options),
            'locations': convert_options(self.location_options)
        }
        
        # Close the dialog
        self.dialog.destroy()
    
    def cancel(self):
        """Cancel the operation"""
        self.result = None
        self.dialog.destroy()
