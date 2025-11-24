import { createClient } from '@supabase/supabase-js'

// TypeScript tipovi za Supabase tablicu appointments
export interface Appointment {
  id: number
  datum: string // DATE format: YYYY-MM-DD
  vrijeme: string // TIME format: HH:MM:SS
  ime_pacijenta: string
  usluga: string
  telefon: string
  email: string
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
}

// Inicijalizacija Supabase klijenta
// Environment varijable:
// - NEXT_PUBLIC_SUPABASE_URL: URL vašeg Supabase projekta
// - SUPABASE_SERVICE_ROLE_KEY: Service role key za server-side operacije (ne koristi se u browseru!)
// - NEXT_PUBLIC_SUPABASE_ANON_KEY: Anon key za client-side operacije

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client-side klijent (koristi anon key)
export const supabase = createClient<{ appointments: Appointment }>(
  supabaseUrl,
  supabaseAnonKey
)

// Server-side klijent (koristi service role key za admin operacije)
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient<{ appointments: Appointment }>(
      supabaseUrl,
      supabaseServiceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : null

