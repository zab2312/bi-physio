import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { X, Menu } from 'lucide-react'

const navItems = [
  { path: '/', label: 'Naslovna' },
  { path: '/usluge', label: 'Usluge' },
  { path: '/cjenik', label: 'Cjenik' },
  { path: '/o-meni', label: 'O meni' },
  { path: '/kontakt', label: 'Kontakt' },
  { path: '/rezervacije', label: 'Rezervacije' },
]

const FloatingNav = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const toggleNav = () => setIsOpen(!isOpen)
  const closeNav = () => setIsOpen(false)

  return (
    <>
      <motion.button
        onClick={toggleNav}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-accent text-white rounded-full shadow-lg hover:shadow-xl hover:bg-accentDark transition-all flex items-center justify-center md:w-16 md:h-16"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Otvoriti navigaciju"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={closeNav}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed inset-0 z-40 flex items-center justify-center p-6"
            >
              <nav className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <ul className="space-y-4 md:space-y-6">
                  {navItems.map((item, index) => {
                    const isActive = location.pathname === item.path
                    return (
                      <motion.li
                        key={item.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={item.path}
                          onClick={closeNav}
                          className={`block text-2xl md:text-4xl font-bold py-3 px-4 rounded-xl transition-all ${
                            isActive
                              ? 'bg-accent text-white'
                              : 'text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          {item.label}
                        </Link>
                      </motion.li>
                    )
                  })}
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default FloatingNav

