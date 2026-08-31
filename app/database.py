from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

# URL de conexión. Asumimos usuario postgres, clave postgres, localhost:5432.
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:1234@localhost:5432/ecommerce_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
