"""usuarios, pedidos e items

Revision ID: 285924643470
Revises: 
Create Date: 2026-08-31 08:45:46.763566

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '285924643470'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    insp = sa.inspect(conn)
    tables = insp.get_table_names()

    if 'categorias' in tables:
        try:
            op.drop_index(op.f('ix_categorias_id'), table_name='categorias', if_exists=True)
        except Exception:
            pass
        try:
            op.drop_index(op.f('ix_categorias_nombre'), table_name='categorias', if_exists=True)
        except Exception:
            pass
        try:
            op.drop_table('categorias')
        except Exception:
            pass

    if 'usuarios' in tables:
        cols = [c['name'] for c in insp.get_columns('usuarios')]
        if 'password_hash' not in cols:
            op.add_column('usuarios', sa.Column('password_hash', sa.String(), nullable=True))
        if 'rol' not in cols:
            op.add_column('usuarios', sa.Column('rol', sa.String(), nullable=True))
        try:
            op.drop_index(op.f('ix_usuarios_nombre'), table_name='usuarios')
        except Exception:
            pass
        if 'hashed_password' in cols:
            op.drop_column('usuarios', 'hashed_password')


def downgrade() -> None:
    pass
