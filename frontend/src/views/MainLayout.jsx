import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BerandaView from './BerandaView';
import DataPublikView from './DataPublikView';
import ProfilView from './ProfilView';
import KegiatanView from './KegiatanView';
import KeuanganView from './KeuanganView';
import AdminLoginModal from '../components/AdminLoginModal';
import AdminDashboardView from './AdminDashboardView';

// --- DATA TIRUAN AWAL (NAGARI SUAYAN) ---
const initialEkspedisi = [
  { id: 1, tanggal: '2026-07-10', nomor_surat: '045/PKK-SUAYAN/VII/2026', alamat_tujuan: 'TP-PKK Kecamatan Akabiluru', perihal: 'Undangan Rapat Koordinasi Bulanan Pokja III' },
  { id: 2, tanggal: '2026-07-12', nomor_surat: '046/PKK-SUAYAN/VII/2026', alamat_tujuan: 'Kantor Wali Nagari Suayan', perihal: 'Laporan Bulanan Pelaksanaan Kampung Mandiri' }
];

const initialAnggota = [
  { id: 1, nama: 'Ibu Ketua TP-PKK Suayan', jabatan: 'Ketua TP-PKK', jorong: 'Suayan Tinggi' },
  { id: 2, nama: 'Ibu Sekretaris PKK Suayan', jabatan: 'Sekretaris', jorong: 'Suayan Sabar' }
];

function MainLayout() {
  const [currentTab, setCurrentTab] = useState('beranda');
  const [activeDataMenu, setActiveDataMenu] = useState('ekspedisi');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminPreview, setIsAdminPreview] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  const [dataEkspedisi, setDataEkspedisi] = useState(initialEkspedisi);
  const [dataAnggota, setDataAnggota] = useState(initialAnggota);
  const [jorongFilter, setJorongFilter] = useState('Semua');
  const [formSurat, setFormSurat] = useState({ tanggal: '', nomor_surat: '', alamat_tujuan: '', perihal: '' });

  // --- STATE DATA POSYANDU & INVENTARIS ---
  const [dataPosyandu, setDataPosyandu] = useState([
    { id: 1, jorong: "Suayan Tinggi", posyandu: "Posyandu Mawar", pengunjung: 47, petugas: 5, bayi_lahir: 2, meninggal: 0, s: 47, k: 45, d: 43, n: 38, bcg: 2, dpt: 5, polio: 5, campak: 3, hepb: 2 },
    { id: 2, jorong: "Suayan Sabar", posyandu: "Posyandu Melati", pengunjung: 52, petugas: 5, bayi_lahir: 3, meninggal: 0, s: 52, k: 50, d: 48, n: 42, bcg: 3, dpt: 6, polio: 6, campak: 4, hepb: 3 },
    { id: 3, jorong: "Suayan Randah", posyandu: "Posyandu Anggrek", pengunjung: 35, petugas: 4, bayi_lahir: 1, meninggal: 0, s: 35, k: 34, d: 32, n: 28, bcg: 1, dpt: 3, polio: 3, campak: 2, hepb: 1 }
  ]);

  const [dataInventaris, setDataInventaris] = useState([
    { id: 1, nama_barang: "Timbangan Balita Digital", asal_barang: "APBN", tanggal_penerimaan: "2026-05-10", jumlah: 4, tempat_penyimpanan: "Kantor Wali Nagari", kondisi_barang: "Baik", keterangan: "Digunakan di posyandu balita jorong" },
    { id: 2, nama_barang: "Lemari Arsip PKK", asal_barang: "Dana Desa", tanggal_penerimaan: "2026-06-01", jumlah: 1, tempat_penyimpanan: "Aula PKK Nagari", kondisi_barang: "Baik", keterangan: "Untuk penyimpanan buku administrasi" }
  ]);

  // --- STATE DATA KEUANGAN & KEGIATAN ---
  const [dataKeuangan, setDataKeuangan] = useState([
    { id: 1, tanggal: "2026-07-01", sumber_dana: "Dana Desa", uraian: "Penerimaan insentif kader PKK triwulan II", nomor_bukti_kas: "BKK-01/VII", nominal_penerimaan: 2500000, nominal_pengeluaran: 0 },
    { id: 2, tanggal: "2026-07-05", sumber_dana: "Dana Desa", uraian: "Pembelian ATK, fotokopi laporan, dan cetak baliho sosialisasi program kerja", nomor_bukti_kas: "BKK-02/VII", nominal_penerimaan: 0, nominal_pengeluaran: 450000 },
    { id: 3, tanggal: "2026-07-08", sumber_dana: "Swadaya", uraian: "Sumbangan swadaya donatur untuk bakti sosial pemberian PMT (Pemberian Makanan Tambahan) posyandu", nomor_bukti_kas: "BKK-03/VII", nominal_penerimaan: 1200000, nominal_pengeluaran: 0 },
    { id: 4, tanggal: "2026-07-10", sumber_dana: "Swadaya", uraian: "Pembelian paket bahan pangan PMT balita dan lansia Posyandu Mawar", nomor_bukti_kas: "BKK-04/VII", nominal_penerimaan: 0, nominal_pengeluaran: 950000 }
  ]);

  const [dataKegiatan, setDataKegiatan] = useState([
    { id: 1, nama: "Hj. Rahmawati, S.Pd", jabatan: "Ketua TP-PKK", tanggal: "2026-07-10", tempat: "Aula Kantor Nagari Suayan", uraian_kegiatan: "Rapat Koordinasi Bulanan TP-PKK Nagari Suayan dalam rangka evaluasi program kerja triwulan kedua dan persiapan lomba Dasa Wisma tingkat Kabupaten.", kategori: "Rapat", foto: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&q=80&w=600" },
    { id: 2, nama: "Bidan Srimulyani, A.Md.Keb", jabatan: "Ketua Pokja IV", tanggal: "2026-07-12", tempat: "Posyandu Mawar Nagari Suayan", uraian_kegiatan: "Pelayanan Posyandu Balita bulanan meliputi penimbangan berat badan, pengukuran tinggi badan, pemberian imunisasi wajib, serta edukasi gizi bagi ibu menyusui.", kategori: "Posyandu", foto: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600" },
    { id: 3, nama: "Rosmiati Zein", jabatan: "Ketua Pokja I", tanggal: "2026-07-13", tempat: "Jorong Suayan Tinggi", uraian_kegiatan: "Kerja bakti gotong royong massal warga jorong untuk membersihkan saluran air dan pekarangan dalam rangka pencegahan demam berdarah.", kategori: "Sosial", foto: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=600" }
  ]);

  // --- STATES DATA STATISTIK DASHBOARD (NAGARI SUAYAN) ---
  const [dataUmumJorong, setDataUmumJorong] = useState([
    { jorong: "Suayan Sabar", kk: 287, jiwa: 1142, anggota: 72, dasawisma: 9 },
    { jorong: "Suayan Tinggi", kk: 312, jiwa: 1267, anggota: 81, dasawisma: 10 },
    { jorong: "Suayan Randah", kk: 198, jiwa: 782, anggota: 54, dasawisma: 7 },
    { jorong: "Suayan Soriak", kk: 450, jiwa: 1811, anggota: 105, dasawisma: 16 }
  ]);

  const [dataPokja1, setDataPokja1] = useState([
    { jorong: "Suayan Sabar", pkbn_kel: 3, pkbn_ang: 15, pkdrt_kel: 2, pola_kel: 3, lansia_kel: 2, gotong: 12, arisan: 4 },
    { jorong: "Suayan Tinggi", pkbn_kel: 4, pkbn_ang: 20, pkdrt_kel: 3, pola_kel: 4, lansia_kel: 3, gotong: 15, arisan: 5 },
    { jorong: "Suayan Randah", pkbn_kel: 2, pkbn_ang: 10, pkdrt_kel: 1, pola_kel: 2, lansia_kel: 1, gotong: 8, arisan: 3 },
    { jorong: "Suayan Soriak", pkbn_kel: 5, pkbn_ang: 25, pkdrt_kel: 4, pola_kel: 5, lansia_kel: 4, gotong: 18, arisan: 8 }
  ]);

  const [dataPokja2, setDataPokja2] = useState([
    { jorong: "Suayan Sabar", baca: 1, up2k_kel: 2, up2k_pes: 12, mikro: 4, toko: 1, koperasi: 1 },
    { jorong: "Suayan Tinggi", baca: 1, up2k_kel: 3, up2k_pes: 18, mikro: 6, toko: 1, koperasi: 1 },
    { jorong: "Suayan Randah", baca: 0, up2k_kel: 1, up2k_pes: 8, mikro: 3, toko: 0, koperasi: 0 },
    { jorong: "Suayan Soriak", baca: 2, up2k_kel: 4, up2k_pes: 22, mikro: 8, toko: 1, koperasi: 2 }
  ]);

  const [dataPokja3, setDataPokja3] = useState([
    { jorong: "Suayan Sabar", kp: 5, ks: 4, ternak: 45, ikan: 30, warung: 52, toga: 64, r_sehat: 212, r_kurang: 75 },
    { jorong: "Suayan Tinggi", kp: 6, ks: 5, ternak: 50, ikan: 40, warung: 60, toga: 75, r_sehat: 240, r_kurang: 72 },
    { jorong: "Suayan Randah", kp: 3, ks: 3, ternak: 28, ikan: 20, warung: 35, toga: 40, r_sehat: 150, r_kurang: 48 },
    { jorong: "Suayan Soriak", kp: 8, ks: 6, ternak: 82, ikan: 65, warung: 95, toga: 110, r_sehat: 320, r_kurang: 130 }
  ]);

  const [dataPokja4, setDataPokja4] = useState([
    { jorong: "Suayan Sabar", k_pos: 10, k_phbs: 5, k_kb: 4, pos: 2, jamban: 260, mck: 4, kb_asep: 185 },
    { jorong: "Suayan Tinggi", k_pos: 12, k_phbs: 6, k_kb: 5, pos: 2, jamban: 290, mck: 5, kb_asep: 210 },
    { jorong: "Suayan Randah", k_pos: 8, k_phbs: 4, k_kb: 3, pos: 1, jamban: 180, mck: 2, kb_asep: 120 },
    { jorong: "Suayan Soriak", k_pos: 16, k_phbs: 10, k_kb: 8, pos: 3, jamban: 410, mck: 8, kb_asep: 295 }
  ]);

  const [dataKeluarga, setDataKeluarga] = useState([]);
  const [dataWarga, setDataWarga] = useState([]);
  const [dataProker, setDataProker] = useState([]);
  const [dataOrganisasi, setDataOrganisasi] = useState([]);

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const resEkspedisi = await fetch(`${API_URL}/ekspedisi`);
        if (resEkspedisi.ok) setDataEkspedisi(await resEkspedisi.json());
        
        const resAnggota = await fetch(`${API_URL}/anggota`);
        if (resAnggota.ok) setDataAnggota(await resAnggota.json());

        const resPosyandu = await fetch(`${API_URL}/posyandu`);
        if (resPosyandu.ok) setDataPosyandu(await resPosyandu.json());

        const resInventaris = await fetch(`${API_URL}/inventaris`);
        if (resInventaris.ok) setDataInventaris(await resInventaris.json());

        const resKeuangan = await fetch(`${API_URL}/keuangan`);
        if (resKeuangan.ok) setDataKeuangan(await resKeuangan.json());

        const resKegiatan = await fetch(`${API_URL}/kegiatan`);
        if (resKegiatan.ok) setDataKegiatan(await resKegiatan.json());

        const resPokja1 = await fetch(`${API_URL}/pokja/1`);
        if (resPokja1.ok) {
          const rows = await resPokja1.json();
          if (rows.length > 0) {
            setDataPokja1(rows.map(r => ({
              jorong: r.jorong,
              pkbn_kel: r.pkbn_simulasi_kelompok,
              pkbn_ang: r.pkbn_simulasi_anggota,
              pkdrt_kel: r.pkdrt_simulasi_kelompok,
              pola_kel: r.pola_asuh_simulasi_kelompok,
              lansia_kel: r.lansia_kelompok,
              gotong: r.kerja_bakti,
              arisan: r.arisan
            })));
          }
        }

        const resPokja2 = await fetch(`${API_URL}/pokja/2`);
        if (resPokja2.ok) {
          const rows = await resPokja2.json();
          if (rows.length > 0) {
            setDataPokja2(rows.map(r => ({
              jorong: r.jorong,
              baca: r.taman_bacaan,
              up2k_kel: r.up2k_pemula_kelompok,
              up2k_pes: r.up2k_pemula_peserta,
              mikro: r.usaha_mikro,
              toko: r.toko_pkk,
              koperasi: r.koperasi_hukum_jumlah
            })));
          }
        }

        const resPokja3 = await fetch(`${API_URL}/pokja/3`);
        if (resPokja3.ok) {
          const rows = await resPokja3.json();
          if (rows.length > 0) {
            setDataPokja3(rows.map(r => ({
              jorong: r.jorong,
              kp: r.kader_pangan,
              ks: r.kader_sandang,
              ternak: r.pekarangan_peternakan,
              ikan: r.pekarangan_perikanan,
              warung: r.pekarangan_warung_hidup,
              toga: r.pekarangan_toga,
              r_sehat: r.rumah_sehat,
              r_kurang: r.rumah_kurang_sehat
            })));
          }
        }

        const resPokja4 = await fetch(`${API_URL}/pokja/4`);
        if (resPokja4.ok) {
          const rows = await resPokja4.json();
          if (rows.length > 0) {
            setDataPokja4(rows.map(r => ({
              jorong: r.jorong,
              k_pos: r.kader_posyandu,
              k_phbs: r.kader_phbs,
              k_kb: r.kader_kb,
              pos: r.jumlah_posyandu,
              jamban: r.memiliki_kartu_jamban,
              mck: r.memiliki_mck,
              kb_asep: r.aseptor_kb_p
            })));
          }
        }

        const resUmum = await fetch(`${API_URL}/umum`);
        if (resUmum.ok) {
          const rows = await resUmum.json();
          if (rows.length > 0) {
            setDataUmumJorong(rows.map(r => ({
              jorong: r.jorong,
              kk: r.jumlah_kk,
              jiwa: r.jiwa_l + r.jiwa_p,
              anggota: r.anggota_l + r.anggota_p,
              dasawisma: r.jumlah_dasawisma,
              jumlah_dasawisma: r.jumlah_dasawisma,
              jumlah_krt: r.jumlah_krt,
              jumlah_kk: r.jumlah_kk,
              jiwa_l: r.jiwa_l,
              jiwa_p: r.jiwa_p,
              anggota_l: r.anggota_l,
              anggota_p: r.anggota_p,
              kader_umum_l: r.kader_umum_l,
              kader_umum_p: r.kader_umum_p,
              kader_khusus_l: r.kader_khusus_l,
              kader_khusus_p: r.kader_khusus_p,
              tenaga_honorer_l: r.tenaga_honorer_l,
              tenaga_honorer_p: r.tenaga_honorer_p,
              tenaga_bantuan_l: r.tenaga_bantuan_l,
              tenaga_bantuan_p: r.tenaga_bantuan_p,
              keterangan: r.keterangan
            })));
          }
        }

        const resKeluarga = await fetch(`${API_URL}/keluarga`);
        if (resKeluarga.ok) setDataKeluarga(await resKeluarga.json());

        const resWarga = await fetch(`${API_URL}/warga`);
        if (resWarga.ok) setDataWarga(await resWarga.json());

        const resProker = await fetch(`${API_URL}/proker`);
        if (resProker.ok) setDataProker(await resProker.json());

        const resOrganisasi = await fetch(`${API_URL}/organisasi`);
        if (resOrganisasi.ok) setDataOrganisasi(await resOrganisasi.json());
      } catch (err) {
        console.warn('Gagal memuat data dari server backend. Menggunakan mock data lokal.', err.message);
      }
    };

    fetchAllData();
  }, []);

  const handleAddSurat = async (e) => {
    e.preventDefault();
    if (!formSurat.tanggal || !formSurat.nomor_surat) return;
    const newSurat = {
      tanggal: formSurat.tanggal,
      nomor_surat: formSurat.nomor_surat,
      alamat_tujuan: formSurat.alamat_tujuan,
      perihal: formSurat.perihal
    };

    try {
      const res = await fetch(`${API_URL}/ekspedisi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSurat)
      });
      if (res.ok) {
        const saved = await res.json();
        setDataEkspedisi([...dataEkspedisi, saved]);
        setFormSurat({ tanggal: '', nomor_surat: '', alamat_tujuan: '', perihal: '' });
      } else {
        setDataEkspedisi([...dataEkspedisi, { id: Date.now(), ...newSurat }]);
        setFormSurat({ tanggal: '', nomor_surat: '', alamat_tujuan: '', perihal: '' });
      }
    } catch (err) {
      setDataEkspedisi([...dataEkspedisi, { id: Date.now(), ...newSurat }]);
      setFormSurat({ tanggal: '', nomor_surat: '', alamat_tujuan: '', perihal: '' });
    }
  };

  const handleDeleteSurat = async (id) => {
    try {
      const res = await fetch(`${API_URL}/ekspedisi/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDataEkspedisi(dataEkspedisi.filter(item => item.id !== id));
      } else {
        setDataEkspedisi(dataEkspedisi.filter(item => item.id !== id));
      }
    } catch (err) {
      setDataEkspedisi(dataEkspedisi.filter(item => item.id !== id));
    }
  };

  if (isAdmin && !isAdminPreview) {
    return (
      <AdminDashboardView
        setIsAdmin={setIsAdmin}
        setIsAdminPreview={setIsAdminPreview}
        dataEkspedisi={dataEkspedisi}
        setDataEkspedisi={setDataEkspedisi}
        dataAnggota={dataAnggota}
        setDataAnggota={setDataAnggota}
        dataPosyandu={dataPosyandu}
        setDataPosyandu={setDataPosyandu}
        dataInventaris={dataInventaris}
        setDataInventaris={setDataInventaris}
        dataKeuangan={dataKeuangan}
        setDataKeuangan={setDataKeuangan}
        dataKegiatan={dataKegiatan}
        setDataKegiatan={setDataKegiatan}
        dataUmumJorong={dataUmumJorong}
        setDataUmumJorong={setDataUmumJorong}
        dataPokja1={dataPokja1}
        setDataPokja1={setDataPokja1}
        dataPokja2={dataPokja2}
        setDataPokja2={setDataPokja2}
        dataPokja3={dataPokja3}
        setDataPokja3={setDataPokja3}
        dataPokja4={dataPokja4}
        setDataPokja4={setDataPokja4}
        dataKeluarga={dataKeluarga}
        setDataKeluarga={setDataKeluarga}
        dataWarga={dataWarga}
        setDataWarga={setDataWarga}
        dataProker={dataProker}
        setDataProker={setDataProker}
        dataOrganisasi={dataOrganisasi}
        setDataOrganisasi={setDataOrganisasi}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col relative">
      {/* Top Banner for Admin Preview Mode */}
      {isAdmin && isAdminPreview && (
        <div className="bg-amber-500 text-amber-950 px-4 py-2.5 text-center text-xs font-bold flex justify-between items-center relative z-50 shadow">
          <span></span>
          <span>Anda sedang melihat pratinjau halaman publik</span>
          <button 
            onClick={() => setIsAdminPreview(false)}
            className="bg-amber-950 text-white px-3 py-1 rounded text-[10px] font-bold hover:bg-amber-900 transition"
          >
            Kembali ke Admin
          </button>
        </div>
      )}

      {/* Komponen Navigasi Atas */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        setActiveDataMenu={setActiveDataMenu}
        isAdmin={isAdmin} 
        setIsAdmin={setIsAdmin} 
        onLoginClick={() => setIsLoginOpen(true)}
      />

      {/* Konten Utama Dinamis */}
      <main className="flex-grow">
        {currentTab === 'beranda' && <BerandaView setCurrentTab={setCurrentTab} />}
        {currentTab === 'profil' && <ProfilView />}
        {currentTab === 'kegiatan' && (
          <KegiatanView 
            isAdmin={isAdmin} 
            dataKegiatan={dataKegiatan}
            setDataKegiatan={setDataKegiatan}
          />
        )}
        {currentTab === 'keuangan' && (
          <KeuanganView 
            isAdmin={isAdmin} 
            dataKeuangan={dataKeuangan}
            setDataKeuangan={setDataKeuangan}
          />
        )}
        {currentTab === 'data_publik' && (
          <DataPublikView 
            activeDataMenu={activeDataMenu}
            setActiveDataMenu={setActiveDataMenu}
            isAdmin={isAdmin}
            dataEkspedisi={dataEkspedisi}
            dataAnggota={dataAnggota}
            jorongFilter={jorongFilter}
            setJorongFilter={setJorongFilter}
            formSurat={formSurat}
            setFormSurat={setFormSurat}
            handleAddSurat={handleAddSurat}
            handleDeleteSurat={handleDeleteSurat}
            setCurrentTab={setCurrentTab}
            dataUmumJorong={dataUmumJorong}
            setDataUmumJorong={setDataUmumJorong}
            dataPokja1={dataPokja1}
            setDataPokja1={setDataPokja1}
            dataPokja2={dataPokja2}
            setDataPokja2={setDataPokja2}
            dataPokja3={dataPokja3}
            setDataPokja3={setDataPokja3}
            dataPokja4={dataPokja4}
            setDataPokja4={setDataPokja4}
            dataPosyandu={dataPosyandu}
          />
        )}
      </main>

      {/* Komponen Kaki Halaman */}
      <Footer setCurrentTab={setCurrentTab} setActiveDataMenu={setActiveDataMenu} />

      {/* Modal Login Admin */}
      <AdminLoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLoginSuccess={() => {
          setIsAdmin(true);
          setIsLoginOpen(false);
        }}
      />
    </div>
  );
}

export default MainLayout;