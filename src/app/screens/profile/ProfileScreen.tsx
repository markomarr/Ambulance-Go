import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import Header from '../../components/shared/Header'
import BottomNav from '../../components/shared/BottomNav'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '../../components/ui/alert-dialog'
import { useAuthStore } from '../../../stores/authStore'

export default function ProfileScreen() {
  const navigate = useNavigate()
  const profile = useAuthStore((s) => s.profile)
  const updateProfile = useAuthStore((s) => s.updateProfile)
  const logout = useAuthStore((s) => s.logout)

  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState(profile?.name ?? '')
  const [address, setAddress] = useState(profile?.address ?? '')
  const [saving, setSaving] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const initials = (profile?.name ?? 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleSave = async () => {
    setSaving(true)
    const { error } = await updateProfile({ name: name.trim(), address: address.trim() })
    setSaving(false)
    if (error) {
      toast.error(error)
    } else {
      toast.success('Profil berhasil diperbarui')
      setEditMode(false)
    }
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
    setLoggingOut(false)
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Header title="Profil" />
      <div className="flex-1 p-4 space-y-4 overflow-auto pb-20">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl font-bold">{initials}</span>
          </div>
          <h3 className="text-lg font-semibold">{profile?.name ?? '—'}</h3>
          <p className="text-sm opacity-90">{profile?.phone ?? '—'}</p>
        </div>

        {editMode ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="edit-name">Nama Lengkap</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama lengkap"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-address">Alamat</Label>
              <Input
                id="edit-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Alamat"
              />
            </div>
            <div className="space-y-1">
              <Label>Nomor Telepon</Label>
              <Input
                value={profile?.phone ?? ''}
                readOnly
                className="bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                value={profile?.email ?? ''}
                readOnly
                className="bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                onClick={() => setEditMode(false)}
                className="flex-1"
                disabled={saving}
              >
                Batal
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {saving ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Nama Lengkap</p>
              <p className="text-sm text-gray-800">{profile?.name ?? '—'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Nomor Telepon</p>
              <p className="text-sm text-gray-800">{profile?.phone ?? '—'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <p className="text-sm text-gray-800">{profile?.email ?? '—'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Alamat</p>
              <p className="text-sm text-gray-800">{profile?.address ?? '—'}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setName(profile?.name ?? '')
                setAddress(profile?.address ?? '')
                setEditMode(true)
              }}
              className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Edit Profil
            </Button>
          </div>
        )}

        <Button
          variant="outline"
          onClick={() => setShowLogoutDialog(true)}
          className="w-full text-red-600 border-red-200 hover:bg-red-50"
        >
          Keluar
        </Button>
      </div>
      <BottomNav />

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Keluar dari Akun?</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin keluar? Anda perlu masuk kembali untuk menggunakan aplikasi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
              disabled={loggingOut}
            >
              Batal
            </Button>
            <Button
              onClick={handleLogout}
              disabled={loggingOut}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {loggingOut ? 'Keluar...' : 'Ya, Keluar'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
