import os
import asyncio
from typing import Any, List, Optional, Dict
import libsql_client
from dotenv import load_dotenv

load_dotenv()

TURSO_URL = os.getenv("TURSO_DATABASE_URL")
TURSO_AUTH_TOKEN = os.getenv("TURSO_AUTH_TOKEN")

class TursoDB:
    def __init__(self):
        self._client = None

    @property
    def client(self):
        if self._client is None:
            url = os.getenv("TURSO_DATABASE_URL")
            token = os.getenv("TURSO_AUTH_TOKEN")
            if not url or not token:
                raise ValueError("MATRIARCH_TURSO: Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN in environment. Please check Vercel settings.")
            self._client = libsql_client.create_client(url=url, auth_token=token)
        return self._client

    async def execute(self, sql: str, params: Optional[List[Any]] = None) -> Any:
        """Executes a query asynchronously and returns a ResultSet."""
        return await self.client.execute(sql, params or [])

    async def batch(self, queries: List[str]) -> List[Any]:
        """Executes a batch of queries asynchronously."""
        return await self.client.batch(queries)

    async def close(self):
        """Closes the client connection."""
        if self._client:
            await self._client.close()
            self._client = None

# Singleton instance
turso_client = TursoDB()
