import os
import httpx
import json
from typing import Any, List, Optional, Dict
from dotenv import load_dotenv

load_dotenv()

class TursoResultSet:
    """Mock ResultSet to maintain compatibility with the old SDK's return type."""
    def __init__(self, rows: List[Dict[str, Any]], columns: List[str]):
        self.rows = rows
        self.columns = columns
    
    def __iter__(self):
        return iter(self.rows)

class TursoDB:
    def __init__(self):
        self._url = os.getenv("TURSO_DATABASE_URL")
        self._token = os.getenv("TURSO_AUTH_TOKEN")
        self._client = None

    def _get_client(self):
        if self._client is None:
            url = self._url or "https://dummy-url.turso.io"
            token = self._token or ""
            
            if not self._url:
                print("WARNING: TURSO_DATABASE_URL is missing. Using dummy URL.")

            self._client = httpx.AsyncClient(
                base_url=url.replace("libsql://", "https://"),
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json"
                },
                timeout=10.0
            )
        return self._client

    async def execute(self, sql: str, params: Optional[List[Any]] = None) -> Any:
        """Executes a query via Turso HTTP API."""
        client = self._get_client()
        
        # Turso Pipeline API format
        payload = {
            "requests": [
                {
                    "type": "execute",
                    "stmt": {
                        "sql": sql,
                        "args": [{"type": "text", "value": str(v)} if not isinstance(v, (int, float, bool)) else {"type": "integer" if isinstance(v, int) else "float" if isinstance(v, float) else "boolean", "value": v} for v in (params or [])]
                    }
                },
                {"type": "close"}
            ]
        }
        
        # Simplified args handling for Turso compatibility
        formatted_args = []
        for p in (params or []):
            if isinstance(p, bool):
                formatted_args.append({"type": "boolean", "value": p})
            elif isinstance(p, int):
                formatted_args.append({"type": "integer", "value": str(p)})
            elif isinstance(p, float):
                formatted_args.append({"type": "float", "value": p})
            elif p is None:
                formatted_args.append({"type": "null"})
            else:
                formatted_args.append({"type": "text", "value": str(p)})

        payload = {
            "requests": [
                {
                    "type": "execute",
                    "stmt": {
                        "sql": sql,
                        "args": formatted_args
                    }
                },
                {"type": "close"}
            ]
        }

        response = await client.post("/v2/pipeline", json=payload)
        response.raise_for_status()
        data = response.json()
        
        result = data["results"][0]["response"]["result"]
        cols = [c["name"] for c in result["cols"]]
        rows = []
        for row_data in result["rows"]:
            row = {}
            for i, val in enumerate(row_data):
                row[cols[i]] = val.get("value")
            rows.append(row)
            
        return TursoResultSet(rows, cols)

    async def batch(self, requests: List[tuple]) -> List[Any]:
        """
        Executes a batch of queries in a single transaction-like pipeline.
        Each element in 'requests' should be a tuple of (sql, params).
        """
        client = self._get_client()
        
        pipeline_requests = []
        for sql, params in requests:
            formatted_args = []
            for p in (params or []):
                if isinstance(p, bool):
                    formatted_args.append({"type": "boolean", "value": p})
                elif isinstance(p, int):
                    formatted_args.append({"type": "integer", "value": str(p)})
                elif isinstance(p, float):
                    formatted_args.append({"type": "float", "value": p})
                elif p is None:
                    formatted_args.append({"type": "null"})
                else:
                    formatted_args.append({"type": "text", "value": str(p)})

            pipeline_requests.append({
                "type": "execute",
                "stmt": {
                    "sql": sql,
                    "args": formatted_args
                }
            })
        
        pipeline_requests.append({"type": "close"})
        
        payload = {"requests": pipeline_requests}
        response = await client.post("/v2/pipeline", json=payload)
        response.raise_for_status()
        data = response.json()
        
        results = []
        for i in range(len(requests)):
            res_data = data["results"][i]["response"]["result"]
            cols = [c["name"] for c in res_data["cols"]]
            rows = []
            for row_data in res_data["rows"]:
                row = {}
                for j, val in enumerate(row_data):
                    row[cols[j]] = val.get("value")
                rows.append(row)
            results.append(TursoResultSet(rows, cols))
            
        return results

    async def close(self):
        if self._client:
            await self._client.aclose()
            self._client = None

# Singleton instance
turso_client = TursoDB()
