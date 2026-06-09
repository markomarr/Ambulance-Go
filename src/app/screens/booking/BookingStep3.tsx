import { Navigate, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { CheckCircle } from 'lucide-react'
import Header from '../../components/shared/Header'
import { Button } from '../../components/ui/button'
import { useAuthStore } from '../../../stores/authStore'
import { useOrderStore } from '../../../stores/orderStore'
import { ProgressBar } from './BookingStep1'

const SERVICE_LABEL: Record<string, string> = {
  REGULER: 'Ambulans Reguler',
  ICU: 'Ambulans ICU',
}

const COST_LABEL: Record<string, string> = {
  REGULER: 'Rp 250.000',
  ICU: 'Rp 500.000',
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export default function BookingStep3() {
  const navigate = useNavigate()
  const session = useAuthStore((s) => s.session)
  const bookingForm = useOrderStore((s) => s.bookingForm)
  const createOrder = useOrderStore((s) => s.createOrder)
  const isLoading = useOrderStore((s) => s.isLoading)

  // Guard: redirect if form is incomplete
  if (!bookingForm.pickup_address || !bookingForm.destination_address || !bookingForm.service_type) {
    return <Navigate to="/booking/step1" replace />
  }

  const handleConfirm = async () => {
    if (!session?.user) return

    const { order, error } = await createOrder({
      userId: session.user.id,
      pickup_address: bookingForm.pickup_address!,
      destination_address: bookingForm.destination_address!,
      service_type: bookingForm.service_type!,
    })

    if (error) {
      toast.error(error)
    } else if (order) {
      navigate(`/confirmation/${order.id}`)
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Header title="Konfirmasi Pesanan" showBack />
      <ProgressBar step={3} />

      <div className="flex-1 p-4 space-y-4">
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <h3 className="font-semibold text-gray-900">Ringkasan Pesanan</h3>

          <div className="space-y-2.5 text-sm divide-y divide-gray-100">
            <div className="space-y-0.5 pb-2">
              <p className="text-xs text-gray-400">Alamat Penjemputan</p>
              <p className="text-gray-900">{bookingForm.pickup_address}</p>
            </div>
            <div className="space-y-0.5 py-2">
              <p className="text-xs text-gray-400">Alamat Tujuan</p>
              <p className="text-gray-900">{bookingForm.destination_address}</p>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500">Tipe Layanan</span>
              <span className="text-gray-900 font-medium">{SERVICE_LABEL[bookingForm.service_type]}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500">Estimasi Biaya</span>
              <span className="text-blue-600 font-bold">{COST_LABEL[bookingForm.service_type]}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-gray-500">Estimasi Waktu</span>
              <span className="text-gray-900">15–30 menit</span>
            </div>
          </div>
        </div>

        <Button
          onClick={handleConfirm}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
        >
          {isLoading ? (
            <><Spinner /> Memproses...</>
          ) : (
            <><CheckCircle size={18} /> Konfirmasi Pesanan</>
          )}
        </Button>
      </div>
    </div>
  )
}
