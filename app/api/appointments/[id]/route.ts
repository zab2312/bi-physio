import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseClient'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { status } = body

    // Validacija statusa
    const validStatuses = ['pending', 'confirmed', 'cancelled']
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Neispravan status. Dozvoljene vrijednosti: pending, confirmed, cancelled' },
        { status: 400 }
      )
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Server greška: Supabase klijent nije konfiguriran.' },
        { status: 500 }
      )
    }

    // Update statusa rezervacije
    const { data: updatedAppointment, error: updateError } = await supabaseAdmin
      .from('appointments')
      .update({ status } as { status: 'pending' | 'confirmed' | 'cancelled' })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Greška pri ažuriranju statusa:', updateError)
      
      if (updateError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Rezervacija nije pronađena.' },
          { status: 404 }
        )
      }

      return NextResponse.json(
        { error: 'Dogodila se greška pri ažuriranju statusa.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Status rezervacije je uspješno ažuriran.',
        appointment: updatedAppointment 
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

// DELETE - brisanje termina (otkazivanje)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Server greška: Supabase klijent nije konfiguriran.' },
        { status: 500 }
      )
    }

    // Brisanje termina iz baze
    const { error: deleteError } = await supabaseAdmin
      .from('appointments')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Greška pri brisanju termina:', deleteError)
      
      if (deleteError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Termin nije pronađen.' },
          { status: 404 }
        )
      }

      return NextResponse.json(
        { error: 'Dogodila se greška pri brisanju termina.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Termin je uspješno otkazan.'
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

