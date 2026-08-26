export default function Home() {
  return (
    <div className="min-h-screen bg-[#f4f7f9] flex flex-col font-sans">
      
      {/* Üst Menü (Navbar) */}
      <header className="bg-white h-16 flex items-center justify-between px-6 border-b shadow-sm">
        <div className="flex items-center gap-3">
          {/* Logo Çemberi */}
          <div className="w-10 h-10 rounded-full bg-[#1c3a70] flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm">
            İZTO
          </div>
          <span className="text-[#1c3a70] text-lg font-semibold tracking-wide">İzmir Ticaret Odası</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center text-orange-400 hover:bg-orange-100 transition">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          </button>
          <button className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition border border-gray-200">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          </button>
        </div>
      </header>

      {/* Ana İçerik */}
      <main className="flex-grow p-6 flex justify-center">
        <div className="w-full max-w-[1400px] bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
          
          {/* Başlık Alanı */}
          <div className="flex items-center gap-4 p-6 border-b border-gray-100">
            <div className="w-12 h-12 bg-[#eef2f9] rounded-lg flex items-center justify-center text-[#4a85f6]">
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg"><path d="M19 2H9c-1.103 0-2 .897-2 2v5.586l-4.707 4.707A1 1 0 0 0 2 15v6c0 1.103.897 2 2 2h15c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm-8 18H4v-4.586l3-3 4 4V20zm8 0h-6v-6.586l-2.293-2.293L12 9.828V4h7v16z"></path><path d="M14 11h2v2h-2zm0-4h2v2h-2z"></path></svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Üye Firma Sorgulama</h1>
              <p className="text-sm text-gray-500">Firma bilgilerine ulaşmak için aşağıdaki kriterlerden bir veya birkaçını kullanabilirsiniz.</p>
            </div>
          </div>

          {/* Form Alanı */}
          <div className="p-6">
            <div className="border border-gray-200 rounded-lg p-5">
              
              <div className="flex items-center gap-2 mb-6">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="w-4 h-4 text-gray-700" xmlns="http://www.w3.org/2000/svg"><path d="M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z"></path></svg>
                <h2 className="text-sm font-bold text-gray-800">Sorgu Kriterleri</h2>
              </div>

              <div className="space-y-4">
                {/* 1. Satır */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Oda Sicil No</label>
                    <input type="text" placeholder="0" className="w-full border border-gray-300 rounded focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 px-3 py-2 text-sm text-black" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">İlçe Kodu</label>
                    <input type="text" placeholder="00" className="w-full border border-gray-300 rounded focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 px-3 py-2 text-sm text-black" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Ticaret Sicil No</label>
                    <input type="text" placeholder="0" className="w-full border border-gray-300 rounded focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 px-3 py-2 text-sm text-black" />
                  </div>
                </div>

                {/* 2. Satır */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Ünvan</label>
                  <input type="text" placeholder="Ünvan" className="w-full border border-gray-300 rounded focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 px-3 py-2 text-sm text-black" />
                </div>

                {/* 3. Satır */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Meslek Grubu</label>
                    <select className="w-full border border-gray-300 rounded focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 px-3 py-2 text-sm text-gray-500 bg-white appearance-none">
                      <option>Seçiniz</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">İlçe</label>
                    <select className="w-full border border-gray-300 rounded focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 px-3 py-2 text-sm text-gray-500 bg-white appearance-none">
                      <option>Seçiniz</option>
                    </select>
                  </div>
                </div>

                {/* 4. Satır: Nace Kodu ve Butonlar */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2">
                  <div className="flex-1 w-full max-w-[450px]">
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Nace Kodu</label>
                    <div className="flex gap-2">
                      <input type="text" placeholder="00" className="w-1/3 text-center border border-gray-300 rounded focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 px-3 py-2 text-sm font-bold text-black" />
                      <input type="text" placeholder="00" className="w-1/3 text-center border border-gray-300 rounded focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 px-3 py-2 text-sm font-bold text-black" />
                      <input type="text" placeholder="00" className="w-1/3 text-center border border-gray-300 rounded focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 px-3 py-2 text-sm font-bold text-black" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    <button className="bg-[#0088cc] hover:bg-[#0077b3] text-white font-bold py-2.5 px-6 rounded text-sm w-full md:w-[160px] transition">
                      Nace Kodu Yardım
                    </button>
                    <button className="bg-[#28a745] hover:bg-[#218838] text-white font-bold py-2.5 px-6 rounded text-sm w-full md:w-[160px] transition">
                      Sorgula
                    </button>
                    <button className="bg-[#dc3545] hover:bg-[#c82333] text-white font-bold py-2.5 px-6 rounded text-sm w-full md:w-[160px] transition flex items-center justify-center gap-2">
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg"><path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm60.1 106.5L222.4 341.6c-2.7 3-7.2 3-9.8 0l-16-17.7c-2.7-3-2.7-7.8 0-10.8l38.2-42.3h-100c-3.9 0-7-3.1-7-7v-20c0-3.9 3.1-7 7-7h100l-38.2-42.3c-2.7-3-2.7-7.8 0-10.8l16-17.7c2.7-3 7.2-3 9.8 0l61.7 68.3c3.1 3.5 3.1 9 0 12.4zM384 121.9v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"></path></svg>
                      Excel
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Alt Kısım - Sorgu Sonuçları Yazısı */}
            <div className="mt-6 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-gray-800">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg"><path d="M64 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM64 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48-208a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z"></path></svg>
                <h3 className="text-[13px] font-bold">Sorgu Sonuçları</h3>
              </div>
              <p className="text-xs text-gray-500 pl-6">Kayıtlar daha okunabilir kartlar halinde gösterilmektedir.</p>
            </div>
            
          </div>
        </div>
      </main>

      {/* En Alt Footer */}
      <footer className="text-center py-6 text-xs text-gray-500">
        Tüm Hakları Saklıdır © 2026 İzmir Ticaret Odası
      </footer>

    </div>
  );
}