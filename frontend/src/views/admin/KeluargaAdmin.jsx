import React, { useState, useEffect } from 'react';

function KeluargaAdmin({ dataKeluarga, setDataKeluarga, API_URL }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editId, setEditId] = useState(null);
  const [dataJorong, setDataJorong] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All'); // All, Approved, Pending, Rejected

  // Sub-table states inside modal
  const [wargaList, setWargaList] = useState([]);
  const [pekaranganList, setPekaranganList] = useState([]);
  const [industriList, setIndustriList] = useState([]);

  // Sub-modal member state
  const [editingWargaIdx, setEditingWargaIdx] = useState(null); // null, -1 (baru), or index
  const [activeWargaForm, setActiveWargaForm] = useState({
    nik: '', no_registrasi: '', nama: '', jabatan_pkk: '', jenis_kelamin: 'P',
    tempat_lahir: '', tanggal_lahir: '', status_perkawinan: 'Lajang', status_keluarga: 'Anak',
    agama: 'Islam', pendidikan: 'SMA/Sederajat', pekerjaan: 'Lainnya',
    akseptor_kb: false, jenis_kb: '',
    aktif_posyandu: false, frekuensi_posyandu: 0,
    bina_keluarga: false, memiliki_tabungan: false,
    kelompok_belajar_aktif: false, kelompok_belajar_list: [],
    paud: false, ikut_koperasi: false, jenis_koperasi: '', berkebutuhan_khusus: false,
    penghayatan_pancasila: false, kerja_bakti: false, rukun_kematian: false,
    kegiatan_keagamaan: false, jimpitan: false, arisan: false
  });

  const [formData, setFormData] = useState({
    no_kk: '', id_jorong: 1, dasawisma: '', rt: '', rw: '', dusun: '',
    makanan_pokok: 'Beras', makanan_pokok_lain: '',
    jamban_keluarga: false, jumlah_jamban: 0, sumber_air: 'PDAM',
    tempat_sampah: false, spal: false, stiker_p4k: false,
    kriteria_rumah: 'Sehat', up2k_aktif: false, up2k_jenis: '',
    kesling_aktif: false, status_verifikasi: 'Approved'
  });

  useEffect(() => {
    fetch(`${API_URL}/jorong`)
      .then(res => res.json())
      .then(data => {
        setDataJorong(data);
        if (data.length > 0 && modalType === 'add') {
          setFormData(prev => ({ ...prev, id_jorong: data[0].id_jorong }));
        }
      })
      .catch(err => console.warn('Gagal memuat jorong', err));
  }, [API_URL, modalType]);

  const calculateAge = (dateStr) => {
    if (!dateStr) return '-';
    const birth = new Date(dateStr);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 0 ? `${age} Tahun` : '-';
  };

  const handleOpenAdd = () => {
    setModalType('add');
    setEditId(null);
    setWargaList([]);
    setPekaranganList([]);
    setIndustriList([]);
    setFormData({
      no_kk: '', id_jorong: dataJorong[0]?.id_jorong || 1, dasawisma: '', rt: '', rw: '', dusun: '',
      makanan_pokok: 'Beras', makanan_pokok_lain: '',
      jamban_keluarga: false, jumlah_jamban: 0, sumber_air: 'PDAM',
      tempat_sampah: false, spal: false, stiker_p4k: false,
      kriteria_rumah: 'Sehat', up2k_aktif: false, up2k_jenis: '',
      kesling_aktif: false, status_verifikasi: 'Approved'
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
      stiker_p4k: !!item.stiker_p4k,
      up2k_aktif: !!item.up2k_aktif,
      kesling_aktif: !!item.kesling_aktif
    });

    // Load sub-table lists
    fetch(`${API_URL}/keluarga/${item.no_kk}/warga`)
      .then(res => res.json())
      .then(data => {
        const mapped = data.map(w => {
          const kbStr = w.kelompok_belajar || 'Tidak';
          const isActive = kbStr !== 'Tidak' && kbStr !== '';
          const list = isActive ? kbStr.split(', ') : [];
          return {
            ...w,
            kelompok_belajar_aktif: isActive,
            kelompok_belajar_list: list
          };
        });
        setWargaList(mapped);
      })
      .catch(err => console.warn(err));

    fetch(`${API_URL}/keluarga/${item.no_kk}/pekarangan`)
      .then(res => res.json())
      .then(data => setPekaranganList(data))
      .catch(err => console.warn(err));

    fetch(`${API_URL}/keluarga/${item.no_kk}/industri`)
      .then(res => res.json())
      .then(data => setIndustriList(data))
      .catch(err => console.warn(err));

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
    }
  };

  const handleVerifyStatus = async (no_kk, status) => {
    const item = dataKeluarga.find(k => k.no_kk === no_kk);
    if (!item) return;

    const updatedItem = {
      ...item,
      jamban_keluarga: !!item.jamban_keluarga,
      tempat_sampah: !!item.tempat_sampah,
      spal: !!item.spal,
      stiker_p4k: !!item.stiker_p4k,
      up2k_aktif: !!item.up2k_aktif,
      kesling_aktif: !!item.kesling_aktif,
      status_verifikasi: status
    };

    try {
      const res = await fetch(`${API_URL}/keluarga/${no_kk}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      });
      if (res.ok) {
        setDataKeluarga(dataKeluarga.map(k => k.no_kk === no_kk ? { ...item, status_verifikasi: status } : k));
        alert(`Status keluarga dengan nomor KK ${no_kk} berhasil diubah menjadi: ${status}`);
      } else {
        alert('Gagal mengubah status verifikasi.');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // --- WARGA/ANGGOTA KELUARGA DINAMIS ---
  const handleOpenAddWarga = () => {
    setEditingWargaIdx(-1);
    setActiveWargaForm({
      nik: '', no_registrasi: '', nama: '', jabatan_pkk: '', jenis_kelamin: 'P',
      tempat_lahir: '', tanggal_lahir: '', status_perkawinan: 'Lajang', status_keluarga: 'Anak',
      agama: 'Islam', pendidikan: 'SMA/Sederajat', pekerjaan: 'Lainnya',
      akseptor_kb: false, jenis_kb: '',
      aktif_posyandu: false, frekuensi_posyandu: 0,
      bina_keluarga: false, memiliki_tabungan: false,
      kelompok_belajar_aktif: false, kelompok_belajar_list: [],
      paud: false, ikut_koperasi: false, jenis_koperasi: '', berkebutuhan_khusus: false,
      penghayatan_pancasila: false, kerja_bakti: false, rukun_kematian: false,
      kegiatan_keagamaan: false, jimpitan: false, arisan: false
    });
  };

  const handleOpenEditWarga = (idx) => {
    setEditingWargaIdx(idx);
    const item = wargaList[idx];
    setActiveWargaForm({
      ...item,
      tanggal_lahir: item.tanggal_lahir ? item.tanggal_lahir.substring(0, 10) : '',
      akseptor_kb: !!item.akseptor_kb,
      aktif_posyandu: !!item.aktif_posyandu,
      bina_keluarga: !!item.bina_keluarga,
      memiliki_tabungan: !!item.memiliki_tabungan,
      kelompok_belajar_aktif: !!item.kelompok_belajar_aktif,
      kelompok_belajar_list: item.kelompok_belajar_list || [],
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
  };

  const handleSaveWarga = (e) => {
    e.preventDefault();
    if (activeWargaForm.nik.length !== 16) {
      alert('NIK harus 16 digit');
      return;
    }
    if (editingWargaIdx === -1) {
      if (wargaList.some(w => w.nik === activeWargaForm.nik)) {
        alert('NIK sudah digunakan di keluarga ini.');
        return;
      }
      setWargaList([...wargaList, activeWargaForm]);
    } else {
      setWargaList(wargaList.map((w, idx) => idx === editingWargaIdx ? activeWargaForm : w));
    }
    setEditingWargaIdx(null);
  };

  const handleDeleteWarga = (idx) => {
    if (wargaList[idx].status_keluarga === 'Kepala Keluarga') {
      alert('Kepala Keluarga tidak boleh dihapus.');
      return;
    }
    setWargaList(wargaList.filter((_, i) => i !== idx));
  };

  const handleKBCheckbox = (val, checked) => {
    let currentList = [...activeWargaForm.kelompok_belajar_list];
    if (checked) {
      currentList.push(val);
    } else {
      currentList = currentList.filter(item => item !== val);
    }
    setActiveWargaForm({ ...activeWargaForm, kelompok_belajar_list: currentList });
  };

  // --- PEKARANGAN DINAMIS ---
  const handleAddPekarangan = () => {
    setPekaranganList([...pekaranganList, { kategori: 'Warung Hidup', komoditi: '', jumlah: 0 }]);
  };
  const handlePekaranganChange = (idx, field, val) => {
    setPekaranganList(pekaranganList.map((p, i) => i === idx ? { ...p, [field]: val } : p));
  };
  const handleDeletePekarangan = (idx) => {
    setPekaranganList(pekaranganList.filter((_, i) => i !== idx));
  };

  // --- INDUSTRI DINAMIS ---
  const handleAddIndustri = () => {
    setIndustriList([...industriList, { kategori: 'Pangan', komoditi: '', jumlah: 0, status_up2k: true }]);
  };
  const handleIndustriChange = (idx, field, val) => {
    setIndustriList(industriList.map((ind, i) => i === idx ? { ...ind, [field]: val } : ind));
  };
  const handleDeleteIndustri = (idx) => {
    setIndustriList(industriList.filter((_, i) => i !== idx));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (wargaList.length === 0) {
      alert('Keluarga minimal harus memiliki 1 data anggota keluarga (Kepala Keluarga).');
      return;
    }
    if (!wargaList.some(w => w.status_keluarga === 'Kepala Keluarga')) {
      alert('Harus ada 1 anggota keluarga dengan status Kepala Keluarga.');
      return;
    }

    const formattedWarga = wargaList.map(w => {
      const finalKbText = w.kelompok_belajar_aktif && w.kelompok_belajar_list?.length > 0
        ? w.kelompok_belajar_list.join(', ')
        : 'Tidak';
      return {
        ...w,
        kelompok_belajar: finalKbText
      };
    });

    const url = modalType === 'add' ? `${API_URL}/keluarga` : `${API_URL}/keluarga/${editId}`;
    const method = modalType === 'add' ? 'POST' : 'PUT';

    const payload = {
      ...formData,
      warga: formattedWarga,
      pekarangan: pekaranganList,
      industri: industriList
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
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

  const filteredKeluarga = dataKeluarga.filter(item => {
    if (filterStatus === 'All') return true;
    return item.status_verifikasi === filterStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-gray-800 font-serif">Buku Data Keluarga (KK)</h3>
          <p className="text-[10px] text-gray-400 font-medium">Kelola keluarga, sanitasi, dasawisma, dan verifikasi berkas warga mandiri</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-emerald-850 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-md transition shadow"
        >
          + Tambah Keluarga
        </button>
      </div>

      {/* Filter Status Verifikasi */}
      <div className="flex items-center space-x-2 text-xs font-semibold text-gray-500 bg-gray-100 p-1.5 rounded-lg w-max select-none">
        {['All', 'Approved', 'Pending', 'Rejected'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-md transition ${filterStatus === status ? 'bg-white text-emerald-850 font-bold shadow' : 'hover:text-emerald-800'}`}
          >
            {status === 'All' ? 'Semua' : status === 'Approved' ? 'Disetujui' : status === 'Pending' ? 'Pending' : 'Ditolak'}
          </button>
        ))}
      </div>

      {/* Tabel Data */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-gray-700">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">No. KK</th>
                <th className="p-4">Jorong &amp; Dasawisma</th>
                <th className="p-4">RT/RW/Dusun</th>
                <th className="p-4 text-center">Kriteria Rumah</th>
                <th className="p-4 text-center">UP2K</th>
                <th className="p-4 text-center">Status Verifikasi</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredKeluarga.map(item => (
                <tr key={item.no_kk} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-bold text-gray-900">{item.no_kk}</td>
                  <td className="p-4">
                    <span className="block font-bold text-gray-800">{item.nama_jorong || `Jorong ${item.id_jorong}`}</span>
                    <span className="bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded text-[9px] font-bold mt-1 inline-block">
                      {item.dasawisma}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">
                    {item.rt ? `RT ${item.rt} / RW ${item.rw}` : '-'}
                    <span className="block text-[10px] text-gray-450 mt-0.5">{item.dusun || ''}</span>
                  </td>
                  <td className="p-4 text-center font-bold">{item.kriteria_rumah}</td>
                  <td className="p-4 text-center">
                    {item.up2k_aktif ? (
                      <span className="text-emerald-700 font-bold" title={item.up2k_jenis}>Ya</span>
                    ) : 'Tidak'}
                  </td>
                  <td className="p-4 text-center">
                    {item.status_verifikasi === 'Approved' ? (
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[9px]">Disetujui</span>
                    ) : item.status_verifikasi === 'Pending' ? (
                      <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold text-[9px] animate-pulse">Pending</span>
                    ) : (
                      <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold text-[9px]">Ditolak</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                      {item.status_verifikasi === 'Pending' && (
                        <div className="flex space-x-1.5 mb-1">
                          <button 
                            onClick={() => handleVerifyStatus(item.no_kk, 'Approved')} 
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] px-2 py-1 rounded font-bold"
                          >
                            Setujui
                          </button>
                          <button 
                            onClick={() => handleVerifyStatus(item.no_kk, 'Rejected')} 
                            className="bg-red-500 hover:bg-red-600 text-white text-[9px] px-2 py-1 rounded font-bold"
                          >
                            Tolak
                          </button>
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        <button onClick={() => handleOpenEdit(item)} className="text-gray-400 hover:text-emerald-700 font-bold">Edit</button>
                        <button onClick={() => handleDelete(item.no_kk)} className="text-red-400 hover:text-red-700 font-bold">Hapus</button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredKeluarga.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-400 font-medium">Tidak ada data keluarga (kosong)</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg border shadow-xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-emerald-900 text-white p-4 flex justify-between items-center">
              <h4 className="font-bold text-sm">{modalType === 'add' ? 'Tambah Keluarga Baru' : 'Edit Data Keluarga'}</h4>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-250 hover:text-white text-lg font-bold">&times;</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto font-sans text-xs font-semibold text-gray-600">
              
              {/* 1. Informasi Alamat */}
              <div className="space-y-3">
                <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider">1. Informasi Dasawisma &amp; Alamat</span>
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
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">RT</label>
                      <input type="text" value={formData.rt || ''} onChange={(e) => setFormData({...formData, rt: e.target.value})} className="w-full border rounded p-2" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">RW</label>
                      <input type="text" value={formData.rw || ''} onChange={(e) => setFormData({...formData, rw: e.target.value})} className="w-full border rounded p-2" />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Dusun/Lingkungan</label>
                    <input type="text" value={formData.dusun || ''} onChange={(e) => setFormData({...formData, dusun: e.target.value})} className="w-full border rounded p-2" />
                  </div>
                </div>
              </div>

              {/* 2. Kondisi Rumah */}
              <div className="space-y-3 border-t pt-4">
                <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider">2. Kondisi Rumah &amp; Sanitasi</span>
                <div className="grid grid-cols-2 gap-4">
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
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Sumber Air Utama</label>
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
                  {formData.makanan_pokok === 'Non Beras' && (
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">Makanan Pokok Non Beras</label>
                      <input type="text" value={formData.makanan_pokok_lain || ''} onChange={(e) => setFormData({...formData, makanan_pokok_lain: e.target.value})} className="w-full border rounded p-2" required />
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Sanitasi Checkbox */}
              <div className="space-y-3 border-t pt-4">
                <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider">3. Sanitasi Lingkungan &amp; Stiker</span>
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
                      <input 
                        type="number" 
                        value={formData.jumlah_jamban} 
                        onChange={(e) => setFormData({...formData, jumlah_jamban: parseInt(e.target.value) || 0})} 
                        className="w-full border rounded p-1.5" 
                        placeholder="Jumlah buah"
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
                  <label className="flex items-center space-x-2 bg-gray-50 p-2.5 rounded border select-none cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.kesling_aktif} 
                      onChange={(e) => setFormData({...formData, kesling_aktif: e.target.checked})} 
                    />
                    <span>Kegiatan Kesling</span>
                  </label>
                </div>
              </div>

              {/* 4. UP2K & Verifikasi */}
              <div className="space-y-3 border-t pt-4">
                <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider">4. Usaha Mandiri &amp; Status Verifikasi</span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2 border p-3 rounded-lg bg-emerald-50/10">
                    <label className="flex items-center space-x-2 select-none cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.up2k_aktif} 
                        onChange={(e) => setFormData({...formData, up2k_aktif: e.target.checked, up2k_jenis: ''})} 
                      />
                      <span className="font-bold">Keluarga Terlibat Usaha UP2K</span>
                    </label>
                    {formData.up2k_aktif && (
                      <input type="text" value={formData.up2k_jenis || ''} onChange={(e) => setFormData({...formData, up2k_jenis: e.target.value})} placeholder="Jenis Usaha UP2K" className="w-full border rounded p-2 bg-white" required />
                    )}
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Status Verifikasi Berkas</label>
                    <select 
                      value={formData.status_verifikasi} 
                      onChange={(e) => setFormData({...formData, status_verifikasi: e.target.value})} 
                      className="w-full border rounded p-2 bg-white font-bold"
                    >
                      <option value="Approved">Disetujui (Approved)</option>
                      <option value="Pending">Pending Verifikasi</option>
                      <option value="Rejected">Ditolak (Rejected)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* === BARU: LANGKAH 2 ANGGOTA KELUARGA (WARGA) === */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider">5. Anggota Keluarga (Warga)</span>
                  <button type="button" onClick={handleOpenAddWarga} className="bg-emerald-50 hover:bg-emerald-100 text-emerald-850 font-bold px-2.5 py-1 rounded text-[10px] border border-emerald-200 transition">+ Tambah Anggota</button>
                </div>
                <div className="bg-gray-50/50 p-3 rounded-lg border space-y-2">
                  {wargaList.map((w, idx) => (
                    <div key={idx} className="bg-white p-3 rounded border flex justify-between items-center shadow-xs">
                      <div>
                        <span className="block font-bold text-gray-800 text-xs">{w.nama || '(Nama kosong)'}</span>
                        <span className="text-[9px] text-gray-400 font-semibold">NIK: {w.nik} | Hubungan: {w.status_keluarga} | Umur: {calculateAge(w.tanggal_lahir)}</span>
                      </div>
                      <div className="space-x-3 text-[10px]">
                        <button type="button" onClick={() => handleOpenEditWarga(idx)} className="text-emerald-850 font-bold">Edit</button>
                        <button type="button" onClick={() => handleDeleteWarga(idx)} className="text-red-500 font-bold">Hapus</button>
                      </div>
                    </div>
                  ))}
                  {wargaList.length === 0 && (
                    <div className="text-center p-4 text-gray-400">Belum ada data anggota keluarga</div>
                  )}
                </div>
              </div>

              {/* 5. TABEL DINAMIS PEKARANGAN */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider">6. Pemanfaatan Lahan Pekarangan (Hatinya PKK)</span>
                  <button type="button" onClick={handleAddPekarangan} className="bg-emerald-50 hover:bg-emerald-100 text-emerald-850 font-bold px-2.5 py-1 rounded text-[10px] border border-emerald-200 transition">+ Tambah Baris</button>
                </div>
                <div className="border rounded overflow-hidden">
                  <table className="w-full text-left border-collapse bg-gray-50/20 text-[11px]">
                    <thead>
                      <tr className="bg-gray-55 border-b text-[9px] text-gray-400 font-bold uppercase">
                        <th className="p-2">Kategori</th>
                        <th className="p-2">Komoditi</th>
                        <th className="p-2 w-24">Jumlah</th>
                        <th className="p-2 text-center w-16">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {pekaranganList.map((p, idx) => (
                        <tr key={idx} className="bg-white">
                          <td className="p-1">
                            <select value={p.kategori} onChange={(e) => handlePekaranganChange(idx, 'kategori', e.target.value)} className="w-full border rounded p-1 bg-white">
                              <option value="Peternakan">Peternakan</option>
                              <option value="Perikanan">Perikanan</option>
                              <option value="Warung Hidup">Warung Hidup</option>
                              <option value="TOGA">TOGA</option>
                              <option value="Tanaman Keras">Tanaman Keras</option>
                              <option value="Lainnya">Lainnya</option>
                            </select>
                          </td>
                          <td className="p-1">
                            <input type="text" value={p.komoditi} onChange={(e) => handlePekaranganChange(idx, 'komoditi', e.target.value)} className="w-full border rounded p-1" required />
                          </td>
                          <td className="p-1">
                            <input type="number" value={p.jumlah} onChange={(e) => handlePekaranganChange(idx, 'jumlah', parseInt(e.target.value) || 0)} className="w-full border rounded p-1" />
                          </td>
                          <td className="p-1 text-center">
                            <button type="button" onClick={() => handleDeletePekarangan(idx)} className="text-red-500 font-bold hover:underline">Hapus</button>
                          </td>
                        </tr>
                      ))}
                      {pekaranganList.length === 0 && (
                        <tr>
                          <td colSpan="4" className="p-4 text-center text-gray-400">Tidak ada komoditi pekarangan</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 6. TABEL DINAMIS INDUSTRI */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider">7. Industri Rumah Tangga</span>
                  <button type="button" onClick={handleAddIndustri} className="bg-emerald-50 hover:bg-emerald-100 text-emerald-850 font-bold px-2.5 py-1 rounded text-[10px] border border-emerald-200 transition">+ Tambah Baris</button>
                </div>
                <div className="border rounded overflow-hidden">
                  <table className="w-full text-left border-collapse bg-gray-50/20 text-[11px]">
                    <thead>
                      <tr className="bg-gray-55 border-b text-[9px] text-gray-400 font-bold uppercase">
                        <th className="p-2">Kategori</th>
                        <th className="p-2">Nama Komoditi / Produk</th>
                        <th className="p-2 w-24">Karyawan</th>
                        <th className="p-2 text-center w-16">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {industriList.map((ind, idx) => (
                        <tr key={idx} className="bg-white">
                          <td className="p-1">
                            <select value={ind.kategori} onChange={(e) => handleIndustriChange(idx, 'kategori', e.target.value)} className="w-full border rounded p-1 bg-white">
                              <option value="Pangan">Pangan</option>
                              <option value="Sandang">Sandang</option>
                              <option value="Konveksi">Konveksi</option>
                              <option value="Jasa">Jasa</option>
                              <option value="Lain-lain">Lain-lain</option>
                            </select>
                          </td>
                          <td className="p-1">
                            <input type="text" value={ind.komoditi} onChange={(e) => handleIndustriChange(idx, 'komoditi', e.target.value)} className="w-full border rounded p-1" required />
                          </td>
                          <td className="p-1">
                            <input type="number" value={ind.jumlah} onChange={(e) => handleIndustriChange(idx, 'jumlah', parseInt(e.target.value) || 0)} className="w-full border rounded p-1" />
                          </td>
                          <td className="p-1 text-center">
                            <button type="button" onClick={() => handleDeleteIndustri(idx)} className="text-red-500 font-bold hover:underline">Hapus</button>
                          </td>
                        </tr>
                      ))}
                      {industriList.length === 0 && (
                        <tr>
                          <td colSpan="4" className="p-4 text-center text-gray-400">Tidak ada industri keluarga</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
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

      {/* Sub-modal Editor Detail Warga/Anggota */}
      {editingWargaIdx !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-emerald-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg border shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-emerald-900 text-white p-4 font-bold text-xs flex justify-between items-center">
              <span>{editingWargaIdx === -1 ? 'Tambah Anggota Keluarga Baru' : 'Edit Anggota Keluarga'}</span>
              <button type="button" onClick={() => setEditingWargaIdx(null)} className="text-lg font-bold">&times;</button>
            </div>
            
            <form onSubmit={handleSaveWarga} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-[11px] font-semibold text-gray-600">
              
              {/* 1. Biodata Pribadi */}
              <div className="space-y-3">
                <span className="block text-[9px] font-bold text-emerald-850 uppercase tracking-wider">1. Biodata Pribadi</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 mb-0.5">No Registrasi</label>
                    <input type="text" value={activeWargaForm.no_registrasi || ''} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, no_registrasi: e.target.value })} className="w-full border rounded p-1.5" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 mb-0.5">NIK (KTP 16 digit)</label>
                    <input 
                      type="text" 
                      maxLength="16" 
                      value={activeWargaForm.nik || ''} 
                      onChange={(e) => setActiveWargaForm({ ...activeWargaForm, nik: e.target.value.replace(/\D/g, '') })} 
                      className="w-full border rounded p-1.5" 
                      disabled={editingWargaIdx !== -1 && activeWargaForm.status_keluarga === 'Kepala Keluarga'} 
                      required 
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[9px] font-bold text-gray-400 mb-0.5">Nama Lengkap</label>
                    <input type="text" value={activeWargaForm.nama || ''} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, nama: e.target.value })} className="w-full border rounded p-1.5" required />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 mb-0.5">Jabatan PKK</label>
                    <input type="text" value={activeWargaForm.jabatan_pkk || ''} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, jabatan_pkk: e.target.value })} className="w-full border rounded p-1.5" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 mb-0.5">Jenis Kelamin</label>
                    <select value={activeWargaForm.jenis_kelamin} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, jenis_kelamin: e.target.value })} className="w-full border rounded p-1.5 bg-white">
                      <option value="P">Perempuan</option>
                      <option value="L">Laki-Laki</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 mb-0.5">Tempat Lahir</label>
                    <input type="text" value={activeWargaForm.tempat_lahir || ''} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, tempat_lahir: e.target.value })} className="w-full border rounded p-1.5" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 mb-0.5">Tanggal Lahir</label>
                    <input type="date" value={activeWargaForm.tanggal_lahir || ''} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, tanggal_lahir: e.target.value })} className="w-full border rounded p-1.5" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 mb-0.5">Status Perkawinan</label>
                    <select value={activeWargaForm.status_perkawinan} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, status_perkawinan: e.target.value })} className="w-full border rounded p-1.5 bg-white">
                      <option value="Lajang">Lajang</option>
                      <option value="Menikah">Menikah</option>
                      <option value="Janda">Janda</option>
                      <option value="Duda">Duda</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 mb-0.5">Status Keluarga</label>
                    <select 
                      value={activeWargaForm.status_keluarga} 
                      onChange={(e) => setActiveWargaForm({ ...activeWargaForm, status_keluarga: e.target.value })} 
                      className="w-full border rounded p-1.5 bg-white"
                      disabled={editingWargaIdx !== -1 && activeWargaForm.status_keluarga === 'Kepala Keluarga'} 
                    >
                      <option value="Kepala Keluarga">Kepala Keluarga</option>
                      <option value="Istri">Istri</option>
                      <option value="Anak">Anak</option>
                      <option value="Orangtua">Orangtua</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 mb-0.5">Agama</label>
                    <select value={activeWargaForm.agama} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, agama: e.target.value })} className="w-full border rounded p-1.5 bg-white">
                      <option value="Islam">Islam</option>
                      <option value="Kristen">Kristen</option>
                      <option value="Katolik">Katolik</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Budha">Budha</option>
                      <option value="Khonghuchu">Khonghuchu</option>
                      <option value="Kepercayaan Lain">Kepercayaan Lain</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 mb-0.5">Pendidikan</label>
                    <select value={activeWargaForm.pendidikan} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, pendidikan: e.target.value })} className="w-full border rounded p-1.5 bg-white">
                      <option value="Tidak tamat SD">Tidak tamat SD</option>
                      <option value="SD/MI">SD/MI</option>
                      <option value="SMP/Sederajat">SMP/Sederajat</option>
                      <option value="SMA/Sederajat">SMA/Sederajat</option>
                      <option value="Diploma">Diploma</option>
                      <option value="S1">S1</option>
                      <option value="S2">S2</option>
                      <option value="S3">S3</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 mb-0.5">Pekerjaan</label>
                    <select value={activeWargaForm.pekerjaan} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, pekerjaan: e.target.value })} className="w-full border rounded p-1.5 bg-white">
                      <option value="Petani">Petani</option>
                      <option value="Pedagang">Pedagang</option>
                      <option value="Swasta">Swasta</option>
                      <option value="Wirausaha">Wirausaha</option>
                      <option value="PNS">PNS</option>
                      <option value="TNI/POLRI">TNI/POLRI</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 2. Kesehatan & Koperasi */}
              <div className="space-y-3 border-t pt-3">
                <span className="block text-[9px] font-bold text-emerald-850 uppercase tracking-wider">2. Kesehatan &amp; Koperasi</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 mb-0.5">Akseptor KB</label>
                    <div className="flex space-x-3 mb-1">
                      <label className="flex items-center space-x-1"><input type="radio" checked={activeWargaForm.akseptor_kb} onChange={() => setActiveWargaForm({...activeWargaForm, akseptor_kb: true})} /><span>Ya</span></label>
                      <label className="flex items-center space-x-1"><input type="radio" checked={!activeWargaForm.akseptor_kb} onChange={() => setActiveWargaForm({...activeWargaForm, akseptor_kb: false, jenis_kb: ''})} /><span>Tidak</span></label>
                    </div>
                    {activeWargaForm.akseptor_kb && (
                      <input type="text" value={activeWargaForm.jenis_kb || ''} onChange={(e) => setActiveWargaForm({...activeWargaForm, jenis_kb: e.target.value})} className="w-full border rounded p-1" placeholder="Jenis KB" required />
                    )}
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 mb-0.5">Aktif Posyandu</label>
                    <div className="flex space-x-3 mb-1">
                      <label className="flex items-center space-x-1"><input type="radio" checked={activeWargaForm.aktif_posyandu} onChange={() => setActiveWargaForm({...activeWargaForm, aktif_posyandu: true})} /><span>Ya</span></label>
                      <label className="flex items-center space-x-1"><input type="radio" checked={!activeWargaForm.aktif_posyandu} onChange={() => setActiveWargaForm({...activeWargaForm, aktif_posyandu: false, frekuensi_posyandu: 0})} /><span>Tidak</span></label>
                    </div>
                    {activeWargaForm.aktif_posyandu && (
                      <input type="number" value={activeWargaForm.frekuensi_posyandu} onChange={(e) => setActiveWargaForm({...activeWargaForm, frekuensi_posyandu: parseInt(e.target.value) || 0})} className="w-20 border rounded p-1" placeholder="Frekuensi" />
                    )}
                  </div>
                  
                  {/* Kelompok Belajar */}
                  <div className="col-span-2 border p-2 bg-gray-50 rounded">
                    <label className="block text-[9px] font-bold text-gray-400 mb-1">Kelompok Belajar</label>
                    <div className="flex space-x-4 mb-2">
                      <label className="flex items-center space-x-1"><input type="radio" checked={activeWargaForm.kelompok_belajar_aktif} onChange={() => setActiveWargaForm({...activeWargaForm, kelompok_belajar_aktif: true})} /><span>Ya</span></label>
                      <label className="flex items-center space-x-1"><input type="radio" checked={!activeWargaForm.kelompok_belajar_aktif} onChange={() => setActiveWargaForm({...activeWargaForm, kelompok_belajar_aktif: false, kelompok_belajar_list: []})} /><span>Tidak</span></label>
                    </div>
                    {activeWargaForm.kelompok_belajar_aktif && (
                      <div className="flex space-x-3 border-t pt-1.5 mt-1.5">
                        {['Paket A', 'Paket B', 'Paket C', 'KF'].map(pkg => (
                          <label key={pkg} className="flex items-center space-x-1"><input type="checkbox" checked={activeWargaForm.kelompok_belajar_list.includes(pkg)} onChange={(e) => handleKBCheckbox(pkg, e.target.checked)} /><span>{pkg}</span></label>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 mb-0.5">Ikut Koperasi</label>
                    <div className="flex space-x-3 mb-1">
                      <label className="flex items-center space-x-1"><input type="radio" checked={activeWargaForm.ikut_koperasi} onChange={() => setActiveWargaForm({...activeWargaForm, ikut_koperasi: true})} /><span>Ya</span></label>
                      <label className="flex items-center space-x-1"><input type="radio" checked={!activeWargaForm.ikut_koperasi} onChange={() => setActiveWargaForm({...activeWargaForm, ikut_koperasi: false, jenis_koperasi: ''})} /><span>Tidak</span></label>
                    </div>
                    {activeWargaForm.ikut_koperasi && (
                      <input type="text" value={activeWargaForm.jenis_koperasi || ''} onChange={(e) => setActiveWargaForm({...activeWargaForm, jenis_koperasi: e.target.value})} className="w-full border rounded p-1" placeholder="Jenis Koperasi" required />
                    )}
                  </div>

                  <div className="col-span-2 grid grid-cols-3 gap-2">
                    <label className="flex items-center space-x-1.5"><input type="checkbox" checked={activeWargaForm.bina_keluarga} onChange={(e) => setActiveWargaForm({...activeWargaForm, bina_keluarga: e.target.checked})} /><span>Bina Keluarga</span></label>
                    <label className="flex items-center space-x-1.5"><input type="checkbox" checked={activeWargaForm.memiliki_tabungan} onChange={(e) => setActiveWargaForm({...activeWargaForm, memiliki_tabungan: e.target.checked})} /><span>Tabungan</span></label>
                    <label className="flex items-center space-x-1.5"><input type="checkbox" checked={activeWargaForm.paud} onChange={(e) => setActiveWargaForm({...activeWargaForm, paud: e.target.checked})} /><span>PAUD</span></label>
                    <label className="flex items-center space-x-1.5"><input type="checkbox" checked={activeWargaForm.berkebutuhan_khusus} onChange={(e) => setActiveWargaForm({...activeWargaForm, berkebutuhan_khusus: e.target.checked})} /><span>Disabilitas</span></label>
                  </div>
                </div>
              </div>

              {/* 3. Aktivitas Sosial */}
              <div className="space-y-3 border-t pt-3">
                <span className="block text-[9px] font-bold text-emerald-850 uppercase tracking-wider">3. Aktivitas Sosial Warga</span>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center space-x-1.5"><input type="checkbox" checked={activeWargaForm.penghayatan_pancasila} onChange={(e) => setActiveWargaForm({...activeWargaForm, penghayatan_pancasila: e.target.checked})} /><span>Penghayatan Pancasila</span></label>
                  <label className="flex items-center space-x-1.5"><input type="checkbox" checked={activeWargaForm.kerja_bakti} onChange={(e) => setActiveWargaForm({...activeWargaForm, kerja_bakti: e.target.checked})} /><span>Kerja Bakti</span></label>
                  <label className="flex items-center space-x-1.5"><input type="checkbox" checked={activeWargaForm.rukun_kematian} onChange={(e) => setActiveWargaForm({...activeWargaForm, rukun_kematian: e.target.checked})} /><span>Rukun Kematian</span></label>
                  <label className="flex items-center space-x-1.5"><input type="checkbox" checked={activeWargaForm.kegiatan_keagamaan} onChange={(e) => setActiveWargaForm({...activeWargaForm, kegiatan_keagamaan: e.target.checked})} /><span>Kegiatan Keagamaan</span></label>
                  <label className="flex items-center space-x-1.5"><input type="checkbox" checked={activeWargaForm.jimpitan} onChange={(e) => setActiveWargaForm({...activeWargaForm, jimpitan: e.target.checked})} /><span>Jimpitan</span></label>
                  <label className="flex items-center space-x-1.5"><input type="checkbox" checked={activeWargaForm.arisan} onChange={(e) => setActiveWargaForm({...activeWargaForm, arisan: e.target.checked})} /><span>Arisan</span></label>
                </div>
              </div>

              <div className="flex space-x-2 pt-4 border-t mt-4">
                <button type="button" onClick={() => setEditingWargaIdx(null)} className="flex-1 border text-gray-500 font-bold py-2 rounded">Batal</button>
                <button type="submit" className="flex-1 bg-emerald-800 text-white font-bold py-2 rounded shadow">Simpan Anggota</button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default KeluargaAdmin;
