from flask import Flask, render_template, request, send_file, jsonify, session
import pandas as pd
import os
from datetime import datetime
import tempfile
import io
import secrets

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)

# Configure upload and download folders
UPLOAD_FOLDER = 'uploads'
DOWNLOAD_FOLDER = 'downloads'
REPORTS_FOLDER = 'reports'

# Create necessary directories
for folder in [UPLOAD_FOLDER, DOWNLOAD_FOLDER, REPORTS_FOLDER]:
    if not os.path.exists(folder):
        os.makedirs(folder)

# Store processed data in session (for demo purposes)
# In production, you'd use a database or cache
processed_data_store = {}

class JobMasterProcessor:
    def __init__(self):
        self.column_mapping = {
            'Job ID': ['Job ID', 'job_id', 'JobID', 'ID'],
            'Job Name': ['Job Name', 'job_name', 'Job Title', 'Name'],
            'Job Date': ['Job Creation DateTime', 'job_date', 'creation_date', 'Job Date'],
            'GPS Executed': ['Distance: GPS', 'gps_distance', 'GPS Distance', 'Distance'],
            'Job Status': ['Status', 'job_status', 'Job Status'],
            'Start Time': ['Start Time: Actual', 'actual_start_time', 'Start Time'],
            'End Time': ['End Time: Actual', 'actual_end_time', 'End Time'],
            'Duration': ['Duration: Actual', 'actual_duration', 'Duration'],
            'Duration Variance': ['Duration: Variance', 'duration_variance', 'Variance'],
            'Job Count': ['Job Count', 'job_count', 'Jobs Count', 'Number of Jobs'],
            'Load Count': ['Load Count', 'load_count', 'Loads Count', 'Number of Loads'],
            'Payment Schedule Status': ['Payment Schedule Status', 'payment_schedule_status', 'Schedule Status'],
            'Payment Schedule Number': ['Payment Schedule Number', 'payment_schedule_number', 'Schedule Number'],
            'Cost Item': ['Cost Item', 'cost_item'],
            'Currency': ['Currency', 'currency', 'Currency Code'],
            'Cost Contract Amount': ['Cost Contract Amount', 'cost_contract_amount', 'Contract Cost'],
            'Sub Total Cost': ['Sub Total: Cost', 'subtotal_cost', 'Total Cost'],
            'Invoice Status': ['Invoice Status', 'invoice_status'],
            'Invoice Number': ['Invoice Number', 'invoice_number', 'Invoice No'],
            'Invoice Item': ['Invoice Item', 'invoice_item'],
            'Revenue Contract Amount': ['Revenue Contract Amount', 'revenue_contract_amount', 'Contract Revenue'],
            'Sub Total Revenue': ['Sub Total: Revenue', 'subtotal_revenue', 'Revenue'],
            'Vehicle': ['Vehicle', 'vehicle_id', 'Vehicle ID'],
            'Vehicle Type': ['Vehicle Type', 'vehicle_type'],
            'Driver Name': ['Driver Name', 'driver_name', 'Driver'],
            'Driver Phone': ['Driver Phone', 'driver_phone', 'Phone'],
            'Driver NIC': ['Driver NIC', 'driver_nic', 'NIC']
        }
    
    def find_column(self, df, possible_names):
        """Find the actual column name in the DataFrame that matches our mapping"""
        for name in possible_names:
            if name in df.columns:
                return name
        return None
    
    def process_excel_file(self, file_path):
        """Process uploaded Excel file and extract relevant data"""
        try:
            # Read Excel file
            df = pd.read_excel(file_path, sheet_name=0)
            
            # Create a mapped DataFrame with standardized column names
            mapped_data = {}
            column_found = {}
            
            for standard_name, possible_names in self.column_mapping.items():
                found_column = self.find_column(df, possible_names)
                if found_column:
                    mapped_data[standard_name] = df[found_column]
                    column_found[standard_name] = found_column
                else:
                    mapped_data[standard_name] = None
                    column_found[standard_name] = None
            
            processed_df = pd.DataFrame(mapped_data)
            
            # Clean and process data
            processed_df = self.clean_data(processed_df)
            
            return processed_df, column_found, df
            
        except Exception as e:
            print(f"Error processing Excel file: {str(e)}")
            return None, None, None
    
    def clean_data(self, df):
        """Clean and standardize the data"""
        # Remove rows where all values are NaN
        df = df.dropna(how='all')
        
        # Convert date columns
        if 'Job Date' in df.columns and df['Job Date'].notna().any():
            df['Job Date'] = pd.to_datetime(df['Job Date'], errors='coerce')
        
        # Convert time columns
        for col in ['Start Time', 'End Time']:
            if col in df.columns and df[col].notna().any():
                df[col] = pd.to_datetime(df[col], errors='coerce')
        
        # Convert numeric columns
        numeric_cols = ['GPS Executed', 'Duration', 'Duration Variance', 'Job Count', 'Load Count', 'Cost Contract Amount', 'Sub Total Cost', 'Revenue Contract Amount', 'Sub Total Revenue']
        for col in numeric_cols:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')
        
        return df
    
    def search_data(self, df, filters):
        """Search and filter data based on provided filters"""
        filtered_df = df.copy()
        
        # Job ID search
        if filters.get('job_id'):
            filtered_df = filtered_df[filtered_df['Job ID'].astype(str).str.contains(filters['job_id'], case=False, na=False)]
        
        # Job Name/Keyword search
        if filters.get('keyword'):
            mask = filtered_df.astype(str).apply(lambda x: x.str.contains(filters['keyword'], case=False, na=False)).any(axis=1)
            filtered_df = filtered_df[mask]
        
        # Job Status filter
        status_filter = filters.get('status')
        if status_filter and status_filter != 'all':
            mask = filtered_df['Job Status'] == status_filter
            filtered_df = filtered_df[mask]
        
        # Date range filter
        if filters.get('date_from') and 'Job Date' in filtered_df.columns:
            try:
                date_from = pd.to_datetime(filters['date_from'])
                filtered_df = filtered_df[filtered_df['Job Date'] >= date_from]
            except:
                pass
        
        if filters.get('date_to') and 'Job Date' in filtered_df.columns:
            try:
                date_to = pd.to_datetime(filters['date_to'])
                filtered_df = filtered_df[filtered_df['Job Date'] <= date_to]
            except:
                pass
        
        # Driver search
        if filters.get('driver'):
            filtered_df = filtered_df[filtered_df['Driver Name'].astype(str).str.contains(filters['driver'], case=False, na=False)]
        
        # Vehicle search
        if filters.get('vehicle'):
            filtered_df = filtered_df[filtered_df['Vehicle'].astype(str).str.contains(filters['vehicle'], case=False, na=False)]
        
        return filtered_df
    
    def generate_summary_stats(self, df):
        """Generate summary statistics"""
        summary_data = []
        
        # Basic counts
        summary_data.append({'Metric': 'Total Records', 'Value': len(df)})
        
        # Job and Load counts
        if 'Job ID' in df.columns:
            unique_jobs = df['Job ID'].dropna().nunique()
            summary_data.append({'Metric': 'Unique Jobs Count', 'Value': unique_jobs})
        
        if 'Load Count' in df.columns:
            total_loads = df['Load Count'].sum()
            if pd.notna(total_loads):
                summary_data.append({'Metric': 'Total Loads Count', 'Value': f"{total_loads:.0f}"})
        
        # Job Status distribution
        if 'Job Status' in df.columns:
            status_counts = df['Job Status'].value_counts()
            for status, count in status_counts.items():
                summary_data.append({'Metric': f'Jobs - {status}', 'Value': count})
        
        # Numeric summaries
        numeric_cols = ['GPS Executed', 'Duration', 'Job Count', 'Load Count', 'Cost Contract Amount', 'Sub Total Cost', 'Revenue Contract Amount', 'Sub Total Revenue']
        for col in numeric_cols:
            if col in df.columns:
                total = df[col].sum()
                avg = df[col].mean()
                if pd.notna(total) and pd.notna(avg):
                    summary_data.append({'Metric': f'{col} - Total', 'Value': f"{total:.2f}"})
                    summary_data.append({'Metric': f'{col} - Average', 'Value': f"{avg:.2f}"})
        
        return summary_data

    def generate_filename(self, base_name, filters=None, extension='.xlsx'):
        """Generate a meaningful filename based on search criteria"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        # Start with base name
        filename_parts = [base_name]
        
        # Add filter information if provided
        if filters:
            filter_parts = []
            if filters.get('job_id'):
                filter_parts.append(f"JobID-{filters['job_id']}")
            if filters.get('status') and filters['status'] != 'all':
                filter_parts.append(f"Status-{filters['status']}")
            if filters.get('keyword'):
                # Clean keyword for filename
                keyword = filters['keyword'].replace(' ', '-')[:10]
                filter_parts.append(f"Keyword-{keyword}")
            if filters.get('driver'):
                driver = filters['driver'].replace(' ', '-')[:10]
                filter_parts.append(f"Driver-{driver}")
            if filters.get('vehicle'):
                filter_parts.append(f"Vehicle-{filters['vehicle']}")
            if filters.get('date_from') or filters.get('date_to'):
                if filters.get('date_from') and filters.get('date_to'):
                    filter_parts.append(f"DateRange-{filters['date_from']}-to-{filters['date_to']}")
                elif filters.get('date_from'):
                    filter_parts.append(f"DateFrom-{filters['date_from']}")
                elif filters.get('date_to'):
                    filter_parts.append(f"DateTo-{filters['date_to']}")
            
            if filter_parts:
                filename_parts.extend(filter_parts)
        
        # Add timestamp
        filename_parts.append(timestamp)
        
        # Join parts and add extension
        filename = '_'.join(filename_parts) + extension
        
        # Clean filename (remove invalid characters)
        invalid_chars = '<>:"/\\|?*'
        for char in invalid_chars:
            filename = filename.replace(char, '-')
        
        return filename

processor = JobMasterProcessor()

@app.route('/')
def index():
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Job Master Data Processor</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background-color: #f5f5f5; }
            .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #2E86AB; text-align: center; }
            .upload-area { border: 2px dashed #ccc; padding: 40px; text-align: center; margin: 20px 0; border-radius: 5px; }
            .upload-area:hover { border-color: #2E86AB; }
            .search-section { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .search-title { font-size: 20px; font-weight: bold; color: #2E86AB; margin-bottom: 15px; }
            .search-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }
            .search-field { display: flex; flex-direction: column; }
            .search-field label { font-weight: bold; margin-bottom: 5px; color: #333; }
            .search-field input, .search-field select { padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
            .search-buttons { text-align: center; margin-top: 20px; }
            .search-buttons button { margin: 0 10px; }
            input[type="file"] { margin: 10px 0; }
            button { background-color: #2E86AB; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
            button:hover { background-color: #1f5f7f; }
            .btn-secondary { background-color: #6c757d; }
            .btn-secondary:hover { background-color: #5a6268; }
            .results { margin-top: 20px; padding: 20px; background-color: #f9f9f9; border-radius: 5px; }
            .error { color: red; }
            .success { color: green; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #2E86AB; color: white; }
            #dataTable { max-height: 400px; overflow-y: auto; }
            .hidden { display: none; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Job Master Data Processor</h1>
            
            <div class="upload-area">
                <h3>Upload Excel File</h3>
                <form action="/process" method="post" enctype="multipart/form-data">
                    <input type="file" name="file" accept=".xlsx,.xls" required>
                    <br><br>
                    <button type="submit">Process File</button>
                </form>
            </div>
            
            <div id="searchSection" class="search-section hidden">
                <div class="search-title">🔍 Search & Filter Data</div>
                <div class="search-grid">
                    <div class="search-field">
                        <label>Job ID:</label>
                        <input type="text" id="jobId" placeholder="Enter Job ID">
                    </div>
                    <div class="search-field">
                        <label>Keyword (Search All):</label>
                        <input type="text" id="keyword" placeholder="Enter keyword">
                    </div>
                    <div class="search-field">
                        <label>Job Status:</label>
                        <select id="status">
                            <option value="all">All Statuses</option>
                        </select>
                    </div>
                    <div class="search-field">
                        <label>Date From:</label>
                        <input type="date" id="dateFrom">
                    </div>
                    <div class="search-field">
                        <label>Date To:</label>
                        <input type="date" id="dateTo">
                    </div>
                    <div class="search-field">
                        <label>Driver Name:</label>
                        <input type="text" id="driver" placeholder="Enter driver name">
                    </div>
                    <div class="search-field">
                        <label>Vehicle:</label>
                        <input type="text" id="vehicle" placeholder="Enter vehicle">
                    </div>
                </div>
                <div class="search-buttons">
                    <button onclick="searchData()">Search</button>
                    <button onclick="clearSearch()" class="btn-secondary">Clear</button>
                    <button onclick="exportData()">Export Results</button>
                </div>
            </div>
            
            <div id="resultsSection" class="results hidden">
                <div id="summaryStats"></div>
                <div id="dataTable"></div>
            </div>
        </div>
        
        <script>
            let currentData = null;
            let filteredData = null;
            
            function showSearchSection() {
                document.getElementById('searchSection').classList.remove('hidden');
                document.getElementById('resultsSection').classList.remove('hidden');
            }
            
            function populateStatusOptions(data) {
                const statusSelect = document.getElementById('status');
                const statuses = [...new Set(data.map(row => row['Job Status']).filter(Boolean))];
                
                statusSelect.innerHTML = '<option value="all">All Statuses</option>';
                statuses.forEach(status => {
                    statusSelect.innerHTML += `<option value="${status}">${status}</option>`;
                });
            }
            
            function searchData() {
                if (!currentData) return;
                
                const filters = {
                    job_id: document.getElementById('jobId').value,
                    keyword: document.getElementById('keyword').value,
                    status: document.getElementById('status').value,
                    date_from: document.getElementById('dateFrom').value,
                    date_to: document.getElementById('dateTo').value,
                    driver: document.getElementById('driver').value,
                    vehicle: document.getElementById('vehicle').value
                };
                
                fetch('/search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(filters)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        alert('Error: ' + data.error);
                    } else {
                        filteredData = data.data;
                        displayResults(data.data, data.summary);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error searching data');
                });
            }
            
            function clearSearch() {
                document.getElementById('jobId').value = '';
                document.getElementById('keyword').value = '';
                document.getElementById('status').value = 'all';
                document.getElementById('dateFrom').value = '';
                document.getElementById('dateTo').value = '';
                document.getElementById('driver').value = '';
                document.getElementById('vehicle').value = '';
                
                if (currentData) {
                    filteredData = currentData;
                    displayResults(currentData, null);
                }
            }
            
            function displayResults(data, summary) {
                const resultsDiv = document.getElementById('resultsSection');
                let html = '';
                
                if (summary) {
                    html += '<div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin-bottom: 20px;">';
                    html += '<h3 style="color: #28a745; margin-bottom: 10px;">Search Results</h3>';
                    html += '<table><tr><th>Metric</th><th>Value</th></tr>';
                    summary.forEach(stat => {
                        html += `<tr><td>${stat.Metric}</td><td>${stat.Value}</td></tr>`;
                    });
                    html += '</table></div>';
                } else {
                    html += `<div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                        <h3 style="color: #28a745;">Results: ${data.length} records found</h3>
                    </div>`;
                }
                
                if (data.length > 0) {
                    html += '<div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">';
                    html += `<h3>Complete Data View (${data.length} records)</h3>`;
                    html += '<div style="max-height: 600px; overflow: auto; border: 1px solid #ddd;">';
                    html += '<table style="width: 100%; min-width: 1500px;"><tr>';
                    
                    // Add table headers for ALL columns
                    const columns = Object.keys(data[0]);
                    columns.forEach(col => {
                        html += `<th style="min-width: 120px; position: sticky; top: 0; background-color: #2E86AB; color: white; padding: 8px; text-align: left; border: 1px solid #ddd;">${col}</th>`;
                    });
                    html += '</tr>';
                    
                    // Add ALL data rows (not limited to 50)
                    data.forEach(row => {
                        html += '<tr>';
                        columns.forEach(col => {
                            let value = row[col] || '';
                            // Format dates nicely
                            if (value && typeof value === 'string' && value.includes('T')) {
                                try {
                                    const date = new Date(value);
                                    if (!isNaN(date.getTime())) {
                                        value = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
                                    }
                                } catch (e) {
                                    // Keep original value if date parsing fails
                                }
                            }
                            html += `<td style="padding: 6px; border: 1px solid #ddd; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;" title="${value}">${value}</td>`;
                        });
                        html += '</tr>';
                    });
                    
                    html += '</table></div>';
                    html += `<div style="margin-top: 10px; padding: 10px; background-color: #e9ecef; border-radius: 5px;">
                        <strong>Total Records:</strong> ${data.length} | 
                        <strong>Columns:</strong> ${columns.length} | 
                        <strong>Tip:</strong> Hover over cells to see full content. Use horizontal scroll to view all columns.
                    </div>`;
                    html += '</div>';
                }
                
                document.getElementById('resultsSection').innerHTML = html;
            }
            
            function exportData() {
                if (!filteredData) {
                    alert('No data to export');
                    return;
                }
                
                window.location.href = '/export';
            }
            
            // Handle form submission for file upload
            document.querySelector('form').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = new FormData(this);
                const submitBtn = this.querySelector('button');
                submitBtn.disabled = true;
                submitBtn.textContent = 'Processing...';
                
                fetch('/process', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        alert('Error: ' + data.error);
                    } else {
                        currentData = data.data;
                        filteredData = data.data;
                        showSearchSection();
                        populateStatusOptions(data.data);
                        displayResults(data.data, data.summary);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error processing file');
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Process File';
                });
            });
        </script>
    </body>
    </html>
    '''

@app.route('/process', methods=['POST'])
def process_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'})
    
    if file:
        try:
            # Save uploaded file
            filename = f"upload_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)
            
            # Process the file
            processed_df, column_mapping, original_df = processor.process_excel_file(file_path)
            
            if processed_df is not None:
                # Generate summary stats
                summary_stats = processor.generate_summary_stats(processed_df)
                
                # Store data in session for search functionality
                session_id = secrets.token_hex(16)
                session['data_id'] = session_id
                processed_data_store[session_id] = {
                    'data': processed_df,
                    'original': original_df,
                    'mapping': column_mapping,
                    'timestamp': datetime.now()
                }
                
                # Convert DataFrame to dict for JSON response
                data_dict = processed_df.to_dict('records')
                
                return jsonify({
                    'success': True,
                    'data': data_dict,
                    'summary': summary_stats,
                    'total_records': len(processed_df)
                })
            else:
                return jsonify({'error': 'Error processing file. Please check the file format.'})
                
        except Exception as e:
            return jsonify({'error': f'Error: {str(e)}'})

@app.route('/search', methods=['POST'])
def search():
    try:
        if 'data_id' not in session or session['data_id'] not in processed_data_store:
            return jsonify({'error': 'No data available. Please upload and process a file first.'})
        
        filters = request.json
        data_info = processed_data_store[session['data_id']]
        df = data_info['data']
        
        # Apply filters
        filtered_df = processor.search_data(df, filters)
        
        # Store current filters for filename generation
        data_info['current_filters'] = filters
        
        # Generate summary for filtered data
        summary_stats = processor.generate_summary_stats(filtered_df)
        
        # Convert to dict for JSON response
        data_dict = filtered_df.to_dict('records')
        
        return jsonify({
            'success': True,
            'data': data_dict,
            'summary': summary_stats,
            'total_records': len(filtered_df),
            'filters_applied': filters
        })
        
    except Exception as e:
        return jsonify({'error': f'Error searching data: {str(e)}'})

@app.route('/export')
def export_data():
    try:
        if 'data_id' not in session or session['data_id'] not in processed_data_store:
            return jsonify({'error': 'No data available for export'})
        
        data_info = processed_data_store[session['data_id']]
        df = data_info['data']
        current_filters = data_info.get('current_filters', {})
        
        # Generate meaningful filename
        output_filename = processor.generate_filename('JobMaster_SearchResults', current_filters)
        output_path = os.path.join(DOWNLOAD_FOLDER, output_filename)
        
        # Create excel file with multiple sheets
        with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
            df.to_excel(writer, sheet_name='Search Results', index=False)
            
            # Add summary sheet
            summary_stats = processor.generate_summary_stats(df)
            summary_df = pd.DataFrame(summary_stats)
            summary_df.to_excel(writer, sheet_name='Summary', index=False)
            
            # Add filter information sheet
            if current_filters:
                filter_info = []
                for key, value in current_filters.items():
                    if value:  # Only add non-empty filters
                        filter_info.append({'Filter': key.replace('_', ' ').title(), 'Value': value})
                
                if filter_info:
                    filter_df = pd.DataFrame(filter_info)
                    filter_df.to_excel(writer, sheet_name='Applied Filters', index=False)
        
        return send_file(output_path, as_attachment=True, download_name=output_filename)
        
    except Exception as e:
        return jsonify({'error': f'Error exporting data: {str(e)}'})

@app.route('/download/<filename>')
def download_file(filename):
    try:
        # Check in both upload and download folders
        file_path = None
        if os.path.exists(os.path.join(UPLOAD_FOLDER, filename)):
            file_path = os.path.join(UPLOAD_FOLDER, filename)
        elif os.path.exists(os.path.join(DOWNLOAD_FOLDER, filename)):
            file_path = os.path.join(DOWNLOAD_FOLDER, filename)
        
        if file_path:
            return send_file(file_path, as_attachment=True, download_name=filename)
        else:
            return f'File not found: {filename}'
    except Exception as e:
        return f'Error downloading file: {str(e)}'

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 