-- Supabase Schema za BI Physio projekt
-- Izvrši ovaj SQL u Supabase SQL Editoru

-- Tablica profiles za zaposlene (admin/staff)
-- Korisnici (klijenti) nemaju profile, samo zaposleni
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tablica bookings za rezervacije
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  note TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT DEFAULT 'novo' CHECK (status IN ('novo', 'potvrđeno', 'otkazano', 'odrađeno')),
  source TEXT DEFAULT 'website'
);

-- Tablica availability_rules za pravila dostupnosti
CREATE TABLE IF NOT EXISTS availability_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  weekday INT NOT NULL CHECK (weekday >= 0 AND weekday <= 6), -- 0 = nedjelja, 6 = subota
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_minutes INT DEFAULT 45,
  break_minutes INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tablica availability_exceptions za iznimke u dostupnosti
CREATE TABLE IF NOT EXISTS availability_exceptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  is_closed BOOLEAN DEFAULT TRUE,
  start_time TIME,
  end_time TIME,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indeksi za brže pretraživanje
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date_time ON bookings(date, time);

-- Partial unique index za sprječavanje double booking
-- Omogućava samo jednu aktivnu rezervaciju (novo ili potvrđeno) za isti datum i termin
CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_unique_active 
ON bookings(date, time) 
WHERE status IN ('novo', 'potvrđeno');
CREATE INDEX IF NOT EXISTS idx_availability_rules_weekday ON availability_rules(weekday);
CREATE INDEX IF NOT EXISTS idx_availability_rules_active ON availability_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_availability_exceptions_date ON availability_exceptions(date);

-- Funkcija za automatsko ažuriranje updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggeri za automatsko ažuriranje updated_at
-- Prvo ukloni stare triggere ako postoje
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
DROP TRIGGER IF EXISTS update_availability_rules_updated_at ON availability_rules;
DROP TRIGGER IF EXISTS update_availability_exceptions_updated_at ON availability_exceptions;

-- Kreiraj triggere
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_availability_rules_updated_at
  BEFORE UPDATE ON availability_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_availability_exceptions_updated_at
  BEFORE UPDATE ON availability_exceptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Omogući RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_exceptions ENABLE ROW LEVEL SECURITY;

-- Funkcija za provjeru je li korisnik admin (bez circular dependency)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Profiles policies
-- Prvo ukloni stare politike ako postoje
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;

-- Korisnici mogu vidjeti svoj vlastiti profil (potrebno za provjeru role)
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Admini mogu vidjeti sve profile (koristi funkciju bez circular dependency)
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (public.is_admin());

-- Samo admini mogu kreirati profile (za nove zaposlene)
CREATE POLICY "Admins can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (public.is_admin());

-- Samo admini mogu ažurirati profile
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (public.is_admin());

-- Samo admini mogu brisati profile
CREATE POLICY "Admins can delete profiles"
  ON profiles FOR DELETE
  USING (public.is_admin());

-- Bookings policies
-- Prvo ukloni stare politike ako postoje
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can view bookings in the future" ON bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can delete bookings" ON bookings;

CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view bookings in the future"
  ON bookings FOR SELECT
  USING (
    date >= CURRENT_DATE OR public.is_admin()
  );

CREATE POLICY "Admins can view all bookings"
  ON bookings FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update bookings"
  ON bookings FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete bookings"
  ON bookings FOR DELETE
  USING (public.is_admin());

-- Availability rules policies
-- Prvo ukloni stare politike ako postoje
DROP POLICY IF EXISTS "Anyone can view active availability rules" ON availability_rules;
DROP POLICY IF EXISTS "Admins can view all availability rules" ON availability_rules;
DROP POLICY IF EXISTS "Admins can manage availability rules" ON availability_rules;

CREATE POLICY "Anyone can view active availability rules"
  ON availability_rules FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admins can view all availability rules"
  ON availability_rules FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can manage availability rules"
  ON availability_rules FOR ALL
  USING (public.is_admin());

-- Availability exceptions policies
-- Prvo ukloni stare politike ako postoje
DROP POLICY IF EXISTS "Anyone can view availability exceptions" ON availability_exceptions;
DROP POLICY IF EXISTS "Admins can manage availability exceptions" ON availability_exceptions;

CREATE POLICY "Anyone can view availability exceptions"
  ON availability_exceptions FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage availability exceptions"
  ON availability_exceptions FOR ALL
  USING (public.is_admin());

-- Seed podaci za default pravila dostupnosti
INSERT INTO availability_rules (weekday, start_time, end_time, slot_minutes, break_minutes, is_active)
VALUES
  (1, '08:00:00', '17:00:00', 45, 0, TRUE), -- Ponedjeljak
  (2, '08:00:00', '17:00:00', 45, 0, TRUE), -- Utorak
  (3, '08:00:00', '17:00:00', 45, 0, TRUE), -- Srijeda
  (4, '08:00:00', '17:00:00', 45, 0, TRUE), -- Četvrtak
  (5, '08:00:00', '17:00:00', 45, 0, TRUE), -- Petak
  (6, '09:00:00', '13:00:00', 45, 0, TRUE)  -- Subota
ON CONFLICT DO NOTHING;

-- Napomena: Profili se NE kreiraju automatski
-- Admin mora ručno kreirati profil za zaposlenog u profiles tablici
-- Korisnici (klijenti) nemaju profile, samo zaposleni

-- Ukloni stari trigger i funkciju ako postoje (više se ne koriste)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

