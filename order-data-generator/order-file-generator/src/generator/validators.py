"""
Validation functions for the order file generator.
Ensures spec files, location mappings, and user inputs are valid.
"""
from typing import List
import pandas as pd


class ValidationError(Exception):
    """Custom exception for validation errors."""
    pass


def ensure_spec_valid(spec_columns: List[str]) -> None:
    """
    Validate that the spec file has columns.
    
    Args:
        spec_columns: List of column names from the spec
        
    Raises:
        ValidationError: If spec is invalid
    """
    if not spec_columns or len(spec_columns) == 0:
        raise ValidationError("The spec file has no columns. Please check the file.")
    
    # Check for at least some expected columns (flexible check)
    if len(spec_columns) < 3:
        raise ValidationError(
            f"The spec file only has {len(spec_columns)} columns. "
            "Expected at least a few columns for order data."
        )


def ensure_location_mapping(
    loc_df: pd.DataFrame,
    ref_col: str,
    org_col: str
) -> None:
    """
    Validate that location mapping columns exist and have data.
    
    Args:
        loc_df: Location master dataframe
        ref_col: Location Reference ID column name
        org_col: Organization Short Name column name
        
    Raises:
        ValidationError: If mapping is invalid
    """
    if ref_col not in loc_df.columns:
        raise ValidationError(
            f"Location Reference ID column '{ref_col}' not found in location master. "
            f"Available columns: {', '.join(loc_df.columns)}"
        )
    
    if org_col not in loc_df.columns:
        raise ValidationError(
            f"Organization Short Name column '{org_col}' not found in location master. "
            f"Available columns: {', '.join(loc_df.columns)}"
        )
    
    # Check for empty columns
    if loc_df[ref_col].isna().all():
        raise ValidationError(f"Location Reference ID column '{ref_col}' is empty.")
    
    if loc_df[org_col].isna().all():
        raise ValidationError(f"Organization Short Name column '{org_col}' is empty.")
    
    # Check for duplicates in reference IDs
    ref_values = loc_df[ref_col].dropna()
    duplicates = ref_values[ref_values.duplicated()].unique()
    if len(duplicates) > 0:
        raise ValidationError(
            f"Duplicate Location Reference IDs found: {', '.join(map(str, duplicates[:5]))}"
            + (f" and {len(duplicates) - 5} more" if len(duplicates) > 5 else "")
        )


def ensure_pickup_in_master(
    loc_df: pd.DataFrame,
    ref_col: str,
    pickup_ref: str
) -> None:
    """
    Validate that the selected pickup location exists in the location master.
    
    Args:
        loc_df: Location master dataframe
        ref_col: Location Reference ID column name
        pickup_ref: Selected pickup location reference ID
        
    Raises:
        ValidationError: If pickup location is not found
    """
    if pickup_ref not in loc_df[ref_col].values:
        raise ValidationError(
            f"Pickup location '{pickup_ref}' not found in location master. "
            f"Please select a valid location."
        )


def validate_generation_parameters(
    num_drops: int,
    orders_per_drop: int,
    total_available_locations: int,
    pickup_ref: str
) -> None:
    """
    Validate order generation parameters.
    
    Args:
        num_drops: Number of drop-off locations
        orders_per_drop: Orders per location
        total_available_locations: Total locations in master
        pickup_ref: Selected pickup reference
        
    Raises:
        ValidationError: If parameters are invalid
    """
    if num_drops < 1:
        raise ValidationError("Number of unloading locations must be at least 1.")
    
    if orders_per_drop < 1:
        raise ValidationError("Orders per location must be at least 1.")
    
    # We need at least num_drops + 1 locations (pickup + drops)
    if total_available_locations < num_drops + 1:
        raise ValidationError(
            f"Not enough locations in master. "
            f"Need at least {num_drops + 1} (1 pickup + {num_drops} drops), "
            f"but only have {total_available_locations}."
        )
    
    if not pickup_ref or pickup_ref.strip() == "":
        raise ValidationError("Please select a pickup location.")


def validate_order_id_format(prefix: str, start_index: int) -> None:
    """
    Validate order ID generation parameters.
    
    Args:
        prefix: Order ID prefix
        start_index: Starting index
        
    Raises:
        ValidationError: If parameters are invalid
    """
    if not prefix or prefix.strip() == "":
        raise ValidationError("Order ID prefix cannot be empty.")
    
    if start_index < 0:
        raise ValidationError("Start index must be non-negative.")
    
    # Check for reasonable prefix (alphanumeric plus dash/underscore)
    import re
    if not re.match(r'^[A-Za-z0-9_-]+$', prefix):
        raise ValidationError(
            "Order ID prefix should only contain letters, numbers, dashes, and underscores."
        )


def validate_shipper_name(shipper: str) -> None:
    """
    Validate shipper name.
    
    Args:
        shipper: Shipper name
        
    Raises:
        ValidationError: If shipper name is invalid
    """
    if not shipper or shipper.strip() == "":
        raise ValidationError("Shipper name cannot be empty.")

