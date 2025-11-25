# BI Physio - Aplikacija za rezervaciju termina

Next.js aplikacija za rezervaciju termina fizioterapijskih usluga s integracijom Supabase baze podataka.

## 🚀 Funkcionalnosti

- ✅ Rezervacija termina preko web forme
- ✅ Automatska provjera zauzetosti termina (isti datum + vrijeme)
- ✅ Admin sučelje za pregled i upravljanje rezervacijama
- ✅ Promjena statusa rezervacija (pending / confirmed / cancelled)
- ✅ Responzivni dizajn

## 📋 Preduvjeti

- Node.js 18+ 
- npm ili yarn
- Supabase račun i projekt

## 🛠️ Instalacija

1. **Kloniraj ili preuzmi projekt**

2. **Instaliraj dependencies:**
```bash
npm install
```

3. **Kreiraj Supabase bazu podataka:**

   - Otvori Supabase Dashboard
   - Idi u SQL Editor
   - Kopiraj i izvrši SQL kod iz `supabase/appointments.sql`

4. **Konfiguriraj environment varijable:**

   - Kopiraj `.env.example` u `.env.local`
   - Popuni svoje Supabase credentials:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     ```

5. **Pokreni development server:**
```bash
npm run dev
```

6. **Otvori aplikaciju:**
   - Glavna stranica: http://localhost:3000
   - Admin stranica: http://localhost:3000/admin/rezervacije

## 📁 Struktura projekta

```
bi-physio/
├── app/
│   ├── admin/
│   │   └── rezervacije/
│   │       └── page.tsx              # Admin stranica
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Glavna stranica
│   └── globals.css                   # Globalni stilovi
├── components/
│   └── RezervacijaForma.tsx          # Forma za rezervaciju
├── lib/
│   └── supabaseClient.ts             # Supabase klijent konfiguracija
├── supabase/
│   ├── functions/                    # Supabase Edge Functions
│   │   ├── get-slots/                # Dohvat dostupnih termina
│   │   ├── create-appointment/       # Kreiranje rezervacije
│   │   ├── get-appointments/         # Dohvat svih rezervacija
│   │   ├── update-appointment/       # Ažuriranje statusa
│   │   └── delete-appointment/       # Brisanje rezervacije
│   └── appointments.sql              # SQL za kreiranje tablice
└── public/
    └── hero.webp                     # Slike
```

## 🗄️ Baza podataka

### Tablica: `appointments`

| Kolona | Tip | Opis |
|--------|-----|------|
| id | BIGSERIAL | Primarni ključ |
| datum | DATE | Datum termina |
| vrijeme | TIME | Vrijeme termina |
| ime_pacijenta | TEXT | Ime i prezime pacijenta |
| usluga | TEXT | Naziv usluge |
| telefon | TEXT | Kontakt telefon |
| email | TEXT | Email adresa |
| status | TEXT | Status (pending/confirmed/cancelled) |
| created_at | TIMESTAMPTZ | Datum kreiranja |

**Ograničenja:**
- UNIQUE constraint na kombinaciju (datum, vrijeme) - spriječava duple termine
- CHECK constraint na status - samo dozvoljene vrijednosti

## 🔐 Sigurnost

- Service Role Key se koristi u Supabase Edge Functions (server-side)
- Anon Key se koristi za client-side operacije
- **NIKAD** ne commitaj `.env.local` datoteku u git!

## 📝 API Endpoints (Supabase Edge Functions)

Aplikacija koristi Supabase Edge Functions umjesto Next.js API ruta:

- `get-slots` - Dohvat dostupnih termina za određeni datum
- `create-appointment` - Kreiranje nove rezervacije
- `get-appointments` - Dohvat svih rezervacija (za admin stranicu)
- `update-appointment` - Ažuriranje statusa rezervacije
- `delete-appointment` - Brisanje rezervacije

Za detalje o deployanju Functions, vidi `SUPABASE_FUNCTIONS_DEPLOY.md`.

**Primjer poziva:**
```typescript
import { callSupabaseFunction } from '@/lib/supabaseClient'

// Dohvat slotova
const data = await callSupabaseFunction('get-slots', {
  method: 'GET',
  params: { date: '2024-01-15' }
})

// Kreiranje rezervacije
const result = await callSupabaseFunction('create-appointment', {
  method: 'POST',
  body: {
    ime_prezime: "Marko Horvat",
    email: "marko@example.com",
    telefon: "091 123 4567",
    usluga: "Kineziterapija",
    datum: "2024-01-15",
    vrijeme: "10:00"
  }
})
```

## 🎨 Stilovi

Stilovi su organizirani u `app/globals.css` i spremni za migraciju u Tailwind CSS ili CSS Modules ako je potrebno.

## 🚧 Buduća poboljšanja

- [ ] Autentifikacija za admin stranicu
- [ ] Email notifikacije
- [ ] Kalendar prikaz dostupnih termina
- [ ] Mogućnost otkazivanja rezervacija od strane korisnika
- [ ] Dashboard sa statistikama

## 📄 Licenca

Privatni projekt - BI Physio

