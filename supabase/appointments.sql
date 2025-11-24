-- ============================================
-- BI Physio - Tablica appointments
-- ============================================
-- SQL kod za kreiranje tablice appointments u Supabase
-- Kopiraj cijeli sadržaj u Supabase SQL Editor

-- Kreiranje tablice appointments
CREATE TABLE IF NOT EXISTS appointments (
    id BIGSERIAL PRIMARY KEY,
    datum DATE NOT NULL,
    vrijeme TIME NOT NULL,
    ime_pacijenta TEXT NOT NULL,
    usluga TEXT NOT NULL,
    telefon TEXT NOT NULL,
    email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Provjera da status ima valjanu vrijednost
    CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'cancelled'))
);

-- VAŽNO: Ne koristimo obični UNIQUE constraint na (datum, vrijeme)
-- Umjesto toga koristimo PARTIAL UNIQUE INDEX koji vrijedi samo za aktivne termine
-- Ovo omogućava da cancelled termini ne blokiraju nove rezervacije

-- Partial unique index - osigurava da za isti datum i vrijeme može postojati 
-- samo jedan termin sa statusom 'pending' ili 'confirmed'
-- Cancelled termini se ignoriraju i ne blokiraju nove rezervacije
CREATE UNIQUE INDEX IF NOT EXISTS unique_appointments_active
ON appointments (datum, vrijeme)
WHERE status IN ('pending', 'confirmed');

-- Index na (datum, vrijeme) za brže sortiranje i pretraživanje (bez unique)
CREATE INDEX IF NOT EXISTS idx_appointments_datum_vrijeme ON appointments (datum ASC, vrijeme ASC);

-- Index na status za brže filtriranje
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments (status);

-- Index na created_at za sortiranje po datumu kreiranja
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments (created_at DESC);

-- Komentari za dokumentaciju
COMMENT ON TABLE appointments IS 'Tablica za pohranu rezervacija termina';
COMMENT ON COLUMN appointments.id IS 'Jedinstveni identifikator rezervacije';
COMMENT ON COLUMN appointments.datum IS 'Datum termina';
COMMENT ON COLUMN appointments.vrijeme IS 'Vrijeme termina';
COMMENT ON COLUMN appointments.ime_pacijenta IS 'Ime i prezime pacijenta';
COMMENT ON COLUMN appointments.usluga IS 'Naziv usluge';
COMMENT ON COLUMN appointments.telefon IS 'Kontakt telefon pacijenta';
COMMENT ON COLUMN appointments.email IS 'Email adresa pacijenta';
COMMENT ON COLUMN appointments.status IS 'Status rezervacije: pending, confirmed, cancelled';
COMMENT ON COLUMN appointments.created_at IS 'Datum i vrijeme kreiranja rezervacije';

