from setuptools import setup, find_packages

setup(
    name="jobmaster-processor",
    version="1.0.0",
    description="Job Master Data Processor - Web and Desktop Application",
    author="Your Name",
    author_email="your.email@example.com",
    packages=find_packages(),
    install_requires=[
        "streamlit>=1.28.0",
        "pandas>=2.0.0",
        "openpyxl>=3.1.0",
        "reportlab>=4.0.0",
        "Pillow>=10.0.0",
    ],
    python_requires=">=3.8",
    entry_points={
        "console_scripts": [
            "jobmaster-web=app:main",
            "jobmaster-desktop=desktop_app:main",
        ],
    },
) 