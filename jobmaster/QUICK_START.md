# Quick Start Guide

## 🚀 Get Started in 2 Minutes

### For Windows Users (Easiest Method)
1. **Try first**: Double-click `run_web_app_alt.bat` or `run_desktop_app_alt.bat` (these try multiple Python commands)
2. **If that fails**: Install Python first (see `INSTALL_PYTHON.md`)
3. **Wait** for the application to start
4. **Upload** your Excel file and click "Process File"

### If you get "Python not found" error:
1. **Check** `INSTALL_PYTHON.md` for step-by-step Python installation
2. **Quick fix**: Install Python from Microsoft Store
3. **Alternative**: Try `run_web_app_alt.bat` or `run_desktop_app_alt.bat`

### For All Users (Manual Method)
1. **Install dependencies**: `pip install -r requirements.txt`
2. **Run web app**: `streamlit run app.py`
3. **OR run desktop app**: `python desktop_app.py`

## 📋 Test With Sample Data
1. Use the sample file: `file/job-master (9).xlsx`
2. Upload it to test all features
3. Try search, filter, and export functions

## 🔧 Column Mapping
The app automatically maps your Excel columns. Common mappings:
- Job ID → Job ID, JobID, ID
- Job Date → Job Creation DateTime, Job Date
- Status → Status, Job Status
- GPS → Distance: GPS, GPS Distance
- And many more...

## 📥 Export Options
- **Excel Reports**: Full data + summary statistics
- **PDF Reports**: Formatted reports with charts
- **Job-wise Export**: Individual job data
- **Search & Filter**: Find specific jobs instantly

## ❓ Need Help?
- Check the full `README.md` for detailed instructions
- Review the troubleshooting section
- Verify your Excel file format (.xlsx or .xls)

---
**Ready to go!** Your Job Master Data Processor is set up and ready to use. 🎉 