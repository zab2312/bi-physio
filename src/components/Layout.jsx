import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import FloatingNav from './FloatingNav'
import Footer from './Footer'
import StickyCTA from './StickyCTA'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {children}
      </main>
      <StickyCTA />
      <FloatingNav />
      <Footer />
    </div>
  )
}

export default Layout

