import React from 'react';
import { Phone, MapPin, Clock, User, ArrowLeft, ChevronRight, AlertCircle, CheckCircle, Navigation } from 'lucide-react';

interface FrameGalleryProps {
  onSwitchToApp: () => void;
}

export default function FrameGallery({ onSwitchToApp }: FrameGalleryProps) {
  const Frame = ({ children, title, number }: { children: React.ReactNode; title: string; number: number }) => (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between">
        <span className="text-xs">Screen {number}/10</span>
        <span className="text-xs">{title}</span>
      </div>
      <div className="bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white shadow-2xl rounded-lg overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );

  const AppHeader = () => (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
      <p className="text-xs opacity-75">Aplikasi Ambulans</p>
      <h1 className="text-lg">MedRide</h1>
    </div>
  );

  const BottomNav = ({ active = 'home' }: { active?: string }) => (
    <div className="border-t bg-white p-2 flex justify-around">
      {[
        { id: 'home', label: 'Beranda', icon: '🏠' },
        { id: 'history', label: 'Riwayat', icon: '📋' },
        { id: 'profile', label: 'Profil', icon: '👤' },
        { id: 'settings', label: 'Setelan', icon: '⚙️' }
      ].map(btn => (
        <div
          key={btn.id}
          className={`flex-1 py-3 px-2 text-center rounded-lg ${
            active === btn.id ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
          }`}
        >
          <div className="text-xl mb-1">{btn.icon}</div>
          <p className="text-xs">{btn.label}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-2">MedRide - Complete Design Frames</h1>
          <p className="text-gray-600 mb-4">All 10 Screens</p>
          <button
            onClick={onSwitchToApp}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition shadow-lg"
          >
            Launch Interactive App →
          </button>
        </div>

        {/* Frames Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Frame 1: Home */}
          <Frame title="Beranda" number={1}>
            <AppHeader />
            <div className="p-4 space-y-4">
              <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
                <p className="text-sm opacity-90">Halo, Ahmad!</p>
                <h1 className="text-2xl mt-1">Siap Membantu Anda</h1>
              </div>
              <button className="w-full bg-red-600 text-white py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg">
                <AlertCircle size={24} />
                TOMBOL DARURAT
              </button>
              <button className="w-full bg-white border-2 border-blue-500 text-blue-600 py-3 rounded-xl">
                Pesan Ambulans
              </button>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <Clock className="mx-auto mb-2 text-blue-600" size={24} />
                  <p className="text-sm">Riwayat</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <Phone className="mx-auto mb-2 text-green-600" size={24} />
                  <p className="text-sm">Hubungi</p>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex gap-3">
                <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
                <p className="text-sm text-yellow-800">Respons cepat dalam 3-5 menit di area Anda</p>
              </div>
            </div>
            <BottomNav active="home" />
          </Frame>

          {/* Frame 2: Emergency */}
          <Frame title="Panggilan Darurat" number={2}>
            <AppHeader />
            <div className="p-4 space-y-4">
              <div className="bg-red-600 text-white p-6 rounded-xl text-center">
                <h2 className="text-xl mb-2">SITUASI DARURAT</h2>
                <p className="text-sm opacity-90">Ambulans akan segera dikirim ke lokasi Anda</p>
              </div>
              <div className="bg-gray-100 p-6 rounded-xl text-center">
                <p className="text-sm text-gray-600 mb-2">Status Respons</p>
                <div className="text-4xl text-red-600 mb-2">15 DETIK</div>
                <p className="text-xs text-gray-600">Tim medis sedang dalam perjalanan</p>
              </div>
              <div className="bg-white border-2 border-gray-200 p-4 rounded-lg">
                <p className="text-sm text-gray-700 mb-3">Lokasi Anda:</p>
                <div className="flex items-start gap-3">
                  <MapPin className="text-red-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p>Jl. Sudirman No. 123</p>
                    <p className="text-sm text-gray-600">Jakarta Pusat</p>
                  </div>
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
                Lacak Ambulans
              </button>
              <button className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg">
                Kembali ke Beranda
              </button>
            </div>
          </Frame>

          {/* Frame 3: Booking Step 1 */}
          <Frame title="Pesan Ambulans - Lokasi" number={3}>
            <AppHeader />
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <ArrowLeft size={24} className="text-blue-600" />
                <h2 className="text-lg">Pesan Ambulans</h2>
                <div className="w-6"></div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-blue-600">1. Lokasi</span>
                  <span className="text-gray-400">2. Tipe</span>
                  <span className="text-gray-400">3. Konfirmasi</span>
                </div>
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{width: '33%'}}></div>
                </div>
              </div>
              <label className="block">
                <p className="text-sm mb-2">Lokasi Penjemputan</p>
                <div className="flex gap-2">
                  <MapPin className="text-gray-400 flex-shrink-0 mt-3" size={20} />
                  <input
                    type="text"
                    placeholder="Masukkan alamat"
                    className="flex-1 border border-gray-300 rounded-lg p-3 text-sm"
                  />
                </div>
              </label>
              <label className="block">
                <p className="text-sm mb-2">Lokasi Tujuan</p>
                <div className="flex gap-2">
                  <Navigation className="text-gray-400 flex-shrink-0 mt-3" size={20} />
                  <input
                    type="text"
                    placeholder="Masukkan tujuan (rumah sakit/klinik)"
                    className="flex-1 border border-gray-300 rounded-lg p-3 text-sm"
                  />
                </div>
              </label>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
                Lanjut
              </button>
            </div>
          </Frame>

          {/* Frame 4: Booking Step 2 */}
          <Frame title="Pesan Ambulans - Tipe" number={3}>
            <AppHeader />
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <ArrowLeft size={24} className="text-blue-600" />
                <h2 className="text-lg">Pesan Ambulans</h2>
                <div className="w-6"></div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-blue-600">1. Lokasi</span>
                  <span className="text-blue-600">2. Tipe</span>
                  <span className="text-gray-400">3. Konfirmasi</span>
                </div>
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{width: '66%'}}></div>
                </div>
              </div>
              <p className="text-sm">Pilih Tipe Layanan</p>
              <button className="w-full border-2 border-blue-600 bg-blue-50 p-3 rounded-lg text-left">
                <p className="text-sm">Ambulans Reguler</p>
                <p className="text-xs text-gray-600 mt-1">Untuk kasus non-darurat, estimasi 10-15 menit</p>
              </button>
              <button className="w-full border border-gray-300 p-3 rounded-lg text-left">
                <p className="text-sm">Ambulans ICU</p>
                <p className="text-xs text-gray-600 mt-1">Dilengkapi alat medis, estimasi 5-10 menit</p>
              </button>
              <div className="flex gap-2">
                <button className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg">
                  Kembali
                </button>
                <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg">
                  Lanjut
                </button>
              </div>
            </div>
          </Frame>

          {/* Frame 5: Confirmation */}
          <Frame title="Konfirmasi Pemesanan" number={4}>
            <AppHeader />
            <div className="p-4 space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="text-green-600" size={32} />
                </div>
                <h2 className="text-xl text-green-600">Pesanan Dikonfirmasi!</h2>
                <p className="text-sm text-gray-600 mt-2">Ambulans dalam perjalanan ke lokasi Anda</p>
              </div>
              <div className="bg-white border-2 border-gray-200 p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center pb-3 border-b">
                  <p className="text-sm text-gray-600">ID Pesanan</p>
                  <p className="text-blue-600">#AMB20241018001</p>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <p className="text-sm text-gray-600">Estimasi Tiba</p>
                  <p>8 Menit</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Driver</p>
                  <p>Budi Santoso</p>
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
                Lacak Ambulans
              </button>
              <button className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg">
                Kembali ke Beranda
              </button>
            </div>
            <BottomNav active="home" />
          </Frame>

          {/* Frame 6: Tracking */}
          <Frame title="Lacak Ambulans" number={5}>
            <AppHeader />
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <ArrowLeft size={24} className="text-blue-600" />
                <h2 className="text-lg">Lacak Ambulans</h2>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 h-48 rounded-lg flex items-center justify-center border-2 border-blue-300">
                <div className="text-center">
                  <Navigation className="mx-auto text-blue-600 mb-2" size={32} />
                  <p className="text-sm text-blue-700">Ambulans 3,2 km dari lokasi Anda</p>
                  <p className="text-xs text-blue-600 mt-1">ETA 5 menit</p>
                </div>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">🚑</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">Ambulans ICU-47</p>
                    <p className="text-xs text-gray-600">Driver: Budi Santoso</p>
                  </div>
                  <ChevronRight className="text-gray-400" size={20} />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plat Nomor:</span>
                    <span>B 8123 AMB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kontak Driver:</span>
                    <span className="text-blue-600">+62 812-3456-7890</span>
                  </div>
                </div>
              </div>
              <button className="w-full bg-green-600 text-white py-3 rounded-lg flex items-center justify-center gap-2">
                <Phone size={20} />
                Hubungi Driver
              </button>
            </div>
            <BottomNav active="home" />
          </Frame>

          {/* Frame 7: Payment */}
          <Frame title="Pembayaran" number={6}>
            <AppHeader />
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <ArrowLeft size={24} className="text-blue-600" />
                <h2 className="text-lg">Pembayaran</h2>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 rounded-xl">
                <p className="text-sm opacity-75">Total Biaya</p>
                <h3 className="text-3xl mt-2">Rp 250.000</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-700">Metode Pembayaran</p>
                <button className="w-full border-2 border-blue-600 bg-blue-50 p-3 rounded-lg text-left">
                  <p className="text-sm">💳 Kartu Kredit</p>
                </button>
                <button className="w-full border border-gray-300 p-3 rounded-lg text-left">
                  <p className="text-sm">🏧 Dompet Digital</p>
                </button>
                <button className="w-full border border-gray-300 p-3 rounded-lg text-left">
                  <p className="text-sm">🏦 Transfer Bank</p>
                </button>
              </div>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
                Lanjutkan Pembayaran
              </button>
            </div>
            <BottomNav active="history" />
          </Frame>

          {/* Frame 8: History */}
          <Frame title="Riwayat Pesanan" number={7}>
            <AppHeader />
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <ArrowLeft size={24} className="text-blue-600" />
                <h2 className="text-lg">Riwayat Pesanan</h2>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm">RS Pusat Medika</p>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Selesai</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">18 Oktober 2024, 14:30</p>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-600">Rp 250.000</p>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm">Klinik Kesehatan Maju</p>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Dibatalkan</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">15 Oktober 2024, 09:15</p>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-600">Rp 180.000</p>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm">RS Mitra Sehat</p>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Selesai</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">10 Oktober 2024, 16:45</p>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-600">Rp 220.000</p>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              </div>
            </div>
            <BottomNav active="history" />
          </Frame>

          {/* Frame 9: Profile */}
          <Frame title="Profil Pengguna" number={8}>
            <AppHeader />
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <ArrowLeft size={24} className="text-blue-600" />
                <h2 className="text-lg">Profil Saya</h2>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User size={32} />
                </div>
                <h3 className="text-lg">Ahmad Wijaya</h3>
                <p className="text-sm opacity-90">+62 812-3456-7890</p>
              </div>
              <div className="space-y-2">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Email</p>
                  <p className="text-sm">ahmad.wijaya@email.com</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Alamat</p>
                  <p className="text-sm">Jl. Sudirman No. 123, Jakarta</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Total Pesanan</p>
                  <p className="text-sm">12 Pesanan</p>
                </div>
              </div>
              <button className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg">
                Edit Profil
              </button>
            </div>
            <BottomNav active="profile" />
          </Frame>

          {/* Frame 10: Settings */}
          <Frame title="Pengaturan" number={9}>
            <AppHeader />
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <ArrowLeft size={24} className="text-blue-600" />
                <h2 className="text-lg">Pengaturan</h2>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-lg flex justify-between items-center">
                <p className="text-sm">Notifikasi Push</p>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-lg flex justify-between items-center">
                <p className="text-sm">Lokasi Real-time</p>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-lg flex justify-between items-center">
                <p className="text-sm">Tema Gelap</p>
                <input type="checkbox" className="w-5 h-5" />
              </div>
              <button className="w-full bg-white border border-gray-200 text-gray-800 py-2 rounded-lg text-sm">
                Tentang Aplikasi
              </button>
              <button className="w-full bg-white border border-gray-200 text-gray-800 py-2 rounded-lg text-sm">
                Kebijakan Privasi
              </button>
              <button className="w-full bg-red-50 border border-red-200 text-red-600 py-2 rounded-lg text-sm">
                Logout
              </button>
            </div>
            <BottomNav active="settings" />
          </Frame>

          {/* Frame 11: Support */}
          <Frame title="Bantuan & Support" number={10}>
            <AppHeader />
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <ArrowLeft size={24} className="text-blue-600" />
                <h2 className="text-lg">Bantuan & Support</h2>
              </div>
              <button className="w-full bg-green-600 text-white py-3 rounded-lg flex items-center justify-center gap-2">
                <Phone size={20} />
                Hubungi Pusat Panggilan (24/7)
              </button>
              <div className="space-y-2">
                <p className="text-sm text-gray-700">Hubungi Kami</p>
                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Telepon</p>
                  <p className="text-sm text-blue-600">+62 21-1234-5678</p>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Email</p>
                  <p className="text-sm text-blue-600">support@ambulansapp.id</p>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">WhatsApp</p>
                  <p className="text-sm text-blue-600">+62 812-3456-7890</p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-sm text-blue-900 mb-2">FAQ</p>
                <p className="text-xs text-blue-800">Bagaimana cara membatalkan pesanan? Berapa lama ambulans tiba? Apa saja metode pembayaran yang tersedia?</p>
              </div>
            </div>
            <BottomNav active="home" />
          </Frame>

        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-gray-600">
          <p className="text-sm">Complete frame-by-frame design gallery</p>
          <p className="text-xs mt-2">Click "Launch Interactive App" above to use the live application</p>
        </div>
      </div>
    </div>
  );
}
