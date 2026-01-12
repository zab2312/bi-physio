import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, Send } from 'lucide-react'

const Home = () => {
  return (
    <div className="w-full">
      <HeroSection />
      <PovratakUPokretSection />
      <ZastoBIPhysioSection />
      <RecenzijeSection />
      <CTASection />
    </div>
  )
}

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop&q=80"
          alt="Fizioterapija"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/80 to-white/60" />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 md:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-gray-900">
            BI Physio
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Pomažem ti da se vratiš kretanju bez straha i bez stalne boli
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/kontakt"
                className="inline-flex items-center gap-2 bg-white text-accent font-bold py-4 px-8 rounded-xl border-2 border-accent hover:bg-gray-50 transition-colors text-lg shadow-lg"
              >
                <Send size={24} />
                <span>Pošalji upit</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const PovratakUPokretSection = () => {
  const steps = [
    { title: 'Procjena', description: 'Detaljna analiza problema i uzroka boli' },
    { title: 'Plan', description: 'Individualan plan terapije prilagođen tvojim potrebama' },
    { title: 'Terapija', description: 'Stručna terapija i vježbe za oporavak' },
    { title: 'Edukacija', description: 'Jasne upute i vježbe za kućni program' },
    { title: 'Progres', description: 'Praćenje napretka i usklađivanje plana' },
  ]

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Povratak u pokret
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Moj pristup temelji se na pet ključnih koraka: procjena, plan, terapija, edukacija i progres. Svaki korak je važan i svi zajedno vode prema tvom potpunom oporavku i povratku u aktivnost bez boli.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-6 md:gap-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-50 rounded-2xl p-6 text-center"
            >
              <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {index + 1}
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const ZastoBIPhysioSection = () => {
  const benefits = [
    {
      title: 'Individualan plan',
      description: 'Svaki plan terapije je prilagođen tvojim specifičnim potrebama i ciljevima. Ne koristim generičke rješenja, već radimo zajedno na planu koji je pravi za tebe.',
    },
    {
      title: 'Fokus na uzroku',
      description: 'Ne liječim samo simptome, već tražim i radim na uzroku problema. To osigurava dugotrajno rješenje i sprječava povratak problema.',
    },
    {
      title: 'Brži povrat funkcije',
      description: 'Kombinacijom dokazanih metoda i prilagođenih vježbi, ubrzavam tvoj oporavak i povratak u punu funkcionalnost.',
    },
    {
      title: 'Jasne upute za kućni program',
      description: 'Dobivaš jasne i jednostavne upute za vježbe koje možeš raditi kod kuće. To ti omogućava da nastaviš napredovati između termina.',
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Zašto BI Physio
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const RecenzijeSection = () => {
  const reviews = [
    {
      name: 'Ivana',
      text: 'Borna mi je pomogao vratiti se trčanju nakon ozljede koljena. Njegov pristup je bio strpljiv, profesionalan i rezultati su vidljivi već nakon nekoliko tretmana. Preporučam svima.',
    },
    {
      name: 'Marko',
      text: 'Radi sa sportašima i rekreativcima jednako posvećeno. Moja bol u leđima nestala je, a dobio sam i odlične upute za vježbe koje radim kod kuće. Hvala ti Borna.',
    },
    {
      name: 'Petra',
      text: 'Najbolja stvar je što razumije što se događa u tijelu i objašnjava na jednostavan način. Osjećam se sigurno i znam da napredujem. Svaki termin donosi rezultate.',
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Recenzije
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-50 rounded-2xl p-6 md:p-8"
            >
              <div className="mb-4">
                <div className="flex text-yellow-400 text-xl mb-2">
                  {'★'.repeat(5)}
                </div>
                <p className="text-gray-600 leading-relaxed">{review.text}</p>
              </div>
              <p className="font-bold text-gray-900">— {review.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const CTASection = () => {
  return (
    <section className="py-16 md:py-24 bg-accent text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Vrijeme je da se osjećaš sigurnije u svom tijelu
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Rezerviraj termin i krenimo korak po korak
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/rezervacije"
              className="inline-flex items-center gap-2 bg-white text-accent font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-colors text-lg shadow-lg"
            >
              <Calendar size={24} />
              <span>Rezerviraj termin</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Home

