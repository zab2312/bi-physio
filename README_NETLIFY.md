# Netlify Deployment Guide

## 📦 Build za Netlify

Projekt je konfiguriran za statički export na Netlify. `out` direktorij se generira pomoću:

```bash
npm run build:netlify
```

## 🚀 Deployment na Netlify

### Opcija 1: Automatski deployment (preporučeno)

1. Pushaj kod na GitHub/GitLab/Bitbucket
2. Poveži repozitorij s Netlify
3. Netlify će automatski detektirati `netlify.toml` i koristiti pravilnu build komandu

### Opcija 2: Ručni upload

1. Pokreni `npm run build:netlify`
2. Uploadaj `out` direktorij na Netlify (Site settings > Build & deploy > Publish directory)

## 🔧 Environment Varijable

Postavi sljedeće environment varijable u Netlify Dashboard (Site settings > Environment variables):

- `NEXT_PUBLIC_SUPABASE_URL` - URL vašeg Supabase projekta
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (za Netlify Functions)

## 📝 Napomene

- API rute su konvertirane u Netlify Functions
- Frontend je statički exportan u `out` direktorij
- Netlify Functions se nalaze u `netlify/functions/` direktoriju
- Redirecti u `netlify.toml` usmjeravaju API pozive na Netlify Functions

## 🐛 Troubleshooting

Ako API pozivi ne rade:
1. Provjeri da su environment varijable postavljene u Netlify
2. Provjeri Netlify Functions logove u Netlify Dashboard
3. Provjeri da su redirecti u `netlify.toml` ispravno konfigurirani

