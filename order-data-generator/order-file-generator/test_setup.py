"""
Test script to verify the order file generator setup.
Run this after installation to check everything is working.
"""
import sys
import os

def test_imports():
    """Test that all required packages can be imported."""
    print("Testing package imports...")
    try:
        import pandas
        print("  ✓ pandas")
    except ImportError as e:
        print(f"  ✗ pandas: {e}")
        return False
    
    try:
        import numpy
        print("  ✓ numpy")
    except ImportError as e:
        print(f"  ✗ numpy: {e}")
        return False
    
    try:
        import openpyxl
        print("  ✓ openpyxl")
    except ImportError as e:
        print(f"  ✗ openpyxl: {e}")
        return False
    
    try:
        import xlsxwriter
        print("  ✓ xlsxwriter")
    except ImportError as e:
        print(f"  ✗ xlsxwriter: {e}")
        return False
    
    return True


def test_modules():
    """Test that our custom modules can be imported."""
    print("\nTesting custom modules...")
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))
    
    try:
        from generator import utils
        print("  ✓ generator.utils")
    except ImportError as e:
        print(f"  ✗ generator.utils: {e}")
        return False
    
    try:
        from generator import validators
        print("  ✓ generator.validators")
    except ImportError as e:
        print(f"  ✗ generator.validators: {e}")
        return False
    
    try:
        from generator import loaders
        print("  ✓ generator.loaders")
    except ImportError as e:
        print(f"  ✗ generator.loaders: {e}")
        return False
    
    try:
        from generator import builder
        print("  ✓ generator.builder")
    except ImportError as e:
        print(f"  ✗ generator.builder: {e}")
        return False
    
    try:
        from generator import ui
        print("  ✓ generator.ui")
    except ImportError as e:
        print(f"  ✗ generator.ui: {e}")
        return False
    
    return True


def test_files():
    """Test that required files exist."""
    print("\nChecking required files...")
    
    files_to_check = [
        'src/app.py',
        'src/generator/__init__.py',
        'src/generator/utils.py',
        'src/generator/validators.py',
        'src/generator/loaders.py',
        'src/generator/builder.py',
        'src/generator/ui.py',
        'requirements.txt',
        'README.md',
    ]
    
    all_good = True
    for file_path in files_to_check:
        if os.path.exists(file_path):
            print(f"  ✓ {file_path}")
        else:
            print(f"  ✗ {file_path} (missing)")
            all_good = False
    
    return all_good


def test_data_files():
    """Test that sample data files exist."""
    print("\nChecking sample data files...")
    
    data_files = [
        ('data/locations/Centrics 3PL (7).xlsx', 'Location Master'),
        ('data/specs/Order List Spec - D7 Cash Customer-Kithulgala-OK DEMO.xlsx', 'Order Spec'),
    ]
    
    all_good = True
    for file_path, description in data_files:
        if os.path.exists(file_path):
            print(f"  ✓ {description}: {file_path}")
        else:
            print(f"  ✗ {description}: {file_path} (missing)")
            all_good = False
    
    return all_good


def test_load_sample_files():
    """Test loading the sample files."""
    print("\nTesting sample file loading...")
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))
    
    try:
        from generator import loaders
        
        # Test loading spec
        spec_path = 'data/specs/Order List Spec - D7 Cash Customer-Kithulgala-OK DEMO.xlsx'
        if os.path.exists(spec_path):
            try:
                columns = loaders.load_spec_columns(spec_path)
                print(f"  ✓ Loaded spec file: {len(columns)} columns")
                print(f"    First 5 columns: {', '.join(columns[:5])}")
            except Exception as e:
                print(f"  ✗ Failed to load spec: {e}")
                return False
        
        # Test loading location master
        loc_path = 'data/locations/Centrics 3PL (7).xlsx'
        if os.path.exists(loc_path):
            try:
                loc_df = loaders.load_location_master(loc_path)
                print(f"  ✓ Loaded location master: {len(loc_df)} locations")
                
                # Test auto-detection
                ref_col, org_col, name_col = loaders.auto_guess_location_columns(loc_df)
                print(f"    Auto-detected columns:")
                print(f"      Location Ref ID: {ref_col}")
                print(f"      Org Short Name: {org_col}")
                print(f"      Location Name: {name_col}")
            except Exception as e:
                print(f"  ✗ Failed to load location master: {e}")
                return False
        
        return True
    except Exception as e:
        print(f"  ✗ Error during file loading test: {e}")
        return False


def main():
    """Run all tests."""
    print("=" * 60)
    print("Order File Generator - Setup Test")
    print("=" * 60)
    
    results = []
    
    # Run tests
    results.append(("Package Imports", test_imports()))
    results.append(("Custom Modules", test_modules()))
    results.append(("Required Files", test_files()))
    results.append(("Sample Data Files", test_data_files()))
    results.append(("File Loading", test_load_sample_files()))
    
    # Summary
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)
    
    all_passed = True
    for test_name, result in results:
        status = "PASS" if result else "FAIL"
        symbol = "✓" if result else "✗"
        print(f"{symbol} {test_name}: {status}")
        if not result:
            all_passed = False
    
    print("=" * 60)
    
    if all_passed:
        print("\n✓ All tests passed! Your setup is ready.")
        print("\nTo run the application:")
        print("  - Double-click run.bat (Windows)")
        print("  - Or run: python src/app.py")
        return 0
    else:
        print("\n✗ Some tests failed. Please check the errors above.")
        print("\nCommon fixes:")
        print("  - Run install.bat to set up the virtual environment")
        print("  - Make sure all dependencies are installed: pip install -r requirements.txt")
        print("  - Check that sample files are in data/specs/ and data/locations/")
        return 1


if __name__ == "__main__":
    sys.exit(main())

