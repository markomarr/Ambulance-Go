import React from 'react'
import { Navigate } from 'react-router'
import { useAuthStore } from '../../../stores/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const session = useAuthStore((s) => s.session)
  const isInitialized = useAuthStore((s) => s.isInitialized)

  if (!isInitialized) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
