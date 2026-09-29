"""
Database module for Cloud AI Architect.
Lightweight, atomic SQLite persistence for architecture blueprints and workload designs.
"""

import sqlite3
import json
import os
import secrets
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "blueprints.db")

def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize the SQLite database with the blueprints schema."""
    with get_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS blueprints (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT DEFAULT '',
                stack TEXT NOT NULL,
                provider TEXT NOT NULL,
                monthly_users INTEGER NOT NULL DEFAULT 0,
                storage_gb INTEGER NOT NULL DEFAULT 0,
                egress_gb INTEGER NOT NULL DEFAULT 0,
                read_ops INTEGER NOT NULL DEFAULT 0,
                write_ops INTEGER NOT NULL DEFAULT 0,
                monthly_cost REAL NOT NULL DEFAULT 0.0,
                spec_json TEXT NOT NULL DEFAULT '{}',
                result_json TEXT NOT NULL DEFAULT '{}',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        """)
        conn.execute("CREATE INDEX IF NOT EXISTS idx_blueprints_created ON blueprints(created_at DESC)")
        conn.commit()

# Ensure database and table exist upon module load
init_db()

def generate_blueprint_id() -> str:
    """Generate a clean, readable blueprint identifier."""
    return f"arch-{secrets.token_hex(4)}"

def save_blueprint(
    name: str,
    spec: Dict[str, Any],
    result: Dict[str, Any],
    description: str = "",
    blueprint_id: Optional[str] = None
) -> Dict[str, Any]:
    """Save or update an architecture blueprint."""
    now = datetime.now(timezone.utc).isoformat()
    bid = blueprint_id or generate_blueprint_id()

    stack = result.get("recommended", {}).get("stack", spec.get("targetStack", "General Workload"))
    provider = result.get("recommended", {}).get("provider", "Multi-Cloud")
    monthly_users = int(spec.get("monthlyUsers", 0))
    storage_gb = int(spec.get("storageGB", 0))
    egress_gb = int(spec.get("egressGB", 0))
    read_ops = int(spec.get("readOpsPerSec", 0))
    write_ops = int(spec.get("writeOpsPerSec", 0))
    monthly_cost = float(result.get("recommended", {}).get("monthlyCost", 0.0))

    with get_connection() as conn:
        conn.execute("""
            INSERT INTO blueprints (
                id, name, description, stack, provider,
                monthly_users, storage_gb, egress_gb, read_ops, write_ops,
                monthly_cost, spec_json, result_json, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                name = excluded.name,
                description = excluded.description,
                stack = excluded.stack,
                provider = excluded.provider,
                monthly_users = excluded.monthly_users,
                storage_gb = excluded.storage_gb,
                egress_gb = excluded.egress_gb,
                read_ops = excluded.read_ops,
                write_ops = excluded.write_ops,
                monthly_cost = excluded.monthly_cost,
                spec_json = excluded.spec_json,
                result_json = excluded.result_json,
                updated_at = excluded.updated_at
        """, (
            bid, name, description, stack, provider,
            monthly_users, storage_gb, egress_gb, read_ops, write_ops,
            monthly_cost, json.dumps(spec), json.dumps(result), now, now
        ))
        conn.commit()

    return get_blueprint(bid)

def get_blueprint(blueprint_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve an architecture blueprint by its unique identifier."""
    with get_connection() as conn:
        cursor = conn.execute("SELECT * FROM blueprints WHERE id = ?", (blueprint_id,))
        row = cursor.fetchone()
        if not row:
            return None
        
        return {
            "id": row["id"],
            "name": row["name"],
            "description": row["description"],
            "stack": row["stack"],
            "provider": row["provider"],
            "monthly_users": row["monthly_users"],
            "storage_gb": row["storage_gb"],
            "egress_gb": row["egress_gb"],
            "read_ops": row["read_ops"],
            "write_ops": row["write_ops"],
            "monthly_cost": row["monthly_cost"],
            "spec": json.loads(row["spec_json"]),
            "result": json.loads(row["result_json"]),
            "created_at": row["created_at"],
            "updated_at": row["updated_at"]
        }

def list_blueprints(limit: int = 50) -> List[Dict[str, Any]]:
    """List recent saved blueprints."""
    with get_connection() as conn:
        cursor = conn.execute(
            """
            SELECT id, name, description, stack, provider,
                   monthly_users, storage_gb, egress_gb, monthly_cost,
                   created_at, updated_at
            FROM blueprints
            ORDER BY created_at DESC
            LIMIT ?
            """,
            (limit,)
        )
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

def delete_blueprint(blueprint_id: str) -> bool:
    """Delete a saved blueprint."""
    with get_connection() as conn:
        cursor = conn.execute("DELETE FROM blueprints WHERE id = ?", (blueprint_id,))
        conn.commit()
        return cursor.rowcount > 0
