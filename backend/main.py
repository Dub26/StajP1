from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import engine, SessionLocal, Base
import models

# Uygulamayı başlat
app = FastAPI()

# Frontend'in bu API'ye erişebilmesi için CORS izni
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Geliştirme aşamasında herkese açık
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Frontend'den gelecek JSON paketinin haritası (Kutu isimleriyle aynı olmalı)
class AramaKriterleri(BaseModel):
    odaSicilNo: str
    ilceKodu: str
    ticaretSicilNo: str
    unvan: str
    meslekGrubu: str
    ilce: str
    nace1: str
    nace2: str
    nace3: str

# Veritabanı bağlantısını açıp kapatan yardımcı fonksiyon
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# İŞTE ASIL ARAMA MOTORU (API ENDPOINT)
@app.post("/api/firmalar/sorgula")
def firmalari_sorgula(kriterler: AramaKriterleri, db: Session = Depends(get_db)):
    # Temel sorguyu oluştur: "SELECT * FROM izto_firmalar"
    sorgu = db.query(models.Firma)

    # 1. Ünvan, Sicil, İlçe Kontrolleri
    if kriterler.odaSicilNo:
        sorgu = sorgu.filter(models.Firma.oda_sicil_no == kriterler.odaSicilNo)
    if kriterler.ticaretSicilNo:
        sorgu = sorgu.filter(models.Firma.ticari_sicil_no == kriterler.ticaretSicilNo)
    if kriterler.unvan:
        # ilike: Küçük/Büyük harf duyarsız olarak içinde geçiyor mu diye bakar (%unvan%)
        sorgu = sorgu.filter(models.Firma.unvani.ilike(f"%{kriterler.unvan}%"))
    
    # 2. Seçmeli Kutular
    if kriterler.meslekGrubu != "Seçiniz" and kriterler.meslekGrubu != "":
        sorgu = sorgu.filter(models.Firma.meslek_grubu == kriterler.meslekGrubu)
    if kriterler.ilce != "Seçiniz" and kriterler.ilce != "":
        sorgu = sorgu.filter(models.Firma.ilce == kriterler.ilce)

    # 3. NACE Kodu Algoritması
    # Veritabanında kod "46.31.04 - Bla bla" diye duruyor. 
    # Biz frontend'den gelen 1., 2. ve 3. kutuları birleştirip "46.31.04" diye aratacağız.
    nace_sablonu = ""
    if kriterler.nace1:
        nace_sablonu += kriterler.nace1
        if kriterler.nace2:
            nace_sablonu += f".{kriterler.nace2}"
            if kriterler.nace3:
                nace_sablonu += f".{kriterler.nace3}"
    
    if nace_sablonu:
        # Kod bu şablonla "başlıyor mu?" diye kontrol et (startswith)
        sorgu = sorgu.filter(models.Firma.nace_kodu.startswith(nace_sablonu))

    # Çok fazla sonuç gelip tarayıcıyı çökertmesin diye maksimum 500 kayıt yollayalım
    sonuclar = sorgu.limit(500).all()
    
    return sonuclar 