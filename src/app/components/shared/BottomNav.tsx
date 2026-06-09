import { useNavigate, useLocation } from 'react-router'
import { Home, ClipboardList, User, Settings } from 'lucide-react'

const TABS = [
  { id: 'home', label: 'Beranda', Icon: Home, path: '/home' },
  { id: 'history', label: 'Riwayat', Icon: ClipboardList, path: '/orders' },
  { id: 'profile', label: 'Profil', Icon: User, path: '/profile' },
  { id: 'settings', label: 'Setelan', Icon: Settings, path: '/settings' },
] as const

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className="border-t bg-white p-2 flex justify-around">
      {TABS.map(({ id, label, Icon, path }) => {
        const isActive = pathname === path || pathname.startsWith(path + '/')
        return (
          <button
            key={id}
            onClick={() => navigate(path)}
            className={`flex-1 py-3 px-2 text-center rounded-lg transition ${
              isActive
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Icon className="mx-auto mb-1" size={20} />
            <p className="text-xs">{label}</p>
          </button>
        )
      })}
    </div>
  )
}
