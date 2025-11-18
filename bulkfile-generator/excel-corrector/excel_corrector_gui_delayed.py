#!/usr/bin/env python3
"""
Excel Corrector GUI with delayed import to avoid hanging
"""

import tkinter as tk
from tkinter import filedialog, messagebox, ttk
import os
import threading
from datetime import datetime

class ExcelCorrectorGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Excel File Corrector")
        self.root.geometry("800x600")
        self.root.resizable(True, True)
        
        # Configure style
        self.setup_styles()
        
        # Variables
        self.selected_file = tk.StringVar()
        # Set default output directory to "Created new one" folder
        default_output_dir = os.path.join(os.getcwd(), "Created new one")
        if not os.path.exists(default_output_dir):
            os.makedirs(default_output_dir)
        self.output_directory = tk.StringVar(value=default_output_dir)
        self.processing = False
        self.last_corrector = None  # Store last corrector for report access
        self.processing_options = None  # Store processing options
        
        # Create GUI
        self.create_widgets()
        
        # Center window
        self.center_window()
    
    def setup_styles(self):
        """Setup the visual styling"""
        self.root.configure(bg='#f0f0f0')
        
        # Configure ttk styles
        style = ttk.Style()
        style.theme_use('clam')
        
        # Custom styles
        style.configure('Title.TLabel', font=('Arial', 18, 'bold'), background='#f0f0f0')
        style.configure('Subtitle.TLabel', font=('Arial', 10), background='#f0f0f0', foreground='#666')
        style.configure('Big.TButton', font=('Arial', 12), padding=10)
        style.configure('Success.TLabel', font=('Arial', 10, 'bold'), foreground='#27ae60', background='#f0f0f0')
        style.configure('Error.TLabel', font=('Arial', 10, 'bold'), foreground='#e74c3c', background='#f0f0f0')
    
    def create_widgets(self):
        """Create all GUI widgets"""
        # Main container
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Configure grid weights
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(1, weight=1)
        
        # Title
        title_label = ttk.Label(main_frame, text="📊 Excel File Corrector", style='Title.TLabel')
        title_label.grid(row=0, column=0, columnspan=3, pady=(0, 10))
        
        subtitle_label = ttk.Label(main_frame, text="Automatically correct Excel files for bulk upload", style='Subtitle.TLabel')
        subtitle_label.grid(row=1, column=0, columnspan=3, pady=(0, 30))
        
        # File selection section
        file_frame = ttk.LabelFrame(main_frame, text="Select Excel File", padding="15")
        file_frame.grid(row=2, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(0, 20))
        file_frame.columnconfigure(1, weight=1)
        
        ttk.Label(file_frame, text="File:").grid(row=0, column=0, sticky=tk.W, padx=(0, 10))
        
        self.file_entry = ttk.Entry(file_frame, textvariable=self.selected_file, state='readonly', width=50)
        self.file_entry.grid(row=0, column=1, sticky=(tk.W, tk.E), padx=(0, 10))
        
        self.browse_button = ttk.Button(file_frame, text="Browse...", command=self.browse_file)
        self.browse_button.grid(row=0, column=2)
        
        # Output directory section
        output_frame = ttk.LabelFrame(main_frame, text="📂 Output Directory", padding="15")
        output_frame.grid(row=3, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(0, 20))
        output_frame.columnconfigure(1, weight=1)
        
        ttk.Label(output_frame, text="Save to:").grid(row=0, column=0, sticky=tk.W, padx=(0, 10))
        
        self.output_entry = ttk.Entry(output_frame, textvariable=self.output_directory, state='readonly', width=50)
        self.output_entry.grid(row=0, column=1, sticky=(tk.W, tk.E), padx=(0, 10))
        
        self.output_browse_button = ttk.Button(output_frame, text="Browse...", command=self.browse_output_directory)
        self.output_browse_button.grid(row=0, column=2)
        
        # Button frame
        button_frame = ttk.Frame(main_frame)
        button_frame.grid(row=4, column=0, columnspan=3, pady=20)
        
        # Process button
        self.process_button = ttk.Button(button_frame, text="Process & Fix File", command=self.process_file, style='Big.TButton')
        self.process_button.pack(side=tk.LEFT, padx=10)
        
        # Check Issues button
        self.check_issues_button = ttk.Button(button_frame, text="Check Issues Only", command=self.check_issues_only, style='Big.TButton')
        self.check_issues_button.pack(side=tk.LEFT, padx=10)
        
        # View Report button
        self.report_button = ttk.Button(button_frame, text="View Full Report", command=self.view_full_report, style='Big.TButton')
        self.report_button.pack(side=tk.LEFT, padx=10)
        
        # Download Report button
        self.download_button = ttk.Button(button_frame, text="Download Report", command=self.download_report, style='Big.TButton')
        self.download_button.pack(side=tk.LEFT, padx=10)
        
        # Progress section
        progress_frame = ttk.LabelFrame(main_frame, text="Progress", padding="15")
        progress_frame.grid(row=5, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(0, 20))
        progress_frame.columnconfigure(0, weight=1)
        
        self.progress_var = tk.StringVar(value="Ready to process files...")
        self.progress_label = ttk.Label(progress_frame, textvariable=self.progress_var)
        self.progress_label.grid(row=0, column=0, sticky=tk.W)
        
        self.progress_bar = ttk.Progressbar(progress_frame, mode='indeterminate')
        self.progress_bar.grid(row=1, column=0, sticky=(tk.W, tk.E), pady=(10, 0))
        
        # Results section
        results_frame = ttk.LabelFrame(main_frame, text="Corrections Applied", padding="15")
        results_frame.grid(row=6, column=0, columnspan=3, sticky=(tk.W, tk.E, tk.N, tk.S), pady=(0, 20))
        results_frame.columnconfigure(0, weight=1)
        results_frame.rowconfigure(0, weight=1)
        
        # Create text widget with scrollbar
        text_frame = ttk.Frame(results_frame)
        text_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        text_frame.columnconfigure(0, weight=1)
        text_frame.rowconfigure(0, weight=1)
        
        self.results_text = tk.Text(text_frame, height=10, width=70, wrap=tk.WORD, 
                                   state='disabled', font=('Arial', 9))
        scrollbar = ttk.Scrollbar(text_frame, orient="vertical", command=self.results_text.yview)
        self.results_text.configure(yscrollcommand=scrollbar.set)
        
        self.results_text.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        scrollbar.grid(row=1, column=0, sticky=(tk.N, tk.S))
        
        # Add initial text
        self.update_results_text(self.get_corrections_info())
        
        # Configure main frame grid weights
        main_frame.rowconfigure(6, weight=1)
        
        # Set initial button states
        self.update_button_states()
    
    def update_button_states(self):
        """Update button states based on current conditions"""
        # Always enable the process button as requested by user
        self.process_button.config(state='normal')
    
    def center_window(self):
        """Center the window on screen"""
        self.root.update_idletasks()
        width = self.root.winfo_width()
        height = self.root.winfo_height()
        x = (self.root.winfo_screenwidth() // 2) - (width // 2)
        y = (self.root.winfo_screenheight() // 2) - (height // 2)
        self.root.geometry(f'{width}x{height}+{x}+{y}')
    
    def browse_file(self):
        """Open file dialog to select Excel file"""
        filename = filedialog.askopenfilename(
            title="Select Excel File",
            filetypes=[
                ("Excel files", "*.xlsx *.xls"),
                ("Excel 2007+", "*.xlsx"),
                ("Excel 97-2003", "*.xls"),
                ("All files", "*.*")
            ]
        )
        
        if filename:
            self.selected_file.set(filename)
            self.progress_var.set(f"Selected: {os.path.basename(filename)}")
            # Enable the process button when a file is selected
            self.process_button.config(state='normal')
    
    def browse_output_directory(self):
        """Open dialog to select output directory"""
        directory = filedialog.askdirectory(
            title="Select Output Directory",
            initialdir=self.output_directory.get()
        )
        
        if directory:
            self.output_directory.set(directory)
    
    def generate_output_filename(self, input_filename):
        """Generate output filename with timestamp"""
        name, ext = os.path.splitext(os.path.basename(input_filename))
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        return f"{name}_corrected_file_{timestamp}{ext}"
    
    def update_results_text(self, text):
        """Update the results text widget"""
        self.results_text.config(state='normal')
        self.results_text.delete(1.0, tk.END)
        self.results_text.insert(1.0, text)
        self.results_text.config(state='disabled')
    
    def get_corrections_info(self):
        """Get information about corrections that will be applied"""
        return """Ready to process Excel files with the following corrections:

✅ Organization Details:
   • Status → NON_BOI
   • Verticals → VERT-TRN  
   • Country → Sri Lanka
   • State names → Proper Sri Lankan districts

✅ Human Resources:
   • Red cell detection for NIC and Email columns
   • Both red → Activity changed to 'Update'
   • One red → Prefix added to red cell
   • Unique NICs and emails (duplicates marked)
   • Empty fields filled with dummy data
   • Gender standardized to Male/Female
   • Division → Admin

✅ Divisions:
   • Division Name → Admin
   • Purpose → PPS-STG

✅ Vehicles:
   • Division → Admin
   • Vehicle Type → TRUCK
   • Load Type → LOADS
   • Categories formatted (e.g., 20Ft)

✅ Locations:
   • Empty Location Reference ID → OrgShortName+LRID+n
   • Empty Location Name → OrgShortName+LOC
   • Duplicate Location Reference ID → Original+DUPLICATE+LRID+n
   • Status updated to Create

✅ Global Changes:
   • All status fields → Create
   • END markers added where needed

Select an Excel file to begin processing..."""
    
    def process_file(self):
        """Process the selected Excel file"""
        if not self.selected_file.get():
            messagebox.showwarning("No File Selected", "Please select an Excel file first.")
            return
        
        if not os.path.exists(self.selected_file.get()):
            messagebox.showerror("File Not Found", "The selected file does not exist.")
            return
        
        # Import excel_corrector only when needed
        try:
            from excel_corrector import ExcelCorrector
            from processing_options_dialog import ProcessingOptionsDialog
        except ImportError as e:
            messagebox.showerror("Import Error", f"Error importing required modules:\n{str(e)}")
            return
        
        # Show processing options dialog
        options_dialog = ProcessingOptionsDialog(self.root)
        if options_dialog.result is None:
            return  # User cancelled
        
        self.processing_options = options_dialog.result
        
        # Start processing in a separate thread
        self.processing = True
        self.process_button.config(state='disabled')
        self.check_issues_button.config(state='disabled')
        self.progress_bar.start()
        
        # Start processing thread
        process_thread = threading.Thread(target=self.process_file_thread, daemon=True)
        process_thread.start()
    
    def process_file_thread(self):
        """Process file in background thread"""
        try:
            # Import excel_corrector here to avoid hanging during GUI initialization
            from excel_corrector import ExcelCorrector
            
            input_file = self.selected_file.get()
            output_filename = self.generate_output_filename(input_file)
            output_path = os.path.join(self.output_directory.get(), output_filename)
            
            # Create corrector instance
            corrector = ExcelCorrector()
            self.last_corrector = corrector
            
            # Process the file
            self.progress_var.set("Processing file...")
            corrector.correct_excel_file(input_file, output_path, self.processing_options)
            
            # Update GUI on main thread
            self.root.after(0, self.processing_complete, output_path)
            
        except Exception as e:
            # Handle errors on main thread
            self.root.after(0, self.processing_error, str(e))
        finally:
            self.processing = False
            self.root.after(0, self.processing_finished)
    
    def processing_complete(self, output_path):
        """Called when processing is complete"""
        self.progress_var.set("Processing complete!")
        self.progress_bar.stop()
        
        # Update results
        result_text = f"✅ File processed successfully!\n\n"
        result_text += f"📁 Output saved to:\n{output_path}\n\n"
        result_text += "🎉 All corrections have been applied according to your selected options!"
        
        self.update_results_text(result_text)
        
        # Show success message
        messagebox.showinfo("Success", f"File processed successfully!\n\nSaved to:\n{output_path}")
    
    def processing_error(self, error_message):
        """Called when processing encounters an error"""
        self.progress_var.set("Processing failed!")
        self.progress_bar.stop()
        
        # Update results
        result_text = f"❌ Processing failed!\n\n"
        result_text += f"Error: {error_message}\n\n"
        result_text += "Please check the error and try again."
        
        self.update_results_text(result_text)
        
        # Show error message
        messagebox.showerror("Processing Error", f"An error occurred during processing:\n\n{error_message}")
    
    def processing_finished(self):
        """Called when processing thread finishes"""
        self.process_button.config(state='normal')
        self.check_issues_button.config(state='normal')
    
    def check_issues_only(self):
        """Check for issues only without processing"""
        if not self.selected_file.get():
            messagebox.showwarning("No File Selected", "Please select an Excel file first.")
            return
        
        if not os.path.exists(self.selected_file.get()):
            messagebox.showerror("File Not Found", "The selected file does not exist.")
            return
        
        # Import excel_corrector only when needed
        try:
            from excel_corrector import ExcelCorrector
        except ImportError as e:
            messagebox.showerror("Import Error", f"Error importing required modules:\n{str(e)}")
            return
        
        # Start checking in a separate thread
        self.processing = True
        self.check_issues_button.config(state='disabled')
        self.progress_bar.start()
        
        # Start checking thread
        check_thread = threading.Thread(target=self.check_issues_thread, daemon=True)
        check_thread.start()
    
    def check_issues_thread(self):
        """Check issues in background thread"""
        try:
            # Import excel_corrector here to avoid hanging during GUI initialization
            from excel_corrector import ExcelCorrector
            
            input_file = self.selected_file.get()
            output_filename = f"issues_{os.path.splitext(os.path.basename(input_file))[0]}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
            output_path = os.path.join(self.output_directory.get(), output_filename)
            
            # Create corrector instance
            corrector = ExcelCorrector()
            self.last_corrector = corrector
            
            # Check for issues only - use the correct method name and pass directory
            self.progress_var.set("Checking for issues...")
            result = corrector.check_issues_only(input_file, self.output_directory.get())
            
            # The method returns a tuple (file_path, report), extract the file path
            if isinstance(result, tuple):
                output_path = result[0]  # First element is the file path
            else:
                output_path = result  # In case it's just the file path
            
            # Update GUI on main thread
            self.root.after(0, self.issues_check_complete, output_path)
            
        except Exception as e:
            # Handle errors on main thread
            self.root.after(0, self.issues_check_error, str(e))
        finally:
            self.processing = False
            self.root.after(0, self.issues_check_finished)
    
    def issues_check_complete(self, output_path):
        """Called when issues check is complete"""
        self.progress_var.set("Issues check complete!")
        self.progress_bar.stop()
        
        # Update results
        result_text = f"🔍 Issues check complete!\n\n"
        result_text += f"📁 Issues file saved to:\n{output_path}\n\n"
        result_text += "📊 Use 'View Full Report' to see detailed results."
        
        self.update_results_text(result_text)
        
        # Show success message
        messagebox.showinfo("Issues Check Complete", f"Issues check completed!\n\nIssues file saved to:\n{output_path}")
    
    def issues_check_error(self, error_message):
        """Called when issues check encounters an error"""
        self.progress_var.set("Issues check failed!")
        self.progress_bar.stop()
        
        # Update results
        result_text = f"❌ Issues check failed!\n\n"
        result_text += f"Error: {error_message}\n\n"
        result_text += "Please check the error and try again."
        
        self.update_results_text(result_text)
        
        # Show error message
        messagebox.showerror("Issues Check Error", f"An error occurred during issues check:\n\n{error_message}")
    
    def issues_check_finished(self):
        """Called when issues check thread finishes"""
        self.check_issues_button.config(state='normal')
    
    def view_full_report(self):
        """View the full processing report"""
        if not self.last_corrector:
            messagebox.showinfo("No Report Available", "Please process a file first to generate a report.")
            return
        
        # Create report window
        report_window = tk.Toplevel(self.root)
        report_window.title("Full Processing Report")
        report_window.geometry("800x600")
        report_window.resizable(True, True)
        
        # Create text widget for report
        report_text = tk.Text(report_window, wrap=tk.WORD, font=('Courier', 9))
        report_text.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Generate and display report
        report_content = self.generate_full_report()
        report_text.insert(tk.END, report_content)
        report_text.config(state='disabled')
        
        # Add scrollbar
        scrollbar = ttk.Scrollbar(report_window, orient="vertical", command=report_text.yview)
        report_text.configure(yscrollcommand=scrollbar.set)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Close button
        close_button = ttk.Button(report_window, text="Close", command=report_window.destroy)
        close_button.pack(pady=10)
    
    def generate_full_report(self):
        """Generate the full processing report"""
        if not self.last_corrector:
            return "No report available. Please process a file first."
        
        report = "📊 FULL PROCESSING REPORT\n"
        report += "=" * 80 + "\n\n"
        
        # Add detailed changes
        if hasattr(self.last_corrector, 'detailed_changes'):
            for sheet_type, changes in self.last_corrector.detailed_changes.items():
                if changes:
                    report += f"📋 {sheet_type.upper().replace('_', ' ')} CHANGES:\n"
                    report += "-" * 40 + "\n"
                    for change in changes:
                        report += f"• {change}\n"
                    report += "\n"
        
        # Add other change tracking
        if hasattr(self.last_corrector, 'hr_red_cell_changes') and self.last_corrector.hr_red_cell_changes:
            report += "🔴 HR RED CELL CHANGES:\n"
            report += "-" * 40 + "\n"
            for change in self.last_corrector.hr_red_cell_changes:
                report += f"• {change}\n"
            report += "\n"
        
        if hasattr(self.last_corrector, 'state_changes') and self.last_corrector.state_changes:
            report += "🗺️ STATE CHANGES:\n"
            report += "-" * 40 + "\n"
            for change in self.last_corrector.state_changes:
                report += f"• {change}\n"
            report += "\n"
        
        if hasattr(self.last_corrector, 'division_corrections') and self.last_corrector.division_corrections:
            report += "🏗️ DIVISION CORRECTIONS:\n"
            report += "-" * 40 + "\n"
            for change in self.last_corrector.division_corrections:
                report += f"• {change}\n"
            report += "\n"
        
        if hasattr(self.last_corrector, 'principle_contact_changes') and self.last_corrector.principle_contact_changes:
            report += "👤 PRINCIPLE CONTACT CHANGES:\n"
            report += "-" * 40 + "\n"
            for change in self.last_corrector.principle_contact_changes:
                report += f"• {change}\n"
            report += "\n"
        
        return report
    
    def download_report(self):
        """Download the processing report as a text file"""
        if not self.last_corrector:
            messagebox.showinfo("No Report Available", "Please process a file first to generate a report.")
            return
        
        # Ask user where to save the report
        filename = filedialog.asksaveasfilename(
            title="Save Report As",
            defaultextension=".txt",
            filetypes=[("Text files", "*.txt"), ("All files", "*.*")],
            initialname="excel_processing_report.txt"
        )
        
        if filename:
            try:
                # Generate the report
                report_text = self.generate_full_report()
                
                # Save to file
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(report_text)
                
                messagebox.showinfo("Report Downloaded", f"Report saved successfully to:\n{filename}")
                
                # Option to open the file
                result = messagebox.askyesno("Open Report", "Would you like to open the downloaded report?")
                if result:
                    try:
                        os.startfile(filename)
                    except:
                        try:
                            os.system(f'notepad "{filename}"')
                        except:
                            messagebox.showinfo("File Location", f"Report saved to: {filename}")
                
            except Exception as e:
                messagebox.showerror("Download Error", f"Error saving report:\n{str(e)}")

def main():
    """Main function to run the GUI"""
    root = tk.Tk()
    app = ExcelCorrectorGUI(root)
    root.mainloop()

if __name__ == "__main__":
    main()
