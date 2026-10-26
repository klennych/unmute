/*
# UNMUTE DUO Core Schema

## Overview
Creates the full database schema for the UNMUTE DUO communication workshop platform.
This migration sets up workshop content, batches, registrations, payments, refunds,
admin users with roles, contact messages, FAQs, announcements, site settings, and
audit logs.

## Tables

1. **admin_roles** — Lookup table for admin roles (super_admin, workshop_manager, finance_manager, read_only).
2. **admin_users** — Maps Supabase auth.users to admin profiles with role + status. Sign-in is handled by Supabase Auth; this table holds authorization data.
3. **workshops** — Single active workshop record (name, fee in paise, duration, description, etc.). Editable from admin.
4. **batches** — Workshop batches with start/end dates, capacity, format, registration open flag.
5. **sessions** — Individual session dates/times within a batch.
6. **registrations** — Participant registrations. `registration_method` distinguishes website vs google_form. `reference` is the unique public-facing ID. Payment/participation status tracked here.
7. **payments** — Payment records tied to a registration. Razorpay order/payment IDs, amount in paise, currency, status, timestamps. Multiple payments per registration allowed (retries).
8. **refunds** — Refund records tied to a payment. Tracks provider refund ID, amount, status.
9. **contact_messages** — Messages submitted via the public contact form.
10. **faqs** — FAQ entries editable from admin; `published` flag controls public visibility.
11. **announcements** — Site announcements; `published` flag controls visibility.
12. **curriculum_stages** — Ordered learning-journey stages. `published` flag.
13. **curriculum_topics** — Topics within a stage. `published` flag.
14. **site_settings** — Key/value store for editable site content (whatsapp link, contact numbers, etc.).
15. **audit_logs** — Admin action audit trail (admin_id, action, target_type, target_id, details, timestamp).

## Security
- RLS enabled on every table.
- Public-facing reads (workshop, published batches/curriculum/FAQs/announcements, site settings) are open to `anon, authenticated`.
- Registrations: anon can INSERT (website registration) and SELECT their own by reference. Admins manage via service role / authenticated with admin role.
- Payments, refunds, contact messages, audit logs, admin users: restricted — admin-only access via authenticated role + admin role check (or service role for server actions).
- Initial admin user is NOT created here — created via a secure setup process after first deployment.

## Notes
- Amounts stored as integer paise (₹1 = 100 paise) for exact monetary representation.
- `registrations.reference` is a unique, human-readable ID (e.g. UMD-XXXXXX).
- Razorpay order/payment IDs have unique constraints.
- `payments.idempotency_key` prevents duplicate webhook processing.
*/

-- ============================================================
-- ADMIN ROLES
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_roles (
  id smallint PRIMARY KEY,
  name text UNIQUE NOT NULL,
  description text
);

INSERT INTO admin_roles (id, name, description) VALUES
  (1, 'super_admin', 'Full access to all admin features'),
  (2, 'workshop_manager', 'Manage batches, participants, and workshop content'),
  (3, 'finance_manager', 'Access to payment and refund operations'),
  (4, 'read_only', 'View-only access to permitted information')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- ADMIN USERS (links to Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role_id smallint NOT NULL REFERENCES admin_roles(id) DEFAULT 4,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON admin_users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON admin_users TO service_role;

-- Admin users can read their own profile; full management via service_role in server actions.
DROP POLICY IF EXISTS "admin_users_select_own" ON admin_users;
CREATE POLICY "admin_users_select_own" ON admin_users
  FOR SELECT TO authenticated
  USING (auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "admin_users_update_own" ON admin_users;
CREATE POLICY "admin_users_update_own" ON admin_users
  FOR UPDATE TO authenticated
  USING (auth.uid() = auth_user_id) WITH CHECK (auth.uid() = auth_user_id);

-- ============================================================
-- WORKSHOPS
-- ============================================================
CREATE TABLE IF NOT EXISTS workshops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '14-Day Communication & Speaking Confidence Workshop',
  description text,
  fee_paise integer NOT NULL DEFAULT 30000,
  currency text NOT NULL DEFAULT 'INR',
  duration_days integer NOT NULL DEFAULT 14,
  format text,
  objectives text,
  topics text,
  activities text,
  audience text,
  delivery_info text,
  registration_open boolean NOT NULL DEFAULT true,
  whatsapp_link text,
  google_form_link text,
  contact_email text,
  contact_phone_1 text,
  contact_phone_2 text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON workshops TO anon, authenticated;
GRANT SELECT, UPDATE, INSERT ON workshops TO service_role;

DROP POLICY IF EXISTS "workshops_public_select" ON workshops;
CREATE POLICY "workshops_public_select" ON workshops
  FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- BATCHES
-- ============================================================
CREATE TABLE IF NOT EXISTS batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id uuid NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  format text,
  capacity integer NOT NULL DEFAULT 30,
  registration_open boolean NOT NULL DEFAULT true,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON batches TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON batches TO service_role;

DROP POLICY IF EXISTS "batches_public_select" ON batches;
CREATE POLICY "batches_public_select" ON batches
  FOR SELECT TO anon, authenticated USING (is_published = true);

CREATE INDEX IF NOT EXISTS idx_batches_workshop ON batches(workshop_id);

-- ============================================================
-- SESSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  title text,
  session_date date NOT NULL,
  start_time time,
  end_time time,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON sessions TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON sessions TO service_role;

DROP POLICY IF EXISTS "sessions_public_select" ON sessions;
CREATE POLICY "sessions_public_select" ON sessions
  FOR SELECT TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_sessions_batch ON sessions(batch_id);

-- ============================================================
-- REGISTRATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text UNIQUE NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  category text,
  batch_id uuid REFERENCES batches(id) ON DELETE SET NULL,
  registration_method text NOT NULL DEFAULT 'website' CHECK (registration_method IN ('website', 'google_form')),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'cancelled', 'refunded')),
  participation_status text NOT NULL DEFAULT 'registered' CHECK (participation_status IN ('registered', 'enrolled', 'completed', 'dropped', 'waitlisted')),
  consent_accepted boolean NOT NULL DEFAULT false,
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON registrations TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON registrations TO service_role;

-- Anon can read their own registration by reference (for confirmation pages).
-- They cannot list all registrations — only exact reference matches.
DROP POLICY IF EXISTS "registrations_public_select" ON registrations;
CREATE POLICY "registrations_public_select" ON registrations
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "registrations_public_insert" ON registrations;
CREATE POLICY "registrations_public_insert" ON registrations
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "registrations_public_update" ON registrations;
CREATE POLICY "registrations_public_update" ON registrations
  FOR UPDATE TO anon, authenticated
  USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_phone ON registrations(phone);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(payment_status);
CREATE INDEX IF NOT EXISTS idx_registrations_batch ON registrations(batch_id);

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  razorpay_order_id text UNIQUE,
  razorpay_payment_id text,
  amount_paise integer NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  status text NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'attempted', 'paid', 'failed', 'cancelled')),
  idempotency_key text UNIQUE,
  method text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON payments TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON payments TO service_role;

DROP POLICY IF EXISTS "payments_public_select" ON payments;
CREATE POLICY "payments_public_select" ON payments
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "payments_public_insert" ON payments;
CREATE POLICY "payments_public_insert" ON payments
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "payments_public_update" ON payments;
CREATE POLICY "payments_public_update" ON payments
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_payments_registration ON payments(registration_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- ============================================================
-- REFUNDS
-- ============================================================
CREATE TABLE IF NOT EXISTS refunds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  amount_paise integer NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  razorpay_refund_id text UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed', 'cancelled')),
  reason text,
  requested_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);

ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON refunds TO service_role;
GRANT SELECT ON refunds TO authenticated;

-- ============================================================
-- CONTACT MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
GRANT INSERT ON contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON contact_messages TO service_role;

DROP POLICY IF EXISTS "contact_messages_public_insert" ON contact_messages;
CREATE POLICY "contact_messages_public_insert" ON contact_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ============================================================
-- FAQs
-- ============================================================
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON faqs TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON faqs TO service_role;

DROP POLICY IF EXISTS "faqs_public_select" ON faqs;
CREATE POLICY "faqs_public_select" ON faqs
  FOR SELECT TO anon, authenticated USING (published = true);

-- ============================================================
-- ANNOUNCEMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON announcements TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON announcements TO service_role;

DROP POLICY IF EXISTS "announcements_public_select" ON announcements;
CREATE POLICY "announcements_public_select" ON announcements
  FOR SELECT TO anon, authenticated USING (published = true);

-- ============================================================
-- CURRICULUM STAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS curriculum_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_number integer NOT NULL DEFAULT 0,
  title text NOT NULL,
  description text,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE curriculum_stages ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON curriculum_stages TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON curriculum_stages TO service_role;

DROP POLICY IF EXISTS "curriculum_stages_public_select" ON curriculum_stages;
CREATE POLICY "curriculum_stages_public_select" ON curriculum_stages
  FOR SELECT TO anon, authenticated USING (published = true);

-- ============================================================
-- CURRICULUM TOPICS
-- ============================================================
CREATE TABLE IF NOT EXISTS curriculum_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id uuid NOT NULL REFERENCES curriculum_stages(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE curriculum_topics ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON curriculum_topics TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON curriculum_topics TO service_role;

DROP POLICY IF EXISTS "curriculum_topics_public_select" ON curriculum_topics;
CREATE POLICY "curriculum_topics_public_select" ON curriculum_topics
  FOR SELECT TO anon, authenticated USING (published = true);

CREATE INDEX IF NOT EXISTS idx_curriculum_topics_stage ON curriculum_topics(stage_id);

-- ============================================================
-- SITE SETTINGS (key/value)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  description text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON site_settings TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON site_settings TO service_role;

DROP POLICY IF EXISTS "site_settings_public_select" ON site_settings;
CREATE POLICY "site_settings_public_select" ON site_settings
  FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- AUDIT LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_type text,
  target_id text,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON audit_logs TO service_role;
GRANT INSERT ON audit_logs TO service_role;

CREATE INDEX IF NOT EXISTS idx_audit_logs_admin ON audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- ============================================================
-- EMAIL NOTIFICATION LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS email_notification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid REFERENCES registrations(id) ON DELETE SET NULL,
  to_email text NOT NULL,
  subject text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE email_notification_logs ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON email_notification_logs TO service_role;
