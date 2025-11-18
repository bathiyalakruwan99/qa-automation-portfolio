"""
Markdown report generation for Excel comparison results.
"""
import os
from datetime import datetime


def generate_markdown_report(results, output_dir="reports"):
    """Generate comprehensive markdown report from comparison results."""
    os.makedirs(output_dir, exist_ok=True)
    
    timestamp = results.get('timestamp', datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    filename = f"diff_{timestamp.replace(':', '').replace(' ', '_').replace('-', '')}.md"
    filepath = os.path.join(output_dir, filename)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(f"# Excel Comparison Report\n\n")
        f.write(f"**Generated:** {timestamp}\n\n")
        
        # Global summary
        f.write("## Global Summary\n\n")
        f.write(f"**Files compared:** {len(results['files'])}\n")
        f.write(f"**Reference file (A):** {results['reference_file']}\n\n")
        
        f.write("**Selected files:**\n")
        for i, file_name in enumerate(results['files'], 1):
            label = "A (Reference)" if i == 1 else chr(64 + i)
            f.write(f"- {label}: {file_name}\n")
        f.write("\n")
        
        # Per-sheet analysis
        f.write("## Sheet-by-Sheet Analysis\n\n")
        
        for sheet_name, sheet_data in results['sheets'].items():
            f.write(f"### {sheet_data['display_name']} ({sheet_name})\n\n")
            
            # Sheet presence
            f.write("**Sheet Presence:**\n")
            for file_name in results['files']:
                present = sheet_data['file_presence'].get(file_name, False)
                status = "✓ Yes" if present else "✗ No"
                f.write(f"- {file_name}: {status}\n")
            f.write("\n")
            
            # Header validation
            f.write("**Header Order Validation:**\n")
            for file_name in results['files']:
                validation = sheet_data['header_validation'].get(file_name, "UNKNOWN")
                if validation == "OK":
                    f.write(f"- {file_name}: ✓ OK\n")
                elif validation == "SHEET_NOT_FOUND":
                    f.write(f"- {file_name}: ✗ Sheet not found\n")
                elif validation == "NO_REFERENCE":
                    f.write(f"- {file_name}: ⚠ No reference available\n")
                else:
                    f.write(f"- {file_name}: ⚠ {validation}\n")
            f.write("\n")
            
            # Duplicates
            f.write("**Duplicate Keys:**\n")
            for file_name in results['files']:
                duplicates = sheet_data['duplicates'].get(file_name, [])
                if duplicates:
                    f.write(f"- {file_name}: {len(duplicates)} duplicates found\n")
                    for dup in duplicates[:5]:  # Show first 5
                        f.write(f"  - {dup}\n")
                    if len(duplicates) > 5:
                        f.write(f"  - ... and {len(duplicates) - 5} more\n")
                else:
                    f.write(f"- {file_name}: ✓ No duplicates\n")
            f.write("\n")
            
            # Row analysis
            row_analysis = sheet_data['row_analysis']
            
            if len(results['files']) == 2:
                f.write("**Two-File Row Analysis:**\n")
                f.write(f"- Total unique keys: {row_analysis['total_keys']}\n")
                f.write(f"- Keys in both files: {row_analysis['keys_in_both']}\n")
                f.write(f"- Keys only in File A: {row_analysis['keys_only_in_a']}\n")
                f.write(f"- Keys only in File B: {row_analysis['keys_only_in_b']}\n")
                f.write(f"- Keys with changes: {len(row_analysis['changed_keys'])}\n\n")
                
                # Changed values details
                if row_analysis['changed_keys']:
                    f.write("**Changed Values:**\n")
                    f.write("| Key | Column | File A Value | File B Value |\n")
                    f.write("|-----|--------|--------------|--------------|\n")
                    
                    for change_info in row_analysis['changed_keys'][:10]:  # Limit to 10
                        key_str = str(change_info['key'])
                        for change in change_info['changes']:
                            f.write(f"| {key_str} | {change['column']} | {change['value_a']} | {change['value_b']} |\n")
                    
                    if len(row_analysis['changed_keys']) > 10:
                        f.write(f"| ... | ... | ... | ... |\n")
                        f.write(f"| *{len(row_analysis['changed_keys']) - 10} more changes* | | | |\n")
                    f.write("\n")
                
                # A-only and B-only keys
                if row_analysis['a_only_keys']:
                    f.write("**Keys only in File A:**\n")
                    for key in row_analysis['a_only_keys'][:10]:
                        f.write(f"- {key}\n")
                    if len(row_analysis['a_only_keys']) > 10:
                        f.write(f"- ... and {len(row_analysis['a_only_keys']) - 10} more\n")
                    f.write("\n")
                
                if row_analysis['b_only_keys']:
                    f.write("**Keys only in File B:**\n")
                    for key in row_analysis['b_only_keys'][:10]:
                        f.write(f"- {key}\n")
                    if len(row_analysis['b_only_keys']) > 10:
                        f.write(f"- ... and {len(row_analysis['b_only_keys']) - 10} more\n")
                    f.write("\n")
            
            else:
                f.write("**Multi-File Row Analysis:**\n")
                f.write(f"- Total unique keys: {row_analysis['total_keys']}\n")
                f.write(f"- Keys present in all files: {row_analysis['keys_present_in_all']}\n\n")
                
                f.write("**Key counts per file:**\n")
                for file_name, count in row_analysis['file_key_counts'].items():
                    f.write(f"- {file_name}: {count} keys\n")
                f.write("\n")
                
                # Presence matrix (sample)
                f.write("**Key Presence Matrix (sample):**\n")
                f.write("| Key | " + " | ".join(results['files']) + " |\n")
                f.write("|-----|" + "|".join(["-----"] * len(results['files'])) + "|\n")
                
                sample_keys = list(row_analysis['key_presence_matrix'].keys())[:10]
                for key in sample_keys:
                    presence = row_analysis['key_presence_matrix'][key]
                    row = f"| {key} |"
                    for file_name in results['files']:
                        status = "✓" if presence.get(file_name, False) else "✗"
                        row += f" {status} |"
                    f.write(row + "\n")
                
                if len(row_analysis['key_presence_matrix']) > 10:
                    f.write(f"| ... | " + " | ".join(["..."] * len(results['files'])) + " |\n")
                f.write("\n")
            
            f.write("---\n\n")
        
        # Summary
        f.write("## Summary\n\n")
        f.write("This report shows the detailed comparison results between the selected Excel files.\n")
        f.write("Key findings:\n")
        f.write("- ✓ indicates successful validation or no issues found\n")
        f.write("- ✗ indicates missing data or validation failures\n")
        f.write("- ⚠ indicates warnings or mismatches that should be reviewed\n\n")
        
        if len(results['files']) == 2:
            f.write("For detailed cell-by-cell comparison with color coding, see the exported Excel file.\n")
            f.write("- Blue cells: Data only in File A\n")
            f.write("- Green cells: Data only in File B\n")
            f.write("- Red cells: Changed values between files\n")
    
    return filepath
