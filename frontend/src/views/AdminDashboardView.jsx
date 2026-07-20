import React, { useState } from 'react';
import RingkasanAdmin from './admin/RingkasanAdmin';
import PokjaAdmin from './admin/PokjaAdmin';
import PosyanduAdmin from './admin/PosyanduAdmin';
import KeuanganAdmin from './admin/KeuanganAdmin';
import KegiatanAdmin from './admin/KegiatanAdmin';
import InventarisAdmin from './admin/InventarisAdmin';
import EkspedisiAdmin from './admin/EkspedisiAdmin';
import AnggotaAdmin from './admin/AnggotaAdmin';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Toggle sidebar desktop (Expanded/Collapsed)
  const [isMobileOpen, setIsMobileOpen] = useState(false);   // Toggle drawer mobile

  const API_URL = 'http://localhost:5000/api';

  const menuItems = [
    { name: 'Ringkasan', icon: '📊' },
    { name: 'Data Umum', icon: '📋' },
    { name: 'Data Keluarga', icon: '🏠' },
    { name: 'Data Warga', icon: '👥' },
    { name: 'Daftar Anggota & Kader', icon: '👥' },
    { name: 'Data Posyandu', icon: '🏥' },
    { name: 'Data Pokja I-IV', icon: '📝' },
    { name: 'Buku Keuangan', icon: '💰' },
    { name: 'Buku Kegiatan', icon: '📅' },
    { name: 'Buku Inventaris', icon: '📦' },
    { name: 'Buku Ekspedisi', icon: '✉️' }
  ];

  const handleSelectMenu = (name) => {
    setActiveMenu(name);
    setIsMobileOpen(false); // Otomatis tutup drawer di HP saat menu diklik
  };

  return (
    <div className="min-h-screen flex bg-[#fbfbfa] text-gray-700 font-sans overflow-x-hidden">
      
      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        bg-emerald-950 text-emerald-100 flex flex-col border-r border-emerald-900
        transition-all duration-300 ease-in-out shadow-2xl md:shadow-none
        ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
        ${isSidebarOpen ? 'md:w-64' : 'md:w-20'}
      `}>
        {/* Header Sidebar Logo & Title */}
        <div className="p-5 border-b border-emerald-900/60 bg-emerald-900/20 flex items-center justify-between min-h-[73px]">
          <div className={`flex items-center space-x-3 overflow-hidden ${!isSidebarOpen && 'md:hidden'}`}>
            <span className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-emerald-300 font-bold shrink-0">P</span>
            <div className="leading-tight">
              <h2 className="text-xs font-black font-serif uppercase tracking-widest text-white whitespace-nowrap">PKK Suayan</h2>
              <span className="text-[9px] text-emerald-400 font-medium whitespace-nowrap">Panel Administrator</span>
            </div>
          </div>

          {/* Icon saat collapsed di desktop */}
          {!isSidebarOpen && (
            <div className="hidden md:flex w-full justify-center">
              <span className="w-9 h-9 rounded-lg bg-emerald-800 flex items-center justify-center text-emerald-300 font-bold text-sm">P</span>
            </div>
          )}

          {/* Tombol Tutup di Mobile */}
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden text-emerald-400 hover:text-white p-1 rounded text-xl font-bold"
          >
            &times;
          </button>
        </div>
        
        {/* Daftar Menu Items */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto font-sans">
          {menuItems.map(item => (
            <button
              key={item.name}
              onClick={() => handleSelectMenu(item.name)}
              title={!isSidebarOpen ? item.name : ''}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg text-xs font-bold transition-all group ${
                activeMenu === item.name 
                  ? 'bg-emerald-800 text-white shadow-md' 
                  : 'hover:bg-emerald-900/50 text-emerald-200 hover:text-white'
              } ${!isSidebarOpen ? 'md:justify-center' : 'space-x-3'}`}
            >
              <span className="text-base shrink-0 group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className={`truncate transition-opacity ${!isSidebarOpen ? 'md:hidden' : 'block'}`}>
                {item.name}
              </span>
            </button>
          ))}
        </nav>

        {/* Footer Buttons */}
        <div className="p-3 border-t border-emerald-900/60 space-y-2 bg-emerald-900/10">
          <button 
            onClick={() => setIsAdminPreview(true)}
            title={!isSidebarOpen ? "Lihat Web Publik" : ""}
            className={`w-full bg-emerald-900 hover:bg-emerald-800 text-emerald-100 font-bold text-[10px] py-2.5 rounded-lg transition flex items-center justify-center ${!isSidebarOpen ? 'md:px-0' : 'space-x-1.5'}`}
          >
            <span>🌐</span>
            <span className={!isSidebarOpen ? 'md:hidden' : 'block'}>Lihat Web Publik</span>
          </button>
          <button 
            onClick={() => setIsAdmin(false)}
            title={!isSidebarOpen ? "Log Out" : ""}
            className={`w-full bg-red-950/80 hover:bg-red-900 text-red-200 hover:text-white font-bold text-[10px] py-2.5 rounded-lg transition flex items-center justify-center ${!isSidebarOpen ? 'md:px-0' : 'space-x-1.5'}`}
          >
            <span>🚪</span>
            <span className={!isSidebarOpen ? 'md:hidden' : 'block'}>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 min-w-0 flex flex-col max-h-screen overflow-y-auto">
        {/* Topbar Navigation */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 md:px-8 py-4 flex justify-between items-center shadow-xs">
          <div className="flex items-center space-x-3">
            {/* Tombol Toggle Sidebar Mobile (Hamburger) */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 rounded-lg bg-emerald-50 text-emerald-900 hover:bg-emerald-100 font-bold transition border border-emerald-200"
              title="Buka Menu Sidebar"
            >
              ☰
            </button>

            {/* Tombol Toggle Sidebar Desktop (Mini/Expand) */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:flex p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 font-bold transition border border-gray-200"
              title={isSidebarOpen ? "Kecilkan Sidebar" : "Buka Sidebar"}
            >
              {isSidebarOpen ? '◀' : '▶'}
            </button>

            <div>
              <h1 className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest font-mono">Panel Dashboard</h1>
              <h2 className="text-base md:text-lg font-bold font-serif text-gray-900 leading-tight">{activeMenu}</h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-full bg-[#005941] text-white flex items-center justify-center font-bold text-xs font-serif shadow-xs">A</span>
            <div className="text-left leading-tight hidden sm:block">
              <span className="block text-xs font-bold text-gray-800">Admin PKK</span>
              <span className="block text-[9px] text-gray-400 font-medium">TP-PKK Nagari Suayan</span>
            </div>
          </div>
        </header>

        {/* Content View Container */}
        <div className="p-4 md:p-8 flex-1 animate-in fade-in duration-200 space-y-6">
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

          {activeMenu === 'Daftar Anggota & Kader' && (
            <AnggotaAdmin 
              dataAnggota={dataAnggota} 
              setDataAnggota={setDataAnggota} 
              API_URL={API_URL} 
            />
          )}

          {activeMenu === 'Data Pokja I-IV' && (
            <PokjaAdmin 
              dataPokja1={dataPokja1} setDataPokja1={setDataPokja1}
              dataPokja2={dataPokja2} setDataPokja2={setDataPokja2}
              dataPokja3={dataPokja3} setDataPokja3={setDataPokja3}
              dataPokja4={dataPokja4} setDataPokja4={setDataPokja4}
              dataPosyandu={dataPosyandu} setDataPosyandu={setDataPosyandu}
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
