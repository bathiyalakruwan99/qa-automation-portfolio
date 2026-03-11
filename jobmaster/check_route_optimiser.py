import pandas as pd
import sys
import os

import config

# Use config default or first argument
input_file = sys.argv[1] if len(sys.argv) > 1 else config.DEFAULT_INPUT_FILE
if not os.path.exists(input_file):
    print(f"Error: File not found: {input_file}")
    sys.exit(1)

df = pd.read_excel(input_file)

print('=== Route Optimiser Analysis ===')
print(f'Total records: {len(df)}')

# Check FTL-DOMESTIC
ftl_dom = df[df['Trip Type'] == 'FTL-DOMESTIC']
print(f'\nFTL-DOMESTIC records: {len(ftl_dom)}')
route_opt_col = 'Count: Load and Route Optimiser'
ftl_dom_with_route = ftl_dom[ftl_dom[route_opt_col].notna()]
print(f'FTL-DOMESTIC with Route Optimiser: {len(ftl_dom_with_route)}')

# Check all records with Route Optimiser
route_opt_all = df[df[route_opt_col].notna()]
print(f'\nAll records with Route Optimiser: {len(route_opt_all)}')
print(f'\nTrip Types of records with Route Optimiser:')
print(route_opt_all['Trip Type'].value_counts())

print(f'\n=== Records with Route Optimiser ===')
print(route_opt_all[['Job ID', 'Load ID', 'Trip Type', 'Planned Stops: Qty', route_opt_col]])

