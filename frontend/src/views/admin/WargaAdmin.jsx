import React, { useState } from 'react';

function WargaAdmin({ dataWarga, setDataWarga, dataKeluarga, API_URL }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    nik: '', no_kk: '', no_registrasi: '', nama: '', jabatan_pkk: '', jenis_kelamin: 'P',
    tempat_lahir: '', tanggal_lahir: '', status_perkawinan: 'Lajang', status_keluarga: 'Anak',
    agama: 'Islam', pendidikan: 'SMA', pekerjaan: '', akseptor_kb: false, jenis_kb: '',
    aktif_posyandu: false, frekuensi_posyandu: 0, bina_keluarga: false, memiliki_tabungan: false,
    kelompok_belajar: 'Tidak', paud: false, ikut_koperasi: false, jenis_koperasi: '', berkebutuhan_khusus: false,
    penghayatan_pancasila: false, kerja_bakti: false, rukun_kematian: false, kegiatan_keagamaan: false, jimpitan: false, arisan: false
  });

  const handleOpenAdd = () => {
    setModalType('add');
    setEditId(null);
    setFormData({
      nik: '', no_kk: dataKeluarga[0]?.no_kk || '', no_registrasi: '', nama: '', jabatan_pkk: '', jenis_kelamin: 'P',
      tempat_lahir: '', tanggal_lahir: '', status_perkawinan: 'Lajang', status_keluarga: 'Anak',
      agama: 'Islam', pendidikan: 'SMA', pekerjaan: '', akseptor_kb: false, jenis_kb: '',
      aktif_posyandu: false, frekuensi_posyandu: 0, bina_keluarga: false, memiliki_tabungan: false,
      kelompok_belajar: 'Tidak', paud: false, ikut_koperasi: false, jenis_koperasi: '', berkebutuhan_khusus: false,
      penghayatan_pancasila: false, kerja_bakti: false, rukun_kematian: false, kegiatan_keagamaan: false, jimpitan: false, arisan: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setModalType('edit');
    setEditId(item.nik);
    setFormData({
      ...item,
      tanggal_lahir: item.tanggal_lahir ? item.tanggal_lahir.substring(0, 10) : '',
      akseptor_kb: !!item.akseptor_kb,
      aktif_posyandu: !!item.aktif_posyandu,
      bina_keluarga: !!item.bina_keluarga,
      memiliki_tabungan: !!item.memiliki_tabungan,
      paud: !!item.paud,
      ikut_koperasi: !!item.ikut_koperasi,
      berkebutuhan_khusus: !!item.berkebutuhan_khusus,
      penghayatan_pancasila: !!item.penghayatan_pancasila,
      kerja_bakti: !!item.kerja_bakti,
      rukun_kematian: !!item.rukun_kematian,
      kegiatan_keagamaan: !!item.kegiatan_keagamaan,
      jimpitan: !!item.jimpitan,
      arisan: !!item.arisan
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (nik) => {
    if (!window.confirm(`Hapus warga dengan NIK ${nik}?`)) return;
    try {
      const res = await fetch(`${API_URL}/warga/${nik}`, { method: 'DELETE' });
      if (res.ok) {
        setDataWarga(dataWarga.filter(item => item.nik !== nik));
      }
    } catch (err) {
      console.warn(err);
      setDataWarga(dataWarga.filter(item => item.nik !== nik));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const url = modalType === 'add' ? `${API_URL}/warga` : `${API_URL}/warga/${editId}`;
    const method = modalType === 'add' ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const family = dataKeluarga.find(k => k.no_kk === formData.no_kk);
        const updatedItem = { ...formData, nama_jorong: family?.nama_jorong || '' };
        if (modalType === 'add') {
          setDataWarga([...dataWarga, updatedItem]);
        } else {
          setDataWarga(dataWarga.map(item => item.nik === editId ? updatedItem : item));
        }
      }
    } catch (err) {
      console.warn(err);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Panel Card */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-black font-serif text-gray-900">Buku Data Warga (Individu)</h3>
          <p className="text-[11px] text-gray-500 font-medium">Kelola biodata warga, keikutsertaan program PKK, dan data individu per Jorong</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-[#005941] hover:bg-[#004230] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition shadow-sm flex items-center gap-1.5"
        >
          <span>+ Tambah Warga</span>
        </button>
      </div>

      {/* Tabel Data Warga */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#005941] text-white text-[10px] font-bold uppercase tracking-wider text-center">
                <th className="p-2.5 border border-emerald-950 font-mono text-left">NIK</th>
                <th className="p-2.5 border border-emerald-950 text-left">Nama Lengkap</th>
                <th className="p-2.5 border border-emerald-950 text-center">Jenis Kelamin</th>
                <th className="p-2.5 border border-emerald-950 text-left">Pekerjaan</th>
                <th className="p-2.5 border border-emerald-950 font-mono text-left">No. KK</th>
                <th className="p-2.5 border border-emerald-950 text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-medium text-gray-800 bg-white">
              {dataWarga.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400 font-bold italic bg-gray-50">
                    Belum ada data warga (kosong). Silakan klik "+ Tambah Warga".
                  </td>
                </tr>
              ) : (
                dataWarga.map(item => (
                  <tr key={item.nik} className="hover:bg-emerald-50/20 odd:bg-white even:bg-gray-50/50 transition">
                    <td className="p-2.5 border font-mono font-bold text-gray-900">{item.nik}</td>
                    <td className="p-2.5 border">
                      <span className="block font-bold text-gray-950 uppercase">{item.nama}</span>
                      <span className="text-[10px] text-emerald-800 font-semibold">{item.jabatan_pkk || 'Warga Umum'}</span>
                    </td>
                    <td className="p-2.5 border text-center font-bold">{item.jenis_kelamin === 'L' ? 'L' : 'P'}</td>
                    <td className="p-2.5 border text-gray-700">{item.pekerjaan || 'Tidak Bekerja'}</td>
                    <td className="p-2.5 border font-mono text-gray-600">{item.no_kk}</td>
                    <td className="p-2.5 border text-center space-x-2">
                      <button onClick={() => handleOpenEdit(item)} className="text-[#005941] hover:underline font-bold">Edit</button>
                      <button onClick={() => handleDelete(item.nik)} className="text-red-500 hover:underline font-bold">Hapus</button>
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
          <div className="bg-white rounded-xl border border-gray-100 shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#005941] text-white p-4 flex justify-between items-center">
              <h4 className="font-bold text-sm font-serif">{modalType === 'add' ? 'Tambah Data Warga Baru' : 'Edit Data Warga'}</h4>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-gray-250 text-xl font-bold">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto font-sans text-xs">
              
              <h5 className="font-bold border-b pb-1 text-emerald-800">Profil &amp; Identitas</h5>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">NIK (16 Digit)</label>
                  <input type="text" value={formData.nik} onChange={(e) => setFormData({...formData, nik: e.target.value})} maxLength="16" className="w-full border rounded p-2" disabled={modalType === 'edit'} required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Nama Lengkap</label>
                  <input type="text" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="w-full border rounded p-2" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">No. KK Keluarga</label>
                  <select value={formData.no_kk} onChange={(e) => setFormData({...formData, no_kk: e.target.value})} className="w-full border rounded p-2 bg-white" required>
                    {dataKeluarga.map(k => (
                      <option key={k.no_kk} value={k.no_kk}>{k.no_kk} ({k.dasawisma})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Jenis Kelamin</label>
                  <select value={formData.jenis_kelamin} onChange={(e) => setFormData({...formData, jenis_kelamin: e.target.value})} className="w-full border rounded p-2 bg-white">
                    <option value="P">Perempuan</option>
                    <option value="L">Laki-Laki</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Jabatan PKK</label>
                  <input type="text" value={formData.jabatan_pkk || ''} onChange={(e) => setFormData({...formData, jabatan_pkk: e.target.value})} className="w-full border rounded p-2" placeholder="Kader, Sekretaris, dll (kosongkan jika warga biasa)" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Agama</label>
                  <input type="text" value={formData.agama || 'Islam'} onChange={(e) => setFormData({...formData, agama: e.target.value})} className="w-full border rounded p-2" />
                </div>
              </div>

              <h5 className="font-bold border-b pb-1 text-emerald-800 pt-2">Lahir &amp; Perkawinan</h5>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Tempat Lahir</label>
                  <input type="text" value={formData.tempat_lahir || ''} onChange={(e) => setFormData({...formData, tempat_lahir: e.target.value})} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Tanggal Lahir</label>
                  <input type="date" value={formData.tanggal_lahir || ''} onChange={(e) => setFormData({...formData, tanggal_lahir: e.target.value})} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Status Perkawinan</label>
                  <select value={formData.status_perkawinan} onChange={(e) => setFormData({...formData, status_perkawinan: e.target.value})} className="w-full border rounded p-2 bg-white">
                    <option value="Lajang">Lajang</option>
                    <option value="Menikah">Menikah</option>
                    <option value="Janda">Janda</option>
                    <option value="Duda">Duda</option>
                  </select>
                </div>
              </div>

              <h5 className="font-bold border-b pb-1 text-emerald-800 pt-2">Aktivitas Sosial &amp; PKK</h5>
              <div className="grid grid-cols-3 gap-4">
                <label className="flex items-center space-x-2 bg-gray-50 p-2 rounded border cursor-pointer select-none">
                  <input type="checkbox" checked={formData.penghayatan_pancasila} onChange={(e) => setFormData({...formData, penghayatan_pancasila: e.target.checked})} />
                  <span>Penghayatan Pancasila</span>
                </label>
                <label className="flex items-center space-x-2 bg-gray-50 p-2 rounded border cursor-pointer select-none">
                  <input type="checkbox" checked={formData.kerja_bakti} onChange={(e) => setFormData({...formData, kerja_bakti: e.target.checked})} />
                  <span>Kerja Bakti</span>
                </label>
                <label className="flex items-center space-x-2 bg-gray-50 p-2 rounded border cursor-pointer select-none">
                  <input type="checkbox" checked={formData.rukun_kematian} onChange={(e) => setFormData({...formData, rukun_kematian: e.target.checked})} />
                  <span>Rukun Kematian</span>
                </label>
                <label className="flex items-center space-x-2 bg-gray-50 p-2 rounded border cursor-pointer select-none">
                  <input type="checkbox" checked={formData.kegiatan_keagamaan} onChange={(e) => setFormData({...formData, kegiatan_keagamaan: e.target.checked})} />
                  <span>Kegiatan Keagamaan</span>
                </label>
                <label className="flex items-center space-x-2 bg-gray-50 p-2 rounded border cursor-pointer select-none">
                  <input type="checkbox" checked={formData.jimpitan} onChange={(e) => setFormData({...formData, jimpitan: e.target.checked})} />
                  <span>Jimpitan</span>
                </label>
                <label className="flex items-center space-x-2 bg-gray-50 p-2 rounded border cursor-pointer select-none">
                  <input type="checkbox" checked={formData.arisan} onChange={(e) => setFormData({...formData, arisan: e.target.checked})} />
                  <span>Arisan</span>
                </label>
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

export default WargaAdmin;
