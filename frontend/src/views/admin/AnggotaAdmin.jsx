import React, { useState } from 'react';

function AnggotaAdmin({ dataAnggota, setDataAnggota, API_URL }) {
  // Mode tampilan: 'anggota' (Mode 11 Kolom) atau 'kader' (Mode 13 Kolom)
  const [viewMode, setViewMode] = useState('anggota');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    no_registrasi: '',
    nama: '',
    jenis_kelamin: 'P',
    kedudukan_anggota: 'Angg Pkj',
    kader_umum: false,
    kader_khusus: false,
    tempat_lahir: 'Suayan',
    tanggal_lahir: '',
    status_perkawinan: 'k', // k: Menikah, bk: Lajang, cm: Cerai Mati, ch: Cerai Hidup
    alamat: 'Suayan Sabar',
    pendidikan: 'SLTA',
    pekerjaan: 'Mengurus RT',
    keterangan: ''
  });

  const handleOpenAdd = () => {
    setModalType('add');
    setEditId(null);
    setFormData({
      no_registrasi: '',
      nama: '',
      jenis_kelamin: 'P',
      kedudukan_anggota: 'Angg Pkj',
      kader_umum: false,
      kader_khusus: false,
      tempat_lahir: 'Suayan',
      tanggal_lahir: '',
      status_perkawinan: 'k',
      alamat: 'Suayan Sabar',
      pendidikan: 'SLTA',
      pekerjaan: 'Mengurus RT',
      keterangan: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setModalType('edit');
    setEditId(item.id || item.id_anggota);
    setFormData({
      no_registrasi: item.no_registrasi || '',
      nama: item.nama || '',
      jenis_kelamin: item.jenis_kelamin || 'P',
      kedudukan_anggota: item.kedudukan_anggota || item.jabatan || item.jabatan_pkk || 'Angg Pkj',
      kader_umum: !!item.kader_umum,
      kader_khusus: !!item.kader_khusus,
      tempat_lahir: item.tempat_lahir || 'Suayan',
      tanggal_lahir: item.tanggal_lahir ? item.tanggal_lahir.substring(0, 10) : '',
      status_perkawinan: item.status_perkawinan || 'k',
      alamat: item.alamat || item.jorong || item.nama_jorong || 'Suayan Sabar',
      pendidikan: item.pendidikan || 'SLTA',
      pekerjaan: item.pekerjaan || 'Mengurus RT',
      keterangan: item.keterangan || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data anggota/kader ini?")) return;
    try {
      const res = await fetch(`${API_URL}/buku-anggota/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDataAnggota(dataAnggota.filter(item => (item.id || item.id_anggota) !== id));
      } else {
        setDataAnggota(dataAnggota.filter(item => (item.id || item.id_anggota) !== id));
      }
    } catch (err) {
      console.warn(err);
      setDataAnggota(dataAnggota.filter(item => (item.id || item.id_anggota) !== id));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const url = modalType === 'add' ? `${API_URL}/buku-anggota` : `${API_URL}/buku-anggota/${editId}`;
    const method = modalType === 'add' ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        if (modalType === 'add') {
          const saved = await res.json();
          setDataAnggota([...dataAnggota, saved]);
        } else {
          setDataAnggota(dataAnggota.map(item => (item.id || item.id_anggota) === editId ? { ...item, ...formData } : item));
        }
      } else {
        runOfflineSave(formData);
      }
    } catch (err) {
      console.warn(err);
      runOfflineSave(formData);
    }
    setIsModalOpen(false);
  };

  const runOfflineSave = (bodyData) => {
    if (modalType === 'add') {
      setDataAnggota([...dataAnggota, { id: Date.now(), ...bodyData }]);
    } else {
      setDataAnggota(dataAnggota.map(item => (item.id || item.id_anggota) === editId ? { ...item, ...bodyData } : item));
    }
  };

  const formatTanggal = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Printable CSS */}
      <style>{`
        @media print {
          @page {
            size: landscape;
            margin: 15mm;
          }
          body {
            background: white !important;
            color: black !important;
          }
          aside, header, nav, .no-print, button {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          th, td {
            border: 1px solid #000 !important;
            padding: 5px !important;
          }
        }
        .print-only {
          display: none;
        }
      `}</style>

      {/* Bagian Paling Atas: Tab Toggle Mode & Tombol Tambah (No-Print) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        {/* Toggle Switch Dual-View */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
          <button
            onClick={() => setViewMode('anggota')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              viewMode === 'anggota' 
                ? 'bg-[#005941] text-white shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
            }`}
          >
            <span>🔘</span>
            <span>Mode Buku Anggota TP-PKK (11 Kolom)</span>
          </button>
          <button
            onClick={() => setViewMode('kader')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              viewMode === 'kader' 
                ? 'bg-[#005941] text-white shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
            }`}
          >
            <span>⚪</span>
            <span>Mode Buku Anggota &amp; Kader (13 Kolom)</span>
          </button>
        </div>

        {/* Tombol Utama Tambah */}
        <button 
          onClick={handleOpenAdd}
          className="bg-[#005941] hover:bg-[#004230] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition shadow flex items-center gap-1.5"
        >
          <span>+ Tambah Anggota / Kader</span>
        </button>
      </div>

      {/* Header Informasi Wilayah Resmi */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs font-bold text-gray-800 font-mono">
          <div className="flex items-center gap-3">
            <span className="w-20 text-gray-500 uppercase">Nagari</span>
            <span className="text-emerald-900 font-extrabold">: SUAYAN</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-20 text-gray-500 uppercase">Kec.</span>
            <span className="text-emerald-900 font-extrabold">: AKABILURU</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-20 text-gray-500 uppercase">Kab/Kota</span>
            <span className="text-emerald-900 font-extrabold">: LIMA PULUH KOTA</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-20 text-gray-500 uppercase">Prov.</span>
            <span className="text-emerald-900 font-extrabold">: SUMATERA BARAT</span>
          </div>
        </div>
      </div>

      {/* Kop Judul Tabel Berdasarkan Mode Tampilan Active */}
      <div className="text-center">
        <h3 className="text-lg font-black font-serif uppercase tracking-wider text-gray-900 underline">
          {viewMode === 'anggota' 
            ? 'BUKU DAFTAR ANGGOTA TIM PENGGERAK PKK' 
            : 'BUKU DAFTAR ANGGOTA TP.PKK DAN KADER Tahun 2026'}
        </h3>
      </div>

      {/* CONDITIONAL RENDERING TABEL */}
      {viewMode === 'anggota' ? (
        /* FORMAT 11 KOLOM (Mode Buku Anggota TP-PKK) */
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-gray-900 text-[10px] font-extrabold uppercase tracking-wider text-center border-b border-gray-400">
                  <th className="p-2 border border-gray-300 w-10">1</th>
                  <th className="p-2 border border-gray-300">2</th>
                  <th className="p-2 border border-gray-300">3</th>
                  <th className="p-2 border border-gray-300">4</th>
                  <th className="p-2 border border-gray-300">5</th>
                  <th className="p-2 border border-gray-300">6</th>
                  <th className="p-2 border border-gray-300">7</th>
                  <th className="p-2 border border-gray-300">8</th>
                  <th className="p-2 border border-gray-300">9</th>
                  <th className="p-2 border border-gray-300">10</th>
                  <th className="p-2 border border-gray-300">11</th>
                  <th className="p-2 border border-gray-300 w-24 no-print">AKSI</th>
                </tr>
                <tr className="bg-[#005941] text-white text-[10px] font-bold uppercase tracking-wider text-center">
                  <th className="p-2.5 border border-emerald-950">NO</th>
                  <th className="p-2.5 border border-emerald-950 text-left">NAMA</th>
                  <th className="p-2.5 border border-emerald-950 text-left">JABATAN</th>
                  <th className="p-2.5 border border-emerald-950">JNS KELAMIN (L/P)</th>
                  <th className="p-2.5 border border-emerald-950 text-left">TEMPAT LAHIR</th>
                  <th className="p-2.5 border border-emerald-950">TG/BL/TH.LAHIR / UMUR</th>
                  <th className="p-2.5 border border-emerald-950">STATUS</th>
                  <th className="p-2.5 border border-emerald-950 text-left">ALAMAT</th>
                  <th className="p-2.5 border border-emerald-950 text-left">PENDIDIKAN</th>
                  <th className="p-2.5 border border-emerald-950 text-left">PEKERJAAN</th>
                  <th className="p-2.5 border border-emerald-950 text-left">KET</th>
                  <th className="p-2.5 border border-emerald-950 text-left no-print">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 font-medium text-gray-800 bg-white">
                {dataAnggota.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="p-8 text-center text-gray-400 font-bold italic bg-gray-50">
                      Belum ada data anggota. Silakan klik "+ Tambah Anggota / Kader".
                    </td>
                  </tr>
                ) : (
                  dataAnggota.map((item, idx) => (
                    <tr key={item.id || item.id_anggota || idx} className="hover:bg-emerald-50/20 odd:bg-white even:bg-gray-50/50 transition">
                      <td className="p-2.5 border text-center font-bold text-gray-500">{idx + 1}</td>
                      <td className="p-2.5 border text-left font-bold text-gray-900 uppercase">{item.nama}</td>
                      <td className="p-2.5 border text-left font-semibold text-emerald-900">{item.kedudukan_anggota || item.jabatan || item.jabatan_pkk || 'Angg Pkj'}</td>
                      <td className="p-2.5 border text-center font-bold">{item.jenis_kelamin || 'P'}</td>
                      <td className="p-2.5 border text-left">{item.tempat_lahir || 'Suayan'}</td>
                      <td className="p-2.5 border text-center font-mono text-[11px]">{formatTanggal(item.tanggal_lahir)}</td>
                      <td className="p-2.5 border text-center font-bold text-gray-700">{item.status_perkawinan || 'k'}</td>
                      <td className="p-2.5 border text-left font-semibold">{item.alamat || item.jorong || item.nama_jorong || 'Suayan Sabar'}</td>
                      <td className="p-2.5 border text-left font-semibold text-gray-700">{item.pendidikan || '-'}</td>
                      <td className="p-2.5 border text-left text-gray-700">{item.pekerjaan || 'Mengurus RT'}</td>
                      <td className="p-2.5 border text-left text-gray-500 text-[11px]">{item.keterangan || '-'}</td>
                      <td className="p-2.5 border text-left flex items-center gap-2 no-print">
                        <button onClick={() => handleOpenEdit(item)} className="text-[#005941] hover:underline font-bold">Edit</button>
                        <button onClick={() => handleDelete(item.id || item.id_anggota)} className="text-red-500 hover:underline font-bold">Hapus</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* FORMAT 13 KOLOM (Mode Buku Anggota & Kader Multi-Level Header) */
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-gray-300">
              <thead>
                <tr className="bg-[#005941] text-white text-[10px] font-bold uppercase tracking-wider text-center">
                  <th rowSpan={2} className="p-2.5 border border-emerald-950 w-10">No</th>
                  <th rowSpan={2} className="p-2.5 border border-emerald-950 text-left">NO REGISTRASI</th>
                  <th rowSpan={2} className="p-2.5 border border-emerald-950 text-left">NAMA</th>
                  <th rowSpan={2} className="p-2.5 border border-emerald-950">JNS KELAMIN (L/P)</th>
                  <th colSpan={3} className="p-2 border border-emerald-950">KEDUDUKAN / FUNGSI</th>
                  <th rowSpan={2} className="p-2.5 border border-emerald-950">TG/BL/TH.LAHIR/UMUR</th>
                  <th rowSpan={2} className="p-2.5 border border-emerald-950">STATUS</th>
                  <th rowSpan={2} className="p-2.5 border border-emerald-950 text-left">ALAMAT</th>
                  <th rowSpan={2} className="p-2.5 border border-emerald-950 text-left">PENDIDIKAN</th>
                  <th rowSpan={2} className="p-2.5 border border-emerald-950 text-left">PEKERJAAN</th>
                  <th rowSpan={2} className="p-2.5 border border-emerald-950 text-left">KET</th>
                  <th rowSpan={2} className="p-2.5 border border-emerald-950 text-left w-24 no-print">AKSI</th>
                </tr>
                <tr className="bg-[#004e38] text-white text-[9px] font-bold text-center">
                  <th className="p-2 border border-emerald-950 text-left">DLM KEANGGOTAAN TP PKK</th>
                  <th className="p-2 border border-emerald-950">KADER UMUM</th>
                  <th className="p-2 border border-emerald-950">KADER KHUSUS</th>
                </tr>
                <tr className="bg-gray-100 text-gray-900 text-[10px] font-extrabold uppercase tracking-wider text-center border-b border-gray-400">
                  <th className="p-1.5 border border-gray-300">1</th>
                  <th className="p-1.5 border border-gray-300">2</th>
                  <th className="p-1.5 border border-gray-300">3</th>
                  <th className="p-1.5 border border-gray-300">4</th>
                  <th className="p-1.5 border border-gray-300">5</th>
                  <th className="p-1.5 border border-gray-300">6</th>
                  <th className="p-1.5 border border-gray-300">7</th>
                  <th className="p-1.5 border border-gray-300">8</th>
                  <th className="p-1.5 border border-gray-300">9</th>
                  <th className="p-1.5 border border-gray-300">10</th>
                  <th className="p-1.5 border border-gray-300">11</th>
                  <th className="p-1.5 border border-gray-300">12</th>
                  <th className="p-1.5 border border-gray-300">13</th>
                  <th className="p-1.5 border border-gray-300 no-print">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 font-medium text-gray-800 bg-white">
                {dataAnggota.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="p-8 text-center text-gray-400 font-bold italic bg-gray-50">
                      Belum ada data anggota &amp; kader. Silakan klik "+ Tambah Anggota / Kader".
                    </td>
                  </tr>
                ) : (
                  dataAnggota.map((item, idx) => (
                    <tr key={item.id || item.id_anggota || idx} className="hover:bg-emerald-50/20 odd:bg-white even:bg-gray-50/50 transition">
                      <td className="p-2.5 border text-center font-bold text-gray-500">{idx + 1}</td>
                      <td className="p-2.5 border text-left font-mono text-gray-600">{item.no_registrasi || '-'}</td>
                      <td className="p-2.5 border text-left font-bold text-gray-900 uppercase">{item.nama}</td>
                      <td className="p-2.5 border text-center font-bold">{item.jenis_kelamin || 'P'}</td>
                      <td className="p-2.5 border text-left font-semibold text-emerald-900">{item.kedudukan_anggota || item.jabatan || item.jabatan_pkk || 'Angg Pkj'}</td>
                      <td className="p-2.5 border text-center text-emerald-900 font-bold">
                        {item.kader_umum ? '✓' : ''}
                      </td>
                      <td className="p-2.5 border text-center text-emerald-900 font-bold">
                        {item.kader_khusus ? '✓' : ''}
                      </td>
                      <td className="p-2.5 border text-center font-mono text-[11px]">{formatTanggal(item.tanggal_lahir)}</td>
                      <td className="p-2.5 border text-center font-bold text-gray-700">{item.status_perkawinan || 'k'}</td>
                      <td className="p-2.5 border text-left font-semibold">{item.alamat || item.jorong || item.nama_jorong || 'Suayan Sabar'}</td>
                      <td className="p-2.5 border text-left font-semibold text-gray-700">{item.pendidikan || '-'}</td>
                      <td className="p-2.5 border text-left text-gray-700">{item.pekerjaan || 'Mengurus RT'}</td>
                      <td className="p-2.5 border text-left text-gray-500 text-[11px]">{item.keterangan || '-'}</td>
                      <td className="p-2.5 border text-left flex items-center gap-2 no-print">
                        <button onClick={() => handleOpenEdit(item)} className="text-[#005941] hover:underline font-bold">Edit</button>
                        <button onClick={() => handleDelete(item.id || item.id_anggota)} className="text-red-500 hover:underline font-bold">Hapus</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bottom Action Bar: Cetak PDF & Petunjuk Legend (No-Print) */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm no-print">
        <div className="text-[11px] font-medium text-gray-500 space-y-0.5 font-sans">
          <span className="block font-bold text-gray-800">Petunjuk Format Cetak:</span>
          <span>Mode aktif saat ini: <strong>{viewMode === 'anggota' ? 'Buku Anggota TP-PKK (11 Kolom)' : 'Buku Anggota & Kader (13 Kolom)'}</strong></span>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition shadow flex items-center gap-2"
        >
          <span>🖨️</span>
          <span>Cetak Laporan PDF ({viewMode === 'anggota' ? '11 Kolom' : '13 Kolom'})</span>
        </button>
      </div>

      {/* Catatan Keterangan Resmi Dokumen Fisik PKK */}
      <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 text-[11px] font-medium text-emerald-950 space-y-1 font-sans">
        <span className="block font-bold text-emerald-900">Catatan Pengisian Dokumen Resmi:</span>
        <ul className="list-disc list-inside space-y-0.5 text-gray-700">
          <li><strong>Digunakan untuk:</strong> Setiap jenjang TP-PKK (Nagari / Kecamatan / Kabupaten)</li>
          <li><strong>Status Perkawinan:</strong> <code className="bg-emerald-100 px-1 rounded font-bold">bk</code> (Lajang/Belum Menikah), <code className="bg-emerald-100 px-1 rounded font-bold">k</code> (Menikah), <code className="bg-emerald-100 px-1 rounded font-bold">cm</code> (Cerai Mati), <code className="bg-emerald-100 px-1 rounded font-bold">ch</code> (Cerai Hidup)</li>
          <li><strong>Kedudukan pada Keanggotaan PKK:</strong> Anggota TP-PKK / Kader Nagari Suayan</li>
          <li><strong>Pendidikan:</strong> Pendidikan terakhir yang pernah diikuti (SD, SLTP, SLTA, D3, S1, S2)</li>
        </ul>
      </div>

      {/* SINGLE SHARED MODAL FORM TAMBAH / EDIT ANGGOTA & KADER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/45 backdrop-blur-sm no-print">
          <div className="bg-white rounded-xl border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#005941] text-white p-4 flex justify-between items-center">
              <h4 className="font-bold text-sm font-serif">
                {modalType === 'add' ? 'Tambah Data Anggota / Kader' : 'Edit Data Anggota / Kader'}
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-gray-250 text-xl font-bold">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto font-sans text-xs font-semibold text-gray-600">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">No Registrasi</label>
                  <input 
                    type="text" 
                    value={formData.no_registrasi || ''} 
                    onChange={(e) => setFormData({...formData, no_registrasi: e.target.value})} 
                    className="w-full border rounded p-2 text-xs text-gray-800" 
                    placeholder="Opsional (Contoh: REG-001)"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={formData.nama || ''} 
                    onChange={(e) => setFormData({...formData, nama: e.target.value})} 
                    className="w-full border rounded p-2 text-xs text-gray-800 uppercase" 
                    required 
                    placeholder="Contoh: JANUARNIS IRWANUL FIAD"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Kedudukan Dlm Keanggotaan TP PKK</label>
                  <select 
                    value={formData.kedudukan_anggota || 'Angg Pkj'} 
                    onChange={(e) => setFormData({...formData, kedudukan_anggota: e.target.value})} 
                    className="w-full border rounded p-2 text-xs bg-white text-gray-800 font-bold"
                  >
                    <option value="Ketua">Ketua</option>
                    <option value="Wk. Ketua">Wk. Ketua</option>
                    <option value="Sekretaris">Sekretaris</option>
                    <option value="Wk. Sekretaris">Wk. Sekretaris</option>
                    <option value="Bendahara">Bendahara</option>
                    <option value="Pokja 1">Pokja 1</option>
                    <option value="Pokja 2">Pokja 2</option>
                    <option value="Pokja 3">Pokja 3</option>
                    <option value="Pokja 4">Pokja 4</option>
                    <option value="Angg Pkj">Angg Pkj</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Jenis Kelamin</label>
                  <select 
                    value={formData.jenis_kelamin || 'P'} 
                    onChange={(e) => setFormData({...formData, jenis_kelamin: e.target.value})} 
                    className="w-full border rounded p-2 text-xs bg-white text-gray-800"
                  >
                    <option value="P">P (Perempuan)</option>
                    <option value="L">L (Laki-laki)</option>
                  </select>
                </div>
              </div>

              {/* Opsi Pilihan Jenis Kader */}
              <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-200 space-y-2">
                <span className="block text-[10px] font-bold text-emerald-900 uppercase">Pilihan Jenis Kader:</span>
                <div className="flex items-center space-x-6 text-xs font-bold text-gray-700">
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.kader_umum} 
                      onChange={(e) => setFormData({...formData, kader_umum: e.target.checked})} 
                      className="rounded text-emerald-800 focus:ring-emerald-700"
                    />
                    <span>Kader Umum</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.kader_khusus} 
                      onChange={(e) => setFormData({...formData, kader_khusus: e.target.checked})} 
                      className="rounded text-emerald-800 focus:ring-emerald-700"
                    />
                    <span>Kader Khusus</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Tempat Lahir</label>
                  <input 
                    type="text" 
                    value={formData.tempat_lahir || ''} 
                    onChange={(e) => setFormData({...formData, tempat_lahir: e.target.value})} 
                    className="w-full border rounded p-2 text-xs text-gray-800" 
                    placeholder="Contoh: Suayan / Padang"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Tanggal Lahir</label>
                  <input 
                    type="date" 
                    value={formData.tanggal_lahir || ''} 
                    onChange={(e) => setFormData({...formData, tanggal_lahir: e.target.value})} 
                    className="w-full border rounded p-2 text-xs text-gray-800" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Status Perkawinan</label>
                  <select 
                    value={formData.status_perkawinan || 'k'} 
                    onChange={(e) => setFormData({...formData, status_perkawinan: e.target.value})} 
                    className="w-full border rounded p-2 text-xs bg-white text-gray-800 font-bold"
                  >
                    <option value="k">k (Menikah)</option>
                    <option value="bk">bk (Belum Menikah / Lajang)</option>
                    <option value="cm">cm (Cerai Mati)</option>
                    <option value="ch">ch (Cerai Hidup)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Alamat / Jorong</label>
                  <select 
                    value={formData.alamat || 'Suayan Sabar'} 
                    onChange={(e) => setFormData({...formData, alamat: e.target.value})} 
                    className="w-full border rounded p-2 text-xs bg-white text-gray-800"
                  >
                    <option value="Suayan Sabar">Suayan Sabar</option>
                    <option value="Suayan Tinggi">Suayan Tinggi</option>
                    <option value="Suayan Randah">Suayan Randah</option>
                    <option value="Suayan Soriak">Suayan Soriak</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Pendidikan Terakhir</label>
                  <input 
                    type="text" 
                    value={formData.pendidikan || ''} 
                    onChange={(e) => setFormData({...formData, pendidikan: e.target.value})} 
                    className="w-full border rounded p-2 text-xs text-gray-800" 
                    placeholder="Contoh: SLTA, S1, SMP, SD"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Pekerjaan</label>
                  <input 
                    type="text" 
                    value={formData.pekerjaan || ''} 
                    onChange={(e) => setFormData({...formData, pekerjaan: e.target.value})} 
                    className="w-full border rounded p-2 text-xs text-gray-800" 
                    placeholder="Contoh: Mengurus RT, Staf Nagari, Bamus"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Keterangan</label>
                <textarea 
                  rows="2"
                  value={formData.keterangan || ''} 
                  onChange={(e) => setFormData({...formData, keterangan: e.target.value})} 
                  className="w-full border rounded p-2 text-xs text-gray-800" 
                  placeholder="Catatan keanggotaan tambahan..."
                ></textarea>
              </div>

              <div className="pt-4 flex space-x-2 border-t mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 border text-gray-500 font-bold py-2 rounded">Batal</button>
                <button type="submit" className="flex-1 bg-[#005941] hover:bg-[#004230] text-white font-bold py-2 rounded shadow">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnggotaAdmin;
