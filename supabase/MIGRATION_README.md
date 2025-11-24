# Migracija baze podataka - Partial Unique Index

## Problem

Trenutno UNIQUE constraint na `(datum, vrijeme)` blokira nove rezervacije čak i kada je postojeći termin otkazan (status = 'cancelled'). To znači da otkazani termini i dalje zauzimaju slotove.

## Rješenje

Koristimo **partial unique index** koji vrijedi samo za aktivne termine (pending ili confirmed). Cancelled termini se ignoriraju i ne blokiraju nove rezervacije.

## Koraci za migraciju

### 1. Ako već imate tablicu `appointments`

Ako već imate kreiranu tablicu s UNIQUE constraint-om, izvršite migraciju:

1. Otvorite Supabase Dashboard
2. Idi na SQL Editor
3. Kopiraj i izvrši SQL kod iz `supabase/appointments_migration.sql`

Ova migracija će:
- Ukloniti postojeći UNIQUE constraint
- Kreirati partial unique index
- Omogućiti da cancelled termini ne blokiraju nove rezervacije

### 2. Ako kreirate novu tablicu

Ako kreirate tablicu iz početka, koristite ažurirani SQL kod iz `supabase/appointments.sql` koji već koristi partial unique index.

## Što se mijenja?

### Prije migracije:
- UNIQUE constraint na `(datum, vrijeme)` blokira sve termine, uključujući cancelled
- Cancelled termini se i dalje prikazuju kao zauzeti u pickeru

### Nakon migracije:
- Partial unique index osigurava da samo aktivni termini (pending/confirmed) blokiraju slotove
- Cancelled termini se prikazuju kao slobodni u pickeru
- Moguće je ponovno rezervirati termin koji je bio otkazan

## Provjera

Nakon migracije, provjerite:

1. **Admin stranica**: Postavite termin na "cancelled"
2. **Korisnička stranica**: Odaberite isti datum - termin bi trebao biti slobodan
3. **Rezervacija**: Rezervirajte termin - trebalo bi raditi bez greške

## Važno

- Migracija je **sigurna** - neće izbrisati postojeće podatke
- Cancelled termini ostaju u bazi (za evidenciju)
- Samo se mijenja način na koji se provjerava zauzetost

