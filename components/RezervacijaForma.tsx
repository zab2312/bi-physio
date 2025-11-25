'use client'

import { useState, FormEvent, useEffect, useRef, useCallback } from 'react'
import Toast from './Toast'
import { callSupabaseFunction } from '@/lib/supabaseClient'

interface FormMessage {
  type: 'success' | 'error' | null
  text: string
}

interface TimeSlot {
  time: string
  available: boolean
}

export default function RezervacijaForma() {
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<FormMessage>({ type: null, text: '' })
  const [showToast, setShowToast] = useState(false)
  const [slotsFadeState, setSlotsFadeState] = useState<'normal' | 'fade-out' | 'fade-in'>('normal')
  const formRef = useRef<HTMLFormElement>(null)

  const loadSlots = useCallback(async (date: string) => {
    setLoadingSlots(true)
    setSlotsFadeState('fade-out')

    // Kratka pauza za fade-out animaciju
    await new Promise(resolve => setTimeout(resolve, 200))

    try {
      const data = await callSupabaseFunction('get-slots', {
        method: 'GET',
        params: { date }
      })

      setSlots(data.slots || [])
      setSlotsFadeState('fade-in')

      // Vrati na normalno stanje nakon animacije
      setTimeout(() => setSlotsFadeState('normal'), 400)
    } catch (error) {
      console.error('Greška pri dohvaćanju slotova:', error)
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Dogodila se greška pri dohvaćanju dostupnih termina.'
      })
      setSlotsFadeState('normal')
    } finally {
      setLoadingSlots(false)
    }
  }, [])

  // Dohvat slotova kada se odabere datum
  useEffect(() => {
    if (!selectedDate) {
      setSlots([])
      return
    }

    loadSlots(selectedDate)
  }, [selectedDate, loadSlots])

  const handleSlotClick = (time: string) => {
    if (!selectedDate || !time) return
    setSelectedSlot(prev => (prev === time ? null : time))
    setMessage({ type: null, text: '' })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedSlot) {
      setMessage({
        type: 'error',
        text: 'Molimo odaberite termin prije slanja rezervacije.'
      })
      setShowToast(true)
      return
    }

    if (!formRef.current || !selectedDate) return

    const formData = new FormData(formRef.current)
    const ime_prezime = formData.get('ime_prezime') as string
    const email = formData.get('email') as string
    const telefon = formData.get('telefon') as string
    const usluga = formData.get('usluga') as string

    if (!ime_prezime || !email || !telefon || !usluga) {
      setMessage({
        type: 'error',
        text: 'Molimo popunite sva obavezna polja.'
      })
      setShowToast(true)
      return
    }

    setIsSubmitting(true)
    setMessage({ type: null, text: '' })

    try {
      const appointmentData = {
        ime_prezime,
        email,
        telefon,
        usluga,
        datum: selectedDate,
        vrijeme: selectedSlot,
        poruka: formData.get('poruka') || '',
      }

      const data = await callSupabaseFunction('create-appointment', {
        method: 'POST',
        body: appointmentData
      })

      // Uspješno rezervirano - prikaži toast
      setMessage({
        type: 'success',
        text: data.message || 'Termin je uspješno zabilježen, primit ćete potvrdu emailom.'
      })
      setShowToast(true)

      // Reset forme (osim datuma)
      if (formRef.current) {
        const dateInput = formRef.current.querySelector('[name="datum"]') as HTMLInputElement
        const dateValue = dateInput?.value || ''
        formRef.current.reset()
        if (dateInput) {
          dateInput.value = dateValue
        }
      }

      setSelectedSlot(null)

      if (selectedDate) {
        await loadSlots(selectedDate)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Dogodila se greška pri slanju rezervacije.'
      setMessage({
        type: 'error',
        text: errorMessage
      })
      setShowToast(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Minimalni datum je danas
  const minDate = new Date().toISOString().split('T')[0]

  return (
    <>
      {showToast && message.type && (
        <Toast
          message={message.text}
          type={message.type}
          onClose={() => setShowToast(false)}
        />
      )}
      
      <form className="rezervacija-form" ref={formRef} onSubmit={handleSubmit}>

      <div className="form-group">
        <label htmlFor="ime_prezime">Ime i prezime *</label>
        <input 
          type="text" 
          id="ime_prezime" 
          name="ime_prezime" 
          required 
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          required 
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="telefon">Telefon *</label>
        <input 
          type="tel" 
          id="telefon" 
          name="telefon" 
          required 
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="usluga">Usluga *</label>
        <select 
          id="usluga" 
          name="usluga" 
          required 
          disabled={isSubmitting}
        >
          <option value="">Odaberite uslugu</option>
          <option value="Kineziterapija">Kineziterapija</option>
          <option value="Manualna terapija">Manualna terapija</option>
          <option value="Fizikalna terapija">Fizikalna terapija</option>
          <option value="Rehabilitacija sportaša">Rehabilitacija sportaša</option>
          <option value="Terapija boli u leđima">Terapija boli u leđima</option>
          <option value="Posturalna korekcija">Posturalna korekcija</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="datum">Odaberite datum *</label>
        <input 
          type="date" 
          id="datum" 
          name="datum" 
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value)
            setSelectedSlot(null)
            setMessage({ type: null, text: '' })
          }}
          min={minDate}
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Prikaz vremenskih slotova */}
      {selectedDate && (
        <div className="form-group">
          <label>Odaberite vrijeme *</label>
          {loadingSlots ? (
            <div className="slots-loading">Učitavanje dostupnih termina...</div>
          ) : (
            <div className={`time-slots ${slotsFadeState}`}>
              {slots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  className={`time-slot ${slot.available ? 'available' : 'booked'} ${selectedSlot === slot.time ? 'selected' : ''}`}
                  onClick={() => slot.available && handleSlotClick(slot.time)}
                  disabled={!slot.available || isSubmitting}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          )}
          {!loadingSlots && slots.length > 0 && (
            <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--text-light)' }}>
              Odaberite slobodan termin i potvrdite klikom na gumb Rezerviraj
            </small>
          )}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="poruka">Poruka</label>
        <textarea 
          id="poruka" 
          name="poruka" 
          rows={4}
          disabled={isSubmitting}
        />
      </div>
      <button
        type="submit"
        className="primary-button"
        disabled={!selectedSlot || isSubmitting}
      >
        {isSubmitting ? 'Slanje...' : 'Rezerviraj'}
      </button>
    </form>
    </>
  )
}
