"""
Cloud AI Architect V2 - Independent Cost Estimation Engine
Calculates realistic, itemized infrastructure cost estimates for each cloud provider
based on actual workload technical sizing and provider-specific pricing dimensions.
"""

from typing import Dict, Any, List

USD_TO_INR = 86.50

def estimate_provider_cost(workload: Dict[str, Any], provider: Dict[str, Any]) -> Dict[str, Any]:
    """
    Deterministic cost model for a cloud provider given a structured workload.
    Calculates compute, database, cache, storage, egress bandwidth, GPU, hybrid, and background jobs.
    """
    pricing = provider.get("pricing", {})
    sizing = workload.get("sizing", {})

    peak_rps = sizing.get("peakRPS", 5)
    bandwidth_gb = sizing.get("estimatedBandwidthGBMonth", 50)
    storage_gb = sizing.get("estimatedStorageGB", 50)
    dau = workload.get("dailyActiveUsers") or 5000

    # 1. Compute Cost
    # Calculate required vCPU and RAM from peak RPS and workload type
    base_vcpus = max(1, round(peak_rps / 75.0, 1))
    if workload.get("operatingSystem") == "windows":
        base_vcpus = max(2, base_vcpus * 1.25)
    base_ram_gb = max(2, base_vcpus * 2)

    compute_hourly_vcpu = pricing.get("computePerHourVCPU", 0.040)
    ram_hourly_gb = pricing.get("ramPerHourGB", 0.005)
    hours_per_month = 730

    compute_cost = (base_vcpus * compute_hourly_vcpu + base_ram_gb * ram_hourly_gb) * hours_per_month

    # 2. Database Cost
    db_cost = 0.0
    db_spec = workload.get("database", {})
    if db_spec.get("required", False):
        db_base = pricing.get("dbBaseMonthly", 25.0)
        # Sizing multiplier based on DAU
        db_scale = 1.0
        if dau > 100000:
            db_scale = 3.5
        elif dau > 25000:
            db_scale = 2.0

        license_mult = 1.0
        if db_spec.get("type") == "sql-server":
            license_mult = pricing.get("sqlServerLicenseMultiplier", 2.0)
        elif db_spec.get("type") == "oracle-db":
            license_mult = 2.5 if provider.get("id") != "oci" else 1.2

        ha_mult = 1.65 if db_spec.get("highAvailability") else 1.0
        db_cost = db_base * db_scale * license_mult * ha_mult

    # 3. Object Storage Cost
    storage_cost = 0.0
    if workload.get("objectStorage", {}).get("required", False):
        storage_rate = pricing.get("objectStoragePerGBMonth", 0.020)
        storage_cost = storage_gb * storage_rate

    # 4. Outbound Egress Bandwidth Cost
    egress_rate = pricing.get("egressPerGB", 0.085)
    # Providers with free tiers (e.g. OCI has 10TB free, Hetzner has 20TB free, DO includes pools)
    if provider.get("id") == "oci":
        billable_bandwidth = max(0, bandwidth_gb - 10000)
    elif provider.get("id") == "hetzner":
        billable_bandwidth = max(0, bandwidth_gb - 20000)
    elif provider.get("id") == "digitalocean":
        billable_bandwidth = max(0, bandwidth_gb - 1000)
    else:
        billable_bandwidth = bandwidth_gb

    egress_cost = billable_bandwidth * egress_rate

    # 5. Cache Cost (Redis)
    cache_cost = 0.0
    if workload.get("cache", {}).get("required", False):
        cache_cost = pricing.get("cacheBaseMonthly", 20.0)
        if dau > 100000:
            cache_cost *= 2.2

    # 6. GPU Model Inference Cost
    gpu_cost = 0.0
    if workload.get("gpuInference", {}).get("required", False):
        gpu_rate = pricing.get("gpuHourlyRate", 1.20)
        # Assume active inference during business or active user hours (~300h to 730h)
        inference_hours = 400 if dau < 50000 else 730
        gpu_cost = gpu_rate * inference_hours

    # 7. Hybrid Connectivity Gateway Cost
    hybrid_cost = 0.0
    if workload.get("hybridConnectivity", False):
        hybrid_cost = pricing.get("hybridGatewayMonthly", 60.0)

    # 8. Scheduled Jobs / Background Workers
    worker_cost = 0.0
    if workload.get("scheduledJobs", {}).get("required", False) or workload.get("backgroundWorkers", {}).get("required", False):
        worker_cost = 15.0 if provider.get("category") == "hyperscaler" else 7.0

    total_monthly_usd = round(
        compute_cost + db_cost + storage_cost + egress_cost + cache_cost + gpu_cost + hybrid_cost + worker_cost,
        2
    )

    total_monthly_inr = round(total_monthly_usd * USD_TO_INR, 2)
    daily_usd = round(total_monthly_usd / 30.4, 2)
    daily_inr = round(total_monthly_inr / 30.4, 2)

    range_min_usd = round(total_monthly_usd * 0.85, 2)
    range_max_usd = round(total_monthly_usd * 1.25, 2)
    range_min_inr = round(range_min_usd * USD_TO_INR, 2)
    range_max_inr = round(range_max_usd * USD_TO_INR, 2)

    # Database driver details
    db_type_key = db_spec.get("type", "none")
    if db_type_key == "sql-server":
        db_detail_str = f"Enterprise SQL Server (Multi-AZ HA)" if db_spec.get("highAvailability") else "Enterprise SQL Server"
    elif db_type_key == "oracle-db":
        db_detail_str = "Oracle Database RAC Cluster"
    elif db_type_key == "sql-postgres":
        db_detail_str = "Managed PostgreSQL (Multi-AZ HA)" if db_spec.get("highAvailability") else "Managed PostgreSQL"
    elif db_type_key == "sql-mysql":
        db_detail_str = "Managed MySQL Cluster"
    else:
        db_detail_str = db_type_key.capitalize()

    # Cost breakdown items
    raw_drivers = [
        {"name": "Core Application Compute", "costUSD": round(compute_cost, 2), "details": f"{base_vcpus} vCPU / {base_ram_gb}GB RAM (Windows Server)" if workload.get("operatingSystem") == "windows" else f"{base_vcpus} vCPU / {base_ram_gb}GB RAM estimated"},
        {"name": "Database Cluster", "costUSD": round(db_cost, 2), "details": db_detail_str},
        {"name": "Object Storage & Media", "costUSD": round(storage_cost, 2), "details": f"{storage_gb} GB capacity ({sizing.get('storageBasis', 'Document archives')})"},
        {"name": "Outbound Egress Bandwidth", "costUSD": round(egress_cost, 2), "details": f"{bandwidth_gb} GB egress/mo ({sizing.get('bandwidthBasis', 'Transactional traffic')})"},
        {"name": "In-Memory Cache (Redis)", "costUSD": round(cache_cost, 2), "details": "Low-latency session/cache tier"},
        {"name": "GPU Model Inference", "costUSD": round(gpu_cost, 2), "details": "Dedicated Tensor/Inference host"},
        {"name": "Enterprise Hybrid Gateway", "costUSD": round(hybrid_cost, 2), "details": "DirectConnect / ExpressRoute gateway"},
        {"name": "Job Queues & Background Workers", "costUSD": round(worker_cost, 2), "details": "Async tasks and scheduled cron"}
    ]

    # Filter non-zero items and calculate percentage
    cost_drivers = []
    for item in raw_drivers:
        if item["costUSD"] > 0:
            pct = round((item["costUSD"] / total_monthly_usd) * 100, 1) if total_monthly_usd > 0 else 0
            cost_drivers.append({
                "name": item["name"],
                "costUSD": item["costUSD"],
                "costINR": round(item["costUSD"] * USD_TO_INR, 2),
                "percentage": pct,
                "details": item["details"]
            })

    cost_drivers.sort(key=lambda x: x["costUSD"], reverse=True)

    # Check budget alignment
    user_budget_usd = workload.get("monthlyBudgetUSD")
    if user_budget_usd and user_budget_usd > 0:
        if total_monthly_usd <= user_budget_usd:
            budget_status = "within_budget"
            budget_delta_usd = round(user_budget_usd - total_monthly_usd, 2)
        else:
            budget_status = "exceeds_budget"
            budget_delta_usd = round(total_monthly_usd - user_budget_usd, 2)
    else:
        budget_status = "no_budget_specified"
        budget_delta_usd = 0.0

    return {
        "monthlyUSD": total_monthly_usd,
        "monthlyINR": total_monthly_inr,
        "dailyUSD": daily_usd,
        "dailyINR": daily_inr,
        "rangeMinUSD": range_min_usd,
        "rangeMaxUSD": range_max_usd,
        "rangeMinINR": range_min_inr,
        "rangeMaxINR": range_max_inr,
        "budgetStatus": budget_status,
        "budgetDeltaUSD": budget_delta_usd,
        "costDrivers": cost_drivers
    }
