
import os
import sqlalchemy as sa
import platform


DATABASE_URL="postgresql://postgres:postgres@localhost:5433/postgres" if platform.system()=='Darwin' else "postgresql://postgres:postgres@localhost:5432/postgres"


engine = sa.create_engine(os.environ.get('DATABASE_URL',DATABASE_URL))
