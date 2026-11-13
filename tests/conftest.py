"""
conftest.py · Fixtures compartidos para toda la suite de tests.
Usa SQLite en memoria para no tocar la base de datos de producción (Neon).
"""
import os
import pytest

# Apuntar al .env de test ANTES de importar cualquier módulo de la app
os.environ.setdefault("DATABASE_URL", "sqlite:///./test.db")
os.environ.setdefault("PROJECT_NAME", "Test API")
os.environ.setdefault("CORS_ORIGINS", "http://localhost:5173")
os.environ.setdefault("SECRET_KEY", "clave_super_secreta_para_tests_12345")
os.environ.setdefault("ALGORITHM", "HS256")
os.environ.setdefault("ACCESS_MIN", "30")
os.environ.setdefault("REFRESH_MIN", "1440")

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

SQLALCHEMY_TEST_URL = "sqlite:///./test.db"

from app.db.database import Base
from app.main import app
from app.dependencies import get_db

engine_test = create_engine(
    SQLALCHEMY_TEST_URL,
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True, scope="function")
def setup_db():
    """Crea y destruye las tablas en cada test para aislamiento total."""
    Base.metadata.create_all(bind=engine_test)
    yield
    Base.metadata.drop_all(bind=engine_test)


@pytest.fixture
def client(setup_db):
    """Cliente HTTP de prueba."""
    with TestClient(app) as c:
        yield c


def _registrar_y_login(client, email="cliente@prueba.com", password="clave123", nombre="Cliente Test"):
    """Helper: registra un usuario y retorna tokens."""
    client.post("/auth/register", json={
        "nombre": nombre,
        "email": email,
        "password": password,
        "acepto_tratamiento": True,
    })
    r = client.post("/auth/login", data={"username": email, "password": password})
    return r.json()


@pytest.fixture
def cliente(client):
    """Usuario con rol 'customer' ya autenticado."""
    return _registrar_y_login(client)


@pytest.fixture
def producto(client, cliente):
    """Un producto de prueba creado como admin."""
    from app import models

    # Promover a admin en la DB de test
    db = TestingSessionLocal()
    usuario = db.query(models.Usuario).filter(models.Usuario.email == "cliente@prueba.com").first()
    usuario.rol = "admin"
    db.commit()
    db.close()

    headers = {"Authorization": f"Bearer {cliente['access_token']}"}
    r = client.post("/productos/", json={
        "nombre": "Torta de Prueba",
        "precio_final": 1500.0,
        "cuotas_cantidad": 3,
        "cuotas_valor": 500.0,
        "garantia_meses": 0,
        "stock": 10,
    }, headers=headers)

    # Volver a customer
    db = TestingSessionLocal()
    usuario = db.query(models.Usuario).filter(models.Usuario.email == "cliente@prueba.com").first()
    usuario.rol = "customer"
    db.commit()
    db.close()

    return r.json()
