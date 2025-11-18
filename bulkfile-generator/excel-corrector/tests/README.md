# Test Suite

This directory contains test files for the Excel File Corrector tool.

## Test Files

- **test_divisions_corrections.py** - Tests Divisions sheet corrections with different processing options
- **test_error_highlighting.py** - Tests error highlighting functionality when corrections are disabled
- **test_multiple_verticals.py** - Tests multiple verticals handling logic
- **test_new_conditions.py** - Tests new enhanced organization details validation rules
- **test_options_dialog.py** - Tests the Processing Options Dialog UI
- **test_verticals_validation.py** - Tests verticals validation with various formatting issues
- **test_delayed_gui.bat** - Batch file to launch the delayed GUI version for testing

## Running Tests

To run a specific test:
```bash
python tests/test_divisions_corrections.py
python tests/test_error_highlighting.py
python tests/test_new_conditions.py
```

Or run all tests:
```bash
python tests/test_*.py
```

## Purpose

These tests verify that:
- Excel correction logic works correctly
- Processing options are applied properly
- Error highlighting functions as expected
- Validation rules handle edge cases correctly
- Multiple verticals and formatting variations are handled

