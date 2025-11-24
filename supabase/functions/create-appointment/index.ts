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

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
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

    const body = await req.json()
    const { ime_prezime, email, telefon, usluga, datum, vrijeme, poruka } = body

    // Validate required fields
    if (!ime_prezime || !email || !telefon || !usluga || !datum || !vrijeme) {
      return new Response(
        JSON.stringify({ error: 'Sva obavezna polja moraju biti popunjena.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate date and time format
    const datumRegex = /^\d{4}-\d{2}-\d{2}$/
    const vrijemeRegex = /^\d{2}:\d{2}$/

    if (!datumRegex.test(datum)) {
      return new Response(
        JSON.stringify({ error: 'Neispravan format datuma. Očekivani format: YYYY-MM-DD' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!vrijemeRegex.test(vrijeme)) {
      return new Response(
        JSON.stringify({ error: 'Neispravan format vremena. Očekivani format: HH:MM' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check availability
    const { data: existingAppointments, error: checkError } = await supabaseAdmin
      .from('appointments')
      .select('id')
      .eq('datum', datum)
      .eq('vrijeme', vrijeme)
      .in('status', ['pending', 'confirmed'])

    if (checkError) {
      console.error('Greška pri provjeri zauzetosti:', checkError)
      return new Response(
        JSON.stringify({ error: 'Dogodila se greška pri provjeri dostupnosti termina.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (existingAppointments && existingAppointments.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Odabrani termin je upravo postao zauzet, molimo odaberite drugi termin.' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create appointment
    const { data: newAppointment, error: insertError } = await supabaseAdmin
      .from('appointments')
      .insert({
        datum,
        vrijeme,
        ime_pacijenta: ime_prezime,
        usluga,
        telefon,
        email,
        status: 'pending',
      })
      .select()
      .single()

    if (insertError) {
      console.error('Greška pri kreiranju rezervacije:', insertError)
      
      if (insertError.code === '23505') {
        return new Response(
          JSON.stringify({ error: 'Odabrani termin je upravo postao zauzet, molimo odaberite drugi termin.' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ error: 'Dogodila se greška pri kreiranju rezervacije.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        message: 'Termin je uspješno zabilježen, primit ćete potvrdu emailom.',
        appointment: newAppointment
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Neočekivana greška:', error)
    return new Response(
      JSON.stringify({ error: 'Dogodila se neočekivana greška. Molimo pokušajte ponovno.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

