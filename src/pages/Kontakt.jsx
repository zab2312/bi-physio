import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import { supabase } from '../lib/supabase'

const Kontakt = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Ovde bi se normalno slalo na email servis ili bazu
      // Za sada simulacije, u produkciji koristi Supabase Edge Functions ili email servis
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      setSubmitStatus({ type: 'success', message: 'Poruka je poslana! Odgovorit ću ti uskoro.' })
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Greška pri slanju poruke. Pokušaj ponovno.' })
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
    <div className="w-full py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            Kontakt
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Imaš pitanje ili želiš više informacija? Javi se i odgovorit ću ti što prije.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Kontakt podaci</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">Email</p>
                    <a href="mailto:info@biphysio.hr" className="text-gray-600 hover:text-accent transition-colors">
                      info@biphysio.hr
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">Telefon</p>
                    <a href="tel:+38512345678" className="text-gray-600 hover:text-accent transition-colors">
                      +385 12 345 678
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">Lokacija</p>
                    <p className="text-gray-600">Varšavska ul. 8, 10000 Zagreb</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">Radno vrijeme</p>
                    <div className="text-gray-600 space-y-1">
                      <p>Ponedjeljak petak: 8:00 18:00</p>
                      <p>Subota: 9:00 13:00</p>
                      <p>Nedjelja: Neradno</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg overflow-hidden">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Lokacija</h3>
              <div className="w-full rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2780.923183983806!2d15.972269506241638!3d45.81279678583213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4765d6fce81cfe7f%3A0xb26b2e01ef803abe!2sVar%C5%A1avska%20ul.%208%2C%2010000%2C%20Zagreb!5e0!3m2!1sen!2shr!4v1768208965576!5m2!1sen!2shr"
                  width="100%"
                  height="450"
                  style={{ border: 0, minHeight: '300px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-64 md:h-[450px]"
                  title="BI Physio lokacija"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block font-bold text-gray-900 mb-2">
                    Ime
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="Tvoje ime"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block font-bold text-gray-900 mb-2">
                    Email
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
                  <label htmlFor="message" className="block font-bold text-gray-900 mb-2">
                    Poruka
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                    placeholder="Tvoja poruka..."
                  />
                </div>

                {submitStatus && (
                  <div
                    className={`p-4 rounded-xl ${
                      submitStatus.type === 'success'
                        ? 'bg-green-50 text-green-800'
                        : 'bg-red-50 text-red-800'
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className="w-full bg-accent text-white font-bold py-4 px-6 rounded-xl hover:bg-accentDark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  <span>{isSubmitting ? 'Šalje se...' : 'Pošalji upit'}</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Kontakt

