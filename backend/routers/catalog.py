"""
Cloud Provider Catalog router.
Serves canonical cloud providers, validated service catalog records,
credits directory, and procurement scenarios.
"""

from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from backend.providers import CLOUD_PROVIDERS, get_provider_by_id
from backend.services import get_all_canonical_services, validate_service_records
from backend.flaws import CLOUD_CREDITS_DIRECTORY, PROCUREMENT_SCENARIOS

router = APIRouter(prefix="/api/catalog", tags=["Cloud Catalog & Pricing"])

# Pre-validate canonical services catalog on module load
ALL_CANONICAL_SERVICES = get_all_canonical_services()
validate_service_records(ALL_CANONICAL_SERVICES)

@router.get("")
def get_catalog():
    """List all supported cloud providers with pricing, compliance, and canonical services catalog."""
    return {
        "count": len(CLOUD_PROVIDERS),
        "providers": CLOUD_PROVIDERS,
        "services": ALL_CANONICAL_SERVICES,
        "servicesCount": len(ALL_CANONICAL_SERVICES)
    }

@router.get("/services")
def get_services(
    provider: Optional[str] = Query(None, description="Filter by provider ID (e.g. azure, aws, gcp)"),
    category: Optional[str] = Query(None, description="Filter by category (e.g. compute, database, storage)"),
    search: Optional[str] = Query(None, description="Search keyword for name, description, capabilities")
):
    """Query and filter canonical service records across all 17 providers."""
    results = ALL_CANONICAL_SERVICES
    
    if provider and provider != "all":
        results = [s for s in results if s["providerId"].lower() == provider.lower()]
        
    if category and category != "all":
        results = [s for s in results if s["category"].lower() == category.lower()]
        
    if search:
        q = search.lower().strip()
        results = [
            s for s in results if (
                q in s["name"].lower() or 
                q in s["description"].lower() or 
                q in s["providerName"].lower() or
                any(q in cap.lower() for cap in s["capabilities"])
            )
        ]
        
    return {
        "count": len(results),
        "services": results
    }

@router.get("/credits")
def get_credits_directory():
    """Directory of cloud credits and startup programs across all 17 providers."""
    return {
        "count": len(CLOUD_CREDITS_DIRECTORY),
        "programs": CLOUD_CREDITS_DIRECTORY
    }

@router.get("/scenarios")
def get_scenarios():
    """Procurement Scenarios (A - F)."""
    return {
        "count": len(PROCUREMENT_SCENARIOS),
        "scenarios": PROCUREMENT_SCENARIOS
    }

@router.get("/{provider_id}")
def get_provider(provider_id: str):
    """Retrieve specifications for a single cloud provider."""
    provider = get_provider_by_id(provider_id)
    if provider:
        return provider
    raise HTTPException(status_code=404, detail=f"Provider '{provider_id}' not found in catalog")
