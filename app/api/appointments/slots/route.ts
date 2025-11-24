import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseClient'

// GET - dohvat slobodnih i zauzetih slotova za određeni datum
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get('date')

    if (!date) {
      return NextResponse.json(
        { error: 'Datum je obavezan parametar.' },
        { status: 400 }
      )
    }

    // Validacija formata datuma
    const datumRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!datumRegex.test(date)) {
      return NextResponse.json(
        { error: 'Neispravan format datuma. Očekivani format: YYYY-MM-DD' },
        { status: 400 }
      )
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Server greška: Supabase klijent nije konfiguriran.' },
        { status: 500 }
      )
    }

    // Dohvat samo aktivnih rezervacija za odabrani datum (ignoriramo cancelled)
    // Slot je zauzet samo ako postoji termin sa statusom 'pending' ili 'confirmed'
    const { data: appointments, error: fetchError } = await supabaseAdmin
      .from('appointments')
      .select('vrijeme, status')
      .eq('datum', date)
      .in('status', ['pending', 'confirmed'])

    if (fetchError) {
      console.error('Greška pri dohvaćanju rezervacija:', fetchError)
      return NextResponse.json(
        { error: 'Dogodila se greška pri dohvaćanju dostupnih termina.' },
        { status: 500 }
      )
    }

    // Generiranje svih mogućih slotova (09:00 - 16:00)
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

    // Kreiranje seta zauzetih vremena (samo HH:MM format)
    const bookedTimes = new Set(
      (appointments || []).map(apt => apt.vrijeme.substring(0, 5))
    )

    // Kreiranje liste slotova s informacijom o dostupnosti
    const slots = allSlots.map(time => ({
      time,
      available: !bookedTimes.has(time)
    }))

    return NextResponse.json(
      {
        date,
        slots
      },
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

