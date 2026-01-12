import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'

const StickyCTA = () => {
  return (
    <div className="md:hidden fixed bottom-20 left-0 right-0 z-30 px-4 pb-4">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-accent text-white rounded-2xl shadow-xl p-4"
      >
        <Link
          to="/rezervacije"
          className="flex items-center justify-center gap-2 font-bold text-lg w-full"
        >
          <Calendar size={20} />
          <span>Rezerviraj termin</span>
        </Link>
      </motion.div>
    </div>
  )
}

export default StickyCTA

