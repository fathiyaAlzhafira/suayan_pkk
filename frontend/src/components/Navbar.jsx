import React, { useState } from 'react';

function Navbar({ currentTab, setCurrentTab, setActiveDataMenu, isAdmin, setIsAdmin, onLoginClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (tab, menu = null) => {
    setCurrentTab(tab);
    if (menu) {
      setActiveDataMenu(menu);
    }
    setIsMobileMenuOpen(false); // Tutup menu setelah diklik (untuk mobile)
  };

  return (
    <nav className="bg-emerald-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavClick('beranda')}>
            <div className="w-10 h-10 bg-emerald-700 rounded-full flex items-center justify-center font-bold text-white border border-emerald-500">PKK</div>
            <div>
              <span className="font-bold text-sm block tracking-wide leading-none">TP-PKK Nagari</span>
              <span className="text-[10px] text-emerald-300 block mt-0.5">Suayan, Kec. Akabiluru</span>
            </div>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-6 text-xs font-semibold uppercase tracking-wider">
            {[
              { id: 'beranda', label: 'Beranda' },
              { id: 'profil', label: 'Profil PKK' },
              { id: 'data_publik', label: 'Data & Informasi', menu: 'ekspedisi' },
              { id: 'kegiatan', label: 'Kegiatan' },
              { id: 'keuangan', label: 'Transparansi Keuangan' },
              { id: 'portal_warga', label: 'Portal Warga' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => handleNavClick(tab.id, tab.menu)}
                className={`py-2 border-b-2 hover:text-emerald-300 transition duration-200 ${currentTab === tab.id ? 'text-amber-400 border-amber-400 font-bold' : 'border-transparent text-emerald-100'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Login/Logout Button & Hamburger Menu Button */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => {
                if (isAdmin) {
                  setIsAdmin(false);
                } else {
                  onLoginClick();
                }
              }} 
              className={`hidden sm:flex px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase transition shadow ${isAdmin ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-transparent border border-emerald-400 text-emerald-300 hover:bg-emerald-800'}`}
            >
              {isAdmin ? 'Keluar Admin' : 'Login Admin'}
            </button>

            {/* Mobile Menu Button (Hamburger) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex md:hidden p-2 rounded-md hover:bg-emerald-800 transition focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-emerald-950 px-4 pt-2 pb-4 space-y-1 border-t border-emerald-850 animate-in slide-in-from-top-2 duration-200">
          {[
            { id: 'beranda', label: 'Beranda' },
            { id: 'profil', label: 'Profil PKK' },
            { id: 'data_publik', label: 'Data & Informasi', menu: 'ekspedisi' },
            { id: 'kegiatan', label: 'Kegiatan' },
            { id: 'keuangan', label: 'Transparansi Keuangan' },
            { id: 'portal_warga', label: 'Portal Warga' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleNavClick(tab.id, tab.menu)}
              className={`w-full text-left py-2.5 px-3 rounded text-xs font-semibold transition uppercase tracking-wider block ${currentTab === tab.id ? 'bg-emerald-850 text-amber-400 font-bold border-l-4 border-amber-400' : 'text-emerald-100 hover:bg-emerald-900'}`}
            >
              {tab.label}
            </button>
          ))}
          <div className="pt-2 border-t border-emerald-900/60 mt-2">
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (isAdmin) {
                  setIsAdmin(false);
                } else {
                  onLoginClick();
                }
              }} 
              className={`w-full text-center py-2.5 rounded text-xs font-bold uppercase tracking-wider transition ${isAdmin ? 'bg-red-650 text-white' : 'bg-emerald-700 text-white'}`}
            >
              {isAdmin ? 'Keluar Admin' : 'Login Admin'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;