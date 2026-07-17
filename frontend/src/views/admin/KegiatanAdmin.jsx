import React, { useState } from 'react';

function KegiatanAdmin({ dataKegiatan, setDataKegiatan, API_URL }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    nama: '', jabatan: '', tanggal: '', tempat: '', uraian_kegiatan: '', kategori: 'Rapat'
  });

  const handleOpenAdd = () => {
    setModalType('add');
    setEditId(null);
    setFormData({
      nama: '', jabatan: '', tanggal: '', tempat: '', uraian_kegiatan: '', kategori: 'Rapat'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setModalType('edit');
    setEditId(item.id);
    setFormData({
      nama: item.nama,
      jabatan: item.jabatan,
      tanggal: item.tanggal ? item.tanggal.substring(0, 10) : '',
      tempat: item.tempat,
      uraian_kegiatan: item.uraian_kegiatan,
      kategori: item.kategori || 'Rapat'
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
          setDataKegiatan(dataKegiatan.map(item => item.id === editId ? { ...item, ...formData } : item));
        }
      } else {
        runOfflineSave();
      }
    } catch (err) {
      console.warn(err);
      runOfflineSave();
    }
    setIsModalOpen(false);
  };

  const runOfflineSave = () => {
    if (modalType === 'add') {
      setDataKegiatan([{ id: Date.now(), ...formData, foto: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&q=80&w=400" }, ...dataKegiatan]);
    } else {
      setDataKegiatan(dataKegiatan.map(item => item.id === editId ? { ...item, ...formData } : item));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-extrabold text-gray-800 font-serif">Buku Catatan Kegiatan PKK</h3>
        <button 
          onClick={handleOpenAdd}
          className="bg-emerald-850 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-md transition shadow"
        >
          + Catat Kegiatan
        </button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-medium text-gray-700">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Tanggal</th>
                <th className="p-4">Nama Pelapor</th>
                <th className="p-4">Tempat &amp; Kategori</th>
                <th className="p-4">Uraian Kegiatan</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {dataKegiatan.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-bold text-gray-450">{item.tanggal ? item.tanggal.substring(0, 10) : ''}</td>
                  <td className="p-4">
                    <span className="block font-bold text-gray-900">{item.nama}</span>
                    <span className="text-[10px] text-gray-450">{item.jabatan}</span>
                  </td>
                  <td className="p-4">
                    <span className="block font-bold text-gray-800">{item.tempat}</span>
                    <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full font-bold text-[9px]">{item.kategori || 'Rapat'}</span>
                  </td>
                  <td className="p-4 max-w-xs truncate text-gray-500 font-light">{item.uraian_kegiatan}</td>
                  <td className="p-4 text-center space-x-2">
                    <button onClick={() => handleOpenEdit(item)} className="text-gray-400 hover:text-emerald-700 font-bold">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 font-bold">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg border shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-emerald-900 text-white p-5 flex justify-between items-center">
              <h4 className="font-bold text-sm">{modalType === 'add' ? 'Tambah Catatan Kegiatan' : 'Edit Catatan Kegiatan'}</h4>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-200 hover:text-white text-lg font-bold">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 font-sans text-xs">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Tanggal Kegiatan</label>
                <input type="date" value={formData.tanggal || ''} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Kategori Kegiatan</label>
                <select value={formData.kategori || 'Rapat'} onChange={(e) => setFormData({...formData, kategori: e.target.value})} className="w-full border rounded p-2 bg-white">
                  <option value="Rapat">Rapat</option>
                  <option value="Penyuluhan">Penyuluhan</option>
                  <option value="Pelatihan">Pelatihan</option>
                  <option value="Kunjungan">Kunjungan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Nama Pembawa/Pelapor</label>
                <input type="text" value={formData.nama || ''} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Jabatan Pelapor</label>
                <input type="text" value={formData.jabatan || ''} onChange={(e) => setFormData({...formData, jabatan: e.target.value})} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Tempat Pelaksanaan</label>
                <input type="text" value={formData.tempat || ''} onChange={(e) => setFormData({...formData, tempat: e.target.value})} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Uraian / Ringkasan Kegiatan</label>
                <textarea rows="3" value={formData.uraian_kegiatan || ''} onChange={(e) => setFormData({...formData, uraian_kegiatan: e.target.value})} className="w-full border rounded p-2" required></textarea>
              </div>
              <div className="pt-4 flex space-x-2 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 border text-gray-500 font-bold py-2 rounded">Batal</button>
                <button type="submit" className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 rounded shadow">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default KegiatanAdmin;
