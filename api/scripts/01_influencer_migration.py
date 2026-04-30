import asyncio
import sys
import os
sys.path.append(os.path.join(os.getcwd(), "api"))
from dotenv import load_dotenv; load_dotenv(".env")
os.environ["TURSO_DATABASE_URL"] = os.environ.get("VITE_TURSO_DATABASE_URL", "")
os.environ["TURSO_AUTH_TOKEN"] = os.environ.get("VITE_TURSO_AUTH_TOKEN", "")

from app.db.turso import turso_client

async def migrate():
    try:
        # Add columns to profiles if they don't exist
        try:
            await turso_client.execute("ALTER TABLE profiles ADD COLUMN is_influencer INTEGER DEFAULT 0;")
            print("Added is_influencer to profiles")
        except Exception as e:
            print("is_influencer likely exists:", str(e)[:100])
            
        try:
            await turso_client.execute("ALTER TABLE profiles ADD COLUMN pending_balance REAL DEFAULT 0.0;")
            print("Added pending_balance to profiles")
        except Exception as e:
            print("pending_balance likely exists:", str(e)[:100])

        # Create coupon_codes table
        await turso_client.execute("""
        CREATE TABLE IF NOT EXISTS coupon_codes (
            code TEXT PRIMARY KEY,
            influencer_id TEXT NOT NULL,
            discount_pct INTEGER DEFAULT 50,
            is_active INTEGER DEFAULT 1,
            created_by TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        """)
        print("Created coupon_codes table")

        # Create coupon_uses table
        await turso_client.execute("""
        CREATE TABLE IF NOT EXISTS coupon_uses (
            id TEXT PRIMARY KEY,
            coupon_code TEXT NOT NULL,
            used_by_user_id TEXT NOT NULL,
            discounted_amount REAL NOT NULL,
            commission_earned REAL NOT NULL,
            payment_utr TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        """)
        print("Created coupon_uses table")
        print("Migration complete!")
    except Exception as e:
        print("Migration failed:", type(e), e)

asyncio.run(migrate())
