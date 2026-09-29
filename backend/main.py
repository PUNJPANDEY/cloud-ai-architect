"""
FastAPI application entrypoint for Cloud AI Architect.
Provides REST APIs for multi-cloud evaluation, blueprint persistence,
IaC generation, and serves the frontend workbench.
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, Response

from backend.database import init_db
from backend.providers import CLOUD_PROVIDERS
from backend.routers import evaluation, blueprints, catalog, iac, export

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(PROJECT_ROOT, "frontend")
if not os.path.exists(FRONTEND_DIR):
    FRONTEND_DIR = PROJECT_ROOT

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database on startup
    init_db()
    yield

app = FastAPI(
    title="Cloud AI Architect V2 Platform Engine",
    description="Deterministic multi-cloud evaluation, capacity sizing, transparent scoring, and architecture synthesizer.",
    version="2.0.0",
    lifespan=lifespan
)

# CORS middleware for local network and web access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health & Status Endpoint
@app.get("/api/health", tags=["System"])
def health_check():
    """Health check endpoint reporting API engine status."""
    return {
        "status": "healthy",
        "engine": "FastAPI v0.115+",
        "database": "SQLite 3 (Operational)",
        "cloudsIndexed": len(CLOUD_PROVIDERS),
        "mode": "Transparent Deterministic Systems Workbench"
    }

# Register API Routers
app.include_router(evaluation.router)
app.include_router(blueprints.router)
app.include_router(catalog.router)
app.include_router(iac.router)
app.include_router(export.router)

NO_CACHE_HEADERS = {
    "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
    "Pragma": "no-cache",
    "Expires": "0"
}

# Serve Frontend static files (HTML, CSS, JS)
@app.api_route("/", methods=["GET", "HEAD"], include_in_schema=False)
def serve_root():
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"), headers=NO_CACHE_HEADERS)

@app.api_route("/index.html", methods=["GET", "HEAD"], include_in_schema=False)
def serve_index():
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"), headers=NO_CACHE_HEADERS)

@app.get("/download", include_in_schema=False)
@app.get("/download.html", include_in_schema=False)
def serve_download():
    return FileResponse(os.path.join(FRONTEND_DIR, "download.html"), headers=NO_CACHE_HEADERS)

@app.get("/styles.css", include_in_schema=False)
def serve_css():
    return FileResponse(os.path.join(FRONTEND_DIR, "styles.css"), headers=NO_CACHE_HEADERS)

@app.get("/engine.js", include_in_schema=False)
def serve_js():
    return FileResponse(os.path.join(FRONTEND_DIR, "engine.js"), headers=NO_CACHE_HEADERS)

@app.get("/client_engine.js", include_in_schema=False)
def serve_client_engine_js():
    return FileResponse(os.path.join(FRONTEND_DIR, "client_engine.js"), headers=NO_CACHE_HEADERS)

@app.get("/aurora.js", include_in_schema=False)
def serve_aurora_js():
    return FileResponse(os.path.join(FRONTEND_DIR, "aurora.js"), headers=NO_CACHE_HEADERS)

@app.get("/visualizer3d.js", include_in_schema=False)
def serve_visualizer_js():
    return FileResponse(os.path.join(FRONTEND_DIR, "visualizer3d.js"), headers=NO_CACHE_HEADERS)

@app.get("/download/full", include_in_schema=False)
@app.get("/cloud_ai_architect.zip", include_in_schema=False)
def serve_zip():
    zip_path = os.path.join(PROJECT_ROOT, "cloud_ai_architect.zip")
    if not os.path.exists(zip_path):
        zip_path = os.path.join(FRONTEND_DIR, "cloud_ai_architect.zip")
    if os.path.exists(zip_path):
        with open(zip_path, "rb") as f:
            data = f.read()
        return Response(
            content=data,
            media_type="application/zip",
            headers={
                "Content-Disposition": 'attachment; filename="cloud_ai_architect.zip"',
                "Content-Length": str(len(data)),
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "no-cache"
            }
        )
    return {"error": "Zip file not yet generated"}

@app.get("/download/netlify", include_in_schema=False)
@app.get("/netlify_deploy.zip", include_in_schema=False)
def serve_netlify_zip():
    zip_path = os.path.join(PROJECT_ROOT, "netlify_deploy.zip")
    if not os.path.exists(zip_path):
        zip_path = os.path.join(FRONTEND_DIR, "netlify_deploy.zip")
    if os.path.exists(zip_path):
        with open(zip_path, "rb") as f:
            data = f.read()
        return Response(
            content=data,
            media_type="application/zip",
            headers={
                "Content-Disposition": 'attachment; filename="netlify_deploy.zip"',
                "Content-Length": str(len(data)),
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "no-cache"
            }
        )
    return {"error": "Netlify zip file not yet generated"}
