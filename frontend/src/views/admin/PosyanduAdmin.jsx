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
    <div className="space-y-6 font-sans">
      {/* Header Panel Card */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-black font-serif text-gray-900">Buku Registrasi Posyandu</h3>
          <p className="text-[11px] text-gray-500 font-medium">Kelola rekapitulasi penimbangan balita, kesehatan lansia, dan capaian SKDN Posyandu</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-[#005941] hover:bg-[#004230] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition shadow-sm flex items-center gap-1.5"
        >
          <span>+ Tambah Posyandu</span>
        </button>
      </div>

      {/* Tabel Data Posyandu */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#005941] text-white text-[10px] font-bold uppercase tracking-wider text-center">
                <th className="p-2.5 border border-emerald-950 text-left">Nama Posyandu</th>
                <th className="p-2.5 border border-emerald-950 text-left">Jorong</th>
                <th className="p-2.5 border border-emerald-950 text-center">Pengunjung</th>
                <th className="p-2.5 border border-emerald-950 text-center">Petugas</th>
                <th className="p-2.5 border border-emerald-950 text-center">S / K / D / N</th>
                <th className="p-2.5 border border-emerald-950 text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-medium text-gray-800 bg-white">
              {dataPosyandu.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400 font-bold italic bg-gray-50">
                    Belum ada data Posyandu (kosong). Silakan klik "+ Tambah Posyandu".
                  </td>
                </tr>
              ) : (
                dataPosyandu.map(item => (
                  <tr key={item.id} className="hover:bg-emerald-50/20 odd:bg-white even:bg-gray-50/50 transition">
                    <td className="p-2.5 border font-bold text-gray-900 uppercase">{item.posyandu}</td>
                    <td className="p-2.5 border font-semibold">{item.jorong}</td>
                    <td className="p-2.5 border text-center font-bold text-[#005941] bg-emerald-50/30">{item.pengunjung}</td>
                    <td className="p-2.5 border text-center">{item.petugas}</td>
                    <td className="p-2.5 border text-center font-bold text-gray-700 font-mono">
                      {item.s} / {item.k} / {item.d} / {item.n}
                    </td>
                    <td className="p-2.5 border text-center space-x-2">
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
          <div className="bg-white rounded-xl border border-gray-100 shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#005941] text-white p-4 flex justify-between items-center">
              <h4 className="font-bold text-sm font-serif">{modalType === 'add' ? 'Tambah Data Posyandu Baru' : 'Edit Data Posyandu'}</h4>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-gray-250 text-xl font-bold">&times;</button>
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
