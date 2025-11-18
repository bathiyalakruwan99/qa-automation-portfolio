"""
Order file builder - generates order data while preserving exact spec schema.
"""
from datetime import datetime
from typing import List, Dict, Any
import pandas as pd
import numpy as np
from .loaders import get_organization_name
from .utils import generate_order_id, generate_time_window, add_whitespace_variation, detect_time_column_format


def generate_dataframe(
    spec_cols: List[str],
    loc_df: pd.DataFrame,
    ref_col: str,
    org_col: str,
    pickup_ref: str,
    drop_refs: List[str],
    options: Dict[str, Any]
) -> pd.DataFrame:
    """
    Generate order data as a DataFrame with the exact spec schema.
    
    Args:
        spec_cols: Exact column names from spec file
        loc_df: Location master DataFrame
        ref_col: Location Reference ID column name
        org_col: Organization Short Name column name
        pickup_ref: Pickup location reference ID
        drop_refs: List of drop-off location reference IDs
        options: Dict with:
            - orders_per_drop: int or None (for random)
            - max_orders_per_drop: int (if random)
            - use_random_orders: bool
            - shipper: str
            - order_prefix: str
            - start_index: int
            - duplicate_ids: bool
            - bad_time_windows: bool
            - whitespace_case: bool
            
    Returns:
        DataFrame with generated orders
    """
    # Initialize empty DataFrame with exact spec columns
    orders = []
    
    # Detect time column format
    time_format = detect_time_column_format(spec_cols)
    
    # Generate orders
    order_index = options['start_index']
    base_time = datetime.now()
    
    for drop_ref in drop_refs:
        # Determine number of orders for this drop
        if options.get('use_random_orders', False):
            num_orders = np.random.randint(1, options['max_orders_per_drop'] + 1)
        else:
            num_orders = options['orders_per_drop']
        
        # Get consignee name from location master
        consignee = get_organization_name(loc_df, ref_col, org_col, drop_ref)
        if not consignee:
            consignee = f"Unknown-{drop_ref}"
        
        for _ in range(num_orders):
            order = _create_order_row(
                spec_cols=spec_cols,
                order_id=generate_order_id(options['order_prefix'], order_index),
                pickup_ref=pickup_ref,
                drop_ref=drop_ref,
                consignee=consignee,
                shipper=options['shipper'],
                base_time=base_time,
                time_format=time_format,
                sequence_offset=order_index - options['start_index']
            )
            orders.append(order)
            order_index += 1
    
    df = pd.DataFrame(orders, columns=spec_cols)
    
    # Apply scenarios
    if options.get('duplicate_ids', False):
        df = _add_duplicate_ids(df, spec_cols)
    
    if options.get('bad_time_windows', False):
        df = _add_bad_time_windows(df, spec_cols, time_format)
    
    if options.get('whitespace_case', False):
        df = _add_whitespace_variations(df, spec_cols)
    
    return df


def _create_order_row(
    spec_cols: List[str],
    order_id: str,
    pickup_ref: str,
    drop_ref: str,
    consignee: str,
    shipper: str,
    base_time: datetime,
    time_format: dict,
    sequence_offset: int = 0
) -> Dict[str, Any]:
    """
    Create a single order row with randomized but realistic data.
    """
    row = {col: None for col in spec_cols}  # Initialize all columns as None
    
    # Focus on MANDATORY fields as specified
    field_mappings = {
        # MANDATORY FIELDS - Always fill these
        'orderid': order_id,
        'order id': order_id,
        'itemrefid': f"ITEM-{order_id}",
        'item ref id': f"ITEM-{order_id}",
        'item name': f"Test Item {np.random.randint(1, 100)}",
        'shipper': shipper,
        'consignee': consignee,
        'pickuplocationid': pickup_ref,
        'pickup location id': pickup_ref,
        'dropofflocationid': drop_ref,
        'dropoff location id': drop_ref,
        'dropoff location': drop_ref,
        'qty': np.random.randint(1, 9),
        
        # TIME FIELDS - Always fill with proper format
        'pickuptime': None,  # Will be set with proper timestamp format
        'pickup time': None,
        'deliveronorafter': None,  # Will be set separately for time windows
        'deliver on or after': None,
        'deliveronorbefore': None,
        'deliver on or before': None,
        
        # Other fields that may exist
        'weight': round(np.random.uniform(10.0, 80.0), 2),
        'cbm': round(np.random.uniform(0.1, 2.0), 3),
        'priority': np.random.choice(['Low', 'Normal', 'High'], p=[0.2, 0.6, 0.2]),
    }
    
    # Fill in known fields based on column name patterns
    for col in spec_cols:
        col_lower = col.lower().strip().replace(' ', '').replace('_', '').replace('-', '')
        if col_lower in field_mappings:
            row[col] = field_mappings[col_lower]
    
    # Handle time windows
    pickup_offset = 4 + (sequence_offset * 0.1)  # Slight offset per order
    delivery_offset = 8 + (sequence_offset * 0.1)
    
    # Ensure PickupTime is always filled with proper timestamp format
    pickup_time = base_time + pd.Timedelta(hours=pickup_offset)
    
    for col in spec_cols:
        col_lower = col.lower().strip().replace(' ', '').replace('_', '').replace('-', '')
        if col_lower == 'pickuptime':
            row[col] = pickup_time  # Store as datetime object
        elif col_lower == 'itemname' and not row.get(col):
            # Ensure Item name is always filled if not already set
            row[col] = f"Test Item {np.random.randint(1, 100)}"
    
    # Ensure DeliverOnOrAfter and DeliverOnOrBefore are always filled with proper timestamp format
    delivery_start_time = base_time + pd.Timedelta(hours=delivery_offset)
    delivery_end_time = base_time + pd.Timedelta(hours=delivery_offset + 2)
    
    for col in spec_cols:
        col_lower = col.lower().strip().replace(' ', '').replace('_', '').replace('-', '')
        if col_lower == 'deliveronorafter':
            row[col] = delivery_start_time  # Store as datetime object
        elif col_lower == 'deliveronorbefore':
            row[col] = delivery_end_time  # Store as datetime object
    
    if time_format['format'] == 'split':
        # Split format: separate start and end columns
        if time_format['pickup_start_col']:
            pickup_start, pickup_end = generate_time_window(
                base_time, pickup_offset, pickup_offset + 2, format_type='split'
            )
            row[time_format['pickup_start_col']] = pickup_start
            if time_format['pickup_end_col']:
                row[time_format['pickup_end_col']] = pickup_end
        
        if time_format['delivery_start_col']:
            delivery_start, delivery_end = generate_time_window(
                base_time, delivery_offset, delivery_offset + 2, format_type='split'
            )
            row[time_format['delivery_start_col']] = delivery_start
            if time_format['delivery_end_col']:
                row[time_format['delivery_end_col']] = delivery_end
    else:
        # Combined format: single column with range
        if time_format['pickup_window_col']:
            row[time_format['pickup_window_col']] = generate_time_window(
                base_time, pickup_offset, pickup_offset + 2, format_type='combined'
            )
        
        if time_format['delivery_window_col']:
            row[time_format['delivery_window_col']] = generate_time_window(
                base_time, delivery_offset, delivery_offset + 2, format_type='combined'
            )
    
    return row


def _add_duplicate_ids(df: pd.DataFrame, spec_cols: List[str]) -> pd.DataFrame:
    """
    Add a few duplicate order IDs to test auto-suffix logic.
    """
    if len(df) < 2:
        return df
    
    # Find the Order ID column
    order_col = None
    for col in spec_cols:
        col_lower = col.lower().replace(' ', '').replace('_', '')
        if 'order' in col_lower and 'id' in col_lower or col_lower in ['order', 'ordernumber']:
            order_col = col
            break
    
    if order_col and order_col in df.columns:
        # Duplicate the first 2 rows
        dup_rows = df.iloc[:2].copy()
        df = pd.concat([df, dup_rows], ignore_index=True)
    
    return df


def _add_bad_time_windows(df: pd.DataFrame, spec_cols: List[str], time_format: dict) -> pd.DataFrame:
    """
    Create some rows where end time < start time to test validation.
    """
    if len(df) < 2:
        return df
    
    # Swap start and end times for the last row
    if time_format['format'] == 'split':
        if time_format['delivery_start_col'] and time_format['delivery_end_col']:
            if time_format['delivery_start_col'] in df.columns and time_format['delivery_end_col'] in df.columns:
                last_idx = len(df) - 1
                start_val = df.at[last_idx, time_format['delivery_start_col']]
                end_val = df.at[last_idx, time_format['delivery_end_col']]
                df.at[last_idx, time_format['delivery_start_col']] = end_val
                df.at[last_idx, time_format['delivery_end_col']] = start_val
    
    return df


def _add_whitespace_variations(df: pd.DataFrame, spec_cols: List[str]) -> pd.DataFrame:
    """
    Add leading/trailing whitespace to some ID fields to test trimming logic.
    """
    if len(df) < 3:
        return df
    
    # Find ID columns
    id_columns = []
    for col in spec_cols:
        col_lower = col.lower()
        if 'id' in col_lower or 'reference' in col_lower or col_lower in ['order', 'pickup', 'dropoff']:
            id_columns.append(col)
    
    # Add whitespace to middle rows
    mid_idx = len(df) // 2
    for col in id_columns:
        if col in df.columns and pd.notna(df.at[mid_idx, col]):
            original = str(df.at[mid_idx, col])
            df.at[mid_idx, col] = add_whitespace_variation(original, 'both')
    
    return df

