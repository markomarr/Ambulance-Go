import { Phone } from 'lucide-react'
import Header from '../../components/shared/Header'
import BottomNav from '../../components/shared/BottomNav'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../../components/ui/accordion'

const FAQ_ITEMS = [
  {
    q: 'Bagaimana cara memesan ambulans?',
    a: 'Buka aplikasi, tekan tombol "Pesan Ambulans" di beranda, isi alamat penjemputan dan tujuan, pilih tipe layanan, lalu konfirmasi pesanan Anda.',
  },
  {
    q: 'Berapa lama ambulans tiba?',
    a: 'Estimasi waktu tiba bervariasi tergantung lokasi dan kondisi lalu lintas. Ambulans Reguler sekitar 15–30 menit, Ambulans ICU sekitar 5–15 menit.',
  },
  {
    q: 'Bagaimana cara membatalkan pesanan?',
    a: 'Buka Riwayat Pesanan, pilih pesanan yang ingin dibatalkan, lalu tekan "Batalkan Pesanan". Pembatalan hanya bisa dilakukan saat status Menunggu atau Dikonfirmasi.',
  },
]

export default function HelpScreen() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Header title="Bantuan" />
      <div className="flex-1 p-4 space-y-4 overflow-auto pb-20">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Nomor Darurat</p>
          <a
            href="tel:119"
            className="w-full bg-red-600 hover:bg-red-700 active:scale-95 text-white py-4 rounded-xl flex items-center justify-center gap-3 text-lg font-bold transition"
          >
            <Phone size={24} />
            119 — Darurat Nasional
          </a>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Pertanyaan Umum (FAQ)</p>
          <div className="bg-white border border-gray-200 rounded-xl px-4">
            <Accordion type="multiple">
              {FAQ_ITEMS.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-sm text-left">{item.q}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-xs text-gray-600">{item.a}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Informasi Layanan</p>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm text-blue-800">Jam Operasional</p>
              <p className="text-sm font-semibold text-blue-900">24/7</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-blue-800">Area Layanan</p>
              <p className="text-sm font-semibold text-blue-900">Jakarta & sekitarnya</p>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
