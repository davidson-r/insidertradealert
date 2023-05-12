
import os
import sqlalchemy as sa

# engine = sa.create_engine(os.environ.get('DATABASE_URL'))
engine = sa.create_engine(os.environ.get('postgresql://postgres:localhost:5432/postgres'))
