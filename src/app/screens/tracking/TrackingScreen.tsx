import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Phone } from 'lucide-react'
import Header from '../../components/shared/Header'
import { supabase } from '../../../lib/supabase'
import { useOrderStore } from '../../../stores/orderStore'
import type { Driver, Order } from '../../../types'

// DivIcon markers to avoid Vite bundler asset issues with default Leaflet icons
const driverIcon = L.divIcon({
  html: '<div style="width:22px;height:22px;background:#dc2626;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35)"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  className: '',
})

const pickupIcon = L.divIcon({
  html: '<div style="width:22px;height:22px;background:#2563eb;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35)"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  className: '',
})

const SERVICE_LABEL: Record<string, string> = {
  REGULER: 'Ambulans Reguler',
  ICU: 'Ambulans ICU',
}

export default function TrackingScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const fetchOrder = useOrderStore((s) => s.fetchOrder)

  const [order, setOrder] = useState<Order | null>(null)
  const [driver, setDriver] = useState<Driver | null>(null)
  const [driverPos, setDriverPos] = useState<[number, number] | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  // Fetch order and driver on mount
  useEffect(() => {
    if (!id) {
      setNotFound(true)
      return
    }

    const init = async () => {
      const fetched = await fetchOrder(id)
      if (!fetched) {
        toast.error('Pesanan tidak ditemukan')
        setNotFound(true)
        return
      }
      setOrder(fetched)

      if (fetched.driver_id) {
        const { data, error } = await supabase
          .from('drivers')
          .select('*')
          .eq('id', fetched.driver_id)
          .single()

        if (!error && data) {
          const d = data as Driver
          setDriver(d)
          if (d.current_lat !== null && d.current_lng !== null) {
            setDriverPos([d.current_lat, d.current_lng])
          }
        }
      }

      setLoading(false)
    }

    init()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // Supabase Realtime: subscribe to driver position updates
  useEffect(() => {
    if (!order?.driver_id) return

    const channel = supabase
      .channel(`driver-${order.driver_id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'drivers',
          filter: `id=eq.${order.driver_id}`,
        },
        (payload) => {
          const updated = payload.new as unknown as Driver
          setDriver(updated)
          if (updated.current_lat !== null && updated.current_lng !== null) {
            setDriverPos([updated.current_lat, updated.current_lng])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [order?.driver_id])

  if (notFound) {
    return <Navigate to="/home" replace />
  }

  if (loading) {
    return (
      <div className="flex flex-col flex-1 min-h-screen">
        <Header title="Lacak Ambulans" showBack />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </div>
    )
  }

  if (!order) return null

  // Default center: Jakarta if driver position not available
  const mapCenter: [number, number] = driverPos ?? [-6.2088, 106.8456]
  const pickupPos: [number, number] | null =
    order.pickup_lat !== null && order.pickup_lng !== null
      ? [order.pickup_lat, order.pickup_lng]
      : null

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Header title="Lacak Ambulans" showBack />

      {/* Leaflet map */}
      <div className="h-64 w-full relative z-0">
        <MapContainer
          center={mapCenter}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {driverPos && (
            <Marker position={driverPos} icon={driverIcon}>
              <Popup>Posisi Ambulans</Popup>
            </Marker>
          )}
          {pickupPos && (
            <Marker position={pickupPos} icon={pickupIcon}>
              <Popup>Lokasi Penjemputan</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Driver info panel */}
      <div className="flex-1 p-4 space-y-3 overflow-auto">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🚑</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{driver?.name ?? 'Menunggu driver...'}</p>
              <p className="text-sm text-gray-500">{SERVICE_LABEL[order.service_type]}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Plat Nomor</span>
              <span className="text-gray-900">{driver?.license_plate ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Jarak</span>
              <span className="text-gray-900">Menghitung...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">ETA</span>
              <span className="text-gray-900">15–30 menit</span>
            </div>
          </div>
        </div>

        {driver?.phone && (
          <a
            href={`tel:${driver.phone}`}
            className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-semibold transition"
          >
            <Phone size={18} />
            Hubungi Driver
          </a>
        )}
      </div>
    </div>
  )
}
