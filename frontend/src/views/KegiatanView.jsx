import React, { useState } from 'react';

function KegiatanView({ isAdmin, dataKegiatan, setDataKegiatan }) {

  const [formKegiatan, setFormKegiatan] = useState({
    nama: '',
    jabatan: '',
    tanggal: '',
    tempat: '',
    uraian_kegiatan: '',
    kategori: 'Rapat'
  });

  const [filterKategori, setFilterKategori] = useState('Semua');

  const handleAddKegiatan = (e) => {
    e.preventDefault();
    if (!formKegiatan.nama || !formKegiatan.tanggal || !formKegiatan.uraian_kegiatan) return;
    
    // Set random image based on category
    let randomPhoto = "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&q=80&w=600";
    if (formKegiatan.kategori === 'Posyandu') {
      randomPhoto = "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600";
    } else if (formKegiatan.kategori === 'Sosial') {
      randomPhoto = "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=600";
    }

    const newKegiatan = {
      id: Date.now(),
      ...formKegiatan,
      foto: randomPhoto
    };

    setDataKegiatan([newKegiatan, ...dataKegiatan]);
    setFormKegiatan({
      nama: '',
      jabatan: '',
      tanggal: '',
      tempat: '',
      uraian_kegiatan: '',
      kategori: 'Rapat'
    });
  };

  const handleDeleteKegiatan = (id) => {
    setDataKegiatan(dataKegiatan.filter(item => item.id !== id));
  };

  const filteredKegiatan = dataKegiatan.filter(item => {
    if (filterKategori === 'Semua') return true;
    return item.kategori === filterKategori;
  });

  return (
    <div className="bg-[#fbfbfa] pb-20">
      {/* Banner */}
      <div className="bg-emerald-900 text-white text-center py-16 px-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-350 block mb-1 font-sans">LOG KEGIATAN</span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif tracking-wide">Buku Kegiatan Pengurus</h1>
        <p className="text-xs text-emerald-200 mt-1 uppercase font-semibold tracking-wider">Aksi Nyata TP-PKK Nagari Suayan</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-8">
        
        {/* Filter and Admin Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-gray-550">Filter Kategori:</span>
            {['Semua', 'Rapat', 'Posyandu', 'Sosial'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterKategori(cat)}
                className={`px-3 py-1 rounded text-xs font-semibold transition ${filterKategori === cat ? 'bg-emerald-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          {isAdmin && (
            <span className="self-start sm:self-center bg-red-100 text-red-800 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Mode Admin Aktif</span>
          )}
        </div>

        {/* Admin Form */}
        {isAdmin && (
          <form onSubmit={handleAddKegiatan} className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-800 border-b pb-2">Catat Kegiatan Baru (Buku Harian Kegiatan)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Nama Petugas/Pelaksana</label>
                <input 
                  type="text" 
                  placeholder="Nama Lengkap" 
                  value={formKegiatan.nama}
                  onChange={(e) => setFormKegiatan({...formKegiatan, nama: e.target.value})}
                  className="w-full text-sm border rounded p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Jabatan PKK</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Sekretaris / Anggota Pokja" 
                  value={formKegiatan.jabatan}
                  onChange={(e) => setFormKegiatan({...formKegiatan, jabatan: e.target.value})}
                  className="w-full text-sm border rounded p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Kategori Kegiatan</label>
                <select 
                  value={formKegiatan.kategori}
                  onChange={(e) => setFormKegiatan({...formKegiatan, kategori: e.target.value})}
                  className="w-full text-sm border rounded p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value="Rapat">Rapat</option>
                  <option value="Posyandu">Posyandu</option>
                  <option value="Sosial">Sosial</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Tanggal</label>
                <input 
                  type="date" 
                  value={formKegiatan.tanggal}
                  onChange={(e) => setFormKegiatan({...formKegiatan, tanggal: e.target.value})}
                  className="w-full text-sm border rounded p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-600 mb-1">Tempat Pelaksanaan</label>
                <input 
                  type="text" 
                  placeholder="Nama gedung, jorong, atau daerah" 
                  value={formKegiatan.tempat}
                  onChange={(e) => setFormKegiatan({...formKegiatan, tempat: e.target.value})}
                  className="w-full text-sm border rounded p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-gray-600 mb-1">Uraian / Deskripsi Kegiatan</label>
                <textarea 
                  rows="3"
                  placeholder="Uraikan detail kegiatan yang telah dilaksanakan..." 
                  value={formKegiatan.uraian_kegiatan}
                  onChange={(e) => setFormKegiatan({...formKegiatan, uraian_kegiatan: e.target.value})}
                  className="w-full text-sm border rounded p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  required
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="bg-emerald-700 text-white text-xs font-bold px-5 py-2 rounded hover:bg-emerald-800 transition">
                Simpan Log Kegiatan
              </button>
            </div>
          </form>
        )}

        {/* List of Activities */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredKegiatan.length === 0 ? (
            <div className="col-span-full bg-white p-12 text-center rounded-lg border text-gray-400 font-medium">
              Tidak ada log kegiatan yang terdaftar untuk kategori ini.
            </div>
          ) : (
            filteredKegiatan.map(item => (
              <div key={item.id} className="bg-white rounded-lg border shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="h-48 bg-gray-200 bg-cover bg-center" style={{ backgroundImage: `url(${item.foto})` }}></div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-bold text-white px-2 py-0.5 rounded uppercase tracking-wider ${item.kategori === 'Posyandu' ? 'bg-emerald-600' : item.kategori === 'Rapat' ? 'bg-blue-600' : 'bg-amber-600'}`}>
                        {item.kategori}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">{item.tanggal}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm leading-snug">{item.tempat}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">{item.uraian_kegiatan}</p>
                  </div>
                </div>
                
                <div className="px-5 pb-5 pt-3 border-t border-gray-50 flex items-center justify-between">
                  <div className="text-left">
                    <span className="block text-[10px] font-bold text-gray-800 leading-none">{item.nama}</span>
                    <span className="text-[9px] text-gray-400 font-medium">{item.jabatan}</span>
                  </div>
                  {isAdmin && (
                    <button 
                      onClick={() => handleDeleteKegiatan(item.id)}
                      className="bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1 rounded text-[10px] font-bold transition"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default KegiatanView;
