import React, { useState } from 'react';

function PosyanduAdmin({ dataPosyandu, setDataPosyandu, API_URL }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    jorong: 'Suayan Tinggi', posyandu: '', pengunjung: 0, petugas: 5,
    bayi_lahir: 0, meninggal: 0, s: 0, k: 0, d: 0, n: 0,
    bcg: 0, dpt: 0, polio: 0, campak: 0, hepb: 0
  });

  const handleOpenAdd = () => {
    setModalType('add');
    setEditId(null);
    setFormData({
      jorong: 'Suayan Tinggi', posyandu: '', pengunjung: 0, petugas: 5,
      bayi_lahir: 0, meninggal: 0, s: 0, k: 0, d: 0, n: 0,
      bcg: 0, dpt: 0, polio: 0, campak: 0, hepb: 0
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setModalType('edit');
    setEditId(item.id);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data posyandu ini?")) return;
    try {
      const res = await fetch(`${API_URL}/posyandu/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDataPosyandu(dataPosyandu.filter(item => item.id !== id));
      } else {
        setDataPosyandu(dataPosyandu.filter(item => item.id !== id));
      }
    } catch (err) {
      console.warn(err);
      setDataPosyandu(dataPosyandu.filter(item => item.id !== id));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const url = modalType === 'add' ? `${API_URL}/posyandu` : `${API_URL}/posyandu/${editId}`;
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
          setDataPosyandu([...dataPosyandu, saved]);
        } else {
          setDataPosyandu(dataPosyandu.map(item => item.id === editId ? { ...item, ...formData } : item));
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
      setDataPosyandu([...dataPosyandu, { id: Date.now(), ...formData }]);
    } else {
      setDataPosyandu(dataPosyandu.map(item => item.id === editId ? { ...item, ...formData } : item));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-extrabold text-gray-800 font-serif">Buku Registrasi Posyandu</h3>
        <button 
          onClick={handleOpenAdd}
          className="bg-emerald-850 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-md transition shadow"
        >
          + Tambah Posyandu
        </button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-medium text-gray-700">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Nama Posyandu</th>
                <th className="p-4">Jorong</th>
                <th className="p-4 text-center">Pengunjung</th>
                <th className="p-4 text-center">Petugas</th>
                <th className="p-4 text-center">S / K / D / N</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {dataPosyandu.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-bold text-gray-900">{item.posyandu}</td>
                  <td className="p-4">{item.jorong}</td>
                  <td className="p-4 text-center font-bold text-emerald-800">{item.pengunjung}</td>
                  <td className="p-4 text-center">{item.petugas}</td>
                  <td className="p-4 text-center text-gray-500 font-mono">
                    {item.s}/{item.k}/{item.d}/{item.n}
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
          <div className="bg-white rounded-lg border shadow-xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-emerald-900 text-white p-5 flex justify-between items-center">
              <h4 className="font-bold text-sm">{modalType === 'add' ? 'Tambah Posyandu' : 'Edit Posyandu'}</h4>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-200 hover:text-white text-lg font-bold">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto font-sans text-xs">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Nama Posyandu</label>
                  <input type="text" value={formData.posyandu || ''} onChange={(e) => setFormData({...formData, posyandu: e.target.value})} className="w-full border rounded p-2" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Jorong/Wilayah</label>
                  <select value={formData.jorong || 'Suayan Tinggi'} onChange={(e) => setFormData({...formData, jorong: e.target.value})} className="w-full border rounded p-2 bg-white">
                    <option value="Suayan Tinggi">Suayan Tinggi</option>
                    <option value="Suayan Sabar">Suayan Sabar</option>
                    <option value="Suayan Randah">Suayan Randah</option>
                    <option value="Suayan Soriak">Suayan Soriak</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Jumlah Pengunjung</label>
                  <input type="number" value={formData.pengunjung || 0} onChange={(e) => setFormData({...formData, pengunjung: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Jumlah Petugas</label>
                  <input type="number" value={formData.petugas || 0} onChange={(e) => setFormData({...formData, petugas: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Bayi Lahir</label>
                  <input type="number" value={formData.bayi_lahir || 0} onChange={(e) => setFormData({...formData, bayi_lahir: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Bayi Meninggal</label>
                  <input type="number" value={formData.meninggal || 0} onChange={(e) => setFormData({...formData, meninggal: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Semua Balita (S)</label>
                  <input type="number" value={formData.s || 0} onChange={(e) => setFormData({...formData, s: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Miliki KMS (K)</label>
                  <input type="number" value={formData.k || 0} onChange={(e) => setFormData({...formData, k: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Ditimbang (D)</label>
                  <input type="number" value={formData.d || 0} onChange={(e) => setFormData({...formData, d: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Naik BB (N)</label>
                  <input type="number" value={formData.n || 0} onChange={(e) => setFormData({...formData, n: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Imunisasi BCG</label>
                  <input type="number" value={formData.bcg || 0} onChange={(e) => setFormData({...formData, bcg: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Imunisasi DPT</label>
                  <input type="number" value={formData.dpt || 0} onChange={(e) => setFormData({...formData, dpt: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                </div>
              </div>
              <div className="pt-4 flex space-x-2 border-t mt-4">
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

export default PosyanduAdmin;
