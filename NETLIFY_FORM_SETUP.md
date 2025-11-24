# Netlify Form Setup - Važno!

## ❌ NE enable-aj "Form Detection" na Netlifyju!

**Form Detection treba biti ONEMOGUĆEN** jer:

1. **Koristimo custom JavaScript** - Forma koristi React state i fetch API pozive, ne standardni HTML form submission
2. **API rute su Netlify Functions** - Forma šalje podatke preko `/api/appointments` endpointa koji je Netlify Function
3. **Form Detection interferira** - Ako je enabled, Netlify pokušava automatski obraditi formu što može blokirati JavaScript funkcionalnosti

## ✅ Što je već konfigurirano:

1. **`data-netlify="false"`** - Eksplicitno onemogućava Netlify form processing
2. **`netlify-honeypot`** - Dodatni layer zaštite protiv automatske detekcije
3. **`onSubmit` handler** - Sprječava default form submission
4. **Custom API pozivi** - Svi pozivi idu preko Netlify Functions

## 🔧 Kako provjeriti u Netlify Dashboardu:

1. Idi u **Site settings** > **Forms**
2. Provjeri da je **"Enable form detection"** **OFF/Disabled**
3. Ako je enabled, **isključi ga**

## 🐛 Troubleshooting:

Ako termini i dalje ne izlaze:

1. **Otvori browser console** (F12) i provjeri:
   - Da li se API pozivi izvršavaju
   - Da li postoje CORS greške
   - Da li postoje 404 greške

2. **Provjeri Netlify Functions logove**:
   - Netlify Dashboard > Functions > View logs
   - Provjeri da li se funkcije pozivaju

3. **Provjeri environment varijable**:
   - Site settings > Environment variables
   - Provjeri da su sve tri Supabase varijable postavljene

4. **Provjeri redirects**:
   - Site settings > Redirects
   - Provjeri da su redirecti iz `netlify.toml` aktivni

## 📝 Napomene:

- Forma **NE koristi** standardni HTML form submission
- Svi podaci se šalju preko **JavaScript fetch API poziva**
- Netlify Functions rukuju svim backend logikom
- Form Detection bi mogao blokirati JavaScript evente

