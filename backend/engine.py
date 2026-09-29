"""
Cloud AI Architect V2 - Central Orchestration Engine
Unifies Workload NLP Parsing, Deterministic Multi-Cloud Evaluation, Architecture Synthesis,
Cost Modeling, and IaC Generation into a transparent, single-source-of-truth pipeline.
"""

from typing import Dict, Any, Optional
from backend.parser import parse_workload_requirements
from backend.scoring import evaluate_all_providers
from backend.architecture import generate_architecture_nodes, generate_decision_explanation
from backend.flaws import (
    analyze_architecture_flaws,
    analyze_billing_traps,
    get_service_tradeoffs,
    PROCUREMENT_SCENARIOS,
    CLOUD_CREDITS_DIRECTORY
)
from backend.iac import (
    generate_terraform,
    generate_dockerfile,
    generate_docker_compose,
    generate_cloud_init
)

def run_architect_pipeline(
    prompt: str,
    override_budget: Optional[float] = None,
    override_dau: Optional[int] = None,
    override_region: Optional[str] = None,
    override_surge: Optional[int] = None
) -> Dict[str, Any]:
    """
    Complete end-to-end pipeline:
    1. Parse natural language workload requirements & coordinated negation
    2. Deterministically evaluate all 7 cloud providers independently
    3. Calculate costs, capacity sizing, and mathematical confidence
    4. Synthesize tailored architecture nodes (only active components)
    5. Generate transparent decision explanation
    6. Generate infrastructure code templates (Terraform, Dockerfile, Compose, Cloud-init)
    7. Return unified single-source-of-truth state payload
    """
    if not prompt or not prompt.strip():
        return {
            "status": "awaiting_input",
            "message": "Please describe your workload before starting the analysis."
        }

    # Step 1: Parse requirements
    workload = parse_workload_requirements(
        prompt=prompt,
        override_budget=override_budget,
        override_dau=override_dau,
        override_region=override_region,
        override_surge=override_surge
    )

    if workload.get("status") == "awaiting_input":
        return {
            "status": "awaiting_input",
            "message": "Please describe your workload before starting the analysis."
        }

    # Step 2: Multi-Cloud Evaluation
    eval_result = evaluate_all_providers(workload)
    recommended = eval_result["recommended"]
    runner_up = eval_result["runnerUp"]
    confidence = eval_result["confidence"]
    ranking = eval_result["ranking"]

    # Step 3: Architecture Generation
    nodes = generate_architecture_nodes(workload, recommended["provider"])
    explanation = generate_decision_explanation(workload, recommended)

    # Step 4: Flaws, Billing Traps & Tradeoffs Analysis
    flaws = analyze_architecture_flaws(workload, recommended["provider"])
    billing_traps = analyze_billing_traps(workload, recommended["provider"])
    tradeoffs = get_service_tradeoffs(workload, recommended["provider"])

    # Step 5: Infrastructure Code Generation
    iac_templates = {
        "terraform": generate_terraform(workload, recommended["provider"]),
        "dockerfile": generate_dockerfile(workload),
        "dockerCompose": generate_docker_compose(workload),
        "cloudInit": generate_cloud_init(workload, recommended["provider"])
    }

    # 24-Hour Hosting Economics
    daily_cost_usd = round(recommended["costData"]["monthlyUSD"] / 30.4, 2)
    daily_cost_inr = round(recommended["costData"]["monthlyINR"] / 30.4, 2)

    # Step 6: Assemble Unified Results Payload
    return {
        "status": "results",
        "workload": workload,
        "recommended": {
            "id": recommended["providerId"],
            "name": recommended["providerName"],
            "badge": recommended["badge"],
            "score": recommended["totalScore"],
            "category": recommended["provider"]["category"],
            "tagline": recommended["provider"]["tagline"],
            "description": recommended["provider"]["description"],
            "cost": recommended["costData"],
            "cost24HrUSD": daily_cost_usd,
            "cost24HrINR": daily_cost_inr,
            "freeAllowance": recommended["provider"].get("freeAllowance", ""),
            "bandwidthIncluded": recommended["provider"].get("bandwidthIncluded", ""),
            "starterSpec": recommended["provider"].get("starterSpec", ""),
            "breakdown": recommended["breakdown"],
            "matchedRequirements": recommended["matchedRequirements"],
            "unmatchedRequirements": recommended["unmatchedRequirements"],
            "strengths": recommended["strengths"],
            "weaknesses": recommended["weaknesses"],
            "pros": recommended["provider"].get("pros", []),
            "cons": recommended["provider"].get("cons", []),
            "services": recommended["provider"]["services"]
        },
        "runnerUp": {
            "id": runner_up["providerId"],
            "name": runner_up["providerName"],
            "score": runner_up["totalScore"],
            "costMonthlyUSD": runner_up["costData"]["monthlyUSD"],
            "costMonthlyINR": runner_up["costData"]["monthlyINR"]
        },
        "confidence": confidence,
        "ranking": [
            {
                "rank": p["rank"],
                "id": p["providerId"],
                "name": p["providerName"],
                "badge": p["badge"],
                "category": p["provider"]["category"],
                "score": p["totalScore"],
                "monthlyCostUSD": p["costData"]["monthlyUSD"],
                "monthlyCostINR": p["costData"]["monthlyINR"],
                "matchedCount": len(p["matchedRequirements"]),
                "unmatchedCount": len(p["unmatchedRequirements"]),
                "matchedRequirements": p["matchedRequirements"][:3],
                "strengths": p["strengths"][:2],
                "weaknesses": p["weaknesses"][:2],
                "scores": p["scores"]
            }
            for p in ranking
        ],
        "architecture": {
            "nodes": nodes,
            "nodeCount": len(nodes),
            "tierSummary": f"{len(nodes)} Active Architectural Stages"
        },
        "flaws": flaws,
        "billingTraps": billing_traps,
        "serviceTradeoffs": tradeoffs,
        "procurementScenarios": PROCUREMENT_SCENARIOS,
        "explanation": explanation,
        "iac": iac_templates,
        "debug": {
            "rawPrompt": prompt,
            "negatedCapabilities": workload.get("negatedCapabilities", []),
            "extractedKeywords": workload.get("extractedKeywords", []),
            "confidenceMath": {
                "topScore": recommended["totalScore"],
                "runnerUpScore": runner_up["totalScore"],
                "scoreGap": recommended["totalScore"] - runner_up["totalScore"],
                "confidencePercent": confidence
            }
        }
    }
