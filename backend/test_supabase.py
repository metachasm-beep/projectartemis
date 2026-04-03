"""
Apply schema using Supabase's REST API via the pg endpoint.
The anon key has limited SQL access, but we can run DDL via the
Supabase Management API if we have a service role key.

For now, we'll use the Supabase REST API's built-in functionality
to create tables using the PostgREST interface.

ALTERNATIVELY: Run the SQL manually in Supabase Dashboard > SQL Editor.
Copy the SQL from: backend/supabase/migrations/20260403_init_schema.sql
"""
import httpx
import json

SUPABASE_URL = "https://cgjtpevnmwxyusowfani.supabase.co"
SUPABASE_KEY = "sb_publishable_dyOcTPE4SXlGHyX2FfJ0tQ_G-NyA8Kq"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
}

# Test connection
resp = httpx.get(f"{SUPABASE_URL}/rest/v1/", headers=headers)
print(f"Supabase REST API status: {resp.status_code}")
print(f"Response: {resp.text[:300]}")

# Check if legal_document_versions table exists
resp2 = httpx.get(
    f"{SUPABASE_URL}/rest/v1/legal_document_versions?select=*&limit=5",
    headers=headers,
)
print(f"\nlegal_document_versions check: {resp2.status_code}")
print(resp2.text[:500])
