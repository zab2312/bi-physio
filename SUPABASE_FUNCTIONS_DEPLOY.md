# Supabase Edge Functions Deployment

## 🚀 Kako deployati Supabase Edge Functions

### 1. Instaliraj Supabase CLI

```bash
npm install -g supabase
```

### 2. Login u Supabase

```bash
supabase login
```

### 3. Linkaj projekt s tvojim Supabase projektom

```bash
supabase link --project-ref tvoj-project-ref
```

Project ref možeš naći u Supabase Dashboardu u Settings > API.

### 4. Deployaj sve Functions

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
1. Provjeri da su deployani: `supabase functions list`
2. Provjeri logove: `supabase functions logs <function-name>`
3. Provjeri da je projekt linkan: `supabase status`

