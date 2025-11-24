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

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const date = event.queryStringParameters?.date

    if (!date) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Datum je obavezan parametar.' })
      }
    }

    // Validacija formata datuma
    const datumRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!datumRegex.test(date)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Neispravan format datuma. Očekivani format: YYYY-MM-DD' })
      }
    }

    // Dohvat aktivnih rezervacija
    const { data: appointments, error: fetchError } = await supabaseAdmin
      .from('appointments')
      .select('vrijeme, status')
      .eq('datum', date)
      .in('status', ['pending', 'confirmed'])

    if (fetchError) {
      console.error('Greška pri dohvaćanju rezervacija:', fetchError)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Dogodila se greška pri dohvaćanju dostupnih termina.' })
      }
    }

    // Generiranje svih mogućih slotova
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

    // Kreiranje seta zauzetih vremena
    const bookedTimes = new Set(
      (appointments || []).map(apt => apt.vrijeme.substring(0, 5))
    )

    // Kreiranje liste slotova s informacijom o dostupnosti
    const slots = allSlots.map(time => ({
      time,
      available: !bookedTimes.has(time)
    }))

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date,
        slots
      })
    }
  } catch (error) {
    console.error('Neočekivana greška:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Dogodila se neočekivana greška. Molimo pokušajte ponovno.' })
    }
  }
}

