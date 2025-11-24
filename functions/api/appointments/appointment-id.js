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

// PATCH - ažuriranje statusa
async function handlePATCH(event) {
  try {
    // Ekstraktiraj ID iz path-a ili query parametra
    // Path može biti: /.netlify/functions/api/appointments/appointment-id?id=123
    // ili: /api/appointments/123 (ako je redirect)
    let id = event.queryStringParameters?.id
    if (!id) {
      // Pokušaj ekstraktirati iz path-a
      const pathMatch = event.path.match(/\/(\d+)$/)
      id = pathMatch ? pathMatch[1] : null
    }
    
    if (!id) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'ID rezervacije je obavezan.' })
      }
    }
    
    const body = JSON.parse(event.body || '{}')
    const { status } = body

    // Validacija statusa
    const validStatuses = ['pending', 'confirmed', 'cancelled']
    if (!status || !validStatuses.includes(status)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Neispravan status. Dozvoljene vrijednosti: pending, confirmed, cancelled' })
      }
    }

    // Update statusa
    const { data: updatedAppointment, error: updateError } = await supabaseAdmin
      .from('appointments')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Greška pri ažuriranju statusa:', updateError)
      
      if (updateError.code === 'PGRST116') {
        return {
          statusCode: 404,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Rezervacija nije pronađena.' })
        }
      }

      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Dogodila se greška pri ažuriranju statusa.' })
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Status rezervacije je uspješno ažuriran.',
        appointment: updatedAppointment
      })
    }
  } catch (error) {
    console.error('Neočekivana greška:', error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Dogodila se neočekivana greška. Molimo pokušajte ponovno.' })
    }
  }
}

// DELETE - brisanje termina
async function handleDELETE(event) {
  try {
    // Ekstraktiraj ID iz path-a ili query parametra
    let id = event.queryStringParameters?.id
    if (!id) {
      const pathMatch = event.path.match(/\/(\d+)$/)
      id = pathMatch ? pathMatch[1] : null
    }
    
    if (!id) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'ID rezervacije je obavezan.' })
      }
    }

    const { error: deleteError } = await supabaseAdmin
      .from('appointments')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Greška pri brisanju termina:', deleteError)
      
      if (deleteError.code === 'PGRST116') {
        return {
          statusCode: 404,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Termin nije pronađen.' })
        }
      }

      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Dogodila se greška pri brisanju termina.' })
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Termin je uspješno otkazan.'
      })
    }
  } catch (error) {
    console.error('Neočekivana greška:', error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Dogodila se neočekivana greška. Molimo pokušajte ponovno.' })
    }
  }
}

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'PATCH, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod === 'PATCH') {
    return handlePATCH(event)
  }

  if (event.httpMethod === 'DELETE') {
    return handleDELETE(event)
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  }
}

