import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar as CalendarIcon, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

const Rezervacije = () => {
  const [selectedDate, setSelectedDate] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    note: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  const dates = []
  const today = new Date()
  for (let i = 0; i < 14; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    dates.push(date)
  }

  useEffect(() => {
    loadAvailabilityRules()
  }, [])

  useEffect(() => {
    if (selectedDate) {
      loadAvailableSlots(selectedDate)
    }
  }, [selectedDate])

  const loadAvailabilityRules = async () => {
    try {
      // Učitaj pravila dostupnosti iz Supabase
      const { data, error } = await supabase
        .from('availability_rules')
        .select('*')
        .eq('is_active', true)

      if (error) {
        console.error('Error loading availability:', error)
        // Fallback na default pravila ako nema u bazi
        setLoading(false)
        return
      }

      setLoading(false)
    } catch (error) {
      console.error('Error:', error)
      setLoading(false)
    }
  }

  const loadAvailableSlots = async (date) => {
    setLoading(true)
    try {
      // Provjeri rezervacije za taj dan
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('time, status')
        .eq('date', date.toISOString().split('T')[0])
        .in('status', ['novo', 'potvrđeno'])

      if (bookingsError) {
        console.error('Error loading bookings:', bookingsError)
      }

      const bookedTimes = bookings?.map((b) => b.time) || []

      // Generiraj slotove prema pravilima (default: 9:00-17:00, 45 min)
      const slots = []
      const startHour = 9
      const endHour = 17
      const slotMinutes = 45

      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += slotMinutes) {
          const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`
          if (!bookedTimes.includes(timeString)) {
            slots.push(timeString)
          }
        }
      }

      setAvailableSlots(slots)
      setLoading(false)
    } catch (error) {
      console.error('Error:', error)
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    const days = ['Ned', 'Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub']
    const dayName = days[date.getDay()]
    const day = date.getDate()
    const month = date.getMonth() + 1
    return { dayName, day, month, full: `${day}.${month}.` }
  }

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':')
    return `${hours}:${minutes}`
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setSelectedSlot(null)
    setSubmitStatus(null)
  }

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot)
    setSubmitStatus(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedDate || !selectedSlot) {
      setSubmitStatus({ type: 'error', message: 'Molimo odaberi datum i termin' })
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Provjeri ponovno je li slot još dostupan
      const { data: existingBookings } = await supabase
        .from('bookings')
        .select('id')
        .eq('date', selectedDate.toISOString().split('T')[0])
        .eq('time', selectedSlot)
        .in('status', ['novo', 'potvrđeno'])
        .maybeSingle()

      if (existingBookings) {
        setSubmitStatus({ type: 'error', message: 'Termin je već rezerviran. Odaberi drugi termin.' })
        setIsSubmitting(false)
        return
      }

      // Kreiraj rezervaciju
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone || null,
            note: formData.note || null,
            date: selectedDate.toISOString().split('T')[0],
            time: selectedSlot,
            status: 'novo',
            source: 'website',
          },
        ])
        .select()
        .single()

      if (error) {
        throw error
      }

      setSubmitStatus({
        type: 'success',
        message: `Rezervacija je uspješno kreirana! Potvrdu ćeš dobiti na email: ${formData.email}`,
      })

      // Reset forma
      setFormData({ fullName: '', email: '', phone: '', note: '' })
      setSelectedDate(null)
      setSelectedSlot(null)
    } catch (error) {
      console.error('Error creating booking:', error)
      setSubmitStatus({
        type: 'error',
        message: 'Greška pri kreiranju rezervacije. Pokušaj ponovno.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="w-full py-16 md:py-24 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            Rezervacije
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Odaberi datum i termin koji ti odgovara. Rezervacija je brza i jednostavna.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CalendarIcon size={24} className="text-accent" />
                Odaberi datum
              </h2>
              <div className="overflow-x-auto pb-4">
                <div className="flex gap-3 min-w-max md:flex-wrap md:min-w-0">
                  {dates.map((date, index) => {
                    const formatted = formatDate(date)
                    const isSelected =
                      selectedDate?.toDateString() === date.toDateString()
                    const isToday = date.toDateString() === today.toDateString()

                    return (
                      <motion.button
                        key={index}
                        onClick={() => handleDateSelect(date)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex flex-col items-center justify-center w-20 h-20 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'bg-accent text-white border-accent'
                            : 'bg-white text-gray-900 border-gray-200 hover:border-accent'
                        } ${isToday ? 'ring-2 ring-accent/50' : ''}`}
                      >
                        <span className="text-xs font-medium">{formatted.dayName}</span>
                        <span className="text-xl font-bold">{formatted.day}</span>
                        <span className="text-xs">{formatted.month}</span>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </div>

            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Clock size={24} className="text-accent" />
                  Dostupni termini
                </h2>
                {loading ? (
                  <div className="text-center py-8 text-gray-500">Učitavanje...</div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Nema dostupnih termina za ovaj dan.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedSlot === slot
                      return (
                        <motion.button
                          key={slot}
                          onClick={() => handleSlotSelect(slot)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                            isSelected
                              ? 'bg-accent text-white border-accent'
                              : 'bg-white text-gray-900 border-gray-200 hover:border-accent'
                          }`}
                        >
                          {formatTime(slot)}
                        </motion.button>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-lg sticky top-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Tvoji podaci</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="fullName" className="block font-bold text-gray-900 mb-2">
                    Ime i prezime <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="Ime Prezime"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block font-bold text-gray-900 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="tvoj@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block font-bold text-gray-900 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="+385 12 345 678"
                  />
                </div>

                <div>
                  <label htmlFor="note" className="block font-bold text-gray-900 mb-2">
                    Napomena
                  </label>
                  <textarea
                    id="note"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                    placeholder="Opis problema ili pitanje..."
                  />
                </div>
              </div>

              {selectedDate && selectedSlot && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Odabrani termin:</p>
                  <p className="font-bold text-gray-900">
                    {formatDate(selectedDate).full} {formatTime(selectedSlot)}
                  </p>
                </div>
              )}

              {submitStatus && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
                    submitStatus.type === 'success'
                      ? 'bg-green-50 text-green-800'
                      : 'bg-red-50 text-red-800'
                  }`}
                >
                  {submitStatus.type === 'success' ? (
                    <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm">{submitStatus.message}</p>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting || !selectedDate || !selectedSlot}
                whileHover={{ scale: isSubmitting || !selectedDate || !selectedSlot ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting || !selectedDate || !selectedSlot ? 1 : 0.98 }}
                className="w-full bg-accent text-white font-bold py-4 px-6 rounded-xl hover:bg-accentDark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CalendarIcon size={20} />
                <span>{isSubmitting ? 'Rezerviram...' : 'Rezerviraj termin'}</span>
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Rezervacije

