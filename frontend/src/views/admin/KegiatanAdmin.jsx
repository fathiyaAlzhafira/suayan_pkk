import React, { useState } from 'react';

function KegiatanAdmin({ dataKegiatan, setDataKegiatan, API_URL }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    nama: '', jabatan: '', tanggal: '', tempat: '', uraian_kegiatan: ''
  });

  const handleOpenAdd = () => {
    setModalType('add');
    setEditId(null);
    setFormData({
      nama: '', jabatan: '', tanggal: '', tempat: '', uraian_kegiatan: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setModalType('edit');
    setEditId(item.id);
    setFormData({
      nama: item.nama || '',
      jabatan: item.jabatan || '',
      tanggal: item.tanggal ? item.tanggal.substring(0, 10) : '',
      tempat: item.tempat || '',
      uraian_kegiatan: item.uraian_kegiatan || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data laporan kegiatan ini?")) return;
    try {
      const res = await fetch(`${API_URL}/kegiatan/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDataKegiatan(dataKegiatan.filter(item => item.id !== id));
      } else {
        setDataKegiatan(dataKegiatan.filter(item => item.id !== id));
      }
    } catch (err) {
      console.warn(err);
      setDataKegiatan(dataKegiatan.filter(item => item.id !== id));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const url = modalType === 'add' ? `${API_URL}/kegiatan` : `${API_URL}/kegiatan/${editId}`;
    const method = modalType === 'add' ? 'POST' : 'PUT';
    
    let bodyData = { ...formData };
    if (modalType === 'add') {
      bodyData.foto = "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&q=80&w=400";
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      if (res.ok) {
        if (modalType === 'add') {
          const saved = await res.json();
          setDataKegiatan([saved, ...dataKegiatan]);
        } else {
          setDataKegiatan(dataKegiatan.map(item => item.id === editId ? { ...item, ...bodyData } : item));
        }
      } else {
        runOfflineSave(bodyData);
      }
    } catch (err) {
      console.warn(err);
      runOfflineSave(bodyData);
    }
    setIsModalOpen(false);
  };

  const runOfflineSave = (bodyData) => {
    if (modalType === 'add') {
      setDataKegiatan([{ id: Date.now(), ...bodyData, foto: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&q=80&w=400" }, ...dataKegiatan]);
    } else {
      setDataKegiatan(dataKegiatan.map(item => item.id === editId ? { ...item, ...bodyData } : item));
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Panel Card */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-black font-serif text-gray-900">Buku Catatan Kegiatan PKK</h3>
          <p className="text-[11px] text-gray-500 font-medium">Laporan partisipasi, jadwal, lokasi, dan uraian pelaksanaan kegiatan PKK</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-[#005941] hover:bg-[#004230] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition shadow-sm flex items-center gap-1.5"
        >
          <span>+ Tambah Kegiatan PKK</span>
        </button>
      </div>

      {/* Tabel Data Catatan Kegiatan */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-gray-200">
            <thead>
              {/* Row 1 Header */}
              <tr className="bg-[#005941] text-white text-[10px] font-bold uppercase tracking-wider text-center">
                <th rowSpan={2} className="p-3 border border-emerald-900 text-left w-12">NO</th>
                <th rowSpan={2} className="p-3 border border-emerald-900 text-left">NAMA</th>
                <th rowSpan={2} className="p-3 border border-emerald-900 text-left">JABATAN</th>
                <th colSpan={3} className="p-2 border border-emerald-900">KEGIATAN</th>
                <th rowSpan={2} className="p-3 border border-emerald-900 text-left w-24">AKSI</th>
              </tr>
              {/* Row 2 Header Sub-kolom KEGIATAN */}
              <tr className="bg-[#004e38] text-white text-[9px] font-bold text-center">
                <th className="p-2 border border-emerald-950">TANGGAL</th>
                <th className="p-2 border border-emerald-950 text-left">TEMPAT</th>
                <th className="p-2 border border-emerald-950 text-left">URAIAN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 font-medium text-center text-gray-700 bg-white">
              {dataKegiatan.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400 font-bold italic bg-gray-50">
                    Belum ada data catatan kegiatan. Silakan klik "+ Tambah Kegiatan PKK".
                  </td>
                </tr>
              ) : (
                dataKegiatan.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-emerald-50/20 odd:bg-white even:bg-gray-50/50 transition">
                    <td className="p-3 border text-left font-bold text-gray-400">{idx + 1}</td>
                    <td className="p-3 border text-left font-bold text-gray-900">{item.nama}</td>
                    <td className="p-3 border text-left text-gray-600">{item.jabatan}</td>
                    <td className="p-3 border text-gray-600 font-mono text-center">
                      {item.tanggal ? item.tanggal.substring(0, 10) : '-'}
                    </td>
                    <td className="p-3 border text-left font-semibold text-gray-800">{item.tempat}</td>
                    <td className="p-3 border text-left text-gray-600 text-[11px] leading-relaxed max-w-sm">
                      {item.uraian_kegiatan}
                    </td>
                    <td className="p-3 border text-left flex items-center gap-3">
                      <button onClick={() => handleOpenEdit(item)} className="text-[#005941] hover:underline font-bold">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:underline font-bold">Hapus</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/45 backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-gray-100 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#005941] text-white p-4 flex justify-between items-center">
              <h4 className="font-bold text-sm font-serif">
                {modalType === 'add' ? 'Tambah Catatan Kegiatan Baru' : 'Edit Catatan Kegiatan'}
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-gray-250 text-xl font-bold">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 font-sans text-xs font-semibold text-gray-600">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Nama</label>
                <input 
                  type="text" 
                  value={formData.nama || ''} 
                  onChange={(e) => setFormData({...formData, nama: e.target.value})} 
                  className="w-full border rounded p-2 text-xs text-gray-800" 
                  placeholder="Nama Pembawa/Pelapor Kegiatan"
                  required 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Jabatan</label>
                <input 
                  type="text" 
                  value={formData.jabatan || ''} 
                  onChange={(e) => setFormData({...formData, jabatan: e.target.value})} 
                  className="w-full border rounded p-2 text-xs text-gray-800" 
                  placeholder="Contoh: Ketua Pokja I / Kader Posyandu"
                  required 
                />
              </div>

              <div className="border-t pt-3">
                <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-2">Detail Kegiatan</span>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Tanggal Kegiatan</label>
                    <input 
                      type="date" 
                      value={formData.tanggal || ''} 
                      onChange={(e) => setFormData({...formData, tanggal: e.target.value})} 
                      className="w-full border rounded p-2 text-xs text-gray-800" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Tempat Pelaksanaan</label>
                    <input 
                      type="text" 
                      value={formData.tempat || ''} 
                      onChange={(e) => setFormData({...formData, tempat: e.target.value})} 
                      className="w-full border rounded p-2 text-xs text-gray-800" 
                      placeholder="Contoh: Aula Kantor Nagari Suayan"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Uraian Kegiatan</label>
                    <textarea 
                      rows="3" 
                      value={formData.uraian_kegiatan || ''} 
                      onChange={(e) => setFormData({...formData, uraian_kegiatan: e.target.value})} 
                      className="w-full border rounded p-2 text-xs text-gray-800" 
                      placeholder="Uraikan detail ringkasan kegiatan yang dilaksanakan..."
                      required
                    ></textarea>
                  </div>
                </div>
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

export default KegiatanAdmin;
