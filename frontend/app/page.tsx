"use client";

import { useState } from "react";
import { mockFirmalar } from '../mock/firmalar';

export default function Home() {
  const [isSearched, setIsSearched] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [kriterler, setKriterler] = useState({
    odaSicilNo: "",
    ilceKodu: "",
    ticaretSicilNo: "",
    unvan: "",
    meslekGrubu: "Seçiniz",
    ilce: "Seçiniz",
    nace1: "",
    nace2: "",
    nace3: ""
  });

  const [filtrelenmisFirmalar, setFiltrelenmisFirmalar] = useState<any[]>([]);

  const handleKutuDegisimi = (e: any) => {
    const kutuAdi = e.target.name;
    const yazilanYazi = e.target.value;
    setKriterler({ ...kriterler, [kutuAdi]: yazilanYazi });
  };

  const handleSorgula = () => {
    const sonuclar = mockFirmalar.filter((firma) => {
      let eslesti = true;
      if (kriterler.unvan !== "" && !firma.unvani.toLowerCase().includes(kriterler.unvan.toLowerCase())) eslesti = false;
      if (kriterler.odaSicilNo !== "" && firma.oda_sicil_no !== kriterler.odaSicilNo) eslesti = false;
      if (kriterler.ticaretSicilNo !== "" && firma.ticari_sicil_no !== kriterler.ticaretSicilNo) eslesti = false;
      if (kriterler.ilce !== "Seçiniz" && firma.ilce !== kriterler.ilce) eslesti = false;
      return eslesti;
    });
    setFiltrelenmisFirmalar(sonuclar);
    setIsSearched(true);
  };

  const handleNaceYardim = () => {
    alert("Nace Kodu arama penceresi buraya eklenecektir.");
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#091424] text-gray-200' : 'bg-[#f4f7f9] text-[#212529]'}`}>
      
      {/* HEADER */}
      <header className={`sticky top-0 z-50 h-16 flex items-center justify-between px-6 border-b shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-[#050a13] border-[#162947]' : 'bg-white border-[#dee2e6]'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1c3a70] flex items-center justify-center text-white text-xs font-bold border-2 border-[#1c3a70] shadow-sm">İZTO</div>
          <span className={`text-lg font-semibold tracking-wide ${isDarkMode ? 'text-white' : 'text-[#6c757d]'}`}>İzmir Ticaret Odası</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-[#162947] text-yellow-400 hover:bg-[#1f375b]' : 'bg-orange-50 text-orange-400 hover:bg-orange-100'}`}
          >
            {isDarkMode ? (
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            ) : (
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            )}
          </button>
        </div>
      </header>

      <main className="flex-grow p-4 md:p-6 flex justify-center">
        <div className={`w-full max-w-[98%] rounded-md shadow-sm border flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-[#0f1f38] border-[#162947]' : 'bg-white border-[#dee2e6]'}`}>
          
          <div className={`flex items-center gap-4 p-5 md:px-6 md:py-5 border-b ${isDarkMode ? 'border-[#162947]' : 'border-[#dee2e6]'}`}>
            <div className={`w-11 h-11 rounded flex items-center justify-center ${isDarkMode ? 'bg-[#162947] text-[#5b95ff]' : 'bg-[#eef2f9] text-[#4a85f6]'}`}>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg"><path d="M19 2H9c-1.103 0-2 .897-2 2v5.586l-4.707 4.707A1 1 0 0 0 2 15v6c0 1.103.897 2 2 2h15c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm-8 18H4v-4.586l3-3 4 4V20zm8 0h-6v-6.586l-2.293-2.293L12 9.828V4h7v16z"></path></svg>
            </div>
            <div>
              <h1 className={`text-[16px] font-bold ${isDarkMode ? 'text-white' : 'text-[#212529]'}`}>Üye Firma Sorgulama</h1>
              <p className={`text-[13px] mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-[#6c757d]'}`}>Firma bilgilerine ulaşmak için aşağıdaki kriterlerden bir veya birkaçını kullanabilirsiniz.</p>
            </div>
          </div>

          <div className="p-5 md:p-6">
            <div className={`border rounded-md p-5 ${isDarkMode ? 'border-[#162947] bg-[#0c192d]' : 'border-[#dee2e6] bg-white'}`}>
              
              <div className="flex items-center gap-2 mb-5">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" className={`w-3 h-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-800'}`} xmlns="http://www.w3.org/2000/svg"><path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"></path></svg>
                <h2 className={`text-[14px] font-bold ${isDarkMode ? 'text-gray-200' : 'text-[#212529]'}`}>Sorgu Kriterleri</h2>
              </div>

              <div className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className={`block text-[11px] font-bold uppercase mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-[#6c757d]'}`}>Oda Sicil No</label>
                    <input type="text" name="odaSicilNo" value={kriterler.odaSicilNo} onChange={handleKutuDegisimi} placeholder="0" className={`w-full h-[40px] border rounded px-3 text-[14px] focus:outline-none focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff] ${isDarkMode ? 'bg-[#091424] border-[#1f375b] text-white placeholder-gray-600' : 'bg-white border-[#ced4da] text-[#495057]'}`} />
                  </div>
                  <div>
                    <label className={`block text-[11px] font-bold uppercase mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-[#6c757d]'}`}>İlçe Kodu</label>
                    <input type="text" name="ilceKodu" value={kriterler.ilceKodu} onChange={handleKutuDegisimi} placeholder="00" className={`w-full h-[40px] border rounded px-3 text-[14px] focus:outline-none focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff] ${isDarkMode ? 'bg-[#091424] border-[#1f375b] text-white placeholder-gray-600' : 'bg-white border-[#ced4da] text-[#495057]'}`} />
                  </div>
                  <div>
                    <label className={`block text-[11px] font-bold uppercase mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-[#6c757d]'}`}>Ticaret Sicil No</label>
                    <input type="text" name="ticaretSicilNo" value={kriterler.ticaretSicilNo} onChange={handleKutuDegisimi} placeholder="0" className={`w-full h-[40px] border rounded px-3 text-[14px] focus:outline-none focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff] ${isDarkMode ? 'bg-[#091424] border-[#1f375b] text-white placeholder-gray-600' : 'bg-white border-[#ced4da] text-[#495057]'}`} />
                  </div>
                </div>

                <div>
                  <label className={`block text-[11px] font-bold uppercase mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-[#6c757d]'}`}>Ünvan</label>
                  <input type="text" name="unvan" value={kriterler.unvan} onChange={handleKutuDegisimi} placeholder="Ünvan" className={`w-full h-[40px] border rounded px-3 text-[14px] focus:outline-none focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff] ${isDarkMode ? 'bg-[#091424] border-[#1f375b] text-white placeholder-gray-600' : 'bg-white border-[#ced4da] text-[#495057]'}`} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={`block text-[11px] font-bold uppercase mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-[#6c757d]'}`}>Meslek Grubu</label>
                    <select name="meslekGrubu" value={kriterler.meslekGrubu} onChange={handleKutuDegisimi} className={`w-full h-[40px] border rounded px-3 text-[14px] focus:outline-none focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff] appearance-none ${isDarkMode ? 'bg-[#091424] border-[#1f375b] text-gray-300' : 'bg-white border-[#ced4da] text-[#495057]'}`}>
                      <option>Seçiniz</option>
                      <option>79 - BİLİŞİM TEKNOLOJİLERİ GRUBU</option>
                      <option>67 - İNŞAAT YAPIM VE ONARIM GRUBU</option>
                      <option>84 - OTOMOTİV VE DİĞER ULAŞIM ARAÇLARI PARÇALARININ PERAKENDE SATIŞI GRUBU</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-[11px] font-bold uppercase mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-[#6c757d]'}`}>İlçe</label>
                    <select name="ilce" value={kriterler.ilce} onChange={handleKutuDegisimi} className={`w-full h-[40px] border rounded px-3 text-[14px] focus:outline-none focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff] appearance-none ${isDarkMode ? 'bg-[#091424] border-[#1f375b] text-gray-300' : 'bg-white border-[#ced4da] text-[#495057]'}`}>
                      <option>Seçiniz</option>
                      <option>BALÇOVA</option>
                      <option>BORNOVA</option>
                      <option>KONAK</option>
                    </select>
                  </div>
                </div>

                {/* ⬇️ İŞTE GÖRSELDEKİ O İP GİBİ DİZİLİŞ (items-end ve gap-2.5) ⬇️ */}
                <div className="flex flex-row flex-nowrap items-end gap-2.5 pt-3 overflow-x-auto pb-2 w-full">
                  
                  {/* Nace Kodu Alanı (Label üstte, kutular altta) */}
                  <div className="flex flex-col shrink-0">
                    <label className={`block text-[11px] font-bold uppercase mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-[#6c757d]'}`}>Nace Kodu</label>
                    <div className="flex flex-row gap-2.5">
                      <input type="text" name="nace1" value={kriterler.nace1} onChange={handleKutuDegisimi} placeholder="00" className={`w-[120px] h-[40px] text-center border rounded px-2 text-[15px] font-bold focus:outline-none focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff] ${isDarkMode ? 'bg-[#091424] border-[#1f375b] text-white' : 'bg-white border-[#ced4da] text-[#212529]'}`} />
                      <input type="text" name="nace2" value={kriterler.nace2} onChange={handleKutuDegisimi} placeholder="00" className={`w-[120px] h-[40px] text-center border rounded px-2 text-[15px] font-bold focus:outline-none focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff] ${isDarkMode ? 'bg-[#091424] border-[#1f375b] text-white' : 'bg-white border-[#ced4da] text-[#212529]'}`} />
                      <input type="text" name="nace3" value={kriterler.nace3} onChange={handleKutuDegisimi} placeholder="00" className={`w-[120px] h-[40px] text-center border rounded px-2 text-[15px] font-bold focus:outline-none focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff] ${isDarkMode ? 'bg-[#091424] border-[#1f375b] text-white' : 'bg-white border-[#ced4da] text-[#212529]'}`} />
                    </div>
                  </div>
                  
                  {/* Butonlar: items-end komutu sayesinde inputlarla tam alt çizgide hizalanırlar */}
                  <button onClick={handleNaceYardim} className="w-[360px] shrink-0 h-[40px] flex items-center justify-center text-center bg-[#0088cc] hover:bg-[#0077b3] text-white font-bold rounded text-[13px] transition whitespace-nowrap">
                    Nace Kodu Yardım
                  </button>
                  
                  <button onClick={handleSorgula} className="w-[360px] shrink-0 h-[40px] flex items-center justify-center text-center bg-[#28a745] hover:bg-[#218838] text-white font-bold rounded text-[13px] transition whitespace-nowrap">
                    Sorgula
                  </button>
                  
                  <button className="w-[360px] shrink-0 h-[40px] flex items-center justify-center text-center bg-[#28a745] hover:bg-[#218838] text-white font-bold rounded text-[13px] transition gap-1.5 whitespace-nowrap">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg"><path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm60.1 106.5L222.4 341.6c-2.7 3-7.2 3-9.8 0l-16-17.7c-2.7-3-2.7-7.8 0-10.8l38.2-42.3h-100c-3.9 0-7-3.1-7-7v-20c0-3.9 3.1-7 7-7h100l-38.2-42.3c-2.7-3-2.7-7.8 0-10.8l16-17.7c2.7-3 7.2-3 9.8 0l61.7 68.3c3.1 3.5 3.1 9 0 12.4zM384 121.9v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"></path></svg>
                    Excel
                  </button>
                  
                  {isSearched && (
                    <div className={`px-4 shrink-0 h-[40px] flex items-center justify-center text-center font-bold text-[13px] rounded border ${isDarkMode ? 'bg-[#0f243b] text-[#5b95ff] border-[#1f375b]' : 'bg-[#d1ecf1] text-[#0c5460] border-[#bee5eb]'}`}>
                      TOPLAM ÜYE FİRMA SAYISI : {filtrelenmisFirmalar.length}
                    </div>
                  )}

                </div>

              </div>
            </div>

            {/* Alt Kısım - Sorgu Sonuçları */}
            <div className="mt-8">
              <div className={`flex items-center gap-2 mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg"><path d="M64 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM64 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48-208a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z"></path></svg>
                <h3 className="text-[14px] font-bold">Sorgu Sonuçları</h3>
              </div>
              <p className={`text-[12px] pl-6 mb-4 ${isDarkMode ? 'text-gray-500' : 'text-[#6c757d]'}`}>Kayıtlar daha okunabilir kartlar halinde gösterilmektedir.</p>

              {isSearched && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                  {filtrelenmisFirmalar.length === 0 ? (
                    <div className={`p-4 rounded border text-sm ${isDarkMode ? 'bg-[#162947] border-[#1f375b] text-gray-400' : 'bg-gray-50 border-[#dee2e6] text-[#6c757d]'}`}>
                      Kriterlere uygun firma bulunamadı.
                    </div>
                  ) : (
                    filtrelenmisFirmalar.map((firma) => (
                      <div key={firma.id} className={`border rounded-lg p-5 shadow-sm hover:shadow-md transition-all ${isDarkMode ? 'bg-[#0f1f38] border-[#1f375b]' : 'bg-white border-[#dee2e6]'}`}>
                        <div className="flex gap-3 mb-4 items-start">
                          <div className={`w-10 h-10 rounded flex-shrink-0 flex items-center justify-center ${isDarkMode ? 'bg-[#162947] text-[#5b95ff]' : 'bg-[#eef2f9] text-[#4a85f6]'}`}>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg"><path d="M19 2H9c-1.103 0-2 .897-2 2v5.586l-4.707 4.707A1 1 0 0 0 2 15v6c0 1.103.897 2 2 2h15c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm-8 18H4v-4.586l3-3 4 4V20zm8 0h-6v-6.586l-2.293-2.293L12 9.828V4h7v16z"></path></svg>
                          </div>
                          <div>
                            <div className={`text-[11px] font-bold uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-[#6c757d]'}`}>Üye Firma</div>
                            <div className={`text-[14px] font-bold leading-tight mt-0.5 ${isDarkMode ? 'text-gray-200' : 'text-[#212529]'}`}>{firma.unvani}</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className={`border rounded px-3 py-1.5 text-[12px] ${isDarkMode ? 'border-[#1f375b] text-gray-300' : 'border-[#dee2e6] text-[#495057]'}`}>Oda Sicil: {firma.oda_sicil_no}</span>
                          <span className={`border rounded px-3 py-1.5 text-[12px] ${isDarkMode ? 'border-[#1f375b] text-gray-300' : 'border-[#dee2e6] text-[#495057]'}`}>Ticaret Sicil: {firma.ticari_sicil_no}</span>
                          <span className={`border rounded px-3 py-1.5 text-[12px] ${isDarkMode ? 'border-[#1f375b] text-gray-300' : 'border-[#dee2e6] text-[#495057]'}`}>İlçe: {firma.ilce}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                          <div className={`border rounded p-3 ${isDarkMode ? 'bg-[#162947] border-[#1f375b]' : 'bg-[#f8f9fa] border-[#dee2e6]'}`}>
                            <div className={`text-[11px] font-bold uppercase mb-1 ${isDarkMode ? 'text-gray-400' : 'text-[#6c757d]'}`}>Meslek Grubu</div>
                            <div className={`text-[13px] line-clamp-3 ${isDarkMode ? 'text-gray-300' : 'text-[#212529]'}`}>{firma.meslek_grubu}</div>
                          </div>
                          <div className={`border rounded p-3 ${isDarkMode ? 'bg-[#162947] border-[#1f375b]' : 'bg-[#f8f9fa] border-[#dee2e6]'}`}>
                            <div className={`text-[11px] font-bold uppercase mb-1 ${isDarkMode ? 'text-gray-400' : 'text-[#6c757d]'}`}>Nace Kodu</div>
                            <div className={`text-[13px] line-clamp-3 ${isDarkMode ? 'text-gray-300' : 'text-[#212529]'}`}>{firma.nace_kodu}</div>
                          </div>
                        </div>

                        <div className={`border rounded p-3 ${isDarkMode ? 'bg-[#162947] border-[#1f375b]' : 'bg-[#f8f9fa] border-[#dee2e6]'}`}>
                          <div className={`text-[11px] font-bold uppercase mb-1 ${isDarkMode ? 'text-gray-400' : 'text-[#6c757d]'}`}>Tescilli Adres</div>
                          <div className={`text-[13px] ${isDarkMode ? 'text-gray-300' : 'text-[#212529]'}`}>{firma.tescilli_adresi}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}