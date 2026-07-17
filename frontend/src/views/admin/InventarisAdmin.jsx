import React, { useState } from 'react';

function InventarisAdmin({ dataInventaris, setDataInventaris, API_URL }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    nama_barang: '', asal_barang: '', tanggal_penerimaan: '', jumlah: 1, tempat_penyimpanan: '', kondisi_barang: 'Baik', keterangan: ''
  });

  const handleOpenAdd = () => {
    setModalType('add');
    setEditId(null);
    setFormData({
      nama_barang: '', asal_barang: '', tanggal_penerimaan: '', jumlah: 1, tempat_penyimpanan: '', kondisi_barang: 'Baik', keterangan: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setModalType('edit');
    setEditId(item.id);
    setFormData({
      ...item,
      tanggal_penerimaan: item.tanggal_penerimaan ? item.tanggal_penerimaan.substring(0, 10) : ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data barang inventaris ini?")) return;
    try {
      const res = await fetch(`${API_URL}/inventaris/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDataInventaris(dataInventaris.filter(item => item.id !== id));
      } else {
        setDataInventaris(dataInventaris.filter(item => item.id !== id));
      }
    } catch (err) {
      console.warn(err);
      setDataInventaris(dataInventaris.filter(item => item.id !== id));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const url = modalType === 'add' ? `${API_URL}/inventaris` : `${API_URL}/inventaris/${editId}`;
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
          setDataInventaris([...dataInventaris, saved]);
        } else {
          setDataInventaris(dataInventaris.map(item => item.id === editId ? { ...item, ...formData } : item));
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
      setDataInventaris([...dataInventaris, { id: Date.now(), ...formData }]);
    } else {
      setDataInventaris(dataInventaris.map(item => item.id === editId ? { ...item, ...formData } : item));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-extrabold text-gray-800 font-serif">Buku Inventaris Barang PKK</h3>
        <button 
          onClick={handleOpenAdd}
          className="bg-emerald-850 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-md transition shadow"
        >
          + Tambah Barang
        </button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-medium text-gray-700">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Nama Barang</th>
                <th className="p-4">Asal / Penerimaan</th>
                <th className="p-4 text-center">Jumlah</th>
                <th className="p-4">Kondisi &amp; Tempat Simpan</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {dataInventaris.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-bold text-gray-900">{item.nama_barang}</td>
                  <td className="p-4">
                    <span className="block">{item.asal_barang}</span>
                    <span className="text-[10px] text-gray-450">{item.tanggal_penerimaan ? item.tanggal_penerimaan.substring(0, 10) : ''}</span>
                  </td>
                  <td className="p-4 text-center font-bold text-emerald-850">{item.jumlah}</td>
                  <td className="p-4">
                    <span className="block font-bold text-gray-800">{item.tempat_penyimpanan}</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${item.kondisi_barang === 'Baik' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                      {item.kondisi_barang}
                    </span>
                  </td>
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
              <h4 className="font-bold text-sm">{modalType === 'add' ? 'Tambah Inventaris' : 'Edit Inventaris'}</h4>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-200 hover:text-white text-lg font-bold">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 font-sans text-xs">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Nama Barang</label>
                <input type="text" value={formData.nama_barang || ''} onChange={(e) => setFormData({...formData, nama_barang: e.target.value})} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Asal/Sumber Perolehan</label>
                <input type="text" value={formData.asal_barang || ''} onChange={(e) => setFormData({...formData, asal_barang: e.target.value})} className="w-full border rounded p-2" placeholder="Contoh: Bantuan PKK Kabupaten" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Tanggal Penerimaan</label>
                <input type="date" value={formData.tanggal_penerimaan || ''} onChange={(e) => setFormData({...formData, tanggal_penerimaan: e.target.value})} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Jumlah</label>
                <input type="number" value={formData.jumlah || 1} onChange={(e) => setFormData({...formData, jumlah: parseInt(e.target.value) || 1})} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Tempat Penyimpanan</label>
                <input type="text" value={formData.tempat_penyimpanan || ''} onChange={(e) => setFormData({...formData, tempat_penyimpanan: e.target.value})} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Kondisi Barang</label>
                <select value={formData.kondisi_barang || 'Baik'} onChange={(e) => setFormData({...formData, kondisi_barang: e.target.value})} className="w-full border rounded p-2 bg-white">
                  <option value="Baik">Baik</option>
                  <option value="Rusak Ringan">Rusak Ringan</option>
                  <option value="Rusak Berat">Rusak Berat</option>
                </select>
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

export default InventarisAdmin;
