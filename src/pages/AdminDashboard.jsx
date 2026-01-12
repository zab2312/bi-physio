import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LogOut, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Edit2, 
  Trash2, 
  Settings,
  CheckCircle,
  XCircle,
  Loader
} from 'lucide-react'
import { supabase } from '../lib/supabase'

const AdminDashboard = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    status: '',
  })
  const [editingBooking, setEditingBooking] = useState(null)
  const [showAvailability, setShowAvailability] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      loadBookings()
    }
  }, [user])

  useEffect(() => {
    filterBookings()
  }, [bookings, filters])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/admin')
        return
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (error || !profile || profile.role !== 'admin') {
        await supabase.auth.signOut()
        navigate('/admin')
        return
      }

      setUser(profile)
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: false })
        .order('time', { ascending: false })

      if (error) throw error
      setBookings(data || [])
    } catch (error) {
      console.error('Error loading bookings:', error)
      alert('Greška pri učitavanju rezervacija')
    }
  }

  const filterBookings = () => {
    let filtered = [...bookings]

    if (filters.dateFrom) {
      filtered = filtered.filter(b => b.date >= filters.dateFrom)
    }

    if (filters.dateTo) {
      filtered = filtered.filter(b => b.date <= filters.dateTo)
    }

    if (filters.status) {
      filtered = filtered.filter(b => b.status === filters.status)
    }

    setFilteredBookings(filtered)
  }

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)

      if (error) throw error
      loadBookings()
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Greška pri ažuriranju statusa')
    }
  }

  const handleDelete = async (bookingId) => {
    if (!confirm('Jesi li siguran da želiš obrisati ovu rezervaciju?')) return

    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId)

      if (error) throw error
      loadBookings()
    } catch (error) {
      console.error('Error deleting booking:', error)
      alert('Greška pri brisanju rezervacije')
    }
  }

  const handleSaveEdit = async (updatedData) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update(updatedData)
        .eq('id', editingBooking.id)

      if (error) throw error
      setEditingBooking(null)
      loadBookings()
    } catch (error) {
      console.error('Error updating booking:', error)
      alert('Greška pri ažuriranju rezervacije')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('hr-HR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatTime = (timeString) => {
    return timeString.substring(0, 5)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'novo':
        return 'bg-blue-100 text-blue-800'
      case 'potvrđeno':
        return 'bg-green-100 text-green-800'
      case 'otkazano':
        return 'bg-red-100 text-red-800'
      case 'odrađeno':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-accent" size={48} />
      </div>
    )
  }

  if (!user) {
    return <AdminLogin />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Dobrodošao, {user.full_name || 'Admin'}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAvailability(!showAvailability)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                <Settings size={20} />
                <span>Dostupnost</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-xl hover:bg-red-200 transition-colors font-medium"
              >
                <LogOut size={20} />
                <span>Odjavi se</span>
              </button>
            </div>
          </div>
        </div>

        {showAvailability && (
          <AvailabilitySettings onClose={() => setShowAvailability(false)} />
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Filteri</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Datum od
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Datum do
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">Svi</option>
                <option value="novo">Novo</option>
                <option value="potvrđeno">Potvrđeno</option>
                <option value="otkazano">Otkazano</option>
                <option value="odrađeno">Odrađeno</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ dateFrom: '', dateTo: '', status: '' })}
                className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Resetiraj
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6">
            Rezervacije ({filteredBookings.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-bold text-gray-900">Datum</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-900">Termin</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-900">Klijent</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-900">Kontakt</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-900">Akcije</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span>{formatDate(booking.date)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <span>{formatTime(booking.time)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        <span className="font-medium">{booking.full_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail size={14} className="text-gray-400" />
                          <span>{booking.email}</span>
                        </div>
                        {booking.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone size={14} className="text-gray-400" />
                            <span>{booking.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium border-0 ${getStatusColor(booking.status)}`}
                      >
                        <option value="novo">Novo</option>
                        <option value="potvrđeno">Potvrđeno</option>
                        <option value="otkazano">Otkazano</option>
                        <option value="odrađeno">Odrađeno</option>
                      </select>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingBooking(booking)}
                          className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
                          title="Uredi"
                        >
                          <Edit2 size={18} />
                        </button>
                        {booking.note && (
                          <button
                            onClick={() => alert(booking.note)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Napomena"
                          >
                            <FileText size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Obriši"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredBookings.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Nema rezervacija za odabrane filtere.
              </div>
            )}
          </div>
        </div>

        {editingBooking && (
          <EditBookingModal
            booking={editingBooking}
            onSave={handleSaveEdit}
            onClose={() => setEditingBooking(null)}
          />
        )}
      </div>
    </div>
  )
}

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      // Provjeri je li admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError || !profile || profile.role !== 'admin') {
        await supabase.auth.signOut()
        throw new Error('Nemate pristup admin panelu')
      }

      navigate('/admin')
      window.location.reload()
    } catch (err) {
      setError(err.message || 'Greška pri prijavi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
      >
        <h1 className="text-3xl font-bold mb-2 text-center">Admin Login</h1>
        <p className="text-gray-600 text-center mb-8">BI Physio Admin Panel</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block font-bold text-gray-900 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="admin@biphysio.hr"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-bold text-gray-900 mb-2">
              Lozinka
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-800 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white font-bold py-4 px-6 rounded-xl hover:bg-accentDark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Prijavljujem...' : 'Prijavi se'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

const EditBookingModal = ({ booking, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    full_name: booking.full_name,
    email: booking.email,
    phone: booking.phone || '',
    date: booking.date,
    time: booking.time,
    note: booking.note || '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <h2 className="text-2xl font-bold mb-6">Uredi rezervaciju</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-bold text-gray-900 mb-2">Ime i prezime</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-900 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-900 mb-2">Telefon</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-900 mb-2">Datum</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-900 mb-2">Termin</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time.substring(0, 5)}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value + ':00' })}
                  required
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-gray-900 mb-2">Napomena</label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Odustani
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-accent text-white rounded-xl hover:bg-accentDark transition-colors font-medium"
              >
                Spremi
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

const AvailabilitySettings = ({ onClose }) => {
  const [rules, setRules] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRules()
  }, [])

  const loadRules = async () => {
    try {
      const { data, error } = await supabase
        .from('availability_rules')
        .select('*')
        .order('weekday')

      if (error) throw error
      setRules(data || [])
    } catch (error) {
      console.error('Error loading rules:', error)
    } finally {
      setLoading(false)
    }
  }

  const weekdays = ['Nedjelja', 'Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota']

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Dostupnost</h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <XCircle size={24} />
        </button>
      </div>
      {loading ? (
        <div className="text-center py-8">Učitavanje...</div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-600 mb-4">
            Ovdje možeš upravljati radnim vremenom i dostupnošću. Uređivanje je omogućeno izravno u Supabase bazi podataka.
          </p>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">
              Za uređivanje dostupnosti, koristi Supabase dashboard i tablicu <code className="bg-white px-2 py-1 rounded">availability_rules</code>.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default AdminDashboard

