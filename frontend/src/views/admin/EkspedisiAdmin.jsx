import React, { useState } from 'react';

function EkspedisiAdmin({ dataEkspedisi, setDataEkspedisi, API_URL }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    tanggal: '', nomor_surat: '', alamat_tujuan: '', perihal: ''
  });

  const handleOpenAdd = () => {
    setModalType('add');
    setEditId(null);
    setFormData({
      tanggal: '', nomor_surat: '', alamat_tujuan: '', perihal: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setModalType('edit');
    setEditId(item.id);
    setFormData({
      tanggal: item.tanggal ? item.tanggal.substring(0, 10) : '',
      nomor_surat: item.nomor_surat,
      alamat_tujuan: item.alamat_tujuan,
      perihal: item.perihal
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data ekspedisi surat ini?")) return;
    try {
      const res = await fetch(`${API_URL}/ekspedisi/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDataEkspedisi(dataEkspedisi.filter(item => item.id !== id));
      } else {
        setDataEkspedisi(dataEkspedisi.filter(item => item.id !== id));
      }
    } catch (err) {
      console.warn(err);
      setDataEkspedisi(dataEkspedisi.filter(item => item.id !== id));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const url = modalType === 'add' ? `${API_URL}/ekspedisi` : `${API_URL}/ekspedisi/${editId}`;
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
          setDataEkspedisi([...dataEkspedisi, saved]);
        } else {
          setDataEkspedisi(dataEkspedisi.map(item => item.id === editId ? { ...item, ...formData } : item));
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
      setDataEkspedisi([...dataEkspedisi, { id: Date.now(), ...formData }]);
    } else {
      setDataEkspedisi(dataEkspedisi.map(item => item.id === editId ? { ...item, ...formData } : item));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-extrabold text-gray-800 font-serif">Buku Ekspedisi Surat Keluar</h3>
        <button 
          onClick={handleOpenAdd}
          className="bg-emerald-850 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-md transition shadow"
        >
          + Catat Surat Keluar
        </button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-medium text-gray-700">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Tanggal Pengiriman</th>
                <th className="p-4">Nomor Surat</th>
                <th className="p-4">Alamat Tujuan</th>
                <th className="p-4">Perihal</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {dataEkspedisi.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-bold text-gray-400">{item.tanggal ? item.tanggal.substring(0, 10) : ''}</td>
                  <td className="p-4 font-bold text-gray-900">{item.nomor_surat}</td>
                  <td className="p-4 font-bold text-gray-800">{item.alamat_tujuan}</td>
                  <td className="p-4 text-gray-550 font-light max-w-xs truncate">{item.perihal}</td>
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
              <h4 className="font-bold text-sm">{modalType === 'add' ? 'Tambah Catatan Surat' : 'Edit Catatan Surat'}</h4>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-200 hover:text-white text-lg font-bold">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 font-sans text-xs">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Tanggal Pengiriman</label>
                <input type="date" value={formData.tanggal || ''} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Nomor Surat Keluar</label>
                <input type="text" value={formData.nomor_surat || ''} onChange={(e) => setFormData({...formData, nomor_surat: e.target.value})} className="w-full border rounded p-2" placeholder="Contoh: 01/PKK/SUAYAN/VI/2026" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Alamat Penerima / Tujuan</label>
                <input type="text" value={formData.alamat_tujuan || ''} onChange={(e) => setFormData({...formData, alamat_tujuan: e.target.value})} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Perihal / Isi Ringkas</label>
                <input type="text" value={formData.perihal || ''} onChange={(e) => setFormData({...formData, perihal: e.target.value})} className="w-full border rounded p-2" required />
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

export default EkspedisiAdmin;
