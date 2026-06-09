-- ============================================================
-- MedRide / Ambulance Go — Driver Seed Data
-- Jalankan SETELAH schema.sql
-- 4 driver di area Jakarta untuk demo
-- ============================================================

insert into drivers (id, name, phone, license_plate, ambulance_type, current_lat, current_lng, is_available)
values
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Budi Santoso',
    '+6281234567890',
    'B 1234 AMB',
    'ICU',
    -6.2088,
    106.8456,
    true
  ),
  (
    'b2c3d4e5-f6a7-8901-bcde-f01234567891',
    'Ahmad Fauzi',
    '+6281345678901',
    'B 5678 AMB',
    'ICU',
    -6.1944,
    106.8229,
    true
  ),
  (
    'c3d4e5f6-a7b8-9012-cdef-012345678902',
    'Siti Rahayu',
    '+6281456789012',
    'B 9012 AMB',
    'REGULER',
    -6.2297,
    106.8295,
    true
  ),
  (
    'd4e5f6a7-b8c9-0123-defa-123456789013',
    'Eko Prasetyo',
    '+6281567890123',
    'B 3456 AMB',
    'REGULER',
    -6.1751,
    106.8650,
    true
  )
on conflict (id) do nothing;
