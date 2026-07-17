import React from 'react';

function RingkasanAdmin({ dataAnggota, dataPosyandu, dataKegiatan, dataEkspedisi }) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-extrabold text-gray-800 font-serif">Ringkasan Dashboard</h3>
      
      <div className="bg-emerald-900 text-white p-8 rounded-lg shadow-sm border border-emerald-950/20">
        <h4 className="text-xl font-bold font-serif">Selamat datang kembali, Administrator!</h4>
        <p className="text-xs text-emerald-200 mt-1 max-w-xl font-light">
          Anda memiliki akses penuh untuk melakukan manajemen data PWA dan administrasi dinas TP-PKK Nagari Suayan. Gunakan navigasi sidebar kiri untuk mengelola data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'Total Anggota Terdaftar', value: dataAnggota.length },
          { title: 'Kelompok Posyandu', value: dataPosyandu.length },
          { title: 'Kegiatan Terlapor', value: dataKegiatan.length },
          { title: 'Surat Keluar', value: dataEkspedisi.length }
        ].map(card => (
          <div key={card.title} className="bg-white p-5 rounded-lg border shadow-sm">
            <span className="block text-3xl font-bold font-serif text-emerald-800">{card.value}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mt-1">{card.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RingkasanAdmin;
