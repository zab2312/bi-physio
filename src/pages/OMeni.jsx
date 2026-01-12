import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar } from 'lucide-react'

const OMeni = () => {
  return (
    <div className="w-full py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            O meni
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <img
            src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=1200&h=800&fit=crop&q=80"
            alt="Borna Idrizović"
            className="w-full h-64 md:h-96 object-cover rounded-2xl mb-8"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="prose prose-lg max-w-none"
        >
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p className="text-xl md:text-2xl">
              Zovem se Borna Idrizović i bavim se fizioterapijom iz strasti i iskustva koje sam sam proživio.
            </p>

            <p>
              Prije nego što sam postao fizioterapeut, bio sam nogometaš koji je sanjao velike snove. Trening za treningom, utakmica za utakmicom, sve je išlo po planu dok se nije dogodilo. Ozljeda koljena koja je promijenila sve. Nakon te ozljede doživio sam prekretnicu koja me usmjerila na put fizioterapije. Shvatio sam koliko je važno imati nekoga tko razumije što prolaziš, tko zna kako je osjećati se ranjivo i ne moći se kretati onako kako želiš. Ta iskustva su me motivirala da se posvetim pomaganju drugima kroz ono što sam i sam prošao.
            </p>

            <p>
              Moj pristup fizioterapiji temelji se na empatiji i razumijevanju. Vjerujem da je ključ uspjeha u tome da pacijent razumije što se događa u njegovom tijelu, zašto se pojavila bol i kako možemo zajedno raditi na rješavanju problema. Ne prodajem magična rješenja, već realne i dokazane metode koje vode prema oporavku. Radim jednako posvećeno s rekreativcima koji žele vratiti se svojoj omiljenoj aktivnosti i s profesionalnim sportašima koji se natječu na najvišoj razini. Za mene nema razlike u posvećenosti i kvaliteti rada.
            </p>

            <p>
              Moja filozofija rada je jednostavna: svaki pacijent zaslužuje individualan pristup, strpljivost i stručnost. Ne radim samo na tome da smanjim bol ili vratim pokretljivost, već radim na tome da pacijent razumije svoje tijelo, nauči kako ga štititi i kako nastaviti napredovati i nakon što terapija završi. To je za mene pravi uspjeh kada vidim da se neko vrati u aktivnost sigurniji, jаči i informiraniji o svom tijelu.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center"
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

export default OMeni

