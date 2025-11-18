# Order Data Generator

Python tool for generating realistic test order data. Built when I needed 1000+ test orders for performance testing.

---

## What It Does

Generates realistic order data with:
- Order IDs
- Customer information
- Product details
- Order dates and statuses
- Shipping information
- Payment details

**Use case:** Load testing, performance testing, data validation

---

## Quick Start

```bash
cd order-file-generator

# Install dependencies
pip install -r requirements.txt

# Run the tool
python src/app.py
```

Or use batch scripts (Windows):
```bash
install.bat   # Install dependencies
run.bat       # Run the application
```

---

## Features

- Customizable order templates
- Bulk generation (1000+ orders quickly)
- Multiple export formats (Excel, JSON, CSV)
- Realistic data using Faker library
- GUI interface for configuration
- Data validation

---

## Example Output

```json
{
  "order_id": "ORD-2024-001234",
  "customer_name": "John Smith",
  "email": "john.smith@example.com",
  "order_date": "2024-11-15",
  "status": "Processing",
  "total_amount": 156.99,
  "items": [...]
}
```

---

## Tech Stack

- Python 3.7+
- Tkinter (GUI)
- Faker (realistic data generation)
- Pandas (data manipulation)
- OpenPyXL (Excel export)

---

*Quick utility for generating test order data. Useful when you need large datasets for testing order management systems.*
