-- Mirus KPI Tracker - Supabase Database Schema
-- Copy entire contents into Supabase SQL Editor and click RUN

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'manager',
  store TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Weekly logs
CREATE TABLE weekly_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manager_id UUID REFERENCES users(id) ON DELETE CASCADE,
  week_number INT NOT NULL,
  year INT NOT NULL,
  products_focused TEXT NOT NULL,
  actions_taken TEXT NOT NULL,
  quality_score INT DEFAULT 0,
  quality_feedback TEXT,
  submitted_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Monthly submissions (HR approves)
CREATE TABLE monthly_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manager_id UUID REFERENCES users(id) ON DELETE CASCADE,
  month INT NOT NULL,
  year INT NOT NULL,
  what_score INT NOT NULL,
  how_score INT NOT NULL,
  kpi_tier TEXT,
  approved BOOLEAN DEFAULT FALSE,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Manager notes (Work Ethics + Warnings)
CREATE TABLE manager_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manager_id UUID REFERENCES users(id) ON DELETE CASCADE,
  note_type TEXT NOT NULL,
  content TEXT NOT NULL,
  written_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Odoo metrics (synced weekly)
CREATE TABLE odoo_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manager_id UUID REFERENCES users(id) ON DELETE CASCADE,
  week_number INT NOT NULL,
  year INT NOT NULL,
  sales_amount DECIMAL(15,2),
  transaction_count INT,
  avg_transaction_value DECIMAL(10,2),
  bundle_attach_rate DECIMAL(5,2),
  refund_rate DECIMAL(5,2),
  top_products TEXT,
  synced_at TIMESTAMP DEFAULT NOW()
);

-- Create initial test users
INSERT INTO users (email, password_hash, full_name, role, store)
VALUES 
  (
    'tsogzolmaa@mirus.mn',
    crypt('password123', gen_salt('bf')),
    'Tsogzolmaa',
    'manager',
    '120 худалдагч'
  ),
  (
    'hr@mirus.mn',
    crypt('password123', gen_salt('bf')),
    'HR Team',
    'hr',
    NULL
  ),
  (
    'michelle@mirus.mn',
    crypt('password123', gen_salt('bf')),
    'Michelle',
    'admin',
    NULL
  );

-- Create indexes for performance
CREATE INDEX idx_weekly_logs_manager ON weekly_logs(manager_id);
CREATE INDEX idx_weekly_logs_week ON weekly_logs(week_number, year);
CREATE INDEX idx_monthly_submissions_manager ON monthly_submissions(manager_id);
CREATE INDEX idx_odoo_metrics_manager ON odoo_metrics(manager_id);
CREATE INDEX idx_odoo_metrics_week ON odoo_metrics(week_number, year);
CREATE INDEX idx_manager_notes_manager ON manager_notes(manager_id);

-- Enable Row Level Security (Optional - for production)
-- ALTER TABLE weekly_logs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE monthly_submissions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE manager_notes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE odoo_metrics ENABLE ROW LEVEL SECURITY;

-- Note: After running this, you have:
-- 1 Manager: Tsogzolmaa
-- 1 HR user
-- 1 Admin (Michelle)
--
-- Other managers (Ujin, Badmaa, Uchral) can be created via HR dashboard
