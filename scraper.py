from playwright.sync_api import sync_playwright
import time
import os
import traceback

OUTPUT_DIR = "ham_veriler"

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)


def guvenli_dosya_adi(grup: str) -> str:
    return grup.replace(" ", "_").replace("/", "-").replace("\\", "-").replace(",", "")


with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page(viewport={"width": 1600, "height": 1200})
    page.goto("https://eportal.izto.org.tr/web/Uye_Firmalar_Yeni.aspx")

    options = page.locator("#MeslekGrubuSecHtml option").all()

    meslek_gruplari = []
    for opt in options:
        val = opt.get_attribute("value")
        text = opt.inner_text().strip()
        if val and val not in ["0", "", "Seçiniz"]:
            meslek_gruplari.append(text)

    toplam = len(meslek_gruplari)
    print(f"Toplam {toplam} adet meslek grubu bulundu. İndirme başlıyor...\n")

    basarili = 0
    atlanan = 0
    basarisiz = []

    for i, grup in enumerate(meslek_gruplari, start=1):
        dosya_adi = guvenli_dosya_adi(grup)
        hedef_yol = f"{OUTPUT_DIR}/{dosya_adi}.xlsx"

        # Daha önce indirilmişse atla (yarıda kesilen çalışmayı devam ettirmek için)
        if os.path.exists(hedef_yol):
            print(f"[{i}/{toplam}] {grup} -> zaten mevcut, atlanıyor.")
            atlanan += 1
            continue

        print(f"\n[{i}/{toplam}] [{grup}] deneniyor...")

        try:
            # A. Dropdown'ı aç
            page.locator("#meslekGrubuSecGosterim").click(timeout=5000)
            time.sleep(0.3)

            # B. Arama kutusuna grup adını yaz (kalabalık listede doğru öğeye ulaşmak için)
            arama_kutusu = page.locator("#meslekGrubuSecArama")
            arama_kutusu.fill("")
            arama_kutusu.fill(grup)
            time.sleep(0.4)

            # C. Filtrelenmiş listeden tam eşleşen seçeneğe tıkla
            page.locator(
                f"#meslekGrubuSecSecenekler button:text-is('{grup}')"
            ).click(timeout=5000)
            time.sleep(0.5)

            # D. SORGULA
            page.locator("#ASPxPanel1_btnUyeSorgu_I").evaluate("el => el.click()")
            page.wait_for_load_state("networkidle", timeout=20000)
            time.sleep(2)

            # E. EXCEL indir
            with page.expect_download(timeout=20000) as download_info:
                page.locator("#ASPxPanel1_btnExcel_I").evaluate("el => el.click()")

            download = download_info.value
            download.save_as(hedef_yol)

            print(f"  ✅ Başarılı: {dosya_adi}.xlsx")
            basarili += 1

        except Exception as e:
            print(f"  ❌ HATA: {grup}")
            traceback.print_exc()
            basarisiz.append(grup)

            try:
                hata_resmi = f"hata_{dosya_adi[:30]}.png"
                page.screenshot(path=hata_resmi, timeout=5000)
                print(f"  📸 Ekran görüntüsü: {hata_resmi}")
            except Exception:
                pass

            page.reload()
            time.sleep(3)

        time.sleep(1.5)

    browser.close()

    print("\n" + "=" * 50)
    print(f"Toplam grup: {toplam}")
    print(f"Başarılı indirme: {basarili}")
    print(f"Zaten mevcut (atlanan): {atlanan}")
    print(f"Başarısız: {len(basarisiz)}")
    if basarisiz:
        for g in basarisiz:
            print(f"  - {g}")