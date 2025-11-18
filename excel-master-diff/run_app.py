"""
Simple launcher script for the Excel Comparator application.
"""
import sys
import os

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import and run the application
from app.main import main

if __name__ == "__main__":
    main()
