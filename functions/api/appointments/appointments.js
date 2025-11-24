const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// GET - dohvat svih rezervacija (za admin stranicu)
async function handleGET() {
  try {
    const { data: appointments, error: fetchError } = await supabaseAdmin
      .from('appointments')
      .select('*')
      .order('datum', { ascending: true })
      .order('vrijeme', { ascending: true })

    if (fetchError) {
      console.error('Greška pri dohvaćanju rezervacija:', fetchError)
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Dogodila se greška pri dohvaćanju rezervacija.' })
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appointments: appointments || [] })
    }
  } catch (error) {
    console.error('Neočekivana greška:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Dogodila se neočekivana greška. Molimo pokušajte ponovno.' })
    }
  }
}

// POST - kreiranje nove rezervacije
async function handlePOST(event) {
  try {
    const body = JSON.parse(event.body)
    const { ime_prezime, email, telefon, usluga, datum, vrijeme, poruka } = body

    // Validacija obaveznih polja
    if (!ime_prezime || !email || !telefon || !usluga || !datum || !vrijeme) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Sva obavezna polja moraju biti popunjena.' })
      }
    }

    // Validacija formata datuma i vremena
    const datumRegex = /^\d{4}-\d{2}-\d{2}$/
    const vrijemeRegex = /^\d{2}:\d{2}$/

    if (!datumRegex.test(datum)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Neispravan format datuma. Očekivani format: YYYY-MM-DD' })
      }
    }

    if (!vrijemeRegex.test(vrijeme)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Neispravan format vremena. Očekivani format: HH:MM' })
      }
    }

    // Provjera zauzetosti
    const { data: existingAppointments, error: checkError } = await supabaseAdmin
      .from('appointments')
      .select('id')
      .eq('datum', datum)
      .eq('vrijeme', vrijeme)
      .in('status', ['pending', 'confirmed'])

    if (checkError) {
      console.error('Greška pri provjeri zauzetosti:', checkError)
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Dogodila se greška pri provjeri dostupnosti termina.' })
      }
    }

    if (existingAppointments && existingAppointments.length > 0) {
      return {
        statusCode: 409,
        body: JSON.stringify({ error: 'Odabrani termin je upravo postao zauzet, molimo odaberite drugi termin.' })
      }
    }

    // Kreiranje rezervacije
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
        return {
          statusCode: 409,
          body: JSON.stringify({ error: 'Odabrani termin je upravo postao zauzet, molimo odaberite drugi termin.' })
        }
      }

      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Dogodila se greška pri kreiranju rezervacije.' })
      }
    }

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Termin je uspješno zabilježen, primit ćete potvrdu emailom.',
        appointment: newAppointment
      })
    }
  } catch (error) {
    console.error('Neočekivana greška:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Dogodila se neočekivana greška. Molimo pokušajte ponovno.' })
    }
  }
}

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod === 'GET') {
    return handleGET()
  }

  if (event.httpMethod === 'POST') {
    return handlePOST(event)
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  }
}

