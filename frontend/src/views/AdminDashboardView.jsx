import React, { useState } from 'react';
import RingkasanAdmin from './admin/RingkasanAdmin';
import PokjaAdmin from './admin/PokjaAdmin';
import PosyanduAdmin from './admin/PosyanduAdmin';
import KeuanganAdmin from './admin/KeuanganAdmin';
import KegiatanAdmin from './admin/KegiatanAdmin';
import InventarisAdmin from './admin/InventarisAdmin';
import EkspedisiAdmin from './admin/EkspedisiAdmin';
import UmumAdmin from './admin/UmumAdmin';
import KeluargaAdmin from './admin/KeluargaAdmin';
import WargaAdmin from './admin/WargaAdmin';

function AdminDashboardView({
  setIsAdmin,
  setIsAdminPreview,
  dataEkspedisi,
  setDataEkspedisi,
  dataAnggota,
  setDataAnggota,
  dataPosyandu,
  setDataPosyandu,
  dataInventaris,
  setDataInventaris,
  dataKeuangan,
  setDataKeuangan,
  dataKegiatan,
  setDataKegiatan,
  dataUmumJorong,
  setDataUmumJorong,
  dataPokja1,
  setDataPokja1,
  dataPokja2,
  setDataPokja2,
  dataPokja3,
  setDataPokja3,
  dataPokja4,
  setDataPokja4,
  dataKeluarga,
  setDataKeluarga,
  dataWarga,
  setDataWarga
}) {
  const [activeMenu, setActiveMenu] = useState('Ringkasan');
  const API_URL = 'http://localhost:5000/api';

  const menuItems = [
    { name: 'Ringkasan', icon: '📊' },
    { name: 'Data Umum', icon: '📋' },
    { name: 'Data Keluarga', icon: '🏠' },
    { name: 'Data Warga', icon: '👥' },
    { name: 'Data Posyandu', icon: '🏥' },
    { name: 'Data Pokja I-IV', icon: '📝' },
    { name: 'Buku Keuangan', icon: '💰' },
    { name: 'Buku Kegiatan', icon: '📅' },
    { name: 'Buku Inventaris', icon: '📦' },
    { name: 'Buku Ekspedisi', icon: '✉️' }
  ];

  return (
    <div className="min-h-screen flex bg-[#fbfbfa] text-gray-700 font-sans">
      
      {/* Sidebar Nav */}
      <aside className="w-64 bg-emerald-950 text-emerald-100 flex flex-col border-r border-emerald-900">
        <div className="p-6 border-b border-emerald-900/60 bg-emerald-900/20">
          <h2 className="text-sm font-black font-serif uppercase tracking-widest text-white">PKK Suayan Admin</h2>
          <span className="text-[10px] text-emerald-400 font-medium">Panel Dashboard Administrator</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map(item => (
            <button
              key={item.name}
              onClick={() => setActiveMenu(item.name)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded text-xs font-bold transition-all ${
                activeMenu === item.name 
                  ? 'bg-emerald-800 text-white shadow-sm' 
                  : 'hover:bg-emerald-900/40 text-emerald-200'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-emerald-900/60 space-y-2">
          <button 
            onClick={() => setIsAdminPreview(true)}
            className="w-full bg-emerald-900 hover:bg-emerald-850 text-emerald-100 font-bold text-[10px] py-2 rounded transition"
          >
            Lihat Web Publik
          </button>
          <button 
            onClick={() => setIsAdmin(false)}
            className="w-full bg-red-900 hover:bg-red-850 text-white font-bold text-[10px] py-2 rounded transition"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        <header className="flex justify-between items-center pb-6 border-b mb-6">
          <div>
            <h1 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dashboard</h1>
            <h2 className="text-xl font-bold font-serif text-gray-900 mt-0.5">{activeMenu}</h2>
          </div>
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs font-serif">A</span>
            <div className="text-left leading-tight hidden md:block">
              <span className="block text-xs font-bold text-gray-800">Admin PKK</span>
              <span className="block text-[9px] text-gray-400 font-medium">TP-PKK Nagari Suayan</span>
            </div>
          </div>
        </header>

        <div className="animate-in fade-in duration-200">
          {activeMenu === 'Ringkasan' && (
            <RingkasanAdmin 
              dataAnggota={dataAnggota} 
              dataPosyandu={dataPosyandu} 
              dataKegiatan={dataKegiatan} 
              dataEkspedisi={dataEkspedisi} 
            />
          )}

          {activeMenu === 'Data Umum' && (
            <UmumAdmin 
              dataUmumJorong={dataUmumJorong} 
              setDataUmumJorong={setDataUmumJorong} 
              API_URL={API_URL} 
            />
          )}

          {activeMenu === 'Data Posyandu' && (
            <PosyanduAdmin 
              dataPosyandu={dataPosyandu} 
              setDataPosyandu={setDataPosyandu} 
              API_URL={API_URL} 
            />
          )}

          {activeMenu === 'Data Keluarga' && (
            <KeluargaAdmin 
              dataKeluarga={dataKeluarga} 
              setDataKeluarga={setDataKeluarga} 
              API_URL={API_URL} 
            />
          )}

          {activeMenu === 'Data Warga' && (
            <WargaAdmin 
              dataWarga={dataWarga} 
              setDataWarga={setDataWarga} 
              dataKeluarga={dataKeluarga}
              API_URL={API_URL} 
            />
          )}

          {activeMenu === 'Data Pokja I-IV' && (
            <PokjaAdmin 
              dataPokja1={dataPokja1} setDataPokja1={setDataPokja1}
              dataPokja2={dataPokja2} setDataPokja2={setDataPokja2}
              dataPokja3={dataPokja3} setDataPokja3={setDataPokja3}
              dataPokja4={dataPokja4} setDataPokja4={setDataPokja4}
              API_URL={API_URL} 
            />
          )}

          {activeMenu === 'Buku Keuangan' && (
            <KeuanganAdmin 
              dataKeuangan={dataKeuangan} 
              setDataKeuangan={setDataKeuangan} 
              API_URL={API_URL} 
            />
          )}

          {activeMenu === 'Buku Kegiatan' && (
            <KegiatanAdmin 
              dataKegiatan={dataKegiatan} 
              setDataKegiatan={setDataKegiatan} 
              API_URL={API_URL} 
            />
          )}

          {activeMenu === 'Buku Inventaris' && (
            <InventarisAdmin 
              dataInventaris={dataInventaris} 
              setDataInventaris={setDataInventaris} 
              API_URL={API_URL} 
            />
          )}

          {activeMenu === 'Buku Ekspedisi' && (
            <EkspedisiAdmin 
              dataEkspedisi={dataEkspedisi} 
              setDataEkspedisi={setDataEkspedisi} 
              API_URL={API_URL} 
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboardView;
