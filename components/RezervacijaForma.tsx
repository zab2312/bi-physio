'use client'

import { useState, FormEvent, useEffect, useRef } from 'react'
import Toast from './Toast'

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
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [bookingSlot, setBookingSlot] = useState<string | null>(null)
  const [message, setMessage] = useState<FormMessage>({ type: null, text: '' })
  const [showToast, setShowToast] = useState(false)
  const [slotsFadeState, setSlotsFadeState] = useState<'normal' | 'fade-out' | 'fade-in'>('normal')
  const formRef = useRef<HTMLFormElement>(null)

  // Dohvat slotova kada se odabere datum
  useEffect(() => {
    if (!selectedDate) {
      setSlots([])
      return
    }

    const fetchSlots = async () => {
      setLoadingSlots(true)
      setSlotsFadeState('fade-out')
      
      // Kratka pauza za fade-out animaciju
      await new Promise(resolve => setTimeout(resolve, 200))
      
      try {
        const response = await fetch(`/api/appointments/slots?date=${selectedDate}`)
        
        if (!response.ok) {
          throw new Error('Greška pri dohvaćanju dostupnih termina')
        }

        const data = await response.json()
        setSlots(data.slots || [])
        setSlotsFadeState('fade-in')
        
        // Vrati na normalno stanje nakon animacije
        setTimeout(() => setSlotsFadeState('normal'), 400)
      } catch (error) {
        console.error('Greška pri dohvaćanju slotova:', error)
        setMessage({
          type: 'error',
          text: 'Dogodila se greška pri dohvaćanju dostupnih termina.'
        })
        setSlotsFadeState('normal')
      } finally {
        setLoadingSlots(false)
      }
    }

    fetchSlots()
  }, [selectedDate])

  // Automatska rezervacija klikom na slot
  const handleSlotClick = async (time: string) => {
    if (!selectedDate || !time) return

    // Provjera da su obavezna polja popunjena
    if (!formRef.current) return

    const formData = new FormData(formRef.current)
    const ime_prezime = formData.get('ime_prezime') as string
    const email = formData.get('email') as string
    const telefon = formData.get('telefon') as string
    const usluga = formData.get('usluga') as string

    if (!ime_prezime || !email || !telefon || !usluga) {
      setMessage({
        type: 'error',
        text: 'Molimo popunite sva obavezna polja (ime, email, telefon, usluga) prije odabira termina.'
      })
      return
    }

    // Postavljanje loading state-a
    setBookingSlot(time)
    setMessage({ type: null, text: '' })

    try {
      const appointmentData = {
        ime_prezime,
        email,
        telefon,
        usluga,
        datum: selectedDate,
        vrijeme: time,
        poruka: formData.get('poruka') || '',
      }

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      })

      const data = await response.json()

      if (!response.ok) {
        // Posebna poruka za race condition
        if (response.status === 409) {
          throw new Error('Odabrani termin je upravo postao zauzet, molimo odaberite drugi termin.')
        }
        throw new Error(data.error || 'Dogodila se greška pri slanju rezervacije.')
      }

      // Uspješno rezervirano - prikaži toast
      setMessage({
        type: 'success',
        text: 'Termin je uspješno zabilježen, primit ćete potvrdu emailom.'
      })
      setShowToast(true)

      // Osvježi slotove da se prikaže da je termin sada zauzet
      const updatedSlots = slots.map(slot =>
        slot.time === time ? { ...slot, available: false } : slot
      )
      setSlots(updatedSlots)

      // Reset forme (osim datuma)
      if (formRef.current) {
        const dateInput = formRef.current.querySelector('[name="datum"]') as HTMLInputElement
        const dateValue = dateInput?.value || ''
        formRef.current.reset()
        if (dateInput) {
          dateInput.value = dateValue
          setSelectedDate(dateValue)
        }
      }

      // Osvježi slotove nakon kratke pauze
      setTimeout(() => {
        if (selectedDate) {
          fetch(`/api/appointments/slots?date=${selectedDate}`)
            .then(res => res.json())
            .then(data => setSlots(data.slots || []))
            .catch(console.error)
        }
      }, 500)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Dogodila se greška pri slanju rezervacije.'
      setMessage({
        type: 'error',
        text: errorMessage
      })
      setShowToast(true)
    } finally {
      setBookingSlot(null)
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
      
      <form className="rezervacija-form" ref={formRef}>

      <div className="form-group">
        <label htmlFor="ime_prezime">Ime i prezime *</label>
        <input 
          type="text" 
          id="ime_prezime" 
          name="ime_prezime" 
          required 
          disabled={!!bookingSlot}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          required 
          disabled={!!bookingSlot}
        />
      </div>

      <div className="form-group">
        <label htmlFor="telefon">Telefon *</label>
        <input 
          type="tel" 
          id="telefon" 
          name="telefon" 
          required 
          disabled={!!bookingSlot}
        />
      </div>

      <div className="form-group">
        <label htmlFor="usluga">Usluga *</label>
        <select 
          id="usluga" 
          name="usluga" 
          required 
          disabled={!!bookingSlot}
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
            setMessage({ type: null, text: '' })
          }}
          min={minDate}
          required
          disabled={!!bookingSlot}
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
                  className={`time-slot ${slot.available ? 'available' : 'booked'} ${bookingSlot === slot.time ? 'booking' : ''}`}
                  onClick={() => slot.available && handleSlotClick(slot.time)}
                  disabled={!slot.available || !!bookingSlot}
                >
                  {slot.time}
                  {bookingSlot === slot.time && (
                    <span className="slot-loading">...</span>
                  )}
                </button>
              ))}
            </div>
          )}
          {!loadingSlots && slots.length > 0 && (
            <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--text-light)' }}>
              Kliknite na slobodan termin za automatsku rezervaciju
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
          disabled={!!bookingSlot}
        />
      </div>
    </form>
    </>
  )
}
