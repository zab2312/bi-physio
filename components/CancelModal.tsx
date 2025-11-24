'use client'

import { useEffect, useState } from 'react'

interface CancelModalProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  appointmentInfo?: string
}

export default function CancelModal({ isOpen, onConfirm, onCancel, appointmentInfo }: CancelModalProps) {
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false)
    }
  }, [isOpen])

  const handleCancel = () => {
    setIsClosing(true)
    setTimeout(() => {
      onCancel()
    }, 200)
  }

  if (!isOpen) return null

  return (
    <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Potvrda otkazivanja</h3>
        <p>Želite li stvarno otkazati ovaj termin?</p>
        {appointmentInfo && (
          <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
            {appointmentInfo}
          </p>
        )}
        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
          >
            Da, otkaži termin
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            Ne, odustani
          </button>
        </div>
      </div>
    </div>
  )
}

