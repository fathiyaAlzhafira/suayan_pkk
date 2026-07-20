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
      nomor_surat: item.nomor_surat || '',
      alamat_tujuan: item.alamat_tujuan || item.alamat || '',
      perihal: item.perihal || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data surat ekspedisi ini?")) return;
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
          setDataEkspedisi([saved, ...dataEkspedisi]);
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
      setDataEkspedisi([{ id: Date.now(), ...formData }, ...dataEkspedisi]);
    } else {
      setDataEkspedisi(dataEkspedisi.map(item => item.id === editId ? { ...item, ...formData } : item));
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Panel Card */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-black font-serif text-gray-900">Buku Ekspedisi Surat PKK</h3>
          <p className="text-[11px] text-gray-500 font-medium">Pencatatan pengiriman surat keluar, nomor surat, alamat tujuan, dan perihal</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-[#005941] hover:bg-[#004230] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition shadow-sm flex items-center gap-1.5"
        >
          <span>+ Catat Surat Ekspedisi</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-gray-200">
            <thead>
              <tr className="bg-[#005941] text-white text-[10px] font-bold uppercase tracking-wider text-center">
                <th className="p-3 border border-emerald-900 text-left w-12">NO</th>
                <th className="p-3 border border-emerald-900">TANGGAL</th>
                <th className="p-3 border border-emerald-900 text-left">NOMOR SURAT</th>
                <th className="p-3 border border-emerald-900 text-left">ALAMAT</th>
                <th className="p-3 border border-emerald-900 text-left">PERIHAL</th>
                <th className="p-3 border border-emerald-900 text-left w-24">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 font-medium text-center text-gray-700 bg-white">
              {dataEkspedisi.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400 font-bold italic bg-gray-50">
                    Belum ada data ekspedisi surat. Silakan klik "+ Catat Surat Ekspedisi".
                  </td>
                </tr>
              ) : (
                dataEkspedisi.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-emerald-50/20 odd:bg-white even:bg-gray-50/50 transition">
                    <td className="p-3 border text-left font-bold text-gray-400">{idx + 1}</td>
                    <td className="p-3 border text-gray-600 font-mono text-center">
                      {item.tanggal ? item.tanggal.substring(0, 10) : '-'}
                    </td>
                    <td className="p-3 border text-left font-bold text-gray-900 font-mono">{item.nomor_surat}</td>
                    <td className="p-3 border text-left font-semibold text-gray-800">{item.alamat_tujuan || item.alamat}</td>
                    <td className="p-3 border text-left text-gray-600 text-[11px] leading-relaxed max-w-sm">{item.perihal}</td>
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/45 backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-gray-100 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#005941] text-white p-4 flex justify-between items-center">
              <h4 className="font-bold text-sm font-serif">
                {modalType === 'add' ? 'Tambah Catatan Surat Ekspedisi' : 'Edit Surat Ekspedisi'}
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-gray-250 text-xl font-bold">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 font-sans text-xs font-semibold text-gray-600">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Tanggal Surat / Pengiriman</label>
                <input 
                  type="date" 
                  value={formData.tanggal || ''} 
                  onChange={(e) => setFormData({...formData, tanggal: e.target.value})} 
                  className="w-full border rounded p-2 text-xs text-gray-800" 
                  required 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Nomor Surat</label>
                <input 
                  type="text" 
                  value={formData.nomor_surat || ''} 
                  onChange={(e) => setFormData({...formData, nomor_surat: e.target.value})} 
                  className="w-full border rounded p-2 text-xs text-gray-800" 
                  placeholder="Contoh: 05/PKK-NAG/VII/2026"
                  required 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Alamat Tujuan / Penerima</label>
                <input 
                  type="text" 
                  value={formData.alamat_tujuan || ''} 
                  onChange={(e) => setFormData({...formData, alamat_tujuan: e.target.value})} 
                  className="w-full border rounded p-2 text-xs text-gray-800" 
                  placeholder="Contoh: TP-PKK Kecamatan Akabiluru"
                  required 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Perihal / Isi Ringkas Surat</label>
                <textarea 
                  rows="3"
                  value={formData.perihal || ''} 
                  onChange={(e) => setFormData({...formData, perihal: e.target.value})} 
                  className="w-full border rounded p-2 text-xs text-gray-800" 
                  placeholder="Uraikan perihal atau maksud pengiriman surat..."
                  required
                ></textarea>
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

export default EkspedisiAdmin;
