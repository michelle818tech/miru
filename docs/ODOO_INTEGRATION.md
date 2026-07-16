# Odoo to KPI Tracker - Integration Guide

**For:** Techmarbles Team  
**Purpose:** Sync POS data weekly to KPI tracking website  
**Frequency:** Every Sunday at 5 AM  

---

## Overview

1. Extract sales data from Odoo POS for each manager
2. Calculate metrics (avg value, bundle rate, refund rate)
3. Send to KPI tracker API
4. Manager sees metrics in their dashboard

---

## Odoo POS Fields to Extract

From `pos_order` table, weekly summary by manager (cashier):

```sql
SELECT
  pos_employee.name AS manager_name,
  res_partner.email AS manager_email,
  COUNT(*) AS transaction_count,
  SUM(pos_order.amount_total) AS sales_amount,
  AVG(pos_order.amount_total) AS avg_transaction_value,
  -- Bundle rate: orders with 2+ products
  ROUND(100.0 * COUNT(CASE WHEN order_lines_count >= 2 THEN 1 END) / COUNT(*), 2) AS bundle_attach_rate,
  -- Refund rate: orders marked as refund
  ROUND(100.0 * COUNT(CASE WHEN pos_order.refund_approval_status = 'approved' THEN 1 END) / COUNT(*), 2) AS refund_rate,
  STRING_AGG(DISTINCT product_category.name, ', ' ORDER BY product_category.name) AS top_products
FROM pos_order
JOIN res_partner ON pos_order.partner_id = res_partner.id
JOIN pos_employee ON pos_order.employee_id = pos_employee.id
JOIN product_category ON pos_order.product_id = product_category.id
WHERE DATE(pos_order.create_date) >= DATE(NOW() - INTERVAL '7 days')
GROUP BY pos_employee.name, res_partner.email
ORDER BY sales_amount DESC;
```

---

## Python Script (Weekly Sync)

Run this every Sunday at 5 AM:

```python
#!/usr/bin/env python3

import requests
import json
from datetime import datetime
import psycopg2
import os

# Configuration
ODOO_DB = os.getenv('ODOO_DB_NAME')
ODOO_USER = os.getenv('ODOO_DB_USER')
ODOO_PASSWORD = os.getenv('ODOO_DB_PASSWORD')
ODOO_HOST = os.getenv('ODOO_DB_HOST', 'localhost')

KPI_API_URL = os.getenv('KPI_API_URL')  # https://mirus-kpi.vercel.app/api/sync-odoo

# Get current week
now = datetime.now()
week_num = now.isocalendar()[1]
year = now.isocalendar()[0]

def connect_odoo():
    """Connect to Odoo PostgreSQL database"""
    conn = psycopg2.connect(
        database=ODOO_DB,
        user=ODOO_USER,
        password=ODOO_PASSWORD,
        host=ODOO_HOST
    )
    return conn

def extract_manager_metrics():
    """Extract POS metrics for each manager from last 7 days"""
    conn = connect_odoo()
    cursor = conn.cursor()
    
    query = """
    SELECT
        rp.email,
        pe.name,
        COUNT(*) AS transaction_count,
        COALESCE(SUM(po.amount_total), 0) AS sales_amount,
        COALESCE(AVG(po.amount_total), 0) AS avg_transaction_value,
        ROUND(100.0 * COUNT(CASE WHEN po.order_line_ids is not null AND array_length(po.order_line_ids, 1) >= 2 THEN 1 END) / 
              NULLIF(COUNT(*), 0), 2) AS bundle_attach_rate,
        ROUND(100.0 * COUNT(CASE WHEN po.refund_approval_status = 'approved' THEN 1 END) / 
              NULLIF(COUNT(*), 0), 2) AS refund_rate
    FROM pos_order po
    JOIN res_partner rp ON po.partner_id = rp.id
    JOIN pos_employee pe ON po.employee_id = pe.id
    WHERE DATE(po.create_date) >= DATE(NOW() - INTERVAL '7 days')
        AND po.state NOT IN ('cancelled', 'draft')
    GROUP BY rp.email, pe.name
    ORDER BY sales_amount DESC;
    """
    
    cursor.execute(query)
    results = cursor.fetchall()
    conn.close()
    
    return results

def get_top_products(manager_email, limit=5):
    """Get top products sold by manager this week"""
    conn = connect_odoo()
    cursor = conn.cursor()
    
    query = """
    SELECT
        ARRAY_AGG(DISTINCT pt.name ORDER BY COUNT(*) DESC LIMIT %s)
    FROM pos_order_line pol
    JOIN pos_order po ON pol.order_id = po.id
    JOIN product_product pp ON pol.product_id = pp.id
    JOIN product_template pt ON pp.product_tmpl_id = pt.id
    JOIN res_partner rp ON po.partner_id = rp.id
    WHERE DATE(po.create_date) >= DATE(NOW() - INTERVAL '7 days')
        AND rp.email = %s
        AND po.state NOT IN ('cancelled', 'draft')
    GROUP BY rp.email;
    """
    
    cursor.execute(query, (limit, manager_email))
    result = cursor.fetchone()
    conn.close()
    
    return result[0] if result and result[0] else []

def sync_to_kpi_tracker(metrics):
    """Send metrics to KPI tracker API"""
    
    for metric in metrics:
        email, name, trans_count, sales_amt, avg_val, bundle_rate, refund_rate = metric
        
        top_products = get_top_products(email)
        
        payload = {
            "manager_email": email,
            "week": week_num,
            "year": year,
            "sales_amount": float(sales_amt),
            "transaction_count": int(trans_count),
            "avg_transaction_value": float(avg_val),
            "bundle_attach_rate": float(bundle_rate) if bundle_rate else 0,
            "refund_rate": float(refund_rate) if refund_rate else 0,
            "top_products": top_products
        }
        
        try:
            response = requests.post(
                KPI_API_URL,
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                print(f"✓ Synced {email}: {sales_amt}₮ in {trans_count} transactions")
            else:
                print(f"✗ Failed {email}: {response.status_code} - {response.text}")
                
        except Exception as e:
            print(f"✗ Error syncing {email}: {str(e)}")

def main():
    """Main function"""
    print(f"Starting Odoo sync for week {week_num}, {year}")
    print(f"Timestamp: {datetime.now()}")
    
    try:
        metrics = extract_manager_metrics()
        print(f"Found {len(metrics)} managers with POS data")
        
        sync_to_kpi_tracker(metrics)
        
        print("Sync completed successfully")
        
    except Exception as e:
        print(f"Fatal error: {str(e)}")
        exit(1)

if __name__ == "__main__":
    main()
```

---

## Setup Instructions

### 1. Environment Variables

Create `.env` file on your Odoo server:

```bash
ODOO_DB_NAME=odoo_production
ODOO_DB_USER=odoo_user
ODOO_DB_PASSWORD=your_password
ODOO_DB_HOST=localhost
KPI_API_URL=https://mirus-kpi.vercel.app/api/sync-odoo
```

### 2. Install Dependencies

```bash
pip install requests psycopg2-binary
```

### 3. Schedule with Cron (Linux)

```bash
# Run every Sunday at 5 AM
0 5 * * 0 /usr/bin/python3 /home/odoo/sync_kpi.py >> /var/log/odoo_kpi_sync.log 2>&1
```

Or use Odoo's Scheduler module:
1. Go to Settings → Automation → Scheduled Actions
2. Create new action: "Sync KPI Metrics"
3. Model: `ir.cron`
4. Interval: Weekly (Sunday)
5. Next execution: Sunday 05:00
6. Execute: Run Python script above

---

## Testing

Before scheduling, test manually:

```bash
python3 sync_kpi.py
```

Expected output:
```
✓ Synced tsogzolmaa@mirus.mn: 1234567₮ in 156 transactions
✓ Synced ujin@mirus.mn: 987654₮ in 145 transactions
✓ Synced badmaa@mirus.mn: 654321₮ in 128 transactions
✓ Synced uchral@mirus.mn: 543210₮ in 119 transactions
Sync completed successfully
```

---

## Troubleshooting

**Issue: "Database connection refused"**
- Check ODOO_DB_HOST and credentials
- Ensure PostgreSQL is running

**Issue: "No managers found"**
- Check dates in SQL query (look at last 7 days)
- Verify POS orders exist in database

**Issue: "API returns 400 or 404"**
- Check KPI_API_URL is correct
- Verify manager email matches users table in KPI tracker

**Issue: "HTTP timeout"**
- Check internet connectivity to KPI tracker
- Increase timeout value in script

---

## Manager Email Mapping

The script matches manager email from Odoo to KPI tracker database. Make sure:

Odoo POS Employee → Email field matches KPI tracker users table:

| Store | Manager | Email |
|-------|---------|-------|
| 120 худалдагч | Tsogzolmaa | tsogzolmaa@mirus.mn |
| SILA худалдагч | Ujin | ujin@mirus.mn |
| Имарт худалдагч | Badmaa | badmaa@mirus.mn |
| PeaceMall / СУИС | Uchral | uchral@mirus.mn |

---

## What Gets Synced

Every Sunday at 5 AM, for each manager:

✓ Total sales ₮  
✓ # of transactions  
✓ Average transaction value  
✓ Bundle attach rate (% orders with 2+ items)  
✓ Refund rate (% orders marked as refunded)  
✓ Top 5 products sold  

Manager sees this in their KPI dashboard under "Your Weekly Metrics"

---

## Questions?

Email: michelle@mirus.mn

---
