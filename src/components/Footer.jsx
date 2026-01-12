import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Calendar } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-4">BI Physio</h3>
            <p className="text-gray-600 mb-4">
              Pomažem ti da se vratiš kretanju bez straha i bez stalne boli.
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:info@biphysio.hr" className="hover:text-accent">info@biphysio.hr</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <a href="tel:+38512345678" className="hover:text-accent">+385 12 345 678</a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Varšavska ul. 8, 10000 Zagreb</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Brzi linkovi</h4>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link to="/usluge" className="hover:text-accent transition-colors">Usluge</Link>
              </li>
              <li>
                <Link to="/cjenik" className="hover:text-accent transition-colors">Cjenik</Link>
              </li>
              <li>
                <Link to="/o-meni" className="hover:text-accent transition-colors">O meni</Link>
              </li>
              <li>
                <Link to="/kontakt" className="hover:text-accent transition-colors">Kontakt</Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h4 className="font-bold text-lg mb-3">Spremni za korak naprijed?</h4>
              <p className="text-gray-600 text-sm mb-4">
                Rezerviraj termin i krenimo korak po korak.
              </p>
              <Link
                to="/rezervacije"
                className="inline-flex items-center justify-center gap-2 bg-accent text-white font-bold py-3 px-6 rounded-xl hover:bg-accentDark transition-colors w-full"
              >
                <Calendar size={20} />
                <span>Rezerviraj termin</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} BI Physio. Sva prava pridržana.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

