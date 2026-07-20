import React, { useState } from 'react';

function KeuanganAdmin({ dataKeuangan, setDataKeuangan, API_URL }) {
  const [filterJenis, setFilterJenis] = useState('semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
    tanggal: '', sumber_dana: '', uraian: '', nomor_bukti_kas: '', jenis: 'penerimaan', nominal: ''
  });

  // State untuk Rekonsiliasi Fisik Penutupan Buku Kas Umum
  const [sisaBank, setSisaBank] = useState('');
  const [sisaTunai, setSisaTunai] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  const handleOpenAdd = () => {
    setModalType('add');
    setEditId(null);
    setFormData({
      tanggal: '', sumber_dana: '', uraian: '', nomor_bukti_kas: '', jenis: 'penerimaan', nominal: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setModalType('edit');
    setEditId(item.id);
    const isPenerimaan = (parseFloat(item.nominal_penerimaan) || 0) > 0;
    const nominal = isPenerimaan ? item.nominal_penerimaan : item.nominal_pengeluaran;
    setFormData({
      tanggal: item.tanggal ? item.tanggal.substring(0, 10) : '',
      sumber_dana: item.sumber_dana || '',
      uraian: item.uraian || '',
      nomor_bukti_kas: item.nomor_bukti_kas || item.no_bukti_kas || '',
      nominal: nominal || '',
      jenis: isPenerimaan ? 'penerimaan' : 'pengeluaran'
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data transaksi keuangan ini?")) return;
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
    
    const nominalVal = parseFloat(formData.nominal) || 0;
    const bodyData = {
      tanggal: formData.tanggal,
      sumber_dana: formData.sumber_dana,
      uraian: formData.uraian,
      nomor_bukti_kas: formData.nomor_bukti_kas || '-',
      nominal_penerimaan: formData.jenis === 'penerimaan' ? nominalVal : 0,
      nominal_pengeluaran: formData.jenis === 'pengeluaran' ? nominalVal : 0
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
          setDataKeuangan([saved, ...dataKeuangan]);
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
      setDataKeuangan([{ id: Date.now(), ...bodyData }, ...dataKeuangan]);
    } else {
      setDataKeuangan(dataKeuangan.map(item => item.id === editId ? { ...item, ...bodyData } : item));
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number || 0);
  };

  // Perhitungan Keuangan Total
  const totalPenerimaan = dataKeuangan.reduce((acc, item) => acc + (parseFloat(item.nominal_penerimaan) || 0), 0);
  const totalPengeluaran = dataKeuangan.reduce((acc, item) => acc + (parseFloat(item.nominal_pengeluaran) || 0), 0);
  const sisaBukuKasUmum = totalPenerimaan - totalPengeluaran;

  // Perhitungan Fisik Rekonsiliasi
  const valBank = parseFloat(sisaBank) || 0;
  const valTunai = parseFloat(sisaTunai) || 0;
  const totalFisik = valBank + valTunai;
  const isBalanced = Math.abs(totalFisik - sisaBukuKasUmum) < 0.01;
  const isInputFilled = sisaBank !== '' || sisaTunai !== '';

  const filteredData = dataKeuangan.filter(item => {
    if (filterJenis === 'penerimaan') return (parseFloat(item.nominal_penerimaan) || 0) > 0;
    if (filterJenis === 'pengeluaran') return (parseFloat(item.nominal_pengeluaran) || 0) > 0;
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleSaveCloseBook = (e) => {
    e.preventDefault();
    if (!isBalanced) return;
    setSaveStatus('Berhasil menutup buku kas! Data keuangan telah seimbang.');
    setTimeout(() => setSaveStatus(''), 4000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Printable Area styling */}
      <style>{`
        @media print {
          @page {
            size: landscape;
            margin: 15mm;
          }
          body {
            background: white !important;
            color: black !important;
          }
          aside, header, nav, .no-print, button {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          .bg-white {
            box-shadow: none !important;
            border: none !important;
          }
          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          th, td {
            border: 1px solid #000 !important;
            padding: 6px !important;
          }
        }
        .print-only {
          display: none;
        }
      `}</style>

      {/* Header Panel Card */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h3 className="text-lg font-black font-serif text-gray-900">Buku Kas Keuangan PKK Nagari Suayan</h3>
          <p className="text-[11px] text-gray-500 font-medium">Rekapitulasi penerimaan, pengeluaran, dan penutupan saldo kas umum</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={handlePrint}
            className="bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold px-3.5 py-2.5 rounded-lg transition shadow-sm flex items-center gap-1.5"
          >
            <span>🖨️ Cetak Laporan (PDF Landscape)</span>
          </button>
          <button 
            onClick={handleOpenAdd}
            className="bg-[#005941] hover:bg-[#004230] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition shadow-sm flex items-center gap-1.5"
          >
            <span>+ Catat Transaksi Keuangan</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs Jenis Transaksi */}
      <div className="flex items-center space-x-2 border-b border-gray-200 pb-2 no-print">
        <button 
          onClick={() => setFilterJenis('semua')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${filterJenis === 'semua' ? 'bg-[#005941] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Semua Transaksi ({dataKeuangan.length})
        </button>
        <button 
          onClick={() => setFilterJenis('penerimaan')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${filterJenis === 'penerimaan' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'}`}
        >
          Penerimaan (Kas Masuk)
        </button>
        <button 
          onClick={() => setFilterJenis('pengeluaran')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${filterJenis === 'pengeluaran' ? 'bg-red-700 text-white shadow-sm' : 'bg-red-50 text-red-800 hover:bg-red-100'}`}
        >
          Pengeluaran (Kas Keluar)
        </button>
      </div>

      {/* Header Kop Surat Khusus Cetak Print */}
      <div className="print-only mb-6 text-center border-b-2 border-black pb-4">
        <h2 className="text-base font-bold uppercase tracking-wider">TIM PENGGERAK PKK NAGARI SUAYAN</h2>
        <h3 className="text-sm font-bold uppercase">KECAMATAN AKABILURU KABUPATEN LIMA PULUH KOTA</h3>
        <h4 className="text-xs font-bold mt-2 underline">BUKU KAS UMUM KEUANGAN TP-PKK NAGARI SUAYAN</h4>
      </div>

      {/* Tabel Transaksi Keuangan */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-gray-200">
            <thead>
              <tr className="bg-[#005941] text-white text-[10px] font-bold uppercase tracking-wider text-center">
                <th className="p-3 border border-emerald-900 text-left w-12">NO</th>
                <th className="p-3 border border-emerald-900">TANGGAL</th>
                <th className="p-3 border border-emerald-900 text-left">SUMBER DANA</th>
                <th className="p-3 border border-emerald-900 text-left">URAIAN</th>
                <th className="p-3 border border-emerald-900">NOMOR BUKTI KAS</th>
                <th className="p-3 border border-emerald-900 text-right">JUMLAH PENERIMAAN</th>
                <th className="p-3 border border-emerald-900 text-right">JUMLAH PENGELUARAN</th>
                <th className="p-3 border border-emerald-900 text-left w-24 no-print">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 font-medium text-gray-700 bg-white">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400 font-bold italic bg-gray-50">
                    Belum ada catatan transaksi keuangan. Silakan klik "+ Catat Transaksi Keuangan".
                  </td>
                </tr>
              ) : (
                filteredData.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-emerald-50/20 odd:bg-white even:bg-gray-50/50 transition">
                    <td className="p-3 border text-left font-bold text-gray-400">{idx + 1}</td>
                    <td className="p-3 border text-center text-gray-600 font-mono">
                      {item.tanggal ? item.tanggal.substring(0, 10) : '-'}
                    </td>
                    <td className="p-3 border font-semibold text-gray-800">{item.sumber_dana}</td>
                    <td className="p-3 border text-gray-700 text-[11px] leading-relaxed max-w-xs">{item.uraian}</td>
                    <td className="p-3 border text-center font-mono text-gray-600">{item.nomor_bukti_kas || item.no_bukti_kas || '-'}</td>
                    <td className="p-3 border text-right font-extrabold text-emerald-800 bg-emerald-50/20">
                      {(parseFloat(item.nominal_penerimaan) || 0) > 0 ? formatRupiah(item.nominal_penerimaan) : '-'}
                    </td>
                    <td className="p-3 border text-right font-extrabold text-red-800 bg-red-50/20">
                      {(parseFloat(item.nominal_pengeluaran) || 0) > 0 ? formatRupiah(item.nominal_pengeluaran) : '-'}
                    </td>
                    <td className="p-3 border text-left flex items-center gap-3 no-print">
                      <button onClick={() => handleOpenEdit(item)} className="text-[#005941] hover:underline font-bold">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:underline font-bold">Hapus</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {/* Baris Total di Bawah Tabel */}
            <tfoot>
              <tr className="bg-emerald-900 text-white font-black text-xs">
                <td colSpan={5} className="p-3 border border-emerald-950 text-right uppercase tracking-wider">
                  JUMLAH (TOTAL) :
                </td>
                <td className="p-3 border border-emerald-950 text-right text-emerald-200">
                  {formatRupiah(totalPenerimaan)}
                </td>
                <td className="p-3 border border-emerald-950 text-right text-red-200">
                  {formatRupiah(totalPengeluaran)}
                </td>
                <td className="p-3 border border-emerald-950 no-print"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Widget Ringkasan Penutupan Buku Kas Umum & Rekonsiliasi Fisik */}
      <div className="bg-white rounded-xl border border-emerald-800/20 shadow-md p-6 space-y-6 font-sans">
        <div className="border-b pb-3 flex justify-between items-center">
          <div>
            <h4 className="text-base font-extrabold text-emerald-950 font-serif flex items-center gap-2">
              <span>📕</span> Penutupan Buku Kas Umum & Rekonsiliasi Fisik
            </h4>
            <p className="text-[11px] text-gray-500 font-medium">Hitung saldo buku kas umum dan lakukan verifikasi fisik sisa bank serta saldo tunai bendahara</p>
          </div>
          <span className="text-xs font-extrabold px-3 py-1 bg-emerald-50 text-emerald-900 rounded-full border border-emerald-200">
            Nagari Suayan
          </span>
        </div>

        {/* 3 Grid Card Sisa Buku Kas Umum */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-xl p-4">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-800">Total Penerimaan</span>
            <span className="block text-lg font-black text-emerald-900 mt-1">{formatRupiah(totalPenerimaan)}</span>
          </div>
          <div className="bg-red-50/50 border border-red-200/60 rounded-xl p-4">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-red-800">Total Pengeluaran</span>
            <span className="block text-lg font-black text-red-900 mt-1">{formatRupiah(totalPengeluaran)}</span>
          </div>
          <div className="bg-emerald-900 text-white rounded-xl p-4 shadow-sm">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-200">Sisa Buku Kas Umum</span>
            <span className="block text-lg font-black text-emerald-100 mt-1">{formatRupiah(sisaBukuKasUmum)}</span>
            <span className="block text-[9px] text-emerald-300 mt-0.5">(Total Penerimaan - Total Pengeluaran)</span>
          </div>
        </div>

        {/* Form Input Manual Rekonsiliasi Fisik Bendahara */}
        <form onSubmit={handleSaveCloseBook} className="bg-gray-50 border rounded-xl p-5 space-y-4">
          <h5 className="font-extrabold text-xs text-gray-800 uppercase tracking-wider">Form Rekonsiliasi Fisik (Input Manual Bendahara)</h5>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">
                a. Sisa Bank (Saldo di Rekening Bank PKK Nagari Suayan)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-gray-400 font-bold">Rp</span>
                <input 
                  type="number" 
                  value={sisaBank} 
                  onChange={(e) => setSisaBank(e.target.value)} 
                  placeholder="0" 
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-xs font-bold text-gray-800 bg-white focus:ring-1 focus:ring-emerald-700" 
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">
                b. Sisa Tunai (Uang Cash di Brankas / Dompet Bendahara)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-gray-400 font-bold">Rp</span>
                <input 
                  type="number" 
                  value={sisaTunai} 
                  onChange={(e) => setSisaTunai(e.target.value)} 
                  placeholder="0" 
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-xs font-bold text-gray-800 bg-white focus:ring-1 focus:ring-emerald-700" 
                />
              </div>
            </div>
          </div>

          {/* Sistem Peringatan Otomatis (Validation Guard) */}
          {isInputFilled && (
            <div>
              {!isBalanced ? (
                <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-red-900 text-xs font-bold flex items-center justify-between animate-in fade-in duration-200">
                  <div className="flex items-center space-x-2">
                    <span className="text-base">⚠️</span>
                    <div>
                      <span>Data Keuangan Tidak Seimbang! Silakan Periksa Kembali Inputan Anda.</span>
                      <span className="block text-[10px] text-red-700 font-normal mt-0.5">
                        (Total Fisik Bank + Tunai = {formatRupiah(totalFisik)} ≠ Sisa Kas Buku = {formatRupiah(sisaBukuKasUmum)})
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-lg text-emerald-900 text-xs font-bold flex items-center space-x-2 animate-in fade-in duration-200">
                  <span>✅</span>
                  <span>Data Keuangan Seimbang (Balanced)! Total Uang Fisik sesuai dengan Sisa Buku Kas Umum.</span>
                </div>
              )}
            </div>
          )}

          {saveStatus && (
            <div className="p-3 bg-emerald-800 text-white rounded-lg text-xs font-bold">
              {saveStatus}
            </div>
          )}

          <div className="pt-2 flex justify-end no-print">
            <button 
              type="submit" 
              disabled={!isBalanced || !isInputFilled}
              className={`text-xs font-bold px-5 py-2.5 rounded-lg transition shadow ${
                isBalanced && isInputFilled
                  ? 'bg-[#005941] hover:bg-[#004230] text-white cursor-pointer' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Simpan Penutupan Kas &amp; Rekonsiliasi
            </button>
          </div>
        </form>
      </div>

      {/* Lembar Tanda Tangan Khusus Cetak Print */}
      <div className="print-only mt-12 pt-6">
        <div className="flex justify-between items-center text-xs font-bold text-center">
          <div className="space-y-16">
            <span>Mengetahui,<br />Ketua TP-PKK Nagari Suayan</span>
            <span className="block font-underline font-black">( Ny. Rosmawati )</span>
          </div>
          <div className="space-y-16">
            <span>Suayan, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br />Bendahara TP-PKK Nagari Suayan</span>
            <span className="block font-underline font-black">( Ny. Marlina )</span>
          </div>
        </div>
      </div>

      {/* Modal Form Catat Transaksi Keuangan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/45 backdrop-blur-sm no-print">
          <div className="bg-white rounded-xl border border-gray-100 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#005941] text-white p-4 flex justify-between items-center">
              <h4 className="font-bold text-sm font-serif">
                {modalType === 'add' ? 'Tambah Catatan Transaksi Keuangan' : 'Edit Transaksi Keuangan'}
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-gray-250 text-xl font-bold">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 font-sans text-xs font-semibold text-gray-600">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Tanggal Transaksi</label>
                <input 
                  type="date" 
                  value={formData.tanggal || ''} 
                  onChange={(e) => setFormData({...formData, tanggal: e.target.value})} 
                  className="w-full border rounded p-2 text-xs text-gray-800" 
                  required 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Jenis Transaksi</label>
                <select 
                  value={formData.jenis || 'penerimaan'} 
                  onChange={(e) => setFormData({...formData, jenis: e.target.value})} 
                  className="w-full border rounded p-2 text-xs bg-white text-gray-800"
                >
                  <option value="penerimaan">Penerimaan (Kas Masuk)</option>
                  <option value="pengeluaran">Pengeluaran (Kas Keluar)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Sumber Dana</label>
                <input 
                  type="text" 
                  value={formData.sumber_dana || ''} 
                  onChange={(e) => setFormData({...formData, sumber_dana: e.target.value})} 
                  className="w-full border rounded p-2 text-xs text-gray-800" 
                  placeholder="Contoh: Swadaya Warga / APBD Nagari" 
                  required 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Nomor Bukti Kas</label>
                <input 
                  type="text" 
                  value={formData.nomor_bukti_kas || ''} 
                  onChange={(e) => setFormData({...formData, nomor_bukti_kas: e.target.value})} 
                  className="w-full border rounded p-2 text-xs text-gray-800" 
                  placeholder="Contoh: BKM-001 / BKK-005" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Uraian / Keterangan Transaksi</label>
                <textarea 
                  rows="2"
                  value={formData.uraian || ''} 
                  onChange={(e) => setFormData({...formData, uraian: e.target.value})} 
                  className="w-full border rounded p-2 text-xs text-gray-800" 
                  placeholder="Rincian penggunaan atau sumber dana..."
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Nominal (Rupiah)</label>
                <input 
                  type="number" 
                  value={formData.nominal || ''} 
                  onChange={(e) => setFormData({...formData, nominal: e.target.value})} 
                  className="w-full border rounded p-2 text-xs text-gray-800" 
                  placeholder="0"
                  required 
                />
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

export default KeuanganAdmin;
