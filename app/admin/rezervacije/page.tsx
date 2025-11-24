'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { Appointment, callSupabaseFunction } from '@/lib/supabaseClient'
import CancelModal from '@/components/CancelModal'
import SkeletonLoader from '@/components/SkeletonLoader'

export default function AdminRezervacije() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'calendar' | 'table'>('calendar')
  const [selectedDate, setSelectedDate] = useState<string>('')
  
  // State za modal otkazivanja
  const [cancelModal, setCancelModal] = useState<{
    isOpen: boolean
    appointmentId: number | null
    appointmentInfo: string
    previousStatus: 'pending' | 'confirmed'
  }>({
    isOpen: false,
    appointmentId: null,
    appointmentInfo: '',
    previousStatus: 'pending'
  })
  
  // Ref za čuvanje prethodnih vrijednosti dropdowna
  const previousStatusRef = useRef<Record<number, 'pending' | 'confirmed'>>({})

  // Dohvat svih rezervacija
  const fetchAppointments = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await callSupabaseFunction('get-appointments', {
        method: 'GET'
      })
      
      setAppointments(data.appointments || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dogodila se greška pri učitavanju podataka.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  // Promjena statusa
  const handleStatusChange = async (
    id: number, 
    newStatus: 'pending' | 'confirmed' | 'cancelled',
    currentStatus: 'pending' | 'confirmed' | 'cancelled'
  ) => {
    // Ako je odabran "cancelled", otvori modal umjesto direktnog update-a
    if (newStatus === 'cancelled') {
      const appointment = appointments.find(apt => apt.id === id)
      if (!appointment) return
      
      // Spremi prethodni status
      previousStatusRef.current[id] = currentStatus as 'pending' | 'confirmed'
      
      // Otvori modal
      setCancelModal({
        isOpen: true,
        appointmentId: id,
        appointmentInfo: `${appointment.ime_pacijenta} - ${appointment.datum} ${appointment.vrijeme.substring(0, 5)}`,
        previousStatus: currentStatus as 'pending' | 'confirmed'
      })
      
      return
    }

    // Za pending i confirmed, odmah šalji PATCH
    try {
      setUpdatingId(id)
      
      await callSupabaseFunction('update-appointment', {
        method: 'PATCH',
        params: { id: id.toString() },
        body: { status: newStatus }
      })

      // Optimistički update lokalnog state-a
      setAppointments(prevAppointments =>
        prevAppointments.map(apt =>
          apt.id === id ? { ...apt, status: newStatus } : apt
        )
      )
      
      // Spremi novi status kao prethodni
      previousStatusRef.current[id] = newStatus
      
      // Kratka animacija potvrde
      const element = document.querySelector(`[data-appointment-id="${id}"]`)
      if (element) {
        element.classList.add('status-updated')
        setTimeout(() => {
          element.classList.remove('status-updated')
        }, 500)
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Dogodila se greška pri ažuriranju statusa.')
      // Refresh podataka u slučaju greške
      fetchAppointments()
    } finally {
      setUpdatingId(null)
    }
  }

  // Potvrda otkazivanja - brisanje termina
  const handleConfirmCancel = async () => {
    if (!cancelModal.appointmentId) return

    try {
      setUpdatingId(cancelModal.appointmentId)
      
      await callSupabaseFunction('delete-appointment', {
        method: 'DELETE',
        params: { id: cancelModal.appointmentId.toString() }
      })

      // Ukloni termin iz state-a
      setAppointments(prevAppointments =>
        prevAppointments.filter(apt => apt.id !== cancelModal.appointmentId)
      )

      // Zatvori modal
      setCancelModal({
        isOpen: false,
        appointmentId: null,
        appointmentInfo: '',
        previousStatus: 'pending'
      })
      
      // Očisti ref
      delete previousStatusRef.current[cancelModal.appointmentId]
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Dogodila se greška pri otkazivanju termina.')
    } finally {
      setUpdatingId(null)
    }
  }

  // Odustajanje od otkazivanja
  const handleCancelModal = () => {
    if (!cancelModal.appointmentId) return
    
    // Zatvori modal - dropdown će se automatski vratiti na prethodnu vrijednost
    // jer kontrolirani select koristi appointment.status koji nije promijenjen
    setCancelModal({
      isOpen: false,
      appointmentId: null,
      appointmentInfo: '',
      previousStatus: 'pending'
    })
  }

  // Grupiranje rezervacija po datumima
  const appointmentsByDate = useMemo(() => {
    const grouped: Record<string, Appointment[]> = {}
    appointments.forEach(apt => {
      if (!grouped[apt.datum]) {
        grouped[apt.datum] = []
      }
      grouped[apt.datum].push(apt)
    })
    return grouped
  }, [appointments])

  // Sortirani datumi
  const sortedDates = useMemo(() => {
    return Object.keys(appointmentsByDate).sort()
  }, [appointmentsByDate])

  // Filtrirani datumi ako je odabran datum
  const filteredDates = useMemo(() => {
    if (!selectedDate) return sortedDates
    return sortedDates.filter(date => date === selectedDate)
  }, [sortedDates, selectedDate])

  // Vremenski slotovi
  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']

  // Pronalaženje rezervacije za određeni datum i vrijeme
  const getAppointmentForSlot = (date: string, time: string): Appointment | undefined => {
    return appointmentsByDate[date]?.find(apt => apt.vrijeme.substring(0, 5) === time)
  }

  // Formatiranje datuma za prikaz
  const formatDatum = (datum: string) => {
    const date = new Date(datum + 'T00:00:00')
    return date.toLocaleDateString('hr-HR', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Formatiranje vremena za prikaz
  const formatVrijeme = (vrijeme: string) => {
    return vrijeme.substring(0, 5) // HH:MM format
  }

  // Prijevod statusa
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Na čekanju',
      confirmed: 'Potvrđeno',
      cancelled: 'Otkazano'
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'var(--warning-color, #f59e0b)',
      confirmed: 'var(--success-color, #10b981)',
      cancelled: 'var(--error-color, #ef4444)'
    }
    return colors[status] || 'var(--text-light)'
  }

  return (
    <div className="admin-container">
      <Link href="/" className="back-link">← Povratak na početnu</Link>
      
      <div className="admin-header">
        <h1>Admin – Rezervacije</h1>
        <p>Kalendarski pregled svih rezervacija</p>
        
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label>
            <input
              type="radio"
              value="calendar"
              checked={viewMode === 'calendar'}
              onChange={(e) => setViewMode(e.target.value as 'calendar' | 'table')}
            />
            {' '}Kalendarski prikaz
          </label>
          <label>
            <input
              type="radio"
              value="table"
              checked={viewMode === 'table'}
              onChange={(e) => setViewMode(e.target.value as 'calendar' | 'table')}
            />
            {' '}Tablični prikaz
          </label>
          
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            placeholder="Filtriraj po datumu"
            style={{ marginLeft: 'auto', padding: '0.5rem' }}
          />
          {selectedDate && (
            <button
              onClick={() => setSelectedDate('')}
              style={{ padding: '0.5rem 1rem' }}
            >
              Obriši filter
            </button>
          )}
        </div>
      </div>

      {loading && <SkeletonLoader />}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {viewMode === 'calendar' ? (
            // Kalendarski prikaz
            <div className="calendar-view">
              {filteredDates.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  {selectedDate ? 'Nema rezervacija za odabrani datum.' : 'Nema rezervacija.'}
                </div>
              ) : (
                filteredDates.map(date => (
                  <div key={date} className="calendar-day">
                    <h3 className="calendar-day-header">{formatDatum(date)}</h3>
                    <div className="calendar-slots">
                      {timeSlots.map(time => {
                        const appointment = getAppointmentForSlot(date, time)
                        return (
                          <div key={time} className="calendar-slot">
                            <div className="slot-time">{time}</div>
                            {appointment ? (
                              <div className="slot-appointment" data-appointment-id={appointment.id}>
                                <div className="appointment-info">
                                  <strong>{appointment.ime_pacijenta}</strong>
                                  <span>{appointment.usluga}</span>
                                  <span style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                                    {appointment.telefon} / {appointment.email}
                                  </span>
                                </div>
                                <select
                                  className="status-select"
                                  value={appointment.status}
                                  onChange={(e) => 
                                    handleStatusChange(
                                      appointment.id, 
                                      e.target.value as 'pending' | 'confirmed' | 'cancelled',
                                      appointment.status
                                    )
                                  }
                                  disabled={updatingId === appointment.id}
                                  style={{
                                    marginTop: '0.5rem',
                                    width: '100%',
                                    borderColor: getStatusColor(appointment.status)
                                  }}
                                >
                                  <option value="pending">Na čekanju</option>
                                  <option value="confirmed">Potvrđeno</option>
                                  <option value="cancelled">Otkazano</option>
                                </select>
                                {updatingId === appointment.id && (
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                                    Ažuriranje...
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="slot-empty">Slobodno</div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            // Tablični prikaz
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Vrijeme</th>
                  <th>Ime pacijenta</th>
                  <th>Usluga</th>
                  <th>Telefon / Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                      Nema rezervacija.
                    </td>
                  </tr>
                ) : (
                  appointments.map((appointment) => (
                    <tr key={appointment.id} data-appointment-id={appointment.id}>
                      <td>{formatDatum(appointment.datum)}</td>
                      <td>{formatVrijeme(appointment.vrijeme)}</td>
                      <td>{appointment.ime_pacijenta}</td>
                      <td>{appointment.usluga}</td>
                      <td>
                        {appointment.telefon} / {appointment.email}
                      </td>
                      <td>
                        <select
                          className="status-select"
                          value={appointment.status}
                          onChange={(e) => 
                            handleStatusChange(
                              appointment.id, 
                              e.target.value as 'pending' | 'confirmed' | 'cancelled',
                              appointment.status
                            )
                          }
                          disabled={updatingId === appointment.id}
                        >
                          <option value="pending">Na čekanju</option>
                          <option value="confirmed">Potvrđeno</option>
                          <option value="cancelled">Otkazano</option>
                        </select>
                        {updatingId === appointment.id && (
                          <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: 'var(--text-light)' }}>
                            (ažuriranje...)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* Modal za potvrdu otkazivanja */}
      <CancelModal
        isOpen={cancelModal.isOpen}
        onConfirm={handleConfirmCancel}
        onCancel={handleCancelModal}
        appointmentInfo={cancelModal.appointmentInfo}
      />
    </div>
  )
}
