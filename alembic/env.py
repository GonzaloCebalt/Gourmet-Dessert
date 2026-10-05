from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool
import sqlalchemy as sa

from alembic import context

# Importamos los modelos para que autogenerate los detecte
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from app.db.database import Base
from app.core.config import settings
from app import models  # noqa: F401

config = context.config
# Leer la URL de la base de datos desde settings (variable de entorno DATABASE_URL)
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL.replace("%", "%%"))

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# target_metadata apunta a la Base de SQLAlchemy de la app
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        # En una base de datos nueva (como en Render), creamos las tablas y marcamos HEAD
        inspector = sa.inspect(connection)
        tables = inspector.get_table_names()
        if "usuarios" not in tables:
            Base.metadata.create_all(bind=connection)
            connection.execute(sa.text("CREATE TABLE IF NOT EXISTS alembic_version (version_num VARCHAR(32) NOT NULL, CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num))"))
            connection.execute(sa.text("DELETE FROM alembic_version"))
            connection.execute(sa.text("INSERT INTO alembic_version (version_num) VALUES ('d97dc5d68155')"))
            connection.commit()

        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
