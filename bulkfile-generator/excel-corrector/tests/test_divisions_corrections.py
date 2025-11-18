#!/usr/bin/env python3
"""
Test script to verify Divisions sheet corrections are working correctly.
"""

import pandas as pd
import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from excel_corrector import ExcelCorrector

def test_divisions_corrections():
    """Test the Divisions sheet corrections with different processing options."""
    
    print("Testing Divisions sheet corrections...")
    
    # Create a sample DataFrame for Divisions sheet
    data = {
        'Organization': ['Org1', 'Org2', 'Org3'],
        'Organization Short Name': ['', 'ORG2', ''],  # Empty values to test
        'Division Name': ['', 'Div2', ''],  # Empty values to test
        'Purpose': ['', 'PPS-STG', 'INVALID'],  # Empty and invalid values to test
        'Principle Contact First Name': ['', 'John', 'Jane'],  # Empty and non-empty values to test
        'Principle Contact Last Name': ['', 'Doe', 'Smith']  # Empty and non-empty values to test
    }
    
    df = pd.DataFrame(data)
    print("\nOriginal DataFrame:")
    print(df)
    
    # Test 1: All options enabled
    print("\n\n=== Test 1: All options enabled ===")
    processing_options = {
        'divisions': {
            'Organization Short Name': {'correct': type('', (), {'get': lambda: True})(), 'dummy_data': type('', (), {'get': lambda: True})()},
            'Division Name': {'correct': type('', (), {'get': lambda: True})(), 'dummy_data': type('', (), {'get': lambda: True})()},
            'Purpose': {'correct': type('', (), {'get': lambda: True})(), 'dummy_data': type('', (), {'get': lambda: True})()},
            'Principle Contact First Name': {'correct': type('', (), {'get': lambda: True})(), 'dummy_data': type('', (), {'get': lambda: True})()},
            'Principle Contact Last Name': {'correct': type('', (), {'get': lambda: True})(), 'dummy_data': type('', (), {'get': lambda: True})()}
        }
    }
    
    corrector = ExcelCorrector()
    corrected_df = corrector.correct_divisions(df.copy(), processing_options)
    
    print("\nCorrected DataFrame (all options enabled):")
    print(corrected_df)
    
    # Test 2: No options enabled
    print("\n\n=== Test 2: No options enabled ===")
    processing_options = {
        'divisions': {
            'Organization Short Name': {'correct': type('', (), {'get': lambda: False})(), 'dummy_data': type('', (), {'get': lambda: False})()},
            'Division Name': {'correct': type('', (), {'get': lambda: False})(), 'dummy_data': type('', (), {'get': lambda: False})()},
            'Purpose': {'correct': type('', (), {'get': lambda: False})(), 'dummy_data': type('', (), {'get': lambda: False})()},
            'Principle Contact First Name': {'correct': type('', (), {'get': lambda: False})(), 'dummy_data': type('', (), {'get': lambda: False})()},
            'Principle Contact Last Name': {'correct': type('', (), {'get': lambda: False})(), 'dummy_data': type('', (), {'get': lambda: False})()}
        }
    }
    
    corrected_df2 = corrector.correct_divisions(df.copy(), processing_options)
    
    print("\nCorrected DataFrame (no options enabled):")
    print(corrected_df2)
    
    # Test 3: Mixed options
    print("\n\n=== Test 3: Mixed options ===")
    processing_options = {
        'divisions': {
            'Organization Short Name': {'correct': type('', (), {'get': lambda: True})(), 'dummy_data': type('', (), {'get': lambda: False})()},
            'Division Name': {'correct': type('', (), {'get': lambda: False})(), 'dummy_data': type('', (), {'get': lambda: True})()},
            'Purpose': {'correct': type('', (), {'get': lambda: True})(), 'dummy_data': type('', (), {'get': lambda: False})()},
            'Principle Contact First Name': {'correct': type('', (), {'get': lambda: False})(), 'dummy_data': type('', (), {'get': lambda: False})()},
            'Principle Contact Last Name': {'correct': type('', (), {'get': lambda: True})(), 'dummy_data': type('', (), {'get': lambda: False})()}
        }
    }
    
    corrected_df3 = corrector.correct_divisions(df.copy(), processing_options)
    
    print("\nCorrected DataFrame (mixed options):")
    print(corrected_df3)
    
    print("\n\nTesting completed!")

if __name__ == "__main__":
    test_divisions_corrections()
