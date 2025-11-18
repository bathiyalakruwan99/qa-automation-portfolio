#!/usr/bin/env python3
"""
Simplified Excel Corrector GUI for testing
"""

import tkinter as tk
from tkinter import filedialog, messagebox, ttk
import os
import threading
from datetime import datetime

class SimpleExcelCorrectorGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Simple Excel File Corrector")
        self.root.geometry("600x400")
        
        # Variables
        self.selected_file = tk.StringVar()
        self.output_directory = tk.StringVar(value="Created new one")
        self.processing = False
        
        # Create GUI
        self.create_widgets()
        
        # Center window
        self.center_window()
    
    def center_window(self):
        """Center the window on screen"""
        self.root.update_idletasks()
        width = self.root.winfo_width()
        height = self.root.winfo_height()
        x = (self.root.winfo_screenwidth() // 2) - (width // 2)
        y = (self.root.winfo_screenheight() // 2) - (height // 2)
        self.root.geometry(f'{width}x{height}+{x}+{y}')
    
    def create_widgets(self):
        """Create all GUI widgets"""
        # Main container
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Title
        title_label = ttk.Label(main_frame, text="📊 Excel File Corrector", font=('Arial', 18, 'bold'))
        title_label.pack(pady=(0, 10))
        
        subtitle_label = ttk.Label(main_frame, text="Automatically correct Excel files for bulk upload", font=('Arial', 10))
        subtitle_label.pack(pady=(0, 30))
        
        # File selection section
        file_frame = ttk.LabelFrame(main_frame, text="Select Excel File", padding="15")
        file_frame.pack(fill=tk.X, pady=(0, 20))
        
        ttk.Label(file_frame, text="File:").pack(anchor=tk.W)
        
        self.file_entry = ttk.Entry(file_frame, textvariable=self.selected_file, state='readonly', width=50)
        self.file_entry.pack(fill=tk.X, pady=(0, 10))
        
        self.browse_button = ttk.Button(file_frame, text="Browse...", command=self.browse_file)
        self.browse_button.pack()
        
        # Button frame
        button_frame = ttk.Frame(main_frame)
        button_frame.pack(pady=20)
        
        # Process button
        self.process_button = ttk.Button(button_frame, text="Process & Fix File", command=self.process_file)
        self.process_button.pack(side=tk.LEFT, padx=10)
        
        # Check Issues button
        self.check_issues_button = ttk.Button(button_frame, text="Check Issues Only", command=self.check_issues_only)
        self.check_issues_button.pack(side=tk.LEFT, padx=10)
        
        # Progress section
        progress_frame = ttk.LabelFrame(main_frame, text="Progress", padding="15")
        progress_frame.pack(fill=tk.X, pady=(0, 20))
        
        self.progress_var = tk.StringVar(value="Ready to process files...")
        self.progress_label = ttk.Label(progress_frame, textvariable=self.progress_var)
        self.progress_label.pack(anchor=tk.W)
        
        # Results section
        results_frame = ttk.LabelFrame(main_frame, text="Results", padding="15")
        results_frame.pack(fill=tk.BOTH, expand=True)
        
        self.results_text = tk.Text(results_frame, height=8, width=60, wrap=tk.WORD, state='disabled')
        self.results_text.pack(fill=tk.BOTH, expand=True)
        
        # Add initial text
        self.update_results_text("Ready to process Excel files...\n\nSelect an Excel file to begin processing...")
    
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
    
    def process_file(self):
        """Process the selected Excel file"""
        if not self.selected_file.get():
            messagebox.showwarning("No File Selected", "Please select an Excel file first.")
            return
        
        self.progress_var.set("Processing file...")
        self.update_results_text("Processing file...\n\nThis is a simplified version for testing.")
    
    def check_issues_only(self):
        """Check for issues only"""
        if not self.selected_file.get():
            messagebox.showwarning("No File Selected", "Please select an Excel file first.")
            return
        
        self.progress_var.set("Checking for issues...")
        self.update_results_text("Checking for issues...\n\nThis is a simplified version for testing.")
    
    def update_results_text(self, text):
        """Update the results text widget"""
        self.results_text.config(state='normal')
        self.results_text.delete(1.0, tk.END)
        self.results_text.insert(1.0, text)
        self.results_text.config(state='disabled')

def main():
    """Main function to run the GUI"""
    print("Starting simplified GUI...")
    root = tk.Tk()
    app = SimpleExcelCorrectorGUI(root)
    print("GUI created successfully, starting mainloop...")
    root.mainloop()
    print("Mainloop finished")

if __name__ == "__main__":
    main()
