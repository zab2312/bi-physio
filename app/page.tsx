'use client'

import Image from 'next/image'
import Link from 'next/link'
import RezervacijaForma from '@/components/RezervacijaForma'
import SmoothScroll from '@/app/components/SmoothScroll'
import ScrollAnimation from '@/components/ScrollAnimation'
import UslugaCard from '@/components/UslugaCard'

export default function Home() {
  return (
    <>
      <SmoothScroll />
      {/* Navigacija */}
      <header className="header">
        <nav className="nav">
          <ul className="nav-links">
            <li><Link href="#pocetna">Početna</Link></li>
            <li><Link href="#usluge">Usluge</Link></li>
            <li><Link href="#o-nama">O nama</Link></li>
            <li><Link href="#kontakt">Kontakt</Link></li>
          </ul>
        </nav>
      </header>

      {/* Hero sekcija */}
      <main>
        <section id="pocetna" className="hero">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title-main">BI Physio</h1>
              <h2 className="hero-title-sub">Stručna fizioterapija za vaše zdravlje</h2>
              <p>Pružamo profesionalne fizioterapijske usluge prilagođene vašim potrebama. Naš tim stručnjaka posvećen je vašem oporavku i poboljšanju kvalitete života.</p>
              <div className="hero-button-wrapper">
                <Link href="#kontakt" className="btn btn-primary">Rezerviraj termin</Link>
              </div>
            </div>
            <div className="hero-image">
              <Image 
                src="/hero.webp" 
                alt="BI Physio fizioterapija" 
                width={600}
                height={400}
                priority
                unoptimized
              />
            </div>
          </div>
        </section>

        {/* Usluge */}
        <section id="usluge" className="usluge">
          <div className="container">
            <ScrollAnimation>
              <h2>Naše usluge</h2>
            </ScrollAnimation>
            <div className="usluge-grid">
              <UslugaCard 
                title="Kineziterapija"
                description="Individualni programi vježbanja za oporavak nakon ozljeda i poboljšanje pokretljivosti."
              />
              <UslugaCard 
                title="Manualna terapija"
                description="Stručne manipulacije i mobilizacije za ublažavanje boli i poboljšanje funkcije zglobova."
              />
              <UslugaCard 
                title="Fizikalna terapija"
                description="Korištenje ultrazvuka, elektroterapije i drugih fizikalnih metoda za ubrzanje oporavka."
              />
              <UslugaCard 
                title="Rehabilitacija sportaša"
                description="Specijalizirani programi oporavka za sportaše nakon ozljeda i operacija."
              />
              <UslugaCard 
                title="Terapija boli u leđima"
                description="Kompleksni pristup liječenju kroničnih i akutnih problema s leđima."
              />
              <UslugaCard 
                title="Posturalna korekcija"
                description="Procjena i korekcija posturalnih problema kroz individualne programe vježbanja."
              />
            </div>
          </div>
        </section>

        {/* O nama */}
        <section id="o-nama" className="o-nama">
          <div className="container">
            <ScrollAnimation>
              <div className="o-nama-content">
              <div className="o-nama-text">
                <h2>O nama</h2>
                <p>BI Physio je moderna fizioterapijska ordinacija posvećena pružanju najkvalitetnijih usluga našim pacijentima. Naš tim sastoji se od iskusnih fizioterapeuta koji kontinuirano usavršavaju svoje vještine kroz edukacije i praćenje najnovijih trendova u fizioterapiji.</p>
                <p>Koristimo dokazane metode liječenja i individualno pristupamo svakom pacijentu, osiguravajući optimalne rezultate terapije. Naša misija je pomoći vam da postignete svoje ciljeve u oporavku i poboljšanju kvalitete života.</p>
                <p>Radimo s pacijentima svih dobnih skupina i različitih stanja – od sportskih ozljeda do kroničnih bolesti i postoperativne rehabilitacije.</p>
              </div>
              <div className="o-nama-image">
                <Image 
                  src="/logo.webp" 
                  alt="BI Physio logo" 
                  width={600}
                  height={400}
                  unoptimized
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Kontakt i rezervacije */}
        <section id="kontakt" className="kontakt">
          <div className="container">
            <ScrollAnimation>
              <h2>Kontakt i rezervacije</h2>
            </ScrollAnimation>
            <div className="kontakt-content">
              <RezervacijaForma />
              <div className="kontakt-info">
                <h3>Kontakt podaci</h3>
                <div className="kontakt-item">
                  <strong>Adresa:</strong>
                  <p>Primjer ulice 123<br />10000 Zagreb, Hrvatska</p>
                </div>
                <div className="kontakt-item">
                  <strong>Telefon:</strong>
                  <p><a href="tel:+385123456789">+385 1 234 567 89</a></p>
                </div>
                <div className="kontakt-item">
                  <strong>Email:</strong>
                  <p><a href="mailto:info@biphysio.hr">info@biphysio.hr</a></p>
                </div>
                <div className="kontakt-item">
                  <strong>Radno vrijeme:</strong>
                  <p>Ponedjeljak - Petak: 08:00 - 20:00<br />Subota: 09:00 - 14:00<br />Nedjelja: Zatvoreno</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>BI Physio</h3>
              <p>Stručna fizioterapija za vaše zdravlje</p>
            </div>
            <div className="footer-section">
              <h4>Brzi linkovi</h4>
              <ul>
                <li><Link href="#pocetna">Početna</Link></li>
                <li><Link href="#usluge">Usluge</Link></li>
                <li><Link href="#o-nama">O nama</Link></li>
                <li><Link href="#kontakt">Kontakt</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Društvene mreže</h4>
              <div className="social-links">
                <a href="#" aria-label="Facebook">Facebook</a>
                <a href="#" aria-label="Instagram">Instagram</a>
                <a href="#" aria-label="LinkedIn">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 BI Physio. Sva prava pridržana.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

