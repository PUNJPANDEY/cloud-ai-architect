"""
Cloud AI Architect V2 - Evaluation Router
Provides endpoints for prompt-driven architecture synthesis, evaluation, and developer test fixtures.
"""

from fastapi import APIRouter, HTTPException
from backend.models import ArchitectPromptRequest, EvaluateRequest
from backend.engine import run_architect_pipeline
from backend.scoring import evaluate_all_providers
from backend.architecture import generate_architecture_nodes, generate_decision_explanation
from backend.iac import generate_terraform, generate_dockerfile, generate_docker_compose, generate_cloud_init

router = APIRouter(prefix="/api", tags=["Evaluation & Architecture"])

TEST_FIXTURES = [
    {
        "id": "test-1-microsoft-enterprise",
        "name": "TEST 1 — Microsoft Enterprise Platform",
        "description": "Enterprise HR & internal operations platform for 180,000 employees with Windows Server, SQL Server, Microsoft Entra ID, and hybrid datacenter connectivity.",
        "prompt": "An enterprise HR platform serving 180,000 daily active employees with a monthly budget of ₹8,00,000 in India. It uses Microsoft Entra ID, SQL Server, Windows Server and requires hybrid connectivity to an existing datacenter. Traffic can surge to 4× during month-end payroll, with scheduled payroll and reporting jobs. No GPU inference, no WebSockets, no media uploads."
    },
    {
        "id": "test-2-generic-saas",
        "name": "TEST 2 — Generic Cloud SaaS",
        "description": "High-traffic modern web application with PostgreSQL, Redis cache, object storage, and autoscaling.",
        "prompt": "A modern B2B SaaS web application serving 45,000 daily active users with 2x traffic surge. Uses PostgreSQL, Redis caching, and object storage for user documents. No special vendor ecosystem, no GPU, no WebSockets. Monthly budget is ₹1,00,000."
    },
    {
        "id": "test-3-gpu-ai-platform",
        "name": "TEST 3 — GPU AI Platform",
        "description": "Deep learning and generative model inference platform running on Kubernetes with object storage.",
        "prompt": "An AI inference platform serving 15,000 daily active users for LLM and computer vision model inference. Requires GPU acceleration, Kubernetes container orchestration, and high-performance object storage for model weights. Monthly budget is ₹3,00,000."
    },
    {
        "id": "test-4-small-dashboard",
        "name": "TEST 4 — Small Internal Dashboard",
        "description": "Cost-sensitive internal analytics dashboard for 2,000 DAU with PostgreSQL and low budget.",
        "prompt": "A small internal company dashboard for 2,000 daily active users. Uses PostgreSQL and basic authentication. No GPU, no video processing, and no WebSockets. Low monthly budget of ₹10,000."
    },
    {
        "id": "test-5-high-realtime",
        "name": "TEST 5 — High-Realtime Application",
        "description": "Live collaborative streaming app with WebSockets, Redis pub/sub, and 4x traffic bursts.",
        "prompt": "A live collaborative multiplayer tool serving 80,000 daily active users with 4x traffic surge. Requires high-concurrency WebSockets, Redis pub/sub for real-time state sync, and background workers. No GPU inference required. Budget of ₹2,00,000."
    }
]

def _process_architect_request(request: ArchitectPromptRequest):
    prompt = request.prompt or ""
    effective_budget = request.budget if request.budget is not None else request.overrideBudget
    effective_dau = request.dau if request.dau is not None else request.overrideDAU
    effective_region = request.region or request.overrideRegion
    effective_surge = request.surge if request.surge is not None else request.overrideSurge

    if not prompt.strip() and not request.spec:
        return {
            "status": "awaiting_input",
            "message": "Please describe your workload before starting the analysis."
        }

    return run_architect_pipeline(
        prompt=prompt,
        override_budget=effective_budget,
        override_dau=effective_dau,
        override_region=effective_region,
        override_surge=effective_surge
    )

@router.post("/architect")
def architect_from_prompt(request: ArchitectPromptRequest):
    """
    Synthesize complete multi-cloud architecture and deterministic evaluation from natural language.
    """
    try:
        return _process_architect_request(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Architecture pipeline failed: {str(e)}")

@router.post("/evaluate")
def evaluate_endpoint(request: EvaluateRequest):
    """
    Unified evaluation endpoint supporting both natural prompt descriptions and structured specs.
    """
    try:
        if request.spec and not request.prompt:
            workload = request.spec
            eval_result = evaluate_all_providers(workload)
            recommended = eval_result["recommended"]
            nodes = generate_architecture_nodes(workload, recommended["provider"])
            explanation = generate_decision_explanation(workload, recommended)

            return {
                "status": "results",
                "workload": workload,
                "recommended": recommended,
                "runnerUp": eval_result["runnerUp"],
                "confidence": eval_result["confidence"],
                "ranking": eval_result["ranking"],
                "architecture": {
                    "nodes": nodes,
                    "nodeCount": len(nodes)
                },
                "explanation": explanation
            }
        
        # Otherwise execute full NLP pipeline
        req_arch = ArchitectPromptRequest(
            prompt=request.prompt,
            budget=request.budget,
            dau=request.dau,
            region=request.region,
            surge=request.surge,
            overrideBudget=request.overrideBudget,
            overrideDAU=request.overrideDAU,
            overrideRegion=request.overrideRegion,
            overrideSurge=request.overrideSurge,
            spec=request.spec
        )
        return _process_architect_request(req_arch)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")

@router.get("/fixtures")
def get_developer_fixtures():
    """
    Return built-in developer/evaluator test fixtures.
    """
    return {
        "status": "success",
        "fixtures": TEST_FIXTURES
    }
