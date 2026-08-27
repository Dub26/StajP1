from sqlalchemy import Column, String
from database import Base

class Firma(Base):
    __tablename__ = "izto_firmalar"

    # id sildik, oda_sicil_no primary_key oldu!
    oda_sicil_no = Column(String, primary_key=True, index=True)
    ticari_sicil_no = Column(String, index=True)
    meslek_grubu = Column(String, index=True)
    nace_kodu = Column(String, index=True)
    unvani = Column(String, index=True)
    ilce = Column(String, index=True)
    tescilli_adresi = Column(String)
    web_adresi = Column(String)