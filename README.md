# BI Physio - Web stranica za fizioterapeuta

Moderna, responsive web stranica za fizioterapeuta BI Physio (Borna Idrizović) s funkcionalnostima rezervacija termina i admin panelom.

## Tehnologije

- **React** + **Vite** - React framework s Vite build alatom
- **React Router** - Routing za višestraničnu aplikaciju
- **Supabase** - Backend servis za autentifikaciju i bazu podataka
- **Framer Motion** - Animacije i mikrointerakcije
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Ikone
- **Satoshi Font** - Fontshare font (dodan u index.html)

## Struktura projekta

```
bi-physio/
├── public/
│   └── logo.png              # Logo datoteka (dodaj svoj logo)
├── src/
│   ├── components/           # React komponente
│   │   ├── FloatingNav.jsx   # Floating navigacija s overlay menijem
│   │   ├── Footer.jsx        # Footer s CTA kartom
│   │   ├── Layout.jsx        # Glavni layout wrapper
│   │   └── StickyCTA.jsx     # Sticky CTA za mobitele
│   ├── lib/
│   │   └── supabase.js       # Supabase client konfiguracija
│   ├── pages/                # Stranice aplikacije
│   │   ├── Home.jsx          # Naslovna stranica
│   │   ├── Usluge.jsx        # Stranica usluga
│   │   ├── Cjenik.jsx        # Stranica cjenika
│   │   ├── OMeni.jsx         # O meni stranica
│   │   ├── Kontakt.jsx       # Kontakt stranica
│   │   ├── Rezervacije.jsx   # Rezervacije stranica
│   │   └── AdminDashboard.jsx # Admin dashboard
│   ├── App.jsx               # Glavna App komponenta s routingom
│   ├── main.jsx              # Entry point
│   └── index.css             # Globalni stilovi
├── supabase/
│   └── schema.sql            # Supabase baza podataka schema
└── package.json              # Dependencies

```

## Postavljanje projekta

### 1. Kloniraj i instaliraj dependencies

```bash
npm install
```

### 2. Postavi Supabase

1. Kreiraj novi projekt na [Supabase](https://supabase.com)
2. U SQL Editoru izvrši SQL iz `supabase/schema.sql`
3. Kopiraj Supabase URL i anon key iz Settings > API

### 3. Konfiguriraj environment varijable

Kreiraj `.env` datoteku u root direktoriju:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Napomena:** Zamijeni `your_supabase_url` i `your_supabase_anon_key` s tvojim stvarnim Supabase podacima.

### 4. Dodaj logo

Dodaj svoj logo datoteku kao `public/logo.png`. Logo se koristi u faviconu i gdje je potrebno.

### 5. Kreiraj admin korisnika

Za kreiranje admin korisnika (zaposlenog):

1. **Kreiraj korisnika u Supabase Auth:**
   - Idi na Supabase Dashboard > Authentication > Users
   - Klikni "Add user" ili "Invite user"
   - Unesi email i lozinku za admin korisnika
   - Kopiraj User ID (UUID)

2. **Kreiraj profil za zaposlenog:**
   - Idi na Supabase Dashboard > Table Editor > `profiles`
   - Klikni "Insert row"
   - Unesi:
     - `id`: User ID iz koraka 1 (UUID)
     - `full_name`: Ime zaposlenog
     - `role`: `admin` (ili `staff` za običnog zaposlenog)
   - Spremi

**Ili kroz SQL Editor:**

```sql
-- Zamijeni 'user-id-here' s User ID-om iz auth.users
-- Zamijeni 'Ime Prezime' s imenom zaposlenog
INSERT INTO profiles (id, full_name, role)
VALUES (
  'user-id-here',
  'Ime Prezime',
  'admin'
);
```

**Napomena:** Korisnici (klijenti) nemaju profile - samo zaposleni (admin/staff) imaju profile u `profiles` tablici.

## Pokretanje projekta

### Development server

```bash
npm run dev
```

Aplikacija će biti dostupna na `http://localhost:5173`

### Build za produkciju

```bash
npm run build
```

Build će biti u `dist` direktoriju.

### Preview produkcijskog builda

```bash
npm run preview
```

## Funkcionalnosti

### Javne stranice

1. **Naslovna** (`/`) - Hero sekcija, Povratak u pokret, Zašto BI Physio, Recenzije, CTA
2. **Usluge** (`/usluge`) - Pregled svih usluga s opisima
3. **Cjenik** (`/cjenik`) - Pregled cijena i paketa
4. **O meni** (`/o-meni`) - Priča o Borni Idrizoviću
5. **Kontakt** (`/kontakt`) - Kontakt forma i podaci
6. **Rezervacije** (`/rezervacije`) - Kalendar i forma za rezervaciju termina

### Admin Dashboard

- **Ruta:** `/admin`
- **Funkcionalnosti:**
  - Login s email i lozinkom
  - Pregled svih rezervacija
  - Filteri po datumu i statusu
  - Promjena statusa rezervacije (novo, potvrđeno, otkazano, odrađeno)
  - Uređivanje rezervacije (datum, termin, podaci)
  - Brisanje rezervacije
  - Pregled dostupnosti (link na Supabase dashboard)

### Rezervacije

- Prikaz idućih 14 dana
- Generiranje dostupnih termina prema pravilima u bazi
- Provjera dostupnosti i sprječavanje double booking
- Validacija forme i feedback korisniku
- Automatski status "novo" za nove rezervacije

## Baza podataka

### Tablice

1. **profiles** - Korisnički profili s rolama (admin, staff)
2. **bookings** - Rezervacije termina
3. **availability_rules** - Pravila dostupnosti (radni dani, sati)
4. **availability_exceptions** - Iznimke u dostupnosti (neradni dani)

### Row Level Security (RLS)

- **bookings:** Svi mogu kreirati, samo admin može čitati/svim upravljati
- **profiles:** Korisnici mogu vidjeti svoj profil, admin sve
- **availability_rules:** Svi mogu čitati aktivna pravila, samo admin može upravljati
- **availability_exceptions:** Svi mogu čitati, samo admin može upravljati

## Customizacija

### Boje

Boje se mogu mijenjati u `tailwind.config.js`:

```js
colors: {
  accent: '#2563eb',      // Primarna boja
  accentDark: '#1e40af',  // Tamnija varijanta
}
```

### Font

Satoshi font je već konfiguriran i učitava se iz Fontshare. Font je podešen u `tailwind.config.js` i `src/index.css`.

### Stock slike

Stock slike su uključene kao linkovi s Unsplash. Možeš ih zamijeniti:

1. Preuzmi slike i stavi ih u `public/` direktorij
2. U komponentama zamijeni URL-ove s lokalnim putanjama

Primjer:
```jsx
// Prije
<img src="https://images.unsplash.com/..." />

// Poslije
<img src="/hero-image.jpg" />
```

## Deployment na Vercel

### Koraci za deployment:

1. **Kreiraj novi repozitorij na GitHubu:**
   - Idi na https://github.com/new
   - Ime: `bi-physio`
   - Klikni "Create repository"

2. **Push kod na GitHub:**
   ```bash
   git remote add origin https://github.com/TVOJ_USERNAME/bi-physio.git
   git branch -M main
   git push -u origin main
   ```

3. **Deploy na Vercel:**
   - Idi na https://vercel.com
   - Klikni "Add New Project"
   - Importuj GitHub repozitorij `bi-physio`
   - Vercel će automatski detektirati Vite projekt
   - **Dodaj Environment Variables:**
     - `VITE_SUPABASE_URL` = tvoj Supabase URL
     - `VITE_SUPABASE_ANON_KEY` = tvoj Supabase anon key
   - Klikni "Deploy"

4. **Nakon deploymenta:**
   - Vercel će automatski deployati svaki push na `main` branch
   - Tvoj site će biti dostupan na `bi-physio.vercel.app` (ili custom domenu ako ga postaviš)

### Environment varijable za Vercel

Obavezno dodaj u Vercel dashboardu:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon/public key

**Gdje pronaći Supabase podatke:**
1. Supabase Dashboard > Settings > API
2. Project URL = `VITE_SUPABASE_URL`
3. anon/public key = `VITE_SUPABASE_ANON_KEY`

## Ograničenja i napomene

1. **Email notifikacije:** Kontakt forma i rezervacije trenutno ne šalju email notifikacije. Za produkciju preporuča se integracija s email servisom (npr. SendGrid, Resend) preko Supabase Edge Functions.

2. **Dostupnost:** Admin upravljanje dostupnošću je trenutno povezano s direktnim uređivanjem u Supabase bazi. Za kompletnu funkcionalnost mogu se dodati forme u admin dashboard.

3. **Mapa:** Mapa na kontakt stranici je placeholder. Za produkciju koristi Google Maps ili Mapbox embed.

4. **Validacija termina:** Rezervacije provjeravaju dostupnost prije kreiranja, ali za kompletnu sigurnost preporuča se dodatna server-side validacija kroz Supabase Edge Functions.

## Podrška

Za pitanja ili probleme, provjeri:
- [Vite dokumentaciju](https://vitejs.dev/)
- [React dokumentaciju](https://react.dev/)
- [Supabase dokumentaciju](https://supabase.com/docs)
- [Tailwind CSS dokumentaciju](https://tailwindcss.com/docs)

## Licenca

Ovaj projekt je kreiran za BI Physio. Sva prava pridržana.

