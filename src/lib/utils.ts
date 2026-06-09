import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { OrderStatus } from '../types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    PENDING: 'Menunggu',
    CONFIRMED: 'Dikonfirmasi',
    ON_THE_WAY: 'Dalam Perjalanan',
    ARRIVED: 'Tiba',
    COMPLETED: 'Selesai',
    CANCELLED: 'Dibatalkan',
  }
  return labels[status]
}

export function getStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    ON_THE_WAY: 'bg-orange-100 text-orange-800',
    ARRIVED: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-gray-100 text-gray-700',
  }
  return colors[status]
}
