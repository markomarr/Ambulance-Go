import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { AlertCircle, Clock, Phone } from 'lucide-react'
import Header from '../../components/shared/Header'
import BottomNav from '../../components/shared/BottomNav'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '../../components/ui/alert-dialog'
import { useAuthStore } from '../../../stores/authStore'
import { useOrderStore } from '../../../stores/orderStore'

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export default function HomeScreen() {
  const navigate = useNavigate()
  const profile = useAuthStore((s) => s.profile)
  const session = useAuthStore((s) => s.session)
  const createOrder = useOrderStore((s) => s.createOrder)

  const [emergencyLoading, setEmergencyLoading] = useState(false)
  const [showManualDialog, setShowManualDialog] = useState(false)
  const [manualAddress, setManualAddress] = useState('')
  const [addressError, setAddressError] = useState('')

  const handleEmergency = () => {
    if (!session?.user) return
    const userId = session.user.id
    setEmergencyLoading(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: pickup_lat, longitude: pickup_lng } = position.coords
        const { order, error } = await createOrder({
          userId,
          pickup_address: 'Lokasi GPS',
          pickup_lat,
          pickup_lng,
          destination_address: '',
          service_type: 'ICU',
        })
        setEmergencyLoading(false)
        if (error) {
          toast.error(error)
        } else if (order) {
          navigate('/emergency')
        }
      },
      () => {
        setEmergencyLoading(false)
        setShowManualDialog(true)
      }
    )
  }

  const handleManualEmergency = async () => {
    if (!manualAddress.trim()) {
      setAddressError('Field ini wajib diisi')
      return
    }
    if (!session?.user) return
    const userId = session.user.id

    setEmergencyLoading(true)
    const { order, error } = await createOrder({
      userId,
      pickup_address: manualAddress.trim(),
      destination_address: '',
      service_type: 'ICU',
    })
    setEmergencyLoading(false)

    if (error) {
      setShowManualDialog(false)
      toast.error(error)
    } else if (order) {
      setShowManualDialog(false)
      navigate('/emergency')
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Header />

      <div className="flex-1 p-4 space-y-4 overflow-auto">
        {/* Greeting card */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
          <p className="text-sm opacity-90">Halo, {profile?.name ?? 'Pengguna'}!</p>
          <h2 className="text-xl mt-1 font-semibold">Siap Membantu Anda</h2>
        </div>

        {/* Emergency button */}
        <button
          onClick={handleEmergency}
          disabled={emergencyLoading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white py-6 rounded-xl flex items-center justify-center gap-3 shadow-lg text-xl font-bold transition active:scale-95"
        >
          {emergencyLoading ? <Spinner /> : <AlertCircle size={28} />}
          DARURAT
        </button>

        {/* Book ambulance button */}
        <Button
          onClick={() => navigate('/booking/step1')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base"
        >
          Pesan Ambulans
        </Button>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/orders')}
            className="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100 transition"
          >
            <Clock className="mx-auto mb-2 text-blue-600" size={22} />
            <p className="text-sm text-gray-700">Riwayat</p>
          </button>
          <button
            onClick={() => navigate('/help')}
            className="bg-green-50 p-4 rounded-lg text-center hover:bg-green-100 transition"
          >
            <Phone className="mx-auto mb-2 text-green-600" size={22} />
            <p className="text-sm text-gray-700">Hubungi</p>
          </button>
        </div>

        {/* Info banner */}
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex gap-3">
          <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-yellow-800">Respons cepat dalam 3–5 menit di area Anda</p>
        </div>
      </div>

      {/* Manual address dialog (shown when geolocation is denied) */}
      <AlertDialog open={showManualDialog} onOpenChange={setShowManualDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Masukkan Alamat</AlertDialogTitle>
            <AlertDialogDescription>
              Lokasi GPS tidak tersedia. Masukkan alamat penjemputan secara manual.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-1">
            <Label htmlFor="manual-address">Alamat Penjemputan</Label>
            <Input
              id="manual-address"
              placeholder="Contoh: Jl. Sudirman No. 123, Jakarta"
              value={manualAddress}
              onChange={(e) => {
                setManualAddress(e.target.value)
                if (addressError) setAddressError('')
              }}
              aria-invalid={!!addressError}
            />
            {addressError && <p className="text-xs text-red-500">{addressError}</p>}
          </div>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowManualDialog(false)}
              disabled={emergencyLoading}
            >
              Batal
            </Button>
            <Button
              onClick={handleManualEmergency}
              disabled={emergencyLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {emergencyLoading ? (
                <><Spinner /> Memproses...</>
              ) : (
                'Kirim Bantuan'
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav />
    </div>
  )
}
