-- ============================================
-- BI Physio - Migracija za partial unique index
-- ============================================
-- SQL kod za ažuriranje tablice appointments u Supabase
-- Kopiraj cijeli sadržaj u Supabase SQL Editor i izvrši
-- 
-- OVA MIGRACIJA:
-- 1. Uklanja postojeći UNIQUE constraint na (datum, vrijeme)
-- 2. Kreira partial unique index koji vrijedi samo za aktivne termine (pending, confirmed)
-- 3. Omogućava da cancelled termini ne blokiraju nove rezervacije

-- Korak 1: Uklanjanje postojećeg UNIQUE constraint-a
-- Prvo provjerimo ime constraint-a (može biti unique_appointment_time ili nešto drugo)
DO $$ 
BEGIN
    -- Pokušaj ukloniti constraint ako postoji
    IF EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'unique_appointment_time'
    ) THEN
        ALTER TABLE appointments DROP CONSTRAINT unique_appointment_time;
        RAISE NOTICE 'Uklonjen constraint unique_appointment_time';
    END IF;
END $$;

-- Korak 2: Uklanjanje postojećeg indexa ako postoji (za slučaj da je kreiran kao index)
DROP INDEX IF EXISTS unique_appointments_datum_vrijeme;
DROP INDEX IF EXISTS idx_appointments_datum_vrijeme;

-- Korak 3: Kreiranje partial unique indexa koji vrijedi samo za aktivne termine
-- Ovaj index osigurava da za isti datum i vrijeme može postojati samo jedan
-- termin sa statusom 'pending' ili 'confirmed'
CREATE UNIQUE INDEX IF NOT EXISTS unique_appointments_active
ON appointments (datum, vrijeme)
WHERE status IN ('pending', 'confirmed');

-- Korak 4: Ponovno kreiranje običnog indexa za brže sortiranje (bez unique)
CREATE INDEX IF NOT EXISTS idx_appointments_datum_vrijeme 
ON appointments (datum ASC, vrijeme ASC);

-- Komentar za dokumentaciju
COMMENT ON INDEX unique_appointments_active IS 
'Partial unique index - osigurava da za isti datum i vrijeme može postojati samo jedan aktivni termin (pending ili confirmed). Cancelled termini ne blokiraju nove rezervacije.';

