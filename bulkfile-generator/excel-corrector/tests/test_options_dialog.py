#!/usr/bin/env python3
"""
Test Script for Processing Options Dialog
Tests the new options dialog functionality
"""

import tkinter as tk
from processing_options_dialog import ProcessingOptionsDialog

def test_options_dialog():
    """Test the processing options dialog"""
    print("🧪 Testing Processing Options Dialog...")
    
    # Create a simple root window
    root = tk.Tk()
    root.withdraw()  # Hide the main window
    
    try:
        # Create the options dialog
        print("📋 Creating options dialog...")
        dialog = ProcessingOptionsDialog(root)
        
        if dialog.result:
            print("✅ Dialog completed successfully!")
            print("📊 Selected options:")
            
            for sheet_type, options in dialog.result.items():
                print(f"\n🏷️  {sheet_type.upper()}:")
                for option_name, option_data in options.items():
                    correct = option_data['correct'].get()
                    dummy_data = option_data['dummy_data'].get()
                    print(f"   • {option_name}: Correct={correct}, Dummy Data={dummy_data}")
        else:
            print("❌ Dialog was cancelled")
            
    except Exception as e:
        print(f"❌ Error testing dialog: {e}")
    
    finally:
        # Clean up
        root.destroy()
        print("🧹 Cleanup completed")

if __name__ == "__main__":
    test_options_dialog()
