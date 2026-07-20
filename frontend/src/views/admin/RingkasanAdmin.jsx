import React from 'react';

function RingkasanAdmin({ dataAnggota, dataPosyandu, dataKegiatan, dataEkspedisi }) {
  return (
    <div className="space-y-6 font-sans">
      {/* Banner Card */}
      <div className="bg-[#005941] text-white p-8 rounded-xl shadow-md border border-emerald-950/20">
        <h4 className="text-xl font-bold font-serif">Selamat datang kembali, Administrator!</h4>
        <p className="text-xs text-emerald-100 mt-1 max-w-xl font-light leading-relaxed">
          Anda memiliki akses penuh untuk melakukan manajemen data PWA dan administrasi dinas TP-PKK Nagari Suayan. Gunakan navigasi sidebar kiri untuk mengelola data.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: 'Total Anggota Terdaftar', value: dataAnggota.length, icon: '👥' },
          { title: 'Kelompok Posyandu', value: dataPosyandu.length, icon: '🏥' },
          { title: 'Kegiatan Terlapor', value: dataKegiatan.length, icon: '📅' },
          { title: 'Surat Keluar Ekspedisi', value: dataEkspedisi.length, icon: '✉️' }
        ].map(card => (
          <div key={card.title} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="block text-3xl font-extrabold font-serif text-[#005941]">{card.value}</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mt-1">{card.title}</span>
            </div>
            <span className="text-2xl p-3 bg-emerald-50 rounded-lg">{card.icon}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RingkasanAdmin;
