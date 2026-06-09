import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { Toaster } from './components/ui/sonner'
import { useAuthStore } from '../stores/authStore'
import ProtectedRoute from './components/shared/ProtectedRoute'

const LandingScreen = lazy(() => import('./screens/landing/LandingScreen'))
const LoginScreen = lazy(() => import('./screens/auth/LoginScreen'))
const RegisterScreen = lazy(() => import('./screens/auth/RegisterScreen'))
const FigmaPrototype = lazy(() => import('./components/figma/FigmaPrototype'))
const HomeScreen = lazy(() => import('./screens/home/HomeScreen'))
const EmergencyScreen = lazy(() => import('./screens/emergency/EmergencyScreen'))
const BookingStep1 = lazy(() => import('./screens/booking/BookingStep1'))
const BookingStep2 = lazy(() => import('./screens/booking/BookingStep2'))
const BookingStep3 = lazy(() => import('./screens/booking/BookingStep3'))
const ConfirmationScreen = lazy(() => import('./screens/confirmation/ConfirmationScreen'))
const TrackingScreen = lazy(() => import('./screens/tracking/TrackingScreen'))
const PaymentScreen = lazy(() => import('./screens/payment/PaymentScreen'))
const OrderHistoryScreen = lazy(() => import('./screens/orders/OrderHistoryScreen'))
const OrderDetailScreen = lazy(() => import('./screens/orders/OrderDetailScreen'))
const ProfileScreen = lazy(() => import('./screens/profile/ProfileScreen'))
const SettingsScreen = lazy(() => import('./screens/settings/SettingsScreen'))
const HelpScreen = lazy(() => import('./screens/help/HelpScreen'))

function PageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  )
}

export default function App() {
  const initialize = useAuthStore((s) => s.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 flex items-start justify-center">
        <div className="w-full max-w-[28rem] min-h-screen bg-white shadow-xl flex flex-col relative">
          <Suspense fallback={<PageSpinner />}>
            <Routes>
              {/* ── Public ── */}
              <Route path="/" element={<LandingScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/demo" element={<FigmaPrototype />} />

              {/* ── Protected ── */}
              <Route
                path="/home"
                element={<ProtectedRoute><HomeScreen /></ProtectedRoute>}
              />
              <Route
                path="/emergency"
                element={<ProtectedRoute><EmergencyScreen /></ProtectedRoute>}
              />
              <Route
                path="/booking"
                element={<Navigate to="/booking/step1" replace />}
              />
              <Route
                path="/booking/step1"
                element={<ProtectedRoute><BookingStep1 /></ProtectedRoute>}
              />
              <Route
                path="/booking/step2"
                element={<ProtectedRoute><BookingStep2 /></ProtectedRoute>}
              />
              <Route
                path="/booking/step3"
                element={<ProtectedRoute><BookingStep3 /></ProtectedRoute>}
              />
              <Route
                path="/confirmation/:id"
                element={<ProtectedRoute><ConfirmationScreen /></ProtectedRoute>}
              />
              <Route
                path="/tracking/:id"
                element={<ProtectedRoute><TrackingScreen /></ProtectedRoute>}
              />
              <Route
                path="/payment/:id"
                element={<ProtectedRoute><PaymentScreen /></ProtectedRoute>}
              />
              <Route
                path="/orders"
                element={<ProtectedRoute><OrderHistoryScreen /></ProtectedRoute>}
              />
              <Route
                path="/orders/:id"
                element={<ProtectedRoute><OrderDetailScreen /></ProtectedRoute>}
              />
              <Route
                path="/profile"
                element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>}
              />
              <Route
                path="/settings"
                element={<ProtectedRoute><SettingsScreen /></ProtectedRoute>}
              />
              <Route
                path="/help"
                element={<ProtectedRoute><HelpScreen /></ProtectedRoute>}
              />

              {/* ── Fallback ── */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>

          <Toaster position="top-center" richColors />
        </div>
      </div>
    </BrowserRouter>
  )
}
