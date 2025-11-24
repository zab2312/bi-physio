# Supabase Edge Functions Deployment

## 🚀 Kako deployati Supabase Edge Functions

### 1. Instaliraj Supabase CLI

**Opcija A: Lokalna instalacija (preporučeno)**
```bash
npm install supabase --save-dev
```

Zatim koristi `npx` za pokretanje:
```bash
npx supabase --help
```

**Opcija B: Scoop (Windows)**
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Opcija C: Chocolatey (Windows)**
```bash
choco install supabase
```

**Opcija D: Preuzmi binarni fajl**
- Idi na: https://github.com/supabase/cli/releases
- Preuzmi `supabase_windows_amd64.zip`
- Raspakiraj i dodaj u PATH

### 2. Login u Supabase

**Ako si instalirao lokalno:**
```bash
npx supabase login
```

**Ako si instalirao globalno (Scoop/Chocolatey):**
```bash
supabase login
```

### 3. Linkaj projekt s tvojim Supabase projektom

**Ako si instalirao lokalno:**
```bash
npx supabase link --project-ref tvoj-project-ref
```

**Ako si instalirao globalno:**
```bash
supabase link --project-ref tvoj-project-ref
```

Project ref možeš naći u Supabase Dashboardu u Settings > API.

### 4. Deployaj sve Functions

**Ako si instalirao lokalno:**
```bash
npx supabase functions deploy get-slots
npx supabase functions deploy create-appointment
npx supabase functions deploy get-appointments
npx supabase functions deploy update-appointment
npx supabase functions deploy delete-appointment
```

**Ako si instalirao globalno:**
```bash
supabase functions deploy get-slots
supabase functions deploy create-appointment
supabase functions deploy get-appointments
supabase functions deploy update-appointment
supabase functions deploy delete-appointment
```

### 5. Postavi Environment Varijable

Supabase Edge Functions automatski imaju pristup:
- `SUPABASE_URL` - automatski postavljen
- `SUPABASE_SERVICE_ROLE_KEY` - automatski postavljen

**Nema potrebe za ručnim postavljanjem!** Supabase automatski injektira ove varijable.

### 6. Testiraj Functions

Nakon deploya, Functions su dostupne na:
- `https://<project-ref>.supabase.co/functions/v1/get-slots`
- `https://<project-ref>.supabase.co/functions/v1/create-appointment`
- `https://<project-ref>.supabase.co/functions/v1/get-appointments`
- `https://<project-ref>.supabase.co/functions/v1/update-appointment`
- `https://<project-ref>.supabase.co/functions/v1/delete-appointment`

## 📝 Napomene

- Functions koriste Deno runtime
- Automatski imaju pristup Supabase bazi podataka
- CORS je već konfiguriran u svakoj funkciji
- Nema potrebe za Netlify Functions više!

## 🔧 Troubleshooting

Ako Functions ne rade:
1. Provjeri da su deployani: `npx supabase functions list`
2. Provjeri logove: `npx supabase functions logs <function-name>`
3. Provjeri da je projekt linkan: `npx supabase status`

**Napomena:** Ako si instalirao Supabase CLI lokalno (kao dev dependency), koristi `npx supabase` umjesto samo `supabase` u svim naredbama.

