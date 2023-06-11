
import os
import sqlalchemy as sa
import platform


DATABASE_URL="postgresql://postgres:postgres@localhost:5433/postgres" if platform.system()=='Darwin' else "postgresql://postgres:postgres@172.19.0.1:5432/postgres"


engine = sa.create_engine(DATABASE_URL)
