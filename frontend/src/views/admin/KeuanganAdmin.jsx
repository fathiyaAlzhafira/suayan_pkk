import React, { useState } from 'react';

function KeuanganAdmin({ dataKeuangan, setDataKeuangan, API_URL }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    tanggal: '', sumber_dana: '', urian: '', nominal: '', jenis: 'penerimaan', nomor_bukti_kas: ''
  });

  const handleOpenAdd = () => {
    setModalType('add');
    setEditId(null);
    setFormData({
      tanggal: '', sumber_dana: '', urian: '', nominal: '', jenis: 'penerimaan', nomor_bukti_kas: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setModalType('edit');
    setEditId(item.id);
    const nominal = item.nominal_penerimaan > 0 ? item.nominal_penerimaan : item.nominal_pengeluaran;
    const jenis = item.nominal_penerimaan > 0 ? 'penerimaan' : 'pengeluaran';
    setFormData({
      tanggal: item.tanggal ? item.tanggal.substring(0, 10) : '',
      sumber_dana: item.sumber_dana,
      urian: item.uraian,
      nominal: nominal,
      jenis: jenis,
      nomor_bukti_kas: item.nomor_bukti_kas
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data transaksi ini?")) return;
    try {
      const res = await fetch(`${API_URL}/keuangan/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDataKeuangan(dataKeuangan.filter(item => item.id !== id));
      } else {
        setDataKeuangan(dataKeuangan.filter(item => item.id !== id));
      }
    } catch (err) {
      console.warn(err);
      setDataKeuangan(dataKeuangan.filter(item => item.id !== id));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const url = modalType === 'add' ? `${API_URL}/keuangan` : `${API_URL}/keuangan/${editId}`;
    const method = modalType === 'add' ? 'POST' : 'PUT';
    
    const nominal = parseFloat(formData.nominal) || 0;
    const bodyData = {
      tanggal: formData.tanggal,
      sumber_dana: formData.sumber_dana,
      uraian: formData.urian,
      nomor_bukti_kas: formData.nomor_bukti_kas || '-',
      nominal_penerimaan: formData.jenis === 'penerimaan' ? nominal : 0,
      nominal_pengeluaran: formData.jenis === 'pengeluaran' ? nominal : 0
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      if (res.ok) {
        if (modalType === 'add') {
          const saved = await res.json();
          setDataKeuangan([...dataKeuangan, saved]);
        } else {
          setDataKeuangan(dataKeuangan.map(item => item.id === editId ? { ...item, ...bodyData } : item));
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
      setDataKeuangan([...dataKeuangan, { id: Date.now(), ...bodyData }]);
    } else {
      setDataKeuangan(dataKeuangan.map(item => item.id === editId ? { ...item, ...bodyData } : item));
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-extrabold text-gray-800 font-serif">Buku Kas Keuangan PKK</h3>
        <button 
          onClick={handleOpenAdd}
          className="bg-emerald-850 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-md transition shadow"
        >
          + Catat Transaksi
        </button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-medium text-gray-700">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Tanggal</th>
                <th className="p-4">Uraian / Sumber Dana</th>
                <th className="p-4 text-right">Penerimaan</th>
                <th className="p-4 text-right">Pengeluaran</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {dataKeuangan.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-bold text-gray-400">{item.tanggal ? item.tanggal.substring(0, 10) : ''}</td>
                  <td className="p-4">
                    <span className="block font-bold text-gray-900">{item.uraian}</span>
                    <span className="text-[10px] text-gray-450">{item.sumber_dana}</span>
                  </td>
                  <td className="p-4 text-right font-bold text-emerald-800">
                    {item.nominal_penerimaan > 0 ? formatRupiah(item.nominal_penerimaan) : '-'}
                  </td>
                  <td className="p-4 text-right font-bold text-red-700">
                    {item.nominal_pengeluaran > 0 ? formatRupiah(item.nominal_pengeluaran) : '-'}
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
              <h4 className="font-bold text-sm">{modalType === 'add' ? 'Tambah Transaksi' : 'Edit Transaksi'}</h4>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-200 hover:text-white text-lg font-bold">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 font-sans text-xs">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Tanggal Transaksi</label>
                <input type="date" value={formData.tanggal || ''} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Jenis Transaksi</label>
                <select value={formData.jenis || 'penerimaan'} onChange={(e) => setFormData({...formData, jenis: e.target.value})} className="w-full border rounded p-2 bg-white">
                  <option value="penerimaan">Penerimaan (Kas Masuk)</option>
                  <option value="pengeluaran">Pengeluaran (Kas Keluar)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Sumber Dana</label>
                <input type="text" value={formData.sumber_dana || ''} onChange={(e) => setFormData({...formData, sumber_dana: e.target.value})} className="w-full border rounded p-2" placeholder="Contoh: APBD Nagari, Swadaya" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Uraian / Keterangan</label>
                <input type="text" value={formData.urian || ''} onChange={(e) => setFormData({...formData, urian: e.target.value})} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Nominal (Rupiah)</label>
                <input type="number" value={formData.nominal || ''} onChange={(e) => setFormData({...formData, nominal: e.target.value})} className="w-full border rounded p-2" required />
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

export default KeuanganAdmin;
