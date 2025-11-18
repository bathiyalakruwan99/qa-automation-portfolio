#!/usr/bin/env python3
"""
Excel File Corrector with HR Red Cell Detection
Launcher Script
"""

import sys
import os

def display_header():
    """Display application header"""
    print("=" * 60)
    print("  EXCEL FILE CORRECTOR WITH HR RED CELL DETECTION")
    print("=" * 60)
    print("Features:")
    print("- Smart state name correction with address detection")
    print("- HR red cell detection for NIC and Email columns")
    print("- Both red → Activity changed to 'Update'")
    print("- One red → Prefix added to red cell")
    print("- GUI and command line interfaces")
    print("- Comprehensive Excel validation fixes")

def main():
    """Main launcher function"""
    display_header()
    print("Launching Excel File Corrector GUI...")
    
    # Import and run GUI
    try:
        from excel_corrector_gui import main as gui_main
        gui_main()
    except ImportError as e:
        print(f"Error importing GUI: {e}")
        print("Make sure all required packages are installed:")
        print("pip install pandas openpyxl tkinter")
        sys.exit(1)
    except Exception as e:
        print(f"Error running application: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 