#!/usr/bin/env python3
"""
Test Script for Multiple Verticals Handling
Demonstrates how the system now correctly handles multiple verticals
"""

def test_verticals_handling():
    """Test the multiple verticals handling logic"""
    print("=" * 80)
    print("  🧪 TESTING MULTIPLE VERTICALS HANDLING")
    print("=" * 80)
    
    # Valid verticals list
    valid_verticals = ['VERT-CUS', 'VERT-SPO', 'VERT-YO', 'VERT-IM-EX', 'VERT-SHIPPING-LINE', 'VERT-TRN']
    
    # Test cases
    test_cases = [
        "VERT-IM-EX, VERT-TRN, VERT-CUS",  # All valid - should be preserved
        "VERT-CUS, VERT-SPO, VERT-YO",     # All valid - should be preserved
        "VERT-IM-EX, INVALID-VERT, VERT-TRN",  # Mixed valid/invalid - should keep valid ones
        "INVALID-VERT1, INVALID-VERT2",    # All invalid - should default to VERT-TRN
        "VERT-TRN",                         # Single valid - should be preserved
        "invalid-vert",                     # Single invalid - should default to VERT-TRN
        "VERT-IM-EX",                       # Single valid - should be preserved
    ]
    
    print("📋 Valid verticals:", valid_verticals)
    print()
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"🧪 Test Case {i}: '{test_case}'")
        
        # Simulate the new logic
        if ',' in test_case:
            # Multiple verticals
            vertical_list = [v.strip() for v in test_case.split(',')]
            valid_verticals_found = []
            invalid_verticals_found = []
            
            for vertical in vertical_list:
                vertical = vertical.strip()
                if vertical in valid_verticals:
                    valid_verticals_found.append(vertical)
                else:
                    # Check for case-insensitive matches
                    normalized_input = vertical.upper().replace(' ', '').replace('-', '')
                    is_valid = False
                    for valid_vertical in valid_verticals:
                        normalized_valid = valid_vertical.upper().replace(' ', '').replace('-', '')
                        if normalized_input == normalized_valid:
                            valid_verticals_found.append(valid_vertical)
                            is_valid = True
                            break
                    if not is_valid:
                        invalid_verticals_found.append(vertical)
            
            if valid_verticals_found:
                result = ', '.join(valid_verticals_found)
                print(f"   ✅ Result: '{result}' (kept valid verticals)")
                if invalid_verticals_found:
                    print(f"   ⚠️  Removed invalid: {invalid_verticals_found}")
            else:
                result = 'VERT-TRN'
                print(f"   🔄 Result: '{result}' (default - no valid verticals found)")
                print(f"   ❌ All were invalid: {invalid_verticals_found}")
        else:
            # Single vertical
            if test_case in valid_verticals:
                result = test_case
                print(f"   ✅ Result: '{result}' (valid single vertical)")
            else:
                result = 'VERT-TRN'
                print(f"   🔄 Result: '{result}' (default - invalid vertical)")
        
        print()
    
    print("🎯 SUMMARY:")
    print("• Multiple valid verticals are now preserved")
    print("• Invalid verticals are removed, keeping valid ones")
    print("• If no valid verticals found, defaults to VERT-TRN")
    print("• Supports comma-separated lists like 'VERT-CUS, VERT-SPO, VERT-YO'")

if __name__ == "__main__":
    test_verticals_handling()
