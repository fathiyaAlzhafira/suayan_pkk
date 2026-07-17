import React, { useState } from 'react';

function DataPublikView({
  activeDataMenu,
  setActiveDataMenu,
  isAdmin,
  dataEkspedisi,
  dataAnggota,
  jorongFilter,
  setJorongFilter,
  formSurat,
  setFormSurat,
  handleAddSurat,
  handleDeleteSurat,
  setCurrentTab,
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
  dataPosyandu
}) {
  
  // State untuk sub-menu halaman: 'dashboard' vs 'administrasi'
  const [subView, setSubView] = useState('dashboard');
  
  // State filter Pokja di dashboard
  const [pokjaFilter, setPokjaFilter] = useState('Umum');

  // State untuk mode edit data statistik admin
  const [isEditingStats, setIsEditingStats] = useState(false);
  const [editJorong, setEditJorong] = useState("Suayan Sabar");

  // Form states untuk edit masing-masing kategori
  const [formUmum, setFormUmum] = useState({ kk: 0, jiwa: 0, anggota: 0, dasawisma: 0 });
  const [formPokja1, setFormPokja1] = useState({ pkbn_kel: 0, pkbn_ang: 0, pkdrt_kel: 0, pola_kel: 0, lansia_kel: 0, gotong: 0, arisan: 0 });
  const [formPokja2, setFormPokja2] = useState({ baca: 0, up2k_kel: 0, up2k_pes: 0, mikro: 0, toko: 0, koperasi: 0 });
  const [formPokja3, setFormPokja3] = useState({ kp: 0, ks: 0, ternak: 0, ikan: 0, warung: 0, toga: 0, r_sehat: 0, r_kurang: 0 });
  const [formPokja4, setFormPokja4] = useState({ k_pos: 0, k_phbs: 0, k_kb: 0, pos: 0, jamban: 0, mck: 0, kb_asep: 0 });

  // Fungsi untuk meload data statistik jorong ke form input
  const handleSelectJorongForEdit = (jorongName) => {
    setEditJorong(jorongName);
    
    // Load data umum
    const umum = dataUmumJorong.find(d => d.jorong === jorongName);
    if (umum) setFormUmum({ kk: umum.kk, jiwa: umum.jiwa, anggota: umum.anggota, dasawisma: umum.dasawisma });

    // Load Pokja I
    const p1 = dataPokja1.find(d => d.jorong === jorongName);
    if (p1) setFormPokja1({ pkbn_kel: p1.pkbn_kel, pkbn_ang: p1.pkbn_ang, pkdrt_kel: p1.pkdrt_kel, pola_kel: p1.pola_kel, lansia_kel: p1.lansia_kel, gotong: p1.gotong, arisan: p1.arisan });

    // Load Pokja II
    const p2 = dataPokja2.find(d => d.jorong === jorongName);
    if (p2) setFormPokja2({ baca: p2.baca, up2k_kel: p2.up2k_kel, up2k_pes: p2.up2k_pes, mikro: p2.mikro, toko: p2.toko, koperasi: p2.koperasi });

    // Load Pokja III
    const p3 = dataPokja3.find(d => d.jorong === jorongName);
    if (p3) setFormPokja3({ kp: p3.kp, ks: p3.ks, ternak: p3.ternak, ikan: p3.ikan, warung: p3.warung, toga: p3.toga, r_sehat: p3.r_sehat, r_kurang: p3.r_kurang });

    // Load Pokja IV
    const p4 = dataPokja4.find(d => d.jorong === jorongName);
    if (p4) setFormPokja4({ k_pos: p4.k_pos, k_phbs: p4.k_phbs, k_kb: p4.k_kb, pos: p4.pos, jamban: p4.jamban, mck: p4.mck, kb_asep: p4.kb_asep });
  };

  // Fungsi untuk menyimpan perubahan data statistik
  const handleSaveStats = (e) => {
    e.preventDefault();

    if (pokjaFilter === 'Umum') {
      setDataUmumJorong(dataUmumJorong.map(d => d.jorong === editJorong ? { ...d, ...formUmum } : d));
    } else if (pokjaFilter === 'Pokja I') {
      setDataPokja1(dataPokja1.map(d => d.jorong === editJorong ? { ...d, ...formPokja1 } : d));
    } else if (pokjaFilter === 'Pokja II') {
      setDataPokja2(dataPokja2.map(d => d.jorong === editJorong ? { ...d, ...formPokja2 } : d));
    } else if (pokjaFilter === 'Pokja III') {
      setDataPokja3(dataPokja3.map(d => d.jorong === editJorong ? { ...d, ...formPokja3 } : d));
    } else if (pokjaFilter === 'Pokja IV') {
      setDataPokja4(dataPokja4.map(d => d.jorong === editJorong ? { ...d, ...formPokja4 } : d));
    }

    setIsEditingStats(false);
  };

  // Helper sum functions
  const sumData = (arr, key) => arr.reduce((sum, item) => sum + item[key], 0);

  // Filter anggota berdasarkan jorong
  const filteredAnggota = dataAnggota.filter(anggota => {
    if (jorongFilter === 'Semua') return true;
    return anggota.jorong === jorongFilter;
  });

  return (
    <div className="bg-gray-50 pb-20 min-h-screen">
      {/* --- GREEN HEADER BANNER --- */}
      <div className="bg-emerald-900 text-white text-center py-16 px-4 relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-sans font-semibold">Transparansi Data</span>
          <h1 className="text-4xl font-extrabold font-serif tracking-wide">Data &amp; Informasi</h1>
          <p className="text-sm text-emerald-200/90 font-light max-w-xl mx-auto">
            Dashboard publik rekapitulasi program PKK Nagari Suayan, Kec. Akabiluru
          </p>
        </div>
      </div>

      {/* --- SUBVIEW TOGGLE (Statistik vs Buku Adm) --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex justify-center space-x-2 bg-emerald-950/5 p-1 rounded-full max-w-sm mx-auto border border-emerald-900/10">
          <button
            onClick={() => setSubView('dashboard')}
            className={`flex-1 text-center py-1.5 rounded-full text-xs font-bold transition ${subView === 'dashboard' ? 'bg-emerald-800 text-white shadow-sm' : 'text-gray-600 hover:text-emerald-900'}`}
          >
            Dashboard Statistik
          </button>
          <button
            onClick={() => setSubView('administrasi')}
            className={`flex-1 text-center py-1.5 rounded-full text-xs font-bold transition ${subView === 'administrasi' ? 'bg-emerald-800 text-white shadow-sm' : 'text-gray-600 hover:text-emerald-900'}`}
          >
            Buku Administrasi
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* =============== DASHBOARD STATISTIK VIEW ================ */}
      {/* ======================================================== */}
      {subView === 'dashboard' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
          
          {/* Filter Tabs (Umum, Pokja I - IV) & Edit Toggle */}
          <div className="flex flex-wrap justify-between items-center gap-4 border-b pb-4">
            <div className="flex flex-wrap gap-2">
              {['Umum', 'Pokja I', 'Pokja II', 'Pokja III', 'Pokja IV', 'Posyandu'].map(tab => (
                <button
                  key={tab}
                  onClick={() => {
                    setPokjaFilter(tab);
                    setIsEditingStats(false); // Reset mode edit ketika ganti tab
                  }}
                  className={`px-5 py-2 text-xs font-bold rounded-md border transition ${pokjaFilter === tab ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {isAdmin && (
              <button
                onClick={() => {
                  setIsEditingStats(!isEditingStats);
                  handleSelectJorongForEdit(editJorong);
                }}
                className={`px-4 py-2 text-xs font-bold rounded-md transition shadow ${isEditingStats ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-emerald-700 text-white hover:bg-emerald-800'}`}
              >
                {isEditingStats ? 'Batal Edit' : 'Edit Data Statistik'}
              </button>
            )}
          </div>

          {/* Form input data statistik admin */}
          {isAdmin && isEditingStats && (
            <form onSubmit={handleSaveStats} className="bg-white p-6 rounded-lg border shadow-sm space-y-6 animate-in slide-in-from-top-4 duration-200">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-3 gap-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Form Penginputan Data - {pokjaFilter}</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">Ubah nilai statistik per jorong pada form di bawah.</p>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-xs font-bold text-gray-600">Pilih Wilayah/Jorong:</label>
                  <select 
                    value={editJorong}
                    onChange={(e) => handleSelectJorongForEdit(e.target.value)}
                    className="text-xs border rounded p-1.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white font-semibold text-gray-700"
                  >
                    <option value="Suayan Sabar">Suayan Sabar</option>
                    <option value="Suayan Tinggi">Suayan Tinggi</option>
                    <option value="Suayan Randah">Suayan Randah</option>
                    <option value="Suayan Soriak">Suayan Soriak</option>
                  </select>
                </div>
              </div>

              {/* Form Input Dinamis Berdasarkan Tab Terpilih */}
              {pokjaFilter === 'Umum' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Kepala Keluarga (KK)</label>
                    <input 
                      type="number" 
                      value={formUmum.kk}
                      onChange={(e) => setFormUmum({ ...formUmum, kk: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Jumlah Jiwa</label>
                    <input 
                      type="number" 
                      value={formUmum.jiwa}
                      onChange={(e) => setFormUmum({ ...formUmum, jiwa: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Anggota PKK</label>
                    <input 
                      type="number" 
                      value={formUmum.anggota}
                      onChange={(e) => setFormUmum({ ...formUmum, anggota: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Kelompok Dasawisma</label>
                    <input 
                      type="number" 
                      value={formUmum.dasawisma}
                      onChange={(e) => setFormUmum({ ...formUmum, dasawisma: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {pokjaFilter === 'Pokja I' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">PKBN Kelompok</label>
                    <input 
                      type="number" 
                      value={formPokja1.pkbn_kel}
                      onChange={(e) => setFormPokja1({ ...formPokja1, pkbn_kel: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">PKBN Anggota</label>
                    <input 
                      type="number" 
                      value={formPokja1.pkbn_ang}
                      onChange={(e) => setFormPokja1({ ...formPokja1, pkbn_ang: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">PKDRT Kelompok</label>
                    <input 
                      type="number" 
                      value={formPokja1.pkdrt_kel}
                      onChange={(e) => setFormPokja1({ ...formPokja1, pkdrt_kel: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Pola Asuh Kelompok</label>
                    <input 
                      type="number" 
                      value={formPokja1.pola_kel}
                      onChange={(e) => setFormPokja1({ ...formPokja1, pola_kel: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Kelompok Lansia</label>
                    <input 
                      type="number" 
                      value={formPokja1.lansia_kel}
                      onChange={(e) => setFormPokja1({ ...formPokja1, lansia_kel: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Kerja Bakti</label>
                    <input 
                      type="number" 
                      value={formPokja1.gotong}
                      onChange={(e) => setFormPokja1({ ...formPokja1, gotong: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Kelompok Arisan</label>
                    <input 
                      type="number" 
                      value={formPokja1.arisan}
                      onChange={(e) => setFormPokja1({ ...formPokja1, arisan: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {pokjaFilter === 'Pokja II' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Taman Bacaan</label>
                    <input 
                      type="number" 
                      value={formPokja2.baca}
                      onChange={(e) => setFormPokja2({ ...formPokja2, baca: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">UP2K Kelompok</label>
                    <input 
                      type="number" 
                      value={formPokja2.up2k_kel}
                      onChange={(e) => setFormPokja2({ ...formPokja2, up2k_kel: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">UP2K Peserta</label>
                    <input 
                      type="number" 
                      value={formPokja2.up2k_pes}
                      onChange={(e) => setFormPokja2({ ...formPokja2, up2k_pes: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Kader Keterampilan / Usaha Mikro</label>
                    <input 
                      type="number" 
                      value={formPokja2.mikro}
                      onChange={(e) => setFormPokja2({ ...formPokja2, mikro: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Toko PKK</label>
                    <input 
                      type="number" 
                      value={formPokja2.toko}
                      onChange={(e) => setFormPokja2({ ...formPokja2, toko: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Koperasi Hukum</label>
                    <input 
                      type="number" 
                      value={formPokja2.koperasi}
                      onChange={(e) => setFormPokja2({ ...formPokja2, koperasi: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {pokjaFilter === 'Pokja III' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Kader Pangan</label>
                    <input 
                      type="number" 
                      value={formPokja3.kp}
                      onChange={(e) => setFormPokja3({ ...formPokja3, kp: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Kader Sandang</label>
                    <input 
                      type="number" 
                      value={formPokja3.ks}
                      onChange={(e) => setFormPokja3({ ...formPokja3, ks: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Ternak Pekarangan</label>
                    <input 
                      type="number" 
                      value={formPokja3.ternak}
                      onChange={(e) => setFormPokja3({ ...formPokja3, ternak: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Ikan Pekarangan</label>
                    <input 
                      type="number" 
                      value={formPokja3.ikan}
                      onChange={(e) => setFormPokja3({ ...formPokja3, ikan: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Warung Hidup</label>
                    <input 
                      type="number" 
                      value={formPokja3.warung}
                      onChange={(e) => setFormPokja3({ ...formPokja3, warung: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Taman Obat Keluarga (Toga)</label>
                    <input 
                      type="number" 
                      value={formPokja3.toga}
                      onChange={(e) => setFormPokja3({ ...formPokja3, toga: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-800 mb-1">Rumah Sehat</label>
                    <input 
                      type="number" 
                      value={formPokja3.r_sehat}
                      onChange={(e) => setFormPokja3({ ...formPokja3, r_sehat: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-red-800 mb-1">Rumah Kurang Sehat</label>
                    <input 
                      type="number" 
                      value={formPokja3.r_kurang}
                      onChange={(e) => setFormPokja3({ ...formPokja3, r_kurang: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {pokjaFilter === 'Pokja IV' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Kader Posyandu</label>
                    <input 
                      type="number" 
                      value={formPokja4.k_pos}
                      onChange={(e) => setFormPokja4({ ...formPokja4, k_pos: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Kader PHBS</label>
                    <input 
                      type="number" 
                      value={formPokja4.k_phbs}
                      onChange={(e) => setFormPokja4({ ...formPokja4, k_phbs: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Kader KB</label>
                    <input 
                      type="number" 
                      value={formPokja4.k_kb}
                      onChange={(e) => setFormPokja4({ ...formPokja4, k_kb: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Jumlah Posyandu</label>
                    <input 
                      type="number" 
                      value={formPokja4.pos}
                      onChange={(e) => setFormPokja4({ ...formPokja4, pos: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Miliki Jamban Sehat</label>
                    <input 
                      type="number" 
                      value={formPokja4.jamban}
                      onChange={(e) => setFormPokja4({ ...formPokja4, jamban: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Miliki MCK</label>
                    <input 
                      type="number" 
                      value={formPokja4.mck}
                      onChange={(e) => setFormPokja4({ ...formPokja4, mck: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Aseptor KB</label>
                    <input 
                      type="number" 
                      value={formPokja4.kb_asep}
                      onChange={(e) => setFormPokja4({ ...formPokja4, kb_asep: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button 
                  type="submit" 
                  className="bg-emerald-700 text-white text-xs font-bold px-5 py-2 rounded hover:bg-emerald-800 transition shadow"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          )}

          {pokjaFilter === 'Umum' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Four Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-lg border-l-4 border-l-emerald-700 border-y border-r shadow-sm">
                  <span className="block text-3xl font-extrabold text-gray-800 font-serif">4</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block mt-1">Wilayah / Total Jorong</span>
                </div>
                <div className="bg-white p-5 rounded-lg border-l-4 border-l-blue-600 border-y border-r shadow-sm">
                  <span className="block text-3xl font-extrabold text-gray-800 font-serif">{sumData(dataUmumJorong, 'dasawisma')}</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block mt-1">Kelompok / Total Dasawisma</span>
                </div>
                <div className="bg-white p-5 rounded-lg border-l-4 border-l-amber-500 border-y border-r shadow-sm">
                  <span className="block text-3xl font-extrabold text-gray-800 font-serif">{sumData(dataUmumJorong, 'kk').toLocaleString('id-ID')}</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block mt-1">Kepala Keluarga / Total KK</span>
                </div>
                <div className="bg-white p-5 rounded-lg border-l-4 border-l-red-500 border-y border-r shadow-sm">
                  <span className="block text-3xl font-extrabold text-gray-800 font-serif">{sumData(dataUmumJorong, 'anggota').toLocaleString('id-ID')}</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block mt-1">Orang / Total Anggota PKK</span>
                </div>
              </div>

              {/* Two Column Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Bar Chart: Jumlah Jiwa per Jorong */}
                <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
                  <h3 className="text-sm font-bold text-gray-800">Jumlah Jiwa per Jorong</h3>
                  
                  {/* Bars Container */}
                  <div className="flex h-56 items-end justify-around px-4 border-b border-l pb-2 relative">
                    {/* Y-Axis Guideline values */}
                    <div className="absolute left-0 right-0 top-0 border-t border-dashed border-gray-100 h-0 pointer-events-none"></div>
                    <div className="absolute left-0 right-0 top-1/4 border-t border-dashed border-gray-100 h-0 pointer-events-none"></div>
                    <div className="absolute left-0 right-0 top-2/4 border-t border-dashed border-gray-100 h-0 pointer-events-none"></div>
                    <div className="absolute left-0 right-0 top-3/4 border-t border-dashed border-gray-100 h-0 pointer-events-none"></div>
                    
                    {dataUmumJorong.map(item => {
                      const maxVal = 2500;
                      const percentage = Math.min((item.jiwa / maxVal) * 100, 100);
                      return (
                        <div key={item.jorong} className="flex flex-col items-center group relative z-10 w-12">
                          {/* Tooltip value */}
                          <span className="absolute -top-7 bg-emerald-950 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition duration-200">
                            {item.jiwa}
                          </span>
                          {/* Bar */}
                          <div 
                            style={{ height: `${percentage}%` }}
                            className="w-8 bg-emerald-800 rounded-t group-hover:bg-emerald-700 transition duration-300 shadow-inner"
                          ></div>
                          {/* Label */}
                          <span className="text-[10px] font-semibold text-gray-500 mt-2 truncate w-full text-center">
                            {item.jorong.replace('Suayan ', '')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Donut Chart: Komposisi Jenis Kelamin */}
                <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6 flex flex-col justify-between">
                  <h3 className="text-sm font-bold text-gray-800">Komposisi Jenis Kelamin</h3>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
                    {/* Donut Chart drawn in CSS */}
                    <div 
                      className="w-36 h-36 rounded-full relative flex items-center justify-center shadow-inner"
                      style={{
                        background: `conic-gradient(#047857 0% 48.2%, #d97706 48.2% 100%)`
                      }}
                    >
                      {/* Inside circle to make it a donut */}
                      <div className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center shadow">
                        <span className="text-xs text-gray-400 font-bold leading-none">TOTAL JIWA</span>
                        <span className="text-lg font-extrabold text-gray-800 mt-1">
                          {sumData(dataUmumJorong, 'jiwa').toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    {/* Legends */}
                    <div className="space-y-4 text-xs font-semibold text-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-emerald-700 rounded-sm"></div>
                        <div>
                          <span className="block text-[11px] text-gray-400 font-bold leading-none">PEREMPUAN</span>
                          <span className="text-sm font-bold text-gray-800">
                            {Math.round(sumData(dataUmumJorong, 'jiwa') * 0.482).toLocaleString('id-ID')} 
                            <span className="text-[10px] text-gray-400 font-medium ml-1.5">(48.2%)</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-amber-600 rounded-sm"></div>
                        <div>
                          <span className="block text-[11px] text-gray-400 font-bold leading-none">LAKI-LAKI</span>
                          <span className="text-sm font-bold text-gray-800">
                            {Math.round(sumData(dataUmumJorong, 'jiwa') * 0.518).toLocaleString('id-ID')} 
                            <span className="text-[10px] text-gray-400 font-medium ml-1.5">(51.8%)</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Aggregate Table per Jorong */}
              <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <div className="p-5 border-b">
                  <h3 className="text-sm font-bold text-gray-800">Data Agregat per Jorong</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b text-gray-600 font-bold uppercase tracking-wider">
                        <th className="p-4">Jorong</th>
                        <th className="p-4 text-center">KK</th>
                        <th className="p-4 text-center">Jiwa</th>
                        <th className="p-4 text-center">Anggota PKK</th>
                        <th className="p-4 text-center">Dasawisma</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                      {dataUmumJorong.map(item => (
                        <tr key={item.jorong} className="hover:bg-gray-50/50 transition">
                          <td className="p-4 font-bold text-gray-900">{item.jorong}</td>
                          <td className="p-4 text-center">{item.kk.toLocaleString('id-ID')}</td>
                          <td className="p-4 text-center">{item.jiwa.toLocaleString('id-ID')}</td>
                          <td className="p-4 text-center">{item.anggota.toLocaleString('id-ID')}</td>
                          <td className="p-4 text-center">{item.dasawisma.toLocaleString('id-ID')}</td>
                        </tr>
                      ))}
                      <tr className="bg-emerald-50/50 font-bold text-gray-900 border-t-2">
                        <td className="p-4">Total</td>
                        <td className="p-4 text-center">{sumData(dataUmumJorong, 'kk').toLocaleString('id-ID')}</td>
                        <td className="p-4 text-center">{sumData(dataUmumJorong, 'jiwa').toLocaleString('id-ID')}</td>
                        <td className="p-4 text-center">{sumData(dataUmumJorong, 'anggota').toLocaleString('id-ID')}</td>
                        <td className="p-4 text-center">{sumData(dataUmumJorong, 'dasawisma').toLocaleString('id-ID')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* Pokja I Dashboard Table */}
          {pokjaFilter === 'Pokja I' && (
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden space-y-4 animate-in fade-in duration-200">
              <div className="p-5 border-b">
                <h3 className="text-sm font-bold text-gray-800">Data Pokja I — Penghayatan Pancasila &amp; Gotong Royong</h3>
                <p className="text-xs text-gray-400 mt-1">Laporan rekapitulasi data gotong royong dan keagamaan per Jorong.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b text-gray-600 font-bold uppercase tracking-wider">
                      <th className="p-4">Jorong</th>
                      <th className="p-4 text-center">PKBN Kelompok</th>
                      <th className="p-4 text-center">PKBN Anggota</th>
                      <th className="p-4 text-center">PKDRT Kelompok</th>
                      <th className="p-4 text-center">Pola Asuh Kelompok</th>
                      <th className="p-4 text-center">Kelompok Lansia</th>
                      <th className="p-4 text-center">Kerja Bakti</th>
                      <th className="p-4 text-center">Kel. Arisan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                    {dataPokja1.map(item => (
                      <tr key={item.jorong} className="hover:bg-gray-50/50 transition">
                        <td className="p-4 font-bold text-gray-900">{item.jorong}</td>
                        <td className="p-4 text-center">{item.pkbn_kel}</td>
                        <td className="p-4 text-center">{item.pkbn_ang}</td>
                        <td className="p-4 text-center">{item.pkdrt_kel}</td>
                        <td className="p-4 text-center">{item.pola_kel}</td>
                        <td className="p-4 text-center">{item.lansia_kel}</td>
                        <td className="p-4 text-center">{item.gotong}</td>
                        <td className="p-4 text-center">{item.arisan}</td>
                      </tr>
                    ))}
                    <tr className="bg-emerald-50/50 font-bold text-gray-900 border-t-2">
                      <td className="p-4">Total</td>
                      <td className="p-4 text-center">{sumData(dataPokja1, 'pkbn_kel')}</td>
                      <td className="p-4 text-center">{sumData(dataPokja1, 'pkbn_ang')}</td>
                      <td className="p-4 text-center">{sumData(dataPokja1, 'pkdrt_kel')}</td>
                      <td className="p-4 text-center">{sumData(dataPokja1, 'pola_kel')}</td>
                      <td className="p-4 text-center">{sumData(dataPokja1, 'lansia_kel')}</td>
                      <td className="p-4 text-center">{sumData(dataPokja1, 'gotong')}</td>
                      <td className="p-4 text-center">{sumData(dataPokja1, 'arisan')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pokja II Dashboard Table */}
          {pokjaFilter === 'Pokja II' && (
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden space-y-4 animate-in fade-in duration-200">
              <div className="p-5 border-b">
                <h3 className="text-sm font-bold text-gray-800">Data Pokja II — Pendidikan, Keterampilan &amp; Koperasi</h3>
                <p className="text-xs text-gray-400 mt-1">Laporan rekapitulasi data pendidikan warga dan kegiatan UP2K.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b text-gray-600 font-bold uppercase tracking-wider">
                      <th className="p-4">Jorong</th>
                      <th className="p-4 text-center">Taman Bacaan</th>
                      <th className="p-4 text-center">Kel. UP2K</th>
                      <th className="p-4 text-center">Peserta UP2K</th>
                      <th className="p-4 text-center">Usaha Mikro</th>
                      <th className="p-4 text-center">Toko PKK</th>
                      <th className="p-4 text-center">Koperasi Hukum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                    {dataPokja2.map(item => (
                      <tr key={item.jorong} className="hover:bg-gray-50/50 transition">
                        <td className="p-4 font-bold text-gray-900">{item.jorong}</td>
                        <td className="p-4 text-center">{item.baca}</td>
                        <td className="p-4 text-center">{item.up2k_kel}</td>
                        <td className="p-4 text-center">{item.up2k_pes}</td>
                        <td className="p-4 text-center">{item.mikro}</td>
                        <td className="p-4 text-center">{item.toko}</td>
                        <td className="p-4 text-center">{item.koperasi}</td>
                      </tr>
                    ))}
                    <tr className="bg-emerald-50/50 font-bold text-gray-900 border-t-2">
                      <td className="p-4">Total</td>
                      <td className="p-4 text-center">{sumData(dataPokja2, 'baca')}</td>
                      <td className="p-4 text-center">{sumData(dataPokja2, 'up2k_kel')}</td>
                      <td className="p-4 text-center">{sumData(dataPokja2, 'up2k_pes')}</td>
                      <td className="p-4 text-center">{sumData(dataPokja2, 'mikro')}</td>
                      <td className="p-4 text-center">{sumData(dataPokja2, 'toko')}</td>
                      <td className="p-4 text-center">{sumData(dataPokja2, 'koperasi')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pokja III Dashboard Table */}
          {pokjaFilter === 'Pokja III' && (
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden space-y-4 animate-in fade-in duration-200">
              <div className="p-5 border-b">
                <h3 className="text-sm font-bold text-gray-800">Data Pokja III — Pangan, Sandang &amp; Perumahan</h3>
                <p className="text-xs text-gray-400 mt-1">Laporan rekapitulasi data lumbung hidup, pemanfaatan pekarangan dan rumah sehat.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b text-gray-600 font-bold uppercase tracking-wider">
                      <th className="p-4">Jorong</th>
                      <th className="p-4 text-center">Kader Pangan</th>
                      <th className="p-4 text-center">Kader Sandang</th>
                      <th className="p-4 text-center font-semibold">Ternak Pekarangan</th>
                      <th className="p-4 text-center">Ikan Pekarangan</th>
                      <th className="p-4 text-center">Warung Hidup</th>
                      <th className="p-4 text-center">Toga</th>
                      <th className="p-4 text-center text-emerald-800">Rumah Sehat</th>
                      <th className="p-4 text-center text-red-800">Rumah K. Sehat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                    {dataPokja3.map(item => (
                      <tr key={item.jorong} className="hover:bg-gray-50/50 transition">
                        <td className="p-4 font-bold text-gray-900">{item.jorong}</td>
                        <td className="p-4 text-center">{item.kp}</td>
                        <td className="p-4 text-center">{item.ks}</td>
                        <td className="p-4 text-center">{item.ternak}</td>
                        <td className="p-4 text-center">{item.ikan}</td>
                        <td className="p-4 text-center">{item.warung}</td>
                        <td className="p-4 text-center">{item.toga}</td>
                        <td className="p-4 text-center text-emerald-700">{item.r_sehat}</td>
                        <td className="p-4 text-center text-red-600">{item.r_kurang}</td>
                      </tr>
                    ))}
                    <tr className="bg-emerald-50/50 font-bold text-gray-900 border-t-2">
                      <td className="p-4">Total</td>
                      <td className="p-4 text-center">{sumData(dataPokja3, 'kp')}</td>
                      <td className="p-4 text-center">{sumData(dataPokja3, 'ks')}</td>
                      <td className="p-4 text-center">{sumData(dataPokja3, 'ternak')}</td>
                      <td className="p-4 text-center">{sumData(dataPokja3, 'ikan')}</td>
                      <td className="p-4 text-center">{sumData(dataPokja3, 'warung')}</td>
                      <td className="p-4 text-center">{sumData(dataPokja3, 'toga')}</td>
                      <td className="p-4 text-center text-emerald-700">{sumData(dataPokja3, 'r_sehat')}</td>
                      <td className="p-4 text-center text-red-600">{sumData(dataPokja3, 'r_kurang')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pokja IV Dashboard Table */}
          {pokjaFilter === 'Pokja IV' && (
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden space-y-4 animate-in fade-in duration-200">
              <div className="p-5 border-b">
                <h3 className="text-sm font-bold text-gray-800">Data Pokja IV — Kesehatan &amp; Perencanaan Sehat</h3>
                <p className="text-xs text-gray-400 mt-1">Laporan rekapitulasi data posyandu, kesehatan lingkungan, dan keluarga berencana.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b text-gray-600 font-bold uppercase tracking-wider">
                      <th className="p-4">Jorong</th>
                      <th className="p-4 text-center">Kader Posyandu</th>
                      <th className="p-4 text-center">Kader PHBS</th>
                      <th className="p-4 text-center">Kader KB</th>
                      <th className="p-4 text-center">Jumlah Posyandu</th>
                      <th className="p-4 text-center">Miliki Jamban</th>
                      <th className="p-4 text-center">Miliki MCK</th>
                      <th className="p-4 text-center">Aseptor KB</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                    {dataPokja4.map(item => (
                      <tr key={item.jorong} className="hover:bg-gray-50/50 transition">
                        <td className="p-4 font-bold text-gray-900">{item.jorong}</td>
                        <td className="p-4 text-center">{item.k_pos}</td>
                        <td className="p-4 text-center">{item.k_phbs}</td>
                        <td className="p-4 text-center">{item.k_kb}</td>
                        <td className="p-4 text-center">{item.pos}</td>
                        <td className="p-4 text-center">{item.jamban}</td>
                        <td className="p-4 text-center">{item.mck}</td>
                        <td className="p-4 text-center">{item.kb_asep}</td>
                      </tr>
                    ))}
                    <tr className="bg-emerald-50/50 font-bold text-gray-900 border-t-2">
                      <td className="p-4">Total</td>
                      <td className="p-4 text-center">{sumData(dataPokja4, 'k_pos')}</td>
                      <td className="p-4 text-center">{sumData(dataPokja4, 'k_phbs')}</td>
                      <td className="p-4 text-center">{sumData(dataPokja4, 'k_kb')}</td>
                      <td className="p-4 text-center">{sumData(dataPokja4, 'pos')}</td>
                      <td className="p-4 text-center">{sumData(dataPokja4, 'jamban')}</td>
                      <td className="p-4 text-center">{sumData(dataPokja4, 'mck')}</td>
                      <td className="p-4 text-center">{sumData(dataPokja4, 'kb_asep')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {pokjaFilter === 'Posyandu' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              
              {/* Table Posyandu & Bayi (Read-Only Public view) */}
              <div className="bg-white rounded-lg border shadow-sm overflow-hidden space-y-4">
                <div className="p-5 border-b flex justify-between items-center bg-gray-50/50">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Data Posyandu &amp; Bayi Nagari Suayan</h3>
                    <p className="text-xs text-gray-400 mt-1 font-medium">Laporan rekapitulasi pelayanan Posyandu dan imunisasi bayi per Jorong.</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[11px] font-medium text-gray-700">
                    <thead>
                      <tr className="bg-gray-50 border-b text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-4">Jorong</th>
                        <th className="p-4">Posyandu</th>
                        <th className="p-4 text-center">Pengunjung</th>
                        <th className="p-4 text-center">Petugas</th>
                        <th className="p-4 text-center">Bayi Lahir</th>
                        <th className="p-4 text-center">Meninggal</th>
                        <th className="p-4 text-center">S</th>
                        <th className="p-4 text-center">K</th>
                        <th className="p-4 text-center">D</th>
                        <th className="p-4 text-center">N</th>
                        <th className="p-4 text-center">BCG</th>
                        <th className="p-4 text-center">DPT</th>
                        <th className="p-4 text-center">Polio</th>
                        <th className="p-4 text-center">Campak</th>
                        <th className="p-4 text-center">HepB</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {(dataPosyandu || []).map(item => (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition">
                          <td className="p-4 font-bold text-gray-900">{item.jorong}</td>
                          <td className="p-4 font-bold text-emerald-800">{item.posyandu}</td>
                          <td className="p-4 text-center font-semibold text-gray-600">{item.pengunjung}</td>
                          <td className="p-4 text-center text-gray-600">{item.petugas}</td>
                          <td className="p-4 text-center font-bold text-emerald-600">{item.bayi_lahir}</td>
                          <td className="p-4 text-center font-bold text-red-500">{item.meninggal}</td>
                          <td className="p-4 text-center text-gray-500">{item.s}</td>
                          <td className="p-4 text-center text-gray-500">{item.k}</td>
                          <td className="p-4 text-center text-gray-500">{item.d}</td>
                          <td className="p-4 text-center font-bold text-emerald-800">{item.n}</td>
                          <td className="p-4 text-center text-gray-500">{item.bcg}</td>
                          <td className="p-4 text-center text-gray-500">{item.dpt}</td>
                          <td className="p-4 text-center text-gray-500">{item.polio}</td>
                          <td className="p-4 text-center text-gray-500">{item.campak}</td>
                          <td className="p-4 text-center text-gray-500">{item.hepb}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Edukasi Warga Layman Box (Panduan Istilah Kesehatan) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* S K D N Explanation */}
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-lg shadow-sm space-y-4">
                  <h4 className="font-extrabold text-emerald-900 text-xs uppercase tracking-wide flex items-center">
                    <span className="mr-2 text-sm">💡</span> Panduan Singkat Istilah S, K, D, N
                  </h4>
                  <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
                    Indikator ini digunakan secara nasional di Posyandu untuk mengukur keberhasilan posyandu dan perkembangan kesehatan balita:
                  </p>
                  <ul className="space-y-3 text-[11px] text-emerald-950 font-medium">
                    <li className="flex items-start">
                      <span className="bg-emerald-850 text-white font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mr-2 text-[10px]">S</span>
                      <span><strong>Sasaran (S)</strong>: Jumlah seluruh balita yang ada di wilayah jorong tersebut.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-emerald-850 text-white font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mr-2 text-[10px]">K</span>
                      <span><strong>KMS (K)</strong>: Jumlah balita yang memiliki Kartu Menuju Sehat (Kuku Kesehatan/KMS) untuk pencatatan tumbuh kembang.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-emerald-850 text-white font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mr-2 text-[10px]">D</span>
                      <span><strong>Ditimbang (D)</strong>: Jumlah balita yang datang ke Posyandu dan ditimbang berat badannya bulan ini.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-emerald-850 text-white font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mr-2 text-[10px]">N</span>
                      <span><strong>Naik (N)</strong>: Jumlah balita yang mengalami kenaikan berat badan sesuai garis pertumbuhan KMS (indikator balita sehat).</span>
                    </li>
                  </ul>
                </div>

                {/* Immunization Explanation */}
                <div className="bg-amber-50 border border-amber-200/60 p-6 rounded-lg shadow-sm space-y-4">
                  <h4 className="font-extrabold text-amber-900 text-xs uppercase tracking-wide flex items-center">
                    <span className="mr-2 text-sm">💉</span> Mengenal Jenis Imunisasi Wajib Balita
                  </h4>
                  <p className="text-[11px] text-amber-850 leading-relaxed font-medium">
                    Imunisasi sangat penting untuk melindung anak-anak di Nagari Suayan dari penyakit menular berbahaya:
                  </p>
                  <ul className="space-y-3.5 text-[11px] text-stone-850 font-medium">
                    <li><strong>BCG</strong>: Vaksin sekali seumur hidup untuk melindungi bayi dari penyakit TBC paru yang berbahaya.</li>
                    <li><strong>DPT</strong>: Mencegah penyakit Difteri (infeksi tenggorokan), Pertusis (batuk rejan 100 hari), dan Tetanus.</li>
                    <li><strong>Polio</strong>: Mencegah kelumpuhan permanen pada otot dan kaki anak akibat virus Polio.</li>
                    <li><strong>Campak</strong>: Mencegah penyakit campak yang memicu demam tinggi, ruam kulit, radang paru, dan kebutaan.</li>
                    <li><strong>HepB (Hepatitis B)</strong>: Melindungi fungsi hati anak dari kerusakan kronis dan infeksi virus Hepatitis B.</li>
                  </ul>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* ============= BUKU DATA ADMINISTRASI VIEW ============= */}
      {/* ======================================================== */}
      {subView === 'administrasi' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Buku Data */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider px-3 mb-3">Pilihan Buku Data</h3>
              <button 
                onClick={() => setActiveDataMenu('ekspedisi')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition flex items-center justify-between ${activeDataMenu === 'ekspedisi' ? 'bg-emerald-800 text-white shadow-sm' : 'bg-white border text-gray-700 hover:bg-gray-50'}`}
              >
                <span>Buku Ekspedisi Surat Keluar</span>
                <span className="text-[10px] bg-emerald-950/20 px-2 py-0.5 rounded-full">{dataEkspedisi.length}</span>
              </button>
              
              <button 
                onClick={() => setActiveDataMenu('anggota')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition flex items-center justify-between ${activeDataMenu === 'anggota' ? 'bg-emerald-800 text-white shadow-sm' : 'bg-white border text-gray-700 hover:bg-gray-50'}`}
              >
                <span>Daftar Pengurus &amp; Anggota</span>
                <span className="text-[10px] bg-emerald-950/20 px-2 py-0.5 rounded-full">{dataAnggota.length}</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              {activeDataMenu === 'ekspedisi' && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Buku Ekspedisi Surat Keluar</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Mencatat seluruh surat dinas keluar TP-PKK Nagari Suayan.</p>
                    </div>
                    {isAdmin && (
                      <span className="self-start sm:self-center bg-red-100 text-red-800 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Mode Edit Admin</span>
                    )}
                  </div>

                  {/* Add Letter Form for Admin */}
                  {isAdmin && (
                    <form onSubmit={handleAddSurat} className="bg-white p-6 rounded-lg border shadow-sm space-y-4 font-sans">
                      <h4 className="text-sm font-bold text-gray-800 border-b pb-2">Tambah Surat Keluar Baru</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1">Tanggal Surat</label>
                          <input 
                            type="date" 
                            value={formSurat.tanggal}
                            onChange={(e) => setFormSurat({...formSurat, tanggal: e.target.value})}
                            className="w-full text-sm border rounded p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1">Nomor Surat</label>
                          <input 
                            type="text" 
                            placeholder="Contoh: 047/PKK-SUAYAN/VII/2026" 
                            value={formSurat.nomor_surat}
                            onChange={(e) => setFormSurat({...formSurat, nomor_surat: e.target.value})}
                            className="w-full text-sm border rounded p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1">Alamat Tujuan</label>
                          <input 
                            type="text" 
                            placeholder="Nama instansi atau jorong tujuan" 
                            value={formSurat.alamat_tujuan}
                            onChange={(e) => setFormSurat({...formSurat, alamat_tujuan: e.target.value})}
                            className="w-full text-sm border rounded p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1">Perihal</label>
                          <input 
                            type="text" 
                            placeholder="Inti atau perihal surat" 
                            value={formSurat.perihal}
                            onChange={(e) => setFormSurat({...formSurat, perihal: e.target.value})}
                            className="w-full text-sm border rounded p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                            required
                          />
                        </div>
                      </div>
                      <div className="flex justify-end pt-2">
                        <button type="submit" className="bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded hover:bg-emerald-800 transition">
                          Simpan Surat
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Expedition Table */}
                  <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-gray-50 border-b text-gray-600 font-bold uppercase tracking-wider">
                            <th className="p-4">Tanggal</th>
                            <th className="p-4">Nomor Surat</th>
                            <th className="p-4">Tujuan</th>
                            <th className="p-4">Perihal</th>
                            {isAdmin && <th className="p-4 text-center">Aksi</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                          {dataEkspedisi.length === 0 ? (
                            <tr>
                              <td colSpan={isAdmin ? 5 : 4} className="p-8 text-center text-gray-400">Belum ada data ekspedisi surat keluar.</td>
                            </tr>
                          ) : (
                            dataEkspedisi.map(item => (
                              <tr key={item.id} className="hover:bg-gray-50/50 transition">
                                <td className="p-4 whitespace-nowrap">{item.tanggal}</td>
                                <td className="p-4 font-mono font-semibold text-emerald-800">{item.nomor_surat}</td>
                                <td className="p-4">{item.alamat_tujuan}</td>
                                <td className="p-4 max-w-xs truncate">{item.perihal}</td>
                                {isAdmin && (
                                  <td className="p-4 text-center">
                                    <button 
                                      onClick={() => handleDeleteSurat(item.id)}
                                      className="bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1 rounded text-[10px] font-bold transition"
                                    >
                                      Hapus
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {activeDataMenu === 'anggota' && (
                <div className="space-y-6">
                  {/* Header and Filter */}
                  <div className="bg-white p-6 rounded-lg border shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Daftar Pengurus &amp; Anggota PKK</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Sistem data keanggotaan TP-PKK tingkat Nagari dan Jorong.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="text-xs font-bold text-gray-600 whitespace-nowrap">Filter Jorong:</label>
                      <select 
                        value={jorongFilter}
                        onChange={(e) => setJorongFilter(e.target.value)}
                        className="text-xs border rounded p-1.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white font-semibold text-gray-700"
                      >
                        <option value="Semua">Semua Jorong</option>
                        <option value="Suayan Sabar">Suayan Sabar</option>
                        <option value="Suayan Tinggi">Suayan Tinggi</option>
                        <option value="Suayan Randah">Suayan Randah</option>
                        <option value="Suayan Soriak">Suayan Soriak</option>
                      </select>
                    </div>
                  </div>

                  {/* Members Table */}
                  <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-gray-50 border-b text-gray-600 font-bold uppercase tracking-wider">
                            <th className="p-4">No.</th>
                            <th className="p-4">Nama Lengkap</th>
                            <th className="p-4">Jabatan</th>
                            <th className="p-4">Wilayah/Jorong</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                          {filteredAnggota.length === 0 ? (
                            <tr>
                              <td colSpan="4" className="p-8 text-center text-gray-400">Tidak ada pengurus terdaftar untuk Jorong ini.</td>
                            </tr>
                          ) : (
                            filteredAnggota.map((item, index) => (
                              <tr key={item.id} className="hover:bg-gray-50/50 transition">
                                <td className="p-4 text-gray-400">{index + 1}</td>
                                <td className="p-4 font-bold text-gray-900">{item.nama}</td>
                                <td className="p-4">{item.jabatan}</td>
                                <td className="p-4">
                                  <span className="bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                                    {item.jorong}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default DataPublikView;
