import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type {
  Order,
  BookingFormData,
  CreateOrderPayload,
  PaymentMethod,
} from '../types'

const ESTIMATED_COST: Record<string, number> = {
  REGULER: 250000,
  ICU: 500000,
}

const DEFAULT_ETA: Record<string, number> = {
  REGULER: 12,
  ICU: 7,
}

interface OrderState {
  currentOrder: Order | null
  orderHistory: Order[]
  bookingForm: Partial<BookingFormData>
  isLoading: boolean
  error: string | null
  createOrder: (payload: CreateOrderPayload) => Promise<{ order: Order | null; error: string | null }>
  fetchOrderHistory: (userId: string) => Promise<void>
  fetchOrder: (orderId: string) => Promise<Order | null>
  cancelOrder: (orderId: string, userId: string) => Promise<{ error: string | null }>
  updatePayment: (orderId: string, method: PaymentMethod) => Promise<{ error: string | null }>
  setBookingForm: (data: Partial<BookingFormData>) => void
  clearBookingForm: () => void
  setCurrentOrder: (order: Order | null) => void
  clearError: () => void
}

export const useOrderStore = create<OrderState>((set, get) => ({
  currentOrder: null,
  orderHistory: [],
  bookingForm: {},
  isLoading: false,
  error: null,

  createOrder: async ({ userId, pickup_lat, pickup_lng, ...formData }) => {
    set({ isLoading: true, error: null })

    // Cari driver yang tersedia sesuai tipe layanan
    const { data: drivers, error: driverError } = await supabase
      .from('drivers')
      .select('id')
      .eq('ambulance_type', formData.service_type)
      .eq('is_available', true)
      .limit(1)

    if (driverError || !drivers || drivers.length === 0) {
      const msg = 'Tidak ada ambulans tersedia saat ini, coba beberapa saat lagi'
      set({ isLoading: false, error: msg })
      return { order: null, error: msg }
    }

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        pickup_address: formData.pickup_address,
        pickup_lat: pickup_lat ?? null,
        pickup_lng: pickup_lng ?? null,
        destination_address: formData.destination_address,
        service_type: formData.service_type,
        estimated_cost: ESTIMATED_COST[formData.service_type],
        driver_id: drivers[0].id,
        status: 'CONFIRMED',
        eta_minutes: DEFAULT_ETA[formData.service_type],
        order_number: '',
      })
      .select('*')
      .single()

    set({ isLoading: false })

    if (error || !data) {
      const msg = 'Gagal membuat pesanan, coba lagi'
      set({ error: msg })
      return { order: null, error: msg }
    }

    const order = data as Order
    set({ currentOrder: order })
    return { order, error: null }
  },

  fetchOrderHistory: async (userId) => {
    set({ isLoading: true })
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    set({ isLoading: false })
    if (!error && data) set({ orderHistory: data as Order[] })
  },

  fetchOrder: async (orderId) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (error || !data) return null
    const order = data as Order
    set({ currentOrder: order })
    return order
  },

  cancelOrder: async (orderId, userId) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'CANCELLED' })
      .eq('id', orderId)
      .eq('user_id', userId)
      .in('status', ['PENDING', 'CONFIRMED'])

    if (error) return { error: 'Gagal membatalkan pesanan' }

    await get().fetchOrderHistory(userId)
    return { error: null }
  },

  updatePayment: async (orderId, method) => {
    const estimatedCost = get().currentOrder?.estimated_cost ?? 0

    const { error } = await supabase
      .from('orders')
      .update({
        payment_method: method,
        payment_status: 'PAID',
        status: 'COMPLETED',
        final_cost: estimatedCost,
      })
      .eq('id', orderId)

    if (error) return { error: 'Gagal memproses pembayaran' }

    const updated = await get().fetchOrder(orderId)
    if (updated) set({ currentOrder: updated })

    return { error: null }
  },

  setBookingForm: (data) =>
    set((state) => ({ bookingForm: { ...state.bookingForm, ...data } })),

  clearBookingForm: () => set({ bookingForm: {} }),

  setCurrentOrder: (order) => set({ currentOrder: order }),

  clearError: () => set({ error: null }),
}))
