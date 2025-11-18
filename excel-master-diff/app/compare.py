"""
Core comparison logic for Excel files.
"""
import pandas as pd
from .utils import (
    SHEET_CONFIG, create_composite_key, find_duplicates, 
    values_equal, trim_string, is_empty, validate_headers
)


class ExcelComparator:
    def __init__(self):
        self.sheet_config = SHEET_CONFIG
        self.results = {}
    
    def compare_files(self, files_data, selected_sheets=None):
        """
        Compare exactly 2 Excel files sheet by sheet.
        
        Args:
            files_data: Dict of {file_name: {sheet_name: DataFrame}} (exactly 2 files)
            selected_sheets: List of sheet names to compare (None for all)
        
        Returns:
            Dict with comparison results
        """
        if selected_sheets is None:
            selected_sheets = list(self.sheet_config.keys())
        
        self.results = {
            'files': list(files_data.keys()),
            'reference_file': list(files_data.keys())[0] if files_data else None,
            'timestamp': pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S"),
            'sheets': {}
        }
        
        for sheet_name in selected_sheets:
            if sheet_name not in self.sheet_config:
                continue
                
            sheet_results = self._compare_sheet(files_data, sheet_name)
            self.results['sheets'][sheet_name] = sheet_results
        
        return self.results
    
    def _compare_sheet(self, files_data, sheet_name):
        """Compare a single sheet across all files."""
        config = self.sheet_config[sheet_name]
        key_columns = config['key_columns']
        
        sheet_results = {
            'sheet_name': sheet_name,
            'display_name': config['display_name'],
            'key_columns': key_columns,
            'file_presence': {},
            'header_validation': {},
            'duplicates': {},
            'row_analysis': {},
            'comparison_details': {}
        }
        
        # Check sheet presence in each file
        for file_name, file_sheets in files_data.items():
            sheet_results['file_presence'][file_name] = sheet_name in file_sheets
        
        # Get reference file for header validation
        reference_file = self.results['reference_file']
        reference_headers = []
        
        if reference_file and sheet_name in files_data[reference_file]:
            reference_headers = list(files_data[reference_file][sheet_name].columns)
        
        # Validate headers and find duplicates for each file
        for file_name, file_sheets in files_data.items():
            if sheet_name not in file_sheets:
                sheet_results['header_validation'][file_name] = "SHEET_NOT_FOUND"
                sheet_results['duplicates'][file_name] = []
                continue
            
            df = file_sheets[sheet_name]
            
            # Validate headers
            if reference_headers:
                is_valid, message = validate_headers(df, reference_headers, sheet_name, file_name)
                sheet_results['header_validation'][file_name] = message
            else:
                sheet_results['header_validation'][file_name] = "NO_REFERENCE"
            
            # Find duplicates
            duplicates = find_duplicates(df, key_columns)
            sheet_results['duplicates'][file_name] = list(duplicates)
        
        # Analyze rows for 2 files
        sheet_results['row_analysis'] = self._analyze_two_files(
            files_data, sheet_name, key_columns
        )
        
        return sheet_results
    
    def _analyze_two_files(self, files_data, sheet_name, key_columns):
        """Analyze rows for exactly two files."""
        file_names = list(files_data.keys())
        file_a, file_b = file_names[0], file_names[1]
        
        # Get dataframes
        df_a = files_data[file_a].get(sheet_name, pd.DataFrame())
        df_b = files_data[file_b].get(sheet_name, pd.DataFrame())
        
        # Create key mappings
        keys_a = self._create_key_mapping(df_a, key_columns)
        keys_b = self._create_key_mapping(df_b, key_columns)
        
        all_keys = set(keys_a.keys()) | set(keys_b.keys())
        
        analysis = {
            'total_keys': len(all_keys),
            'keys_in_both': len(set(keys_a.keys()) & set(keys_b.keys())),
            'keys_only_in_a': len(set(keys_a.keys()) - set(keys_b.keys())),
            'keys_only_in_b': len(set(keys_b.keys()) - set(keys_a.keys())),
            'changed_keys': [],
            'a_only_keys': list(set(keys_a.keys()) - set(keys_b.keys())),
            'b_only_keys': list(set(keys_b.keys()) - set(keys_a.keys()))
        }
        
        # Find changed keys
        for key in set(keys_a.keys()) & set(keys_b.keys()):
            row_a = keys_a[key]
            row_b = keys_b[key]
            
            changes = self._find_row_changes(row_a, row_b, key_columns)
            if changes:
                analysis['changed_keys'].append({
                    'key': key,
                    'changes': changes
                })
        
        return analysis
    
    
    def _create_key_mapping(self, df, key_columns):
        """Create mapping from composite key to row data."""
        if df.empty:
            return {}
        
        mapping = {}
        for _, row in df.iterrows():
            key = create_composite_key(row, key_columns)
            if key is not None:
                mapping[key] = row.to_dict()
        
        return mapping
    
    def _find_row_changes(self, row_a, row_b, key_columns):
        """Find changes between two rows."""
        changes = []
        
        # Get all columns from both rows
        all_columns = set(row_a.keys()) | set(row_b.keys())
        
        for col in all_columns:
            if col in key_columns:
                continue  # Skip key columns
            
            val_a = row_a.get(col)
            val_b = row_b.get(col)
            
            if not values_equal(val_a, val_b):
                changes.append({
                    'column': col,
                    'value_a': val_a,
                    'value_b': val_b
                })
        
        return changes
    
    def generate_comparison_dataframe(self, files_data, sheet_name):
        """Generate comparison dataframe for Excel export (2 files only) with full column duplication."""
        file_names = list(files_data.keys())
        if len(file_names) != 2:
            return pd.DataFrame()
        
        file_a, file_b = file_names[0], file_names[1]
        config = self.sheet_config[sheet_name]
        key_columns = config['key_columns']
        
        df_a = files_data[file_a].get(sheet_name, pd.DataFrame())
        df_b = files_data[file_b].get(sheet_name, pd.DataFrame())
        
        if df_a.empty and df_b.empty:
            return pd.DataFrame()
        
        # Get all unique columns from both files
        all_columns = set()
        if not df_a.empty:
            all_columns.update(df_a.columns)
        if not df_b.empty:
            all_columns.update(df_b.columns)
        
        # Include all columns (no exclusions)
        
        # Create key mappings
        keys_a = self._create_key_mapping(df_a, key_columns)
        keys_b = self._create_key_mapping(df_b, key_columns)
        
        all_keys = set(keys_a.keys()) | set(keys_b.keys())
        
        # Build comparison dataframe
        comparison_rows = []
        
        for key in all_keys:
            row_a = keys_a.get(key, {})
            row_b = keys_b.get(key, {})
            
            # Determine status
            if key in keys_a and key in keys_b:
                changes = self._find_row_changes(row_a, row_b, key_columns)
                status = "CHANGED" if changes else "SAME"
            elif key in keys_a:
                status = "A-ONLY"
            else:
                status = "B-ONLY"
            
            # Build row data with ALL columns duplicated (excluding Organization Name)
            row_data = {}
            
            # Add ALL columns with 1st file and 2nd file suffixes
            for col in sorted(all_columns):
                row_data[f"{col} 1st file"] = row_a.get(col) if row_a else None
                row_data[f"{col} 2nd file"] = row_b.get(col) if row_b else None
            
            # Add status column
            row_data["Status"] = status
            
            comparison_rows.append(row_data)
        
        return pd.DataFrame(comparison_rows)
