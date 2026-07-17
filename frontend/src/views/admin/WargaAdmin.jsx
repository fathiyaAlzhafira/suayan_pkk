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
    <div className="space-y-6 text-xs">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-extrabold text-gray-800 font-serif">Buku Data Warga (Individu)</h3>
        <button 
          onClick={handleOpenAdd}
          className="bg-emerald-850 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-md transition shadow"
        >
          + Tambah Warga
        </button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-gray-700">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">NIK</th>
                <th className="p-4">Nama</th>
                <th className="p-4">Jenis Kelamin</th>
                <th className="p-4">Pekerjaan</th>
                <th className="p-4">No. KK</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {dataWarga.map(item => (
                <tr key={item.nik} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-mono font-bold">{item.nik}</td>
                  <td className="p-4">
                    <span className="block font-bold text-gray-950">{item.nama}</span>
                    <span className="text-[10px] text-gray-400 font-medium">{item.jabatan_pkk || 'Warga Umum'}</span>
                  </td>
                  <td className="p-4">{item.jenis_kelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}</td>
                  <td className="p-4">{item.pekerjaan || 'Tidak Bekerja'}</td>
                  <td className="p-4 font-mono text-gray-450">{item.no_kk}</td>
                  <td className="p-4 text-center space-x-2">
                    <button onClick={() => handleOpenEdit(item)} className="text-gray-400 hover:text-emerald-700 font-bold">Edit</button>
                    <button onClick={() => handleDelete(item.nik)} className="text-red-500 hover:text-red-700 font-bold">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg border shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-emerald-900 text-white p-5 flex justify-between items-center">
              <h4 className="font-bold text-sm">{modalType === 'add' ? 'Tambah Warga' : 'Edit Warga'}</h4>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-200 hover:text-white text-lg font-bold">&times;</button>
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
