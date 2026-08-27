from sqlalchemy import Column, Integer, String
from database import Base

class Firma(Base):
    # MySQL'deki tablonun ismini buraya tam eşleşecek şekilde yazıyoruz
    __tablename__ = "izto_firmalar"

    id = Column(Integer, primary_key=True, index=True)
    oda_sicil_no = Column(String, index=True)
    ticari_sicil_no = Column(String, index=True)
    unvani = Column(String, index=True)
    meslek_grubu = Column(String, index=True)
    ilce = Column(String, index=True)
    nace_kodu = Column(String, index=True)
    tescilli_adresi = Column(String)