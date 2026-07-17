import React, { useState } from 'react';

function AnggotaAdmin({ dataAnggota, setDataAnggota, API_URL }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    no_registrasi: '', nama: '', jenis_kelamin: 'P', jabatan: '', jorong: 'Suayan Tinggi',
    kader_umum: false, kader_khusus: false, tempat_lahir: '', tanggal_lahir: '',
    status_perkawinan: 'menikah', pendidikan: 'SMA', pekerjaan: '', keterangan: ''
  });

  const handleOpenAdd = () => {
    setModalType('add');
    setEditId(null);
    setFormData({
      no_registrasi: '', nama: '', jenis_kelamin: 'P', jabatan: '', jorong: 'Suayan Tinggi',
      kader_umum: false, kader_khusus: false, tempat_lahir: '', tanggal_lahir: '',
      status_perkawinan: 'menikah', pendidikan: 'SMA', pekerjaan: '', keterangan: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setModalType('edit');
    setEditId(item.id);
    setFormData({ ...item, kader_umum: !!item.kader_umum, kader_khusus: !!item.kader_khusus });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data anggota ini?")) return;
    try {
      const res = await fetch(`${API_URL}/anggota/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDataAnggota(dataAnggota.filter(item => item.id !== id));
      } else {
        setDataAnggota(dataAnggota.filter(item => item.id !== id));
      }
    } catch (err) {
      console.warn(err);
      setDataAnggota(dataAnggota.filter(item => item.id !== id));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const url = modalType === 'add' ? `${API_URL}/anggota` : `${API_URL}/anggota/${editId}`;
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
          setDataAnggota(dataAnggota.map(item => item.id === editId ? { ...item, ...formData } : item));
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
      setDataAnggota([...dataAnggota, { id: Date.now(), ...formData }]);
    } else {
      setDataAnggota(dataAnggota.map(item => item.id === editId ? { ...item, ...formData } : item));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-extrabold text-gray-800 font-serif">Buku Daftar Anggota &amp; Kader</h3>
        <button 
          onClick={handleOpenAdd}
          className="bg-emerald-850 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-md transition shadow"
        >
          + Tambah Anggota
        </button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-medium text-gray-700">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Nama</th>
                <th className="p-4">Jabatan</th>
                <th className="p-4">Jorong</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {dataAnggota.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-bold text-gray-900">{item.nama}</td>
                  <td className="p-4">{item.jabatan}</td>
                  <td className="p-4">
                    <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px]">{item.jorong || item.alamat_jorong}</span>
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
              <h4 className="font-bold text-sm">{modalType === 'add' ? 'Tambah Anggota' : 'Edit Anggota'}</h4>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-200 hover:text-white text-lg font-bold">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto font-sans text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Nama Lengkap</label>
                  <input type="text" value={formData.nama || ''} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="w-full border rounded p-2" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Jabatan PKK</label>
                  <input type="text" value={formData.jabatan || ''} onChange={(e) => setFormData({...formData, jabatan: e.target.value})} className="w-full border rounded p-2" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Jorong/Wilayah</label>
                  <select value={formData.jorong || formData.alamat_jorong || 'Suayan Tinggi'} onChange={(e) => setFormData({...formData, jorong: e.target.value, alamat_jorong: e.target.value})} className="w-full border rounded p-2 bg-white">
                    <option value="Suayan Tinggi">Suayan Tinggi</option>
                    <option value="Suayan Sabar">Suayan Sabar</option>
                    <option value="Suayan Randah">Suayan Randah</option>
                    <option value="Suayan Soriak">Suayan Soriak</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Jenis Kelamin</label>
                  <select value={formData.jenis_kelamin || 'P'} onChange={(e) => setFormData({...formData, jenis_kelamin: e.target.value})} className="w-full border rounded p-2 bg-white">
                    <option value="P">Perempuan</option>
                    <option value="L">Laki-Laki</option>
                  </select>
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

export default AnggotaAdmin;
