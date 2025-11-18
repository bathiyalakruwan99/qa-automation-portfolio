"""
Data loading functions for the order file generator.
Loads spec files and location masters without modifying their structure.
"""
from typing import List, Tuple, Optional
import pandas as pd
from .utils import auto_detect_location_columns


def load_spec_columns(file_path: str) -> List[str]:
    """
    Load column names from the order spec file without modifying them.
    Takes the first sheet as canonical.
    
    Args:
        file_path: Path to the spec Excel file
        
    Returns:
        List of exact column names from the first sheet
        
    Raises:
        Exception: If file cannot be read or has no columns
    """
    try:
        # Read just the first row to get columns
        df = pd.read_excel(file_path, nrows=0)
        columns = df.columns.tolist()
        
        if not columns:
            raise ValueError("Spec file has no columns")
        
        return columns
    except Exception as e:
        raise Exception(f"Failed to load spec file: {str(e)}")


def load_location_master(file_path: str) -> pd.DataFrame:
    """
    Load the location master Excel file.
    
    Args:
        file_path: Path to the location master Excel file
        
    Returns:
        DataFrame with location data
        
    Raises:
        Exception: If file cannot be read
    """
    try:
        # First, try to get all sheet names
        excel_file = pd.ExcelFile(file_path)
        sheet_names = excel_file.sheet_names
        
        print(f"Available sheets: {sheet_names}")
        
        # Look for a sheet that might contain location data
        location_sheet = None
        for sheet_name in sheet_names:
            # Try to read each sheet to find the one with location data
            try:
                df_test = pd.read_excel(file_path, sheet_name=sheet_name, nrows=5)
                # Check if this sheet has location-related columns
                columns_lower = [str(col).lower() for col in df_test.columns]
                # Prioritize "5 - Locations" sheet if it exists
                if '5 - locations' in sheet_name.lower():
                    location_sheet = sheet_name
                    print(f"Found location data in sheet: {sheet_name}")
                    break
                elif any('location' in col for col in columns_lower) and any('reference' in col for col in columns_lower):
                    location_sheet = sheet_name
                    print(f"Found location data in sheet: {sheet_name}")
                    break
            except:
                continue
        
        # If no specific sheet found, try the first sheet
        if not location_sheet and sheet_names:
            location_sheet = sheet_names[0]
            print(f"Using first sheet: {location_sheet}")
        
        if not location_sheet:
            raise ValueError("No sheets found in the Excel file")
        
        # Read the location sheet - try different header rows to find the right one
        df = None
        header_row = None
        
        # Try to find the row with "Location Reference ID" header
        for row_num in range(10):  # Check first 10 rows for headers
            try:
                test_df = pd.read_excel(file_path, sheet_name=location_sheet, header=row_num, nrows=5)
                columns_lower = [str(col).lower() for col in test_df.columns]
                if 'location reference id' in columns_lower or 'organization short name' in columns_lower:
                    header_row = row_num
                    print(f"Found headers at row {row_num}: {list(test_df.columns)}")
                    break
            except:
                continue
        
        # Read with the found header row
        if header_row is not None:
            df = pd.read_excel(file_path, sheet_name=location_sheet, header=header_row)
        else:
            # Fallback to reading without headers
            df = pd.read_excel(file_path, sheet_name=location_sheet)
        
        if df.empty:
            raise ValueError(f"Location sheet '{location_sheet}' is empty")
        
        # Clean up column names (strip whitespace but don't rename)
        df.columns = df.columns.str.strip()
        
        # Remove any completely empty rows
        df = df.dropna(how='all')
        
        print(f"Loaded {len(df)} locations from sheet '{location_sheet}'")
        print(f"Columns: {list(df.columns)}")
        
        return df
    except Exception as e:
        raise Exception(f"Failed to load location master: {str(e)}")


def get_location_references(
    loc_df: pd.DataFrame,
    ref_col: str
) -> List[str]:
    """
    Get list of unique location reference IDs from the master.
    
    Args:
        loc_df: Location master dataframe
        ref_col: Column name for Location Reference ID
        
    Returns:
        Sorted list of unique location reference IDs
    """
    refs = loc_df[ref_col].dropna().unique().tolist()
    # Convert to strings and sort
    refs = [str(r).strip() for r in refs if str(r).strip() != '']
    return sorted(refs)


def get_organization_name(
    loc_df: pd.DataFrame,
    ref_col: str,
    org_col: str,
    location_ref: str
) -> Optional[str]:
    """
    Get the organization short name for a given location reference ID.
    
    Args:
        loc_df: Location master dataframe
        ref_col: Column name for Location Reference ID
        org_col: Column name for Organization Short Name
        location_ref: The location reference ID to look up
        
    Returns:
        Organization short name or None if not found
    """
    match = loc_df[loc_df[ref_col] == location_ref]
    if not match.empty:
        org_name = match.iloc[0][org_col]
        return str(org_name) if pd.notna(org_name) else None
    return None


def auto_guess_location_columns(loc_df: pd.DataFrame) -> Tuple[Optional[str], Optional[str], Optional[str]]:
    """
    Auto-detect location column mappings.
    
    Args:
        loc_df: Location master dataframe
        
    Returns:
        Tuple of (ref_column, org_short_column, location_name_column)
    """
    columns = loc_df.columns.tolist()
    return auto_detect_location_columns(columns)


def load_spec_full(file_path: str) -> pd.DataFrame:
    """
    Load the full spec file for reference (used to see example data).
    
    Args:
        file_path: Path to the spec Excel file
        
    Returns:
        DataFrame with spec data
    """
    try:
        df = pd.read_excel(file_path)
        return df
    except Exception as e:
        raise Exception(f"Failed to load spec file: {str(e)}")

