-- Ensure a fresh Supabase project has an active workshop for website registration.
INSERT INTO workshops (name, fee_paise, currency, duration_days, registration_open, is_active)
SELECT
  '14-Day Communication & Speaking Confidence Workshop',
  30000,
  'INR',
  14,
  true,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM workshops WHERE is_active = true
);
