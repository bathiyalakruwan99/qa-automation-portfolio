"""
Job Master Suite - Path Configuration

Central path definitions for data folders.
All apps and scripts should use these paths for consistency.
"""

import os

# Project root (directory containing config.py)
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

# Data directories
DATA_DIR = os.path.join(PROJECT_ROOT, "data")
INPUT_DIR = os.path.join(DATA_DIR, "input")      # Job Master Excel files
EXPORTS_DIR = os.path.join(DATA_DIR, "exports")  # Generated exports
SAMPLES_DIR = os.path.join(DATA_DIR, "samples")  # Sample job IDs
UPLOADS_DIR = os.path.join(DATA_DIR, "uploads")  # Web app uploads
DOWNLOAD_DIR = os.path.join(DATA_DIR, "downloads")  # Web app downloads
REPORTS_DIR = os.path.join(DATA_DIR, "reports")  # Reports

# Default input file
DEFAULT_INPUT_FILE = os.path.join(INPUT_DIR, "job-master.xlsx")


def ensure_directories() -> None:
    """Create all data directories if they don't exist."""
    for path in [DATA_DIR, INPUT_DIR, EXPORTS_DIR, SAMPLES_DIR, UPLOADS_DIR, DOWNLOAD_DIR, REPORTS_DIR]:
        os.makedirs(path, exist_ok=True)
