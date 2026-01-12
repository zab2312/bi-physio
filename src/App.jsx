import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Usluge from './pages/Usluge'
import Cjenik from './pages/Cjenik'
import OMeni from './pages/OMeni'
import Kontakt from './pages/Kontakt'
import Rezervacije from './pages/Rezervacije'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/usluge" element={<Usluge />} />
          <Route path="/cjenik" element={<Cjenik />} />
          <Route path="/o-meni" element={<OMeni />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="/rezervacije" element={<Rezervacije />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

