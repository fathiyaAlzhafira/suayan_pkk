import React from 'react';

function ProfilView() {
    // Data pengurus TP-PKK Nagari Suayan
    const pimpinan = [
        { nama: "Hj. Rahmawati, S.Pd", jabatan: "Ketua TP-PKK Nagari", foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200" },
        { nama: "Dra. Ningsih Marlina", jabatan: "Wakil Ketua", foto: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200" }
    ];

    const sekretariat = [
        { nama: "Fitri Rahayu, S.E", jabatan: "Sekretaris", foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" },
        { nama: "Dewi Susanti, A.Md", jabatan: "Bendahara", foto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" }
    ];

    const pokja = [
        { nama: "Rosmiati Zein", pokja: "Pokja I", jabatan: "Ketua Pokja I", warna: "bg-blue-600", foto: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=200" },
        { nama: "Erlinda Putri, S.Sos", pokja: "Pokja II", jabatan: "Ketua Pokja II", warna: "bg-orange-500", foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" },
        { nama: "Nurfazilah, S.P", pokja: "Pokja III", jabatan: "Ketua Pokja III", warna: "bg-green-700", foto: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=200" },
        { nama: "Bidan Srimulyani, A.Md.Keb", pokja: "Pokja IV", jabatan: "Ketua Pokja IV", warna: "bg-red-500", foto: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=200" }
    ];

    return (
        <div className="bg-[#fbfbfa] pb-20">

            {/* --- HEADER BANNER --- */}
            <div className="bg-emerald-900 text-white text-center py-16 px-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 block mb-1">WEB PROFILE</span>
                <h1 className="text-3xl sm:text-4xl font-bold font-serif tracking-wide">Profil TP-PKK Nagari</h1>
                <p className="text-xs text-emerald-200 mt-1 font-semibold uppercase tracking-wider">Nagari Suayan, Kec. Akabiluru</p>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-24">

                {/* --- SECTION 1: LATAR BELAKANG --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 block">Latar Belakang</span>
                        <h2 className="text-3xl font-bold text-gray-900 font-serif leading-snug">Sejarah Singkat PKK Nagari Suayan</h2>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Tim Penggerak PKK (TP-PKK) Nagari Suayan berdiri sebagai wadah pemberdayaan masyarakat yang mandiri secara berkelanjutan, berpusat pada kesejahteraan keluarga di ranah Nagari.
                        </p>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Organisasi ini secara aktif menggerakkan 10 Program Pokok PKK demi mendukung pembangunan daerah dalam hal peningkatan kualitas hidup spiritual, pendidikan, pangan, sandang, tata rumah tangga, dan kesehatan lingkungan.
                        </p>
                        <p className="text-xs text-gray-500 leading-relaxed font-semibold text-emerald-800">
                            Di bawah bimbingan Ibu Hj. Rahmawati, S.Pd, TP-PKK Nagari Suayan berkomitmen mengintegrasikan layanan administrasi digital untuk mempermudah koordinasi kader dan jorong.
                        </p>
                    </div>

                    <div className="relative">
                        <div className="rounded-lg overflow-hidden border shadow-sm">
                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"
                                alt="Pengurus PKK"
                                className="w-full h-64 sm:h-80 object-cover"
                            />
                        </div>
                        {/* Badge Tahun */}
                        <div className="absolute -bottom-4 -left-4 bg-amber-500 text-amber-950 px-5 py-3 rounded-lg shadow font-serif text-center min-w-[120px]">
                          <span className="block text-2xl font-extrabold leading-none">14+</span>
                          <span className="text-[9px] uppercase font-extrabold tracking-wider block mt-1 font-sans">Tahun Berkhidmat</span>
                        </div>
                    </div>
                </div>

                {/* --- SECTION 2: VISI & MISI --- */}
                <div className="space-y-8">
                    <div className="text-center space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-850 block">Arah Gerak</span>
                        <h2 className="text-3xl font-bold text-gray-900 font-serif">Visi &amp; Misi Utama</h2>
                        <div className="w-8 h-1 bg-amber-500 mx-auto rounded-full mt-2"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Kotak Visi */}
                        <div className="bg-emerald-950 text-emerald-100 p-8 rounded-lg flex flex-col justify-center shadow-sm border border-emerald-900/10">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400 mb-3 block">VISI</span>
                            <p className="text-sm font-serif italic font-medium leading-relaxed">
                                "Terwujudnya keluarga yang beriman dan bertaqwa kepada Tuhan Yang Esa, berakhlak mulia dan berbudi luhur, sehat sejahtera, maju dan mandiri, kesetaraan gender serta kesadaran hukum dan kelestarian lingkungan."
                            </p>
                        </div>

                        {/* Kotak Misi */}
                        <div className="bg-white border p-8 rounded-lg shadow-sm space-y-4">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 block">MISI</span>
                            <ul className="space-y-3.5 text-xs text-gray-600 font-medium">
                                {[
                                  "Meningkatkan pembinaan perilaku hidup dengan penghayatan Pancasila serta pelaksanaan hak dan kewajiban warga.",
                                  "Meningkatkan pendidikan, keterampilan, dan keterampilan hidup warga guna mendukung ekonomi kreatif.",
                                  "Mengupayakan ketahanan pangan keluarga yang cukup, sehat, seimbang, dan bergizi.",
                                  "Meningkatkan derajat kesehatan keluarga, sanitasi lingkungan hidup, serta pembiasaan hidup sehat berencana."
                                ].map((misiText, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="w-5 h-5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-full flex items-center justify-center mr-3 shrink-0">{idx + 1}</span>
                                    <span className="leading-relaxed">{misiText}</span>
                                  </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* --- SECTION 3: STRUKTUR ORGANISASI --- */}
                <div className="space-y-12 text-center">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-850 block">Kepengurusan</span>
                        <h2 className="text-3xl font-bold text-gray-900 font-serif">Struktur Organisasi</h2>
                        <p className="text-xs text-gray-400 mt-1 font-semibold">Periode Bakti 2022 – 2027</p>
                        <div className="w-8 h-1 bg-emerald-800 mx-auto rounded-full mt-2"></div>
                    </div>

                    {/* 1. Baris Pimpinan */}
                    <div className="space-y-6">
                        <span className="inline-block bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase border border-emerald-100">Pimpinan Utama</span>
                        <div className="flex justify-center gap-12">
                            {pimpinan.map((p, idx) => (
                                <div key={idx} className="flex flex-col items-center group">
                                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-600 mb-3 p-0.5 shadow-sm group-hover:scale-105 transition duration-300">
                                        <img src={p.foto} alt={p.nama} className="w-full h-full object-cover rounded-full" />
                                    </div>
                                    <h4 className="text-xs font-bold text-gray-950">{p.nama}</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{p.jabatan}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. Baris Sekretariat */}
                    <div className="space-y-6 pt-4">
                        <span className="inline-block bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase border border-emerald-100">Sekretariat &amp; Keuangan</span>
                        <div className="flex justify-center gap-12">
                            {sekretariat.map((s, idx) => (
                                <div key={idx} className="flex flex-col items-center group">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border border-emerald-500/20 mb-3 p-0.5 shadow-sm group-hover:scale-105 transition duration-300">
                                        <img src={s.foto} alt={s.nama} className="w-full h-full object-cover rounded-full" />
                                    </div>
                                    <h4 className="text-xs font-bold text-gray-950">{s.nama}</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{s.jabatan}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. Baris Ketua Pokja I - IV */}
                    <div className="space-y-6 pt-6">
                        <span className="inline-block bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase border border-emerald-100">Ketua Kelompok Kerja (Pokja)</span>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                            {pokja.map((pk, idx) => (
                                <div key={idx} className="bg-white border border-gray-100 p-5 rounded-lg shadow-sm hover:shadow-md transition duration-300 flex flex-col items-center group">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border border-emerald-500/20 mb-3 shadow-inner group-hover:scale-105 transition duration-300">
                                        <img src={pk.foto} alt={pk.nama} className="w-full h-full object-cover" />
                                    </div>
                                    <span className={`text-[8px] text-white px-2 py-0.5 rounded font-extrabold uppercase ${pk.warna} mb-2 tracking-wider`}>
                                        {pk.pokja}
                                    </span>
                                    <h4 className="text-xs font-bold text-gray-950 text-center leading-snug">{pk.nama}</h4>
                                    <p className="text-[9px] text-gray-400 font-semibold mt-1 uppercase tracking-wider">{pk.jabatan}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ProfilView;