import { useState } from 'react'
import { useNavigate } from 'react-router'
import Header from '../../components/shared/Header'
import { Button } from '../../components/ui/button'
import { useOrderStore } from '../../../stores/orderStore'
import type { ServiceType } from '../../../types'
import { ProgressBar } from './BookingStep1'

interface ServiceOption {
  type: ServiceType
  name: string
  price: string
  cost: number
  desc: string
}

const SERVICES: ServiceOption[] = [
  {
    type: 'REGULER',
    name: 'Ambulans Reguler',
    price: 'Rp 250.000',
    cost: 250000,
    desc: 'Untuk kasus non-darurat, dilengkapi peralatan dasar. Estimasi 15–30 menit.',
  },
  {
    type: 'ICU',
    name: 'Ambulans ICU',
    price: 'Rp 500.000',
    cost: 500000,
    desc: 'Dilengkapi alat medis lengkap dan tenaga medis terlatih. Estimasi 15–30 menit.',
  },
]

export default function BookingStep2() {
  const navigate = useNavigate()
  const setBookingForm = useOrderStore((s) => s.setBookingForm)

  const [selected, setSelected] = useState<ServiceType | null>(null)
  const [error, setError] = useState('')

  const handleNext = () => {
    if (!selected) {
      setError('Pilih tipe layanan terlebih dahulu')
      return
    }
    setBookingForm({ service_type: selected })
    navigate('/booking/step3')
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Header title="Pilih Layanan" showBack />
      <ProgressBar step={2} />

      <div className="flex-1 p-4 space-y-4">
        <p className="text-sm text-gray-600">Pilih tipe layanan yang Anda butuhkan</p>

        <div className="space-y-3">
          {SERVICES.map((svc) => (
            <button
              key={svc.type}
              onClick={() => { setSelected(svc.type); setError('') }}
              className={`w-full p-4 rounded-xl border-2 text-left transition ${
                selected === svc.type
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <p className="font-semibold text-gray-900">{svc.name}</p>
                <p className={`font-bold text-sm ${selected === svc.type ? 'text-blue-600' : 'text-gray-700'}`}>
                  {svc.price}
                </p>
              </div>
              <p className="text-xs text-gray-500">{svc.desc}</p>
            </button>
          ))}
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <Button
          onClick={handleNext}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Lanjut
        </Button>
      </div>
    </div>
  )
}
