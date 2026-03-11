# Job Master Data Processor

A comprehensive application for processing Job Master Excel files with both web and desktop interfaces. This tool extracts and processes job data according to specific validation requirements, providing search, filtering, and export capabilities.

## Features

### 📋 Data Extraction & Validation
- **Job ID** and **Job Date** processing
- **GPS Executed** distance data extraction
- **Job Status** tracking (Completed/In-Progress)
- **Actual Start and End Times** processing
- **Duration & Delays** calculation
- **Invoice Fields** (Status, Number, Items, Revenue)
- **Vehicle Traceability** (Vehicle, Type, Driver details)

### 🚀 Key Capabilities
- **File Upload**: Support for Excel files (.xlsx, .xls)
- **Automatic Column Mapping**: Intelligent mapping of Excel columns to required fields
- **Search & Filter**: Find jobs by ID, name, or keywords
- **Interactive Data Tables**: View and analyze data with customizable columns
- **Export Options**: Generate Excel and PDF reports
- **Job-wise Export**: Export individual job data separately
- **Summary Statistics**: Automated metrics and analytics
- **Dual Interface**: Both web UI and desktop application

## Installation

### Prerequisites
- Python 3.8 or higher
- pip package manager

### Quick Setup

1. **Clone or Download** the project files to your local machine.

2. **Install Dependencies**:
```bash
pip install -r requirements.txt
```

3. **Alternative Installation** (using setup.py):
```bash
pip install -e .
```

### Dependencies
- `streamlit>=1.28.0` - Web interface framework
- `pandas>=2.0.0` - Data processing and analysis
- `openpyxl>=3.1.0` - Excel file handling
- `reportlab>=4.0.0` - PDF generation
- `Pillow>=10.0.0` - Image processing support

## Usage

### Web Application (Recommended)

1. **Start the Web Application**:
```bash
streamlit run app.py
```

2. **Open in Browser**: The application will automatically open in your default web browser at `http://localhost:8501`

3. **Using the Web Interface**:
   - **Upload File**: Use the sidebar to upload your Excel file
   - **Process Data**: Click "Process File" to extract and map data
   - **Search & Filter**: Use the search options to find specific jobs
   - **View Data**: Interactive table with customizable columns
   - **Export Reports**: Download Excel or PDF reports
   - **Job-wise Export**: Export individual job data

### Desktop Application

1. **Start the Desktop Application**:
```bash
python desktop_app.py
```

2. **Using the Desktop Interface**:
   - **Select File**: Click "Select Excel File" to choose your file
   - **Process**: Click "Process File" to extract data
   - **Search**: Use the search fields to filter data
   - **Export**: Use the export buttons for reports
   - **Job Export**: Select specific jobs for individual export

## Column Mapping

The application automatically maps your Excel columns to the required fields:

| Required Field | Possible Excel Column Names |
|---|---|
| Job ID | Job ID, job_id, JobID, ID |
| Job Date | Job Creation DateTime, job_date, creation_date, Job Date |
| GPS Executed | Distance: GPS, gps_distance, GPS Distance, Distance |
| Job Status | Status, job_status, Job Status |
| Start Time | Start Time: Actual, actual_start_time, Start Time |
| End Time | End Time: Actual, actual_end_time, End Time |
| Duration | Duration: Actual, actual_duration, Duration |
| Duration Variance | Duration: Variance, duration_variance, Variance |
| Invoice Status | Invoice Status, invoice_status |
| Invoice Number | Invoice Number, invoice_number, Invoice No |
| Invoice Item | Invoice Item, invoice_item |
| Sub Total Revenue | Sub Total: Revenue, subtotal_revenue, Revenue |
| Vehicle | Vehicle, vehicle_id, Vehicle ID |
| Vehicle Type | Vehicle Type, vehicle_type |
| Driver Name | Driver Name, driver_name, Driver |
| Driver Phone | Driver Phone, driver_phone, Phone |
| Driver NIC | Driver NIC, driver_nic, NIC |

## File Structure

```
jobmaster/
├── app.py              # Web application (Streamlit)
├── desktop_app.py      # Desktop application (tkinter)
├── requirements.txt    # Python dependencies
├── setup.py           # Installation script
├── README.md          # This file
├── file/              # Directory for sample files
│   └── job-master (9).xlsx
└── report/            # Directory for generated reports
```

## Sample Data

The application includes a sample Excel file (`job-master (9).xlsx`) in the `file/` directory. You can use this to test the application features.

## Export Options

### Excel Reports
- **Full Data Export**: All processed data with summary statistics
- **Job-wise Export**: Individual job data
- **Multiple Sheets**: Data and summary in separate worksheets

### PDF Reports
- **Formatted Reports**: Professional layout with headers and styling
- **Summary Statistics**: Key metrics and analytics
- **Data Tables**: First 50 records (to manage file size)
- **Job-specific Reports**: Individual job PDF exports

## Troubleshooting

### Common Issues

1. **Import Errors**:
   - Ensure all dependencies are installed: `pip install -r requirements.txt`
   - Check Python version: `python --version` (should be 3.8+)

2. **File Upload Issues**:
   - Verify file format is .xlsx or .xls
   - Check file permissions
   - Ensure file is not corrupted

3. **Column Mapping Issues**:
   - Check the column mapping information in the application
   - Verify Excel column names match expected patterns
   - Review the mapping table above

4. **Export Problems**:
   - Ensure write permissions in the target directory
   - Check available disk space
   - Verify file path is valid

### Performance Tips

1. **Large Files**: For Excel files with many rows, consider:
   - Using column selection to display only needed fields
   - Filtering data before export
   - Using Excel export instead of PDF for large datasets

2. **Memory Usage**: The desktop application loads data into memory:
   - Close other applications if processing large files
   - Use filtering to reduce data size for better performance

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the column mapping requirements
3. Verify your Excel file format and structure
4. Check the application logs for error messages

## License

This project is provided as-is for educational and business use. Modify and adapt as needed for your specific requirements.

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Compatibility**: Windows, macOS, Linux  
**Python Version**: 3.8+ 