"use client";

import { useState, useEffect } from "react";
import * as XLSX from 'xlsx';

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
  
  // Backend'den gelecek verileri tutacağımız state'ler
  const [meslekListesi, setMeslekListesi] = useState<string[]>([]);
  const [ilceListesi, setIlceListesi] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isNaceAcik, setIsNaceAcik] = useState(false);
  const [toastMesaj, setToastMesaj] = useState<string | null>(null);

  // --- SAYFA İLK AÇILDIĞINDA İLÇE VE MESLEKLERİ ÇEKEN KISIM ---
  useEffect(() => {
    const listeleriCek = async () => {
      try {
        const meslekResponse = await fetch("http://localhost:8000/api/meslekler");
        const ilceResponse = await fetch("http://localhost:8000/api/ilceler");
        
        if (meslekResponse.ok && ilceResponse.ok) {
          setMeslekListesi(await meslekResponse.json());
          setIlceListesi(await ilceResponse.json());
        }
      } catch (error) {
        console.error("Listeler çekilirken hata oluştu:", error);
      }
    };
    listeleriCek();
  }, []);

  const handleKutuDegisimi = (e: any) => {
    const kutuAdi = e.target.name;
    const yazilanYazi = e.target.value;

    // Sadece rakam kabul etmesi gereken kutuların listesi
    const sayisalKutular = ["odaSicilNo", "ilceKodu", "ticaretSicilNo", "nace1", "nace2", "nace3"];

    // Rakam kontrolü
    if (sayisalKutular.includes(kutuAdi)) {
      if (!/^\d*$/.test(yazilanYazi)) {
        return;
      }
    }

    setKriterler({ ...kriterler, [kutuAdi]: yazilanYazi });

    // --- OTOMATİK KUTU ATLATMA MANTIĞI ---
    // Eğer kutuya yazılan yazı 2 karaktere ulaştıysa:
    if (yazilanYazi.length === 2) {
      if (kutuAdi === "nace1") {
        document.getElementById("nace2")?.focus(); // nace2 kutusuna zıpla
      } else if (kutuAdi === "nace2") {
        document.getElementById("nace3")?.focus(); // nace3 kutusuna zıpla
      }
    }
  };

  const exceleAktar = () => {
    // Eğer tabloda hiç firma yoksa boşuna boş Excel indirmesin
    if (filtrelenmisFirmalar.length === 0) {
      alert("Dışa aktarılacak veri bulunamadı! Lütfen önce sorgulama yapın.");
      return;
    }

    // Gelen ham veriyi Excel'de şık duracak Türkçe başlıklara dönüştürüyoruz
    const excelVerisi = filtrelenmisFirmalar.map((firma: any) => ({
      "Oda Sicil No": firma.oda_sicil_no,
      "Ticaret Sicil No": firma.ticari_sicil_no,
      "Firma Ünvanı": firma.unvani,
      "İlçe": firma.ilce,
      "Meslek Grubu": firma.meslek_grubu,
      "NACE Kodu": firma.nace_kodu,
      "Adres": firma.tescilli_adresi,
      "Web Sitesi": firma.web_adresi
    }));

    // 1. Veriyi bir Excel sayfasına (worksheet) çevir
    const worksheet = XLSX.utils.json_to_sheet(excelVerisi);
    
    // 2. Yeni bir Excel Çalışma Kitabı (workbook) oluştur
    const workbook = XLSX.utils.book_new();
    
    // 3. Sayfayı çalışma kitabına ekle ve adını "Firmalar" yap
    XLSX.utils.book_append_sheet(workbook, worksheet, "Firmalar");
    
    // 4. Dosyayı kullanıcının bilgisayarına indir!
    XLSX.writeFile(workbook, "IZTO_Firma_Listesi.xlsx");
  };

  const handleSorgula = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/firmalar/sorgula", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(kriterler),
      });

      if (!response.ok) {
        throw new Error("Sunucuya ulaşılamadı veya bir hata oluştu.");
      }

      const gercekVeriler = await response.json();
      setFiltrelenmisFirmalar(gercekVeriler);
      setIsSearched(true);

    } catch (error) {
      console.error("Arama hatası:", error);
      alert("Backend'e ulaşılamıyor! Terminalde uvicorn sunucusunun çalıştığından emin ol.");
    } finally {
      setIsLoading(false);
    }
  };
    
  const handleNaceYardimToggle = () => {
    if (kriterler.meslekGrubu === "Seçiniz" || kriterler.meslekGrubu === "") {
      setToastMesaj("Lütfen Meslek Grubunu Seçiniz!!!");
      setIsNaceAcik(false); 
      setTimeout(() => setToastMesaj(null), 4000);
    } else {
      setIsNaceAcik(!isNaceAcik);
    }
  };

  const handleNaceSatirSec = (kod: string) => {
    const parcalar = kod.split(".");
    setKriterler({
      ...kriterler,
      nace1: parcalar[0] || "",
      nace2: parcalar[1] || "",
      nace3: parcalar[2] || ""
    });
    setIsNaceAcik(false);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 relative ${isDarkMode ? 'bg-[#091424] text-gray-200' : 'bg-[#f4f7f9] text-[#212529]'}`}>

      {toastMesaj && (
        <div className="fixed top-20 right-6 w-80 bg-[#e67e22] rounded shadow-lg z-[100] overflow-hidden border border-[#d35400] animate-bounce">
          <div className="flex justify-between items-center px-4 py-2 bg-[#d35400] text-white font-bold text-[13px]">
            <span>Bilgi</span>
            <button onClick={() => setToastMesaj(null)} className="text-gray-200 hover:text-white transition">✕</button>
          </div>
          <div className="p-4 text-white text-[13px] font-medium">
            {toastMesaj}
          </div>
        </div>
      )}

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
                      {meslekListesi.map((meslek, index) => (
                        <option key={index} value={meslek}>{meslek}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-[11px] font-bold uppercase mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-[#6c757d]'}`}>İlçe</label>
                    <select name="ilce" value={kriterler.ilce} onChange={handleKutuDegisimi} className={`w-full h-[40px] border rounded px-3 text-[14px] focus:outline-none focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff] appearance-none ${isDarkMode ? 'bg-[#091424] border-[#1f375b] text-gray-300' : 'bg-white border-[#ced4da] text-[#495057]'}`}>
                      <option>Seçiniz</option>
                      {ilceListesi.map((ilceAd, index) => (
                        <option key={index} value={ilceAd}>{ilceAd}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-row flex-nowrap items-end gap-2.5 pt-3 overflow-x-auto pb-2 w-full">
                  <div className="flex flex-col shrink-0">
                    <label className={`block text-[11px] font-bold uppercase mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-[#6c757d]'}`}>Nace Kodu</label>
                    <div className="flex flex-row gap-2.5">
                     <input type="text" id="nace1" name="nace1" maxLength={2} value={kriterler.nace1} onChange={handleKutuDegisimi} placeholder="00" className={`w-[120px] h-[40px] text-center border rounded px-2 text-[15px] font-bold focus:outline-none focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff] ${isDarkMode ? 'bg-[#091424] border-[#1f375b] text-white' : 'bg-white border-[#ced4da] text-[#212529]'}`} />
                     <input type="text" id="nace2" name="nace2" maxLength={2} value={kriterler.nace2} onChange={handleKutuDegisimi} placeholder="00" className={`w-[120px] h-[40px] text-center border rounded px-2 text-[15px] font-bold focus:outline-none focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff] ${isDarkMode ? 'bg-[#091424] border-[#1f375b] text-white' : 'bg-white border-[#ced4da] text-[#212529]'}`} />
                     <input type="text" id="nace3" name="nace3" maxLength={2} value={kriterler.nace3} onChange={handleKutuDegisimi} placeholder="00" className={`w-[120px] h-[40px] text-center border rounded px-2 text-[15px] font-bold focus:outline-none focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff] ${isDarkMode ? 'bg-[#091424] border-[#1f375b] text-white' : 'bg-white border-[#ced4da] text-[#212529]'}`} />
                    </div>
                  </div>

                  <button onClick={handleNaceYardimToggle} className="w-[360px] shrink-0 h-[40px] flex items-center justify-center text-center bg-[#0088cc] hover:bg-[#0077b3] text-white font-bold rounded text-[13px] transition whitespace-nowrap">
                    {isNaceAcik ? "Nace Kodu Yardım Kapat" : "Nace Kodu Yardım"}
                  </button>

                  <button onClick={handleSorgula}
                    disabled={isLoading} 
                    className={`w-[360px] shrink-0 h-[40px] flex items-center justify-center text-center text-white font-bold rounded text-[13px] transition whitespace-nowrap ${isLoading ? 'bg-[#218838] opacity-80 cursor-not-allowed' : 'bg-[#28a745] hover:bg-[#218838]'}`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Aranıyor...
                      </>
                    ) : (
                      "Sorgula"
                    )}
                  </button>

                  <button onClick={exceleAktar} className="w-[360px] shrink-0 h-[40px] flex items-center justify-center text-center bg-[#28a745] hover:bg-[#218838] text-white font-bold rounded text-[13px] transition gap-1.5 whitespace-nowrap">
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

            {isNaceAcik && (
              <div className={`mt-4 border rounded-md shadow-sm overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-[#0c192d] border-[#162947]' : 'bg-white border-[#dee2e6]'}`}>
                <div className={`flex justify-between items-center p-3 border-b ${isDarkMode ? 'bg-[#0f1f38] border-[#162947]' : 'bg-[#f8f9fa] border-[#dee2e6]'}`}>
                  <div className={`font-bold text-[14px] flex items-center gap-2 ${isDarkMode ? 'text-gray-200' : 'text-[#212529]'}`}>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg"><path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path></svg>
                    NACE Kodu Yardım
                  </div>
                  <div className={`text-[12px] ${isDarkMode ? 'text-gray-400' : 'text-[#6c757d]'}`}>Seçmek istediğiniz satıra tıklayınız.</div>
                </div>
                
                <div className="overflow-x-auto max-h-[300px]">
                  <table className="w-full text-left text-[13px]">
                    <thead className={`sticky top-0 z-10 ${isDarkMode ? 'bg-[#0f1f38]' : 'bg-white'}`}>
                      <tr>
                        <th className={`p-3 font-bold ${isDarkMode ? 'text-gray-300' : 'text-[#495057]'}`}>Nace Kodu</th>
                        <th className={`p-3 font-bold ${isDarkMode ? 'text-gray-300' : 'text-[#495057]'}`}>Nace Adı</th>
                        <th className={`p-3 font-bold ${isDarkMode ? 'text-gray-300' : 'text-[#495057]'}`}>İng.Nace Adı</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { kod: "01.13.17", ad: "Şeker pancarı yetiştirilmesi", ing: "Growing sugar cane" },
                        { kod: "01.13.18", ad: "Yenilebilir kök ve yumruların yetiştiriciliği", ing: "Cultivation of edible roots and tubers" },
                        { kod: "01.13.19", ad: "Diğer sebze tohumlarının yetiştiriciliği", ing: "Growing other vegetable seeds" },
                        { kod: "01.13.20", ad: "Meyvesi yenen sebzelerin yetiştirilmesi", ing: "Growing of vegetables with edible fruits" },
                        { kod: "11.43.35", ad: "Mock Nace Kodu (Görsel Testi)", ing: "Mock Nace Code (Visual Test)" }
                      ].map((item, index) => (
                        <tr 
                          key={index} 
                          onClick={() => handleNaceSatirSec(item.kod)}
                          className={`cursor-pointer transition-colors ${isDarkMode ? 'border-b border-[#162947] hover:bg-[#162947]' : 'border-b border-[#dee2e6] hover:bg-[#f8f9fa]'}`}
                        >
                          <td className={`p-3 font-bold ${isDarkMode ? 'text-[#5b95ff]' : 'text-[#0056b3]'}`}>{item.kod}</td>
                          <td className={`p-3 ${isDarkMode ? 'text-gray-300' : 'text-[#212529]'}`}>{item.ad}</td>
                          <td className={`p-3 ${isDarkMode ? 'text-gray-300' : 'text-[#212529]'}`}>{item.ing}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

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
                      <div key={firma.oda_sicil_no} className={`border rounded-lg p-5 shadow-sm hover:shadow-md transition-all ${isDarkMode ? 'bg-[#0f1f38] border-[#1f375b]' : 'bg-white border-[#dee2e6]'}`}>
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