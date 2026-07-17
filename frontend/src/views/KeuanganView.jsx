import React, { useState } from 'react';

function KeuanganView({ isAdmin, dataKeuangan, setDataKeuangan }) {

  const [formKeuangan, setFormKeuangan] = useState({
    tanggal: '',
    sumber_dana: 'Dana Desa',
    uraian: '',
    nomor_bukti_kas: '',
    jenis: 'penerimaan',
    nominal: ''
  });

  const handleAddKeuangan = (e) => {
    e.preventDefault();
    if (!formKeuangan.tanggal || !formKeuangan.nominal || !formKeuangan.uraian) return;

    const nominalValue = parseFloat(formKeuangan.nominal);
    const newTrans = {
      id: Date.now(),
      tanggal: formKeuangan.tanggal,
      sumber_dana: formKeuangan.sumber_dana,
      uraian: formKeuangan.uraian,
      nomor_bukti_kas: formKeuangan.nomor_bukti_kas || '-',
      nominal_penerimaan: formKeuangan.jenis === 'penerimaan' ? nominalValue : 0,
      nominal_pengeluaran: formKeuangan.jenis === 'pengeluaran' ? nominalValue : 0
    };

    setDataKeuangan([...dataKeuangan, newTrans]);
    setFormKeuangan({
      tanggal: '',
      sumber_dana: 'Dana Desa',
      uraian: '',
      nomor_bukti_kas: '',
      jenis: 'penerimaan',
      nominal: ''
    });
  };

  const handleDeleteKeuangan = (id) => {
    setDataKeuangan(dataKeuangan.filter(item => item.id !== id));
  };

  // Hitung ringkasan keuangan
  const totalPenerimaan = dataKeuangan.reduce((sum, item) => sum + item.nominal_penerimaan, 0);
  const totalPengeluaran = dataKeuangan.reduce((sum, item) => sum + item.nominal_pengeluaran, 0);
  const saldoAkhir = totalPenerimaan - totalPengeluaran;

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  return (
    <div className="bg-[#fbfbfa] pb-20">
      {/* Banner */}
      <div className="bg-emerald-900 text-white text-center py-16 px-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-350 block mb-1 font-sans">TRANSPARANSI KAS</span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif tracking-wide">Buku Keuangan TP-PKK</h1>
        <p className="text-xs text-emerald-200 mt-1 uppercase font-semibold tracking-wider">Laporan Arus Kas Nagari Suayan</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-8">
        
        {/* Ringkasan Anggaran Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Total Penerimaan</span>
              <span className="text-xl font-bold text-emerald-700">{formatRupiah(totalPenerimaan)}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-red-100 text-red-800 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Total Pengeluaran</span>
              <span className="text-xl font-bold text-red-700">{formatRupiah(totalPengeluaran)}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-blue-100 text-blue-800 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Saldo Kas Akhir</span>
              <span className="text-xl font-bold text-gray-800">{formatRupiah(saldoAkhir)}</span>
            </div>
          </div>
        </div>

        {/* Admin Form */}
        {isAdmin && (
          <form onSubmit={handleAddKeuangan} className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-sm font-bold text-gray-800">Catat Transaksi Kas Baru</h3>
              <span className="bg-red-100 text-red-800 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Admin Form</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Tanggal</label>
                <input 
                  type="date" 
                  value={formKeuangan.tanggal}
                  onChange={(e) => setFormKeuangan({...formKeuangan, tanggal: e.target.value})}
                  className="w-full text-sm border rounded p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Sumber Dana</label>
                <select 
                  value={formKeuangan.sumber_dana}
                  onChange={(e) => setFormKeuangan({...formKeuangan, sumber_dana: e.target.value})}
                  className="w-full text-sm border rounded p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value="Dana Desa">Dana Desa</option>
                  <option value="APBN">APBN</option>
                  <option value="Swadaya">Swadaya / Mandiri</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Nomor Bukti Kas</label>
                <input 
                  type="text" 
                  placeholder="Contoh: BKK-05/VII" 
                  value={formKeuangan.nomor_bukti_kas}
                  onChange={(e) => setFormKeuangan({...formKeuangan, nomor_bukti_kas: e.target.value})}
                  className="w-full text-sm border rounded p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Jenis Transaksi</label>
                <select 
                  value={formKeuangan.jenis}
                  onChange={(e) => setFormKeuangan({...formKeuangan, jenis: e.target.value})}
                  className="w-full text-sm border rounded p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value="penerimaan">Penerimaan (Kas Masuk)</option>
                  <option value="pengeluaran">Pengeluaran (Kas Keluar)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Jumlah Nominal (Rupiah)</label>
                <input 
                  type="number" 
                  placeholder="Contoh: 500000" 
                  value={formKeuangan.nominal}
                  onChange={(e) => setFormKeuangan({...formKeuangan, nominal: e.target.value})}
                  className="w-full text-sm border rounded p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Keterangan / Uraian</label>
                <input 
                  type="text" 
                  placeholder="Uraian belanja/insentif" 
                  value={formKeuangan.uraian}
                  onChange={(e) => setFormKeuangan({...formKeuangan, uraian: e.target.value})}
                  className="w-full text-sm border rounded p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="bg-emerald-700 text-white text-xs font-bold px-5 py-2 rounded hover:bg-emerald-800 transition">
                Simpan Transaksi
              </button>
            </div>
          </form>
        )}

        {/* Tabel Data Kas */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b text-gray-600 font-bold uppercase tracking-wider">
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">No Bukti</th>
                  <th className="p-4">Sumber</th>
                  <th className="p-4">Uraian Transaksi</th>
                  <th className="p-4 text-right">Penerimaan (+)</th>
                  <th className="p-4 text-right">Pengeluaran (-)</th>
                  {isAdmin && <th className="p-4 text-center">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {dataKeuangan.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 7 : 6} className="p-8 text-center text-gray-400">Belum ada transaksi terdaftar.</td>
                  </tr>
                ) : (
                  dataKeuangan.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-4 whitespace-nowrap">{item.tanggal}</td>
                      <td className="p-4 font-mono font-semibold">{item.nomor_web_kas || item.nomor_bukti_kas}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.sumber_dana === 'Dana Desa' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-800'}`}>
                          {item.sumber_dana}
                        </span>
                      </td>
                      <td className="p-4 max-w-sm leading-relaxed">{item.uraian}</td>
                      <td className="p-4 text-right font-bold text-emerald-700">
                        {item.nominal_penerimaan > 0 ? formatRupiah(item.nominal_penerimaan) : '-'}
                      </td>
                      <td className="p-4 text-right font-bold text-red-600">
                        {item.nominal_pengeluaran > 0 ? formatRupiah(item.nominal_pengeluaran) : '-'}
                      </td>
                      {isAdmin && (
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => handleDeleteKeuangan(item.id)}
                            className="bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1 rounded text-[10px] font-bold transition"
                          >
                            Hapus
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default KeuanganView;
