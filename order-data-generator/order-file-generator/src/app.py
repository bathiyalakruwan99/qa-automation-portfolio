"""
Order File Generator - Entry Point
Launches the Tkinter application for generating test order files.
"""
import tkinter as tk
from tkinter import ttk
import sys
import os

# Add src directory to path if needed
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from generator.ui import OrderGeneratorApp


def main():
    """Launch the application."""
    root = tk.Tk()
    
    # Try to use better theme on Windows
    try:
        style = ttk.Style()
        # Try modern themes
        available_themes = style.theme_names()
        if 'vista' in available_themes:
            style.theme_use('vista')
        elif 'clam' in available_themes:
            style.theme_use('clam')
    except:
        pass  # Use default theme if error
    
    # Create and run app
    app = OrderGeneratorApp(root)
    
    # Center window on screen
    root.update_idletasks()
    width = root.winfo_width()
    height = root.winfo_height()
    x = (root.winfo_screenwidth() // 2) - (width // 2)
    y = (root.winfo_screenheight() // 2) - (height // 2)
    root.geometry(f'{width}x{height}+{x}+{y}')
    
    # Run
    root.mainloop()


if __name__ == "__main__":
    main()

