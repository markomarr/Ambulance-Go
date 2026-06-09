import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { MapPin } from 'lucide-react'
import Header from '../../components/shared/Header'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Label } from '../../components/ui/label'
import { useOrderStore } from '../../../stores/orderStore'

interface Step1Errors {
  pickup: string
  destination: string
}

function ProgressBar({ step }: { step: 1 | 2 | 3 }) {
  const labels = ['1. Lokasi', '2. Layanan', '3. Konfirmasi']
  return (
    <div className="px-4 pt-4 pb-2">
      <div className="flex justify-between text-xs mb-2">
        {labels.map((label, i) => (
          <span key={label} className={i < step ? 'text-blue-600 font-medium' : 'text-gray-400'}>
            {label}
          </span>
        ))}
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full">
        <div
          className="h-full bg-blue-600 rounded-full transition-all"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>
    </div>
  )
}

export { ProgressBar }

export default function BookingStep1() {
  const navigate = useNavigate()
  const setBookingForm = useOrderStore((s) => s.setBookingForm)

  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [gpsLoading, setGpsLoading] = useState(false)
  const [errors, setErrors] = useState<Step1Errors>({ pickup: '', destination: '' })

  const useCurrentLocation = () => {
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setPickup(`GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`)
        setGpsLoading(false)
      },
      () => {
        toast.error('Tidak dapat mengakses lokasi GPS')
        setGpsLoading(false)
      }
    )
  }

  const validate = (): boolean => {
    const next: Step1Errors = { pickup: '', destination: '' }
    let valid = true
    if (!pickup.trim()) { next.pickup = 'Field ini wajib diisi'; valid = false }
    if (!destination.trim()) { next.destination = 'Field ini wajib diisi'; valid = false }
    setErrors(next)
    return valid
  }

  const handleNext = () => {
    if (!validate()) return
    setBookingForm({ pickup_address: pickup.trim(), destination_address: destination.trim() })
    navigate('/booking/step2')
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Header title="Pesan Ambulans" showBack />
      <ProgressBar step={1} />

      <div className="flex-1 p-4 space-y-4">
        <div className="space-y-1">
          <Label htmlFor="pickup">Alamat Penjemputan</Label>
          <div className="flex gap-2">
            <Input
              id="pickup"
              type="text"
              placeholder="Masukkan alamat penjemputan"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              aria-invalid={!!errors.pickup}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={useCurrentLocation}
              disabled={gpsLoading}
              className="shrink-0 px-3"
              title="Gunakan Lokasi Saat Ini"
            >
              {gpsLoading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <MapPin size={18} />
              )}
            </Button>
          </div>
          {errors.pickup && <p className="text-xs text-red-500">{errors.pickup}</p>}
          <p className="text-xs text-gray-400">Tekan ikon peta untuk mengisi otomatis dari GPS</p>
        </div>

        <div className="space-y-1">
          <Label htmlFor="destination">Alamat Tujuan</Label>
          <Input
            id="destination"
            type="text"
            placeholder="Masukkan tujuan (rumah sakit/klinik)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            aria-invalid={!!errors.destination}
          />
          {errors.destination && <p className="text-xs text-red-500">{errors.destination}</p>}
        </div>

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
