import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Get date from query parameters
    const url = new URL(req.url)
    const date = url.searchParams.get('date')

    if (!date) {
      return new Response(
        JSON.stringify({ error: 'Datum je obavezan parametar.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate date format
    const datumRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!datumRegex.test(date)) {
      return new Response(
        JSON.stringify({ error: 'Neispravan format datuma. Očekivani format: YYYY-MM-DD' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch active appointments
    const { data: appointments, error: fetchError } = await supabaseAdmin
      .from('appointments')
      .select('vrijeme, status')
      .eq('datum', date)
      .in('status', ['pending', 'confirmed'])

    if (fetchError) {
      console.error('Greška pri dohvaćanju rezervacija:', fetchError)
      return new Response(
        JSON.stringify({ error: 'Dogodila se greška pri dohvaćanju dostupnih termina.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate all possible slots
    const allSlots = [
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00'
    ]

    // Create set of booked times
    const bookedTimes = new Set(
      (appointments || []).map(apt => apt.vrijeme.substring(0, 5))
    )

    // Create slots list with availability
    const slots = allSlots.map(time => ({
      time,
      available: !bookedTimes.has(time)
    }))

    return new Response(
      JSON.stringify({
        date,
        slots
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Neočekivana greška:', error)
    return new Response(
      JSON.stringify({ error: 'Dogodila se neočekivana greška. Molimo pokušajte ponovno.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

