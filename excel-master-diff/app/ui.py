"""
Tkinter UI components for Excel comparison tool.
"""
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import os
from typing import List, Callable


class ExcelComparatorUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Excel Side-by-Side Comparator")
        self.root.geometry("800x700")
        
        # Data
        self.selected_files = []
        self.selected_sheets = {
            "1 - Organization Details": tk.BooleanVar(value=True),
            "2 - Divisions": tk.BooleanVar(value=True),
            "3 - Human Resources": tk.BooleanVar(value=True),
            "4 - Vehicles": tk.BooleanVar(value=True),
            "5 - Locations": tk.BooleanVar(value=True)
        }
        
        # Callbacks
        self.on_export_side_by_side = None
        self.on_open_outputs = None
        
        self.setup_ui()
    
    def setup_ui(self):
        """Setup the main UI layout."""
        # Main frame
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Configure grid weights
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(1, weight=1)
        main_frame.rowconfigure(2, weight=1)
        
        # Title
        title_label = ttk.Label(main_frame, text="Excel Side-by-Side Comparator", 
                               font=("Arial", 16, "bold"))
        title_label.grid(row=0, column=0, columnspan=3, pady=(0, 20))
        
        # File selection section
        self.setup_file_selection(main_frame)
        
        # Sheet selection section
        self.setup_sheet_selection(main_frame)
        
        # Control buttons
        self.setup_control_buttons(main_frame)
        
        # Progress and log section
        self.setup_progress_log(main_frame)
    
    def setup_file_selection(self, parent):
        """Setup file selection UI."""
        # File selection frame
        file_frame = ttk.LabelFrame(parent, text="File Selection (2 files only)", padding="10")
        file_frame.grid(row=1, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(0, 10))
        file_frame.columnconfigure(1, weight=1)
        
        # Add files button
        add_btn = ttk.Button(file_frame, text="Add Excel Files", command=self.add_files)
        add_btn.grid(row=0, column=0, padx=(0, 10))
        
        # File list frame
        list_frame = ttk.Frame(file_frame)
        list_frame.grid(row=1, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(10, 0))
        list_frame.columnconfigure(0, weight=1)
        
        # File listbox with scrollbar
        self.file_listbox = tk.Listbox(list_frame, height=4)
        self.file_listbox.grid(row=0, column=0, sticky=(tk.W, tk.E))
        
        scrollbar = ttk.Scrollbar(list_frame, orient=tk.VERTICAL, command=self.file_listbox.yview)
        scrollbar.grid(row=0, column=1, sticky=(tk.N, tk.S))
        self.file_listbox.config(yscrollcommand=scrollbar.set)
        
        # File control buttons
        btn_frame = ttk.Frame(file_frame)
        btn_frame.grid(row=2, column=0, columnspan=3, pady=(10, 0))
        
        ttk.Button(btn_frame, text="Move Up", command=self.move_file_up).grid(row=0, column=0, padx=(0, 5))
        ttk.Button(btn_frame, text="Move Down", command=self.move_file_down).grid(row=0, column=1, padx=(0, 5))
        ttk.Button(btn_frame, text="Remove", command=self.remove_file).grid(row=0, column=2, padx=(0, 5))
        ttk.Button(btn_frame, text="Clear All", command=self.clear_files).grid(row=0, column=3)
        
        # Reference indicator
        self.reference_label = ttk.Label(file_frame, text="First file will be used as Reference (A)", 
                                        font=("Arial", 9, "italic"))
        self.reference_label.grid(row=3, column=0, columnspan=3, pady=(5, 0))
    
    def setup_sheet_selection(self, parent):
        """Setup sheet selection UI."""
        sheet_frame = ttk.LabelFrame(parent, text="Sheet Selection", padding="10")
        sheet_frame.grid(row=2, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(0, 10))
        
        # Sheet checkboxes
        sheet_names = [
            ("1 - Organization Details", "Organization Details"),
            ("2 - Divisions", "Divisions"),
            ("3 - Human Resources", "Human Resources"),
            ("4 - Vehicles", "Vehicles"),
            ("5 - Locations", "Locations")
        ]
        
        for i, (sheet_key, display_name) in enumerate(sheet_names):
            cb = ttk.Checkbutton(sheet_frame, text=display_name, 
                               variable=self.selected_sheets[sheet_key])
            cb.grid(row=i//2, column=i%2, sticky=tk.W, padx=(0, 20), pady=2)
    
    def setup_control_buttons(self, parent):
        """Setup control buttons."""
        btn_frame = ttk.Frame(parent)
        btn_frame.grid(row=3, column=0, columnspan=3, pady=(0, 10))
        
        # Main action button
        self.side_by_side_btn = ttk.Button(btn_frame, text="Export Side-by-Side Comparison", 
                                          command=self.export_side_by_side, state=tk.DISABLED,
                                          style="Accent.TButton")
        self.side_by_side_btn.grid(row=0, column=0, padx=(0, 20))
        
        # Utility buttons
        ttk.Button(btn_frame, text="Open Outputs Folder", 
                  command=self.open_outputs).grid(row=0, column=1, padx=(0, 10))
        ttk.Button(btn_frame, text="Clear Files", 
                  command=self.clear_files).grid(row=0, column=2)
    
    def setup_progress_log(self, parent):
        """Setup progress bar and log console."""
        # Progress frame
        progress_frame = ttk.Frame(parent)
        progress_frame.grid(row=4, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(0, 10))
        progress_frame.columnconfigure(0, weight=1)
        
        # Progress bar
        self.progress_var = tk.DoubleVar()
        self.progress_bar = ttk.Progressbar(progress_frame, variable=self.progress_var, 
                                          maximum=100, length=400)
        self.progress_bar.grid(row=0, column=0, sticky=(tk.W, tk.E), padx=(0, 10))
        
        # Progress label
        self.progress_label = ttk.Label(progress_frame, text="Ready")
        self.progress_label.grid(row=0, column=1)
        
        # Log console
        log_frame = ttk.LabelFrame(parent, text="Log Console", padding="5")
        log_frame.grid(row=5, column=0, columnspan=3, sticky=(tk.W, tk.E, tk.N, tk.S), pady=(0, 10))
        log_frame.columnconfigure(0, weight=1)
        log_frame.rowconfigure(0, weight=1)
        parent.rowconfigure(5, weight=1)
        
        # Log text widget with scrollbar
        self.log_text = tk.Text(log_frame, height=10, wrap=tk.WORD)
        self.log_text.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        log_scrollbar = ttk.Scrollbar(log_frame, orient=tk.VERTICAL, command=self.log_text.yview)
        log_scrollbar.grid(row=0, column=1, sticky=(tk.N, tk.S))
        self.log_text.config(yscrollcommand=log_scrollbar.set)
    
    def add_files(self):
        """Add Excel files to the list."""
        filetypes = [("Excel files", "*.xlsx"), ("All files", "*.*")]
        files = filedialog.askopenfilenames(title="Select Excel files", filetypes=filetypes)
        
        for file_path in files:
            if file_path not in self.selected_files:
                if len(self.selected_files) >= 2:
                    messagebox.showwarning("Limit Reached", "Maximum 2 files allowed.")
                    break
                self.selected_files.append(file_path)
                self.update_file_list()
        
        self.update_button_states()
    
    def update_file_list(self):
        """Update the file listbox display."""
        self.file_listbox.delete(0, tk.END)
        for i, file_path in enumerate(self.selected_files):
            label = f"A (Reference)" if i == 0 else f"{chr(65 + i)}"
            filename = os.path.basename(file_path)
            self.file_listbox.insert(tk.END, f"{label}: {filename}")
    
    def move_file_up(self):
        """Move selected file up in the list."""
        selection = self.file_listbox.curselection()
        if selection and selection[0] > 0:
            idx = selection[0]
            self.selected_files[idx], self.selected_files[idx-1] = self.selected_files[idx-1], self.selected_files[idx]
            self.update_file_list()
            self.file_listbox.selection_set(idx-1)
    
    def move_file_down(self):
        """Move selected file down in the list."""
        selection = self.file_listbox.curselection()
        if selection and selection[0] < len(self.selected_files) - 1:
            idx = selection[0]
            self.selected_files[idx], self.selected_files[idx+1] = self.selected_files[idx+1], self.selected_files[idx]
            self.update_file_list()
            self.file_listbox.selection_set(idx+1)
    
    def remove_file(self):
        """Remove selected file from the list."""
        selection = self.file_listbox.curselection()
        if selection:
            idx = selection[0]
            del self.selected_files[idx]
            self.update_file_list()
            self.update_button_states()
    
    def clear_files(self):
        """Clear all files from the list."""
        self.selected_files = []
        self.update_file_list()
        self.update_button_states()
    
    def update_button_states(self):
        """Update button enabled/disabled states."""
        has_two_files = len(self.selected_files) == 2
        self.side_by_side_btn.config(state=tk.NORMAL if has_two_files else tk.DISABLED)
    
    def get_selected_sheets(self):
        """Get list of selected sheet names."""
        return [sheet for sheet, var in self.selected_sheets.items() if var.get()]
    
    def export_side_by_side(self):
        """Export side-by-side comparison."""
        if self.on_export_side_by_side:
            self.on_export_side_by_side()
    
    def open_outputs(self):
        """Open outputs folder."""
        if self.on_open_outputs:
            self.on_open_outputs()
    
    def log_message(self, message):
        """Add message to log console."""
        self.log_text.insert(tk.END, f"{message}\n")
        self.log_text.see(tk.END)
        self.root.update_idletasks()
    
    def set_progress(self, value, text=""):
        """Update progress bar and label."""
        self.progress_var.set(value)
        if text:
            self.progress_label.config(text=text)
        self.root.update_idletasks()
    
    def show_completion_message(self, report_path, excel_path=None):
        """Show completion message with output paths."""
        message = f"Comparison completed!\n\nMarkdown report: {report_path}"
        if excel_path:
            message += f"\nExcel export: {excel_path}"
        
        messagebox.showinfo("Comparison Complete", message)
