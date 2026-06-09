import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { CreditCard, Wallet, Building2 } from 'lucide-react'
import Header from '../../components/shared/Header'
import { Button } from '../../components/ui/button'
import { useOrderStore } from '../../../stores/orderStore'
import { formatCurrency } from '../../../lib/utils'
import type { PaymentMethod } from '../../../types'

const METHODS: { type: PaymentMethod; label: string; Icon: React.ElementType }[] = [
  { type: 'CREDIT_CARD', label: 'Kartu Kredit', Icon: CreditCard },
  { type: 'DIGITAL_WALLET', label: 'Dompet Digital', Icon: Wallet },
  { type: 'BANK_TRANSFER', label: 'Transfer Bank', Icon: Building2 },
]

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export default function PaymentScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const fetchOrder = useOrderStore((s) => s.fetchOrder)
  const currentOrder = useOrderStore((s) => s.currentOrder)
  const updatePayment = useOrderStore((s) => s.updatePayment)

  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [selected, setSelected] = useState<PaymentMethod | null>(null)
  const [methodError, setMethodError] = useState('')

  useEffect(() => {
    if (!id) {
      navigate('/orders', { replace: true })
      return
    }
    fetchOrder(id).then((order) => {
      setLoading(false)
      if (!order || order.payment_status === 'PAID') {
        navigate('/orders', { replace: true })
      }
    })
  }, [id, fetchOrder, navigate])

  const handlePay = async () => {
    if (!selected) {
      setMethodError('Pilih metode pembayaran terlebih dahulu')
      return
    }
    if (!id) return
    setPaying(true)
    const { error } = await updatePayment(id, selected)
    setPaying(false)
    if (error) {
      toast.error(error)
    } else {
      toast.success('Pembayaran berhasil!')
      navigate('/orders', { replace: true })
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col flex-1 min-h-screen">
        <Header title="Pembayaran" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Header title="Pembayaran" />
      <div className="flex-1 p-4 space-y-4 overflow-auto">
        <div className="bg-gray-800 text-white p-5 rounded-xl">
          <p className="text-xs opacity-75 mb-1">Nomor Pesanan</p>
          <p className="text-sm mb-3">#{currentOrder?.order_number || id?.slice(0, 8)}</p>
          <p className="text-xs opacity-75 mb-1">Tipe Layanan</p>
          <p className="text-sm mb-3">
            {currentOrder?.service_type === 'ICU' ? 'Ambulans ICU' : 'Ambulans Reguler'}
          </p>
          <p className="text-xs opacity-75 mb-1">Total Biaya</p>
          <p className="text-3xl font-bold">{formatCurrency(currentOrder?.estimated_cost ?? 0)}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-700 font-medium">Metode Pembayaran</p>
          {METHODS.map(({ type, label, Icon }) => (
            <button
              key={type}
              onClick={() => {
                setSelected(type)
                setMethodError('')
              }}
              className={`w-full p-4 rounded-xl border-2 text-left transition flex items-center gap-3 ${
                selected === type
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <Icon
                className={selected === type ? 'text-blue-600' : 'text-gray-500'}
                size={20}
              />
              <p
                className={`text-sm font-medium ${
                  selected === type ? 'text-blue-700' : 'text-gray-800'
                }`}
              >
                {label}
              </p>
            </button>
          ))}
          {methodError && <p className="text-xs text-red-500">{methodError}</p>}
        </div>

        <Button
          onClick={handlePay}
          disabled={paying}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
        >
          {paying ? (
            <span className="flex items-center gap-2">
              <Spinner />
              Memproses...
            </span>
          ) : (
            'Bayar Sekarang'
          )}
        </Button>
      </div>
    </div>
  )
}
