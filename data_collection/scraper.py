from playwright.sync_api import sync_playwright, Page
import time
import os
import traceback

OUTPUT_DIR = "ham_veriler"

def klasor_hazirla(klasor_adi: str):
    """Çıktı klasörü yoksa oluşturur."""
    if not os.path.exists(klasor_adi):
        os.makedirs(klasor_adi)

#fonksiyon string alıyor ve string döndürüyor
def guvenli_dosya_adi(grup: str) -> str:
    """Dosya isimlerinde sorun yaratabilecek karakterleri temizler."""
    return grup.replace(" ", "_").replace("/", "-").replace("\\", "-").replace(",", "")

def meslek_gruplarini_al(page: Page) -> list:
    """Sayfadaki meslek gruplarını okur ve bir liste olarak döndürür."""
    options = page.locator("#MeslekGrubuSecHtml option").all()
    meslek_gruplari = []
    
    #<option value="15">Tekstil</option>
    for x in options:
        val = x.get_attribute("value")         #val ="15"
        text = x.inner_text().strip()          # text = "Tekstil"
        
        #"if val" boş değilse devam et
        if val and val != "0" and text != "Seçiniz":
            meslek_gruplari.append(text)
            
    return meslek_gruplari

def grubu_indir(page: Page, grup: str, hedef_yol: str):
    """Tek bir meslek grubunu seçer, sorgular ve Excel olarak indirir."""
    # A. Dropdown'ı aç
    page.locator("#meslekGrubuSecGosterim").click(timeout=5000)
    time.sleep(0.3)

    # B. Arama kutusuna grup adını yaz (kalabalık listede doğru öğeye ulaşmak için)
    arama_kutusu = page.locator("#meslekGrubuSecArama")
    arama_kutusu.fill(grup)
    time.sleep(0.4)

    # C. Filtrelenmiş listeden tam eşleşen seçeneğe tıkla
    page.locator(
        f"#meslekGrubuSecSecenekler button:text-is('{grup}')" 
    ).click(timeout=5000) #Arama yaptım → Tekstil çıktı → Tekstil seçeneğine tıkladım.
    time.sleep(0.5)

    # D. SORGULA
    page.locator("#ASPxPanel1_btnUyeSorgu_I").evaluate("el => el.click()") #element.click() .evaluate() bize browser'daki JavaScript'i doğrudan çalıştırma imkanı veriyor.
    page.wait_for_load_state("networkidle", timeout=20000)
    time.sleep(2)

    # E. EXCEL indir
    with page.expect_download(timeout=20000) as download_info:
        page.locator("#ASPxPanel1_btnExcel_I").evaluate("el => el.click()")

    download = download_info.value
    download.save_as(hedef_yol)

def main():
    """Tüm süreci yöneten ana fonksiyon."""
    klasor_hazirla(OUTPUT_DIR)

    with sync_playwright() as p:
        #Headless browser, arka planda görünmeden çalışan browser demek.
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        try:
            page.goto("https://eportal.izto.org.tr/web/Uye_Firmalar_Yeni.aspx")
            meslek_gruplari = meslek_gruplarini_al(page)
            
            toplam = len(meslek_gruplari)
            print(f"Toplam {toplam} adet meslek grubu bulundu. İndirme başlıyor...\n")

            basarili = 0
            atlanan = 0
            basarisiz = []

            for i, grup in enumerate(meslek_gruplari, start=1): #i = 1 grup = "Gıda"
                dosya_adi = guvenli_dosya_adi(grup)
                hedef_yol = f"{OUTPUT_DIR}/{dosya_adi}.xlsx"

                # Daha önce indirilmişse atla (yarıda kesilen çalışmayı devam ettirmek için)
                if os.path.exists(hedef_yol):
                    print(f"[{i}/{toplam}] {grup} -> zaten mevcut, atlanıyor.")
                    atlanan += 1
                    continue

                print(f"\n[{i}/{toplam}] [{grup}] deneniyor...")

                try:
                    grubu_indir(page, grup, hedef_yol)
                    print(f"   Başarılı: {dosya_adi}.xlsx")
                    basarili += 1
                except Exception:
                    print(f"   HATA: {grup}")
                    traceback.print_exc()
                    basarisiz.append(grup)
                    
                    # Hata durumunda sayfayı yenileyip toparlanmasını sağla
                    page.reload()
                    time.sleep(3)
                
                time.sleep(1.5)

        finally:
            # Hata olsa bile tarayıcıyı düzgünce kapatır
            browser.close()

        # Sonuç Raporu
        print("\n" + "=" * 50)
        print(f"Toplam grup: {toplam}")
        print(f"Başarılı indirme: {basarili}")
        print(f"Zaten mevcut (atlanan): {atlanan}")
        print(f"Başarısız: {len(basarisiz)}")
        if basarisiz:
            for g in basarisiz:
                print(f"  - {g}")

if __name__ == "__main__":
    main()