import React, { useState } from 'react';

function PokjaAdmin({
  dataPokja1, setDataPokja1,
  dataPokja2, setDataPokja2,
  dataPokja3, setDataPokja3,
  dataPokja4, setDataPokja4,
  API_URL
}) {
  const [activePokjaTab, setActivePokjaTab] = useState('Pokja I');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null); // jorong name
  const [formData, setFormData] = useState({});

  const handleOpenEdit = (item) => {
    setEditId(item.jorong);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const pokjaId = activePokjaTab === 'Pokja I' ? 1 : activePokjaTab === 'Pokja II' ? 2 : activePokjaTab === 'Pokja III' ? 3 : 4;
    const url = `${API_URL}/pokja/${pokjaId}/${editId}`;

    let bodyData = { ...formData };
    if (activePokjaTab === 'Pokja I') {
      bodyData = {
        pkbn_simulasi_kelompok: formData.pkbn_kel,
        pkbn_simulasi_anggota: formData.pkbn_ang,
        pkdrt_simulasi_kelompok: formData.pkdrt_kel,
        pola_asuh_simulasi_kelompok: formData.pola_kel,
        lansia_kelompok: formData.lansia_kel,
        kerja_bakti: formData.gotong,
        arisan: formData.arisan
      };
    } else if (activePokjaTab === 'Pokja II') {
      bodyData = {
        taman_bacaan: formData.baca,
        up2k_pemula_kelompok: formData.up2k_kel,
        up2k_pemula_peserta: formData.up2k_pes,
        usaha_mikro: formData.mikro,
        toko_pkk: formData.toko,
        koperasi_hukum_jumlah: formData.koperasi
      };
    } else if (activePokjaTab === 'Pokja III') {
      bodyData = {
        kader_pangan: formData.kp,
        kader_sandang: formData.ks,
        pekarangan_peternakan: formData.ternak,
        pekarangan_perikanan: formData.ikan,
        pekarangan_warung_hidup: formData.warung,
        pekarangan_toga: formData.toga,
        rumah_sehat: formData.r_sehat,
        rumah_kurang_sehat: formData.r_kurang
      };
    } else if (activePokjaTab === 'Pokja IV') {
      bodyData = {
        kader_posyandu: formData.k_pos,
        kader_phbs: formData.k_phbs,
        kader_kb: formData.k_kb,
        jumlah_posyandu: formData.pos,
        memiliki_kartu_jamban: formData.jamban,
        memiliki_mck: formData.mck,
        aseptor_kb_p: formData.kb_asep
      };
    }

    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
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
    if (activePokjaTab === 'Pokja I') {
      setDataPokja1(dataPokja1.map(item => item.jorong === editId ? { ...item, ...formData } : item));
    } else if (activePokjaTab === 'Pokja II') {
      setDataPokja2(dataPokja2.map(item => item.jorong === editId ? { ...item, ...formData } : item));
    } else if (activePokjaTab === 'Pokja III') {
      setDataPokja3(dataPokja3.map(item => item.jorong === editId ? { ...item, ...formData } : item));
    } else if (activePokjaTab === 'Pokja IV') {
      setDataPokja4(dataPokja4.map(item => item.jorong === editId ? { ...item, ...formData } : item));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h3 className="text-xl font-extrabold text-gray-800 font-serif">Data Pokja I - IV</h3>
        <div className="flex space-x-2">
          {['Pokja I', 'Pokja II', 'Pokja III', 'Pokja IV'].map(tab => (
            <button
              key={tab}
              onClick={() => setActivePokjaTab(tab)}
              className={`px-4 py-2 text-xs font-bold rounded border transition ${activePokjaTab === tab ? 'bg-emerald-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activePokjaTab === 'Pokja I' && (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-xs font-medium text-gray-700">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Jorong</th>
                <th className="p-4 text-center">PKBN Kelompok</th>
                <th className="p-4 text-center">PKBN Anggota</th>
                <th className="p-4 text-center">PKDRT Kelompok</th>
                <th className="p-4 text-center">Pola Asuh Kelompok</th>
                <th className="p-4 text-center">Lansia Kelompok</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {dataPokja1.map(item => (
                <tr key={item.jorong} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-bold text-gray-900">{item.jorong}</td>
                  <td className="p-4 text-center">{item.pkbn_kel}</td>
                  <td className="p-4 text-center">{item.pkbn_ang}</td>
                  <td className="p-4 text-center">{item.pkdrt_kel}</td>
                  <td className="p-4 text-center">{item.pola_kel}</td>
                  <td className="p-4 text-center">{item.lansia_kel}</td>
                  <td className="p-4 text-center">
                    <button onClick={() => handleOpenEdit(item)} className="text-gray-400 hover:text-emerald-700 font-bold">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activePokjaTab === 'Pokja II' && (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-xs font-medium text-gray-700">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Jorong</th>
                <th className="p-4 text-center">Taman Bacaan</th>
                <th className="p-4 text-center">Kel. UP2K</th>
                <th className="p-4 text-center">Peserta UP2K</th>
                <th className="p-4 text-center">Usaha Mikro</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {dataPokja2.map(item => (
                <tr key={item.jorong} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-bold text-gray-900">{item.jorong}</td>
                  <td className="p-4 text-center">{item.baca}</td>
                  <td className="p-4 text-center">{item.up2k_kel}</td>
                  <td className="p-4 text-center">{item.up2k_pes}</td>
                  <td className="p-4 text-center">{item.mikro}</td>
                  <td className="p-4 text-center">
                    <button onClick={() => handleOpenEdit(item)} className="text-gray-400 hover:text-emerald-700 font-bold">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activePokjaTab === 'Pokja III' && (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-xs font-medium text-gray-700">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Jorong</th>
                <th className="p-4 text-center">Kader Pangan</th>
                <th className="p-4 text-center">Kader Sandang</th>
                <th className="p-4 text-center">Ternak Pekarangan</th>
                <th className="p-4 text-center">Warung Hidup</th>
                <th className="p-4 text-center text-emerald-800">Rumah Sehat</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {dataPokja3.map(item => (
                <tr key={item.jorong} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-bold text-gray-900">{item.jorong}</td>
                  <td className="p-4 text-center">{item.kp}</td>
                  <td className="p-4 text-center">{item.ks}</td>
                  <td className="p-4 text-center">{item.ternak}</td>
                  <td className="p-4 text-center">{item.warung}</td>
                  <td className="p-4 text-center text-emerald-800 font-bold">{item.r_sehat}</td>
                  <td className="p-4 text-center">
                    <button onClick={() => handleOpenEdit(item)} className="text-gray-400 hover:text-emerald-700 font-bold">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activePokjaTab === 'Pokja IV' && (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-xs font-medium text-gray-700">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Jorong</th>
                <th className="p-4 text-center">Kader Posyandu</th>
                <th className="p-4 text-center">Kader PHBS</th>
                <th className="p-4 text-center">Kader KB</th>
                <th className="p-4 text-center">Miliki Jamban</th>
                <th className="p-4 text-center">Aseptor KB</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {dataPokja4.map(item => (
                <tr key={item.jorong} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-bold text-gray-900">{item.jorong}</td>
                  <td className="p-4 text-center">{item.k_pos}</td>
                  <td className="p-4 text-center">{item.k_phbs}</td>
                  <td className="p-4 text-center">{item.k_kb}</td>
                  <td className="p-4 text-center">{item.jamban}</td>
                  <td className="p-4 text-center">{item.kb_asep}</td>
                  <td className="p-4 text-center">
                    <button onClick={() => handleOpenEdit(item)} className="text-gray-400 hover:text-emerald-700 font-bold">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg border shadow-xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-emerald-900 text-white p-5 flex justify-between items-center">
              <h4 className="font-bold text-sm">Edit Data {activePokjaTab} ({formData.jorong})</h4>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-200 hover:text-white text-lg font-bold">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto font-sans text-xs">
              
              {activePokjaTab === 'Pokja I' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">PKBN Kelompok</label>
                    <input type="number" value={formData.pkbn_kel || 0} onChange={(e) => setFormData({...formData, pkbn_kel: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">PKBN Anggota</label>
                    <input type="number" value={formData.pkbn_ang || 0} onChange={(e) => setFormData({...formData, pkbn_ang: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">PKDRT Kelompok</label>
                    <input type="number" value={formData.pkdrt_kel || 0} onChange={(e) => setFormData({...formData, pkdrt_kel: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Pola Asuh Kelompok</label>
                    <input type="number" value={formData.pola_kel || 0} onChange={(e) => setFormData({...formData, pola_kel: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Lansia Kelompok</label>
                    <input type="number" value={formData.lansia_kel || 0} onChange={(e) => setFormData({...formData, lansia_kel: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Kerja Bakti</label>
                    <input type="number" value={formData.gotong || 0} onChange={(e) => setFormData({...formData, gotong: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Arisan</label>
                    <input type="number" value={formData.arisan || 0} onChange={(e) => setFormData({...formData, arisan: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                  </div>
                </div>
              )}

              {activePokjaTab === 'Pokja II' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Taman Bacaan</label>
                    <input type="number" value={formData.baca || 0} onChange={(e) => setFormData({...formData, baca: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Kel. UP2K</label>
                    <input type="number" value={formData.up2k_kel || 0} onChange={(e) => setFormData({...formData, up2k_kel: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Peserta UP2K</label>
                    <input type="number" value={formData.up2k_pes || 0} onChange={(e) => setFormData({...formData, up2k_pes: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Usaha Mikro</label>
                    <input type="number" value={formData.mikro || 0} onChange={(e) => setFormData({...formData, mikro: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Toko PKK</label>
                    <input type="number" value={formData.toko || 0} onChange={(e) => setFormData({...formData, toko: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Koperasi Hukum</label>
                    <input type="number" value={formData.koperasi || 0} onChange={(e) => setFormData({...formData, koperasi: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                  </div>
                </div>
              )}

              {activePokjaTab === 'Pokja III' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Kader Pangan</label>
                    <input type="number" value={formData.kp || 0} onChange={(e) => setFormData({...formData, kp: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Kader Sandang</label>
                    <input type="number" value={formData.ks || 0} onChange={(e) => setFormData({...formData, ks: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Ternak Pekarangan</label>
                    <input type="number" value={formData.ternak || 0} onChange={(e) => setFormData({...formData, ternak: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Warung Hidup</label>
                    <input type="number" value={formData.warung || 0} onChange={(e) => setFormData({...formData, warung: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Toga</label>
                    <input type="number" value={formData.toga || 0} onChange={(e) => setFormData({...formData, toga: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-850 mb-1">Rumah Sehat</label>
                    <input type="number" value={formData.r_sehat || 0} onChange={(e) => setFormData({...formData, r_sehat: parseInt(e.target.value) || 0})} className="w-full border rounded p-2 border-emerald-300" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-red-850 mb-1">Rumah Kurang Sehat</label>
                    <input type="number" value={formData.r_kurang || 0} onChange={(e) => setFormData({...formData, r_kurang: parseInt(e.target.value) || 0})} className="w-full border rounded p-2 border-red-300" />
                  </div>
                </div>
              )}

              {activePokjaTab === 'Pokja IV' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Kader Posyandu</label>
                    <input type="number" value={formData.k_pos || 0} onChange={(e) => setFormData({...formData, k_pos: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Kader PHBS</label>
                    <input type="number" value={formData.k_phbs || 0} onChange={(e) => setFormData({...formData, k_phbs: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Kader KB</label>
                    <input type="number" value={formData.k_kb || 0} onChange={(e) => setFormData({...formData, k_kb: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Jumlah Posyandu</label>
                    <input type="number" value={formData.pos || 0} onChange={(e) => setFormData({...formData, pos: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Miliki Jamban</label>
                    <input type="number" value={formData.jamban || 0} onChange={(e) => setFormData({...formData, jamban: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Miliki MCK</label>
                    <input type="number" value={formData.mck || 0} onChange={(e) => setFormData({...formData, mck: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Aseptor KB</label>
                    <input type="number" value={formData.kb_asep || 0} onChange={(e) => setFormData({...formData, kb_asep: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" />
                  </div>
                </div>
              )}

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

export default PokjaAdmin;
