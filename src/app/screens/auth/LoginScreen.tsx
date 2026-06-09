import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Label } from '../../components/ui/label'
import { useAuthStore } from '../../../stores/authStore'

interface FormErrors {
  email: string
  password: string
}

export default function LoginScreen() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const isLoading = useAuthStore((s) => s.isLoading)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({ email: '', password: '' })

  const validate = (): boolean => {
    const next: FormErrors = { email: '', password: '' }
    let valid = true

    if (!email.trim()) {
      next.email = 'Field ini wajib diisi'
      valid = false
    }
    if (!password) {
      next.password = 'Field ini wajib diisi'
      valid = false
    }

    setErrors(next)
    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const { error } = await login(email, password)
    if (error) {
      toast.error(error)
    } else {
      navigate('/home', { replace: true })
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-white">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🚑</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">MedRide</h1>
        <p className="text-gray-500 text-sm mb-8">Masuk ke akun Anda</p>

        <form onSubmit={handleSubmit} className="w-full space-y-4" noValidate>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@contoh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors.password}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Memproses...
              </>
            ) : (
              'Masuk'
            )}
          </Button>
        </form>

        <p className="mt-6 text-sm text-gray-500">
          Belum punya akun?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Daftar
          </button>
        </p>
      </div>
    </div>
  )
}
