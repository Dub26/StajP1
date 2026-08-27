from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# MySQL Bağlantı Adresi (staj_db olarak güncellendi)
# Şifre: 123456, Kullanıcı: root, DB Adı: staj_db
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:123456abC@localhost:3306/staj_db"

# Motoru çalıştır
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Veritabanı ile her konuşmak istediğimizde açacağımız oturum
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Tabloları oluştururken kullanacağımız temel kalıp
Base = declarative_base()