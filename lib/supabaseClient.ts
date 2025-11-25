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
// - NEXT_PUBLIC_SUPABASE_ANON_KEY: Anon key za client-side operacije
//
// Napomena: Service Role Key se koristi samo u Supabase Edge Functions,
// ne u frontend kodu (sigurnosni razlozi)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client-side klijent (koristi anon key)
export const supabase = createClient<{ appointments: Appointment }>(
  supabaseUrl,
  supabaseAnonKey
)

// Helper za Supabase Edge Functions URL
export const getSupabaseFunctionUrl = (functionName: string): string => {
  return `${supabaseUrl}/functions/v1/${functionName}`
}

// Helper za pozivanje Supabase Edge Functions
export const callSupabaseFunction = async (functionName: string, options: {
  method?: string
  body?: any
  params?: Record<string, string>
} = {}) => {
  const url = new URL(getSupabaseFunctionUrl(functionName))
  
  // Add query parameters
  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
  }

  const response = await fetch(url.toString(), {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

