import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { CheckCircle } from 'lucide-react'
import Header from '../../components/shared/Header'
import { Button } from '../../components/ui/button'
import { supabase } from '../../../lib/supabase'
import { useOrderStore } from '../../../stores/orderStore'
import type { Driver, Order } from '../../../types'

const SERVICE_LABEL: Record<string, string> = {
  REGULER: 'Ambulans Reguler',
  ICU: 'Ambulans ICU',
}

const COST_LABEL: Record<string, string> = {
  REGULER: 'Rp 250.000',
  ICU: 'Rp 500.000',
}

export default function ConfirmationScreen() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const fetchOrder = useOrderStore((s) => s.fetchOrder)
  const clearBookingForm = useOrderStore((s) => s.clearBookingForm)

  const [order, setOrder] = useState<Order | null>(null)
  const [driver, setDriver] = useState<Driver | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      navigate('/home', { replace: true })
      return
    }

    const init = async () => {
      const fetched = await fetchOrder(id)
      if (!fetched) {
        toast.error('Pesanan tidak ditemukan')
        navigate('/home', { replace: true })
        return
      }
      setOrder(fetched)

      if (fetched.driver_id) {
        const { data } = await supabase
          .from('drivers')
          .select('*')
          .eq('id', fetched.driver_id)
          .single()
        if (data) setDriver(data as Driver)
      }

      clearBookingForm()
      setLoading(false)
    }

    init()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col flex-1 min-h-screen">
        <Header title="Pesanan Dikonfirmasi" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </div>
    )
  }

  if (!order) return null

  const orderLabel = order.order_number || `#${order.id.slice(0, 8).toUpperCase()}`

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Header title="Pesanan Dikonfirmasi" />

      <div className="flex-1 p-4 space-y-4 overflow-auto">
        {/* Success icon */}
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h2 className="text-xl font-semibold text-green-600">Pesanan Dikonfirmasi!</h2>
          <p className="text-sm text-gray-500 mt-1">Ambulans sedang menuju lokasi Anda</p>
        </div>

        {/* Order summary */}
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          <div className="flex justify-between items-center p-4">
            <span className="text-sm text-gray-500">Nomor Pesanan</span>
            <span className="text-blue-600 font-semibold">{orderLabel}</span>
          </div>
          <div className="flex justify-between items-center p-4">
            <span className="text-sm text-gray-500">Estimasi Waktu</span>
            <span className="text-gray-900">15–30 menit</span>
          </div>
          <div className="flex justify-between items-center p-4">
            <span className="text-sm text-gray-500">Driver</span>
            <span className="text-gray-900">{driver?.name ?? 'Menunggu driver...'}</span>
          </div>
          <div className="flex justify-between items-center p-4">
            <span className="text-sm text-gray-500">Tipe Layanan</span>
            <span className="text-gray-900">{SERVICE_LABEL[order.service_type]}</span>
          </div>
          <div className="flex justify-between items-center p-4">
            <span className="text-sm text-gray-500">Estimasi Biaya</span>
            <span className="text-blue-600 font-bold">{COST_LABEL[order.service_type]}</span>
          </div>
        </div>

        <Button
          onClick={() => navigate(`/tracking/${order.id}`)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Lacak Ambulans
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/home', { replace: true })}
          className="w-full"
        >
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  )
}
