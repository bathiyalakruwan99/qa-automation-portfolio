#!/usr/bin/env python3
"""
Bulk Job Checker - Check multiple job IDs for GPS execution, payment schedule, and invoice status
"""

import tkinter as tk
from tkinter import ttk, filedialog, messagebox, scrolledtext
import pandas as pd
import os
from datetime import datetime
import re

class BulkJobChecker:
    def __init__(self, root):
        self.root = root
        self.root.title("Bulk Job Checker - GPS, Payment & Invoice Status")
        self.root.geometry("1200x700")
        
        # Initialize variables
        self.main_data = None
        self.job_list = []
        self.results = None
        
        # Create necessary directories
        self.create_directories()
        
        # Setup UI
        self.setup_ui()
        
        # Load main data automatically if available
        self.auto_load_main_data()
        
    def create_directories(self):
        """Create necessary directories"""
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.exports_dir = os.path.join(self.base_dir, 'exports')
        self.reports_dir = os.path.join(self.base_dir, 'reports')
        
        for directory in [self.exports_dir, self.reports_dir]:
            if not os.path.exists(directory):
                os.makedirs(directory)
    
    def setup_ui(self):
        # Main frame
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Configure grid weights
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(1, weight=1)
        main_frame.rowconfigure(2, weight=1)
        
        # Title
        title_label = ttk.Label(main_frame, text="Bulk Job Checker", 
                               font=('Arial', 16, 'bold'))
        title_label.grid(row=0, column=0, columnspan=2, pady=(0, 20))
        
        # Left panel for controls
        left_panel = ttk.Frame(main_frame)
        left_panel.grid(row=1, column=0, rowspan=2, sticky=(tk.W, tk.E, tk.N, tk.S), padx=(0, 10))
        left_panel.columnconfigure(0, weight=1)
        
        # Data source section
        data_frame = ttk.LabelFrame(left_panel, text="1. Load Main Data", padding="10")
        data_frame.grid(row=0, column=0, sticky=(tk.W, tk.E), pady=(0, 10))
        data_frame.columnconfigure(0, weight=1)
        
        ttk.Button(data_frame, text="Select Excel File", 
                  command=self.select_main_data).grid(row=0, column=0, pady=(0, 5), sticky=(tk.W, tk.E))
        
        self.data_label = ttk.Label(data_frame, text="No data file selected", 
                                   foreground="gray")
        self.data_label.grid(row=1, column=0, pady=(0, 5))
        
        # Job list input section
        job_frame = ttk.LabelFrame(left_panel, text="2. Enter Job IDs", padding="10")
        job_frame.grid(row=1, column=0, sticky=(tk.W, tk.E), pady=(0, 10))
        job_frame.columnconfigure(0, weight=1)
        
        ttk.Label(job_frame, text="Job IDs (one per line):").grid(row=0, column=0, sticky=tk.W)
        
        self.job_text = scrolledtext.ScrolledText(job_frame, height=12, width=35)
        self.job_text.grid(row=1, column=0, pady=(5, 10), sticky=(tk.W, tk.E))
        
        # Upload buttons frame
        upload_frame = ttk.Frame(job_frame)
        upload_frame.grid(row=2, column=0, pady=(0, 5), sticky=(tk.W, tk.E))
        upload_frame.columnconfigure(0, weight=1)
        upload_frame.columnconfigure(1, weight=1)
        
        # Upload from file button
        ttk.Button(upload_frame, text="📁 Upload from File", 
                  command=self.upload_job_file).grid(row=0, column=0, padx=(0, 2), sticky=(tk.W, tk.E))
        
        # Upload from Excel button
        ttk.Button(upload_frame, text="📊 Upload from Excel", 
                  command=self.upload_job_excel).grid(row=0, column=1, padx=(2, 0), sticky=(tk.W, tk.E))
        
        # Sample data button
        ttk.Button(job_frame, text="Load Sample Job IDs", 
                  command=self.load_sample_jobs).grid(row=3, column=0, pady=(5, 5), sticky=(tk.W, tk.E))
        
        # Clear button
        ttk.Button(job_frame, text="Clear Job List", 
                  command=self.clear_job_list).grid(row=4, column=0, pady=(0, 5), sticky=(tk.W, tk.E))
        
        # Process section
        process_frame = ttk.LabelFrame(left_panel, text="3. Process Jobs", padding="10")
        process_frame.grid(row=2, column=0, sticky=(tk.W, tk.E), pady=(0, 10))
        process_frame.columnconfigure(0, weight=1)
        
        ttk.Button(process_frame, text="Check Job Status", 
                  command=self.check_jobs).grid(row=0, column=0, pady=(0, 5), sticky=(tk.W, tk.E))
        
        ttk.Button(process_frame, text="Export Results", 
                  command=self.export_results).grid(row=1, column=0, pady=(0, 5), sticky=(tk.W, tk.E))
        
        # Status section
        status_frame = ttk.LabelFrame(left_panel, text="Status", padding="10")
        status_frame.grid(row=3, column=0, sticky=(tk.W, tk.E))
        status_frame.columnconfigure(0, weight=1)
        
        self.status_text = scrolledtext.ScrolledText(status_frame, height=8, width=35)
        self.status_text.grid(row=0, column=0, sticky=(tk.W, tk.E))
        
        # Right panel for results
        right_panel = ttk.Frame(main_frame)
        right_panel.grid(row=1, column=1, rowspan=2, sticky=(tk.W, tk.E, tk.N, tk.S))
        right_panel.columnconfigure(0, weight=1)
        right_panel.rowconfigure(1, weight=1)
        
        # Summary section
        summary_frame = ttk.LabelFrame(right_panel, text="Summary", padding="10")
        summary_frame.grid(row=0, column=0, sticky=(tk.W, tk.E), pady=(0, 10))
        
        self.summary_labels = {}
        summary_metrics = ["Total Jobs", "Found", "GPS Executed", "Payment Schedule", "Invoice Status"]
        for i, metric in enumerate(summary_metrics):
            frame = ttk.Frame(summary_frame)
            frame.grid(row=0, column=i, padx=10)
            ttk.Label(frame, text=metric, font=('Arial', 8)).grid(row=0, column=0)
            self.summary_labels[metric] = ttk.Label(frame, text="0", font=('Arial', 12, 'bold'))
            self.summary_labels[metric].grid(row=1, column=0)
        
        # Results table
        results_frame = ttk.LabelFrame(right_panel, text="Results", padding="10")
        results_frame.grid(row=1, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        results_frame.columnconfigure(0, weight=1)
        results_frame.rowconfigure(0, weight=1)
        
        # Create results treeview
        columns = ('Job ID', 'Status', 'GPS Executed', 'Payment Schedule', 'Invoice Status', 'Driver', 'Vehicle')
        self.results_tree = ttk.Treeview(results_frame, columns=columns, show='headings')
        
        # Configure columns
        for col in columns:
            self.results_tree.heading(col, text=col)
            if col == 'Job ID':
                self.results_tree.column(col, width=150)
            elif col == 'Status':
                self.results_tree.column(col, width=100)
            else:
                self.results_tree.column(col, width=120)
        
        self.results_tree.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Scrollbars for results
        v_scrollbar = ttk.Scrollbar(results_frame, orient=tk.VERTICAL, command=self.results_tree.yview)
        v_scrollbar.grid(row=0, column=1, sticky=(tk.N, tk.S))
        self.results_tree.configure(yscrollcommand=v_scrollbar.set)
        
        h_scrollbar = ttk.Scrollbar(results_frame, orient=tk.HORIZONTAL, command=self.results_tree.xview)
        h_scrollbar.grid(row=1, column=0, sticky=(tk.W, tk.E))
        self.results_tree.configure(xscrollcommand=h_scrollbar.set)
        
        # Initialize
        self.log_message("Bulk Job Checker initialized")
        self.log_message("1. Select main data Excel file")
        self.log_message("2. Enter job IDs to check")
        self.log_message("3. Click 'Check Job Status'")
        
    def log_message(self, message):
        """Add message to status log"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        self.status_text.insert(tk.END, f"[{timestamp}] {message}\n")
        self.status_text.see(tk.END)
        self.root.update_idletasks()
        
    def auto_load_main_data(self):
        """Try to automatically load main data if sample file exists"""
        sample_file = os.path.join('file', 'job-master (9).xlsx')
        if os.path.exists(sample_file):
            self.load_main_data(sample_file)
            
    def select_main_data(self):
        """Select main data Excel file"""
        file_path = filedialog.askopenfilename(
            title="Select Main Data Excel File",
            filetypes=[("Excel files", "*.xlsx *.xls"), ("All files", "*.*")]
        )
        
        if file_path:
            self.load_main_data(file_path)
            
    def load_main_data(self, file_path):
        """Load main data from Excel file"""
        try:
            self.log_message(f"Loading main data from: {os.path.basename(file_path)}")
            
            # Read the Excel file
            df = pd.read_excel(file_path)
            self.main_data = df
            
            # Update UI
            filename = os.path.basename(file_path)
            self.data_label.config(text=f"Loaded: {filename} ({len(df)} rows)", foreground="blue")
            
            self.log_message(f"Main data loaded successfully: {len(df)} rows")
            
            # Show available columns for reference
            key_columns = ['Job ID', 'Distance: GPS', 'Payment Schedule Status', 'Invoice Status']
            found_columns = [col for col in key_columns if col in df.columns]
            self.log_message(f"Key columns found: {', '.join(found_columns)}")
            
            return True
            
        except Exception as e:
            self.log_message(f"Error loading main data: {str(e)}")
            messagebox.showerror("Error", f"Error loading main data: {str(e)}")
            return False
            
    def load_sample_jobs(self):
        """Load sample job IDs"""
        sample_jobs = """PV-5315-11-07-2025
11JULY25-LP-1701-04
LE-0065-11-JULY-2025-FAC
PT-5724-11-07-2025
227-9041-11-07-2025
LM-1324-11-07-2025
GB-7711-11-JULY-2025-02FAC
LM-1324-11-07-2025
GL-2095-11-07-2025
LE-0065-11-JULY-2025-03FAC
LH-0010-11-07-2025
LO-9930-11-07-2025
12JULY25-LP-1701-01
12JULY25-LP-2161-02
LM-5879-12-07-2025
PV-5315-12-07-2025
LF-3849-12-07-2025
12JULY25-LP-2161-03
DAC-8176-12-07-2025
DAC-8176-12-07-2025-02
LO-6417-12-07-2025
226-8887-12-07-2025
GL-2095-12-07-2025
43-2599-12-07-2025
14JULY25-LP-1701-01
DAG-1122-14-07-2025
GB-7711-14-JUNE-2025-01FAC
LE-0065-14-JULY-2025-02FAC
GB-7711-14-JULY-2025-03FAC
15JULY25-LP-2161-01
15JULY25-LP-1701-02
PV-5315-15-07-2025
LE-0065-15-JULY-2025-01FAC"""
        
        self.job_text.delete(1.0, tk.END)
        self.job_text.insert(1.0, sample_jobs)
        self.log_message("Sample job IDs loaded")
        
    def clear_job_list(self):
        """Clear the job list"""
        self.job_text.delete(1.0, tk.END)
        self.log_message("Job list cleared")
        
    def upload_job_file(self):
        """Upload job IDs from a text file"""
        file_path = filedialog.askopenfilename(
            title="Select Job IDs File",
            filetypes=[
                ("Text files", "*.txt"),
                ("CSV files", "*.csv"),
                ("All files", "*.*")
            ]
        )
        
        if file_path:
            try:
                self.log_message(f"Loading job IDs from: {os.path.basename(file_path)}")
                
                job_ids = []
                with open(file_path, 'r', encoding='utf-8') as file:
                    for line in file:
                        line = line.strip()
                        if line:
                            # Handle CSV format (comma-separated)
                            if ',' in line:
                                ids = [id.strip() for id in line.split(',')]
                                job_ids.extend(ids)
                            else:
                                job_ids.append(line)
                
                # Filter out empty lines
                job_ids = [job_id for job_id in job_ids if job_id]
                
                if job_ids:
                    self.job_text.delete(1.0, tk.END)
                    self.job_text.insert(1.0, '\n'.join(job_ids))
                    self.log_message(f"Loaded {len(job_ids)} job IDs from file")
                else:
                    messagebox.showwarning("Warning", "No job IDs found in the file!")
                    
            except Exception as e:
                self.log_message(f"Error loading file: {str(e)}")
                messagebox.showerror("Error", f"Error loading file: {str(e)}")
                
    def upload_job_excel(self):
        """Upload job IDs from an Excel file"""
        file_path = filedialog.askopenfilename(
            title="Select Excel File with Job IDs",
            filetypes=[
                ("Excel files", "*.xlsx *.xls"),
                ("All files", "*.*")
            ]
        )
        
        if file_path:
            try:
                self.log_message(f"Loading job IDs from Excel: {os.path.basename(file_path)}")
                
                # Read Excel file
                df = pd.read_excel(file_path)
                
                # Show column selection dialog
                columns = df.columns.tolist()
                column_window = tk.Toplevel(self.root)
                column_window.title("Select Job ID Column")
                column_window.geometry("400x300")
                column_window.transient(self.root)
                column_window.grab_set()
                
                ttk.Label(column_window, text="Select the column containing Job IDs:", 
                         font=('Arial', 12)).pack(pady=10)
                
                # Column listbox
                listbox_frame = ttk.Frame(column_window)
                listbox_frame.pack(pady=10, padx=20, fill=tk.BOTH, expand=True)
                
                column_listbox = tk.Listbox(listbox_frame, selectmode=tk.SINGLE)
                column_listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
                
                scrollbar = ttk.Scrollbar(listbox_frame, orient=tk.VERTICAL, command=column_listbox.yview)
                scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
                column_listbox.configure(yscrollcommand=scrollbar.set)
                
                # Add columns to listbox
                for col in columns:
                    column_listbox.insert(tk.END, col)
                
                # Default selection (try to find job ID column)
                for i, col in enumerate(columns):
                    if 'job' in col.lower() and 'id' in col.lower():
                        column_listbox.selection_set(i)
                        break
                
                # Result variable
                selected_column = [None]
                
                def on_ok():
                    selection = column_listbox.curselection()
                    if selection:
                        selected_column[0] = columns[selection[0]]
                        column_window.destroy()
                    else:
                        messagebox.showwarning("Warning", "Please select a column!")
                
                def on_cancel():
                    column_window.destroy()
                
                # Buttons
                button_frame = ttk.Frame(column_window)
                button_frame.pack(pady=10)
                
                ttk.Button(button_frame, text="OK", command=on_ok).pack(side=tk.LEFT, padx=5)
                ttk.Button(button_frame, text="Cancel", command=on_cancel).pack(side=tk.LEFT, padx=5)
                
                # Wait for dialog to close
                column_window.wait_window()
                
                if selected_column[0]:
                    # Extract job IDs from selected column
                    job_ids = []
                    for value in df[selected_column[0]].dropna():
                        job_id = str(value).strip()
                        if job_id:
                            job_ids.append(job_id)
                    
                    if job_ids:
                        self.job_text.delete(1.0, tk.END)
                        self.job_text.insert(1.0, '\n'.join(job_ids))
                        self.log_message(f"Loaded {len(job_ids)} job IDs from Excel column '{selected_column[0]}'")
                    else:
                        messagebox.showwarning("Warning", "No job IDs found in the selected column!")
                else:
                    self.log_message("Excel upload cancelled")
                    
            except Exception as e:
                self.log_message(f"Error loading Excel file: {str(e)}")
                messagebox.showerror("Error", f"Error loading Excel file: {str(e)}")
        
    def parse_job_list(self):
        """Parse job IDs from text input"""
        text = self.job_text.get(1.0, tk.END).strip()
        if not text:
            return []
            
        # Split by lines and clean
        job_ids = []
        for line in text.split('\n'):
            line = line.strip()
            if line:
                job_ids.append(line)
                
        return job_ids
        
    def check_jobs(self):
        """Check job status for all job IDs"""
        if self.main_data is None:
            messagebox.showwarning("Warning", "Please load main data first!")
            return
            
        # Parse job list
        job_ids = self.parse_job_list()
        if not job_ids:
            messagebox.showwarning("Warning", "Please enter job IDs to check!")
            return
            
        self.log_message(f"Checking {len(job_ids)} job IDs...")
        
        # Clear previous results
        for item in self.results_tree.get_children():
            self.results_tree.delete(item)
            
        # Process each job ID
        results = []
        found_count = 0
        gps_executed_count = 0
        payment_schedule_count = 0
        invoice_status_count = 0
        
        for job_id in job_ids:
            # Find job in main data
            job_data = self.main_data[self.main_data['Job ID'].astype(str).str.contains(job_id, case=False, na=False, regex=False)]
            
            if len(job_data) == 0:
                # Job not found
                result = {
                    'Job ID': job_id,
                    'Status': 'NOT FOUND',
                    'GPS Executed': 'N/A',
                    'Payment Schedule': 'N/A',
                    'Invoice Status': 'N/A',
                    'Driver': 'N/A',
                    'Vehicle': 'N/A'
                }
            else:
                # Job found - get first match
                job_row = job_data.iloc[0]
                found_count += 1
                
                # Check GPS execution
                gps_executed = job_row.get('Distance: GPS', 0)
                gps_status = 'YES' if pd.notna(gps_executed) and gps_executed > 0 else 'NO'
                if gps_status == 'YES':
                    gps_executed_count += 1
                
                # Check payment schedule
                payment_schedule = job_row.get('Payment Schedule Status', '')
                payment_status = 'YES' if pd.notna(payment_schedule) and str(payment_schedule).strip() != '' else 'NO'
                if payment_status == 'YES':
                    payment_schedule_count += 1
                
                # Check invoice status
                invoice_status = job_row.get('Invoice Status', '')
                invoice_check = 'YES' if pd.notna(invoice_status) and str(invoice_status).strip() != '' else 'NO'
                if invoice_check == 'YES':
                    invoice_status_count += 1
                
                result = {
                    'Job ID': job_id,
                    'Status': 'FOUND',
                    'GPS Executed': f"{gps_status} ({gps_executed:.1f})" if gps_status == 'YES' else gps_status,
                    'Payment Schedule': f"{payment_status} ({payment_schedule})" if payment_status == 'YES' else payment_status,
                    'Invoice Status': f"{invoice_check} ({invoice_status})" if invoice_check == 'YES' else invoice_check,
                    'Driver': job_row.get('Driver Name', 'N/A'),
                    'Vehicle': job_row.get('Vehicle', 'N/A')
                }
            
            results.append(result)
            
            # Add to results tree
            values = (
                result['Job ID'],
                result['Status'],
                result['GPS Executed'],
                result['Payment Schedule'],
                result['Invoice Status'],
                result['Driver'],
                result['Vehicle']
            )
            
            # Color coding
            if result['Status'] == 'NOT FOUND':
                tags = ('not_found',)
            elif result['GPS Executed'].startswith('YES') and result['Payment Schedule'].startswith('YES') and result['Invoice Status'].startswith('YES'):
                tags = ('complete',)
            else:
                tags = ('incomplete',)
                
            self.results_tree.insert('', tk.END, values=values, tags=tags)
        
        # Configure tags for color coding
        self.results_tree.tag_configure('not_found', background='#ffcccc')
        self.results_tree.tag_configure('complete', background='#ccffcc')
        self.results_tree.tag_configure('incomplete', background='#ffffcc')
        
        # Update summary
        self.summary_labels["Total Jobs"].config(text=str(len(job_ids)))
        self.summary_labels["Found"].config(text=str(found_count))
        self.summary_labels["GPS Executed"].config(text=str(gps_executed_count))
        self.summary_labels["Payment Schedule"].config(text=str(payment_schedule_count))
        self.summary_labels["Invoice Status"].config(text=str(invoice_status_count))
        
        # Store results for export
        self.results = pd.DataFrame(results)
        
        self.log_message(f"Check completed: {found_count}/{len(job_ids)} jobs found")
        self.log_message(f"GPS Executed: {gps_executed_count}, Payment Schedule: {payment_schedule_count}, Invoice Status: {invoice_status_count}")
        
    def export_results(self):
        """Export results to Excel"""
        if self.results is None or len(self.results) == 0:
            messagebox.showwarning("Warning", "No results to export!")
            return
            
        # Generate filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        default_filename = f'BulkJobCheck_Results_{timestamp}.xlsx'
        
        file_path = filedialog.asksaveasfilename(
            defaultextension=".xlsx",
            filetypes=[("Excel files", "*.xlsx"), ("All files", "*.*")],
            title="Export Results",
            initialdir=self.exports_dir,
            initialfile=default_filename
        )
        
        if file_path:
            try:
                with pd.ExcelWriter(file_path, engine='openpyxl') as writer:
                    # Main results
                    self.results.to_excel(writer, sheet_name='Job Check Results', index=False)
                    
                    # Summary
                    summary_data = [
                        ['Total Jobs Checked', len(self.results)],
                        ['Jobs Found', len(self.results[self.results['Status'] == 'FOUND'])],
                        ['Jobs Not Found', len(self.results[self.results['Status'] == 'NOT FOUND'])],
                        ['GPS Executed', len(self.results[self.results['GPS Executed'].str.startswith('YES', na=False)])],
                        ['Payment Schedule', len(self.results[self.results['Payment Schedule'].str.startswith('YES', na=False)])],
                        ['Invoice Status', len(self.results[self.results['Invoice Status'].str.startswith('YES', na=False)])],
                        ['Check Date', datetime.now().strftime('%Y-%m-%d %H:%M:%S')]
                    ]
                    
                    summary_df = pd.DataFrame(summary_data, columns=['Metric', 'Value'])
                    summary_df.to_excel(writer, sheet_name='Summary', index=False)
                
                self.log_message(f"Results exported to: {os.path.basename(file_path)}")
                messagebox.showinfo("Success", f"Results exported successfully!\nSaved to: {os.path.basename(file_path)}")
                
            except Exception as e:
                self.log_message(f"Error exporting results: {str(e)}")
                messagebox.showerror("Error", f"Error exporting results: {str(e)}")

def main():
    root = tk.Tk()
    app = BulkJobChecker(root)
    root.mainloop()

if __name__ == "__main__":
    main() 