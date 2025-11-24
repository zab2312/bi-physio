import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BI Physio – Stručna fizioterapija za vaše zdravlje',
  description: 'Pružamo profesionalne fizioterapijske usluge prilagođene vašim potrebama.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hr">
      <body>{children}</body>
    </html>
  )
}

