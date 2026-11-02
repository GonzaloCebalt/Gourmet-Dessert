from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

# URL de conexión. Asumimos usuario postgres, clave postgres, localhost:5432.


from app.core.config import settings
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,  # antes de usar una conexión, la prueba
    pool_recycle=300,    # y no reusa ninguna de más de 5 minutos
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()




