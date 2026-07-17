import React, { useState } from 'react';

function UmumAdmin({ dataUmumJorong, setDataUmumJorong, API_URL }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null); // jorong name
  const [formData, setFormData] = useState({});

  const handleOpenEdit = (item) => {
    setEditId(item.jorong);
    setFormData({
      jorong: item.jorong,
      jumlah_dasawisma: item.jumlah_dasawisma || item.dasawisma || 0,
      jumlah_krt: item.jumlah_krt || 0,
      jumlah_kk: item.jumlah_kk || item.kk || 0,
      jiwa_l: item.jiwa_l || 0,
      jiwa_p: item.jiwa_p || 0,
      anggota_l: item.anggota_l || 0,
      anggota_p: item.anggota_p || 0,
      kader_umum_l: item.kader_umum_l || 0,
      kader_umum_p: item.kader_umum_p || 0,
      kader_khusus_l: item.kader_khusus_l || 0,
      kader_khusus_p: item.kader_khusus_p || 0,
      tenaga_honorer_l: item.tenaga_honorer_l || 0,
      tenaga_honorer_p: item.tenaga_honorer_p || 0,
      tenaga_bantuan_l: item.tenaga_bantuan_l || 0,
      tenaga_bantuan_p: item.tenaga_bantuan_p || 0,
      keterangan: item.keterangan || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const url = `${API_URL}/umum/${editId}`;

    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        updateStateLocal();
      } else {
        updateStateLocal();
      }
    } catch (err) {
      console.warn(err);
      updateStateLocal();
    }
    setIsModalOpen(false);
  };

  const updateStateLocal = () => {
    setDataUmumJorong(dataUmumJorong.map(item => item.jorong === editId ? {
      ...item,
      ...formData,
      kk: formData.jumlah_kk,
      jiwa: formData.jiwa_l + formData.jiwa_p,
      anggota: formData.anggota_l + formData.anggota_p,
      dasawisma: formData.jumlah_dasawisma
    } : item));
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-extrabold text-gray-800 font-serif">Data Umum TP-PKK Nagari</h3>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[10px] font-medium text-gray-700">
            <thead>
              <tr className="bg-gray-150 border-b text-gray-500 font-bold uppercase tracking-wider text-[9px]">
                <th className="p-3 border-r" rowSpan="2">Nama Jorong</th>
                <th className="p-3 border-r text-center" colSpan="2">Jml Kelompok</th>
                <th className="p-3 border-r text-center" colSpan="2">Jumlah</th>
                <th className="p-3 border-r text-center" colSpan="2">Jumlah Jiwa</th>
                <th className="p-3 border-r text-center" colSpan="2">Anggota TP PKK</th>
                <th className="p-3 border-r text-center" colSpan="4">Jumlah Kader</th>
                <th className="p-3 border-r text-center" colSpan="4">Jumlah Tenaga</th>
                <th className="p-3 text-center" rowSpan="2">Aksi</th>
              </tr>
              <tr className="bg-gray-50 border-b text-gray-400 font-bold uppercase tracking-wider text-[8px]">
                <th className="p-2 border-r text-center">Jorong</th>
                <th className="p-2 border-r text-center">Dasawi</th>
                <th className="p-2 border-r text-center">KRT</th>
                <th className="p-2 border-r text-center">KK</th>
                <th className="p-2 border-r text-center">L</th>
                <th className="p-2 border-r text-center">P</th>
                <th className="p-2 border-r text-center">L</th>
                <th className="p-2 border-r text-center">P</th>
                <th className="p-2 border-r text-center bg-emerald-50/50 text-emerald-800">Umum L</th>
                <th className="p-2 border-r text-center bg-emerald-50/50 text-emerald-800">Umum P</th>
                <th className="p-2 border-r text-center bg-teal-50/50 text-teal-800">Khusus L</th>
                <th className="p-2 border-r text-center bg-teal-50/50 text-teal-800">Khusus P</th>
                <th className="p-2 border-r text-center">Honor L</th>
                <th className="p-2 border-r text-center">Honor P</th>
                <th className="p-2 border-r text-center">Bantu L</th>
                <th className="p-2 border-r text-center">Bantu P</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {dataUmumJorong.map(item => {
                const dasawisma = item.jumlah_dasawisma !== undefined ? item.jumlah_dasawisma : (item.dasawisma || 0);
                const kk = item.jumlah_kk !== undefined ? item.jumlah_kk : (item.kk || 0);
                const krt = item.jumlah_krt || 0;
                const jl = item.jiwa_l || 0;
                const jp = item.jiwa_p || 0;
                const al = item.anggota_l || 0;
                const ap = item.anggota_p || 0;
                
                return (
                  <tr key={item.jorong} className="hover:bg-gray-50/50 transition">
                    <td className="p-3 border-r font-bold text-gray-900">{item.jorong}</td>
                    <td className="p-2 border-r text-center">1</td>
                    <td className="p-2 border-r text-center font-bold text-emerald-850">{dasawisma}</td>
                    <td className="p-2 border-r text-center">{krt}</td>
                    <td className="p-2 border-r text-center">{kk}</td>
                    <td className="p-2 border-r text-center">{jl}</td>
                    <td className="p-2 border-r text-center">{jp}</td>
                    <td className="p-2 border-r text-center">{al}</td>
                    <td className="p-2 border-r text-center">{ap}</td>
                    <td className="p-2 border-r text-center bg-emerald-50/10 text-emerald-800">{item.kader_umum_l || 0}</td>
                    <td className="p-2 border-r text-center bg-emerald-50/10 text-emerald-800">{item.kader_umum_p || 0}</td>
                    <td className="p-2 border-r text-center bg-teal-50/10 text-teal-800">{item.kader_khusus_l || 0}</td>
                    <td className="p-2 border-r text-center bg-teal-50/10 text-teal-800">{item.kader_khusus_p || 0}</td>
                    <td className="p-2 border-r text-center">{item.tenaga_honorer_l || 0}</td>
                    <td className="p-2 border-r text-center">{item.tenaga_honorer_p || 0}</td>
                    <td className="p-2 border-r text-center">{item.tenaga_bantuan_l || 0}</td>
                    <td className="p-2 border-r text-center">{item.tenaga_bantuan_p || 0}</td>
                    <td className="p-3 text-center">
                      <button onClick={() => handleOpenEdit(item)} className="text-gray-400 hover:text-emerald-700 font-bold text-[9px]">Edit</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg border shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-emerald-900 text-white p-5 flex justify-between items-center">
              <h4 className="font-bold text-sm">Edit Data Umum PKK ({formData.jorong})</h4>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-200 hover:text-white text-lg font-bold">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto font-sans text-xs">
              <h5 className="font-bold border-b pb-1 text-emerald-800">Kelompok &amp; Rumah Tangga</h5>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Jml Kelompok Dasawisma</label>
                  <input type="number" value={formData.jumlah_dasawisma || 0} onChange={(e) => setFormData({...formData, jumlah_dasawisma: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Jumlah KRT (Kepala RT)</label>
                  <input type="number" value={formData.jumlah_krt || 0} onChange={(e) => setFormData({...formData, jumlah_krt: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Jumlah KK</label>
                  <input type="number" value={formData.jumlah_kk || 0} onChange={(e) => setFormData({...formData, jumlah_kk: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                </div>
              </div>

              <h5 className="font-bold border-b pb-1 text-emerald-800 pt-2">Kependudukan &amp; Anggota (L / P)</h5>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Jiwa Laki-Laki (L)</label>
                  <input type="number" value={formData.jiwa_l || 0} onChange={(e) => setFormData({...formData, jiwa_l: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Jiwa Perempuan (P)</label>
                  <input type="number" value={formData.jiwa_p || 0} onChange={(e) => setFormData({...formData, jiwa_p: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Anggota TP PKK (L)</label>
                  <input type="number" value={formData.anggota_l || 0} onChange={(e) => setFormData({...formData, anggota_l: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Anggota TP PKK (P)</label>
                  <input type="number" value={formData.anggota_p || 0} onChange={(e) => setFormData({...formData, anggota_p: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                </div>
              </div>

              <h5 className="font-bold border-b pb-1 text-emerald-800 pt-2">Kader PKK (L / P)</h5>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-emerald-800 mb-1">Kader Umum (L)</label>
                  <input type="number" value={formData.kader_umum_l || 0} onChange={(e) => setFormData({...formData, kader_umum_l: parseInt(e.target.value) || 0})} className="w-full border rounded p-2 border-emerald-200 bg-emerald-50/10" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-emerald-800 mb-1">Kader Umum (P)</label>
                  <input type="number" value={formData.kader_umum_p || 0} onChange={(e) => setFormData({...formData, kader_umum_p: parseInt(e.target.value) || 0})} className="w-full border rounded p-2 border-emerald-200 bg-emerald-50/10" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-teal-800 mb-1">Kader Khusus (L)</label>
                  <input type="number" value={formData.kader_khusus_l || 0} onChange={(e) => setFormData({...formData, kader_khusus_l: parseInt(e.target.value) || 0})} className="w-full border rounded p-2 border-teal-200 bg-teal-50/10" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-teal-800 mb-1">Kader Khusus (P)</label>
                  <input type="number" value={formData.kader_khusus_p || 0} onChange={(e) => setFormData({...formData, kader_khusus_p: parseInt(e.target.value) || 0})} className="w-full border rounded p-2 border-teal-200 bg-teal-50/10" />
                </div>
              </div>

              <h5 className="font-bold border-b pb-1 text-emerald-800 pt-2">Tenaga Sekretariat (L / P)</h5>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Honorer (L)</label>
                  <input type="number" value={formData.tenaga_honorer_l || 0} onChange={(e) => setFormData({...formData, tenaga_honorer_l: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Honorer (P)</label>
                  <input type="number" value={formData.tenaga_honorer_p || 0} onChange={(e) => setFormData({...formData, tenaga_honorer_p: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Bantuan (L)</label>
                  <input type="number" value={formData.tenaga_bantuan_l || 0} onChange={(e) => setFormData({...formData, tenaga_bantuan_l: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Bantuan (P)</label>
                  <input type="number" value={formData.tenaga_bantuan_p || 0} onChange={(e) => setFormData({...formData, tenaga_bantuan_p: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
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
    </div>
  );
}

export default UmumAdmin;
