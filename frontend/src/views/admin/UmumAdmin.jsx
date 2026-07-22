import React, { useState } from 'react';

function UmumAdmin({ dataUmumJorong, setDataUmumJorong, API_URL }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editId, setEditId] = useState(null);

  const JORONG_OPTIONS = ['Suayan Sabar', 'Suayan Tinggi', 'Suayan Randah', 'Suayan Soriak'];

  const [formData, setFormData] = useState({
    jorong: 'Suayan Sabar',
    jumlah_dasawisma: 0,
    jumlah_krt: 0,
    jumlah_kk: 0,
    jiwa_l: 0,
    jiwa_p: 0,
    anggota_l: 0,
    anggota_p: 0,
    kader_umum_l: 0,
    kader_umum_p: 0,
    kader_khusus_l: 0,
    kader_khusus_p: 0,
    tenaga_honorer_l: 0,
    tenaga_honorer_p: 0,
    tenaga_bantuan_l: 0,
    tenaga_bantuan_p: 0,
    keterangan: ''
  });

  const handleOpenAdd = () => {
    setModalType('add');
    setEditId(null);
    setFormData({
      jorong: JORONG_OPTIONS[0],
      jumlah_dasawisma: 0,
      jumlah_krt: 0,
      jumlah_kk: 0,
      jiwa_l: 0,
      jiwa_p: 0,
      anggota_l: 0,
      anggota_p: 0,
      kader_umum_l: 0,
      kader_umum_p: 0,
      kader_khusus_l: 0,
      kader_khusus_p: 0,
      tenaga_honorer_l: 0,
      tenaga_honorer_p: 0,
      tenaga_bantuan_l: 0,
      tenaga_bantuan_p: 0,
      keterangan: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setModalType('edit');
    const targetId = item.id || item.jorong || item.nama_jorong;
    setEditId(targetId);
    setFormData({
      id: item.id,
      jorong: item.jorong || item.nama_jorong || 'Suayan Sabar',
      jumlah_dasawisma: item.jumlah_dasawisma !== undefined ? item.jumlah_dasawisma : (item.dasawisma || 0),
      jumlah_krt: item.jumlah_krt || 0,
      jumlah_kk: item.jumlah_kk !== undefined ? item.jumlah_kk : (item.kk || 0),
      jiwa_l: item.jiwa_l || 0,
      jiwa_p: item.jiwa_p || 0,
      anggota_l: item.anggota_l || 0,
      anggota_p: item.anggota_p || 0,
      kader_umum_l: item.kader_umum_l || 0,
      kader_umum_p: item.kader_umum_p || 0,
      kader_khusus_l: item.kader_khusus_l || 0,
      kader_khusus_p: item.kader_khusus_p || 0,
      tenaga_honorer_l: item.tenaga_honorer_l || 0,
      tenaga_honorer_p: item.tenaga_honorer_p || 0,
      tenaga_bantuan_l: item.tenaga_bantuan_l || 0,
      tenaga_bantuan_p: item.tenaga_bantuan_p || 0,
      keterangan: item.keterangan || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    const targetId = item.id || item.jorong || item.nama_jorong;
    if (!window.confirm(`Apakah Anda yakin ingin menghapus data umum rekap jorong "${item.jorong || item.nama_jorong}"?`)) return;
    try {
      const res = await fetch(`${API_URL}/umum/${targetId}`, { method: 'DELETE' });
      if (res.ok) {
        setDataUmumJorong(dataUmumJorong.filter(r => (r.id || r.jorong || r.nama_jorong) !== targetId));
      } else {
        setDataUmumJorong(dataUmumJorong.filter(r => (r.id || r.jorong || r.nama_jorong) !== targetId));
      }
    } catch (err) {
      console.warn(err);
      setDataUmumJorong(dataUmumJorong.filter(r => (r.id || r.jorong || r.nama_jorong) !== targetId));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const url = modalType === 'add' ? `${API_URL}/umum` : `${API_URL}/umum/${editId}`;
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
          setDataUmumJorong([...dataUmumJorong, saved]);
        } else {
          setDataUmumJorong(dataUmumJorong.map(item => (item.id || item.jorong || item.nama_jorong) === editId ? { ...item, ...formData } : item));
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
      setDataUmumJorong([...dataUmumJorong, { id: Date.now(), ...bodyData }]);
    } else {
      setDataUmumJorong(dataUmumJorong.map(item => (item.id || item.jorong || item.nama_jorong) === editId ? { ...item, ...bodyData } : item));
    }
  };

  // Kalkulasi Total Agregat Seluruh Jorong
  const total = dataUmumJorong.reduce((acc, r) => {
    acc.dasawisma += r.jumlah_dasawisma !== undefined ? r.jumlah_dasawisma : (r.dasawisma || 0);
    acc.krt += r.jumlah_krt || 0;
    acc.kk += r.jumlah_kk !== undefined ? r.jumlah_kk : (r.kk || 0);
    acc.jiwa_l += r.jiwa_l || 0;
    acc.jiwa_p += r.jiwa_p || 0;
    acc.anggota_l += r.anggota_l || 0;
    acc.anggota_p += r.anggota_p || 0;
    acc.kader_umum_l += r.kader_umum_l || 0;
    acc.kader_umum_p += r.kader_umum_p || 0;
    acc.kader_khusus_l += r.kader_khusus_l || 0;
    acc.kader_khusus_p += r.kader_khusus_p || 0;
    acc.tenaga_honorer_l += r.tenaga_honorer_l || 0;
    acc.tenaga_honorer_p += r.tenaga_honorer_p || 0;
    acc.tenaga_bantuan_l += r.tenaga_bantuan_l || 0;
    acc.tenaga_bantuan_p += r.tenaga_bantuan_p || 0;
    return acc;
  }, {
    dasawisma: 0, krt: 0, kk: 0, jiwa_l: 0, jiwa_p: 0, anggota_l: 0, anggota_p: 0,
    kader_umum_l: 0, kader_umum_p: 0, kader_khusus_l: 0, kader_khusus_p: 0,
    tenaga_honorer_l: 0, tenaga_honorer_p: 0, tenaga_bantuan_l: 0, tenaga_bantuan_p: 0
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header Informasi Resmi Data Umum PKK Nagari */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs font-bold text-gray-800 font-mono">
          <div className="flex items-center gap-3">
            <span className="w-20 text-gray-500 uppercase">NAGARI</span>
            <span className="text-emerald-900 font-extrabold">: SUAYAN</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-20 text-gray-500 uppercase">KECAMATAN</span>
            <span className="text-emerald-900 font-extrabold">: AKABILURU</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-20 text-gray-500 uppercase">KABUPATEN</span>
            <span className="text-emerald-900 font-extrabold">: LIMA PULUH KOTA</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-20 text-gray-500 uppercase">TAHUN</span>
            <span className="text-emerald-900 font-extrabold">: 2026</span>
          </div>
        </div>

        <button 
          onClick={handleOpenAdd}
          className="bg-[#005941] hover:bg-[#004230] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition shadow-sm flex items-center gap-1.5"
        >
          <span>+ Tambah Rekap Data Umum</span>
        </button>
      </div>

      {/* Judul Utama Dokumen */}
      <div className="text-center">
        <span className="block text-xs font-black text-[#005941] uppercase tracking-wider">DATA KEGIATAN TIM PENGGERAK PKK NAGARI</span>
        <span className="block text-sm font-serif font-black text-gray-900">DATA UMUM PKK</span>
      </div>

      {/* Tabel 21-Kolom Multi-Level Header Sesuai Dokumen Resmi */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              {/* Row 1 Header Makro */}
              <tr className="bg-[#005941] text-white text-[10px] font-bold uppercase tracking-wider text-center">
                <th rowSpan={3} className="p-2 border border-emerald-950 w-8">NO</th>
                <th rowSpan={3} className="p-2 border border-emerald-950 text-left min-w-[130px]">NAMA JORONG</th>
                <th colSpan={2} className="p-2 border border-emerald-950">JML KELOMPOK</th>
                <th colSpan={2} className="p-2 border border-emerald-950">JUMLAH</th>
                <th colSpan={2} className="p-2 border border-emerald-950">JUMLAH JIWA</th>
                <th colSpan={6} className="p-2 border border-emerald-950">JUMLAH KADER</th>
                <th colSpan={4} className="p-2 border border-emerald-950">JUMLAH TENAGA</th>
                <th rowSpan={3} className="p-2 border border-emerald-950 text-left">KET</th>
                <th rowSpan={3} className="p-2 border border-emerald-950 text-center w-24">AKSI</th>
              </tr>

              {/* Row 2 Sub-Header Mikro */}
              <tr className="bg-[#004e38] text-white text-[9px] font-bold text-center">
                <th rowSpan={2} className="p-1.5 border border-emerald-950">JORONG</th>
                <th rowSpan={2} className="p-1.5 border border-emerald-950">DASAWISMA</th>
                <th rowSpan={2} className="p-1.5 border border-emerald-950">KRT</th>
                <th rowSpan={2} className="p-1.5 border border-emerald-950">KK</th>
                <th rowSpan={2} className="p-1.5 border border-emerald-950">L</th>
                <th rowSpan={2} className="p-1.5 border border-emerald-950">P</th>
                <th colSpan={2} className="p-1.5 border border-emerald-950 bg-emerald-900/40">ANGGOTA TP PKK</th>
                <th colSpan={2} className="p-1.5 border border-emerald-950 bg-emerald-900/60">UMUM</th>
                <th colSpan={2} className="p-1.5 border border-emerald-950 bg-teal-900/60">KHUSUS</th>
                <th colSpan={2} className="p-1.5 border border-emerald-950">HONORER</th>
                <th colSpan={2} className="p-1.5 border border-emerald-950">BANTUAN</th>
              </tr>

              {/* Row 3 Sub-Header Mikro 2 (L / P) */}
              <tr className="bg-[#003b2a] text-white text-[9px] font-bold text-center">
                <th className="p-1 border border-emerald-950 bg-emerald-900/50">L</th>
                <th className="p-1 border border-emerald-950 bg-emerald-900/50">P</th>
                <th className="p-1 border border-emerald-950 bg-emerald-900/70">L</th>
                <th className="p-1 border border-emerald-950 bg-emerald-900/70">P</th>
                <th className="p-1 border border-emerald-950 bg-teal-900/70">L</th>
                <th className="p-1 border border-emerald-950 bg-teal-900/70">P</th>
                <th className="p-1 border border-emerald-950">L</th>
                <th className="p-1 border border-emerald-950">P</th>
                <th className="p-1 border border-emerald-950">L</th>
                <th className="p-1 border border-emerald-950">P</th>
              </tr>

              {/* Row 4 Penomoran Kolom 1 s.d 21 */}
              <tr className="bg-gray-100 text-gray-900 text-[10px] font-extrabold uppercase tracking-wider text-center border-b border-gray-400">
                <th className="p-1 border border-gray-300">1</th>
                <th className="p-1 border border-gray-300">2</th>
                <th className="p-1 border border-gray-300">3</th>
                <th className="p-1 border border-gray-300">6</th>
                <th className="p-1 border border-gray-300">7</th>
                <th className="p-1 border border-gray-300">8</th>
                <th className="p-1 border border-gray-300">9</th>
                <th className="p-1 border border-gray-300">10</th>
                <th className="p-1 border border-gray-300">11</th>
                <th className="p-1 border border-gray-300">12</th>
                <th className="p-1 border border-gray-300">13</th>
                <th className="p-1 border border-gray-300">14</th>
                <th className="p-1 border border-gray-300">15</th>
                <th className="p-1 border border-gray-300">16</th>
                <th className="p-1 border border-gray-300">17</th>
                <th className="p-1 border border-gray-300">18</th>
                <th className="p-1 border border-gray-300">19</th>
                <th className="p-1 border border-gray-300">20</th>
                <th className="p-1 border border-gray-300">21</th>
                <th className="p-1 border border-gray-300">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-medium text-gray-800 text-center bg-white">
              {dataGeneralLength() === 0 ? (
                <tr>
                  <td colSpan={20} className="p-8 text-center text-gray-400 font-bold italic bg-gray-50">
                    Belum ada rekap Data Umum PKK. Silakan klik "+ Tambah Rekap Data Umum".
                  </td>
                </tr>
              ) : (
                dataUmumJorong.map((item, idx) => {
                  const jorongName = item.jorong || item.nama_jorong;
                  const dasawisma = item.jumlah_dasawisma !== undefined ? item.jumlah_dasawisma : (item.dasawisma || 0);
                  const kk = item.jumlah_kk !== undefined ? item.jumlah_kk : (item.kk || 0);
                  const krt = item.jumlah_krt || 0;
                  const jl = item.jiwa_l || 0;
                  const jp = item.jiwa_p || 0;
                  const al = item.anggota_l || 0;
                  const ap = item.anggota_p || 0;

                  return (
                    <tr key={item.id || jorongName || idx} className="hover:bg-emerald-50/20 odd:bg-white even:bg-gray-50/50 transition">
                      <td className="p-2 border font-bold text-gray-400">{idx + 1}</td>
                      <td className="p-2 border text-left font-bold text-gray-900 uppercase">{jorongName}</td>
                      <td className="p-2 border font-semibold">1</td>
                      <td className="p-2 border font-extrabold text-[#005941] bg-emerald-50/30">{dasawisma}</td>
                      <td className="p-2 border text-gray-700">{krt}</td>
                      <td className="p-2 border text-gray-700 font-semibold">{kk}</td>
                      <td className="p-2 border text-gray-700">{jl}</td>
                      <td className="p-2 border text-gray-700">{jp}</td>
                      <td className="p-2 border bg-emerald-50/20 font-semibold">{al}</td>
                      <td className="p-2 border bg-emerald-50/20 font-semibold">{ap}</td>
                      <td className="p-2 border bg-emerald-50/30 text-emerald-800 font-bold">{item.kader_umum_l || 0}</td>
                      <td className="p-2 border bg-emerald-50/30 text-emerald-800 font-bold">{item.kader_umum_p || 0}</td>
                      <td className="p-2 border bg-teal-50/30 text-teal-800 font-bold">{item.kader_khusus_l || 0}</td>
                      <td className="p-2 border bg-teal-50/30 text-teal-800 font-bold">{item.kader_khusus_p || 0}</td>
                      <td className="p-2 border text-gray-700">{item.tenaga_honorer_l || 0}</td>
                      <td className="p-2 border text-gray-700">{item.tenaga_honorer_p || 0}</td>
                      <td className="p-2 border text-gray-700">{item.tenaga_bantuan_l || 0}</td>
                      <td className="p-2 border text-gray-700">{item.tenaga_bantuan_p || 0}</td>
                      <td className="p-2 border text-left text-gray-500 text-[10px]">{item.keterangan || '-'}</td>
                      <td className="p-2 border text-left flex items-center gap-2">
                        <button onClick={() => handleOpenEdit(item)} className="text-[#005941] hover:underline font-bold">Edit</button>
                        <button onClick={() => handleDelete(item)} className="text-red-500 hover:underline font-bold">Hapus</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {/* Baris Total Agregat TP PKK NAGARI / JUMLAH */}
            <tfoot>
              <tr className="bg-[#005941] text-white font-extrabold text-[10px] text-center border-t-2 border-emerald-950">
                <td colSpan={2} className="p-2.5 border border-emerald-950 text-center uppercase tracking-wider">
                  TP PKK NAGARI / JUMLAH
                </td>
                <td className="p-2 border border-emerald-950">{dataGeneralLength()}</td>
                <td className="p-2 border border-emerald-950 text-emerald-200">{total.dasawisma}</td>
                <td className="p-2 border border-emerald-950">{total.krt}</td>
                <td className="p-2 border border-emerald-950 text-emerald-200">{total.kk}</td>
                <td className="p-2 border border-emerald-950">{total.jiwa_l}</td>
                <td className="p-2 border border-emerald-950">{total.jiwa_p}</td>
                <td className="p-2 border border-emerald-950 bg-emerald-900/40">{total.anggota_l}</td>
                <td className="p-2 border border-emerald-950 bg-emerald-900/40">{total.anggota_p}</td>
                <td className="p-2 border border-emerald-950 text-emerald-200 bg-emerald-900/60">{total.kader_umum_l}</td>
                <td className="p-2 border border-emerald-950 text-emerald-200 bg-emerald-900/60">{total.kader_umum_p}</td>
                <td className="p-2 border border-emerald-950 text-teal-200 bg-teal-900/60">{total.kader_khusus_l}</td>
                <td className="p-2 border border-emerald-950 text-teal-200 bg-teal-900/60">{total.kader_khusus_p}</td>
                <td className="p-2 border border-emerald-950">{total.tenaga_honorer_l}</td>
                <td className="p-2 border border-emerald-950">{total.tenaga_honorer_p}</td>
                <td className="p-2 border border-emerald-950">{total.tenaga_bantuan_l}</td>
                <td className="p-2 border border-emerald-950">{total.tenaga_bantuan_p}</td>
                <td className="p-2 border border-emerald-950 text-left">-</td>
                <td className="p-2 border border-emerald-950"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Form Modal Tambah/Edit Data Umum per Jorong */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/45 backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-gray-100 shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#005941] text-white p-4 flex justify-between items-center">
              <h4 className="font-bold text-sm font-serif">
                {modalType === 'add' ? 'Tambah Rekap Data Umum Jorong Baru' : `Edit Data Umum PKK (${formData.jorong})`}
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-gray-250 text-xl font-bold">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto font-sans text-xs font-semibold text-gray-600">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Nama Jorong</label>
                {modalType === 'add' ? (
                  <select 
                    value={formData.jorong || JORONG_OPTIONS[0]} 
                    onChange={(e) => setFormData({...formData, jorong: e.target.value})} 
                    className="w-full border rounded p-2 text-xs text-gray-800 bg-white font-bold"
                  >
                    {JORONG_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                ) : (
                  <input type="text" value={formData.jorong || ''} disabled className="w-full border rounded p-2 text-xs text-gray-500 bg-gray-100 font-bold" />
                )}
              </div>

              <h5 className="font-bold border-b pb-1 text-[#005941] uppercase tracking-wider">1. Kelompok &amp; Rumah Tangga</h5>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Jml Kelompok Dasawisma</label>
                  <input type="number" value={formData.jumlah_dasawisma || 0} onChange={(e) => setFormData({...formData, jumlah_dasawisma: parseInt(e.target.value) || 0})} className="w-full border rounded p-2 text-xs text-gray-800" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Jumlah KRT (Kepala RT)</label>
                  <input type="number" value={formData.jumlah_krt || 0} onChange={(e) => setFormData({...formData, jumlah_krt: parseInt(e.target.value) || 0})} className="w-full border rounded p-2 text-xs text-gray-800" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Jumlah KK</label>
                  <input type="number" value={formData.jumlah_kk || 0} onChange={(e) => setFormData({...formData, jumlah_kk: parseInt(e.target.value) || 0})} className="w-full border rounded p-2 text-xs text-gray-800" />
                </div>
              </div>

              <h5 className="font-bold border-b pb-1 text-[#005941] uppercase tracking-wider pt-2">2. Kependudukan &amp; Anggota (L / P)</h5>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Jiwa Laki-Laki (L)</label>
                  <input type="number" value={formData.jiwa_l || 0} onChange={(e) => setFormData({...formData, jiwa_l: parseInt(e.target.value) || 0})} className="w-full border rounded p-2 text-xs text-gray-800" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Jiwa Perempuan (P)</label>
                  <input type="number" value={formData.jiwa_p || 0} onChange={(e) => setFormData({...formData, jiwa_p: parseInt(e.target.value) || 0})} className="w-full border rounded p-2 text-xs text-gray-800" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Anggota TP PKK (L)</label>
                  <input type="number" value={formData.anggota_l || 0} onChange={(e) => setFormData({...formData, anggota_l: parseInt(e.target.value) || 0})} className="w-full border rounded p-2 text-xs text-gray-800" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Anggota TP PKK (P)</label>
                  <input type="number" value={formData.anggota_p || 0} onChange={(e) => setFormData({...formData, anggota_p: parseInt(e.target.value) || 0})} className="w-full border rounded p-2 text-xs text-gray-800" />
                </div>
              </div>

              <h5 className="font-bold border-b pb-1 text-[#005941] uppercase tracking-wider pt-2">3. Jumlah Kader PKK (L / P)</h5>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-emerald-800 mb-1">Kader Umum (L)</label>
                  <input type="number" value={formData.kader_umum_l || 0} onChange={(e) => setFormData({...formData, kader_umum_l: parseInt(e.target.value) || 0})} className="w-full border border-emerald-300 rounded p-2 text-xs text-gray-800 bg-emerald-50/20" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-emerald-800 mb-1">Kader Umum (P)</label>
                  <input type="number" value={formData.kader_umum_p || 0} onChange={(e) => setFormData({...formData, kader_umum_p: parseInt(e.target.value) || 0})} className="w-full border border-emerald-300 rounded p-2 text-xs text-gray-800 bg-emerald-50/20" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-teal-800 mb-1">Kader Khusus (L)</label>
                  <input type="number" value={formData.kader_khusus_l || 0} onChange={(e) => setFormData({...formData, kader_khusus_l: parseInt(e.target.value) || 0})} className="w-full border border-teal-300 rounded p-2 text-xs text-gray-800 bg-teal-50/20" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-teal-800 mb-1">Kader Khusus (P)</label>
                  <input type="number" value={formData.kader_khusus_p || 0} onChange={(e) => setFormData({...formData, kader_khusus_p: parseInt(e.target.value) || 0})} className="w-full border border-teal-300 rounded p-2 text-xs text-gray-800 bg-teal-50/20" />
                </div>
              </div>

              <h5 className="font-bold border-b pb-1 text-[#005941] uppercase tracking-wider pt-2">4. Jumlah Tenaga (L / P)</h5>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Honorer (L)</label>
                  <input type="number" value={formData.tenaga_honorer_l || 0} onChange={(e) => setFormData({...formData, tenaga_honorer_l: parseInt(e.target.value) || 0})} className="w-full border rounded p-2 text-xs text-gray-800" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Honorer (P)</label>
                  <input type="number" value={formData.tenaga_honorer_p || 0} onChange={(e) => setFormData({...formData, tenaga_honorer_p: parseInt(e.target.value) || 0})} className="w-full border rounded p-2 text-xs text-gray-800" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Bantuan (L)</label>
                  <input type="number" value={formData.tenaga_bantuan_l || 0} onChange={(e) => setFormData({...formData, tenaga_bantuan_l: parseInt(e.target.value) || 0})} className="w-full border rounded p-2 text-xs text-gray-800" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Bantuan (P)</label>
                  <input type="number" value={formData.tenaga_bantuan_p || 0} onChange={(e) => setFormData({...formData, tenaga_bantuan_p: parseInt(e.target.value) || 0})} className="w-full border rounded p-2 text-xs text-gray-800" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Keterangan</label>
                <textarea 
                  rows="2" 
                  value={formData.keterangan || ''} 
                  onChange={(e) => setFormData({...formData, keterangan: e.target.value})} 
                  className="w-full border rounded p-2 text-xs text-gray-800"
                ></textarea>
              </div>

              <div className="pt-4 flex space-x-2 border-t mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 border text-gray-500 font-bold py-2 rounded font-sans">Batal</button>
                <button type="submit" className="flex-1 bg-[#005941] hover:bg-[#004230] text-white font-bold py-2 rounded shadow font-sans">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  function dataGeneralLength() {
    return dataUmumJorong.length;
  }
}

export default UmumAdmin;
