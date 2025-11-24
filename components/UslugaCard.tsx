'use client'

interface UslugaCardProps {
  title: string
  description: string
}

export default function UslugaCard({ title, description }: UslugaCardProps) {
  return (
    <div className="usluga-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

