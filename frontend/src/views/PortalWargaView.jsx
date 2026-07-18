import React, { useState, useEffect } from 'react';

function PortalWargaView({ API_URL }) {
  const [step, setStep] = useState(1); // 1: Verify, 2: Keluarga Form, 3: Anggota Keluarga List, 4: Lahan & Usaha
  const [verifyData, setVerifyData] = useState({ no_kk: '', nik: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataJorong, setDataJorong] = useState([]);

  // --- LANGKAH 1: DATA KELUARGA & RUMAH TANGGA STATE ---
  const [keluarga, setKeluarga] = useState({
    no_kk: '',
    id_jorong: 1,
    dasawisma: '',
    rt: '',
    rw: '',
    dusun: '',
    makanan_pokok: 'Beras',
    makanan_pokok_lain: '',
    jamban_keluarga: false,
    jumlah_jamban: 0,
    sumber_air: 'PDAM',
    tempat_sampah: false,
    spal: false,
    stiker_p4k: false,
    kriteria_rumah: 'Sehat',
    up2k_aktif: false,
    up2k_jenis: '',
    kesling_aktif: false
  });

  const [wargaList, setWargaList] = useState([]);
  const [pekaranganList, setPekaranganList] = useState([]);
  const [industriList, setIndustriList] = useState([]);

  // --- STATE MODAL ANGGOTA ---
  const [editingWargaIdx, setEditingWargaIdx] = useState(null); // null, -1 (baru), atau index list
  const [activeWargaForm, setActiveWargaForm] = useState({
    nik: '', no_registrasi: '', nama: '', jabatan_pkk: '', jenis_kelamin: 'P',
    tempat_lahir: '', tanggal_lahir: '', status_perkawinan: 'Lajang', status_keluarga: 'Anak',
    agama: 'Islam', pendidikan: 'SMA/Sederajat', pekerjaan: 'Lainnya',
    akseptor_kb: false, jenis_kb: '',
    aktif_posyandu: false, frekuensi_posyandu: 0,
    bina_keluarga: false, memiliki_tabungan: false,
    kelompok_belajar_aktif: false, kelompok_belajar_list: [], // Paket A, Paket B, Paket C, KF
    paud: false, ikut_koperasi: false, jenis_koperasi: '', berkebutuhan_khusus: false,
    penghayatan_pancasila: false, kerja_bakti: false, rukun_kematian: false,
    kegiatan_keagamaan: false, jimpitan: false, arisan: false
  });

  // Ambil data wilayah jorong dari backend
  useEffect(() => {
    fetch(`${API_URL}/jorong`)
      .then(res => res.json())
      .then(data => {
        setDataJorong(data);
        if (data.length > 0) {
          setKeluarga(prev => ({ ...prev, id_jorong: data[0].id_jorong }));
        }
      })
      .catch(err => console.warn('Gagal mengambil data wilayah:', err));
  }, [API_URL]);

  // Kalkulasi Umur secara otomatis dari Tanggal Lahir
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

  // --- VALIDASI DAN LOAD DATA ---
  const handleVerify = async (e) => {
    e.preventDefault();
    if (verifyData.no_kk.length !== 16 || verifyData.nik.length !== 16) {
      setErrorMsg('Nomor KK dan NIK Kepala Keluarga harus berukuran 16 digit.');
      return;
    }
    setErrorMsg('');
    setInfoMsg('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/warga/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verifyData)
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        if (data.isNew) {
          setInfoMsg('Nomor KK Baru dideteksi. Formulir kosong telah disiapkan.');
          setKeluarga({
            no_kk: verifyData.no_kk,
            id_jorong: dataJorong[0]?.id_jorong || 1,
            dasawisma: '', rt: '', rw: '', dusun: '',
            makanan_pokok: 'Beras', makanan_pokok_lain: '',
            jamban_keluarga: false, jumlah_jamban: 0, sumber_air: 'PDAM',
            tempat_sampah: false, spal: false, stiker_p4k: false, kriteria_rumah: 'Sehat',
            up2k_aktif: false, up2k_jenis: '', kesling_aktif: false
          });
          
          // Set Kepala Keluarga awal
          setWargaList([{
            nik: verifyData.nik, no_registrasi: '', nama: '', jabatan_pkk: '', jenis_kelamin: 'L',
            tempat_lahir: '', tanggal_lahir: '', status_perkawinan: 'Menikah', status_keluarga: 'Kepala Keluarga',
            agama: 'Islam', pendidikan: 'SMA/Sederajat', pekerjaan: 'Lainnya',
            akseptor_kb: false, jenis_kb: '',
            aktif_posyandu: false, frekuensi_posyandu: 0,
            bina_keluarga: false, memiliki_tabungan: false,
            kelompok_belajar_aktif: false, kelompok_belajar_list: [],
            paud: false, ikut_koperasi: false, jenis_koperasi: '', berkebutuhan_khusus: false,
            penghayatan_pancasila: false, kerja_bakti: false, rukun_kematian: false,
            kegiatan_keagamaan: false, jimpitan: false, arisan: false
          }]);
          setPekaranganList([]);
          setIndustriList([]);
        } else {
          setInfoMsg('Data keluarga Anda ditemukan. Anda dapat mengedit dan mengirimkan kembali.');
          setKeluarga({
            ...data.keluarga,
            jamban_keluarga: !!data.keluarga.jamban_keluarga,
            tempat_sampah: !!data.keluarga.tempat_sampah,
            spal: !!data.keluarga.spal,
            stiker_p4k: !!data.keluarga.stiker_p4k,
            up2k_aktif: !!data.keluarga.up2k_aktif,
            kesling_aktif: !!data.keluarga.kesling_aktif
          });
          
          // Map data kelompok belajar yang disimpan sebagai teks gabungan
          const mappedWarga = data.warga.map(w => {
            const kbStr = w.kelompok_belajar || 'Tidak';
            const isActive = kbStr !== 'Tidak' && kbStr !== '';
            const list = isActive ? kbStr.split(', ') : [];
            return {
              ...w,
              kelompok_belajar_aktif: isActive,
              kelompok_belajar_list: list
            };
          });
          
          setWargaList(mappedWarga);
          setPekaranganList(data.pekarangan || []);
          setIndustriList(data.industri || []);
        }
        setStep(2);
      } else {
        setErrorMsg(data.message || 'Kombinasi KK dan NIK Kepala Keluarga tidak valid.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Gagal terhubung ke server.');
    }
  };

  // --- ANGGOTA KELUARGA LIST HANDLERS ---
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
      alert('NIK harus 16 digit angka');
      return;
    }
    
    // Siapkan text kelompok belajar untuk disimpan di DB
    const finalKbText = activeWargaForm.kelompok_belajar_aktif && activeWargaForm.kelompok_belajar_list.length > 0
      ? activeWargaForm.kelompok_belajar_list.join(', ')
      : 'Tidak';

    const cleanWarga = {
      ...activeWargaForm,
      kelompok_belajar: finalKbText
    };

    if (editingWargaIdx === -1) {
      // Cek duplikasi NIK di list local
      if (wargaList.some(w => w.nik === cleanWarga.nik)) {
        alert('NIK ini sudah ada di dalam daftar keluarga.');
        return;
      }
      setWargaList([...wargaList, cleanWarga]);
    } else {
      setWargaList(wargaList.map((w, i) => i === editingWargaIdx ? cleanWarga : w));
    }
    setEditingWargaIdx(null);
  };

  const handleDeleteWarga = (idx) => {
    if (wargaList[idx].status_keluarga === 'Kepala Keluarga') {
      alert('Kepala Keluarga tidak boleh dihapus dari KK.');
      return;
    }
    if (confirm('Hapus anggota keluarga ini?')) {
      setWargaList(wargaList.filter((_, i) => i !== idx));
    }
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

  // --- PEKARANGAN TABEL DINAMIS ---
  const handleAddPekarangan = () => {
    setPekaranganList([...pekaranganList, { kategori: 'Warung Hidup', komoditi: '', jumlah: 0 }]);
  };

  const handlePekaranganChange = (idx, field, val) => {
    setPekaranganList(pekaranganList.map((p, i) => i === idx ? { ...p, [field]: val } : p));
  };

  const handleDeletePekarangan = (idx) => {
    setPekaranganList(pekaranganList.filter((_, i) => i !== idx));
  };

  // --- INDUSTRI TABEL DINAMIS ---
  const handleAddIndustri = () => {
    setIndustriList([...industriList, { kategori: 'Pangan', komoditi: '', jumlah: 0, status_up2k: true }]);
  };

  const handleIndustriChange = (idx, field, val) => {
    setIndustriList(industriList.map((ind, i) => i === idx ? { ...ind, [field]: val } : ind));
  };

  const handleDeleteIndustri = (idx) => {
    setIndustriList(industriList.filter((_, i) => i !== idx));
  };

  // --- SUBMIT TRANSACTION KE BACKEND ---
  const handleSubmitAll = async () => {
    if (wargaList.length === 0) {
      alert('Keluarga minimal harus memiliki 1 anggota keluarga (Kepala Keluarga).');
      return;
    }
    
    // Validasi keberadaan Kepala Keluarga
    if (!wargaList.some(w => w.status_keluarga === 'Kepala Keluarga')) {
      alert('Harus ada 1 anggota keluarga dengan status Kepala Keluarga.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        keluarga,
        warga: wargaList,
        pekarangan: pekaranganList,
        industri: industriList
      };

      const res = await fetch(`${API_URL}/warga/submit-mandiri`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        alert('Data keluarga berhasil disimpan secara mandiri dan masuk ke status PENDING menunggu approval Admin TP-PKK Nagari Suayan.');
        setStep(1);
        setVerifyData({ no_kk: '', nik: '' });
      } else {
        alert(data.message || 'Gagal menyimpan data.');
      }
    } catch (err) {
      setLoading(false);
      alert('Kesalahan jaringan. Gagal terhubung dengan server.');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 font-sans">
      <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">
        
        {/* Header Portal */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white p-8 text-center relative">
          <h2 className="text-2xl font-extrabold font-serif tracking-tight">Portal Input Mandiri Warga</h2>
          <p className="text-emerald-100 text-xs mt-2 font-medium">TP-PKK Nagari Suayan — Formulir Dasawisma &amp; Rekapitulasi Data Warga Mandiri</p>
          
          {step > 1 && (
            <div className="flex justify-center items-center mt-6 space-x-6 text-[10px] uppercase font-bold tracking-wider text-emerald-200">
              <span className={step === 2 ? "text-amber-400 font-extrabold" : ""}>1. Data Keluarga</span>
              <span>&rarr;</span>
              <span className={step === 3 ? "text-amber-400 font-extrabold" : ""}>2. Anggota Keluarga</span>
              <span>&rarr;</span>
              <span className={step === 4 ? "text-amber-400 font-extrabold" : ""}>3. Lahan &amp; Usaha</span>
            </div>
          )}
        </div>

        {/* STEP 1: VERIFIKASI NIK & KK */}
        {step === 1 && (
          <div className="p-8 max-w-md mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-base font-extrabold text-gray-800 font-serif">Gerbang Pengisian Mandiri</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Silakan verifikasi Nomor KK dan NIK Kepala Keluarga Anda. Jika data sudah terdaftar, sistem akan mengambil data lama untuk diperbarui. Jika belum, form kosong akan dibuat.
              </p>
            </div>

            {errorMsg && (
              <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-200 font-medium">
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4 text-xs font-semibold text-gray-600">
              <div>
                <label className="block mb-1 text-[10px] text-gray-400 font-bold uppercase">Nomor Kartu Keluarga (KK)</label>
                <input 
                  type="text" 
                  maxLength="16" 
                  value={verifyData.no_kk} 
                  onChange={(e) => setVerifyData({ ...verifyData, no_kk: e.target.value.replace(/\D/g, '') })}
                  className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800" 
                  placeholder="Masukkan 16 digit Nomor KK" 
                  required 
                />
              </div>

              <div>
                <label className="block mb-1 text-[10px] text-gray-400 font-bold uppercase">NIK Kepala Keluarga</label>
                <input 
                  type="text" 
                  maxLength="16" 
                  value={verifyData.nik} 
                  onChange={(e) => setVerifyData({ ...verifyData, nik: e.target.value.replace(/\D/g, '') })}
                  className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800" 
                  placeholder="Masukkan 16 digit NIK Kepala Keluarga" 
                  required 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-emerald-850 hover:bg-emerald-900 text-white font-bold py-3.5 rounded-lg transition shadow"
              >
                {loading ? 'Memverifikasi...' : 'Verifikasi Data'}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: DATA KELUARGA & RUMAH TANGGA */}
        {step === 2 && (
          <div className="p-8 space-y-6 text-xs font-semibold text-gray-600">
            {infoMsg && (
              <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-lg border border-emerald-100 font-medium">
                💡 {infoMsg}
              </div>
            )}

            <h3 className="text-base font-extrabold text-gray-800 border-b pb-2 font-serif flex items-center">
              🏠 LANGKAH 1: DATA KELUARGA &amp; RUMAH TANGGA
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Alamat & Identitas */}
              <div className="space-y-4">
                <span className="block text-[10px] font-bold text-emerald-850 uppercase tracking-wider">1. Informasi Dasawisma &amp; Alamat</span>
                
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nomor KK (Terkunci)</label>
                  <input type="text" value={keluarga.no_kk} disabled className="w-full border rounded p-2.5 bg-gray-50 font-bold" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nama Kelompok Dasawisma</label>
                  <input 
                    type="text" 
                    value={keluarga.dasawisma} 
                    onChange={(e) => setKeluarga({ ...keluarga, dasawisma: e.target.value })}
                    className="w-full border rounded p-2.5" 
                    placeholder="Contoh: Dasawisma Mawar 1" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">RT</label>
                    <input type="text" value={keluarga.rt} onChange={(e) => setKeluarga({ ...keluarga, rt: e.target.value })} className="w-full border rounded p-2.5" placeholder="RT" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">RW</label>
                    <input type="text" value={keluarga.rw} onChange={(e) => setKeluarga({ ...keluarga, rw: e.target.value })} className="w-full border rounded p-2.5" placeholder="RW" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Dusun / Lingkungan / RT</label>
                  <input type="text" value={keluarga.dusun} onChange={(e) => setKeluarga({ ...keluarga, dusun: e.target.value })} className="w-full border rounded p-2.5" placeholder="Dusun/Lingkungan" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Jorong (Wilayah Nagari)</label>
                  <select 
                    value={keluarga.id_jorong} 
                    onChange={(e) => setKeluarga({ ...keluarga, id_jorong: parseInt(e.target.value) })}
                    className="w-full border rounded p-2.5 bg-white cursor-pointer"
                  >
                    {dataJorong.map(j => (
                      <option key={j.id_jorong} value={j.id_jorong}>{j.nama_jorong}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Kondisi Rumah & Lingkungan */}
              <div className="space-y-4">
                <span className="block text-[10px] font-bold text-emerald-850 uppercase tracking-wider">2. Kondisi Rumah &amp; Lingkungan</span>

                {/* Makanan Pokok */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Makanan Pokok Sehari-hari</label>
                  <div className="flex items-center space-x-4 mb-2">
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="makanan_pokok" value="Beras" checked={keluarga.makanan_pokok === 'Beras'} onChange={(e) => setKeluarga({ ...keluarga, makanan_pokok: e.target.value, makanan_pokok_lain: '' })} />
                      <span>Beras</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="makanan_pokok" value="Non Beras" checked={keluarga.makanan_pokok === 'Non Beras'} onChange={(e) => setKeluarga({ ...keluarga, makanan_pokok: e.target.value })} />
                      <span>Non Beras</span>
                    </label>
                  </div>
                  {keluarga.makanan_pokok === 'Non Beras' && (
                    <input 
                      type="text" 
                      value={keluarga.makanan_pokok_lain} 
                      onChange={(e) => setKeluarga({ ...keluarga, makanan_pokok_lain: e.target.value })}
                      placeholder="Jenis Makanan Pokok (Jagung, Singkong, dll)" 
                      className="w-full border rounded p-2"
                      required
                    />
                  )}
                </div>

                {/* Jamban */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Mempunyai Jamban Keluarga</label>
                  <div className="flex items-center space-x-4 mb-2">
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="jamban" checked={keluarga.jamban_keluarga} onChange={() => setKeluarga({ ...keluarga, jamban_keluarga: true })} />
                      <span>Ya</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="jamban" checked={!keluarga.jamban_keluarga} onChange={() => setKeluarga({ ...keluarga, jamban_keluarga: false, jumlah_jamban: 0 })} />
                      <span>Tidak</span>
                    </label>
                  </div>
                  {keluarga.jamban_keluarga && (
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-gray-400">Jumlah Jamban:</span>
                      <input 
                        type="number" 
                        min="1" 
                        value={keluarga.jumlah_jamban} 
                        onChange={(e) => setKeluarga({ ...keluarga, jumlah_jamban: parseInt(e.target.value) || 1 })} 
                        className="w-20 border rounded p-1.5"
                      />
                    </div>
                  )}
                </div>

                {/* Sumber Air */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Sumber Air Keluarga</label>
                  <select 
                    value={keluarga.sumber_air} 
                    onChange={(e) => setKeluarga({ ...keluarga, sumber_air: e.target.value })}
                    className="w-full border rounded p-2.5 bg-white"
                  >
                    <option value="PDAM">PDAM</option>
                    <option value="Sumur">Sumur</option>
                    <option value="Sungai">Sungai</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                {/* Kriteria Rumah */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Kriteria Rumah</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="kriteria" checked={keluarga.kriteria_rumah === 'Sehat'} onChange={() => setKeluarga({ ...keluarga, kriteria_rumah: 'Sehat' })} />
                      <span>Sehat</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="kriteria" checked={keluarga.kriteria_rumah === 'Kurang Sehat'} onChange={() => setKeluarga({ ...keluarga, kriteria_rumah: 'Kurang Sehat' })} />
                      <span>Kurang Sehat</span>
                    </label>
                  </div>
                </div>

              </div>
            </div>

            {/* Checkbox Sanitasi & Aktivitas */}
            <div className="border-t pt-6">
              <span className="block text-[10px] font-bold text-emerald-850 uppercase tracking-wider mb-3">3. Sanitasi Lingkungan &amp; Aktivitas Usaha</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <label className="flex items-center space-x-3 bg-gray-50 border p-3.5 rounded-xl cursor-pointer select-none">
                  <input type="checkbox" checked={keluarga.tempat_sampah} onChange={(e) => setKeluarga({ ...keluarga, tempat_sampah: e.target.checked })} />
                  <span>Memiliki Tempat Pembuangan Sampah Layak</span>
                </label>

                <label className="flex items-center space-x-3 bg-gray-50 border p-3.5 rounded-xl cursor-pointer select-none">
                  <input type="checkbox" checked={keluarga.spal} onChange={(e) => setKeluarga({ ...keluarga, spal: e.target.checked })} />
                  <span>Mempunyai Saluran Pembuangan Air Limbah (SPAL)</span>
                </label>

                <label className="flex items-center space-x-3 bg-gray-50 border p-3.5 rounded-xl cursor-pointer select-none">
                  <input type="checkbox" checked={keluarga.stiker_p4k} onChange={(e) => setKeluarga({ ...keluarga, stiker_p4k: e.target.checked })} />
                  <span>Menempel Stiker P4K di Depan Rumah</span>
                </label>

                <label className="flex items-center space-x-3 bg-gray-50 border p-3.5 rounded-xl cursor-pointer select-none">
                  <input type="checkbox" checked={keluarga.kesling_aktif} onChange={(e) => setKeluarga({ ...keluarga, kesling_aktif: e.target.checked })} />
                  <span>Aktivitas Kegiatan Usaha Kesehatan Lingkungan</span>
                </label>

                {/* UP2K */}
                <div className="col-span-1 md:col-span-2 border p-4 bg-emerald-50/30 rounded-xl space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer select-none">
                    <input type="checkbox" checked={keluarga.up2k_aktif} onChange={(e) => setKeluarga({ ...keluarga, up2k_aktif: e.target.checked, up2k_jenis: '' })} />
                    <span className="font-bold text-emerald-900">Keluarga Aktif Mengikuti Kegiatan Usaha Peningkatan Pendapatan Keluarga (UP2K)</span>
                  </label>
                  {keluarga.up2k_aktif && (
                    <input 
                      type="text" 
                      value={keluarga.up2k_jenis} 
                      onChange={(e) => setKeluarga({ ...keluarga, up2k_jenis: e.target.value })}
                      placeholder="Masukkan Jenis Usaha UP2K (contoh: Keripik Balado, Tenun Sulam)"
                      className="w-full border rounded p-2.5 bg-white text-xs"
                      required
                    />
                  )}
                </div>

              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex space-x-3 pt-6 border-t mt-6">
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="flex-1 border text-gray-500 py-3 rounded-lg font-bold hover:bg-gray-50"
              >
                Kembali
              </button>
              <button 
                type="button" 
                onClick={() => {
                  if (!keluarga.dasawisma) {
                    alert('Nama Dasawisma wajib diisi');
                    return;
                  }
                  setStep(3);
                }} 
                className="flex-1 bg-emerald-850 hover:bg-emerald-900 text-white py-3 rounded-lg font-bold transition shadow"
              >
                Lanjutkan Langkah 2 &rarr;
              </button>
            </div>

          </div>
        )}

        {/* STEP 3: ANGGOTA KELUARGA (WARGA) */}
        {step === 3 && (
          <div className="p-8 space-y-6 text-xs">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-base font-extrabold text-gray-800 font-serif flex items-center">
                👥 LANGKAH 2: DATA ANGGOTA KELUARGA (INDIVIDU)
              </h3>
              <button 
                onClick={handleOpenAddWarga}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-850 font-bold px-3 py-1.5 rounded-lg border border-emerald-200 transition"
              >
                + Tambah Anggota Keluarga
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border space-y-3 font-semibold text-gray-650">
              <span className="block font-bold text-gray-400 text-[10px] uppercase">Daftar Anggota Keluarga Anda:</span>
              {wargaList.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg border shadow-sm flex justify-between items-center hover:border-emerald-600 transition">
                  <div>
                    <span className="block font-bold text-gray-900 text-sm">{item.nama || '(Nama belum diisi)'}</span>
                    <span className="text-[10px] text-gray-450 font-medium">
                      NIK: {item.nik} | Hubungan: {item.status_keluarga} | JK: {item.jenis_kelamin} | Umur: {calculateAge(item.tanggal_lahir)}
                    </span>
                  </div>
                  <div className="space-x-3">
                    <button onClick={() => handleOpenEditWarga(idx)} className="text-emerald-850 font-bold">Edit</button>
                    <button onClick={() => handleDeleteWarga(idx)} className="text-red-500 font-bold">Hapus</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Popup Modal Detail Form Editor Warga */}
            {editingWargaIdx !== null && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm">
                <div className="bg-white rounded-xl border shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="bg-emerald-900 text-white p-4 font-bold text-sm flex justify-between items-center">
                    <span>{editingWargaIdx === -1 ? 'Tambah Anggota Keluarga' : 'Edit Anggota Keluarga'}</span>
                    <button onClick={() => setEditingWargaIdx(null)} className="text-lg font-bold">&times;</button>
                  </div>
                  
                  <form onSubmit={handleSaveWarga} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs font-semibold text-gray-600">
                    
                    {/* 1. Biodata Pribadi */}
                    <div className="space-y-3">
                      <span className="block text-[10px] font-bold text-emerald-850 uppercase tracking-wider">1. Biodata Pribadi (Lampiran 19a)</span>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-405 uppercase mb-0.5">No Registrasi</label>
                          <input type="text" value={activeWargaForm.no_registrasi} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, no_registrasi: e.target.value })} className="w-full border rounded p-2" placeholder="Nomor Registrasi PKK" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-405 uppercase mb-0.5">NIK (KTP 16 digit)</label>
                          <input 
                            type="text" 
                            maxLength="16" 
                            value={activeWargaForm.nik} 
                            onChange={(e) => setActiveWargaForm({ ...activeWargaForm, nik: e.target.value.replace(/\D/g, '') })} 
                            className="w-full border rounded p-2" 
                            disabled={editingWargaIdx !== -1 && activeWargaForm.status_keluarga === 'Kepala Keluarga'} 
                            required 
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] font-bold text-gray-405 uppercase mb-0.5">Nama Lengkap</label>
                          <input type="text" value={activeWargaForm.nama} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, nama: e.target.value })} className="w-full border rounded p-2" required />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-405 uppercase mb-0.5">Jabatan di PKK</label>
                          <input type="text" value={activeWargaForm.jabatan_pkk} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, jabatan_pkk: e.target.value })} className="w-full border rounded p-2" placeholder="Ketua, Kader, Anggota, dll" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-405 uppercase mb-0.5">Jenis Kelamin</label>
                          <div className="flex items-center space-x-4 h-9">
                            <label className="flex items-center space-x-2">
                              <input type="radio" name="modal_jk" value="L" checked={activeWargaForm.jenis_kelamin === 'L'} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, jenis_kelamin: e.target.value })} />
                              <span>Laki-Laki</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="radio" name="modal_jk" value="P" checked={activeWargaForm.jenis_kelamin === 'P'} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, jenis_kelamin: e.target.value })} />
                              <span>Perempuan</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-405 uppercase mb-0.5">Tempat Lahir</label>
                          <input type="text" value={activeWargaForm.tempat_lahir} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, tempat_lahir: e.target.value })} className="w-full border rounded p-2" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-405 uppercase mb-0.5">Tanggal Lahir (Umur: {calculateAge(activeWargaForm.tanggal_lahir)})</label>
                          <input type="date" value={activeWargaForm.tanggal_lahir} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, tanggal_lahir: e.target.value })} className="w-full border rounded p-2" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-405 uppercase mb-0.5">Status Perkawinan</label>
                          <select value={activeWargaForm.status_perkawinan} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, status_perkawinan: e.target.value })} className="w-full border rounded p-2 bg-white">
                            <option value="Lajang">Lajang</option>
                            <option value="Menikah">Menikah</option>
                            <option value="Janda">Janda</option>
                            <option value="Duda">Duda</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-405 uppercase mb-0.5">Status Dalam Keluarga</label>
                          <select 
                            value={activeWargaForm.status_keluarga} 
                            onChange={(e) => setActiveWargaForm({ ...activeWargaForm, status_keluarga: e.target.value })} 
                            className="w-full border rounded p-2 bg-white"
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
                          <label className="block text-[10px] font-bold text-gray-405 uppercase mb-0.5">Agama</label>
                          <select value={activeWargaForm.agama} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, agama: e.target.value })} className="w-full border rounded p-2 bg-white">
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
                          <label className="block text-[10px] font-bold text-gray-405 uppercase mb-0.5">Pendidikan Terakhir</label>
                          <select value={activeWargaForm.pendidikan} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, pendidikan: e.target.value })} className="w-full border rounded p-2 bg-white">
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
                          <label className="block text-[10px] font-bold text-gray-405 uppercase mb-0.5">Pekerjaan</label>
                          <select value={activeWargaForm.pekerjaan} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, pekerjaan: e.target.value })} className="w-full border rounded p-2 bg-white">
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
                    <div className="space-y-3 border-t pt-4">
                      <span className="block text-[10px] font-bold text-emerald-850 uppercase tracking-wider">2. Kesehatan &amp; Koperasi</span>
                      <div className="grid grid-cols-2 gap-4">
                        
                        {/* KB */}
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Akseptor KB</label>
                          <div className="flex items-center space-x-4 mb-1">
                            <label className="flex items-center space-x-1.5">
                              <input type="radio" checked={activeWargaForm.akseptor_kb} onChange={() => setActiveWargaForm({ ...activeWargaForm, akseptor_kb: true })} />
                              <span>Ya</span>
                            </label>
                            <label className="flex items-center space-x-1.5">
                              <input type="radio" checked={!activeWargaForm.akseptor_kb} onChange={() => setActiveWargaForm({ ...activeWargaForm, akseptor_kb: false, jenis_kb: '' })} />
                              <span>Tidak</span>
                            </label>
                          </div>
                          {activeWargaForm.akseptor_kb && (
                            <input type="text" value={activeWargaForm.jenis_kb} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, jenis_kb: e.target.value })} placeholder="Jenis Kontrasepsi (Pil, Suntik, dll)" className="w-full border rounded p-1.5" required />
                          )}
                        </div>

                        {/* Posyandu */}
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Aktif Posyandu</label>
                          <div className="flex items-center space-x-4 mb-1">
                            <label className="flex items-center space-x-1.5">
                              <input type="radio" checked={activeWargaForm.aktif_posyandu} onChange={() => setActiveWargaForm({ ...activeWargaForm, aktif_posyandu: true })} />
                              <span>Ya</span>
                            </label>
                            <label className="flex items-center space-x-1.5">
                              <input type="radio" checked={!activeWargaForm.aktif_posyandu} onChange={() => setActiveWargaForm({ ...activeWargaForm, aktif_posyandu: false, frekuensi_posyandu: 0 })} />
                              <span>Tidak</span>
                            </label>
                          </div>
                          {activeWargaForm.aktif_posyandu && (
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] text-gray-400">Frekuensi:</span>
                              <input type="number" value={activeWargaForm.frekuensi_posyandu} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, frekuensi_posyandu: parseInt(e.target.value) || 0 })} className="w-20 border rounded p-1" />
                            </div>
                          )}
                        </div>

                        {/* Kelompok Belajar */}
                        <div className="col-span-2 border p-3 rounded-lg bg-gray-50/50">
                          <label className="block text-[10px] font-bold text-gray-450 uppercase mb-1.5">Mengikuti Kelompok Belajar</label>
                          <div className="flex items-center space-x-4 mb-2">
                            <label className="flex items-center space-x-1.5">
                              <input type="radio" checked={activeWargaForm.kelompok_belajar_aktif} onChange={() => setActiveWargaForm({ ...activeWargaForm, kelompok_belajar_aktif: true })} />
                              <span>Ya</span>
                            </label>
                            <label className="flex items-center space-x-1.5">
                              <input type="radio" checked={!activeWargaForm.kelompok_belajar_aktif} onChange={() => setActiveWargaForm({ ...activeWargaForm, kelompok_belajar_aktif: false, kelompok_belajar_list: [] })} />
                              <span>Tidak</span>
                            </label>
                          </div>
                          {activeWargaForm.kelompok_belajar_aktif && (
                            <div className="grid grid-cols-4 gap-2 border-t pt-2 mt-2">
                              {['Paket A', 'Paket B', 'Paket C', 'KF'].map(pkg => (
                                <label key={pkg} className="flex items-center space-x-1.5 select-none cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={activeWargaForm.kelompok_belajar_list.includes(pkg)}
                                    onChange={(e) => handleKBCheckbox(pkg, e.target.checked)}
                                  />
                                  <span>{pkg}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Koperasi */}
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Ikut Koperasi</label>
                          <div className="flex items-center space-x-4 mb-1">
                            <label className="flex items-center space-x-1.5">
                              <input type="radio" checked={activeWargaForm.ikut_koperasi} onChange={() => setActiveWargaForm({ ...activeWargaForm, ikut_koperasi: true })} />
                              <span>Ya</span>
                            </label>
                            <label className="flex items-center space-x-1.5">
                              <input type="radio" checked={!activeWargaForm.ikut_koperasi} onChange={() => setActiveWargaForm({ ...activeWargaForm, ikut_koperasi: false, jenis_koperasi: '' })} />
                              <span>Tidak</span>
                            </label>
                          </div>
                          {activeWargaForm.ikut_koperasi && (
                            <input type="text" value={activeWargaForm.jenis_koperasi} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, jenis_koperasi: e.target.value })} placeholder="Jenis Koperasi" className="w-full border rounded p-1.5" required />
                          )}
                        </div>

                        {/* Checkbox Lainnya */}
                        <div className="col-span-2 grid grid-cols-3 gap-3">
                          <label className="flex items-center space-x-2 bg-gray-50/50 p-2.5 rounded border select-none cursor-pointer">
                            <input type="checkbox" checked={activeWargaForm.bina_keluarga} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, bina_keluarga: e.target.checked })} />
                            <span>Ikut Bina Keluarga</span>
                          </label>
                          <label className="flex items-center space-x-2 bg-gray-50/50 p-2.5 rounded border select-none cursor-pointer">
                            <input type="checkbox" checked={activeWargaForm.memiliki_tabungan} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, memiliki_tabungan: e.target.checked })} />
                            <span>Memiliki Tabungan</span>
                          </label>
                          <label className="flex items-center space-x-2 bg-gray-50/50 p-2.5 rounded border select-none cursor-pointer">
                            <input type="checkbox" checked={activeWargaForm.paud} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, paud: e.target.checked })} />
                            <span>Mengikuti PAUD</span>
                          </label>
                          <label className="flex items-center space-x-2 bg-gray-50/50 p-2.5 rounded border select-none cursor-pointer">
                            <input type="checkbox" checked={activeWargaForm.berkebutuhan_khusus} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, berkebutuhan_khusus: e.target.checked })} />
                            <span>Berkebutuhan Khusus</span>
                          </label>
                        </div>

                      </div>
                    </div>

                    {/* 3. Aktivitas Sosial (Lampiran 19b) */}
                    <div className="space-y-3 border-t pt-4">
                      <span className="block text-[10px] font-bold text-emerald-850 uppercase tracking-wider">3. Aktivitas &amp; Partisipasi Sosial (Lampiran 19b)</span>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="flex items-center space-x-2 bg-gray-50 p-2.5 border rounded cursor-pointer select-none">
                          <input type="checkbox" checked={activeWargaForm.penghayatan_pancasila} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, penghayatan_pancasila: e.target.checked })} />
                          <span>Penghayatan Pancasila</span>
                        </label>
                        <label className="flex items-center space-x-2 bg-gray-50 p-2.5 border rounded cursor-pointer select-none">
                          <input type="checkbox" checked={activeWargaForm.kerja_bakti} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, kerja_bakti: e.target.checked })} />
                          <span>Kerja Bakti</span>
                        </label>
                        <label className="flex items-center space-x-2 bg-gray-50 p-2.5 border rounded cursor-pointer select-none">
                          <input type="checkbox" checked={activeWargaForm.rukun_kematian} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, rukun_kematian: e.target.checked })} />
                          <span>Rukun Kematian</span>
                        </label>
                        <label className="flex items-center space-x-2 bg-gray-50 p-2.5 border rounded cursor-pointer select-none">
                          <input type="checkbox" checked={activeWargaForm.kegiatan_keagamaan} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, kegiatan_keagamaan: e.target.checked })} />
                          <span>Kegiatan Keagamaan</span>
                        </label>
                        <label className="flex items-center space-x-2 bg-gray-50 p-2.5 border rounded cursor-pointer select-none">
                          <input type="checkbox" checked={activeWargaForm.jimpitan} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, jimpitan: e.target.checked })} />
                          <span>Membayar Jimpitan</span>
                        </label>
                        <label className="flex items-center space-x-2 bg-gray-50 p-2.5 border rounded cursor-pointer select-none">
                          <input type="checkbox" checked={activeWargaForm.arisan} onChange={(e) => setActiveWargaForm({ ...activeWargaForm, arisan: e.target.checked })} />
                          <span>Mengikuti Arisan</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-4 border-t mt-4">
                      <button type="button" onClick={() => setEditingWargaIdx(null)} className="flex-1 border text-gray-500 font-bold py-2 rounded">Batal</button>
                      <button type="submit" className="flex-1 bg-emerald-800 hover:bg-emerald-950 text-white font-bold py-2 rounded shadow">Simpan</button>
                    </div>

                  </form>
                </div>
              </div>
            )}

            <div className="flex space-x-3 pt-6 border-t mt-6">
              <button 
                type="button" 
                onClick={() => setStep(2)} 
                className="flex-1 border text-gray-500 py-3 rounded-lg font-bold hover:bg-gray-50"
              >
                Kembali
              </button>
              <button 
                type="button" 
                onClick={() => {
                  if (wargaList.length === 0) {
                    alert('Silakan masukkan minimal 1 anggota keluarga.');
                    return;
                  }
                  setStep(4);
                }} 
                className="flex-1 bg-emerald-850 hover:bg-emerald-900 text-white py-3 rounded-lg font-bold transition shadow"
              >
                Lanjutkan Langkah 3 &rarr;
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PEKARANGAN & INDUSTRI DINAMIS */}
        {step === 4 && (
          <div className="p-8 space-y-8 text-xs">
            
            {/* Lahan Pekarangan */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-sm font-extrabold text-gray-800 font-serif flex items-center">
                  🌱 Tabel Pemanfaatan Tanah Pekarangan Keluarga
                </h3>
                <button 
                  onClick={handleAddPekarangan}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-850 font-bold px-3 py-1.5 rounded border border-emerald-250 transition"
                >
                  + Tambah Baris
                </button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse font-semibold text-gray-650">
                  <thead>
                    <tr className="bg-gray-50 border-b text-[10px] text-gray-400 font-bold uppercase">
                      <th className="p-3">Kategori</th>
                      <th className="p-3">Jenis Komoditi</th>
                      <th className="p-3 w-32">Jumlah</th>
                      <th className="p-3 text-center w-24">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pekaranganList.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/30">
                        <td className="p-2">
                          <select 
                            value={item.kategori} 
                            onChange={(e) => handlePekaranganChange(idx, 'kategori', e.target.value)}
                            className="w-full border rounded p-2 bg-white"
                          >
                            <option value="Peternakan">Peternakan</option>
                            <option value="Perikanan">Perikanan</option>
                            <option value="Warung Hidup">Warung Hidup</option>
                            <option value="TOGA">TOGA (Tanaman Obat)</option>
                            <option value="Tanaman Keras">Tanaman Keras</option>
                            <option value="Lainnya">Lainnya</option>
                          </select>
                        </td>
                        <td className="p-2">
                          <input 
                            type="text" 
                            value={item.komoditi} 
                            onChange={(e) => handlePekaranganChange(idx, 'komoditi', e.target.value)}
                            className="w-full border rounded p-2" 
                            placeholder="Misal: Ayam, Cabe, Jahe, Mangga"
                            required 
                          />
                        </td>
                        <td className="p-2">
                          <input 
                            type="number" 
                            value={item.jumlah} 
                            onChange={(e) => handlePekaranganChange(idx, 'jumlah', parseInt(e.target.value) || 0)}
                            className="w-full border rounded p-2" 
                          />
                        </td>
                        <td className="p-2 text-center">
                          <button 
                            type="button" 
                            onClick={() => handleDeletePekarangan(idx)}
                            className="text-red-500 font-bold hover:underline"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                    {pekaranganList.length === 0 && (
                      <tr>
                        <td colSpan="4" className="p-6 text-center text-gray-400 font-medium">Tidak ada data pemanfaatan pekarangan (kosong)</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Industri UP2K */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-sm font-extrabold text-gray-800 font-serif flex items-center">
                  💼 Tabel Industri Rumah Tangga
                </h3>
                <button 
                  onClick={handleAddIndustri}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-850 font-bold px-3 py-1.5 rounded border border-emerald-250 transition"
                >
                  + Tambah Baris
                </button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse font-semibold text-gray-650">
                  <thead>
                    <tr className="bg-gray-50 border-b text-[10px] text-gray-400 font-bold uppercase">
                      <th className="p-3">Kategori</th>
                      <th className="p-3">Nama Komoditi / Produk</th>
                      <th className="p-3 w-32">Karyawan / Anggota</th>
                      <th className="p-3 text-center w-24">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {industriList.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/30">
                        <td className="p-2">
                          <select 
                            value={item.kategori} 
                            onChange={(e) => handleIndustriChange(idx, 'kategori', e.target.value)}
                            className="w-full border rounded p-2 bg-white"
                          >
                            <option value="Pangan">Pangan</option>
                            <option value="Sandang">Sandang</option>
                            <option value="Konveksi">Konveksi</option>
                            <option value="Jasa">Jasa</option>
                            <option value="Lain-lain">Lain-lain</option>
                          </select>
                        </td>
                        <td className="p-2">
                          <input 
                            type="text" 
                            value={item.komoditi} 
                            onChange={(e) => handleIndustriChange(idx, 'komoditi', e.target.value)}
                            className="w-full border rounded p-2" 
                            placeholder="Misal: Kerupuk Kulit, Sulam Bayang"
                            required 
                          />
                        </td>
                        <td className="p-2">
                          <input 
                            type="number" 
                            value={item.jumlah} 
                            onChange={(e) => handleIndustriChange(idx, 'jumlah', parseInt(e.target.value) || 0)}
                            className="w-full border rounded p-2" 
                          />
                        </td>
                        <td className="p-2 text-center">
                          <button 
                            type="button" 
                            onClick={() => handleDeleteIndustri(idx)}
                            className="text-red-500 font-bold hover:underline"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                    {industriList.length === 0 && (
                      <tr>
                        <td colSpan="4" className="p-6 text-center text-gray-400 font-medium">Tidak ada data industri keluarga (kosong)</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex space-x-3 pt-6 border-t mt-6">
              <button 
                type="button" 
                onClick={() => setStep(3)} 
                className="flex-1 border text-gray-500 py-3 rounded-lg font-bold hover:bg-gray-50"
              >
                Kembali
              </button>
              <button 
                type="button" 
                onClick={handleSubmitAll}
                disabled={loading}
                className="flex-1 bg-emerald-850 hover:bg-emerald-900 text-white py-3 rounded-lg font-bold transition shadow"
              >
                {loading ? 'Mengirim Data...' : 'Kirim Berkas Portal'}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default PortalWargaView;
