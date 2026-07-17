import React, { useState, useEffect } from 'react';

function KeluargaAdmin({ dataKeluarga, setDataKeluarga, API_URL }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editId, setEditId] = useState(null);
  const [dataJorong, setDataJorong] = useState([]);
  const [formData, setFormData] = useState({
    no_kk: '', id_jorong: 1, dasawisma: '', makanan_pokok: 'Beras',
    jamban_keluarga: false, jumlah_jamban: 0, sumber_air: 'PDAM',
    tempat_sampah: false, spal: false, stiker_p4k: false,
    kriteria_rumah: 'Sehat', status_verifikasi: 'Approved'
  });

  useEffect(() => {
    fetch(`${API_URL}/jorong`)
      .then(res => res.json())
      .then(data => setDataJorong(data))
      .catch(err => console.warn('Gagal memuat jorong', err));
  }, [API_URL]);

  const handleOpenAdd = () => {
    setModalType('add');
    setEditId(null);
    setFormData({
      no_kk: '', id_jorong: dataJorong[0]?.id_jorong || 1, dasawisma: '', makanan_pokok: 'Beras',
      jamban_keluarga: false, jumlah_jamban: 0, sumber_air: 'PDAM',
      tempat_sampah: false, spal: false, stiker_p4k: false,
      kriteria_rumah: 'Sehat', status_verifikasi: 'Approved'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setModalType('edit');
    setEditId(item.no_kk);
    setFormData({
      ...item,
      jamban_keluarga: !!item.jamban_keluarga,
      tempat_sampah: !!item.tempat_sampah,
      spal: !!item.spal,
      stiker_p4k: !!item.stiker_p4k
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (no_kk) => {
    if (!window.confirm(`Hapus keluarga dengan KK ${no_kk}? Aksi ini akan menghapus semua warga di dalamnya.`)) return;
    try {
      const res = await fetch(`${API_URL}/keluarga/${no_kk}`, { method: 'DELETE' });
      if (res.ok) {
        setDataKeluarga(dataKeluarga.filter(item => item.no_kk !== no_kk));
      }
    } catch (err) {
      console.warn(err);
      setDataKeluarga(dataKeluarga.filter(item => item.no_kk !== no_kk));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const url = modalType === 'add' ? `${API_URL}/keluarga` : `${API_URL}/keluarga/${editId}`;
    const method = modalType === 'add' ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        // Ambil nama jorong untuk di-render lokal
        const selectedJorong = dataJorong.find(j => j.id_jorong === parseInt(formData.id_jorong));
        const updatedItem = { ...formData, nama_jorong: selectedJorong?.nama_jorong || '' };
        
        if (modalType === 'add') {
          setDataKeluarga([...dataKeluarga, updatedItem]);
        } else {
          setDataKeluarga(dataKeluarga.map(item => item.no_kk === editId ? updatedItem : item));
        }
      }
    } catch (err) {
      console.warn(err);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-extrabold text-gray-800 font-serif">Buku Data Keluarga (KK)</h3>
        <button 
          onClick={handleOpenAdd}
          className="bg-emerald-850 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-md transition shadow"
        >
          + Tambah Keluarga
        </button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-gray-700">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">No. KK</th>
                <th className="p-4">Jorong</th>
                <th className="p-4">Dasawisma</th>
                <th className="p-4 text-center">Rumah</th>
                <th className="p-4 text-center">Jamban</th>
                <th className="p-4 text-center">Stiker P4K</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {dataKeluarga.map(item => (
                <tr key={item.no_kk} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-bold text-gray-900">{item.no_kk}</td>
                  <td className="p-4">{item.nama_jorong || `Jorong ${item.id_jorong}`}</td>
                  <td className="p-4">
                    <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                      {item.dasawisma}
                    </span>
                  </td>
                  <td className="p-4 text-center font-bold">{item.kriteria_rumah}</td>
                  <td className="p-4 text-center">{item.jamban_keluarga ? `Ya (${item.jumlah_jamban})` : 'Tidak'}</td>
                  <td className="p-4 text-center">{item.stiker_p4k ? 'Ada' : 'Tidak'}</td>
                  <td className="p-4 text-center space-x-2">
                    <button onClick={() => handleOpenEdit(item)} className="text-gray-400 hover:text-emerald-700 font-bold">Edit</button>
                    <button onClick={() => handleDelete(item.no_kk)} className="text-red-500 hover:text-red-700 font-bold">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg border shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-emerald-900 text-white p-5 flex justify-between items-center">
              <h4 className="font-bold text-sm">{modalType === 'add' ? 'Tambah Keluarga' : 'Edit Keluarga'}</h4>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-200 hover:text-white text-lg font-bold">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto font-sans text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Nomor Kartu Keluarga (KK)</label>
                  <input 
                    type="text" 
                    value={formData.no_kk} 
                    onChange={(e) => setFormData({...formData, no_kk: e.target.value})} 
                    maxLength="16" 
                    className="w-full border rounded p-2" 
                    disabled={modalType === 'edit'} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Jorong/Wilayah</label>
                  <select 
                    value={formData.id_jorong} 
                    onChange={(e) => setFormData({...formData, id_jorong: parseInt(e.target.value)})} 
                    className="w-full border rounded p-2 bg-white" 
                    required
                  >
                    {dataJorong.map(j => (
                      <option key={j.id_jorong} value={j.id_jorong}>{j.nama_jorong}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Kelompok Dasawisma</label>
                  <input 
                    type="text" 
                    value={formData.dasawisma} 
                    onChange={(e) => setFormData({...formData, dasawisma: e.target.value})} 
                    className="w-full border rounded p-2" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Kriteria Rumah</label>
                  <select 
                    value={formData.kriteria_rumah} 
                    onChange={(e) => setFormData({...formData, kriteria_rumah: e.target.value})} 
                    className="w-full border rounded p-2 bg-white"
                  >
                    <option value="Sehat">Sehat</option>
                    <option value="Kurang Sehat">Kurang Sehat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Makanan Pokok</label>
                  <select 
                    value={formData.makanan_pokok} 
                    onChange={(e) => setFormData({...formData, makanan_pokok: e.target.value})} 
                    className="w-full border rounded p-2 bg-white"
                  >
                    <option value="Beras">Beras</option>
                    <option value="Non Beras">Non Beras</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Sumber Air</label>
                  <select 
                    value={formData.sumber_air} 
                    onChange={(e) => setFormData({...formData, sumber_air: e.target.value})} 
                    className="w-full border rounded p-2 bg-white"
                  >
                    <option value="PDAM">PDAM</option>
                    <option value="Sumur">Sumur</option>
                    <option value="Sungai">Sungai</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Sanitasi &amp; P4K</span>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center space-x-2 bg-gray-50 p-2.5 rounded border select-none cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.jamban_keluarga} 
                      onChange={(e) => setFormData({...formData, jamban_keluarga: e.target.checked})} 
                    />
                    <span>Memiliki Jamban</span>
                  </label>
                  {formData.jamban_keluarga && (
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">Jumlah Jamban</label>
                      <input 
                        type="number" 
                        value={formData.jumlah_jamban} 
                        onChange={(e) => setFormData({...formData, jumlah_jamban: parseInt(e.target.value) || 0})} 
                        className="w-full border rounded p-1.5" 
                      />
                    </div>
                  )}
                  <label className="flex items-center space-x-2 bg-gray-50 p-2.5 rounded border select-none cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.tempat_sampah} 
                      onChange={(e) => setFormData({...formData, tempat_sampah: e.target.checked})} 
                    />
                    <span>Tempat Sampah Layak</span>
                  </label>
                  <label className="flex items-center space-x-2 bg-gray-50 p-2.5 rounded border select-none cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.spal} 
                      onChange={(e) => setFormData({...formData, spal: e.target.checked})} 
                    />
                    <span>Memiliki SPAL</span>
                  </label>
                  <label className="flex items-center space-x-2 bg-gray-50 p-2.5 rounded border select-none cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.stiker_p4k} 
                      onChange={(e) => setFormData({...formData, stiker_p4k: e.target.checked})} 
                    />
                    <span>Stiker P4K Terpasang</span>
                  </label>
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

export default KeluargaAdmin;
