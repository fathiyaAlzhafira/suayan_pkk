import React from 'react';

function Footer({ setCurrentTab, setActiveDataMenu }) {
  return (
    <footer className="bg-zinc-900 text-zinc-400 text-xs border-t border-zinc-800 pt-12 pb-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div>
          <div className="flex items-center space-x-2 text-white mb-3">
            <div className="w-6 h-6 bg-emerald-800 rounded-full flex items-center justify-center font-bold text-[10px]">PKK</div>
            <span className="font-bold text-sm">TP-PKK Nagari Suayan</span>
          </div>
          <p className="leading-relaxed text-zinc-500 text-[11px]">
            Tim Penggerak PKK Nagari Suayan, Kecamatan Akabiluru, Kabupaten Lima Puluh Kota, Sumatera Barat. Wadah pemberdayaan masyarakat menuju Nagari Mandiri.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold uppercase tracking-wider text-[10px] mb-3">Navigasi Cepat</h4>
          <ul className="space-y-1.5 font-medium">
            <li><button onClick={() => setCurrentTab('beranda')} className="hover:text-white transition">Beranda Utama</button></li>
            <li><button onClick={() => setCurrentTab('profil')} className="hover:text-white transition">Profil Pengurus</button></li>
            <li><button onClick={() => { setCurrentTab('data_publik'); setActiveDataMenu('ekspedisi'); }} className="hover:text-white transition">Data Buku Administrasi</button></li>
            <li><button onClick={() => setCurrentTab('kegiatan')} className="hover:text-white transition">Kegiatan PKK</button></li>
            <li><button onClick={() => setCurrentTab('keuangan')} className="hover:text-white transition">Transparansi Keuangan</button></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold uppercase tracking-wider text-[10px] mb-3">Kontak &amp; Alamat</h4>
          <p className="text-zinc-500 leading-relaxed text-[11px]">
            📍 Kantor Wali Nagari Suayan <br/>
            Kecamatan Akabiluru, Kabupaten Lima Puluh Kota <br/>
            Sumatera Barat, Indonesia.
          </p>
        </div>
      </div>
      <div className="border-t border-zinc-800/60 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 text-center text-[10px] text-zinc-600 font-medium">
        &copy; 2026 TP-PKK Nagari Suayan. Sistem Informasi Manajemen KKN Digital. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;