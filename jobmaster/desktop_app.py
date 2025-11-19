import tkinter as tk
from tkinter import ttk, filedialog, messagebox, scrolledtext
import pandas as pd
import os
from datetime import datetime
import tempfile
import threading
import io
import math

class JobMasterDesktopApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Job Master Data Processor")
        self.root.geometry("1400x800")
        
        # Initialize variables
        self.processed_data = None
        self.column_mapping = None
        self.original_data = None
        self.filtered_data = None
        self.current_filters = {}
        
        # Create necessary directories
        self.create_directories()
        
        # Column mapping configuration
        self.column_mapping_config = {
            'Job ID': ['Job ID', 'job_id', 'JobID', 'ID'],
            'Load ID': ['Load ID', 'load_id', 'LoadID', 'Shipment ID', 'ShipmentID'],
            'Job Name': ['Job Name', 'job_name', 'Job Title', 'Name'],
            'Job Date': ['Job Creation DateTime', 'job_date', 'creation_date', 'Job Date'],
            'GPS Executed': ['Distance: GPS', 'gps_distance', 'GPS Distance', 'Distance'],
            'Job Status': ['Status', 'job_status', 'Job Status'],
            'Start Time': ['Start Time: Actual', 'actual_start_time', 'Start Time'],
            'End Time': ['End Time: Actual', 'actual_end_time', 'End Time'],
            'Duration': ['Duration: Actual', 'actual_duration', 'Duration'],
            'Duration Variance': ['Duration: Variance', 'duration_variance', 'Variance'],
            'Job Count': ['Job Count', 'job_count', 'Jobs Count', 'Number of Jobs'],
            'Load Count': ['Load Count', 'load_count', 'Loads Count', 'Number of Loads'],
            'Payment Schedule Status': ['Payment Schedule Status', 'payment_schedule_status', 'Schedule Status'],
            'Payment Schedule Number': ['Payment Schedule Number', 'payment_schedule_number', 'Schedule Number'],
            'Cost Item': ['Cost Item', 'cost_item'],
            'Currency': ['Currency', 'currency', 'Currency Code'],
            'Cost Contract Amount': ['Cost Contract Amount', 'cost_contract_amount', 'Contract Cost'],
            'Sub Total Cost': ['Sub Total: Cost', 'subtotal_cost', 'Total Cost'],
            'Invoice Status': ['Invoice Status', 'invoice_status'],
            'Invoice Number': ['Invoice Number', 'invoice_number', 'Invoice No'],
            'Invoice Item': ['Invoice Item', 'invoice_item'],
            'Revenue Contract Amount': ['Revenue Contract Amount', 'revenue_contract_amount', 'Contract Revenue'],
            'Sub Total Revenue': ['Sub Total: Revenue', 'subtotal_revenue', 'Revenue'],
            'Vehicle': ['Vehicle', 'vehicle_id', 'Vehicle ID'],
            'Vehicle Type': ['Vehicle Type', 'vehicle_type'],
            'Trip Type': ['Trip Type', 'trip_type', 'TripType'],
            'Planned Stops: Qty': ['Planned Stops: Qty', 'planned_stops_qty', 'Planned Stops Qty', 'Stops Qty'],
            'Driver Name': ['Driver Name', 'driver_name', 'Driver'],
            'Driver Phone': ['Driver Phone', 'driver_phone', 'Phone'],
            'Driver NIC': ['Driver NIC', 'driver_nic', 'NIC']
        }
        
        self.setup_ui()
        
    def create_directories(self):
        """Create necessary directories for file organization"""
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.downloads_dir = os.path.join(self.base_dir, 'downloads')
        self.reports_dir = os.path.join(self.base_dir, 'reports')
        self.exports_dir = os.path.join(self.base_dir, 'exports')
        
        for directory in [self.downloads_dir, self.reports_dir, self.exports_dir]:
            if not os.path.exists(directory):
                os.makedirs(directory)
                
        # Note: Directory creation will be shown in welcome message
    
    def generate_filename(self, base_name, extension='.xlsx'):
        """Generate a meaningful filename based on current search filters"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        # Start with base name
        filename_parts = [base_name]
        
        # Add filter information if filters are applied
        if self.current_filters:
            filter_parts = []
            if self.current_filters.get('job_id'):
                filter_parts.append(f"JobID-{self.current_filters['job_id']}")
            if self.current_filters.get('status') and self.current_filters['status'] != 'All':
                filter_parts.append(f"Status-{self.current_filters['status']}")
            if self.current_filters.get('keyword'):
                keyword = self.current_filters['keyword'].replace(' ', '-')[:10]
                filter_parts.append(f"Keyword-{keyword}")
            if self.current_filters.get('driver'):
                driver = self.current_filters['driver'].replace(' ', '-')[:10]
                filter_parts.append(f"Driver-{driver}")
            if self.current_filters.get('vehicle'):
                filter_parts.append(f"Vehicle-{self.current_filters['vehicle']}")
            if self.current_filters.get('trip_type') and self.current_filters['trip_type'] != 'All':
                filter_parts.append(f"TripType-{self.current_filters['trip_type']}")
            if self.current_filters.get('payment_schedule_status') and self.current_filters['payment_schedule_status'] != 'All':
                filter_parts.append(f"PaymentStatus-{self.current_filters['payment_schedule_status']}")
            if self.current_filters.get('invoice_status') and self.current_filters['invoice_status'] != 'All':
                filter_parts.append(f"InvoiceStatus-{self.current_filters['invoice_status']}")
            if self.current_filters.get('date_from') or self.current_filters.get('date_to'):
                if self.current_filters.get('date_from') and self.current_filters.get('date_to'):
                    filter_parts.append(f"DateRange-{self.current_filters['date_from']}-to-{self.current_filters['date_to']}")
                elif self.current_filters.get('date_from'):
                    filter_parts.append(f"DateFrom-{self.current_filters['date_from']}")
                elif self.current_filters.get('date_to'):
                    filter_parts.append(f"DateTo-{self.current_filters['date_to']}")
            
            if self.current_filters.get('gps_executed_only'):
                filter_parts.append("GPSExecutedOnly")

            
            if filter_parts:
                filename_parts.extend(filter_parts)
        
        # Add timestamp
        filename_parts.append(timestamp)
        
        # Join parts and add extension
        filename = '_'.join(filename_parts) + extension
        
        # Clean filename (remove invalid characters)
        invalid_chars = '<>:"/\\|?*'
        for char in invalid_chars:
            filename = filename.replace(char, '-')
        
        return filename
        
    def setup_ui(self):
        # Main frame
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Configure grid weights
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(1, weight=1)
        main_frame.rowconfigure(3, weight=1)
        
        # Title
        title_label = ttk.Label(main_frame, text="Job Master Data Processor", 
                               font=('Arial', 16, 'bold'))
        title_label.grid(row=0, column=0, columnspan=2, pady=(0, 10))
        
        # Count Summary section - Moved to top
        count_frame = ttk.LabelFrame(main_frame, text="Count Summary", padding="10")
        count_frame.grid(row=1, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=(0, 10))
        
        # Job Count display
        job_count_display_frame = ttk.Frame(count_frame)
        job_count_display_frame.grid(row=0, column=0, sticky=(tk.W, tk.E), pady=(0, 5))
        
        ttk.Label(job_count_display_frame, text="Total Jobs:", font=('Arial', 9, 'bold')).grid(row=0, column=0, sticky=tk.W)
        self.job_count_label = ttk.Label(job_count_display_frame, text="0", font=('Arial', 12, 'bold'), foreground="blue")
        self.job_count_label.grid(row=0, column=1, padx=(10, 0))
        
        # Load Count display
        load_count_display_frame = ttk.Frame(count_frame)
        load_count_display_frame.grid(row=0, column=2, sticky=(tk.W, tk.E), pady=(0, 5), padx=(20, 0))
        
        ttk.Label(load_count_display_frame, text="Non FTL-DIST:", font=('Arial', 9, 'bold')).grid(row=0, column=0, sticky=tk.W)
        self.load_count_label = ttk.Label(load_count_display_frame, text="0", font=('Arial', 12, 'bold'), foreground="green")
        self.load_count_label.grid(row=0, column=1, padx=(10, 0))
        
        # FTL-DISTRIBUTION Load Count display (Current Logic)
        ftl_load_count_display_frame = ttk.Frame(count_frame)
        ftl_load_count_display_frame.grid(row=0, column=4, sticky=(tk.W, tk.E), pady=(0, 5), padx=(20, 0))
        
        ttk.Label(ftl_load_count_display_frame, text="FTL-DIST (Current):", font=('Arial', 9, 'bold')).grid(row=0, column=0, sticky=tk.W)
        self.ftl_load_count_label = ttk.Label(ftl_load_count_display_frame, text="0", font=('Arial', 12, 'bold'), foreground="red")
        self.ftl_load_count_label.grid(row=0, column=1, padx=(10, 0))
        
        # FTL-DISTRIBUTION Load Count display (Previous Logic - 8x)
        ftl_prev_load_count_display_frame = ttk.Frame(count_frame)
        ftl_prev_load_count_display_frame.grid(row=0, column=5, sticky=(tk.W, tk.E), pady=(0, 5), padx=(20, 0))
        
        ttk.Label(ftl_prev_load_count_display_frame, text="FTL-DIST (8x):", font=('Arial', 9, 'bold')).grid(row=0, column=0, sticky=tk.W)
        self.ftl_prev_load_count_label = ttk.Label(ftl_prev_load_count_display_frame, text="0", font=('Arial', 12, 'bold'), foreground="orange")
        self.ftl_prev_load_count_label.grid(row=0, column=1, padx=(10, 0))
        
        # FTL-DISTRIBUTION Load Count display (10x Logic)
        ftl_10x_load_count_display_frame = ttk.Frame(count_frame)
        ftl_10x_load_count_display_frame.grid(row=0, column=6, sticky=(tk.W, tk.E), pady=(0, 5), padx=(20, 0))
        
        ttk.Label(ftl_10x_load_count_display_frame, text="FTL-DIST (10x):", font=('Arial', 9, 'bold')).grid(row=0, column=0, sticky=tk.W)
        self.ftl_10x_load_count_label = ttk.Label(ftl_10x_load_count_display_frame, text="0", font=('Arial', 12, 'bold'), foreground="darkorange")
        self.ftl_10x_load_count_label.grid(row=0, column=1, padx=(10, 0))
        
        # Total Loads Count display (Current Logic)
        total_load_count_display_frame = ttk.Frame(count_frame)
        total_load_count_display_frame.grid(row=0, column=7, sticky=(tk.W, tk.E), pady=(0, 5), padx=(20, 0))
        
        ttk.Label(total_load_count_display_frame, text="Total (Current):", font=('Arial', 9, 'bold')).grid(row=0, column=0, sticky=tk.W)
        self.total_load_count_label = ttk.Label(total_load_count_display_frame, text="0", font=('Arial', 12, 'bold'), foreground="purple")
        self.total_load_count_label.grid(row=0, column=1, padx=(10, 0))
        
        # Total Loads Count display (8x Logic)
        total_8x_load_count_display_frame = ttk.Frame(count_frame)
        total_8x_load_count_display_frame.grid(row=0, column=8, sticky=(tk.W, tk.E), pady=(0, 5), padx=(20, 0))
        
        ttk.Label(total_8x_load_count_display_frame, text="Total (8x):", font=('Arial', 9, 'bold')).grid(row=0, column=0, sticky=tk.W)
        self.total_8x_load_count_label = ttk.Label(total_8x_load_count_display_frame, text="0", font=('Arial', 12, 'bold'), foreground="brown")
        self.total_8x_load_count_label.grid(row=0, column=1, padx=(10, 0))
        
        # Total Loads Count display (10x Logic)
        total_10x_load_count_display_frame = ttk.Frame(count_frame)
        total_10x_load_count_display_frame.grid(row=0, column=9, sticky=(tk.W, tk.E), pady=(0, 5), padx=(20, 0))
        
        ttk.Label(total_10x_load_count_display_frame, text="Total (10x):", font=('Arial', 9, 'bold')).grid(row=0, column=0, sticky=tk.W)
        self.total_10x_load_count_label = ttk.Label(total_10x_load_count_display_frame, text="0", font=('Arial', 12, 'bold'), foreground="darkred")
        self.total_10x_load_count_label.grid(row=0, column=1, padx=(10, 0))
        
        # Count buttons
        count_buttons_frame = ttk.Frame(count_frame)
        count_buttons_frame.grid(row=1, column=0, columnspan=5, pady=(5, 0))
        
        ttk.Button(count_buttons_frame, text="Count Jobs & Loads", 
                  command=self.count_jobs_and_loads).grid(row=0, column=0, padx=(0, 5))
        ttk.Button(count_buttons_frame, text="Export Count Report", 
                  command=self.export_count_report).grid(row=0, column=1)
        
        # Left panel for controls with scrollbar
        left_panel = ttk.Frame(main_frame)
        left_panel.grid(row=2, column=0, rowspan=3, sticky=(tk.W, tk.E, tk.N, tk.S), padx=(0, 10))
        
        # Create canvas and scrollbar for left panel
        left_canvas = tk.Canvas(left_panel)
        left_scrollbar = ttk.Scrollbar(left_panel, orient="vertical", command=left_canvas.yview)
        scrollable_frame = ttk.Frame(left_canvas)
        
        scrollable_frame.bind(
            "<Configure>",
            lambda e: left_canvas.configure(scrollregion=left_canvas.bbox("all"))
        )
        
        left_canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        left_canvas.configure(yscrollcommand=left_scrollbar.set)
        
        # Pack canvas and scrollbar
        left_canvas.pack(side="left", fill="both", expand=True)
        left_scrollbar.pack(side="right", fill="y")
        
        # Bind mouse wheel to canvas
        def _on_mousewheel(event):
            left_canvas.yview_scroll(int(-1*(event.delta/120)), "units")
        left_canvas.bind_all("<MouseWheel>", _on_mousewheel)
        
        # File upload section
        upload_frame = ttk.LabelFrame(scrollable_frame, text="File Upload", padding="10")
        upload_frame.grid(row=0, column=0, sticky=(tk.W, tk.E), pady=(0, 10))
        
        ttk.Button(upload_frame, text="Select Excel File", 
                  command=self.select_file).grid(row=0, column=0, pady=(0, 10))
        
        self.file_label = ttk.Label(upload_frame, text="No file selected", 
                                   foreground="gray")
        self.file_label.grid(row=1, column=0, pady=(0, 10))
        
        ttk.Button(upload_frame, text="Process File", 
                  command=self.process_file).grid(row=2, column=0)
        
        # Status section
        status_frame = ttk.LabelFrame(scrollable_frame, text="Status", padding="10")
        status_frame.grid(row=1, column=0, sticky=(tk.W, tk.E), pady=(0, 10))
        
        self.status_text = scrolledtext.ScrolledText(status_frame, height=8, width=35)
        self.status_text.grid(row=0, column=0, sticky=(tk.W, tk.E))
        
        # Search section
        search_frame = ttk.LabelFrame(scrollable_frame, text="Search & Filter", padding="10")
        search_frame.grid(row=2, column=0, sticky=(tk.W, tk.E), pady=(0, 10))
        
        # Search instructions
        ttk.Label(search_frame, text="Search data in real-time:", 
                 font=('Arial', 9, 'bold')).grid(row=0, column=0, sticky=tk.W, pady=(0, 5))
        
        # Job ID search
        ttk.Label(search_frame, text="Job ID:").grid(row=1, column=0, sticky=tk.W)
        self.job_id_entry = ttk.Entry(search_frame, width=30)
        self.job_id_entry.grid(row=2, column=0, pady=(0, 5))
        self.job_id_entry.bind('<KeyRelease>', self.on_search_change)
        
        # Job Name/Keyword search
        ttk.Label(search_frame, text="Keyword (Search All):").grid(row=3, column=0, sticky=tk.W)
        self.job_name_entry = ttk.Entry(search_frame, width=30)
        self.job_name_entry.grid(row=4, column=0, pady=(0, 5))
        self.job_name_entry.bind('<KeyRelease>', self.on_search_change)
        
        # Status filter
        ttk.Label(search_frame, text="Job Status:").grid(row=5, column=0, sticky=tk.W)
        self.status_combo = ttk.Combobox(search_frame, width=27, state="readonly")
        self.status_combo.grid(row=6, column=0, pady=(0, 5))
        self.status_combo.bind('<<ComboboxSelected>>', self.on_search_change)
        
        # Driver search
        ttk.Label(search_frame, text="Driver Name:").grid(row=7, column=0, sticky=tk.W)
        self.driver_entry = ttk.Entry(search_frame, width=30)
        self.driver_entry.grid(row=8, column=0, pady=(0, 5))
        self.driver_entry.bind('<KeyRelease>', self.on_search_change)
        
        # Vehicle search
        ttk.Label(search_frame, text="Vehicle:").grid(row=9, column=0, sticky=tk.W)
        self.vehicle_entry = ttk.Entry(search_frame, width=30)
        self.vehicle_entry.grid(row=10, column=0, pady=(0, 5))
        self.vehicle_entry.bind('<KeyRelease>', self.on_search_change)
        
        # Trip Type filter
        ttk.Label(search_frame, text="Trip Type:").grid(row=11, column=0, sticky=tk.W)
        self.trip_type_combo = ttk.Combobox(search_frame, width=27, state="readonly")
        self.trip_type_combo.grid(row=12, column=0, pady=(0, 5))
        self.trip_type_combo.bind('<<ComboboxSelected>>', self.on_search_change)
        
        # Payment Schedule Status filter
        ttk.Label(search_frame, text="Payment Schedule Status:").grid(row=13, column=0, sticky=tk.W)
        self.payment_schedule_combo = ttk.Combobox(search_frame, width=27, state="readonly")
        self.payment_schedule_combo.grid(row=14, column=0, pady=(0, 5))
        self.payment_schedule_combo.bind('<<ComboboxSelected>>', self.on_search_change)
        
        # Invoice Status filter
        ttk.Label(search_frame, text="Invoice Status:").grid(row=15, column=0, sticky=tk.W)
        self.invoice_status_combo = ttk.Combobox(search_frame, width=27, state="readonly")
        self.invoice_status_combo.grid(row=16, column=0, pady=(0, 5))
        self.invoice_status_combo.bind('<<ComboboxSelected>>', self.on_search_change)
        
        # Date range
        ttk.Label(search_frame, text="Date Range:").grid(row=17, column=0, sticky=tk.W)
        
        date_frame = ttk.Frame(search_frame)
        date_frame.grid(row=18, column=0, pady=(0, 5))
        
        ttk.Label(date_frame, text="From:").grid(row=0, column=0, sticky=tk.W)
        self.date_from_entry = ttk.Entry(date_frame, width=12)
        self.date_from_entry.grid(row=0, column=1, padx=(5, 10))
        self.date_from_entry.bind('<KeyRelease>', self.on_search_change)
        
        ttk.Label(date_frame, text="To:").grid(row=0, column=2, sticky=tk.W)
        self.date_to_entry = ttk.Entry(date_frame, width=12)
        self.date_to_entry.grid(row=0, column=3, padx=(5, 0))
        self.date_to_entry.bind('<KeyRelease>', self.on_search_change)
        

        
        # Search buttons
        search_buttons_frame = ttk.Frame(search_frame)
        search_buttons_frame.grid(row=19, column=0, pady=(10, 0))
        
        ttk.Button(search_buttons_frame, text="Search Now", 
                  command=self.search_data).grid(row=0, column=0, padx=(0, 5))
        ttk.Button(search_buttons_frame, text="Clear All", 
                  command=self.clear_search).grid(row=0, column=1, padx=(0, 5))
        
        # Search results counter
        self.search_results_label = ttk.Label(search_frame, text="", 
                                            font=('Arial', 9), foreground="blue")
        self.search_results_label.grid(row=20, column=0, pady=(5, 0))
        
        # Real-time search toggle
        self.realtime_var = tk.BooleanVar(value=True)
        ttk.Checkbutton(search_frame, text="Real-time search", 
                       variable=self.realtime_var).grid(row=21, column=0, pady=(5, 0), sticky=tk.W)
        
        # GPS Executed filter
        self.gps_executed_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(search_frame, text="GPS Executed Only", 
                       variable=self.gps_executed_var).grid(row=22, column=0, pady=(5, 0), sticky=tk.W)
        

        
        # Export section
        export_frame = ttk.LabelFrame(scrollable_frame, text="Export", padding="10")
        export_frame.grid(row=3, column=0, sticky=(tk.W, tk.E))
        
        ttk.Button(export_frame, text="Export to Excel", 
                  command=self.export_excel).grid(row=0, column=0, pady=(0, 5))
        ttk.Button(export_frame, text="Export to PDF", 
                  command=self.export_pdf).grid(row=1, column=0, pady=(0, 5))
        
        # Job-wise export
        ttk.Label(export_frame, text="Job-wise Export:").grid(row=2, column=0, sticky=tk.W, pady=(10, 0))
        self.job_combo = ttk.Combobox(export_frame, width=27, state="readonly")
        self.job_combo.grid(row=3, column=0, pady=(5, 5))
        
        job_export_frame = ttk.Frame(export_frame)
        job_export_frame.grid(row=4, column=0, pady=(0, 5))
        
        ttk.Button(job_export_frame, text="Excel", 
                  command=self.export_job_excel).grid(row=0, column=0, padx=(0, 5))
        ttk.Button(job_export_frame, text="PDF", 
                  command=self.export_job_pdf).grid(row=0, column=1)
        
        # Right panel for data display
        right_panel = ttk.Frame(main_frame)
        right_panel.grid(row=2, column=1, rowspan=4, sticky=(tk.W, tk.E, tk.N, tk.S))
        right_panel.columnconfigure(0, weight=1)
        right_panel.rowconfigure(1, weight=1)
        
        # Metrics frame
        metrics_frame = ttk.LabelFrame(right_panel, text="Summary Metrics", padding="10")
        metrics_frame.grid(row=0, column=0, sticky=(tk.W, tk.E), pady=(0, 10))
        
        self.metrics_labels = {}
        metric_names = ["Total Records", "Completed Jobs", "Total Revenue", "Total Costs", "Total Profit", "Avg Duration"]
        for i, metric in enumerate(metric_names):
            frame = ttk.Frame(metrics_frame)
            frame.grid(row=0, column=i, padx=5)  # Reduced padding to fit more metrics
            ttk.Label(frame, text=metric, font=('Arial', 8)).grid(row=0, column=0)
            self.metrics_labels[metric] = ttk.Label(frame, text="0", font=('Arial', 10, 'bold'))  # Slightly smaller font
            self.metrics_labels[metric].grid(row=1, column=0)
        
        # Data table
        table_frame = ttk.LabelFrame(right_panel, text="Data Table", padding="10")
        table_frame.grid(row=1, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        table_frame.columnconfigure(0, weight=1)
        table_frame.rowconfigure(1, weight=1)
        
        # Column selection
        col_select_frame = ttk.Frame(table_frame)
        col_select_frame.grid(row=0, column=0, sticky=(tk.W, tk.E), pady=(0, 10))
        
        ttk.Label(col_select_frame, text="Columns to Display (All selected by default):").grid(row=0, column=0, sticky=tk.W)
        
        # Add buttons for column selection
        col_buttons_frame = ttk.Frame(col_select_frame)
        col_buttons_frame.grid(row=1, column=0, sticky=(tk.W, tk.E), pady=(5, 0))
        
        ttk.Button(col_buttons_frame, text="Select All", 
                  command=self.select_all_columns).grid(row=0, column=0, padx=(0, 5))
        ttk.Button(col_buttons_frame, text="Clear All", 
                  command=self.clear_all_columns).grid(row=0, column=1, padx=(0, 5))
        ttk.Button(col_buttons_frame, text="Show Key Columns", 
                  command=self.select_key_columns).grid(row=0, column=2)
        
        self.columns_listbox = tk.Listbox(col_select_frame, height=4, selectmode=tk.MULTIPLE)
        self.columns_listbox.grid(row=2, column=0, sticky=(tk.W, tk.E), pady=(5, 0))
        self.columns_listbox.bind('<<ListboxSelect>>', self.on_column_select)
        
        # Add scrollbar for columns listbox
        col_scrollbar = ttk.Scrollbar(col_select_frame, orient=tk.VERTICAL, command=self.columns_listbox.yview)
        col_scrollbar.grid(row=2, column=1, sticky=(tk.N, tk.S), pady=(5, 0))
        self.columns_listbox.configure(yscrollcommand=col_scrollbar.set)
        
        # Treeview for data display
        tree_frame = ttk.Frame(table_frame)
        tree_frame.grid(row=1, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        tree_frame.columnconfigure(0, weight=1)
        tree_frame.rowconfigure(0, weight=1)
        
        self.tree = ttk.Treeview(tree_frame, show='headings')
        self.tree.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Scrollbars for treeview
        v_scrollbar = ttk.Scrollbar(tree_frame, orient=tk.VERTICAL, command=self.tree.yview)
        v_scrollbar.grid(row=0, column=1, sticky=(tk.N, tk.S))
        self.tree.configure(yscrollcommand=v_scrollbar.set)
        
        h_scrollbar = ttk.Scrollbar(tree_frame, orient=tk.HORIZONTAL, command=self.tree.xview)
        h_scrollbar.grid(row=1, column=0, sticky=(tk.W, tk.E))
        self.tree.configure(xscrollcommand=h_scrollbar.set)
        
        # Display any pending messages from before UI was ready
        self._display_pending_messages()
        
        # Initialize status
        self.log_message("Welcome to Job Master Data Processor!")
        self.log_message("Folder structure ready: exports/, reports/, downloads/")
        self.log_message("Please select an Excel file to begin processing.")
        
    def _display_pending_messages(self):
        """Display any messages that were logged before UI was ready"""
        if hasattr(self, '_pending_messages'):
            for message in self._pending_messages:
                self.status_text.insert(tk.END, f"{message}\n")
            self.status_text.see(tk.END)
            self._pending_messages.clear()  # Clear the pending messages
        
    def log_message(self, message):
        """Add a message to the status log"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        # Check if status_text widget exists (UI might not be setup yet)
        if hasattr(self, 'status_text') and self.status_text:
            self.status_text.insert(tk.END, f"[{timestamp}] {message}\n")
            self.status_text.see(tk.END)
            self.root.update_idletasks()
        else:
            # Store message for later if UI not ready
            if not hasattr(self, '_pending_messages'):
                self._pending_messages = []
            self._pending_messages.append(f"[{timestamp}] {message}")
        
    def select_file(self):
        """Open file dialog to select Excel file"""
        file_path = filedialog.askopenfilename(
            title="Select Excel File",
            filetypes=[("Excel files", "*.xlsx *.xls"), ("All files", "*.*")]
        )
        
        if file_path:
            self.selected_file = file_path
            filename = os.path.basename(file_path)
            self.file_label.config(text=f"Selected: {filename}", foreground="blue")
            self.log_message(f"Selected file: {filename}")
        
    def find_column(self, df, possible_names):
        """Find the actual column name in the DataFrame that matches our mapping"""
        for name in possible_names:
            if name in df.columns:
                return name
        return None
        
    def process_file(self):
        """Process the selected Excel file"""
        if not hasattr(self, 'selected_file'):
            messagebox.showwarning("Warning", "Please select an Excel file first!")
            return
            
        def process_in_thread():
            try:
                self.log_message("Processing Excel file...")
                
                # Read Excel file
                df = pd.read_excel(self.selected_file, sheet_name=0)
                self.log_message(f"Read {len(df)} rows from Excel file")
                
                # Create mapped DataFrame
                mapped_data = {}
                column_found = {}
                
                for standard_name, possible_names in self.column_mapping_config.items():
                    found_column = self.find_column(df, possible_names)
                    if found_column:
                        mapped_data[standard_name] = df[found_column]
                        column_found[standard_name] = found_column
                        self.log_message(f"Mapped '{found_column}' to '{standard_name}'")
                    else:
                        mapped_data[standard_name] = None
                        column_found[standard_name] = None
                        self.log_message(f"Column for '{standard_name}' not found")
                
                processed_df = pd.DataFrame(mapped_data)
                
                # Clean data
                processed_df = self.clean_data(processed_df)
                
                # Store processed data
                self.processed_data = processed_df
                self.column_mapping = column_found
                self.original_data = df
                self.filtered_data = processed_df
                
                self.log_message(f"Successfully processed {len(processed_df)} records!")
                
                # Update UI
                self.root.after(0, self.update_ui_after_processing)
                
            except Exception as e:
                self.log_message(f"Error processing file: {str(e)}")
                messagebox.showerror("Error", f"Error processing file: {str(e)}")
        
        # Run processing in separate thread to prevent UI freezing
        thread = threading.Thread(target=process_in_thread)
        thread.daemon = True
        thread.start()
        
    def clean_data(self, df):
        """Clean and standardize the data"""
        # Remove rows where all values are NaN
        df = df.dropna(how='all')
        
        # Create a copy to avoid SettingWithCopyWarning
        df = df.copy()
        
        # Convert date columns
        if 'Job Date' in df.columns:
            df.loc[:, 'Job Date'] = pd.to_datetime(df['Job Date'], errors='coerce')
        
        # Convert time columns
        for col in ['Start Time', 'End Time']:
            if col in df.columns:
                df.loc[:, col] = pd.to_datetime(df[col], errors='coerce')
        
        # Convert numeric columns
        numeric_cols = ['GPS Executed', 'Duration', 'Duration Variance', 'Job Count', 'Load Count', 'Planned Stops: Qty', 'Cost Contract Amount', 'Sub Total Cost', 'Revenue Contract Amount', 'Sub Total Revenue']
        for col in numeric_cols:
            if col in df.columns:
                df.loc[:, col] = pd.to_numeric(df[col], errors='coerce')
        
        return df
        
    def on_search_change(self, event=None):
        """Handle real-time search as user types"""
        if self.realtime_var.get() and self.processed_data is not None:
            # Small delay to avoid too many searches while typing
            self.root.after(300, self.search_data)
            
    def update_status_combo(self):
        """Update the status combo box with available statuses"""
        if self.processed_data is not None and 'Job Status' in self.processed_data.columns:
            statuses = self.processed_data['Job Status'].dropna().unique()
            status_list = ['All'] + list(statuses)
            self.status_combo['values'] = status_list
            self.status_combo.set('All')
            
    def update_trip_type_combo(self):
        """Update the trip type combo box with available trip types"""
        if self.processed_data is not None and 'Trip Type' in self.processed_data.columns:
            trip_types = self.processed_data['Trip Type'].dropna().unique()
            trip_type_list = ['All'] + list(trip_types)
            self.trip_type_combo['values'] = trip_type_list
            self.trip_type_combo.set('All')
            
    def update_payment_schedule_combo(self):
        """Update the payment schedule status combo box with available statuses"""
        if self.processed_data is not None and 'Payment Schedule Status' in self.processed_data.columns:
            payment_statuses = self.processed_data['Payment Schedule Status'].dropna().unique()
            payment_status_list = ['All'] + list(payment_statuses)
            self.payment_schedule_combo['values'] = payment_status_list
            self.payment_schedule_combo.set('All')
            
    def update_invoice_status_combo(self):
        """Update the invoice status combo box with available statuses"""
        if self.processed_data is not None and 'Invoice Status' in self.processed_data.columns:
            invoice_statuses = self.processed_data['Invoice Status'].dropna().unique()
            invoice_status_list = ['All'] + list(invoice_statuses)
            self.invoice_status_combo['values'] = invoice_status_list
            self.invoice_status_combo.set('All')
            
    def search_data(self):
        """Enhanced search and filter data based on multiple criteria"""
        if self.processed_data is None:
            messagebox.showwarning("Warning", "Please process a file first!")
            return
            
        job_id = self.job_id_entry.get().strip()
        job_name = self.job_name_entry.get().strip()
        status = self.status_combo.get()
        driver = self.driver_entry.get().strip()
        vehicle = self.vehicle_entry.get().strip()
        trip_type = self.trip_type_combo.get()
        payment_schedule_status = self.payment_schedule_combo.get()
        invoice_status = self.invoice_status_combo.get()
        date_from = self.date_from_entry.get().strip()
        date_to = self.date_to_entry.get().strip()
        gps_executed_only = self.gps_executed_var.get()

        
        # Store current filters for filename generation
        self.current_filters = {
            'job_id': job_id,
            'keyword': job_name,
            'status': status,
            'driver': driver,
            'vehicle': vehicle,
            'trip_type': trip_type,
            'payment_schedule_status': payment_schedule_status,
            'invoice_status': invoice_status,
            'date_from': date_from,
            'date_to': date_to,
            'gps_executed_only': gps_executed_only
        }
        
        df = self.processed_data.copy()
        
        # Apply Job ID filter
        if job_id:
            df = df[df['Job ID'].astype(str).str.contains(job_id, case=False, na=False, regex=False)]
            
        # Apply keyword search across all columns
        if job_name:
            mask = df.astype(str).apply(lambda x: x.str.contains(job_name, case=False, na=False, regex=False)).any(axis=1)
            df = df[mask]
            
        # Apply status filter
        if status and status != 'All':
            df = df[df['Job Status'] == status]
            
        # Apply driver filter
        if driver:
            df = df[df['Driver Name'].astype(str).str.contains(driver, case=False, na=False, regex=False)]
            
        # Apply vehicle filter
        if vehicle:
            df = df[df['Vehicle'].astype(str).str.contains(vehicle, case=False, na=False, regex=False)]
            
        # Apply trip type filter
        if trip_type and trip_type != 'All':
            df = df[df['Trip Type'] == trip_type]
            
        # Apply payment schedule status filter
        if payment_schedule_status and payment_schedule_status != 'All':
            df = df[df['Payment Schedule Status'] == payment_schedule_status]
            
        # Apply invoice status filter
        if invoice_status and invoice_status != 'All':
            df = df[df['Invoice Status'] == invoice_status]
            
        # Apply date range filters
        if date_from and 'Job Date' in df.columns:
            try:
                date_from_parsed = pd.to_datetime(date_from)
                df = df[df['Job Date'] >= date_from_parsed]
            except:
                pass
                
        if date_to and 'Job Date' in df.columns:
            try:
                date_to_parsed = pd.to_datetime(date_to)
                df = df[df['Job Date'] <= date_to_parsed]
            except:
                pass
        
        # Apply GPS Executed filter
        if gps_executed_only and 'GPS Executed' in df.columns:
            # Filter for records that have GPS Executed data (not NaN and not 0)
            df = df[df['GPS Executed'].notna() & (df['GPS Executed'] > 0)]
            self.log_message(f"Filtered to {len(df)} records with GPS Executed data")

        
        self.filtered_data = df
        
        # Update search results label
        if len(df) == len(self.processed_data):
            self.search_results_label.config(text="Showing all records")
        else:
            self.search_results_label.config(text=f"Found {len(df)} of {len(self.processed_data)} records")
        
        self.log_message(f"Search completed: {len(df)} records found")
        
        # Update UI
        self.update_metrics()
        self.update_data_table()
        
    def clear_search(self):
        """Clear all search filters"""
        self.job_id_entry.delete(0, tk.END)
        self.job_name_entry.delete(0, tk.END)
        self.driver_entry.delete(0, tk.END)
        self.vehicle_entry.delete(0, tk.END)
        if hasattr(self, 'trip_type_combo'):
            self.trip_type_combo.set('All')
        if hasattr(self, 'payment_schedule_combo'):
            self.payment_schedule_combo.set('All')
        if hasattr(self, 'invoice_status_combo'):
            self.invoice_status_combo.set('All')
        self.date_from_entry.delete(0, tk.END)
        self.date_to_entry.delete(0, tk.END)

        if hasattr(self, 'status_combo'):
            self.status_combo.set('All')
        
        if hasattr(self, 'gps_executed_var'):
            self.gps_executed_var.set(False)
        
        # Clear current filters
        self.current_filters = {}
        
        if self.processed_data is not None:
            self.filtered_data = self.processed_data.copy()
            self.search_results_label.config(text="Showing all records")
            self.log_message("All search filters cleared")
            
            # Update UI
            self.update_metrics()
            self.update_data_table()
            
    def update_ui_after_processing(self):
        """Update UI elements after data processing"""
        if self.processed_data is not None:
            self.log_message(f"Processing completed: {len(self.processed_data)} records loaded")
            
            # Update filtered data to show all initially
            self.filtered_data = self.processed_data.copy()
            
            # Update UI components
            self.update_metrics()
            self.update_columns_listbox()
            self.update_job_combo()
            self.update_status_combo()
            self.update_trip_type_combo()
            self.update_payment_schedule_combo()
            self.update_invoice_status_combo()
            self.update_data_table()
            
            # Update search results label
            self.search_results_label.config(text="Showing all records")
            
            # Automatically count jobs and loads
            self.count_jobs_and_loads()
            
            self.log_message("Data loaded successfully. Use search filters to find specific records.")
        else:
            self.log_message("Error: No data processed")
        
    def update_metrics(self):
        """Update the metrics display"""
        if self.filtered_data is not None:
            df = self.filtered_data
            
            # Total records
            total_records = len(df)
            self.metrics_labels["Total Records"].config(text=str(total_records))
            
            # Completed jobs
            if 'Job Status' in df.columns:
                completed_jobs = len(df[df['Job Status'] == 'Completed'])
            else:
                completed_jobs = 0
            self.metrics_labels["Completed Jobs"].config(text=str(completed_jobs))
            
            # Total revenue
            if 'Sub Total Revenue' in df.columns:
                total_revenue = df['Sub Total Revenue'].sum()
                if pd.notna(total_revenue):
                    self.metrics_labels["Total Revenue"].config(text=f"${total_revenue:,.2f}")
                else:
                    self.metrics_labels["Total Revenue"].config(text="$0.00")
            else:
                self.metrics_labels["Total Revenue"].config(text="$0.00")
            
            # Total costs
            if 'Sub Total Cost' in df.columns:
                total_costs = df['Sub Total Cost'].sum()
                if pd.notna(total_costs):
                    self.metrics_labels["Total Costs"].config(text=f"${total_costs:,.2f}")
                else:
                    self.metrics_labels["Total Costs"].config(text="$0.00")
            else:
                self.metrics_labels["Total Costs"].config(text="$0.00")
            
            # Total profit (Revenue - Costs)
            if 'Sub Total Revenue' in df.columns and 'Sub Total Cost' in df.columns:
                total_revenue = df['Sub Total Revenue'].sum() if pd.notna(df['Sub Total Revenue'].sum()) else 0
                total_costs = df['Sub Total Cost'].sum() if pd.notna(df['Sub Total Cost'].sum()) else 0
                total_profit = total_revenue - total_costs
                self.metrics_labels["Total Profit"].config(text=f"${total_profit:,.2f}")
            else:
                self.metrics_labels["Total Profit"].config(text="$0.00")
            
            # Average duration
            if 'Duration' in df.columns:
                avg_duration = df['Duration'].mean()
                if pd.notna(avg_duration):
                    self.metrics_labels["Avg Duration"].config(text=f"{avg_duration:.1f} hrs")
                else:
                    self.metrics_labels["Avg Duration"].config(text="0.0 hrs")
            else:
                self.metrics_labels["Avg Duration"].config(text="0.0 hrs")
                
    def select_all_columns(self):
        """Select all columns in the listbox"""
        if self.processed_data is not None:
            for i in range(self.columns_listbox.size()):
                self.columns_listbox.selection_set(i)
            self.update_data_table()
            self.log_message("All columns selected")
    
    def clear_all_columns(self):
        """Clear all column selections"""
        self.columns_listbox.selection_clear(0, tk.END)
        self.update_data_table()
        self.log_message("All columns cleared")
    
    def select_key_columns(self):
        """Select only the most important columns"""
        if self.processed_data is not None:
            key_columns = ['Job ID', 'Job Name', 'Job Status', 'Job Date', 'Driver Name', 'Vehicle', 'GPS Executed', 'Duration']
            self.columns_listbox.selection_clear(0, tk.END)
            
            for i in range(self.columns_listbox.size()):
                column_name = self.columns_listbox.get(i)
                if column_name in key_columns:
                    self.columns_listbox.selection_set(i)
            
            self.update_data_table()
            self.log_message("Key columns selected")
            
    def update_columns_listbox(self):
        """Update the columns listbox with all available columns"""
        if self.processed_data is not None:
            self.columns_listbox.delete(0, tk.END)
            columns = self.processed_data.columns.tolist()
            for col in columns:
                self.columns_listbox.insert(tk.END, col)
            
            # Select ALL columns by default (not just first 10)
            for i in range(len(columns)):
                self.columns_listbox.selection_set(i)
                
    def update_job_combo(self):
        """Update the job combo box with available Job IDs"""
        if self.processed_data is not None and 'Job ID' in self.processed_data.columns:
            job_ids = self.processed_data['Job ID'].dropna().unique()
            self.job_combo['values'] = list(job_ids)
            if len(job_ids) > 0:
                self.job_combo.set(job_ids[0])
                
    def on_column_select(self, event):
        """Handle column selection change"""
        self.update_data_table()
        
    def update_data_table(self):
        """Update the data table with all selected columns and unlimited rows"""
        if self.filtered_data is None:
            return
            
        # Get selected columns (if none selected, show all)
        selected_indices = self.columns_listbox.curselection()
        if not selected_indices:
            # If no columns selected, select all
            columns = self.filtered_data.columns.tolist()
            for i in range(len(columns)):
                self.columns_listbox.selection_set(i)
            selected_columns = columns
        else:
            selected_columns = [self.columns_listbox.get(i) for i in selected_indices]
        
        # Clear existing data
        for item in self.tree.get_children():
            self.tree.delete(item)
        
        # Configure columns
        self.tree['columns'] = selected_columns
        for col in selected_columns:
            self.tree.heading(col, text=col)
            self.tree.column(col, width=150, anchor=tk.W)  # Increased width for better visibility
        
        # Add ALL data (not limited to 1000 rows)
        display_df = self.filtered_data[selected_columns]
        
        # Show progress for large datasets
        total_rows = len(display_df)
        if total_rows > 100:
            self.log_message(f"Loading {total_rows} rows to table...")
        
        for index, row in display_df.iterrows():
            values = []
            for val in row.values:
                if pd.notna(val):
                    # Format dates nicely
                    if isinstance(val, pd.Timestamp):
                        values.append(val.strftime('%Y-%m-%d %H:%M:%S'))
                    else:
                        values.append(str(val))
                else:
                    values.append("")
            self.tree.insert('', tk.END, values=values)
        
        # Update the table info
        self.log_message(f"Table updated: {total_rows} rows × {len(selected_columns)} columns displayed")
        
        # Update search results label with column info
        if hasattr(self, 'search_results_label'):
            if total_rows == len(self.processed_data):
                self.search_results_label.config(text=f"Showing all {total_rows} records ({len(selected_columns)} columns)")
            else:
                self.search_results_label.config(text=f"Found {total_rows} of {len(self.processed_data)} records ({len(selected_columns)} columns)")
        
    def export_excel(self):
        """Export data to Excel with meaningful filename"""
        if self.filtered_data is None:
            messagebox.showwarning("Warning", "No data to export!")
            return
        
        # Generate meaningful filename
        default_filename = self.generate_filename('JobMaster_Export')
        
        file_path = filedialog.asksaveasfilename(
            defaultextension=".xlsx",
            filetypes=[("Excel files", "*.xlsx"), ("All files", "*.*")],
            title="Save Excel Report",
            initialdir=self.exports_dir,
            initialfile=default_filename
        )
        
        if file_path:
            try:
                with pd.ExcelWriter(file_path, engine='openpyxl') as writer:
                    self.filtered_data.to_excel(writer, sheet_name='Job Master Data', index=False)
                    
                    # Add summary sheet
                    summary_df = self.generate_summary_stats()
                    if summary_df is not None:
                        summary_df.to_excel(writer, sheet_name='Summary', index=False)
                    
                    # Add filter information sheet if filters were applied
                    if self.current_filters:
                        filter_info = []
                        for key, value in self.current_filters.items():
                            if value and value != 'All':  # Only add non-empty filters
                                filter_info.append({
                                    'Filter': key.replace('_', ' ').title(), 
                                    'Value': value
                                })
                        
                        if filter_info:
                            filter_df = pd.DataFrame(filter_info)
                            filter_df.to_excel(writer, sheet_name='Applied Filters', index=False)
                
                self.log_message(f"Excel report saved to: {file_path}")
                messagebox.showinfo("Success", f"Excel report exported successfully!\nSaved to: {os.path.basename(file_path)}")
                
            except Exception as e:
                self.log_message(f"Error exporting Excel: {str(e)}")
                messagebox.showerror("Error", f"Error exporting Excel: {str(e)}")
                
    def export_pdf(self):
        """Export data to PDF - Temporarily Disabled"""
        messagebox.showinfo("PDF Export", "PDF export is temporarily disabled.\nPlease use Excel export instead.")
                
    def export_job_excel(self):
        """Export individual job data to Excel with meaningful filename"""
        if self.filtered_data is None or not self.job_combo.get():
            messagebox.showwarning("Warning", "No job selected!")
            return
            
        job_id = self.job_combo.get()
        job_data = self.filtered_data[self.filtered_data['Job ID'] == job_id]
        
        if job_data.empty:
            messagebox.showwarning("Warning", "No data found for selected job!")
            return
        
        # Generate meaningful filename for specific job
        default_filename = self.generate_filename(f'JobMaster_Job_{job_id}')
        
        file_path = filedialog.asksaveasfilename(
            defaultextension=".xlsx",
            filetypes=[("Excel files", "*.xlsx"), ("All files", "*.*")],
            title=f"Save Job {job_id} Excel Report",
            initialdir=self.exports_dir,
            initialfile=default_filename
        )
        
        if file_path:
            try:
                with pd.ExcelWriter(file_path, engine='openpyxl') as writer:
                    job_data.to_excel(writer, sheet_name=f'Job {job_id}', index=False)
                    
                    # Add job summary if possible
                    if len(job_data) > 0:
                        job_summary = [
                            {'Metric': 'Job ID', 'Value': job_id},
                            {'Metric': 'Records', 'Value': len(job_data)},
                            {'Metric': 'Export Date', 'Value': datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
                        ]
                        summary_df = pd.DataFrame(job_summary)
                        summary_df.to_excel(writer, sheet_name='Job Summary', index=False)
                
                self.log_message(f"Job {job_id} Excel report saved to: {file_path}")
                messagebox.showinfo("Success", f"Job {job_id} Excel report exported successfully!\nSaved to: {os.path.basename(file_path)}")
                
            except Exception as e:
                self.log_message(f"Error exporting job Excel: {str(e)}")
                messagebox.showerror("Error", f"Error exporting job Excel: {str(e)}")
                
    def export_job_pdf(self):
        """Export individual job data to PDF - Temporarily Disabled"""
        messagebox.showinfo("PDF Export", "PDF export is temporarily disabled.\nPlease use Excel export instead.")
                
    def generate_summary_stats(self):
        """Generate summary statistics"""
        if self.filtered_data is None:
            return None
            
        summary_data = []
        df = self.filtered_data
        
        # Basic counts
        summary_data.append({'Metric': 'Total Records', 'Value': len(df)})
        
        # Job Status distribution
        if 'Job Status' in df.columns:
            status_counts = df['Job Status'].value_counts()
            for status, count in status_counts.items():
                summary_data.append({'Metric': f'Jobs - {status}', 'Value': count})
        
        # Numeric summaries
        numeric_cols = ['GPS Executed', 'Duration', 'Job Count', 'Load Count', 'Cost Contract Amount', 'Sub Total Cost', 'Revenue Contract Amount', 'Sub Total Revenue']
        for col in numeric_cols:
            if col in df.columns:
                total = df[col].sum()
                avg = df[col].mean()
                if pd.notna(total) and pd.notna(avg):
                    summary_data.append({'Metric': f'{col} - Total', 'Value': f"{total:.2f}"})
                    summary_data.append({'Metric': f'{col} - Average', 'Value': f"{avg:.2f}"})
        
        return pd.DataFrame(summary_data)
        
    def generate_pdf_report(self, df, filename):
        """Generate PDF report - Disabled"""
        pass
    
    def count_jobs_and_loads(self):
        """Count total jobs and loads in the processed data with new logic"""
        if self.processed_data is None:
            messagebox.showwarning("Warning", "Please process a file first!")
            return
        
        try:
            df = self.processed_data
            
            # Count unique Job IDs (excluding empty fields)
            if 'Job ID' in df.columns:
                unique_jobs = df['Job ID'].dropna().nunique()
                self.job_count_label.config(text=str(unique_jobs))
                self.log_message(f"Counted {unique_jobs} unique jobs (excluding empty fields)")
            else:
                self.job_count_label.config(text="N/A")
                self.log_message("Job ID column not found")
                unique_jobs = 0
            
            # Initialize load counts
            total_loads = 0
            ftl_distribution_loads = 0
            
            # Check if we have the required columns for load counting
            if 'Job ID' in df.columns and 'Trip Type' in df.columns:
                # Initialize FTL-DISTRIBUTION variables
                ftl_distribution_loads_current = 0.0
                ftl_distribution_loads_previous = 0.0
                ftl_distribution_loads_10x = 0.0
                total_unique_loads_current = 0.0
                total_unique_loads_previous = 0.0
                total_unique_loads_10x = 0.0
                
                # Separate FTL-DISTRIBUTION and non-FTL-DISTRIBUTION data
                ftl_data = df[df['Trip Type'] == 'FTL-DISTRIBUTION'].copy()
                non_ftl_data = df[df['Trip Type'] != 'FTL-DISTRIBUTION'].copy()
                
                self.log_message(f"Data separation: {len(df)} total records")
                self.log_message(f"FTL-DISTRIBUTION records: {len(ftl_data)}")
                self.log_message(f"Non FTL-DISTRIBUTION records: {len(non_ftl_data)}")
                
                # Show available trip types for debugging
                trip_types = df['Trip Type'].dropna().unique()
                self.log_message(f"Available trip types: {list(trip_types)}")
                
                # Count loads for non-FTL-DISTRIBUTION trips
                if not non_ftl_data.empty:
                    # Prefer direct Load ID if available
                    if 'Load ID' in non_ftl_data.columns:
                        # Filter out empty/NaN Load IDs then count uniques
                        load_ids = non_ftl_data['Load ID'].astype(str).str.strip()
                        load_ids = load_ids[load_ids.ne('') & load_ids.ne('nan')]
                        total_loads = load_ids.nunique()
                        self.log_message(f"Non FTL-DISTRIBUTION: counted {total_loads} unique non-empty Load IDs")
                    else:
                        # Fallback: job-based unique combinations (legacy)
                        unique_non_ftl_jobs = non_ftl_data['Job ID'].dropna().unique()
                        self.log_message(f"Load ID not found; falling back. {len(unique_non_ftl_jobs)} jobs without FTL-DISTRIBUTION")

                        all_loads_for_non_ftl = []
                        for job_id in unique_non_ftl_jobs:
                            job_records = non_ftl_data[non_ftl_data['Job ID'] == job_id]
                            for _, record in job_records.iterrows():
                                load_identifier = []
                                if pd.notna(record['Job ID']):
                                    load_identifier.append(f"Job:{record['Job ID']}")
                                if 'Vehicle' in record and pd.notna(record['Vehicle']):
                                    load_identifier.append(f"Vehicle:{record['Vehicle']}")
                                if 'Driver Name' in record and pd.notna(record['Driver Name']):
                                    load_identifier.append(f"Driver:{record['Driver Name']}")
                                if len(load_identifier) > 0:
                                    all_loads_for_non_ftl.append('|'.join(load_identifier))

                        unique_loads = list(set(all_loads_for_non_ftl))
                        total_loads = len(unique_loads)
                        self.log_message(f"Non FTL-DISTRIBUTION (fallback): {len(unique_non_ftl_jobs)} jobs with {total_loads} unique loads")
                
                # Count loads for FTL-DISTRIBUTION trips
                if not ftl_data.empty and 'Planned Stops: Qty' in ftl_data.columns:
                    trips_with_load_id = 0
                    trips_without_load_id = 0
                    
                    for _, row in ftl_data.iterrows():
                        # Only count if the trip has a Load ID
                        has_load_id = False
                        if 'Load ID' in row:
                            load_id_str = str(row['Load ID']).strip()
                            has_load_id = load_id_str != '' and load_id_str.lower() != 'nan'
                        
                        if has_load_id and pd.notna(row['Planned Stops: Qty']):
                            stops_qty = int(row['Planned Stops: Qty'])
                            
                            # CURRENT PRORATED CALCULATION
                            if stops_qty <= 8:
                                loads_for_trip_current = 1.0
                            else:
                                # Calculate base loads (multiples of 8)
                                base_loads = stops_qty // 8
                                # Calculate remaining locations for proration
                                remaining = stops_qty % 8
                                if remaining == 0:
                                    loads_for_trip_current = float(base_loads)
                                else:
                                    # Calculate prorated load for remaining locations
                                    prorated = remaining / 8
                                    loads_for_trip_current = base_loads + prorated
                            
                            # PREVIOUS SIMPLE MULTIPLICATION CALCULATION (8x)
                            loads_for_trip_previous = math.ceil(stops_qty / 8)
                            
                            # NEW 10x MULTIPLICATION CALCULATION
                            loads_for_trip_10x = math.ceil(stops_qty / 10)
                            
                            ftl_distribution_loads_current += loads_for_trip_current
                            ftl_distribution_loads_previous += loads_for_trip_previous
                            ftl_distribution_loads_10x += loads_for_trip_10x
                            trips_with_load_id += 1
                        elif not has_load_id:
                            trips_without_load_id += 1
                    
                    self.log_message(f"FTL-DISTRIBUTION: {trips_with_load_id} trips with Load ID")
                    self.log_message(f"  Current (Prorated): {ftl_distribution_loads_current:.3f} loads")
                    self.log_message(f"  Previous (8x): {ftl_distribution_loads_previous:.0f} loads")
                    self.log_message(f"  New (10x): {ftl_distribution_loads_10x:.0f} loads")
                    if trips_without_load_id > 0:
                        self.log_message(f"FTL-DISTRIBUTION: {trips_without_load_id} trips without Load ID (excluded from count)")
                
                # Calculate total loads for all three methods
                total_unique_loads_current = total_loads + ftl_distribution_loads_current
                total_unique_loads_previous = total_loads + ftl_distribution_loads_previous
                total_unique_loads_10x = total_loads + ftl_distribution_loads_10x
                
                # Update labels with proper formatting for decimal values
                self.load_count_label.config(text=str(total_loads))
                self.ftl_load_count_label.config(text=f"{ftl_distribution_loads_current:.3f}")
                self.ftl_prev_load_count_label.config(text=f"{ftl_distribution_loads_previous:.0f}")
                self.ftl_10x_load_count_label.config(text=f"{ftl_distribution_loads_10x:.0f}")
                self.total_load_count_label.config(text=f"{total_unique_loads_current:.3f}")
                self.total_8x_load_count_label.config(text=f"{total_unique_loads_previous:.0f}")
                self.total_10x_load_count_label.config(text=f"{total_unique_loads_10x:.0f}")
                
                self.log_message(f"Counted {total_loads} non FTL-DISTRIBUTION loads")
                self.log_message(f"  FTL-DISTRIBUTION Current: {ftl_distribution_loads_current:.3f} loads")
                self.log_message(f"  FTL-DISTRIBUTION 8x: {ftl_distribution_loads_previous:.0f} loads")
                self.log_message(f"  FTL-DISTRIBUTION 10x: {ftl_distribution_loads_10x:.0f} loads")
                self.log_message(f"  Total Current: {total_unique_loads_current:.3f} loads")
                self.log_message(f"  Total 8x: {total_unique_loads_previous:.0f} loads")
                self.log_message(f"  Total 10x: {total_unique_loads_10x:.0f} loads")
                
            else:
                # Fallback to old method if required columns not available
                if 'Load Count' in df.columns:
                    total_loads = df['Load Count'].sum()
                    if pd.notna(total_loads):
                        self.load_count_label.config(text=f"{total_loads:.0f}")
                        self.ftl_load_count_label.config(text="0")
                        self.ftl_prev_load_count_label.config(text="0")
                        self.ftl_10x_load_count_label.config(text="0")
                        self.total_load_count_label.config(text=f"{total_loads:.0f}")
                        self.total_8x_load_count_label.config(text=f"{total_loads:.0f}")
                        self.total_10x_load_count_label.config(text=f"{total_loads:.0f}")
                        self.log_message(f"Counted {total_loads:.0f} total loads (fallback method)")
                    else:
                        self.load_count_label.config(text="0")
                        self.ftl_load_count_label.config(text="0")
                        self.ftl_prev_load_count_label.config(text="0")
                        self.ftl_10x_load_count_label.config(text="0")
                        self.total_load_count_label.config(text="0")
                        self.total_8x_load_count_label.config(text="0")
                        self.total_10x_load_count_label.config(text="0")
                        self.log_message("No valid load count data found")
                        total_loads = 0
                else:
                    self.load_count_label.config(text="N/A")
                    self.ftl_load_count_label.config(text="N/A")
                    self.ftl_prev_load_count_label.config(text="N/A")
                    self.ftl_10x_load_count_label.config(text="N/A")
                    self.total_load_count_label.config(text="N/A")
                    self.total_8x_load_count_label.config(text="N/A")
                    self.total_10x_load_count_label.config(text="N/A")
                    self.log_message("Required columns not found for load counting")
                    total_loads = 0
                    ftl_distribution_loads_current = 0.0
                    ftl_distribution_loads_previous = 0.0
                    ftl_distribution_loads_10x = 0.0
                    total_unique_loads_current = 0.0
                    total_unique_loads_previous = 0.0
                    total_unique_loads_10x = 0.0
            
            # Store counts for export
            self.job_load_counts = {
                'unique_jobs': unique_jobs,
                'total_loads': total_loads,
                'ftl_distribution_loads_current': ftl_distribution_loads_current,
                'ftl_distribution_loads_previous': ftl_distribution_loads_previous,
                'ftl_distribution_loads_10x': ftl_distribution_loads_10x,
                'total_loads_current': total_unique_loads_current,
                'total_loads_previous': total_unique_loads_previous,
                'total_loads_10x': total_unique_loads_10x,
                'total_records': len(df),
                'count_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            
        except Exception as e:
            self.log_message(f"Error counting jobs and loads: {str(e)}")
            messagebox.showerror("Error", f"Error counting jobs and loads: {str(e)}")
    
    def export_count_report(self):
        """Export a detailed count report to Excel"""
        if not hasattr(self, 'job_load_counts'):
            messagebox.showwarning("Warning", "Please count jobs and loads first!")
            return
        
        try:
            # Generate filename
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            default_filename = f'JobMaster_CountReport_{timestamp}.xlsx'
            
            file_path = filedialog.asksaveasfilename(
                defaultextension=".xlsx",
                filetypes=[("Excel files", "*.xlsx"), ("All files", "*.*")],
                title="Save Count Report",
                initialdir=self.exports_dir,
                initialfile=default_filename
            )
            
            if file_path:
                with pd.ExcelWriter(file_path, engine='openpyxl') as writer:
                    # Create count summary sheet
                    count_summary = [
                        {'Metric': 'Total Records Processed', 'Value': self.job_load_counts['total_records']},
                        {'Metric': 'Unique Jobs Count', 'Value': self.job_load_counts['unique_jobs']},
                        {'Metric': 'Non FTL-DISTRIBUTION Loads Count', 'Value': self.job_load_counts['total_loads']},
                        {'Metric': 'FTL-DISTRIBUTION Loads Count (Current - Prorated)', 'Value': f"{self.job_load_counts['ftl_distribution_loads_current']:.3f}"},
                        {'Metric': 'FTL-DISTRIBUTION Loads Count (8x - Simple)', 'Value': f"{self.job_load_counts['ftl_distribution_loads_previous']:.0f}"},
                        {'Metric': 'FTL-DISTRIBUTION Loads Count (10x - Simple)', 'Value': f"{self.job_load_counts['ftl_distribution_loads_10x']:.0f}"},
                        {'Metric': 'Total Unique Loads (Current)', 'Value': f"{self.job_load_counts['total_loads_current']:.3f}"},
                        {'Metric': 'Total Unique Loads (8x)', 'Value': f"{self.job_load_counts['total_loads_previous']:.0f}"},
                        {'Metric': 'Total Unique Loads (10x)', 'Value': f"{self.job_load_counts['total_loads_10x']:.0f}"},
                        {'Metric': 'Count Date', 'Value': self.job_load_counts['count_date']}
                    ]
                    
                    summary_df = pd.DataFrame(count_summary)
                    summary_df.to_excel(writer, sheet_name='Count Summary', index=False)
                    
                    # Add detailed analysis if data is available
                    if self.processed_data is not None:
                        df = self.processed_data
                        
                        # Job analysis
                        if 'Job ID' in df.columns:
                            job_analysis = df['Job ID'].value_counts().reset_index()
                            job_analysis.columns = ['Job ID', 'Occurrences']
                            job_analysis.to_excel(writer, sheet_name='Job Analysis', index=False)
                        
                        # Load analysis
                        if 'Load Count' in df.columns:
                            load_analysis = df[['Job ID', 'Load Count']].dropna()
                            load_analysis.to_excel(writer, sheet_name='Load Analysis', index=False)
                        
                        # Status distribution
                        if 'Job Status' in df.columns:
                            status_analysis = df['Job Status'].value_counts().reset_index()
                            status_analysis.columns = ['Job Status', 'Count']
                            status_analysis.to_excel(writer, sheet_name='Status Distribution', index=False)
                
                self.log_message(f"Count report saved to: {file_path}")
                messagebox.showinfo("Success", f"Count report exported successfully!\nSaved to: {os.path.basename(file_path)}")
                
        except Exception as e:
            self.log_message(f"Error exporting count report: {str(e)}")
            messagebox.showerror("Error", f"Error exporting count report: {str(e)}")

def main():
    root = tk.Tk()
    app = JobMasterDesktopApp(root)
    root.mainloop()

if __name__ == "__main__":
    main() 