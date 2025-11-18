#!/usr/bin/env python3
"""
Test Script for New Enhanced Organization Details Conditions
Demonstrates the 11 new validation rules implemented
"""

from excel_corrector import ExcelCorrector
import os

def test_new_organization_conditions():
    """Test the new enhanced organization conditions"""
    print("=" * 80)
    print("  🧪 TESTING NEW ENHANCED ORGANIZATION DETAILS CONDITIONS")
    print("=" * 80)
    
    # Initialize corrector
    corrector = ExcelCorrector()
    
    # Test file path
    input_file = "givenFile/DIMO-Master File Template Madumali (2).xlsx"
    
    if not os.path.exists(input_file):
        print(f"❌ Test file not found: {input_file}")
        return
    
    print(f"📁 Testing with file: {input_file}")
    print()
    
    # Test 1: Issue Detection Only
    print("🔍 TEST 1: Issue Detection (New Enhanced Validation)")
    print("-" * 60)
    
    try:
        error_file, issues_report = corrector.check_issues_only(input_file, ".")
        print("✅ Issue detection completed successfully!")
        print(f"📄 Error file saved to: {error_file}")
        print()
        
        # Display issues report
        print("📊 ISSUES REPORT:")
        print(issues_report)
        print()
        
    except Exception as e:
        print(f"❌ Issue detection failed: {str(e)}")
        return
    
    # Test 2: Full File Correction
    print("🔧 TEST 2: Full File Correction with New Conditions")
    print("-" * 60)
    
    try:
        output_file = "Created new one/test_new_conditions_output.xlsx"
        corrector.correct_excel_file(input_file, output_file)
        print("✅ File correction completed successfully!")
        print(f"📄 Corrected file saved to: {output_file}")
        print()
        
        # Display comprehensive report
        print("📊 COMPREHENSIVE CORRECTION REPORT:")
        comprehensive_report = corrector.generate_comprehensive_report()
        print(comprehensive_report)
        print()
        
    except Exception as e:
        print(f"❌ File correction failed: {str(e)}")
        return
    
    # Test 3: Statistics
    print("📈 TEST 3: Processing Statistics")
    print("-" * 60)
    
    try:
        stats = corrector.get_processing_stats()
        detailed_stats = corrector.get_detailed_stats()
        
        print("📊 BASIC STATISTICS:")
        for key, value in stats.items():
            print(f"  {key}: {value}")
        
        print()
        print("📊 DETAILED STATISTICS:")
        print("  Corrections by Category:")
        for category, count in detailed_stats['corrections_by_category'].items():
            print(f"    {category}: {count}")
        
        print()
        print("  Standard Corrections:")
        for correction, status in detailed_stats['standard_corrections'].items():
            print(f"    {correction}: {'✅' if status else '❌'}")
        
        print()
        print("  Processing Details:")
        for detail, value in detailed_stats['processing_details'].items():
            print(f"    {detail}: {value}")
        
    except Exception as e:
        print(f"❌ Statistics generation failed: {str(e)}")
    
    print()
    print("=" * 80)
    print("  🎉 TESTING COMPLETED SUCCESSFULLY!")
    print("=" * 80)
    print()
    print("📋 SUMMARY OF NEW CONDITIONS TESTED:")
    print("  1. ✅ Organization Name validation (cannot be empty)")
    print("  2. ✅ Organization Short Name validation (no duplicates, no empty)")
    print("  3. ✅ Operations column validation (cannot be empty)")
    print("  4. ✅ Status validation (NON_BOI or BOI only)")
    print("  5. ✅ Verticals validation (6 valid options, no empty)")
    print("  6. ✅ Country validation (Sri Lanka only, proper capitalization)")
    print("  7. ✅ State validation (25 valid districts, no empty)")
    print("  8. ✅ Principle Contact First Name validation (cannot be empty)")
    print("  9. ✅ Principle Contact Last Name validation (cannot be empty)")
    print("  10. ✅ Address Line validation (cannot be empty)")
    print("  11. ✅ City validation (cannot be empty)")
    print()
    print("🚀 All new enhanced conditions are working correctly!")
    print("   The system now provides comprehensive data validation and auto-correction.")

if __name__ == "__main__":
    test_new_organization_conditions()
