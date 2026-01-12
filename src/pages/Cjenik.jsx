import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, Check } from 'lucide-react'

const Cjenik = () => {
  const packages = [
    {
      title: 'Prvi pregled',
      duration: '60 minuta',
      price: '350',
      description: 'Detaljna procjena i analiza problema',
      includes: [
        'Detaljna anamneza',
        'Funkcionalno testiranje',
        'Dijagnoza problema',
        'Individualan plan terapije',
      ],
    },
    {
      title: 'Kontrolni tretman',
      duration: '45 minuta',
      price: '250',
      description: 'Nastavak terapije i praćenje napretka',
      includes: [
        'Pregled napretka',
        'Manualna terapija',
        'Vježbe i upute',
        'Prilagodba plana',
      ],
    },
    {
      title: 'Paket Povratak u formu',
      duration: '5 termina',
      price: '1100',
      description: 'Idealno za opće probleme i oporavak',
      includes: [
        '5 termina po 45 minuta',
        'Kompletna procjena',
        'Individualan program vježbi',
        'Praćenje napretka',
        'Upiti između termina',
      ],
      savings: 'Ušteda 150 kn',
    },
    {
      title: 'Paket Sport fokus',
      duration: '8 termina',
      price: '1600',
      description: 'Za sportaše i rekreativce',
      includes: [
        '8 termina po 45 minuta',
        'Detaljna procjena',
        'Sportski program vježbi',
        'Preventivni pristup',
        'Upiti između termina',
        'Praktični savjeti za trening',
      ],
      savings: 'Ušteda 400 kn',
    },
    {
      title: 'Paket Bez boli',
      duration: '10 termina',
      price: '1900',
      description: 'Najpotpuniji paket za dugotrajne probleme',
      includes: [
        '10 termina po 45 minuta',
        'Kompletna procjena',
        'Individualan plan terapije',
        'Kućni program vježbi',
        'Detaljno praćenje',
        'Upiti između termina',
        'Periodične kontrole',
      ],
      savings: 'Ušteda 600 kn',
    },
  ]

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
            Cjenik
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Cijene su informativne i konačna ponuda se potvrđuje nakon prvog pregleda i procjene tvog stanja. Svaki slučaj je jedinstven i prilagođavam pristup tvojim potrebama.
          </p>
          <p className="text-sm text-gray-500">
            Sve cijene su u kunama (kn)
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow ${
                pkg.savings ? 'border-2 border-accent' : ''
              }`}
            >
              {pkg.savings && (
                <div className="bg-accent text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                  {pkg.savings}
                </div>
              )}
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">{pkg.title}</h2>
              <p className="text-gray-600 mb-2">{pkg.duration}</p>
              <p className="text-gray-500 text-sm mb-4">{pkg.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{pkg.price}</span>
                <span className="text-gray-600 ml-2">kn</span>
              </div>
              <ul className="space-y-3 mb-6">
                {pkg.includes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check size={20} className="text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/rezervacije"
                className="block w-full text-center bg-accent text-white font-bold py-3 px-6 rounded-xl hover:bg-accentDark transition-colors"
              >
                Rezerviraj
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl p-6 md:p-8 shadow-lg text-center"
        >
          <p className="text-gray-600 mb-4">
            Nisi siguran koji paket odgovara tvojim potrebama?
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/kontakt"
              className="inline-flex items-center gap-2 bg-accent text-white font-bold py-3 px-6 rounded-xl hover:bg-accentDark transition-colors"
            >
              <span>Pošalji upit</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Cjenik

