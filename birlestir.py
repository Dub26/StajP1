import pandas as pd
import glob
import os

# 1. Klasördeki Excel dosyalarının yollarını bul; Excel'in geçici kilit dosyalarını alma
dosya_yollari = [
    dosya for dosya in glob.glob("ham_veriler/*.xlsx") #Eğer en başta from glob import glob şeklinde içe aktarsaydın, aşağıda sadece glob("*.xlsx") yazarak da kullanabilirdin.
    if not os.path.basename(dosya).startswith("~$") #Excel, açık olan dosyalar için ~$ ön ekiyle başlayan görünmez kilit (lock) dosyaları oluşturur.
]
tum_veriler = []

print(f"Toplam {len(dosya_yollari)} Excel dosyası birleştiriliyor...\n")

for x in dosya_yollari:
    try:
        # dtype=str ile tüm sütunları metin olarak okuyoruz ki sicil numaraları bozulmasın
        df = pd.read_excel(x, dtype=str)
        tum_veriler.append(df)
    except Exception as e:
        print(f"Hata: {x} okunamadı. Detay: {e}")

if not tum_veriler:
    raise RuntimeError(
        "Hiçbir Excel dosyası okunamadı. 'openpyxl' paketinin kurulu olduğunu kontrol edin."
    )

# 2. Tüm tabloları alt alta ekle
ana_tablo = pd.concat(tum_veriler, ignore_index=True)

print("Veriler birleştirildi, temizlik aşamasına geçiliyor...")

# 3. VERİ TEMİZLİĞİ (Transform)

# A. Tüm hücrelerdeki gereksiz sağ/sol boşlukları temizle (Örn: "BORNOVA   " -> "BORNOVA")
for x in ana_tablo.columns:
    if ana_tablo[x].dtype == 'object':
        ana_tablo[x] = ana_tablo[x].str.strip()

# B. Mükerrer (Tekrar eden) kayıtları sil
# Bir firma birden fazla Excel'de yanlışlıkla inmiş olabilir, Oda Sicil No'ya göre tekilleştiriyoruz
ana_tablo.drop_duplicates(subset=['Oda Sicil No'], keep='first', inplace=True)

# C. Boş ('NaN') değerleri SQL'in hata vermemesi için boş metne ("") çevir
ana_tablo.fillna("", inplace=True)

# 4. Sonucu temiz, tek bir dev Excel dosyası olarak kaydet
hedef_dosya = "izto_tum_firmalar_temiz.xlsx"
ana_tablo.to_excel(hedef_dosya, index=False)

print(f"İşlem tamam! Toplam {len(ana_tablo)} benzersiz firma {hedef_dosya} dosyasına kaydedildi.")