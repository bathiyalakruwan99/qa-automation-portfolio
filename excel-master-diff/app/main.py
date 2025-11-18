"""
Main application entry point for Excel Comparator.
"""
import tkinter as tk
from tkinter import messagebox
import os
import subprocess
from .ui import ExcelComparatorUI
from .utils import ensure_directories, get_timestamp


class ExcelComparatorApp:
    def __init__(self):
        self.root = tk.Tk()
        self.ui = ExcelComparatorUI(self.root)
        
        # Setup callbacks
        self.ui.on_export_side_by_side = self.export_side_by_side
        self.ui.on_open_outputs = self.open_outputs_folder
        
        # Ensure directories exist
        ensure_directories()
    
    def run(self):
        """Start the application."""
        self.root.mainloop()
    
    def export_side_by_side(self):
        """Export side-by-side comparison using the flat comparator."""
        if len(self.ui.selected_files) != 2:
            messagebox.showerror("Error", "Please select exactly 2 files.")
            return
        
        try:
            self.ui.set_progress(0, "Preparing side-by-side export...")
            self.ui.log_message("Preparing side-by-side comparison...")
            
            # Get file paths
            first_file = self.ui.selected_files[0]
            second_file = self.ui.selected_files[1]
            
            # Create output path
            timestamp = get_timestamp()
            output_path = f"outputs/compare_side_by_side_{timestamp}.xlsx"
            
            self.ui.set_progress(20, "Running side-by-side comparison...")
            self.ui.log_message(f"Comparing: {os.path.basename(first_file)} vs {os.path.basename(second_file)}")
            
            # Run the side-by-side comparator
            cmd = [
                "python", "compare_flat_side_by_side.py",
                "--first", first_file,
                "--second", second_file,
                "--out", output_path
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, cwd=os.getcwd())
            
            if result.returncode == 0:
                self.ui.set_progress(100, "Complete!")
                self.ui.log_message("✓ Side-by-side comparison completed successfully!")
                self.ui.log_message(f"✓ Output saved: {output_path}")
                
                # Show completion message
                messagebox.showinfo("Export Complete", 
                    f"Side-by-side comparison exported to:\n{output_path}\n\n"
                    f"Features:\n"
                    f"• Side-by-side columns for easy comparison\n"
                    f"• Color-coded cells (Blue=A-only, Green=B-only, Red=Changed)\n"
                    f"• Preserves row order from second file\n"
                    f"• Frozen headers and auto-filter enabled")
            else:
                error_msg = result.stderr or "Unknown error occurred"
                self.ui.log_message(f"✗ Error during side-by-side export: {error_msg}")
                messagebox.showerror("Export Error", f"An error occurred during side-by-side export:\n{error_msg}")
            
        except Exception as e:
            self.ui.log_message(f"✗ Error during side-by-side export: {e}")
            messagebox.showerror("Export Error", f"An error occurred during export:\n{e}")
        finally:
            self.ui.set_progress(0, "Ready")
    
    def open_outputs_folder(self):
        """Open outputs folder in file explorer."""
        try:
            outputs_path = os.path.abspath("outputs")
            os.makedirs(outputs_path, exist_ok=True)
            os.startfile(outputs_path)
        except Exception as e:
            messagebox.showerror("Error", f"Could not open outputs folder:\n{e}")


def main():
    """Main entry point."""
    app = ExcelComparatorApp()
    app.run()


if __name__ == "__main__":
    main()
