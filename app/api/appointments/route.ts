import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseClient'

// GET - dohvat svih rezervacija (za admin stranicu)
export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Server greška: Supabase klijent nije konfiguriran.' },
        { status: 500 }
      )
    }

    // Dohvat svih rezervacija, sortirano po datumu i vremenu
    const { data: appointments, error: fetchError } = await supabaseAdmin
      .from('appointments')
      .select('*')
      .order('datum', { ascending: true })
      .order('vrijeme', { ascending: true })

    if (fetchError) {
      console.error('Greška pri dohvaćanju rezervacija:', fetchError)
      return NextResponse.json(
        { error: 'Dogodila se greška pri dohvaćanju rezervacija.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { appointments: appointments || [] },
      { status: 200 }
    )

  } catch (error) {
    console.error('Neočekivana greška:', error)
    return NextResponse.json(
      { error: 'Dogodila se neočekivana greška. Molimo pokušajte ponovno.' },
      { status: 500 }
    )
  }
}

// POST - kreiranje nove rezervacije
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ime_prezime, email, telefon, usluga, datum, vrijeme, poruka } = body

    // Validacija obaveznih polja
    if (!ime_prezime || !email || !telefon || !usluga || !datum || !vrijeme) {
      return NextResponse.json(
        { error: 'Sva obavezna polja moraju biti popunjena.' },
        { status: 400 }
      )
    }

    // Validacija formata datuma i vremena
    const datumRegex = /^\d{4}-\d{2}-\d{2}$/
    const vrijemeRegex = /^\d{2}:\d{2}$/

    if (!datumRegex.test(datum)) {
      return NextResponse.json(
        { error: 'Neispravan format datuma. Očekivani format: YYYY-MM-DD' },
        { status: 400 }
      )
    }

    if (!vrijemeRegex.test(vrijeme)) {
      return NextResponse.json(
        { error: 'Neispravan format vremena. Očekivani format: HH:MM' },
        { status: 400 }
      )
    }

    // Provjera zauzetosti termina
    // Tražimo postojeće rezervacije za isti datum i vrijeme
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Server greška: Supabase klijent nije konfiguriran.' },
        { status: 500 }
      )
    }

    // Provjera zauzetosti - uzimamo u obzir samo aktivne termine (pending ili confirmed)
    // Cancelled termini se ignoriraju i ne blokiraju nove rezervacije
    const { data: existingAppointments, error: checkError } = await supabaseAdmin
      .from('appointments')
      .select('id')
      .eq('datum', datum)
      .eq('vrijeme', vrijeme)
      .in('status', ['pending', 'confirmed'])

    if (checkError) {
      console.error('Greška pri provjeri zauzetosti:', checkError)
      return NextResponse.json(
        { error: 'Dogodila se greška pri provjeri dostupnosti termina.' },
        { status: 500 }
      )
    }

    // Ako postoji barem jedna rezervacija za taj termin, termin je zauzet
    if (existingAppointments && existingAppointments.length > 0) {
      return NextResponse.json(
        { error: 'Odabrani termin je upravo postao zauzet, molimo odaberite drugi termin.' },
        { status: 409 } // Conflict status code
      )
    }

    // Termin nije zauzet, kreiramo novu rezervaciju
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
      
      // Provjera da li je greška zbog UNIQUE constraint-a (ako je netko u međuvremenu rezervirao)
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'Odabrani termin je upravo postao zauzet, molimo odaberite drugi termin.' },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { error: 'Dogodila se greška pri kreiranju rezervacije.' },
        { status: 500 }
      )
    }

    // Uspješno kreirana rezervacija
    return NextResponse.json(
      { 
        message: 'Termin je uspješno zabilježen, primit ćete potvrdu emailom.',
        appointment: newAppointment 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Neočekivana greška:', error)
    return NextResponse.json(
      { error: 'Dogodila se neočekivana greška. Molimo pokušajte ponovno.' },
      { status: 500 }
    )
  }
}
