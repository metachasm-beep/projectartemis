import sys
import os
import traceback
from starlette.applications import Starlette
from starlette.responses import PlainTextResponse

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from app.main import app
except Exception as e:
    err_traceback = traceback.format_exc()
    print("CRITICAL STARTUP ERROR:")
    print(err_traceback)
    
    # Create a dummy Starlette app that just returns the error
    app = Starlette()
    @app.route("/{path:path}")
    async def catch_all(request):
        return PlainTextResponse(f"MATRIARCH STARTUP CRASH:\n\n{err_traceback}", status_code=500)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
