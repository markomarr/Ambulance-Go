import { useNavigate } from 'react-router'
import { AlertCircle, Clock, Shield } from 'lucide-react'

export default function LandingScreen() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-white text-center">
        {/* Logo */}
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-3xl" role="img" aria-label="ambulans">🚑</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-3">Ambulance Go</h1>
        <p className="text-blue-100 text-base leading-relaxed max-w-xs">
          Pesan ambulans darurat dengan cepat dan mudah
        </p>

        {/* Feature Highlights */}
        <div className="mt-10 grid grid-cols-3 gap-4 w-full max-w-xs">
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock size={20} />
            </div>
            <p className="text-xs text-blue-100">Respons Cepat</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-red-500/80 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertCircle size={20} />
            </div>
            <p className="text-xs text-blue-100">24/7 Darurat</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Shield size={20} />
            </div>
            <p className="text-xs text-blue-100">Terpercaya</p>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="px-6 pb-10 space-y-3">
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-white text-blue-700 font-semibold py-4 rounded-xl text-base shadow-lg hover:bg-blue-50 transition active:scale-95"
        >
          Masuk
        </button>
        <button
          onClick={() => navigate('/register')}
          className="w-full bg-transparent border-2 border-white text-white font-semibold py-4 rounded-xl text-base hover:bg-white/10 transition active:scale-95"
        >
          Daftar
        </button>
        <p className="text-center text-blue-200 text-xs pt-1">
          Layanan tersedia di Jakarta dan sekitarnya
        </p>
      </div>
    </div>
  )
}
