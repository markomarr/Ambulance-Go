import { useNavigate } from 'react-router'
import { ArrowLeft } from 'lucide-react'

interface HeaderProps {
  title?: string
  showBack?: boolean
  onBack?: () => void
}

export default function Header({ title, showBack = false, onBack }: HeaderProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-md flex-shrink-0">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={handleBack}
            className="text-white hover:text-blue-100 transition -ml-1"
            aria-label="Kembali"
          >
            <ArrowLeft size={22} />
          </button>
        )}
        <div>
          {title ? (
            <h1 className="text-lg">{title}</h1>
          ) : (
            <>
              <p className="text-xs opacity-75">Aplikasi Ambulans</p>
              <h1 className="text-lg">Ambulance Go</h1>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
