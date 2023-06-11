from conn import engine
import sqlalchemy as sa



with engine.connect() as conn:
    res = conn.execute(sa.text("select 1")).all()
    print(res)

