import React, { useState } from 'react';

function PokjaAdmin({
  dataPokja1, setDataPokja1,
  dataPokja2, setDataPokja2,
  dataPokja3, setDataPokja3,
  dataPokja4, setDataPokja4,
  dataPosyandu, setDataPosyandu,
  API_URL
}) {
  const [activePokjaTab, setActivePokjaTab] = useState('Pokja I');
  const [activePokja4SubTab, setActivePokja4SubTab] = useState('Data Umum');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('edit_pokja'); // edit_pokja, add_pokja_jorong, add_posyandu, edit_posyandu
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({});

  // Helper function to sum numeric values
  const sumData = (arr, key) => {
    return arr.reduce((acc, item) => acc + (parseInt(item[key]) || 0), 0);
  };

  const handleOpenEditPokja = (item) => {
    setModalType('edit_pokja');
    setEditId(item.jorong || item.nama_jorong);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleOpenAddPokjaJorong = () => {
    setModalType('add_pokja_jorong');
    setFormData({ jorong: '' });
    setIsModalOpen(true);
  };

  const handleDeletePokja = async (pokjaId, recordId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data rekapitulasi jorong ini?")) return;
    try {
      const res = await fetch(`${API_URL}/pokja/${pokjaId}/${recordId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        if (pokjaId === 1) setDataPokja1(dataPokja1.filter(item => item.id !== recordId));
        else if (pokjaId === 2) setDataPokja2(dataPokja2.filter(item => item.id !== recordId));
        else if (pokjaId === 3) setDataPokja3(dataPokja3.filter(item => item.id !== recordId));
        else if (pokjaId === 4) setDataPokja4(dataPokja4.filter(item => item.id !== recordId));
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleOpenAddPosyandu = () => {
    setModalType('add_posyandu');
    setEditId(null);
    setFormData({
      jorong: 'Suayan Tinggi', posyandu: '', pengunjung: 0, petugas: 0,
      bayi_lahir: 0, meninggal: 0, s: 0, k: 0, d: 0, n: 0,
      bcg: 0, dpt: 0, polio: 0, campak: 0, hepb: 0,
      balita_0_12_l_baru: 0, balita_0_12_l_lama: 0, balita_0_12_p_baru: 0, balita_0_12_p_lama: 0,
      balita_1_5_l_baru: 0, balita_1_5_l_lama: 0, balita_1_5_p_baru: 0, balita_1_5_p_lama: 0,
      wus_hadir: 0, pus_hadir: 0, bumil_hadir: 0, busui_hadir: 0,
      petugas_kader_l: 0, petugas_kader_p: 0, petugas_plkb_l: 0, petugas_plkb_p: 0, petugas_medis_l: 0, petugas_medis_p: 0,
      bayi_lahir_l: 0, bayi_lahir_p: 0, bayi_meninggal_l: 0, bayi_meninggal_p: 0, balita_meninggal: 0,
      vit_a: 0, pmt: 0, bumil_tt: 0, dpt_1: 0, dpt_2: 0, dpt_3: 0,
      polio_1: 0, polio_2: 0, polio_3: 0, polio_4: 0, diare_oralit: 0
    });
    setIsModalOpen(true);
  };

  const handleOpenEditPosyandu = (item) => {
    setModalType('edit_posyandu');
    setEditId(item.id);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleDeletePosyandu = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data posyandu ini?")) return;
    try {
      const res = await fetch(`${API_URL}/posyandu/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDataPosyandu(dataPosyandu.filter(item => item.id !== id));
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const pokjaId = activePokjaTab === 'Pokja I' ? 1 : activePokjaTab === 'Pokja II' ? 2 : activePokjaTab === 'Pokja III' ? 3 : 4;

    if (modalType === 'add_pokja_jorong') {
      try {
        const res = await fetch(`${API_URL}/pokja/${pokjaId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jorong: formData.jorong })
        });
        if (res.ok) {
          const newRecord = await res.json();
          const mappedRecord = {
            ...newRecord,
            jorong: formData.jorong,
            nama_jorong: formData.jorong
          };

          if (pokjaId === 1) setDataPokja1([...dataPokja1, mappedRecord]);
          else if (pokjaId === 2) setDataPokja2([...dataPokja2, mappedRecord]);
          else if (pokjaId === 3) setDataPokja3([...dataPokja3, mappedRecord]);
          else if (pokjaId === 4) setDataPokja4([...dataPokja4, mappedRecord]);

          setIsModalOpen(false);
          handleOpenEditPokja(mappedRecord);
          return;
        } else {
          const errData = await res.json();
          alert(errData.message || "Gagal menambahkan jorong baru");
        }
      } catch (err) {
        console.warn(err);
      }
      setIsModalOpen(false);
    } else if (modalType === 'edit_pokja') {
      const url = `${API_URL}/pokja/${pokjaId}/${editId}`;
      try {
        const res = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          updatePokjaStateLocal();
        } else {
          updatePokjaStateLocal();
        }
      } catch (err) {
        console.warn(err);
        updatePokjaStateLocal();
      }
      setIsModalOpen(false);
    } else {
      // Posyandu save
      const url = modalType === 'add_posyandu' ? `${API_URL}/posyandu` : `${API_URL}/posyandu/${editId}`;
      const method = modalType === 'add_posyandu' ? 'POST' : 'PUT';

      try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          if (modalType === 'add_posyandu') {
            const saved = await res.json();
            setDataPosyandu([...dataPosyandu, saved]);
          } else {
            setDataPosyandu(dataPosyandu.map(item => item.id === editId ? { ...item, ...formData } : item));
          }
        }
      } catch (err) {
        console.warn(err);
      }
      setIsModalOpen(false);
    }
  };

  const updatePokjaStateLocal = () => {
    if (activePokjaTab === 'Pokja I') {
      setDataPokja1(dataPokja1.map(item => (item.jorong === editId || item.nama_jorong === editId) ? { ...item, ...formData } : item));
    } else if (activePokjaTab === 'Pokja II') {
      setDataPokja2(dataPokja2.map(item => (item.jorong === editId || item.nama_jorong === editId) ? { ...item, ...formData } : item));
    } else if (activePokjaTab === 'Pokja III') {
      setDataPokja3(dataPokja3.map(item => (item.jorong === editId || item.nama_jorong === editId) ? { ...item, ...formData } : item));
    } else if (activePokjaTab === 'Pokja IV') {
      setDataPokja4(dataPokja4.map(item => (item.jorong === editId || item.nama_jorong === editId) ? { ...item, ...formData } : item));
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Panel Card */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-lg font-black font-serif text-gray-900">Data Pokja I - IV</h3>
          <p className="text-[11px] text-gray-500 font-medium">Rekapitulasi instrumen per jorong dan kegiatan posyandu berkala</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Tambah Data Button */}
          <button
            onClick={handleOpenAddPokjaJorong}
            className="bg-[#005941] hover:bg-[#004230] text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-1.5"
          >
            <span>+ Tambah Rekap Jorong ({activePokjaTab})</span>
          </button>
          
          <div className="flex flex-wrap gap-1 bg-gray-100 p-1.5 rounded-xl border border-gray-200 text-xs font-bold select-none">
            {['Pokja I', 'Pokja II', 'Pokja III', 'Pokja IV'].map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setActivePokjaTab(tab);
                  setActivePokja4SubTab('Data Umum');
                }}
                className={`px-3 py-1.5 rounded-lg transition ${activePokjaTab === tab ? 'bg-[#005941] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {tab === 'Pokja IV' ? 'Pokja IV & Kesehatan' : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- TAB POKJA I --- */}
      {activePokjaTab === 'Pokja I' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-[#005941] text-white text-[10px] font-bold uppercase tracking-wider text-center">
                    <th rowSpan={3} className="p-3 border border-emerald-900 text-left w-12">NO</th>
                    <th rowSpan={3} className="p-3 border border-emerald-900 text-left min-w-[120px]">NAMA JORONG</th>
                    <th colSpan={4} className="p-2 border border-emerald-900">JUMLAH KADER</th>
                    <th colSpan={6} className="p-2 border border-emerald-900">PENGHAYATAN DAN PENGALAMAN PANCASILA</th>
                    <th colSpan={5} className="p-2 border border-emerald-900">GOTONG ROYONG</th>
                    <th rowSpan={3} className="p-3 border border-emerald-900">KETERANGAN</th>
                    <th rowSpan={3} className="p-3 border border-emerald-900 text-left w-24">AKSI</th>
                  </tr>
                  <tr className="bg-[#004e38] text-white text-[9px] font-bold text-center">
                    <th rowSpan={2} className="p-2 border border-emerald-950">PKBN</th>
                    <th rowSpan={2} className="p-2 border border-emerald-950">PKDRT</th>
                    <th rowSpan={2} className="p-2 border border-emerald-950">POLA ASUH</th>
                    <th rowSpan={2} className="p-2 border border-emerald-950">LANSIA</th>
                    <th colSpan={2} className="p-2 border border-emerald-950">SIMULASI PKBN</th>
                    <th colSpan={2} className="p-2 border border-emerald-950">SIMULASI PKDRT</th>
                    <th colSpan={2} className="p-2 border border-emerald-950">SIMULASI POLA ASUH</th>
                    <th rowSpan={2} className="p-2 border border-emerald-950">KERJA BAKTI<br/>(JML ANGGOTA)</th>
                    <th rowSpan={2} className="p-2 border border-emerald-950">RUKUN KEMATIAN<br/>(JML KELOMPOK)</th>
                    <th rowSpan={2} className="p-2 border border-emerald-950">KEAGAMAAN<br/>(JML ANGGOTA)</th>
                    <th rowSpan={2} className="p-2 border border-emerald-950">JIMPITAN</th>
                    <th rowSpan={2} className="p-2 border border-emerald-950">ARISAN</th>
                  </tr>
                  <tr className="bg-[#004230] text-white text-[8px] font-bold text-center">
                    <th className="p-1 border border-emerald-950">JML KEL</th>
                    <th className="p-1 border border-emerald-950">JML ANGG</th>
                    <th className="p-1 border border-emerald-950">JML KEL</th>
                    <th className="p-1 border border-emerald-950">JML ANGG</th>
                    <th className="p-1 border border-emerald-950">JML KEL</th>
                    <th className="p-1 border border-emerald-950">JML ANGG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 font-medium text-center text-gray-700 bg-white">
                  {dataPokja1.length === 0 ? (
                    <tr>
                      <td colSpan={19} className="p-8 text-center text-gray-400 font-bold italic bg-gray-50">Belum ada data jorong. Silakan klik "+ Tambah Rekap Jorong".</td>
                    </tr>
                  ) : (
                    <>
                      {dataPokja1.map((item, idx) => (
                        <tr key={item.id || idx} className="hover:bg-emerald-50/20 odd:bg-white even:bg-gray-50/50 transition">
                          <td className="p-3 border text-left font-bold text-gray-400">{idx + 1}</td>
                          <td className="p-3 border text-left font-bold text-gray-900 bg-gray-50/30">{item.jorong || item.nama_jorong}</td>
                          <td className="p-3 border">{item.kader_pkbn || 0}</td>
                          <td className="p-3 border">{item.kader_pkdrt || 0}</td>
                          <td className="p-3 border">{item.kader_pola_asuh || 0}</td>
                          <td className="p-3 border">{item.kader_lansia || 0}</td>
                          <td className="p-3 border text-gray-600">{item.simulasi_pkbn_jml_kelompok || 0}</td>
                          <td className="p-3 border text-gray-600">{item.simulasi_pkbn_jml_anggota || 0}</td>
                          <td className="p-3 border text-gray-600">{item.simulasi_pkdrt_jml_kelompok || 0}</td>
                          <td className="p-3 border text-gray-600">{item.simulasi_pkdrt_jml_anggota || 0}</td>
                          <td className="p-3 border text-gray-600">{item.simulasi_pola_asuh_jml_kelompok || 0}</td>
                          <td className="p-3 border text-gray-600">{item.simulasi_pola_asuh_jml_anggota || 0}</td>
                          <td className="p-3 border font-bold text-emerald-800 bg-emerald-50/10">{item.gotong_royong_kerja_bakti_jml_anggota || 0}</td>
                          <td className="p-3 border">{item.gotong_royong_rukun_kematian_jml_kelompok || 0}</td>
                          <td className="p-3 border">{item.gotong_royong_keagamaan_jml_anggota || 0}</td>
                          <td className="p-3 border">{item.gotong_royong_jimpitan || 0}</td>
                          <td className="p-3 border">{item.gotong_royong_arisan || 0}</td>
                          <td className="p-3 border text-gray-400 text-[10px] max-w-xs truncate">{item.keterangan || '-'}</td>
                          <td className="p-3 border text-left flex items-center gap-3">
                            <button onClick={() => handleOpenEditPokja(item)} className="text-[#005941] hover:underline font-bold">Edit</button>
                            <button onClick={() => handleDeletePokja(1, item.id)} className="text-red-500 hover:underline font-bold">Hapus</button>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-emerald-50/60 font-bold border-t-2 border-emerald-800 text-center text-gray-900">
                        <td colSpan={2} className="p-3 border text-left">JUMLAH (TOTAL)</td>
                        <td className="p-3 border">{sumData(dataPokja1, 'kader_pkbn')}</td>
                        <td className="p-3 border">{sumData(dataPokja1, 'kader_pkdrt')}</td>
                        <td className="p-3 border">{sumData(dataPokja1, 'kader_pola_asuh')}</td>
                        <td className="p-3 border">{sumData(dataPokja1, 'kader_lansia')}</td>
                        <td className="p-3 border">{sumData(dataPokja1, 'simulasi_pkbn_jml_kelompok')}</td>
                        <td className="p-3 border">{sumData(dataPokja1, 'simulasi_pkbn_jml_anggota')}</td>
                        <td className="p-3 border">{sumData(dataPokja1, 'simulasi_pkdrt_jml_kelompok')}</td>
                        <td className="p-3 border">{sumData(dataPokja1, 'simulasi_pkdrt_jml_anggota')}</td>
                        <td className="p-3 border">{sumData(dataPokja1, 'simulasi_pola_asuh_jml_kelompok')}</td>
                        <td className="p-3 border">{sumData(dataPokja1, 'simulasi_pola_asuh_jml_anggota')}</td>
                        <td className="p-3 border font-extrabold text-emerald-900 bg-emerald-100/50">{sumData(dataPokja1, 'gotong_royong_kerja_bakti_jml_anggota')}</td>
                        <td className="p-3 border">{sumData(dataPokja1, 'gotong_royong_rukun_kematian_jml_kelompok')}</td>
                        <td className="p-3 border">{sumData(dataPokja1, 'gotong_royong_keagamaan_jml_anggota')}</td>
                        <td className="p-3 border">{sumData(dataPokja1, 'gotong_royong_jimpitan')}</td>
                        <td className="p-3 border">{sumData(dataPokja1, 'gotong_royong_arisan')}</td>
                        <td colSpan={2} className="p-3 border bg-gray-50"></td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB POKJA II --- */}
      {activePokjaTab === 'Pokja II' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-[#005941] text-white text-[10px] font-bold uppercase tracking-wider text-center">
                    <th rowSpan={3} className="p-3 border border-emerald-900 text-left w-12">NO</th>
                    <th rowSpan={3} className="p-3 border border-emerald-900 text-left min-w-[120px]">NAMA JORONG</th>
                    <th colSpan={11} className="p-2 border border-emerald-900">PENDIDIKAN KETERAMPILAN</th>
                    <th colSpan={10} className="p-2 border border-emerald-900">PENGEMBANGAN KEHIDUPAN BERKOPERASI / UP2K PKK</th>
                    <th colSpan={4} className="p-2 border border-emerald-900">KOPERASI</th>
                    <th rowSpan={3} className="p-3 border border-emerald-900">KETERANGAN &amp; AKSI</th>
                  </tr>
                  <tr className="bg-[#004e38] text-white text-[9px] font-bold text-center">
                    <th colSpan={2} className="p-2 border border-emerald-950">KLP. BELAJAR PAKET A</th>
                    <th colSpan={2} className="p-2 border border-emerald-950">KLP. BELAJAR PAKET B</th>
                    <th colSpan={2} className="p-2 border border-emerald-950">KLP. BELAJAR PAKET C</th>
                    <th rowSpan={2} className="p-2 border border-emerald-950">TAMAN BACAAN /<br/>KLP PEMBACA</th>
                    <th rowSpan={2} className="p-2 border border-emerald-950">RUMAH DILAN</th>
                    <th rowSpan={2} className="p-2 border border-emerald-950">KAMPUNG MANDIRI</th>
                    <th colSpan={2} className="p-2 border border-emerald-950">KADER KHUSUS</th>
                    <th colSpan={2} className="p-2 border border-emerald-950">PEMULA</th>
                    <th colSpan={2} className="p-2 border border-emerald-950">MADYA</th>
                    <th colSpan={2} className="p-2 border border-emerald-950">UTAMA</th>
                    <th colSpan={2} className="p-2 border border-emerald-950">MANDIRI</th>
                    <th rowSpan={2} className="p-2 border border-emerald-950">USAHA MIKRO</th>
                    <th rowSpan={2} className="p-2 border border-emerald-950">TOKO PKK</th>
                    <th colSpan={2} className="p-2 border border-emerald-950">PRA KOPERASI /<br/>BELUM BERBADAN HUKUM</th>
                    <th colSpan={2} className="p-2 border border-emerald-950">BERBADAN HUKUM</th>
                  </tr>
                  <tr className="bg-[#004230] text-white text-[8px] font-bold text-center">
                    <th className="p-1 border border-emerald-950">JML KLP</th>
                    <th className="p-1 border border-emerald-950">WRG BELAJAR</th>
                    <th className="p-1 border border-emerald-950">JML KLP</th>
                    <th className="p-1 border border-emerald-950">WRG BELAJAR</th>
                    <th className="p-1 border border-emerald-950">JML KLP</th>
                    <th className="p-1 border border-emerald-950">WRG BELAJAR</th>
                    <th className="p-1 border border-emerald-950">KETERAMPILAN</th>
                    <th className="p-1 border border-emerald-950">KOPERASI</th>
                    <th className="p-1 border border-emerald-950">KELP</th>
                    <th className="p-1 border border-emerald-950">PSRT</th>
                    <th className="p-1 border border-emerald-950">KELP</th>
                    <th className="p-1 border border-emerald-950">PSRT</th>
                    <th className="p-1 border border-emerald-950">KELP</th>
                    <th className="p-1 border border-emerald-950">PSRT</th>
                    <th className="p-1 border border-emerald-950">KELP</th>
                    <th className="p-1 border border-emerald-950">PSRT</th>
                    <th className="p-1 border border-emerald-950">JML KOP</th>
                    <th className="p-1 border border-emerald-950">ANGGOTA</th>
                    <th className="p-1 border border-emerald-950">JML KOP</th>
                    <th className="p-1 border border-emerald-950">ANGGOTA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 font-medium text-center text-gray-700 bg-white">
                  {dataPokja2.length === 0 ? (
                    <tr>
                      <td colSpan={28} className="p-8 text-center text-gray-400 font-bold italic bg-gray-50">Belum ada data jorong. Silakan klik "+ Tambah Rekap Jorong".</td>
                    </tr>
                  ) : (
                    <>
                      {dataPokja2.map((item, idx) => (
                        <tr key={item.id || idx} className="hover:bg-emerald-50/20 odd:bg-white even:bg-gray-50/50 transition">
                          <td className="p-3 border text-left font-bold text-gray-400">{idx + 1}</td>
                          <td className="p-3 border text-left font-bold text-gray-900 bg-gray-50/30">{item.jorong || item.nama_jorong}</td>
                          <td className="p-3 border">{item.paket_a_kelompok || 0}</td>
                          <td className="p-3 border">{item.paket_a_warga_belajar || 0}</td>
                          <td className="p-3 border">{item.paket_b_kelompok || 0}</td>
                          <td className="p-3 border">{item.paket_b_warga_belajar || 0}</td>
                          <td className="p-3 border">{item.paket_c_kelompok || 0}</td>
                          <td className="p-3 border">{item.paket_c_warga_belajar || 0}</td>
                          <td className="p-3 border text-emerald-800 font-bold">{item.taman_bacaan_perpustakaan_kelompok_pembaca || 0}</td>
                          <td className="p-3 border">{item.rumah_dilan || 0}</td>
                          <td className="p-3 border">{item.kampung_mandiri || 0}</td>
                          <td className="p-3 border">{item.kader_khusus_keterampilan || 0}</td>
                          <td className="p-3 border">{item.kader_khusus_koperasi || 0}</td>
                          <td className="p-3 border text-gray-600">{item.up2k_pemula_kelompok || 0}</td>
                          <td className="p-3 border text-gray-600">{item.up2k_pemula_peserta || 0}</td>
                          <td className="p-3 border text-gray-600">{item.up2k_madya_kelompok || 0}</td>
                          <td className="p-3 border text-gray-600">{item.up2k_madya_peserta || 0}</td>
                          <td className="p-3 border text-gray-600">{item.up2k_utama_kelompok || 0}</td>
                          <td className="p-3 border text-gray-600">{item.up2k_utama_peserta || 0}</td>
                          <td className="p-3 border text-gray-600">{item.up2k_mandiri_kelompok || 0}</td>
                          <td className="p-3 border text-gray-600">{item.up2k_mandiri_peserta || 0}</td>
                          <td className="p-3 border">{item.usaha_mikro || 0}</td>
                          <td className="p-3 border">{item.toko_pkk || 0}</td>
                          <td className="p-3 border text-gray-600">{item.pra_koperasi_jumlah || 0}</td>
                          <td className="p-3 border text-gray-600">{item.pra_koperasi_anggota || 0}</td>
                          <td className="p-3 border text-gray-600">{item.koperasi_berbadan_hukum_jumlah || 0}</td>
                          <td className="p-3 border text-gray-600">{item.koperasi_berbadan_hukum_anggota || 0}</td>
                          <td className="p-3 border text-left">
                            <div className="flex gap-2">
                              <button onClick={() => handleOpenEditPokja(item)} className="text-[#005941] hover:underline font-bold">Edit</button>
                              <button onClick={() => handleDeletePokja(2, item.id)} className="text-red-500 hover:underline font-bold">Hapus</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-emerald-50/60 font-bold border-t-2 border-emerald-800 text-center text-gray-900">
                        <td colSpan={2} className="p-3 border text-left">JUMLAH (TOTAL)</td>
                        <td className="p-3 border">{sumData(dataPokja2, 'paket_a_kelompok')}</td>
                        <td className="p-3 border">{sumData(dataPokja2, 'paket_a_warga_belajar')}</td>
                        <td className="p-3 border">{sumData(dataPokja2, 'paket_b_kelompok')}</td>
                        <td className="p-3 border">{sumData(dataPokja2, 'paket_b_warga_belajar')}</td>
                        <td className="p-3 border">{sumData(dataPokja2, 'paket_c_kelompok')}</td>
                        <td className="p-3 border">{sumData(dataPokja2, 'paket_c_warga_belajar')}</td>
                        <td className="p-3 border font-extrabold text-emerald-900 bg-emerald-100/50">{sumData(dataPokja2, 'taman_bacaan_perpustakaan_kelompok_pembaca')}</td>
                        <td className="p-3 border">{sumData(dataPokja2, 'rumah_dilan')}</td>
                        <td className="p-3 border">{sumData(dataPokja2, 'kampung_mandiri')}</td>
                        <td className="p-3 border">{sumData(dataPokja2, 'kader_khusus_keterampilan')}</td>
                        <td className="p-3 border">{sumData(dataPokja2, 'kader_khusus_koperasi')}</td>
                        <td className="p-3 border">{sumData(dataPokja2, 'up2k_pemula_kelompok')}</td>
                        <td className="p-3 border">{sumData(dataPokja2, 'up2k_pemula_peserta')}</td>
                        <td className="p-3 border">{sumData(dataPokja2, 'up2k_madya_kelompok')}</td>
                        <td className="p-3 border">{sumData(dataPokja2, 'up2k_madya_peserta')}</td>
                        <td className="p-3 border">{sumData(dataPokja2, 'up2k_utama_kelompok')}</td>
                        <td className="p-3 border">{sumData(dataPokja2, 'up2k_utama_peserta')}</td>
                        <td className="p-3 border">{sumData(dataPokja2, 'up2k_mandiri_kelompok')}</td>
                        <td className="p-3 border">{sumData(dataPokja2, 'up2k_mandiri_peserta')}</td>
                        <td className="p-3 border">{sumData(dataPokja2, 'usaha_mikro')}</td>
                        <td className="p-3 border">{sumData(dataPokja2, 'toko_pkk')}</td>
                        <td className="p-3 border">{sumData(dataPokja2, 'pra_koperasi_jumlah')}</td>
                        <td className="p-3 border">{sumData(dataPokja2, 'pra_koperasi_anggota')}</td>
                        <td className="p-3 border">{sumData(dataPokja2, 'koperasi_berbadan_hukum_jumlah')}</td>
                        <td className="p-3 border">{sumData(dataPokja2, 'koperasi_berbadan_hukum_anggota')}</td>
                        <td className="p-3 border bg-gray-50"></td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB POKJA III --- */}
      {activePokjaTab === 'Pokja III' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-[#005941] text-white text-[10px] font-bold uppercase tracking-wider text-center">
                    <th rowSpan={2} className="p-3 border border-emerald-900 text-left w-12">NO</th>
                    <th rowSpan={2} className="p-3 border border-emerald-900 text-left min-w-[120px]">NAMA JORONG</th>
                    <th colSpan={3} className="p-2 border border-emerald-900">JUMLAH KADER</th>
                    <th colSpan={2} className="p-2 border border-emerald-900">PANGAN (MAKANAN POKOK)</th>
                    <th colSpan={6} className="p-2 border border-emerald-900">PEMANFAATAN PEKARANGAN / HATINYA PKK</th>
                    <th colSpan={3} className="p-2 border border-emerald-900">JUMLAH INDUSTRI RUMAH TANGGA</th>
                    <th colSpan={2} className="p-2 border border-emerald-900">RUMAH</th>
                    <th rowSpan={2} className="p-3 border border-emerald-900">KETERANGAN</th>
                    <th rowSpan={2} className="p-3 border border-emerald-900 text-left w-24">AKSI</th>
                  </tr>
                  <tr className="bg-[#004e38] text-white text-[9px] font-bold text-center">
                    <th className="p-2 border border-emerald-950">PANGAN</th>
                    <th className="p-2 border border-emerald-950">SANDANG</th>
                    <th className="p-2 border border-emerald-950">TATA LAKSANA RT</th>
                    <th className="p-2 border border-emerald-950">BERAS</th>
                    <th className="p-2 border border-emerald-950">NON BERAS</th>
                    <th className="p-2 border border-emerald-950">PETERNAKAN</th>
                    <th className="p-2 border border-emerald-950">PERIKANAN</th>
                    <th className="p-2 border border-emerald-950">WARUNG HIDUP</th>
                    <th className="p-2 border border-emerald-950">LUMBUNG HIDUP</th>
                    <th className="p-2 border border-emerald-950">TOGA</th>
                    <th className="p-2 border border-emerald-950">TANAMAN KERAS</th>
                    <th className="p-2 border border-emerald-950">SANDANG</th>
                    <th className="p-2 border border-emerald-950">PANGAN</th>
                    <th className="p-2 border border-emerald-950">JASA</th>
                    <th className="p-2 border border-emerald-950 text-emerald-300">SEHAT</th>
                    <th className="p-2 border border-emerald-950 text-red-300">KURANG SEHAT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 font-medium text-center text-gray-700 bg-white">
                  {dataPokja3.length === 0 ? (
                    <tr>
                      <td colSpan={20} className="p-8 text-center text-gray-400 font-bold italic bg-gray-50">Belum ada data jorong. Silakan klik "+ Tambah Rekap Jorong".</td>
                    </tr>
                  ) : (
                    <>
                      {dataPokja3.map((item, idx) => (
                        <tr key={item.id || idx} className="hover:bg-emerald-50/20 odd:bg-white even:bg-gray-50/50 transition">
                          <td className="p-3 border text-left font-bold text-gray-400">{idx + 1}</td>
                          <td className="p-3 border text-left font-bold text-gray-900 bg-gray-50/30">{item.jorong || item.nama_jorong}</td>
                          <td className="p-3 border">{item.kader_pangan || 0}</td>
                          <td className="p-3 border">{item.kader_sandang || 0}</td>
                          <td className="p-3 border">{item.kader_tata_laksana_rt || 0}</td>
                          <td className="p-3 border">{item.makanan_pokok_beras || 0}</td>
                          <td className="p-3 border">{item.makanan_pokok_non_beras || 0}</td>
                          <td className="p-3 border">{item.pekarangan_hatinya_pkk_peternakan || 0}</td>
                          <td className="p-3 border">{item.pekarangan_hatinya_pkk_perikanan || 0}</td>
                          <td className="p-3 border">{item.pekarangan_hatinya_pkk_warung_hidup || 0}</td>
                          <td className="p-3 border">{item.pekarangan_hatinya_pkk_lumbung_hidup || 0}</td>
                          <td className="p-3 border">{item.pekarangan_hatinya_pkk_toga || 0}</td>
                          <td className="p-3 border">{item.pekarangan_hatinya_pkk_tanaman_keras || 0}</td>
                          <td className="p-3 border font-bold text-emerald-800 bg-emerald-50/10">{item.industri_rt_sandang || 0}</td>
                          <td className="p-3 border">{item.industri_rt_pangan || 0}</td>
                          <td className="p-3 border">{item.industri_rt_jasa || 0}</td>
                          <td className="p-3 border font-bold text-emerald-700 bg-emerald-50/20">{item.rumah_sehat || 0}</td>
                          <td className="p-3 border font-bold text-red-650 bg-red-50/20">{item.rumah_kurang_sehat || 0}</td>
                          <td className="p-3 border text-gray-400 text-[10px] max-w-xs truncate">{item.keterangan || '-'}</td>
                          <td className="p-3 border text-left flex items-center gap-3">
                            <button onClick={() => handleOpenEditPokja(item)} className="text-[#005941] hover:underline font-bold">Edit</button>
                            <button onClick={() => handleDeletePokja(3, item.id)} className="text-red-500 hover:underline font-bold">Hapus</button>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-emerald-50/60 font-bold border-t-2 border-emerald-800 text-center text-gray-900">
                        <td colSpan={2} className="p-3 border text-left">JUMLAH (TOTAL)</td>
                        <td className="p-3 border">{sumData(dataPokja3, 'kader_pangan')}</td>
                        <td className="p-3 border">{sumData(dataPokja3, 'kader_sandang')}</td>
                        <td className="p-3 border">{sumData(dataPokja3, 'kader_tata_laksana_rt')}</td>
                        <td className="p-3 border">{sumData(dataPokja3, 'makanan_pokok_beras')}</td>
                        <td className="p-3 border">{sumData(dataPokja3, 'makanan_pokok_non_beras')}</td>
                        <td className="p-3 border">{sumData(dataPokja3, 'pekarangan_hatinya_pkk_peternakan')}</td>
                        <td className="p-3 border">{sumData(dataPokja3, 'pekarangan_hatinya_pkk_perikanan')}</td>
                        <td className="p-3 border">{sumData(dataPokja3, 'pekarangan_hatinya_pkk_warung_hidup')}</td>
                        <td className="p-3 border">{sumData(dataPokja3, 'pekarangan_hatinya_pkk_lumbung_hidup')}</td>
                        <td className="p-3 border">{sumData(dataPokja3, 'pekarangan_hatinya_pkk_toga')}</td>
                        <td className="p-3 border">{sumData(dataPokja3, 'pekarangan_hatinya_pkk_tanaman_keras')}</td>
                        <td className="p-3 border font-extrabold text-emerald-900 bg-emerald-100/50">{sumData(dataPokja3, 'industri_rt_sandang')}</td>
                        <td className="p-3 border">{sumData(dataPokja3, 'industri_rt_pangan')}</td>
                        <td className="p-3 border">{sumData(dataPokja3, 'industri_rt_jasa')}</td>
                        <td className="p-3 border text-emerald-850 bg-emerald-100/30">{sumData(dataPokja3, 'rumah_sehat')}</td>
                        <td className="p-3 border text-red-700 bg-red-100/30">{sumData(dataPokja3, 'rumah_kurang_sehat')}</td>
                        <td colSpan={2} className="p-3 border bg-gray-50"></td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB POKJA IV & KESEHATAN --- */}
      {activePokjaTab === 'Pokja IV' && (
        <div className="space-y-4">
          
          <div className="flex border-b text-xs font-bold text-gray-400 space-x-4 mb-2">
            {['Data Umum', 'Pengunjung & Petugas Posyandu', 'Penimbangan & Imunisasi Bulanan'].map(sub => (
              <button
                key={sub}
                onClick={() => setActivePokja4SubTab(sub)}
                className={`pb-2 border-b-2 transition ${activePokja4SubTab === sub ? 'border-[#005941] text-[#005941]' : 'border-transparent hover:text-gray-700'}`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Sub-Tab 1: Data Utama Pokja IV */}
          {activePokja4SubTab === 'Data Umum' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-gray-200">
                  <thead>
                    {/* Row 1 */}
                    <tr className="bg-[#005941] text-white text-[10px] font-bold uppercase tracking-wider text-center">
                      <th rowSpan={3} className="p-3 border border-emerald-900 text-left w-12">NO</th>
                      <th rowSpan={3} className="p-3 border border-emerald-900 text-left min-w-[120px]">NAMA JORONG</th>
                      <th colSpan={10} className="p-2 border border-emerald-900">KESEHATAN</th>
                      <th colSpan={7} className="p-2 border border-emerald-900">KELESTARIAN LINGKUNGAN HIDUP</th>
                      <th colSpan={5} className="p-2 border border-emerald-900">PERENCANAAN SEHAT</th>
                      <th rowSpan={3} className="p-3 border border-emerald-900">KETERANGAN &amp; AKSI</th>
                    </tr>
                    {/* Row 2 */}
                    <tr className="bg-[#004e38] text-white text-[9px] font-bold text-center">
                      <th colSpan={4} className="p-2 border border-emerald-950">JML KADER KESEHATAN</th>
                      <th rowSpan={2} className="p-2 border border-emerald-950">KADER NARKOBA</th>
                      <th colSpan={2} className="p-2 border border-emerald-950">POSYANDU</th>
                      <th colSpan={2} className="p-2 border border-emerald-950">LANSIA</th>
                      <th rowSpan={2} className="p-2 border border-emerald-950">JUMLAH KK<br/>BEROBAT GRATIS</th>
                      
                      <th colSpan={4} className="p-2 border border-emerald-950">JUMLAH RUMAH YANG MEMILIKI</th>
                      <th colSpan={3} className="p-2 border border-emerald-950">MENGGUNAKAN AIR</th>

                      <th rowSpan={2} className="p-2 border border-emerald-950">JUMLAH PUS</th>
                      <th rowSpan={2} className="p-2 border border-emerald-950">JUMLAH WUS</th>
                      <th colSpan={2} className="p-2 border border-emerald-950">JUMLAH ASEPTOR KB</th>
                      <th rowSpan={2} className="p-2 border border-emerald-950">JML KK MEMILIKI<br/>TABUNGAN</th>
                    </tr>
                    {/* Row 3 */}
                    <tr className="bg-[#004230] text-white text-[8px] font-bold text-center">
                      <th className="p-1 border border-emerald-950">POSYANDU</th>
                      <th className="p-1 border border-emerald-950">GIZI</th>
                      <th className="p-1 border border-emerald-950">KESLING</th>
                      <th className="p-1 border border-emerald-950">PENYULUHAN PHBS</th>
                      <th className="p-1 border border-emerald-950">JUMLAH</th>
                      <th className="p-1 border border-emerald-950">TERINTEGRASI</th>
                      <th className="p-1 border border-emerald-950">JML KLP</th>
                      <th className="p-1 border border-emerald-950">JML ANGGOTA</th>
                      <th className="p-1 border border-emerald-950">JAMBAN</th>
                      <th className="p-1 border border-emerald-950">TMP SAMPAH</th>
                      <th className="p-1 border border-emerald-950">SPAL</th>
                      <th className="p-1 border border-emerald-950">MCK</th>
                      <th className="p-1 border border-emerald-950">PDAM</th>
                      <th className="p-1 border border-emerald-950">SUMUR</th>
                      <th className="p-1 border border-emerald-950">LAIN-LAIN</th>
                      <th className="p-1 border border-emerald-950">L</th>
                      <th className="p-1 border border-emerald-950">P</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 font-medium text-center text-gray-700 bg-white">
                    {dataPokja4.length === 0 ? (
                      <tr>
                        <td colSpan={26} className="p-8 text-center text-gray-400 font-bold italic bg-gray-50">Belum ada data jorong. Silakan klik "+ Tambah Rekap Jorong".</td>
                      </tr>
                    ) : (
                      <>
                        {dataPokja4.map((item, idx) => (
                          <tr key={item.id || idx} className="hover:bg-emerald-50/20 odd:bg-white even:bg-gray-50/50 transition">
                            <td className="p-3 border text-left font-bold text-gray-400">{idx + 1}</td>
                            <td className="p-3 border text-left font-bold text-gray-900 bg-gray-50/30">{item.jorong || item.nama_jorong}</td>
                            <td className="p-3 border">{item.kader_kesehatan || 0}</td>
                            <td className="p-3 border">{item.kader_kb || 0}</td>
                            <td className="p-3 border">{item.kader_kesling || 0}</td>
                            <td className="p-3 border">{item.kader_phbs || 0}</td>
                            <td className="p-3 border">{item.kader_narkoba || 0}</td>
                            <td className="p-3 border font-bold text-emerald-800 bg-emerald-50/10">{item.posyandu_total || 0}</td>
                            <td className="p-3 border">{item.posyandu_terintegrasi || 0}</td>
                            <td className="p-3 border">{item.lansia_kelompok || 0}</td>
                            <td className="p-3 border">{item.lansia_anggota || 0}</td>
                            <td className="p-3 border">{item.warga_gratis || 0}</td>
                            <td className="p-3 border">{item.jamban || 0}</td>
                            <td className="p-3 border">{item.tempat_sampah || 0}</td>
                            <td className="p-3 border">{item.spal || 0}</td>
                            <td className="p-3 border">{item.mck || 0}</td>
                            <td className="p-3 border">{item.air_pdam || 0}</td>
                            <td className="p-3 border">{item.air_sumur || 0}</td>
                            <td className="p-3 border">{item.air_lain || 0}</td>
                            <td className="p-3 border">{item.pus || 0}</td>
                            <td className="p-3 border">{item.wus || 0}</td>
                            <td className="p-3 border text-gray-500">0</td>
                            <td className="p-3 border">{item.warga_gratis || 0}</td>
                            <td className="p-3 border font-bold text-emerald-800 bg-emerald-50/10">{item.kk_tabungan || 0}</td>
                            <td className="p-3 border text-left">
                              <div className="flex gap-2">
                                <button onClick={() => handleOpenEditPokja(item)} className="text-[#005941] hover:underline font-bold">Edit</button>
                                <button onClick={() => handleDeletePokja(4, item.id)} className="text-red-500 hover:underline font-bold">Hapus</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-emerald-50/60 font-bold border-t-2 border-emerald-800 text-center text-gray-900">
                          <td colSpan={2} className="p-3 border text-left">JUMLAH (TOTAL)</td>
                          <td className="p-3 border">{sumData(dataPokja4, 'kader_kesehatan')}</td>
                          <td className="p-3 border">{sumData(dataPokja4, 'kader_kb')}</td>
                          <td className="p-3 border">{sumData(dataPokja4, 'kader_kesling')}</td>
                          <td className="p-3 border">{sumData(dataPokja4, 'kader_phbs')}</td>
                          <td className="p-3 border">{sumData(dataPokja4, 'kader_narkoba')}</td>
                          <td className="p-3 border font-extrabold text-emerald-900 bg-emerald-100/50">{sumData(dataPokja4, 'posyandu_total')}</td>
                          <td className="p-3 border">{sumData(dataPokja4, 'posyandu_terintegrasi')}</td>
                          <td className="p-3 border">{sumData(dataPokja4, 'lansia_kelompok')}</td>
                          <td className="p-3 border">{sumData(dataPokja4, 'lansia_anggota')}</td>
                          <td className="p-3 border">{sumData(dataPokja4, 'warga_gratis')}</td>
                          <td className="p-3 border">{sumData(dataPokja4, 'jamban')}</td>
                          <td className="p-3 border">{sumData(dataPokja4, 'tempat_sampah')}</td>
                          <td className="p-3 border">{sumData(dataPokja4, 'spal')}</td>
                          <td className="p-3 border">{sumData(dataPokja4, 'mck')}</td>
                          <td className="p-3 border">{sumData(dataPokja4, 'air_pdam')}</td>
                          <td className="p-3 border">{sumData(dataPokja4, 'air_sumur')}</td>
                          <td className="p-3 border">{sumData(dataPokja4, 'air_lain')}</td>
                          <td className="p-3 border">{sumData(dataPokja4, 'pus')}</td>
                          <td className="p-3 border">{sumData(dataPokja4, 'wus')}</td>
                          <td className="p-3 border">0</td>
                          <td className="p-3 border">{sumData(dataPokja4, 'warga_gratis')}</td>
                          <td className="p-3 border font-extrabold text-emerald-900 bg-emerald-100/50">{sumData(dataPokja4, 'kk_tabungan')}</td>
                          <td className="p-3 border bg-gray-50"></td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-Tab 2: Pengunjung & Petugas Posyandu */}
          {activePokja4SubTab === 'Pengunjung & Petugas Posyandu' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 font-serif">Pendukung Data Kegiatan Pokja IV PKK (Kunjungan &amp; Petugas)</span>
                <button onClick={handleOpenAddPosyandu} className="bg-[#005941] hover:bg-[#004230] text-white font-bold text-[10px] px-3 py-1.5 rounded-lg shadow transition">+ Tambah Log Berkala</button>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse border border-gray-200">
                    <thead>
                      {/* Row 1 */}
                      <tr className="bg-[#005941] text-white text-[10px] font-bold uppercase tracking-wider text-center">
                        <th rowSpan={3} className="p-3 border border-emerald-900 text-left w-12">NO</th>
                        <th rowSpan={3} className="p-3 border border-emerald-900 text-left min-w-[120px]">JORONG</th>
                        <th colSpan={12} className="p-2 border border-emerald-900">JUMLAH PENGUNJUNG</th>
                        <th colSpan={6} className="p-2 border border-emerald-900">JUMLAH PETUGAS YANG HADIR</th>
                        <th colSpan={4} className="p-2 border border-emerald-900">JUMLAH BAYI</th>
                        <th rowSpan={3} className="p-3 border border-emerald-900 text-left w-24">AKSI</th>
                      </tr>
                      {/* Row 2 */}
                      <tr className="bg-[#004e38] text-white text-[9px] font-bold text-center">
                        <th colSpan={4} className="p-2 border border-emerald-950">BALITA</th>
                        <th colSpan={4} className="p-2 border border-emerald-950">1-5 TH</th>
                        <th rowSpan={2} className="p-2 border border-emerald-950">WUS</th>
                        <th rowSpan={2} className="p-2 border border-emerald-950">PUS</th>
                        <th rowSpan={2} className="p-2 border border-emerald-950">IBU HAMIL</th>
                        <th rowSpan={2} className="p-2 border border-emerald-950">MENYUSUI</th>

                        <th colSpan={2} className="p-2 border border-emerald-950">KADER</th>
                        <th colSpan={2} className="p-2 border border-emerald-950">PLKB</th>
                        <th colSpan={2} className="p-2 border border-emerald-950">MEDIS DAN PARAMEDIS</th>

                        <th colSpan={2} className="p-2 border border-emerald-950">YANG LAHIR</th>
                        <th colSpan={2} className="p-2 border border-emerald-950">MENINGGAL</th>
                      </tr>
                      {/* Row 3 */}
                      <tr className="bg-[#004230] text-white text-[8px] font-bold text-center">
                        <th className="p-1 border border-emerald-950" colSpan={2}>BARU (L/P)</th>
                        <th className="p-1 border border-emerald-950" colSpan={2}>LAMA (L/P)</th>
                        <th className="p-1 border border-emerald-950" colSpan={2}>BARU (L/P)</th>
                        <th className="p-1 border border-emerald-950" colSpan={2}>LAMA (L/P)</th>
                        
                        <th className="p-1 border border-emerald-950">L</th>
                        <th className="p-1 border border-emerald-950">P</th>
                        <th className="p-1 border border-emerald-950">L</th>
                        <th className="p-1 border border-emerald-950">P</th>
                        <th className="p-1 border border-emerald-950">L</th>
                        <th className="p-1 border border-emerald-950">P</th>

                        <th className="p-1 border border-emerald-950">L</th>
                        <th className="p-1 border border-emerald-950">P</th>
                        <th className="p-1 border border-emerald-950">L</th>
                        <th className="p-1 border border-emerald-950">P</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 font-medium text-center text-gray-700 bg-white">
                      {dataPosyandu.length === 0 ? (
                        <tr>
                          <td colSpan={25} className="p-8 text-center text-gray-400 font-bold italic bg-gray-50">Belum ada data log posyandu. Silakan klik "+ Tambah Log Berkala".</td>
                        </tr>
                      ) : (
                        <>
                          {dataPosyandu.map((item, idx) => (
                            <tr key={item.id || idx} className="hover:bg-emerald-50/20 odd:bg-white even:bg-gray-50/50 transition">
                              <td className="p-3 border text-left font-bold text-gray-400">{idx + 1}</td>
                              <td className="p-3 border text-left font-bold text-gray-900 bg-gray-50/30">{item.jorong}</td>
                              <td className="p-1 border">{item.balita_0_12_l_baru || 0}</td>
                              <td className="p-1 border">{item.balita_0_12_p_baru || 0}</td>
                              <td className="p-1 border">{item.balita_0_12_l_lama || 0}</td>
                              <td className="p-1 border">{item.balita_0_12_p_lama || 0}</td>
                              <td className="p-1 border">{item.balita_1_5_l_baru || 0}</td>
                              <td className="p-1 border">{item.balita_1_5_p_baru || 0}</td>
                              <td className="p-1 border">{item.balita_1_5_l_lama || 0}</td>
                              <td className="p-1 border">{item.balita_1_5_p_lama || 0}</td>
                              <td className="p-3 border">{item.wus_hadir || 0}</td>
                              <td className="p-3 border">{item.pus_hadir || 0}</td>
                              <td className="p-3 border">{item.bumil_hadir || 0}</td>
                              <td className="p-3 border">{item.busui_hadir || 0}</td>
                              <td className="p-1 border">{item.petugas_kader_l || 0}</td>
                              <td className="p-1 border">{item.petugas_kader_p || 0}</td>
                              <td className="p-1 border">{item.petugas_plkb_l || 0}</td>
                              <td className="p-1 border">{item.petugas_plkb_p || 0}</td>
                              <td className="p-1 border">{item.petugas_medis_l || 0}</td>
                              <td className="p-1 border">{item.petugas_medis_p || 0}</td>
                              <td className="p-1 border font-bold text-emerald-800">{item.bayi_lahir_l || 0}</td>
                              <td className="p-1 border font-bold text-emerald-800">{item.bayi_lahir_p || 0}</td>
                              <td className="p-1 border text-red-600">{item.bayi_meninggal_l || 0}</td>
                              <td className="p-1 border text-red-600">{item.bayi_meninggal_p || 0}</td>
                              <td className="p-3 border text-left flex gap-2">
                                <button onClick={() => handleOpenEditPosyandu(item)} className="text-[#005941] hover:underline font-bold">Edit</button>
                                <button onClick={() => handleDeletePosyandu(item.id)} className="text-red-500 hover:underline font-bold">Hapus</button>
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-emerald-50/60 font-bold border-t-2 border-emerald-800 text-center text-gray-900">
                            <td colSpan={2} className="p-3 border text-left">JUMLAH (TOTAL)</td>
                            <td className="p-1 border">{sumData(dataPosyandu, 'balita_0_12_l_baru')}</td>
                            <td className="p-1 border">{sumData(dataPosyandu, 'balita_0_12_p_baru')}</td>
                            <td className="p-1 border">{sumData(dataPosyandu, 'balita_0_12_l_lama')}</td>
                            <td className="p-1 border">{sumData(dataPosyandu, 'balita_0_12_p_lama')}</td>
                            <td className="p-1 border">{sumData(dataPosyandu, 'balita_1_5_l_baru')}</td>
                            <td className="p-1 border">{sumData(dataPosyandu, 'balita_1_5_p_baru')}</td>
                            <td className="p-1 border">{sumData(dataPosyandu, 'balita_1_5_l_lama')}</td>
                            <td className="p-1 border">{sumData(dataPosyandu, 'balita_1_5_p_lama')}</td>
                            <td className="p-3 border">{sumData(dataPosyandu, 'wus_hadir')}</td>
                            <td className="p-3 border">{sumData(dataPosyandu, 'pus_hadir')}</td>
                            <td className="p-3 border">{sumData(dataPosyandu, 'bumil_hadir')}</td>
                            <td className="p-3 border">{sumData(dataPosyandu, 'busui_hadir')}</td>
                            <td className="p-1 border">{sumData(dataPosyandu, 'petugas_kader_l')}</td>
                            <td className="p-1 border">{sumData(dataPosyandu, 'petugas_kader_p')}</td>
                            <td className="p-1 border">{sumData(dataPosyandu, 'petugas_plkb_l')}</td>
                            <td className="p-1 border">{sumData(dataPosyandu, 'petugas_plkb_p')}</td>
                            <td className="p-1 border">{sumData(dataPosyandu, 'petugas_medis_l')}</td>
                            <td className="p-1 border">{sumData(dataPosyandu, 'petugas_medis_p')}</td>
                            <td className="p-1 border text-emerald-900">{sumData(dataPosyandu, 'bayi_lahir_l')}</td>
                            <td className="p-1 border text-emerald-900">{sumData(dataPosyandu, 'bayi_lahir_p')}</td>
                            <td className="p-1 border text-red-750">{sumData(dataPosyandu, 'bayi_meninggal_l')}</td>
                            <td className="p-1 border text-red-750">{sumData(dataPosyandu, 'bayi_meninggal_p')}</td>
                            <td className="p-3 border bg-gray-50"></td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 3: Penimbangan & Imunisasi Bulanan */}
          {activePokja4SubTab === 'Penimbangan & Imunisasi Bulanan' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse border border-gray-200">
                    <thead>
                      {/* Row 1 */}
                      <tr className="bg-[#005941] text-white text-[10px] font-bold uppercase tracking-wider text-center">
                        <th rowSpan={3} className="p-3 border border-emerald-900 text-left w-12">NO</th>
                        <th rowSpan={3} className="p-3 border border-emerald-900 text-left min-w-[120px]">BULAN / POSYANDU</th>
                        <th colSpan={2} className="p-2 border border-emerald-900">JUMLAH ASEPTOR KB</th>
                        <th colSpan={12} className="p-2 border border-emerald-900">PENIMBANGAN BALITA</th>
                        <th rowSpan={3} className="p-3 border border-emerald-900">TT IBU HAMIL</th>
                        <th colSpan={20} className="p-2 border border-emerald-900">JUMLAH BAYI YANG DI IMUNISASI</th>
                        <th colSpan={2} className="p-2 border border-emerald-900">BALITA YANG MENDERITA DIARE</th>
                        <th rowSpan={3} className="p-3 border border-emerald-900">JUMLAH YANG MENDAPAT ORALIT</th>
                        <th rowSpan={3} className="p-3 border border-emerald-900 text-left w-24">AKSI</th>
                      </tr>
                      {/* Row 2 */}
                      <tr className="bg-[#004e38] text-white text-[9px] font-bold text-center">
                        <th rowSpan={2} className="p-1 border border-emerald-950">L</th>
                        <th rowSpan={2} className="p-1 border border-emerald-950">P</th>
                        
                        <th colSpan={2} className="p-2 border border-emerald-950">JML BALITA (S)</th>
                        <th colSpan={2} className="p-2 border border-emerald-950">JML BALITA YG MEMILIKI KMS (K)</th>
                        <th colSpan={2} className="p-2 border border-emerald-950">JML YANG DITIMBANG (D)</th>
                        <th colSpan={2} className="p-2 border border-emerald-950">JML YANG NAIK (N)</th>
                        <th colSpan={2} className="p-2 border border-emerald-950">JML YANG MENDAPAT VIT A</th>
                        <th colSpan={2} className="p-2 border border-emerald-950">JML YANG MENDAPAT PMT</th>

                        <th colSpan={2} className="p-2 border border-emerald-950">BCG</th>
                        <th colSpan={6} className="p-2 border border-emerald-950">DPT</th>
                        <th colSpan={8} className="p-2 border border-emerald-950">POLIO</th>
                        <th colSpan={2} className="p-2 border border-emerald-950">CAMPAK</th>
                        <th colSpan={2} className="p-2 border border-emerald-950">HEPATITIS B</th>

                        <th rowSpan={2} className="p-1 border border-emerald-950">L</th>
                        <th rowSpan={2} className="p-1 border border-emerald-950">P</th>
                      </tr>
                      {/* Row 3 */}
                      <tr className="bg-[#004230] text-white text-[8px] font-bold text-center">
                        <th className="p-1 border border-emerald-950">L</th><th className="p-1 border border-emerald-950">P</th>
                        <th className="p-1 border border-emerald-950">L</th><th className="p-1 border border-emerald-950">P</th>
                        <th className="p-1 border border-emerald-950">L</th><th className="p-1 border border-emerald-950">P</th>
                        <th className="p-1 border border-emerald-950">L</th><th className="p-1 border border-emerald-950">P</th>
                        <th className="p-1 border border-emerald-950">L</th><th className="p-1 border border-emerald-950">P</th>
                        <th className="p-1 border border-emerald-950">L</th><th className="p-1 border border-emerald-950">P</th>

                        <th className="p-1 border border-emerald-950">L</th><th className="p-1 border border-emerald-950">P</th>
                        <th className="p-1 border border-emerald-950" colSpan={2}>I (L/P)</th>
                        <th className="p-1 border border-emerald-950" colSpan={2}>II (L/P)</th>
                        <th className="p-1 border border-emerald-950" colSpan={2}>III (L/P)</th>
                        <th className="p-1 border border-emerald-950" colSpan={2}>I (L/P)</th>
                        <th className="p-1 border border-emerald-950" colSpan={2}>II (L/P)</th>
                        <th className="p-1 border border-emerald-950" colSpan={2}>III (L/P)</th>
                        <th className="p-1 border border-emerald-950" colSpan={2}>IV (L/P)</th>
                        <th className="p-1 border border-emerald-950">L</th><th className="p-1 border border-emerald-950">P</th>
                        <th className="p-1 border border-emerald-950">L</th><th className="p-1 border border-emerald-950">P</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 font-medium text-center text-gray-700 bg-white">
                      {dataPosyandu.length === 0 ? (
                        <tr>
                          <td colSpan={43} className="p-8 text-center text-gray-400 font-bold italic bg-gray-50">Belum ada data kegiatan posyandu. Silakan tambahkan log berkala di tab sebelumnya.</td>
                        </tr>
                      ) : (
                        <>
                          {dataPosyandu.map((item, idx) => (
                            <tr key={item.id || idx} className="hover:bg-emerald-50/20 odd:bg-white even:bg-gray-50/50 transition">
                              <td className="p-3 border text-left font-bold text-gray-400">{idx + 1}</td>
                              <td className="p-3 border text-left font-bold text-gray-900 bg-gray-50/30">{item.posyandu} ({item.jorong})</td>
                              <td className="p-1 border">0</td>
                              <td className="p-1 border">{item.wus_hadir || 0}</td>
                              <td className="p-1 border">{item.s || 0}</td>
                              <td className="p-1 border">0</td>
                              <td className="p-1 border">{item.k || 0}</td>
                              <td className="p-1 border">0</td>
                              <td className="p-1 border font-bold text-emerald-800">{item.d || 0}</td>
                              <td className="p-1 border">0</td>
                              <td className="p-1 border font-bold text-emerald-700">{item.n || 0}</td>
                              <td className="p-1 border">0</td>
                              <td className="p-1 border">{item.vit_a || 0}</td>
                              <td className="p-1 border">0</td>
                              <td className="p-1 border">{item.pmt || 0}</td>
                              <td className="p-1 border">0</td>
                              <td className="p-3 border font-bold bg-emerald-50/10">{item.bumil_tt || 0}</td>
                              <td className="p-1 border">{item.bcg || 0}</td>
                              <td className="p-1 border">0</td>
                              <td className="p-1 border" colSpan={2}>{item.dpt_1 || 0} / 0</td>
                              <td className="p-1 border" colSpan={2}>{item.dpt_2 || 0} / 0</td>
                              <td className="p-1 border" colSpan={2}>{item.dpt_3 || 0} / 0</td>
                              <td className="p-1 border" colSpan={2}>{item.polio_1 || 0} / 0</td>
                              <td className="p-1 border" colSpan={2}>{item.polio_2 || 0} / 0</td>
                              <td className="p-1 border" colSpan={2}>{item.polio_3 || 0} / 0</td>
                              <td className="p-1 border" colSpan={2}>{item.polio_4 || 0} / 0</td>
                              <td className="p-1 border">{item.campak || 0}</td>
                              <td className="p-1 border">0</td>
                              <td className="p-1 border">{item.hepb || 0}</td>
                              <td className="p-1 border">0</td>
                              <td className="p-1 border text-red-600">{item.balita_meninggal || 0}</td>
                              <td className="p-1 border">0</td>
                              <td className="p-3 border font-bold text-emerald-800">{item.diare_oralit || 0}</td>
                              <td className="p-3 border text-left">
                                <button onClick={() => handleOpenEditPosyandu(item)} className="text-[#005941] hover:underline font-bold">Edit</button>
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-emerald-50/60 font-bold border-t-2 border-emerald-800 text-center text-gray-900">
                            <td colSpan={2} className="p-3 border text-left">JUMLAH (TOTAL)</td>
                            <td className="p-1 border">0</td>
                            <td className="p-1 border">{sumData(dataPosyandu, 'wus_hadir')}</td>
                            <td className="p-1 border">{sumData(dataPosyandu, 's')}</td>
                            <td className="p-1 border">0</td>
                            <td className="p-1 border">{sumData(dataPosyandu, 'k')}</td>
                            <td className="p-1 border">0</td>
                            <td className="p-1 border font-extrabold text-emerald-900">{sumData(dataPosyandu, 'd')}</td>
                            <td className="p-1 border">0</td>
                            <td className="p-1 border font-extrabold text-emerald-800">{sumData(dataPosyandu, 'n')}</td>
                            <td className="p-1 border">0</td>
                            <td className="p-1 border">{sumData(dataPosyandu, 'vit_a')}</td>
                            <td className="p-1 border">0</td>
                            <td className="p-1 border">{sumData(dataPosyandu, 'pmt')}</td>
                            <td className="p-1 border">0</td>
                            <td className="p-3 border font-extrabold bg-emerald-100/50">{sumData(dataPosyandu, 'bumil_tt')}</td>
                            <td className="p-1 border">{sumData(dataPosyandu, 'bcg')}</td>
                            <td className="p-1 border">0</td>
                            <td className="p-1 border" colSpan={2}>{sumData(dataPosyandu, 'dpt_1')}</td>
                            <td className="p-1 border" colSpan={2}>{sumData(dataPosyandu, 'dpt_2')}</td>
                            <td className="p-1 border" colSpan={2}>{sumData(dataPosyandu, 'dpt_3')}</td>
                            <td className="p-1 border" colSpan={2}>{sumData(dataPosyandu, 'polio_1')}</td>
                            <td className="p-1 border" colSpan={2}>{sumData(dataPosyandu, 'polio_2')}</td>
                            <td className="p-1 border" colSpan={2}>{sumData(dataPosyandu, 'polio_3')}</td>
                            <td className="p-1 border" colSpan={2}>{sumData(dataPosyandu, 'polio_4')}</td>
                            <td className="p-1 border">{sumData(dataPosyandu, 'campak')}</td>
                            <td className="p-1 border">0</td>
                            <td className="p-1 border">{sumData(dataPosyandu, 'hepb')}</td>
                            <td className="p-1 border">0</td>
                            <td className="p-1 border text-red-750">{sumData(dataPosyandu, 'balita_meninggal')}</td>
                            <td className="p-1 border">0</td>
                            <td className="p-3 border font-extrabold text-emerald-900 bg-emerald-100/50">{sumData(dataPosyandu, 'diare_oralit')}</td>
                            <td className="p-3 border bg-gray-50"></td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* === MODAL INPUT EDITOR === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/45 backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-gray-100 shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#005941] text-white p-4 flex justify-between items-center">
              <h4 className="font-bold text-sm font-serif">
                {modalType === 'add_pokja_jorong' && `Tambah Jorong Baru - ${activePokjaTab}`}
                {modalType === 'edit_pokja' && `Edit Rekapitulasi ${activePokjaTab} - ${editId}`}
                {modalType === 'add_posyandu' && 'Tambah Log Kegiatan Posyandu'}
                {modalType === 'edit_posyandu' && `Edit Log Posyandu - ${formData.posyandu}`}
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-gray-250 text-xl font-bold">&times;</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto font-sans text-xs font-semibold text-gray-600">
              
              {/* TAMBAH JORONG BARU */}
              {modalType === 'add_pokja_jorong' && (
                <div className="space-y-4">
                  <p className="text-[10px] text-gray-400 font-medium mb-2">Pilih nama jorong yang ingin ditambahkan:</p>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Nama Jorong</label>
                    <select
                      value={formData.jorong || ''}
                      onChange={(e) => setFormData({ ...formData, jorong: e.target.value })}
                      className="w-full border rounded p-2 bg-white text-xs font-bold text-gray-800"
                      required
                    >
                      <option value="">-- Pilih Jorong --</option>
                      <option value="Suayan Sabar">Suayan Sabar</option>
                      <option value="Suayan Tinggi">Suayan Tinggi</option>
                      <option value="Suayan Randah">Suayan Randah</option>
                      <option value="Suayan Soriak">Suayan Soriak</option>
                    </select>
                  </div>
                </div>
              )}

              {/* EDIT DATA REKAP POKJA */}
              {modalType === 'edit_pokja' && (
                <div className="space-y-4">
                  {activePokjaTab === 'Pokja I' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Kader PKBN</label>
                        <input type="number" value={formData.kader_pkbn || 0} onChange={(e) => setFormData({ ...formData, kader_pkbn: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Kader PKDRT</label>
                        <input type="number" value={formData.kader_pkdrt || 0} onChange={(e) => setFormData({ ...formData, kader_pkdrt: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Kader Pola Asuh</label>
                        <input type="number" value={formData.kader_pola_asuh || 0} onChange={(e) => setFormData({ ...formData, kader_pola_asuh: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Kader Lansia</label>
                        <input type="number" value={formData.kader_lansia || 0} onChange={(e) => setFormData({ ...formData, kader_lansia: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div className="col-span-2 md:col-span-3 border-t pt-3">
                        <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-2">Simulasi (Jumlah Kelompok &amp; Anggota)</span>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Simulasi PKBN Kelompok</label>
                        <input type="number" value={formData.simulasi_pkbn_jml_kelompok || 0} onChange={(e) => setFormData({ ...formData, simulasi_pkbn_jml_kelompok: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Simulasi PKBN Anggota</label>
                        <input type="number" value={formData.simulasi_pkbn_jml_anggota || 0} onChange={(e) => setFormData({ ...formData, simulasi_pkbn_jml_anggota: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Simulasi PKDRT Kelompok</label>
                        <input type="number" value={formData.simulasi_pkdrt_jml_kelompok || 0} onChange={(e) => setFormData({ ...formData, simulasi_pkdrt_jml_kelompok: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Simulasi PKDRT Anggota</label>
                        <input type="number" value={formData.simulasi_pkdrt_jml_anggota || 0} onChange={(e) => setFormData({ ...formData, simulasi_pkdrt_jml_anggota: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Simulasi Pola Asuh Kelompok</label>
                        <input type="number" value={formData.simulasi_pola_asuh_jml_kelompok || 0} onChange={(e) => setFormData({ ...formData, simulasi_pola_asuh_jml_kelompok: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Simulasi Pola Asuh Anggota</label>
                        <input type="number" value={formData.simulasi_pola_asuh_jml_anggota || 0} onChange={(e) => setFormData({ ...formData, simulasi_pola_asuh_jml_anggota: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div className="col-span-2 md:col-span-3 border-t pt-3">
                        <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-2">Gotong Royong</span>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Kerja Bakti (Anggota)</label>
                        <input type="number" value={formData.gotong_royong_kerja_bakti_jml_anggota || 0} onChange={(e) => setFormData({ ...formData, gotong_royong_kerja_bakti_jml_anggota: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Rukun Kematian (Kelompok)</label>
                        <input type="number" value={formData.gotong_royong_rukun_kematian_jml_kelompok || 0} onChange={(e) => setFormData({ ...formData, gotong_royong_rukun_kematian_jml_kelompok: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Keagamaan (Anggota)</label>
                        <input type="number" value={formData.gotong_royong_keagamaan_jml_anggota || 0} onChange={(e) => setFormData({ ...formData, gotong_royong_keagamaan_jml_anggota: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Jimpitan</label>
                        <input type="number" value={formData.gotong_royong_jimpitan || 0} onChange={(e) => setFormData({ ...formData, gotong_royong_jimpitan: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Arisan</label>
                        <input type="number" value={formData.gotong_royong_arisan || 0} onChange={(e) => setFormData({ ...formData, gotong_royong_arisan: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div className="col-span-2 md:col-span-3">
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Keterangan</label>
                        <textarea value={formData.keterangan || ''} onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })} className="w-full border rounded p-2 text-xs" rows="2"></textarea>
                      </div>
                    </div>
                  )}

                  {activePokjaTab === 'Pokja II' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="col-span-2 md:col-span-3">
                        <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-2">Pendidikan &amp; Keterampilan</span>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Paket A Kelompok</label>
                        <input type="number" value={formData.paket_a_kelompok || 0} onChange={(e) => setFormData({ ...formData, paket_a_kelompok: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Paket A Warga Belajar</label>
                        <input type="number" value={formData.paket_a_warga_belajar || 0} onChange={(e) => setFormData({ ...formData, paket_a_warga_belajar: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Paket B Kelompok</label>
                        <input type="number" value={formData.paket_b_kelompok || 0} onChange={(e) => setFormData({ ...formData, paket_b_kelompok: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Paket B Warga Belajar</label>
                        <input type="number" value={formData.paket_b_warga_belajar || 0} onChange={(e) => setFormData({ ...formData, paket_b_warga_belajar: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Paket C Kelompok</label>
                        <input type="number" value={formData.paket_c_kelompok || 0} onChange={(e) => setFormData({ ...formData, paket_c_kelompok: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Paket C Warga Belajar</label>
                        <input type="number" value={formData.paket_c_warga_belajar || 0} onChange={(e) => setFormData({ ...formData, paket_c_warga_belajar: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Taman Bacaan / Kelompok Pembaca</label>
                        <input type="number" value={formData.taman_bacaan_perpustakaan_kelompok_pembaca || 0} onChange={(e) => setFormData({ ...formData, taman_bacaan_perpustakaan_kelompok_pembaca: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Rumah DILAN</label>
                        <input type="number" value={formData.rumah_dilan || 0} onChange={(e) => setFormData({ ...formData, rumah_dilan: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Kampung Mandiri</label>
                        <input type="number" value={formData.kampung_mandiri || 0} onChange={(e) => setFormData({ ...formData, kampung_mandiri: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Kader Keterampilan</label>
                        <input type="number" value={formData.kader_khusus_keterampilan || 0} onChange={(e) => setFormData({ ...formData, kader_khusus_keterampilan: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Kader Koperasi</label>
                        <input type="number" value={formData.kader_khusus_koperasi || 0} onChange={(e) => setFormData({ ...formData, kader_khusus_koperasi: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div className="col-span-2 md:col-span-3 border-t pt-3">
                        <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-2">Usaha UP2K PKK &amp; Koperasi</span>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">UP2K Pemula (Kelompok/Peserta)</label>
                        <div className="flex space-x-1">
                          <input type="number" placeholder="Kel" value={formData.up2k_pemula_kelompok || 0} onChange={(e) => setFormData({ ...formData, up2k_pemula_kelompok: parseInt(e.target.value) || 0 })} className="w-1/2 border rounded p-1.5 text-xs" />
                          <input type="number" placeholder="Psr" value={formData.up2k_pemula_peserta || 0} onChange={(e) => setFormData({ ...formData, up2k_pemula_peserta: parseInt(e.target.value) || 0 })} className="w-1/2 border rounded p-1.5 text-xs" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">UP2K Madya (Kelompok/Peserta)</label>
                        <div className="flex space-x-1">
                          <input type="number" placeholder="Kel" value={formData.up2k_madya_kelompok || 0} onChange={(e) => setFormData({ ...formData, up2k_madya_kelompok: parseInt(e.target.value) || 0 })} className="w-1/2 border rounded p-1.5 text-xs" />
                          <input type="number" placeholder="Psr" value={formData.up2k_madya_peserta || 0} onChange={(e) => setFormData({ ...formData, up2k_madya_peserta: parseInt(e.target.value) || 0 })} className="w-1/2 border rounded p-1.5 text-xs" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">UP2K Utama (Kelompok/Peserta)</label>
                        <div className="flex space-x-1">
                          <input type="number" placeholder="Kel" value={formData.up2k_utama_kelompok || 0} onChange={(e) => setFormData({ ...formData, up2k_utama_kelompok: parseInt(e.target.value) || 0 })} className="w-1/2 border rounded p-1.5 text-xs" />
                          <input type="number" placeholder="Psr" value={formData.up2k_utama_peserta || 0} onChange={(e) => setFormData({ ...formData, up2k_utama_peserta: parseInt(e.target.value) || 0 })} className="w-1/2 border rounded p-1.5 text-xs" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">UP2K Mandiri (Kelompok/Peserta)</label>
                        <div className="flex space-x-1">
                          <input type="number" placeholder="Kel" value={formData.up2k_mandiri_kelompok || 0} onChange={(e) => setFormData({ ...formData, up2k_mandiri_kelompok: parseInt(e.target.value) || 0 })} className="w-1/2 border rounded p-1.5 text-xs" />
                          <input type="number" placeholder="Psr" value={formData.up2k_mandiri_peserta || 0} onChange={(e) => setFormData({ ...formData, up2k_mandiri_peserta: parseInt(e.target.value) || 0 })} className="w-1/2 border rounded p-1.5 text-xs" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Usaha Mikro</label>
                        <input type="number" value={formData.usaha_mikro || 0} onChange={(e) => setFormData({ ...formData, usaha_mikro: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Toko PKK</label>
                        <input type="number" value={formData.toko_pkk || 0} onChange={(e) => setFormData({ ...formData, toko_pkk: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Pra-Koperasi (Kop/Anggota)</label>
                        <div className="flex space-x-1">
                          <input type="number" placeholder="Jml" value={formData.pra_koperasi_jumlah || 0} onChange={(e) => setFormData({ ...formData, pra_koperasi_jumlah: parseInt(e.target.value) || 0 })} className="w-1/2 border rounded p-1.5 text-xs" />
                          <input type="number" placeholder="Ang" value={formData.pra_koperasi_anggota || 0} onChange={(e) => setFormData({ ...formData, pra_koperasi_anggota: parseInt(e.target.value) || 0 })} className="w-1/2 border rounded p-1.5 text-xs" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Koperasi Hukum (Kop/Anggota)</label>
                        <div className="flex space-x-1">
                          <input type="number" placeholder="Jml" value={formData.koperasi_berbadan_hukum_jumlah || 0} onChange={(e) => setFormData({ ...formData, koperasi_berbadan_hukum_jumlah: parseInt(e.target.value) || 0 })} className="w-1/2 border rounded p-1.5 text-xs" />
                          <input type="number" placeholder="Ang" value={formData.koperasi_berbadan_hukum_anggota || 0} onChange={(e) => setFormData({ ...formData, koperasi_berbadan_hukum_anggota: parseInt(e.target.value) || 0 })} className="w-1/2 border rounded p-1.5 text-xs" />
                        </div>
                      </div>
                    </div>
                  )}

                  {activePokjaTab === 'Pokja III' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Kader Pangan</label>
                        <input type="number" value={formData.kader_pangan || 0} onChange={(e) => setFormData({ ...formData, kader_pangan: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Kader Sandang</label>
                        <input type="number" value={formData.kader_sandang || 0} onChange={(e) => setFormData({ ...formData, kader_sandang: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Kader Tata Laksana RT</label>
                        <input type="number" value={formData.kader_tata_laksana_rt || 0} onChange={(e) => setFormData({ ...formData, kader_tata_laksana_rt: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div className="col-span-2 md:col-span-3 border-t pt-3">
                        <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-2">Makanan Pokok &amp; Industri RT</span>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Konsumsi Beras (KK)</label>
                        <input type="number" value={formData.makanan_pokok_beras || 0} onChange={(e) => setFormData({ ...formData, makanan_pokok_beras: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Konsumsi Non-Beras (KK)</label>
                        <input type="number" value={formData.makanan_pokok_non_beras || 0} onChange={(e) => setFormData({ ...formData, makanan_pokok_non_beras: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Industri RT Sandang</label>
                        <input type="number" value={formData.industri_rt_sandang || 0} onChange={(e) => setFormData({ ...formData, industri_rt_sandang: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Industri RT Pangan</label>
                        <input type="number" value={formData.industri_rt_pangan || 0} onChange={(e) => setFormData({ ...formData, industri_rt_pangan: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Industri RT Jasa</label>
                        <input type="number" value={formData.industri_rt_jasa || 0} onChange={(e) => setFormData({ ...formData, industri_rt_jasa: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div className="col-span-2 md:col-span-3 border-t pt-3">
                        <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-2">HATINYA PKK (Lahan Pekarangan)</span>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Peternakan</label>
                        <input type="number" value={formData.pekarangan_hatinya_pkk_peternakan || 0} onChange={(e) => setFormData({ ...formData, pekarangan_hatinya_pkk_peternakan: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Perikanan</label>
                        <input type="number" value={formData.pekarangan_hatinya_pkk_perikanan || 0} onChange={(e) => setFormData({ ...formData, pekarangan_hatinya_pkk_perikanan: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Warung Hidup</label>
                        <input type="number" value={formData.pekarangan_hatinya_pkk_warung_hidup || 0} onChange={(e) => setFormData({ ...formData, pekarangan_hatinya_pkk_warung_hidup: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Lumbung Hidup</label>
                        <input type="number" value={formData.pekarangan_hatinya_pkk_lumbung_hidup || 0} onChange={(e) => setFormData({ ...formData, pekarangan_hatinya_pkk_lumbung_hidup: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">TOGA</label>
                        <input type="number" value={formData.pekarangan_hatinya_pkk_toga || 0} onChange={(e) => setFormData({ ...formData, pekarangan_hatinya_pkk_toga: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Tanaman Keras</label>
                        <input type="number" value={formData.pekarangan_hatinya_pkk_tanaman_keras || 0} onChange={(e) => setFormData({ ...formData, pekarangan_hatinya_pkk_tanaman_keras: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div className="col-span-2 md:col-span-3 border-t pt-3">
                        <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-2">Kondisi Kelayakan Rumah</span>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Rumah Sehat</label>
                        <input type="number" value={formData.rumah_sehat || 0} onChange={(e) => setFormData({ ...formData, rumah_sehat: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Rumah Kurang Sehat</label>
                        <input type="number" value={formData.rumah_kurang_sehat || 0} onChange={(e) => setFormData({ ...formData, rumah_kurang_sehat: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div className="col-span-2 md:col-span-3">
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Keterangan</label>
                        <textarea value={formData.keterangan || ''} onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })} className="w-full border rounded p-2 text-xs" rows="2"></textarea>
                      </div>
                    </div>
                  )}

                  {activePokjaTab === 'Pokja IV' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Kader Posyandu</label>
                        <input type="number" value={formData.kader_kesehatan || 0} onChange={(e) => setFormData({ ...formData, kader_kesehatan: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Kader KB/Gizi</label>
                        <input type="number" value={formData.kader_kb || 0} onChange={(e) => setFormData({ ...formData, kader_kb: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Kader Kesling</label>
                        <input type="number" value={formData.kader_kesling || 0} onChange={(e) => setFormData({ ...formData, kader_kesling: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Kader PHBS</label>
                        <input type="number" value={formData.kader_phbs || 0} onChange={(e) => setFormData({ ...formData, kader_phbs: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Kader Narkoba</label>
                        <input type="number" value={formData.kader_narkoba || 0} onChange={(e) => setFormData({ ...formData, kader_narkoba: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Jumlah Posyandu</label>
                        <input type="number" value={formData.posyandu_total || 0} onChange={(e) => setFormData({ ...formData, posyandu_total: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Posyandu Terintegrasi</label>
                        <input type="number" value={formData.posyandu_terintegrasi || 0} onChange={(e) => setFormData({ ...formData, posyandu_terintegrasi: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Kelompok Lansia</label>
                        <input type="number" value={formData.lansia_kelompok || 0} onChange={(e) => setFormData({ ...formData, lansia_kelompok: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Anggota Lansia</label>
                        <input type="number" value={formData.lansia_anggota || 0} onChange={(e) => setFormData({ ...formData, lansia_anggota: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div className="col-span-2 md:col-span-3 border-t pt-3">
                        <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-2">Sanitasi &amp; Air Bersih</span>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Jumlah Jamban</label>
                        <input type="number" value={formData.jamban || 0} onChange={(e) => setFormData({ ...formData, jamban: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Tempat Sampah</label>
                        <input type="number" value={formData.tempat_sampah || 0} onChange={(e) => setFormData({ ...formData, tempat_sampah: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Saluran SPAL</label>
                        <input type="number" value={formData.spal || 0} onChange={(e) => setFormData({ ...formData, spal: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Jumlah MCK</label>
                        <input type="number" value={formData.mck || 0} onChange={(e) => setFormData({ ...formData, mck: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Pengguna PDAM</label>
                        <input type="number" value={formData.air_pdam || 0} onChange={(e) => setFormData({ ...formData, air_pdam: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Pengguna Sumur</label>
                        <input type="number" value={formData.air_sumur || 0} onChange={(e) => setFormData({ ...formData, air_sumur: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Air Lain-lain</label>
                        <input type="number" value={formData.air_lain || 0} onChange={(e) => setFormData({ ...formData, air_lain: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div className="col-span-2 md:col-span-3 border-t pt-3">
                        <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-2">Pasangan &amp; Perencanaan Sehat</span>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Jumlah PUS</label>
                        <input type="number" value={formData.pus || 0} onChange={(e) => setFormData({ ...formData, pus: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Jumlah WUS</label>
                        <input type="number" value={formData.wus || 0} onChange={(e) => setFormData({ ...formData, wus: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">KK Memiliki Tabungan</label>
                        <input type="number" value={formData.kk_tabungan || 0} onChange={(e) => setFormData({ ...formData, kk_tabungan: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Berobat Gratis (Kartu Sehat)</label>
                        <input type="number" value={formData.warga_gratis || 0} onChange={(e) => setFormData({ ...formData, warga_gratis: parseInt(e.target.value) || 0 })} className="w-full border rounded p-2 text-xs" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* EDIT ATAU TAMBAH DATA LOG BERKALA POSYANDU */}
              {(modalType === 'add_posyandu' || modalType === 'edit_posyandu') && (
                <div className="space-y-4 text-xs font-semibold">
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">Nama Posyandu / Bulan</label>
                      <input type="text" value={formData.posyandu || ''} onChange={(e) => setFormData({ ...formData, posyandu: e.target.value })} className="w-full border rounded p-2 text-xs" required />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">Jorong/Wilayah</label>
                      <select value={formData.jorong || 'Suayan Tinggi'} onChange={(e) => setFormData({ ...formData, jorong: e.target.value })} className="w-full border rounded p-2 bg-white text-xs text-gray-800">
                        <option value="Suayan Tinggi">Suayan Tinggi</option>
                        <option value="Suayan Sabar">Suayan Sabar</option>
                        <option value="Suayan Randah">Suayan Randah</option>
                        <option value="Suayan Soriak">Suayan Soriak</option>
                      </select>
                    </div>
                  </div>

                  {/* Kehadiran Pengunjung Balita */}
                  <div className="border-t pt-3 space-y-2">
                    <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider">1. Kehadiran Pengunjung Balita (L/P)</span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 p-2.5 rounded border">
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">Balita 0-12m L (Baru)</label>
                        <input type="number" value={formData.balita_0_12_l_baru || 0} onChange={(e) => setFormData({ ...formData, balita_0_12_l_baru: parseInt(e.target.value) || 0 })} className="w-full border rounded p-1 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">Balita 0-12m L (Lama)</label>
                        <input type="number" value={formData.balita_0_12_l_lama || 0} onChange={(e) => setFormData({ ...formData, balita_0_12_l_lama: parseInt(e.target.value) || 0 })} className="w-full border rounded p-1 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">Balita 0-12m P (Baru)</label>
                        <input type="number" value={formData.balita_0_12_p_baru || 0} onChange={(e) => setFormData({ ...formData, balita_0_12_p_baru: parseInt(e.target.value) || 0 })} className="w-full border rounded p-1 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">Balita 0-12m P (Lama)</label>
                        <input type="number" value={formData.balita_0_12_p_lama || 0} onChange={(e) => setFormData({ ...formData, balita_0_12_p_lama: parseInt(e.target.value) || 0 })} className="w-full border rounded p-1 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">Balita 1-5y L (Baru)</label>
                        <input type="number" value={formData.balita_1_5_l_baru || 0} onChange={(e) => setFormData({ ...formData, balita_1_5_l_baru: parseInt(e.target.value) || 0 })} className="w-full border rounded p-1 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">Balita 1-5y L (Lama)</label>
                        <input type="number" value={formData.balita_1_5_l_lama || 0} onChange={(e) => setFormData({ ...formData, balita_1_5_l_lama: parseInt(e.target.value) || 0 })} className="w-full border rounded p-1 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">Balita 1-5y P (Baru)</label>
                        <input type="number" value={formData.balita_1_5_p_baru || 0} onChange={(e) => setFormData({ ...formData, balita_1_5_p_baru: parseInt(e.target.value) || 0 })} className="w-full border rounded p-1 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">Balita 1-5y P (Lama)</label>
                        <input type="number" value={formData.balita_1_5_p_lama || 0} onChange={(e) => setFormData({ ...formData, balita_1_5_p_lama: parseInt(e.target.value) || 0 })} className="w-full border rounded p-1 text-xs" />
                      </div>
                    </div>
                  </div>

                  {/* Kehadiran Dewasa & Petugas */}
                  <div className="border-t pt-3 space-y-2">
                    <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider">2. Kehadiran Pengunjung Dewasa &amp; Petugas</span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 p-2.5 rounded border">
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">WUS Hadir</label>
                        <input type="number" value={formData.wus_hadir || 0} onChange={(e) => setFormData({ ...formData, wus_hadir: parseInt(e.target.value) || 0 })} className="w-full border rounded p-1 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">PUS Hadir</label>
                        <input type="number" value={formData.pus_hadir || 0} onChange={(e) => setFormData({ ...formData, pus_hadir: parseInt(e.target.value) || 0 })} className="w-full border rounded p-1 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">Ibu Hamil</label>
                        <input type="number" value={formData.bumil_hadir || 0} onChange={(e) => setFormData({ ...formData, bumil_hadir: parseInt(e.target.value) || 0 })} className="w-full border rounded p-1 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">Ibu Menyusui</label>
                        <input type="number" value={formData.busui_hadir || 0} onChange={(e) => setFormData({ ...formData, busui_hadir: parseInt(e.target.value) || 0 })} className="w-full border rounded p-1 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">Kader PKK (L/P)</label>
                        <div className="flex space-x-1">
                          <input type="number" value={formData.petugas_kader_l || 0} onChange={(e) => setFormData({ ...formData, petugas_kader_l: parseInt(e.target.value) || 0 })} className="w-1/2 border rounded p-1 text-xs" />
                          <input type="number" value={formData.petugas_kader_p || 0} onChange={(e) => setFormData({ ...formData, petugas_kader_p: parseInt(e.target.value) || 0 })} className="w-1/2 border rounded p-1 text-xs" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">PLKB (L/P)</label>
                        <div className="flex space-x-1">
                          <input type="number" value={formData.petugas_plkb_l || 0} onChange={(e) => setFormData({ ...formData, petugas_plkb_l: parseInt(e.target.value) || 0 })} className="w-1/2 border rounded p-1 text-xs" />
                          <input type="number" value={formData.petugas_plkb_p || 0} onChange={(e) => setFormData({ ...formData, petugas_plkb_p: parseInt(e.target.value) || 0 })} className="w-1/2 border rounded p-1 text-xs" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">Medis/Paramedis (L/P)</label>
                        <div className="flex space-x-1">
                          <input type="number" value={formData.petugas_medis_l || 0} onChange={(e) => setFormData({ ...formData, petugas_medis_l: parseInt(e.target.value) || 0 })} className="w-1/2 border rounded p-1 text-xs" />
                          <input type="number" value={formData.petugas_medis_p || 0} onChange={(e) => setFormData({ ...formData, petugas_medis_p: parseInt(e.target.value) || 0 })} className="w-1/2 border rounded p-1 text-xs" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Catatan Vital */}
                  <div className="border-t pt-3 space-y-2">
                    <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider">3. Catatan Vital (Kelahiran &amp; Kematian)</span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 p-2.5 rounded border text-[10px]">
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">Bayi Lahir L</label>
                        <input type="number" value={formData.bayi_lahir_l || 0} onChange={(e) => setFormData({ ...formData, bayi_lahir_l: parseInt(e.target.value) || 0 })} className="w-full border rounded p-1 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">Bayi Lahir P</label>
                        <input type="number" value={formData.bayi_lahir_p || 0} onChange={(e) => setFormData({ ...formData, bayi_lahir_p: parseInt(e.target.value) || 0 })} className="w-full border rounded p-1 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">Bayi Meninggal L</label>
                        <input type="number" value={formData.bayi_meninggal_l || 0} onChange={(e) => setFormData({ ...formData, bayi_meninggal_l: parseInt(e.target.value) || 0 })} className="w-full border rounded p-1 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">Bayi Meninggal P</label>
                        <input type="number" value={formData.bayi_meninggal_p || 0} onChange={(e) => setFormData({ ...formData, bayi_meninggal_p: parseInt(e.target.value) || 0 })} className="w-full border rounded p-1 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">Balita Meninggal</label>
                        <input type="number" value={formData.balita_meninggal || 0} onChange={(e) => setFormData({ ...formData, balita_meninggal: parseInt(e.target.value) || 0 })} className="w-full border rounded p-1 text-xs" />
                      </div>
                    </div>
                  </div>

                  {/* Penimbangan & Imunisasi */}
                  <div className="border-t pt-3 space-y-2">
                    <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider">4. Penimbangan &amp; Imunisasi Bulanan</span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 p-2.5 rounded border">
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">Balita Terdaftar (S)</label>
                        <input type="number" value={formData.s || 0} onChange={(e) => setFormData({ ...formData, s: parseInt(e.target.value) || 0 })} className="w-full border rounded p-1 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">Miliki KMS (K)</label>
                        <input type="number" value={formData.k || 0} onChange={(e) => setFormData({ ...formData, k: parseInt(e.target.value) || 0 })} className="w-full border rounded p-1 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">Ditimbang (D)</label>
                        <input type="number" value={formData.d || 0} onChange={(e) => setFormData({ ...formData, d: parseInt(e.target.value) || 0 })} className="w-full border rounded p-1 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">Naik Berat Badan (N)</label>
                        <input type="number" value={formData.n || 0} onChange={(e) => setFormData({ ...formData, n: parseInt(e.target.value) || 0 })} className="w-full border rounded p-1 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">Mendapat Vit A</label>
                        <input type="number" value={formData.vit_a || 0} onChange={(e) => setFormData({ ...formData, vit_a: parseInt(e.target.value) || 0 })} className="w-full border rounded p-1 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">Mendapat PMT</label>
                        <input type="number" value={formData.pmt || 0} onChange={(e) => setFormData({ ...formData, pmt: parseInt(e.target.value) || 0 })} className="w-full border rounded p-1 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">Bumil Imunisasi TT</label>
                        <input type="number" value={formData.bumil_tt || 0} onChange={(e) => setFormData({ ...formData, bumil_tt: parseInt(e.target.value) || 0 })} className="w-full border rounded p-1 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">BCG</label>
                        <input type="number" value={formData.bcg || 0} onChange={(e) => setFormData({ ...formData, bcg: parseInt(e.target.value) || 0 })} className="w-full border rounded p-1 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">DPT 1 / 2 / 3</label>
                        <div className="flex space-x-1">
                          <input type="number" placeholder="1" value={formData.dpt_1 || 0} onChange={(e) => setFormData({ ...formData, dpt_1: parseInt(e.target.value) || 0 })} className="w-1/3 border rounded p-1 text-xs" />
                          <input type="number" placeholder="2" value={formData.dpt_2 || 0} onChange={(e) => setFormData({ ...formData, dpt_2: parseInt(e.target.value) || 0 })} className="w-1/3 border rounded p-1 text-xs" />
                          <input type="number" placeholder="3" value={formData.dpt_3 || 0} onChange={(e) => setFormData({ ...formData, dpt_3: parseInt(e.target.value) || 0 })} className="w-1/3 border rounded p-1 text-xs" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">Polio 1 / 2 / 3 / 4</label>
                        <div className="flex space-x-1">
                          <input type="number" placeholder="1" value={formData.polio_1 || 0} onChange={(e) => setFormData({ ...formData, polio_1: parseInt(e.target.value) || 0 })} className="w-1/4 border rounded p-1 text-xs" />
                          <input type="number" placeholder="2" value={formData.polio_2 || 0} onChange={(e) => setFormData({ ...formData, polio_2: parseInt(e.target.value) || 0 })} className="w-1/4 border rounded p-1 text-xs" />
                          <input type="number" placeholder="3" value={formData.polio_3 || 0} onChange={(e) => setFormData({ ...formData, polio_3: parseInt(e.target.value) || 0 })} className="w-1/4 border rounded p-1 text-xs" />
                          <input type="number" placeholder="4" value={formData.polio_4 || 0} onChange={(e) => setFormData({ ...formData, polio_4: parseInt(e.target.value) || 0 })} className="w-1/4 border rounded p-1 text-xs" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">Campak</label>
                        <input type="number" value={formData.campak || 0} onChange={(e) => setFormData({ ...formData, campak: parseInt(e.target.value) || 0 })} className="w-full border rounded p-1 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">Hepatitis B</label>
                        <input type="number" value={formData.hepb || 0} onChange={(e) => setFormData({ ...formData, hepb: parseInt(e.target.value) || 0 })} className="w-full border rounded p-1 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 mb-0.5">Diare Oralit</label>
                        <input type="number" value={formData.diare_oralit || 0} onChange={(e) => setFormData({ ...formData, diare_oralit: parseInt(e.target.value) || 0 })} className="w-full border rounded p-1 text-xs" />
                      </div>
                    </div>
                  </div>

                </div>
              )}

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

export default PokjaAdmin;
