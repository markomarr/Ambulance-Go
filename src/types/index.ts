// ─── Enums ───────────────────────────────────────────────────────────────────

export type ServiceType = 'REGULER' | 'ICU'

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'ON_THE_WAY'
  | 'ARRIVED'
  | 'COMPLETED'
  | 'CANCELLED'

export type PaymentMethod = 'CREDIT_CARD' | 'DIGITAL_WALLET' | 'BANK_TRANSFER'

export type PaymentStatus = 'UNPAID' | 'PAID'

// ─── Domain Entities ─────────────────────────────────────────────────────────

export interface ProfileSettings {
  dark_mode: boolean
  push_notifications: boolean
  location_tracking: boolean
}

export interface Profile {
  id: string
  name: string
  phone: string
  email: string | null
  address: string | null
  settings: ProfileSettings | null
  created_at: string
  updated_at: string
}

export interface Driver {
  id: string
  name: string
  phone: string
  license_plate: string
  ambulance_type: ServiceType
  current_lat: number | null
  current_lng: number | null
  is_available: boolean
}

export interface Order {
  id: string
  order_number: string
  user_id: string
  pickup_address: string
  pickup_lat: number | null
  pickup_lng: number | null
  destination_address: string
  service_type: ServiceType
  status: OrderStatus
  driver_id: string | null
  estimated_cost: number
  final_cost: number | null
  payment_method: PaymentMethod | null
  payment_status: PaymentStatus
  eta_minutes: number | null
  created_at: string
  updated_at: string
}

export interface OrderWithDriver extends Order {
  driver: Driver | null
}

// ─── Form / Store Data ───────────────────────────────────────────────────────

export interface BookingFormData {
  pickup_address: string
  destination_address: string
  service_type: ServiceType
}

export interface CreateOrderPayload extends BookingFormData {
  userId: string
  pickup_lat?: number
  pickup_lng?: number
}
