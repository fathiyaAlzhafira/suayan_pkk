import React from 'react';

function BerandaView({ setCurrentTab }) {
  return (
    <div className="bg-[#fbfbfa]">
      {/* --- HERO SECTION --- */}
      <div className="relative bg-emerald-950 text-white overflow-hidden py-24 sm:py-32">
        {/* Background Image with Emerald/Dark overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay" 
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=1200')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/80 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-block bg-emerald-800/80 text-emerald-300 text-[10px] px-3.5 py-1 rounded-full uppercase tracking-widest font-bold border border-emerald-700/60 shadow-sm">
            Website Resmi
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight font-serif">
            Selamat Datang di <br/>
            <span className="text-amber-400 font-serif italic block mt-2">TP-PKK Nagari Suayan</span>
          </h1>
          <p className="mt-4 text-xs sm:text-base text-emerald-100 max-w-2xl mx-auto font-medium leading-relaxed">
            Membangun keluarga sejahtera, harmonis, dan mandiri melalui program pemberdayaan perempuan berkelanjutan di Nagari Suayan.
          </p>
          <div className="mt-8 flex justify-center space-x-3 text-xs font-bold uppercase tracking-wider">
            <button 
              onClick={() => setCurrentTab('profil')}
              className="bg-amber-500 hover:bg-amber-400 text-amber-950 px-6 py-3 rounded-md shadow transition duration-200"
            >
              Tentang PKK Kami
            </button>
            <button 
              onClick={() => setCurrentTab('data_publik')} 
              className="bg-transparent border border-white/30 text-white px-6 py-3 rounded-md hover:bg-white/10 transition duration-200"
            >
              Lihat Data Publik
            </button>
          </div>
        </div>
      </div>

      {/* --- STATISTIC CARD BAR --- */}
      <div className="bg-white border shadow-sm relative z-10 -mt-10 max-w-5xl mx-auto rounded-lg grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-150 text-center py-6">
        {[
          { label: 'Jorong', value: '4' },
          { label: 'Dasa Wisma', value: '42' },
          { label: 'Total KK', value: '1.247' },
          { label: 'Total Jiwa', value: '5.002' }
        ].map(stat => (
          <div key={stat.label} className="p-4 md:p-0">
            <span className="block text-3xl font-extrabold text-emerald-800 font-serif">{stat.value}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mt-1">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* --- 10 PROGRAM POKOK PKK --- */}
      <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center space-y-12">
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 block">Program Unggulan</span>
          <h2 className="text-3xl font-bold text-gray-900 font-serif">10 Program Pokok PKK</h2>
          <div className="w-12 h-1 bg-amber-500 mx-auto rounded-full mt-3"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            "Penghayatan & Pengamalan Pancasila", "Gotong Royong", "Pangan", "Sandang", "Perumahan & Tata Laksana Rumah Tangga",
            "Pendidikan & Keterampilan", "Kesehatan", "Pengembangan Kehidupan Berkoperasi", "Kelestarian Lingkungan Hidup", "Perencanaan Sehat"
          ].map((prog, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-100 p-5 rounded-lg shadow-sm text-left hover:-translate-y-1 hover:shadow-md hover:border-emerald-700/20 transition duration-300 min-h-[140px] flex flex-col justify-between"
            >
              <span className="text-2xl font-bold text-emerald-800/20 block font-serif">{(index+1).toString().padStart(2, '0')}</span>
              <p className="text-[11px] font-bold text-gray-700 leading-snug">{prog}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- LOG KEGIATAN TERBARU --- */}
      <div className="bg-[#f2f2f0] py-20 border-y border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="flex flex-col sm:flex-row justify-between sm:items-end text-left border-b pb-4 border-gray-300/40">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 block">Log Terkini</span>
              <h2 className="text-3xl font-bold text-gray-900 font-serif">Kegiatan Terbaru Nagari</h2>
            </div>
            <button 
              onClick={() => setCurrentTab('kegiatan')}
              className="text-xs text-emerald-800 hover:text-emerald-700 font-bold underline underline-offset-4 mt-2 sm:mt-0 transition"
            >
              Lihat Semua Kegiatan &rsaquo;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              {
                id: 1,
                tag: "Rapat",
                tagColor: "bg-blue-50 text-blue-700",
                date: "10 Jul 2026",
                title: "Rapat Koordinasi Bulanan TP-PKK Nagari Suayan — Evaluasi program kerja Pokja.",
                place: "Aula Kantor Nagari Suayan",
                img: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&q=80&w=400"
              },
              {
                id: 2,
                tag: "Posyandu",
                tagColor: "bg-emerald-50 text-emerald-800",
                date: "12 Jul 2026",
                title: "Kegiatan Posyandu Balita Rutin — Penimbangan dan pelayanan imunisasi berkala.",
                place: "Posyandu Mawar Nagari Suayan",
                img: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=400"
              },
              {
                id: 3,
                tag: "Sosial",
                tagColor: "bg-amber-50 text-amber-800",
                date: "13 Jul 2026",
                title: "Kerja Bakti Massal Bersih Nagari — Gotong royong membersihkan area publik jorong.",
                place: "Lingkungan Nagari Suayan",
                img: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=400"
              }
            ].map(item => (
              <div 
                key={item.id} 
                className="bg-white rounded-lg overflow-hidden border border-gray-200/60 shadow-sm hover:-translate-y-1 hover:shadow-md transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 bg-gray-300 bg-cover bg-center" style={{ backgroundImage: `url('${item.img}')` }}></div>
                  <div className="p-5 space-y-2">
                    <div className="flex items-center space-x-2 text-[10px] font-semibold text-gray-400">
                      <span className={`${item.tagColor} px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[9px]`}>{item.tag}</span>
                      <span>• {item.date}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">{item.title}</h3>
                  </div>
                </div>
                <div className="p-5 pt-0">
                  <p className="text-[10px] text-gray-400 font-semibold flex items-center">
                    <span className="mr-1">📍</span> {item.place}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- POKJA PROGRAM --- */}
      <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center space-y-12">
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 block">Struktur Program</span>
          <h2 className="text-3xl font-bold text-gray-900 font-serif">Kelompok Kerja (Pokja)</h2>
          <div className="w-12 h-1 bg-emerald-800 mx-auto rounded-full mt-3"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-left">
          {[
            { title: "Pokja I", theme: "bg-blue-600", desc: "Pancasila & Gotong Royong", details: ["Pola Asuh Anak", "Kerja Bakti", "Gotong Royong"] },
            { title: "Pokja II", theme: "bg-orange-500", desc: "Pendidikan & Keterampilan", details: ["UP2K Usaha Mikro", "Taman Bacaan", "Koperasi"] },
            { title: "Pokja III", theme: "bg-green-700", desc: "Pangan, Sandang & Rumah", details: ["Warung Hidup", "Rumah Sehat", "Sandang/Pangan"] },
            { title: "Pokja IV", theme: "bg-red-500", desc: "Kesehatan & Lingkungan", details: ["Posyandu Balita", "KB Sehat Sejahtera", "Kesling"] }
          ].map(pok => (
            <div 
              key={pok.title} 
              className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-700/10 transition duration-300 flex flex-col"
            >
              <div className={`${pok.theme} text-white px-4 py-3 font-bold text-[10px] uppercase tracking-wider`}>{pok.title}</div>
              <div className="p-5 text-xs space-y-2.5 text-gray-600 flex-grow flex flex-col justify-between">
                <div>
                  <p className="font-extrabold text-gray-950 mb-2 leading-snug">{pok.desc}</p>
                  <ul className="space-y-1 font-medium">
                    {pok.details.map(det => (
                      <li key={det} className="flex items-center text-gray-500">
                        <span className="text-emerald-750 mr-1.5 font-bold">✓</span> {det}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BerandaView;