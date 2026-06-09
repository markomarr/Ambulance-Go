import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { Phone } from 'lucide-react'
import Header from '../../components/shared/Header'
import { Button } from '../../components/ui/button'
import { useOrderStore } from '../../../stores/orderStore'

const TOTAL_SECONDS = 30 * 60

export default function EmergencyScreen() {
  const navigate = useNavigate()
  const currentOrder = useOrderStore((s) => s.currentOrder)
  const [remaining, setRemaining] = useState(TOTAL_SECONDS)

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  if (!currentOrder) {
    return <Navigate to="/home" replace />
  }

  const minutes = String(Math.floor(remaining / 60)).padStart(2, '0')
  const seconds = String(remaining % 60).padStart(2, '0')
  const orderLabel = currentOrder.order_number || `#${currentOrder.id.slice(0, 8).toUpperCase()}`

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Header title="Bantuan Darurat" />

      <div className="flex-1 p-4 space-y-4 overflow-auto">
        {/* Alert */}
        <div className="bg-red-600 text-white p-6 rounded-xl text-center">
          <p className="text-lg font-bold">Ambulans Sedang Dalam Perjalanan</p>
          <p className="text-sm opacity-90 mt-1">Tetap tenang, bantuan segera tiba</p>
        </div>

        {/* Order number */}
        <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">Nomor Pesanan</span>
          <span className="text-blue-600 font-semibold">{orderLabel}</span>
        </div>

        {/* Countdown */}
        <div className="bg-white border-2 border-red-100 rounded-xl p-6 text-center shadow-sm">
          <p className="text-sm text-gray-500 mb-2">Estimasi Kedatangan</p>
          <div className="text-6xl font-mono font-bold text-red-600 tracking-widest">
            {minutes}:{seconds}
          </div>
          <p className="text-xs text-gray-400 mt-3">Countdown dimulai dari 30 menit</p>
        </div>

        {/* Track button */}
        <Button
          onClick={() => navigate(`/tracking/${currentOrder.id}`)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Lacak Ambulans
        </Button>

        {/* Emergency hotline */}
        <a
          href="tel:119"
          className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-semibold transition"
        >
          <Phone size={18} />
          Hubungi 119 (Darurat Nasional)
        </a>
      </div>
    </div>
  )
}
