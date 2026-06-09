import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { toast } from 'sonner'
import Header from '../../components/shared/Header'
import { Button } from '../../components/ui/button'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '../../components/ui/alert-dialog'
import { supabase } from '../../../lib/supabase'
import { useAuthStore } from '../../../stores/authStore'
import { useOrderStore } from '../../../stores/orderStore'
import { formatDate, formatCurrency, getStatusColor, getStatusLabel } from '../../../lib/utils'
import type { Order, Driver } from '../../../types'

export default function OrderDetailScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const session = useAuthStore((s) => s.session)
  const cancelOrder = useOrderStore((s) => s.cancelOrder)

  const [order, setOrder] = useState<Order | null>(null)
  const [driver, setDriver] = useState<Driver | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  useEffect(() => {
    if (!id) return
    const load = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        toast.error('Pesanan tidak ditemukan')
        navigate(-1)
        return
      }

      const fetchedOrder = data as Order
      setOrder(fetchedOrder)

      if (fetchedOrder.driver_id) {
        const { data: driverData } = await supabase
          .from('drivers')
          .select('*')
          .eq('id', fetchedOrder.driver_id)
          .single()
        if (driverData) setDriver(driverData as Driver)
      }

      setLoading(false)
    }
    load()
  }, [id, navigate])

  const handleCancel = async () => {
    if (!id || !session?.user) return
    setCancelling(true)
    const { error } = await cancelOrder(id, session.user.id)
    setCancelling(false)
    setShowCancelDialog(false)
    if (error) {
      toast.error(error)
    } else {
      toast.success('Pesanan dibatalkan')
      navigate(-1)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col flex-1 min-h-screen">
        <Header title="Detail Pesanan" showBack />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </div>
    )
  }

  if (!order) return null

  const canCancel = order.status === 'PENDING' || order.status === 'CONFIRMED'
  const canPay = order.status === 'COMPLETED' && order.payment_status === 'UNPAID'

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Header title="Detail Pesanan" showBack />
      <div className="flex-1 p-4 space-y-4 overflow-auto pb-6">
        <div className="bg-white border border-gray-200 p-4 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">Nomor Pesanan</p>
            <p className="text-sm font-semibold text-blue-600">
              #{order.order_number || order.id.slice(0, 8)}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">Status</p>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(order.status)}`}
            >
              {getStatusLabel(order.status)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">Tgl. Dibuat</p>
            <p className="text-xs text-gray-700">{formatDate(order.created_at)}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-xl space-y-3">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Alamat Penjemputan</p>
            <p className="text-sm text-gray-800">{order.pickup_address}</p>
          </div>
          <div className="border-t pt-3">
            <p className="text-xs text-gray-500 mb-0.5">Alamat Tujuan</p>
            <p className="text-sm text-gray-800">{order.destination_address || '—'}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">Tipe Layanan</p>
            <p className="text-sm">
              {order.service_type === 'ICU' ? 'Ambulans ICU' : 'Ambulans Reguler'}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">Estimasi Biaya</p>
            <p className="text-sm font-semibold">{formatCurrency(order.estimated_cost)}</p>
          </div>
          {order.final_cost !== null && (
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">Biaya Final</p>
              <p className="text-sm font-semibold">{formatCurrency(order.final_cost)}</p>
            </div>
          )}
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">Status Pembayaran</p>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                order.payment_status === 'PAID'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {order.payment_status === 'PAID' ? 'Lunas' : 'Belum Dibayar'}
            </span>
          </div>
        </div>

        {driver && (
          <div className="bg-white border border-gray-200 p-4 rounded-xl space-y-2">
            <p className="text-xs text-gray-500 mb-1">Informasi Driver</p>
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">Nama Driver</p>
              <p className="text-sm">{driver.name}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">Plat Nomor</p>
              <p className="text-sm">{driver.license_plate}</p>
            </div>
          </div>
        )}

        {canCancel && (
          <Button
            onClick={() => setShowCancelDialog(true)}
            className="w-full bg-red-600 hover:bg-red-700 text-white h-12"
          >
            Batalkan Pesanan
          </Button>
        )}
        {canPay && (
          <Button
            onClick={() => navigate(`/payment/${order.id}`)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
          >
            Bayar Sekarang
          </Button>
        )}
      </div>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Batalkan Pesanan?</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin membatalkan pesanan ini? Tindakan ini tidak dapat diurungkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              disabled={cancelling}
            >
              Tidak
            </Button>
            <Button
              onClick={handleCancel}
              disabled={cancelling}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {cancelling ? 'Membatalkan...' : 'Ya, Batalkan'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
