import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Header from '../../components/shared/Header'
import BottomNav from '../../components/shared/BottomNav'
import { Switch } from '../../components/ui/switch'
import { useAuthStore } from '../../../stores/authStore'

export default function SettingsScreen() {
  const profile = useAuthStore((s) => s.profile)
  const updateProfile = useAuthStore((s) => s.updateProfile)

  const [darkMode, setDarkMode] = useState(false)
  const [pushNotif, setPushNotif] = useState(true)
  const [sound, setSound] = useState(true)

  useEffect(() => {
    const saved = profile?.settings?.dark_mode ?? false
    setDarkMode(saved)
    if (saved) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [profile?.settings?.dark_mode])

  const handleDarkMode = async (value: boolean) => {
    setDarkMode(value)
    if (value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    const { error } = await updateProfile({
      settings: {
        dark_mode: value,
        push_notifications: pushNotif,
        location_tracking: false,
      },
    })
    if (error) toast.error(error)
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Header title="Setelan" />
      <div className="flex-1 p-4 space-y-4 overflow-auto pb-20">
        <div className="space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Tampilan</p>
          <div className="bg-white border border-gray-200 p-4 rounded-xl flex justify-between items-center">
            <p className="text-sm text-gray-800">Mode Gelap</p>
            <Switch checked={darkMode} onCheckedChange={handleDarkMode} />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Preferensi</p>
          <div className="bg-white border border-gray-200 p-4 rounded-xl flex justify-between items-center">
            <p className="text-sm text-gray-800">Notifikasi</p>
            <Switch checked={pushNotif} onCheckedChange={setPushNotif} />
          </div>
          <div className="bg-white border border-gray-200 p-4 rounded-xl flex justify-between items-center">
            <p className="text-sm text-gray-800">Suara</p>
            <Switch checked={sound} onCheckedChange={setSound} />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Tentang</p>
          <div className="bg-white border border-gray-200 p-4 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-800">Versi Aplikasi</p>
              <p className="text-sm text-gray-500">1.0.0</p>
            </div>
            <div className="border-t pt-3">
              <p className="text-xs text-gray-400">MedRide — Aplikasi Ambulans</p>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
