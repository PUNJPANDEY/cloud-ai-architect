"""
Cloud AI Architect V2 - IaC Generation Router
"""

from fastapi import APIRouter
from backend.models import IaCGenerateRequest
from backend.providers import get_provider_by_id
from backend.iac import (
    generate_terraform,
    generate_dockerfile,
    generate_docker_compose,
    generate_cloud_init
)

router = APIRouter(prefix="/api/iac", tags=["Infrastructure as Code"])

@router.post("/generate")
def generate_iac(req: IaCGenerateRequest):
    """
    Generate tailored infrastructure code matching the active architecture.
    """
    provider = get_provider_by_id(req.providerId)
    fmt = req.format.lower()
    workload = req.workload

    if "dockerfile" in fmt:
        code = generate_dockerfile(workload)
        filename = "Dockerfile"
    elif "compose" in fmt:
        code = generate_docker_compose(workload)
        filename = "docker-compose.yml"
    elif "cloud-init" in fmt:
        code = generate_cloud_init(workload, provider)
        filename = "cloud-init.yaml"
    else:
        code = generate_terraform(workload, provider)
        filename = "main.tf"

    return {
        "format": fmt,
        "filename": filename,
        "provider": provider.get("name"),
        "code": code
    }
