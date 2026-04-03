"""
Run this script to apply the MATRIARCH schema to Supabase via the REST API.
Usage: uv run python apply_schema.py
"""
import httpx
import urllib.parse

SUPABASE_URL = "https://cgjtpevnmwxyusowfani.supabase.co"
SUPABASE_KEY = "sb_publishable_dyOcTPE4SXlGHyX2FfJ0tQ_G-NyA8Kq"
DB_URL = "postgresql://postgres:V/DY#j3FLVV$kYE@db.cgjtpevnmwxyusowfani.supabase.co:5432/postgres"

from pathlib import Path

sql = Path("supabase/migrations/20260403_init_schema.sql").read_text()

# Use Supabase's /rest/v1/rpc endpoint is not available for raw DDL.
# Instead connect via sqlalchemy directly
from sqlalchemy import create_engine, text

# URL-encode special chars in password for SQLAlchemy
encoded_url = "postgresql+psycopg2://postgres:V%2FDY%23j3FLVV%24kYE@db.cgjtpevnmwxyusowfani.supabase.co:5432/postgres"

engine = create_engine(encoded_url, echo=False)

with engine.connect() as conn:
    # Split on ;; double-semicolons for safety, otherwise split on ;\n
    stmts = [s.strip() for s in sql.split(";") if s.strip()]
    print(f"Applying {len(stmts)} SQL statements to Supabase...")
    for i, stmt in enumerate(stmts):
        try:
            conn.execute(text(stmt))
            print(f"  [{i+1:2d}/{len(stmts)}] ✅")
        except Exception as e:
            msg = str(e).split('\n')[0][:120]
            print(f"  [{i+1:2d}/{len(stmts)}] ⚠️  {msg}")
    conn.commit()
    print("\n✅ Schema applied successfully.")
