import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://cgjtpevnmwxyusowfani.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "sb_publishable_dyOcTPE4SXlGHyX2FfJ0tQ_G-NyA8Kq")

def get_supabase() -> Client:
    """Returns an authenticated Supabase client."""
    return create_client(SUPABASE_URL, SUPABASE_KEY)

# Singleton client for background tasks
supabase_client = get_supabase()
