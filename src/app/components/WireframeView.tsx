import React from 'react';

interface WireframeViewProps {
  onSwitchToApp: () => void;
}

export default function WireframeView({ onSwitchToApp }: WireframeViewProps) {
  const screens = [
    {
      id: 1,
      title: 'Beranda',
      elements: [
        { type: 'header', label: 'Header Banner' },
        { type: 'button-primary', label: 'TOMBOL DARURAT' },
        { type: 'button-secondary', label: 'Pesan Ambulans' },
        { type: 'grid', label: 'Quick Actions (2 cols)' },
        { type: 'info', label: 'Info Banner' },
      ]
    },
    {
      id: 2,
      title: 'Panggilan Darurat',
      elements: [
        { type: 'header', label: 'Emergency Header' },
        { type: 'info-large', label: 'Status Timer' },
        { type: 'card', label: 'Lokasi Details' },
        { type: 'button-primary', label: 'Lacak Ambulans' },
        { type: 'button-secondary', label: 'Kembali' },
      ]
    },
    {
      id: 3,
      title: 'Pesan Ambulans',
      elements: [
        { type: 'nav', label: 'Back Navigation' },
        { type: 'progress', label: 'Progress Steps (1/2/3)' },
        { type: 'form', label: 'Input Fields' },
        { type: 'button-primary', label: 'Lanjut / Konfirmasi' },
      ]
    },
    {
      id: 4,
      title: 'Konfirmasi',
      elements: [
        { type: 'icon', label: 'Success Icon' },
        { type: 'title', label: 'Confirmation Title' },
        { type: 'card', label: 'Order Details' },
        { type: 'button-primary', label: 'Lacak Ambulans' },
        { type: 'button-secondary', label: 'Kembali' },
      ]
    },
    {
      id: 5,
      title: 'Lacak Ambulans',
      elements: [
        { type: 'nav', label: 'Back Navigation' },
        { type: 'map', label: 'Map View' },
        { type: 'card', label: 'Driver Info Card' },
        { type: 'button-primary', label: 'Hubungi Driver' },
      ]
    },
    {
      id: 6,
      title: 'Pembayaran',
      elements: [
        { type: 'nav', label: 'Back Navigation' },
        { type: 'header', label: 'Total Amount' },
        { type: 'list', label: 'Payment Methods' },
        { type: 'button-primary', label: 'Lanjutkan Pembayaran' },
      ]
    },
    {
      id: 7,
      title: 'Riwayat Pesanan',
      elements: [
        { type: 'nav', label: 'Back Navigation' },
        { type: 'list-item', label: 'Order Card 1' },
        { type: 'list-item', label: 'Order Card 2' },
        { type: 'list-item', label: 'Order Card 3' },
      ]
    },
    {
      id: 8,
      title: 'Profil Pengguna',
      elements: [
        { type: 'nav', label: 'Back Navigation' },
        { type: 'header', label: 'User Avatar & Info' },
        { type: 'info', label: 'Email Info' },
        { type: 'info', label: 'Address Info' },
        { type: 'info', label: 'Total Orders' },
        { type: 'button-secondary', label: 'Edit Profil' },
      ]
    },
    {
      id: 9,
      title: 'Pengaturan',
      elements: [
        { type: 'nav', label: 'Back Navigation' },
        { type: 'toggle', label: 'Notifikasi Push' },
        { type: 'toggle', label: 'Lokasi Real-time' },
        { type: 'toggle', label: 'Tema Gelap' },
        { type: 'button-secondary', label: 'Tentang Aplikasi' },
        { type: 'button-secondary', label: 'Kebijakan Privasi' },
        { type: 'button-danger', label: 'Logout' },
      ]
    },
    {
      id: 10,
      title: 'Bantuan & Support',
      elements: [
        { type: 'nav', label: 'Back Navigation' },
        { type: 'button-primary', label: 'Hubungi Pusat (24/7)' },
        { type: 'info', label: 'Telepon Info' },
        { type: 'info', label: 'Email Info' },
        { type: 'info', label: 'WhatsApp Info' },
        { type: 'card', label: 'FAQ Section' },
      ]
    },
  ];

  const getElementStyle = (type: string) => {
    const baseStyle = 'border-2 border-gray-400 rounded p-2 text-center text-xs';
    
    switch(type) {
      case 'header':
        return `${baseStyle} bg-gray-300 h-16`;
      case 'button-primary':
        return `${baseStyle} bg-gray-800 text-white h-12`;
      case 'button-secondary':
        return `${baseStyle} bg-white h-10`;
      case 'button-danger':
        return `${baseStyle} bg-red-100 border-red-400 h-10`;
      case 'grid':
        return `${baseStyle} bg-gray-100 h-20`;
      case 'info':
        return `${baseStyle} bg-yellow-50 border-yellow-400 h-12`;
      case 'info-large':
        return `${baseStyle} bg-gray-200 h-24`;
      case 'card':
        return `${baseStyle} bg-white h-20 text-left`;
      case 'nav':
        return `${baseStyle} bg-blue-50 border-blue-400 h-8`;
      case 'progress':
        return `${baseStyle} bg-blue-100 border-blue-400 h-12`;
      case 'form':
        return `${baseStyle} bg-white h-32`;
      case 'icon':
        return `${baseStyle} bg-green-100 border-green-400 h-16 rounded-full w-16 mx-auto`;
      case 'title':
        return `${baseStyle} bg-white border-0 h-8`;
      case 'map':
        return `${baseStyle} bg-blue-100 border-blue-400 h-32`;
      case 'list':
        return `${baseStyle} bg-white h-32`;
      case 'list-item':
        return `${baseStyle} bg-white h-16`;
      case 'toggle':
        return `${baseStyle} bg-white h-12 flex items-center justify-between px-3`;
      default:
        return baseStyle;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2">MedRide - Wireframe Design</h1>
          <p className="text-gray-600 mb-4">10 Screen Layouts - Structural View</p>
          <button
            onClick={onSwitchToApp}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition shadow-lg"
          >
            Launch Interactive App →
          </button>
        </div>

        {/* All Screens Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {screens.map((screen) => (
            <div key={screen.id} className="bg-white rounded-lg shadow-lg p-4 border-2 border-gray-300">
              {/* Screen Header */}
              <div className="mb-4 pb-3 border-b-2 border-gray-300">
                <div className="bg-blue-600 text-white px-3 py-2 rounded text-center mb-2">
                  <p className="text-xs opacity-75">Screen {screen.id}</p>
                  <p className="text-sm">{screen.title}</p>
                </div>
              </div>

              {/* Screen Content */}
              <div className="space-y-3 mb-4">
                {screen.elements.map((element, idx) => (
                  <div key={idx} className={getElementStyle(element.type)}>
                    {element.label}
                  </div>
                ))}
              </div>

              {/* Bottom Navigation (if applicable) */}
              {![2, 3].includes(screen.id) && (
                <div className="border-t-2 border-gray-300 pt-3 mt-4">
                  <div className="grid grid-cols-4 gap-1">
                    {['🏠', '📋', '👤', '⚙️'].map((icon, idx) => (
                      <div key={idx} className="border border-gray-400 rounded p-1 text-center text-xs bg-gray-50">
                        {icon}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl mb-4">Wireframe Legend</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-300 border-2 border-gray-400 rounded"></div>
              <span className="text-sm">Header</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-800 border-2 border-gray-400 rounded"></div>
              <span className="text-sm">Primary Button</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white border-2 border-gray-400 rounded"></div>
              <span className="text-sm">Secondary Button</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 border-2 border-blue-400 rounded"></div>
              <span className="text-sm">Map/Navigation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-50 border-2 border-yellow-400 rounded"></div>
              <span className="text-sm">Info Banner</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 border-2 border-green-400 rounded"></div>
              <span className="text-sm">Success Icon</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-100 border-2 border-red-400 rounded"></div>
              <span className="text-sm">Danger/Logout</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-100 border-2 border-gray-400 rounded"></div>
              <span className="text-sm">Grid/List</span>
            </div>
          </div>
        </div>

        {/* Feature Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl mb-4">App Features Summary</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="mb-3">Core Features</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Emergency Call Button</li>
                <li>✓ Multi-step Ambulance Booking</li>
                <li>✓ Real-time Tracking Interface</li>
                <li>✓ Multiple Payment Methods</li>
                <li>✓ Order History Management</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3">User Management</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ User Profile Management</li>
                <li>✓ Settings & Preferences</li>
                <li>✓ 24/7 Support System</li>
                <li>✓ Bottom Tab Navigation</li>
                <li>✓ Mobile-First Design</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
