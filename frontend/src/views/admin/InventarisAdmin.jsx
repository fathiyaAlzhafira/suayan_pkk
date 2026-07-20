import React, { useState } from 'react';

function InventarisAdmin({ dataInventaris, setDataInventaris, API_URL }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editId, setEditId] = useState(null);

  const STANDARD_KONDISI = ['Baik', 'Rusak Ringan', 'Rusak Berat'];

  const [formData, setFormData] = useState({
    nama_barang: '', asal_barang: '', tanggal_penerimaan: '', jumlah: 1, tempat_penyimpanan: '', kondisi_barang: 'Baik', keterangan: ''
  });
  const [isLainnya, setIsLainnya] = useState(false);
  const [customKondisi, setCustomKondisi] = useState('');

  const handleOpenAdd = () => {
    setModalType('add');
    setEditId(null);
    setFormData({
      nama_barang: '', asal_barang: '', tanggal_penerimaan: '', jumlah: 1, tempat_penyimpanan: '', kondisi_barang: 'Baik', keterangan: ''
    });
    setIsLainnya(false);
    setCustomKondisi('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setModalType('edit');
    setEditId(item.id);
    const kon = item.kondisi_barang || item.kondisi || 'Baik';
    const isCustom = !STANDARD_KONDISI.includes(kon);

    setFormData({
      ...item,
      kondisi_barang: kon,
      tanggal_penerimaan: item.tanggal_penerimaan ? item.tanggal_penerimaan.substring(0, 10) : ''
    });

    if (isCustom) {
      setIsLainnya(true);
      setCustomKondisi(kon === 'Lainnya' ? '' : kon);
    } else {
      setIsLainnya(false);
      setCustomKondisi('');
    }
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

    let finalKondisi = formData.kondisi_barang;
    if (isLainnya) {
      finalKondisi = customKondisi.trim() || 'Lainnya';
    }

    let bodyData = { ...formData, kondisi_barang: finalKondisi };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      if (res.ok) {
        if (modalType === 'add') {
          const saved = await res.json();
          setDataInventaris([...dataInventaris, saved]);
        } else {
          setDataInventaris(dataInventaris.map(item => item.id === editId ? { ...item, ...bodyData } : item));
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
      setDataInventaris([...dataInventaris, { id: Date.now(), ...bodyData }]);
    } else {
      setDataInventaris(dataInventaris.map(item => item.id === editId ? { ...item, ...bodyData } : item));
    }
  };

  const handleKondisiSelectChange = (e) => {
    const val = e.target.value;
    if (val === 'Lainnya') {
      setIsLainnya(true);
      setFormData({ ...formData, kondisi_barang: customKondisi || 'Lainnya' });
    } else {
      setIsLainnya(false);
      setFormData({ ...formData, kondisi_barang: val });
    }
  };

  const handleCustomKondisiChange = (e) => {
    const val = e.target.value;
    setCustomKondisi(val);
    setFormData({ ...formData, kondisi_barang: val || 'Lainnya' });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Panel Card */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-black font-serif text-gray-900">Buku Inventaris Barang PKK</h3>
          <p className="text-[11px] text-gray-500 font-medium">Catatan penerimaan, jumlah, lokasi penyimpanan, dan kondisi barang inventaris</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-[#005941] hover:bg-[#004230] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition shadow-sm flex items-center gap-1.5"
        >
          <span>+ Tambah Barang Inventaris</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-gray-200">
            <thead>
              <tr className="bg-[#005941] text-white text-[10px] font-bold uppercase tracking-wider text-center">
                <th className="p-3 border border-emerald-900 text-left w-12">NO</th>
                <th className="p-3 border border-emerald-900 text-left">NAMA BARANG</th>
                <th className="p-3 border border-emerald-900 text-left">ASAL BARANG</th>
                <th className="p-3 border border-emerald-900">TGL PENERIMAAN / PEMBELIAN</th>
                <th className="p-3 border border-emerald-900">JUMLAH</th>
                <th className="p-3 border border-emerald-900 text-left">TEMPAT PENYIMPANAN</th>
                <th className="p-3 border border-emerald-900">KONDISI BARANG</th>
                <th className="p-3 border border-emerald-900 text-left">KETERANGAN</th>
                <th className="p-3 border border-emerald-900 text-left w-24">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 font-medium text-center text-gray-700 bg-white">
              {dataInventaris.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-400 font-bold italic bg-gray-50">
                    Belum ada data barang inventaris. Silakan klik "+ Tambah Barang Inventaris".
                  </td>
                </tr>
              ) : (
                dataInventaris.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-emerald-50/20 odd:bg-white even:bg-gray-50/50 transition">
                    <td className="p-3 border text-left font-bold text-gray-400">{idx + 1}</td>
                    <td className="p-3 border text-left font-bold text-gray-900">{item.nama_barang}</td>
                    <td className="p-3 border text-left text-gray-600">{item.asal_barang}</td>
                    <td className="p-3 border text-gray-600 font-mono">
                      {item.tanggal_penerimaan ? item.tanggal_penerimaan.substring(0, 10) : '-'}
                    </td>
                    <td className="p-3 border font-extrabold text-emerald-900 bg-emerald-50/20">{item.jumlah}</td>
                    <td className="p-3 border text-left font-semibold text-gray-800">{item.tempat_penyimpanan}</td>
                    <td className="p-3 border">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        (item.kondisi_barang || item.kondisi) === 'Baik' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : (item.kondisi_barang || item.kondisi) === 'Rusak Ringan'
                          ? 'bg-amber-100 text-amber-800'
                          : (item.kondisi_barang || item.kondisi) === 'Rusak Berat'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.kondisi_barang || item.kondisi || 'Baik'}
                      </span>
                    </td>
                    <td className="p-3 border text-left text-gray-500 text-[11px] max-w-xs truncate">{item.keterangan || '-'}</td>
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
                {modalType === 'add' ? 'Tambah Barang Inventaris Baru' : 'Edit Data Barang Inventaris'}
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-gray-250 text-xl font-bold">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 font-sans text-xs font-semibold text-gray-600">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Nama Barang</label>
                <input 
                  type="text" 
                  value={formData.nama_barang || ''} 
                  onChange={(e) => setFormData({...formData, nama_barang: e.target.value})} 
                  className="w-full border rounded p-2 text-xs text-gray-800" 
                  required 
                  placeholder="Contoh: Meja Rapat Kayu"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Asal Barang</label>
                <input 
                  type="text" 
                  value={formData.asal_barang || ''} 
                  onChange={(e) => setFormData({...formData, asal_barang: e.target.value})} 
                  className="w-full border rounded p-2 text-xs text-gray-800" 
                  placeholder="Contoh: Hibah PKK Kabupaten / APB Nagari" 
                  required 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Tanggal Penerimaan / Pembelian</label>
                <input 
                  type="date" 
                  value={formData.tanggal_penerimaan || ''} 
                  onChange={(e) => setFormData({...formData, tanggal_penerimaan: e.target.value})} 
                  className="w-full border rounded p-2 text-xs text-gray-800" 
                  required 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Jumlah</label>
                <input 
                  type="number" 
                  value={formData.jumlah || 1} 
                  onChange={(e) => setFormData({...formData, jumlah: parseInt(e.target.value) || 1})} 
                  className="w-full border rounded p-2 text-xs text-gray-800" 
                  required 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Tempat Penyimpanan</label>
                <input 
                  type="text" 
                  value={formData.tempat_penyimpanan || ''} 
                  onChange={(e) => setFormData({...formData, tempat_penyimpanan: e.target.value})} 
                  className="w-full border rounded p-2 text-xs text-gray-800" 
                  placeholder="Contoh: Lemari Sekretariat PKK"
                  required 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Kondisi Barang</label>
                <select 
                  value={isLainnya ? 'Lainnya' : (formData.kondisi_barang || 'Baik')} 
                  onChange={handleKondisiSelectChange} 
                  className="w-full border rounded p-2 text-xs bg-white text-gray-800 mb-2"
                >
                  <option value="Baik">Baik</option>
                  <option value="Rusak Ringan">Rusak Ringan</option>
                  <option value="Rusak Berat">Rusak Berat</option>
                  <option value="Lainnya">Lainnya (Ketik Manual)</option>
                </select>

                {isLainnya && (
                  <div className="animate-in fade-in zoom-in-95 duration-150">
                    <label className="block text-[9px] font-bold text-emerald-800 mb-1">Ketik Kondisi Barang Lainnya:</label>
                    <input 
                      type="text" 
                      value={customKondisi} 
                      onChange={handleCustomKondisiChange} 
                      placeholder="Contoh: Perlu Perbaikan / Dalam Servis"
                      className="w-full border border-emerald-600 rounded p-2 text-xs text-gray-800 bg-emerald-50/30 focus:outline-none focus:ring-1 focus:ring-emerald-700" 
                      required={isLainnya}
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Keterangan</label>
                <textarea 
                  rows="2"
                  value={formData.keterangan || ''} 
                  onChange={(e) => setFormData({...formData, keterangan: e.target.value})} 
                  className="w-full border rounded p-2 text-xs text-gray-800" 
                  placeholder="Catatan kondisi tambahan..."
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

export default InventarisAdmin;
