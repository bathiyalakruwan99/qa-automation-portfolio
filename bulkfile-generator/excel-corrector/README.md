# Excel File Corrector

🎉 **NEW WEB INTERFACE AVAILABLE!** 🎉

This tool corrects Excel files to match a specific format as required for bulk uploads. Now available with both web interface and command-line options!

## 📸 Screenshot

![Excel File Corrector GUI](screenshots/main-gui.png)

*Desktop GUI Interface - Automatically correct Excel files for bulk upload*

## 🖥️ Desktop GUI (Recommended)

The desktop GUI provides a user-friendly interface for correcting Excel files:

1. **Launch the desktop application:**
   ```bash
   py excel_corrector_gui.py
   ```
   Or simply:
   ```bash
   py launch_gui.py
   ```

2. **Use the interface:**
   - Select Excel file using "Browse..." button
   - Choose output directory (default: `Created new one/`)
   - Click "Process & Fix File" to correct the file
   - Click "Check Issues Only" to see what needs fixing
   - View and download correction reports

### Desktop GUI Features:
- ✅ **Easy File Selection** - Browse and select Excel files
- ✅ **Customizable Output** - Choose where to save corrected files
- ✅ **Multiple Processing Options** - Configure what to correct
- ✅ **Progress Tracking** - See real-time processing status
- ✅ **Detailed Reports** - View and download correction reports
- ✅ **Error Highlighting** - Visual indicators for issues

## 🌐 Web Interface (Recommended)

The easiest way to use the Excel corrector is through the web interface:

1. **Start the web application:**
   ```bash
   py app.py
   ```

2. **Open your browser and go to:**
   ```
   http://localhost:5000
   ```

3. **Upload your Excel file:**
   - Click or drag & drop your Excel file (.xlsx or .xls)
   - File will be processed automatically
   - Download the corrected file with name format: `original_name_corrected_file_YYYYMMDD_HHMMSS.xlsx`

### Web Interface Features:
- ✅ **Drag & Drop Upload** - Easy file uploading
- ✅ **Real-time Processing** - See progress as file is processed  
- ✅ **Automatic Naming** - Files named as: `original_corrected_file_timestamp`
- ✅ **Secure File Handling** - Files auto-cleanup after 1 hour
- ✅ **Mobile Responsive** - Works on desktop, tablet, and mobile
- ✅ **Progress Feedback** - Visual feedback during processing

## 📝 Corrections Applied

The tool applies the following corrections:

### 1. Organization Details
- **Status**: Set to `NON_BOI`
- **Verticals**: Set to `VERT-TRN`
- **Country**: Set to `Sri Lanka`
- **State**: Converts to proper Sri Lankan district format (e.g., "Gampaha" → "Gampaha District")

### 2. Divisions
- **Division Name**: Set to `Admin`
- **Purpose**: Set to `PPS-STG`

### 3. Human Resources
- **First Name/Last Name**: Fills empty fields with literal "First Name"/"Last Name"
- **Division**: Set to `Admin`
- **NIC**: Handles duplicates with "DUPLICATE+(n+1)+NIC" format, fills empty with "DUMMYNIC+00n+org_short_name"
- **Email**: Handles duplicates with "DUPLICATE+(n+1)+email" format, fills empty with "DUMMY00n@org_short_name.com"
- **Gender**: Standardizes to "Male" or "Female"

### 4. Vehicles
- **Division**: Set to `Admin`
- **Vehicle Type**: Set to `TRUCK`
- **Load Type**: Set to `LOADS`
- **Vehicle Category**: Formats as "(value)Ft"

### 5. Locations
- No data changes, only status updates

### 6. Global Changes
- All status fields changed to "Create"
- Adds "END" marker after last data column if not present

## 📋 Requirements

- Python 3.7 or higher
- pandas
- openpyxl
- flask (for web interface)
- werkzeug (for web interface)

## ⚙️ Installation

1. Install required packages:
   ```bash
   py -m pip install -r requirements.txt
   ```
   
   Or install manually:
   ```bash
   py -m pip install pandas openpyxl flask werkzeug
   ```

2. **Start using the tool:**
   - **Web Interface:** `py app.py` then open http://localhost:5000
   - **Command Line:** `py excel_corrector.py` or `py run_corrector.py`

## 💻 Command Line Usage (Alternative)

If you prefer command-line tools, you can still use the original scripts:

### Method 1: Default file processing
1. Place your input Excel file in the `givenFile/` directory
2. Run the script:
   ```bash
   py excel_corrector.py
   ```
3. The corrected file will be saved in the `Created new one/` directory with a timestamp

### Method 2: Custom file processing
1. Use the runner script with any file path:
   ```bash
   py run_corrector.py "path/to/your/file.xlsx"
   ```
2. Or run with default file:
   ```bash
   py run_corrector.py
   ```
3. The corrected file will be saved in the `Created new one/` directory with a timestamp

## 📂 File Structure

**Primary Working Files:**
- **`excel_corrector_gui.py`** ⭐ - Main full-featured GUI (recommended)
- **`launch_gui.py`** ⭐ - Launcher script (calls `excel_corrector_gui.py`)
- **`excel_corrector.py`** - Core correction engine

**Alternative/Development Files:**
- `excel_corrector_gui_delayed.py` - Alternative GUI with delayed imports (fixes hanging issues)
- `excel_corrector_gui_simple.py` - Simplified test version

**Recommendation:** Use `launch_gui.py` or `excel_corrector_gui.py` for the most complete and stable experience.

## Input File

The script expects the input file to be located at:
`givenFile/DIMO-Master File Template Madumali (2).xlsx`

## Output

The corrected file will be saved as:
`Created new one/Corrected_File_YYYYMMDD_HHMMSS.xlsx`

## Notes

- The script automatically detects sheet types based on sheet names
- All duplicate handling ensures no two entries have the same NIC or email
- Invalid email formats are automatically replaced with dummy emails
- Sri Lankan district names are automatically corrected based on a comprehensive mapping

---

## 🤖 Discord Ticket Summary Bot

**NEW FEATURE!** This project now includes a Discord bot for automatic ticket monitoring and summarization.

### Key Features:
- **Automatic Ticket Detection** - Monitors Discord channels for new tickets
- **Multilingual Support** - Handles both English and Sinhala content
- **OCR Text Extraction** - Extracts text from images using Tesseract OCR
- **Smart Categorization** - Auto-categorizes tickets (Bug Report, Feature Request, Support, etc.)
- **Priority Assessment** - Evaluates ticket priority based on content
- **Translation Support** - Provides English translations for Sinhala content

### Quick Start:
1. **Navigate to the Discord bot folder:**
   ```bash
   cd discord_bot
   ```

2. **Setup the bot:**
   ```bash
   python setup_discord_bot.py
   ```

3. **Start the bot:**
   ```bash
   start_discord_bot.bat
   ```

4. **Configure channels in Discord:**
   ```
   !add_ticket_channel #support
   ```

### For detailed Discord bot documentation, see: [discord_bot/README.md](discord_bot/README.md)

--- 