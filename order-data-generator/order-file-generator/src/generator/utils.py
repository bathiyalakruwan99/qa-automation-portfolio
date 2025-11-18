"""
Utility functions for the order file generator.
Includes column finders, time window helpers, and ID generators.
"""
from datetime import datetime, timedelta
from typing import List, Optional, Tuple
import re


def find_column(columns: List[str], patterns: List[str], case_sensitive: bool = False) -> Optional[str]:
    """
    Find a column name that matches one of the given patterns.
    
    Args:
        columns: List of column names to search
        patterns: List of patterns to match (can include wildcards)
        case_sensitive: Whether to match case-sensitively
        
    Returns:
        Matched column name or None
    """
    for pattern in patterns:
        pattern_lower = pattern.lower() if not case_sensitive else pattern
        for col in columns:
            col_check = col.lower() if not case_sensitive else col
            if pattern_lower in col_check or re.match(pattern_lower.replace('*', '.*'), col_check):
                return col
    return None


def auto_detect_location_columns(columns: List[str]) -> Tuple[Optional[str], Optional[str], Optional[str]]:
    """
    Auto-detect location-related columns in a dataframe.
    
    Returns:
        Tuple of (ref_column, org_short_column, location_name_column)
    """
    # Patterns for Location Reference ID
    ref_patterns = [
        'location reference id',
        'locationreferenceid',
        'location ref id',
        'loc ref id',
        'reference id',
        'ref id',
        'location id',
        'locationid'
    ]
    
    # Patterns for Organization Short Name
    org_patterns = [
        'organization short name',
        'org short name',
        'orgshortname',
        'organization name',
        'org name',
        'organization',
        'customer name',
        'customer'
    ]
    
    # Patterns for Location Name (optional)
    name_patterns = [
        'location name',
        'locationname',
        'site name',
        'sitename',
        'name'
    ]
    
    ref_col = find_column(columns, ref_patterns)
    org_col = find_column(columns, org_patterns)
    name_col = find_column(columns, name_patterns)
    
    return ref_col, org_col, name_col


def generate_time_window(
    base_time: datetime,
    start_offset_hours: float,
    end_offset_hours: float,
    format_type: str = "combined"
) -> str:
    """
    Generate a time window string.
    
    Args:
        base_time: Base datetime to offset from
        start_offset_hours: Hours to add for start time
        end_offset_hours: Hours to add for end time
        format_type: "combined" for "YYYY-MM-DD HH:MM–YYYY-MM-DD HH:MM" or "split" for separate values
        
    Returns:
        Formatted time window string
    """
    start = base_time + timedelta(hours=start_offset_hours)
    end = base_time + timedelta(hours=end_offset_hours)
    
    if format_type == "combined":
        return f"{start.strftime('%Y-%m-%d %H:%M')}–{end.strftime('%Y-%m-%d %H:%M')}"
    else:
        return start.strftime('%Y-%m-%d %H:%M'), end.strftime('%Y-%m-%d %H:%M')


def generate_order_id(prefix: str, index: int, padding: int = 4) -> str:
    """
    Generate an order ID with prefix and zero-padded index.
    
    Args:
        prefix: Prefix string (e.g., "ORD")
        index: Numeric index
        padding: Number of digits to pad to
        
    Returns:
        Order ID string (e.g., "ORD0001")
    """
    return f"{prefix}{str(index).zfill(padding)}"


def add_whitespace_variation(value: str, variation_type: str = "leading") -> str:
    """
    Add whitespace variations to a value for testing.
    
    Args:
        value: Original value
        variation_type: "leading", "trailing", or "both"
        
    Returns:
        Value with added whitespace
    """
    if variation_type == "leading":
        return f"  {value}"
    elif variation_type == "trailing":
        return f"{value}  "
    else:  # both
        return f"  {value}  "


def detect_time_column_format(columns: List[str]) -> dict:
    """
    Detect whether the spec uses combined or split time window columns.
    
    Returns:
        Dict with format info and column mappings
    """
    columns_lower = [c.lower() for c in columns]
    
    # Check for split format
    has_pickup_start = any('pickup' in c and ('start' in c or 'after' in c or 'from' in c) for c in columns_lower)
    has_pickup_end = any('pickup' in c and ('end' in c or 'before' in c or 'to' in c) for c in columns_lower)
    has_delivery_start = any('deliver' in c and ('start' in c or 'after' in c or 'from' in c or 'on or after' in c) for c in columns_lower)
    has_delivery_end = any('deliver' in c and ('end' in c or 'before' in c or 'to' in c or 'on or before' in c) for c in columns_lower)
    
    # Check for combined format
    has_pickup_window = any('pickup' in c and 'window' in c for c in columns_lower)
    has_delivery_window = any('deliver' in c and 'window' in c for c in columns_lower)
    
    result = {
        'format': 'split' if (has_pickup_start or has_delivery_start) else 'combined',
        'pickup_start_col': None,
        'pickup_end_col': None,
        'delivery_start_col': None,
        'delivery_end_col': None,
        'pickup_window_col': None,
        'delivery_window_col': None
    }
    
    if result['format'] == 'split':
        # Find actual column names
        for col in columns:
            col_lower = col.lower()
            if 'pickup' in col_lower and ('start' in col_lower or 'after' in col_lower or 'from' in col_lower):
                result['pickup_start_col'] = col
            elif 'pickup' in col_lower and ('end' in col_lower or 'before' in col_lower or 'to' in col_lower):
                result['pickup_end_col'] = col
            elif 'deliver' in col_lower and ('start' in col_lower or 'after' in col_lower or 'from' in col_lower or 'on or after' in col_lower):
                result['delivery_start_col'] = col
            elif 'deliver' in col_lower and ('end' in col_lower or 'before' in col_lower or 'to' in col_lower or 'on or before' in col_lower):
                result['delivery_end_col'] = col
    else:
        # Find combined columns
        for col in columns:
            col_lower = col.lower()
            if 'pickup' in col_lower and 'window' in col_lower:
                result['pickup_window_col'] = col
            elif 'deliver' in col_lower and 'window' in col_lower:
                result['delivery_window_col'] = col
    
    return result

