import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, Activity, Stethoscope, Dumbbell, Heart, GraduationCap, Bone } from 'lucide-react'

const Usluge = () => {
  const services = [
    {
      icon: Activity,
      title: 'Rehabilitacija nakon ozljeda',
      description: 'Profesionalna rehabilitacija nakon raznih ozljeda mišića, zglobova i kostiju. Radimo na potpunom oporavku i vraćanju funkcionalnosti. Svaki slučaj je jedinstven i zahtijeva individualan pristup.',
    },
    {
      icon: Stethoscope,
      title: 'Bol u leđima i vratu',
      description: 'Rješavanje problema s kroničnim ili akutnim boli u leđima i vratu. Kombinacija manualne terapije i vježbi koja pomaže u uklanjanju uzroka boli, a ne samo simptoma.',
    },
    {
      icon: Dumbbell,
      title: 'Sportske ozljede',
      description: 'Specijalizirana terapija za sportaše i rekreativce. Razumijem potrebe sportskog organizma i radim na brzom, ali sigurnom povratku u trening i natjecanje.',
    },
    {
      icon: Bone,
      title: 'Terapija koljena i kuka',
      description: 'Intenzivna terapija za probleme s koljenom i kukom. Kombiniram različite metode kako bih pomogao u oporavku i poboljšanju mobilnosti i funkcionalnosti zglobova.',
    },
    {
      icon: Heart,
      title: 'Manualna terapija',
      description: 'Kombinacija različitih tehnika manualne terapije prilagođenih tvojim potrebama. Cilj je smanjiti bol, poboljšati cirkulaciju i vratiti pokretljivost zglobovima i tkivima.',
    },
    {
      icon: GraduationCap,
      title: 'Edukacija i vježbe za kućni program',
      description: 'Naučit ćeš vježbe koje možeš raditi kod kuće kako bi nastavio napredovati između termina. Dobivaš jasne upute i prateće materijale koje možeš koristiti svaki dan.',
    },
  ]

  return (
    <div className="w-full py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            Usluge
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Pružam širok spektar fizioterapijskih usluga prilagođenih tvojim individualnim potrebama. Svaka usluga je dizajnirana kako bi pomogla u tvom oporavku i povratku u aktivnost.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-accent/10 text-accent rounded-xl flex items-center justify-center mb-6">
                  <IconComponent size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">{service.title}</h2>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/rezervacije"
              className="inline-flex items-center gap-2 bg-accent text-white font-bold py-4 px-8 rounded-xl hover:bg-accentDark transition-colors text-lg shadow-lg"
            >
              <Calendar size={24} />
              <span>Rezerviraj termin</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Usluge

