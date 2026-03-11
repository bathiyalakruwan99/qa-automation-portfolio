import pandas as pd
import math
import sys
import os

import config

# Use config default or first argument
input_file = sys.argv[1] if len(sys.argv) > 1 else config.DEFAULT_INPUT_FILE
if not os.path.exists(input_file):
    print(f"Error: File not found: {input_file}")
    sys.exit(1)

df = pd.read_excel(input_file)

print('=== FTL-DOMESTIC Route Optimiser (ftldis-op) Logic Test ===\n')

# Check for Route Optimiser column
route_opt_col = 'Count: Load and Route Optimiser'
has_route_opt = route_opt_col in df.columns

# Exclude records with Route Optimiser values from non-FTL counting
if has_route_opt:
    route_opt_records = df[df[route_opt_col].notna()]
    print(f'Records with Route Optimiser values: {len(route_opt_records)}')
    non_route_opt_df = df[df[route_opt_col].isna()]
else:
    non_route_opt_df = df

# Separate data
ftl_data = non_route_opt_df[non_route_opt_df['Trip Type'] == 'FTL-DISTRIBUTION'].copy()
non_ftl_data = non_route_opt_df[non_route_opt_df['Trip Type'] != 'FTL-DISTRIBUTION'].copy()

# Get FTL-DOMESTIC records with Route Optimiser values (ftldis-op)
if has_route_opt:
    ftldis_op_data = df[(df['Trip Type'] == 'FTL-DOMESTIC') & (df[route_opt_col].notna())].copy()
    print(f'FTL-DOMESTIC with Route Optimiser (ftldis-op): {len(ftldis_op_data)} records\n')
else:
    ftldis_op_data = pd.DataFrame()

# Count non-FTL loads (excluding Route Optimiser records)
if 'Load ID' in non_ftl_data.columns:
    load_ids = non_ftl_data['Load ID'].astype(str).str.strip()
    load_ids = load_ids[load_ids.ne('') & load_ids.ne('nan')]
    total_loads = load_ids.nunique()
    print(f'Non FTL-DISTRIBUTION loads (excluding Route Optimiser): {total_loads}')
else:
    total_loads = 0

# Count FTL-DISTRIBUTION loads
ftl_current = 0.0
ftl_8x = 0.0
ftl_10x = 0.0

if not ftl_data.empty and 'Planned Stops: Qty' in ftl_data.columns:
    for _, row in ftl_data.iterrows():
        has_load_id = False
        if 'Load ID' in row:
            load_id_str = str(row['Load ID']).strip()
            has_load_id = load_id_str != '' and load_id_str.lower() != 'nan'
        
        if has_load_id and pd.notna(row['Planned Stops: Qty']):
            stops_qty = int(row['Planned Stops: Qty'])
            
            # Current prorated
            if stops_qty <= 8:
                loads_current = 1.0
            else:
                base_loads = stops_qty // 8
                remaining = stops_qty % 8
                if remaining == 0:
                    loads_current = float(base_loads)
                else:
                    loads_current = base_loads + (remaining / 8)
            
            loads_8x = math.ceil(stops_qty / 8)
            loads_10x = math.ceil(stops_qty / 10)
            
            ftl_current += loads_current
            ftl_8x += loads_8x
            ftl_10x += loads_10x

print(f'\nFTL-DISTRIBUTION loads:')
print(f'  Current (Prorated): {ftl_current:.3f}')
print(f'  8x Logic: {ftl_8x:.0f}')
print(f'  10x Logic: {ftl_10x:.0f}')

# Count FTL-DOMESTIC Route Optimiser (ftldis-op)
ftldis_op_current = 0.0
ftldis_op_8x = 0.0
ftldis_op_10x = 0.0

if not ftldis_op_data.empty and has_route_opt:
    print(f'\nFTL-DOMESTIC Route Optimiser (ftldis-op) records:')
    for _, row in ftldis_op_data.iterrows():
        if pd.notna(row[route_opt_col]):
            route_opt_value = float(row[route_opt_col])
            print(f'  Job: {row["Job ID"]}, Route Optimiser Value: {route_opt_value}')
            
            # Apply the same three counting logics
            if route_opt_value <= 8:
                loads_current = 1.0
            else:
                base_loads = route_opt_value // 8
                remaining = route_opt_value % 8
                if remaining == 0:
                    loads_current = float(base_loads)
                else:
                    loads_current = base_loads + (remaining / 8)
            
            loads_8x = math.ceil(route_opt_value / 8)
            loads_10x = math.ceil(route_opt_value / 10)
            
            ftldis_op_current += loads_current
            ftldis_op_8x += loads_8x
            ftldis_op_10x += loads_10x
    
    print(f'\nFTL-DOMESTIC Route Optimiser (ftldis-op) loads:')
    print(f'  Current (Prorated): {ftldis_op_current:.3f}')
    print(f'  8x Logic: {ftldis_op_8x:.0f}')
    print(f'  10x Logic: {ftldis_op_10x:.0f}')
else:
    print(f'\nFTL-DOMESTIC Route Optimiser (ftldis-op): No records found')

# Calculate totals
print(f'\n=== TOTAL LOADS ===')
print(f'Non FTL-DISTRIBUTION: {total_loads}')
print(f'FTL-DISTRIBUTION Current: {ftl_current:.3f}')
print(f'FTL-DISTRIBUTION 8x: {ftl_8x:.0f}')
print(f'FTL-DISTRIBUTION 10x: {ftl_10x:.0f}')
if ftldis_op_current > 0:
    print(f'FTL-DOMESTIC Route Optimiser (ftldis-op) Current: {ftldis_op_current:.3f}')
    print(f'FTL-DOMESTIC Route Optimiser (ftldis-op) 8x: {ftldis_op_8x:.0f}')
    print(f'FTL-DOMESTIC Route Optimiser (ftldis-op) 10x: {ftldis_op_10x:.0f}')

print(f'\nTotal Current: {total_loads + ftl_current + ftldis_op_current:.3f}')
print(f'Total 8x: {total_loads + ftl_8x + ftldis_op_8x:.0f}')
print(f'Total 10x: {total_loads + ftl_10x + ftldis_op_10x:.0f}')

