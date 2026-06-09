import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { ChevronRight } from 'lucide-react'
import Header from '../../components/shared/Header'
import BottomNav from '../../components/shared/BottomNav'
import { useAuthStore } from '../../../stores/authStore'
import { useOrderStore } from '../../../stores/orderStore'
import { formatDate, formatCurrency, getStatusColor, getStatusLabel } from '../../../lib/utils'

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 p-4 rounded-xl animate-pulse space-y-2">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-5 bg-gray-200 rounded w-16" />
      </div>
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-3 bg-gray-100 rounded w-2/5" />
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-100 rounded w-1/4" />
        <div className="h-4 bg-gray-100 rounded w-4" />
      </div>
    </div>
  )
}

export default function OrderHistoryScreen() {
  const navigate = useNavigate()
  const session = useAuthStore((s) => s.session)
  const orderHistory = useOrderStore((s) => s.orderHistory)
  const isLoading = useOrderStore((s) => s.isLoading)
  const fetchOrderHistory = useOrderStore((s) => s.fetchOrderHistory)

  useEffect(() => {
    if (!session?.user) return
    fetchOrderHistory(session.user.id).catch(() => {
      toast.error('Gagal memuat riwayat pesanan')
    })
  }, [session?.user?.id, fetchOrderHistory])

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Header title="Riwayat Pesanan" />
      <div className="flex-1 p-4 space-y-3 overflow-auto pb-20">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : orderHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <div className="text-6xl">📋</div>
            <p className="text-gray-500 text-sm">Belum ada riwayat pesanan</p>
            <p className="text-xs text-gray-400 text-center">
              Pesan ambulans pertama Anda dari beranda
            </p>
          </div>
        ) : (
          orderHistory.map((order) => (
            <div
              key={order.id}
              onClick={() => navigate(`/orders/${order.id}`)}
              className="bg-white border border-gray-200 p-4 rounded-xl cursor-pointer hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-start mb-1">
                <p className="text-sm font-medium text-gray-900">
                  #{order.order_number || order.id.slice(0, 8)}
                </p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(order.status)}`}
                >
                  {getStatusLabel(order.status)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-1">
                {order.service_type === 'ICU' ? 'Ambulans ICU' : 'Ambulans Reguler'}
              </p>
              <p className="text-xs text-gray-400 mb-2">{formatDate(order.created_at)}</p>
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-gray-700">
                  {formatCurrency(order.estimated_cost)}
                </p>
                <ChevronRight className="text-gray-400" size={18} />
              </div>
            </div>
          ))
        )}
      </div>
      <BottomNav />
    </div>
  )
}
