/**
 * Figma Export — Referensi Visual Statis
 * Jangan ubah file ini. Gunakan sebagai referensi UI saat mengimplementasikan screen nyata.
 * Akses via route /demo
 */
import React, { useState } from 'react'
import { Phone, MapPin, Clock, Heart, User, Settings, ArrowLeft, ChevronRight, AlertCircle, CheckCircle, Navigation } from 'lucide-react'
import WireframeView from '../WireframeView'
import FrameGallery from '../FrameGallery'

export default function FigmaPrototype() {
  const [viewMode, setViewMode] = useState<'app' | 'wireframe' | 'frames'>('frames')
  const [currentScreen, setCurrentScreen] = useState('home')
  const [bookingStep, setBookingStep] = useState(1)

  const screens = {
    home: { title: 'Beranda', number: 1 },
    emergency: { title: 'Panggilan Darurat', number: 2 },
    booking: { title: 'Pesan Ambulans', number: 3 },
    confirmation: { title: 'Konfirmasi Pemesanan', number: 4 },
    tracking: { title: 'Lacak Ambulans', number: 5 },
    payment: { title: 'Pembayaran', number: 6 },
    history: { title: 'Riwayat Pesanan', number: 7 },
    profile: { title: 'Profil Pengguna', number: 8 },
    settings: { title: 'Pengaturan', number: 9 },
    support: { title: 'Bantuan & Support', number: 10 },
  } as const

  type ScreenKey = keyof typeof screens

  const navButtons = [
    { id: 'home', label: 'Beranda', icon: '🏠' },
    { id: 'history', label: 'Riwayat', icon: '📋' },
    { id: 'profile', label: 'Profil', icon: '👤' },
    { id: 'settings', label: 'Setelan', icon: '⚙️' },
  ]

  const HomeScreenFigma = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
        <p className="text-sm opacity-90">Halo, Ahmad!</p>
        <h1 className="text-2xl mt-1">Siap Membantu Anda</h1>
      </div>
      <button onClick={() => setCurrentScreen('emergency')} className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg transform hover:scale-105 transition">
        <AlertCircle size={24} />
        TOMBOL DARURAT
      </button>
      <button onClick={() => setCurrentScreen('booking')} className="w-full bg-white border-2 border-blue-500 text-blue-600 py-3 rounded-xl hover:bg-blue-50 transition">
        Pesan Ambulans
      </button>
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => setCurrentScreen('history')} className="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100 transition">
          <Clock className="mx-auto mb-2 text-blue-600" size={24} />
          <p className="text-sm">Riwayat</p>
        </button>
        <button onClick={() => setCurrentScreen('support')} className="bg-green-50 p-4 rounded-lg text-center hover:bg-green-100 transition">
          <Phone className="mx-auto mb-2 text-green-600" size={24} />
          <p className="text-sm">Hubungi</p>
        </button>
      </div>
      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex gap-3">
        <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
        <p className="text-sm text-yellow-800">Respons cepat dalam 3-5 menit di area Anda</p>
      </div>
    </div>
  )

  const EmergencyScreenFigma = () => (
    <div className="space-y-4">
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
      <button onClick={() => setCurrentScreen('tracking')} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition">Lacak Ambulans</button>
      <button onClick={() => setCurrentScreen('home')} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition">Kembali ke Beranda</button>
    </div>
  )

  const BookingScreenFigma = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCurrentScreen('home')} className="text-blue-600 hover:text-blue-700"><ArrowLeft size={24} /></button>
        <h2 className="text-lg">Pesan Ambulans</h2>
        <div className="w-6"></div>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex justify-between text-sm mb-2">
          <span className={bookingStep >= 1 ? 'text-blue-600' : 'text-gray-400'}>1. Lokasi</span>
          <span className={bookingStep >= 2 ? 'text-blue-600' : 'text-gray-400'}>2. Tipe</span>
          <span className={bookingStep >= 3 ? 'text-blue-600' : 'text-gray-400'}>3. Konfirmasi</span>
        </div>
        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600" style={{ width: `${(bookingStep / 3) * 100}%` }}></div>
        </div>
      </div>
      {bookingStep === 1 && (
        <div className="space-y-3">
          <label className="block">
            <p className="text-sm mb-2">Lokasi Penjemputan</p>
            <div className="flex gap-2">
              <MapPin className="text-gray-400 flex-shrink-0 mt-3" size={20} />
              <input type="text" placeholder="Masukkan alamat" className="flex-1 border border-gray-300 rounded-lg p-3 text-sm" />
            </div>
          </label>
          <label className="block">
            <p className="text-sm mb-2">Lokasi Tujuan</p>
            <div className="flex gap-2">
              <Navigation className="text-gray-400 flex-shrink-0 mt-3" size={20} />
              <input type="text" placeholder="Masukkan tujuan (rumah sakit/klinik)" className="flex-1 border border-gray-300 rounded-lg p-3 text-sm" />
            </div>
          </label>
          <button onClick={() => setBookingStep(2)} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition">Lanjut</button>
        </div>
      )}
      {bookingStep === 2 && (
        <div className="space-y-3">
          <p className="text-sm">Pilih Tipe Layanan</p>
          <button className="w-full border-2 border-blue-600 bg-blue-50 p-3 rounded-lg text-left hover:bg-blue-100 transition">
            <p className="text-sm">Ambulans Reguler</p>
            <p className="text-xs text-gray-600 mt-1">Untuk kasus non-darurat, estimasi 10-15 menit</p>
          </button>
          <button className="w-full border border-gray-300 p-3 rounded-lg text-left hover:bg-gray-50 transition">
            <p className="text-sm">Ambulans ICU</p>
            <p className="text-xs text-gray-600 mt-1">Dilengkapi alat medis, estimasi 5-10 menit</p>
          </button>
          <div className="flex gap-2">
            <button onClick={() => setBookingStep(1)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition">Kembali</button>
            <button onClick={() => setBookingStep(3)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">Lanjut</button>
          </div>
        </div>
      )}
      {bookingStep === 3 && (
        <div className="space-y-3">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p className="text-sm"><span>Penjemputan:</span> Jl. Sudirman 123</p>
            <p className="text-sm"><span>Tujuan:</span> RS Pusat Medika</p>
            <p className="text-sm"><span>Tipe:</span> Ambulans ICU</p>
            <p className="text-sm"><span>Biaya Estimasi:</span> Rp 250.000</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setBookingStep(2)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition">Ubah</button>
            <button onClick={() => { setCurrentScreen('confirmation'); setBookingStep(1) }} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">Pesan Sekarang</button>
          </div>
        </div>
      )}
    </div>
  )

  const ConfirmationScreenFigma = () => (
    <div className="space-y-4">
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
      <button onClick={() => setCurrentScreen('tracking')} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition">Lacak Ambulans</button>
      <button onClick={() => setCurrentScreen('home')} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition">Kembali ke Beranda</button>
    </div>
  )

  const TrackingScreenFigma = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => setCurrentScreen('home')} className="text-blue-600"><ArrowLeft size={24} /></button>
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
      <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition">
        <Phone size={20} />
        Hubungi Driver
      </button>
    </div>
  )

  const PaymentScreenFigma = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <button onClick={() => setCurrentScreen('history')} className="text-blue-600"><ArrowLeft size={24} /></button>
        <h2 className="text-lg">Pembayaran</h2>
      </div>
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 rounded-xl">
        <p className="text-sm opacity-75">Total Biaya</p>
        <h3 className="text-3xl mt-2">Rp 250.000</h3>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-700">Metode Pembayaran</p>
        <button className="w-full border-2 border-blue-600 bg-blue-50 p-3 rounded-lg text-left hover:bg-blue-100 transition"><p className="text-sm">💳 Kartu Kredit</p></button>
        <button className="w-full border border-gray-300 p-3 rounded-lg text-left hover:bg-gray-50 transition"><p className="text-sm">🏧 Dompet Digital</p></button>
        <button className="w-full border border-gray-300 p-3 rounded-lg text-left hover:bg-gray-50 transition"><p className="text-sm">🏦 Transfer Bank</p></button>
      </div>
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition">Lanjutkan Pembayaran</button>
    </div>
  )

  const HistoryScreenFigma = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <button onClick={() => setCurrentScreen('home')} className="text-blue-600"><ArrowLeft size={24} /></button>
        <h2 className="text-lg">Riwayat Pesanan</h2>
      </div>
      {[
        { dest: 'RS Pusat Medika', date: '18 Oktober 2024, 14:30', price: 'Rp 250.000', status: 'Selesai', color: 'bg-green-100 text-green-700' },
        { dest: 'Klinik Kesehatan Maju', date: '15 Oktober 2024, 09:15', price: 'Rp 180.000', status: 'Dibatalkan', color: 'bg-gray-100 text-gray-700' },
        { dest: 'RS Mitra Sehat', date: '10 Oktober 2024, 16:45', price: 'Rp 220.000', status: 'Selesai', color: 'bg-green-100 text-green-700' },
      ].map((item, i) => (
        <div key={i} className="bg-white border border-gray-200 p-4 rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => setCurrentScreen('payment')}>
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm">{item.dest}</p>
            <span className={`text-xs ${item.color} px-2 py-1 rounded`}>{item.status}</span>
          </div>
          <p className="text-xs text-gray-600 mb-2">{item.date}</p>
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-600">{item.price}</p>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        </div>
      ))}
    </div>
  )

  const ProfileScreenFigma = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <button onClick={() => setCurrentScreen('home')} className="text-blue-600"><ArrowLeft size={24} /></button>
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
        {[
          { label: 'Email', value: 'ahmad.wijaya@email.com' },
          { label: 'Alamat', value: 'Jl. Sudirman No. 123, Jakarta' },
          { label: 'Total Pesanan', value: '12 Pesanan' },
        ].map((item) => (
          <div key={item.label} className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">{item.label}</p>
            <p className="text-sm">{item.value}</p>
          </div>
        ))}
      </div>
      <button className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition">Edit Profil</button>
    </div>
  )

  const SettingsScreenFigma = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <button onClick={() => setCurrentScreen('home')} className="text-blue-600"><ArrowLeft size={24} /></button>
        <h2 className="text-lg">Pengaturan</h2>
      </div>
      {['Notifikasi Push', 'Lokasi Real-time', 'Tema Gelap'].map((label, i) => (
        <div key={label} className="bg-white border border-gray-200 p-4 rounded-lg flex justify-between items-center hover:bg-gray-50 cursor-pointer">
          <p className="text-sm">{label}</p>
          <input type="checkbox" defaultChecked={i < 2} className="w-5 h-5" />
        </div>
      ))}
      <button className="w-full bg-white border border-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-50 transition text-sm">Tentang Aplikasi</button>
      <button className="w-full bg-white border border-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-50 transition text-sm">Kebijakan Privasi</button>
      <button className="w-full bg-red-50 border border-red-200 text-red-600 py-2 rounded-lg hover:bg-red-100 transition text-sm">Logout</button>
    </div>
  )

  const SupportScreenFigma = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <button onClick={() => setCurrentScreen('home')} className="text-blue-600"><ArrowLeft size={24} /></button>
        <h2 className="text-lg">Bantuan & Support</h2>
      </div>
      <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition">
        <Phone size={20} />
        Hubungi Pusat Panggilan (24/7)
      </button>
      <div className="space-y-2">
        <p className="text-sm text-gray-700">Hubungi Kami</p>
        {[
          { label: 'Telepon', value: '+62 21-1234-5678' },
          { label: 'Email', value: 'support@ambulansapp.id' },
          { label: 'WhatsApp', value: '+62 812-3456-7890' },
        ].map((item) => (
          <div key={item.label} className="bg-white border border-gray-200 p-4 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">{item.label}</p>
            <p className="text-sm text-blue-600">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-sm text-blue-900 mb-2">FAQ</p>
        <p className="text-xs text-blue-800">Bagaimana cara membatalkan pesanan? Berapa lama ambulans tiba? Apa saja metode pembayaran yang tersedia?</p>
      </div>
    </div>
  )

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home': return <HomeScreenFigma />
      case 'emergency': return <EmergencyScreenFigma />
      case 'booking': return <BookingScreenFigma />
      case 'confirmation': return <ConfirmationScreenFigma />
      case 'tracking': return <TrackingScreenFigma />
      case 'payment': return <PaymentScreenFigma />
      case 'history': return <HistoryScreenFigma />
      case 'profile': return <ProfileScreenFigma />
      case 'settings': return <SettingsScreenFigma />
      case 'support': return <SupportScreenFigma />
      default: return <HomeScreenFigma />
    }
  }

  if (viewMode === 'frames') return <FrameGallery onSwitchToApp={() => setViewMode('app')} />
  if (viewMode === 'wireframe') return <WireframeView onSwitchToApp={() => setViewMode('app')} />

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-800 text-white p-2 text-center flex items-center justify-center gap-4">
        <button onClick={() => setViewMode('frames')} className="text-xs underline hover:text-blue-300">View All Frames</button>
        <span className="text-gray-500">|</span>
        <button onClick={() => setViewMode('wireframe')} className="text-xs underline hover:text-blue-300">View Wireframe</button>
      </div>
      <div className="max-w-md mx-auto bg-white shadow-xl min-h-screen flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-md">
          <p className="text-xs opacity-75">Aplikasi Ambulans</p>
          <h1 className="text-lg">MedRide</h1>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {renderScreen()}
        </div>
        {!(['emergency', 'booking'] as string[]).includes(currentScreen) && (
          <div className="border-t bg-white p-2 flex justify-around">
            {navButtons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => setCurrentScreen(btn.id)}
                className={`flex-1 py-3 px-2 text-center rounded-lg transition ${
                  currentScreen === btn.id ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="text-xl mb-1">{btn.icon}</div>
                <p className="text-xs">{btn.label}</p>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="text-center text-xs text-gray-500 py-2">
        Screen {screens[currentScreen as ScreenKey]?.number}/10 - {screens[currentScreen as ScreenKey]?.title}
      </div>
    </div>
  )
}
