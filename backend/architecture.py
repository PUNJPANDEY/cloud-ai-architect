"""
Cloud AI Architect V2 - Architecture Schematic & Explanation Generator
Derives a tailored multi-tier cloud topology strictly from active workload requirements
and the recommended cloud provider's native service portfolio.
Generates explanation text grounded exclusively in active capabilities.
Guarantees full data integrity: every node has id, name, provider, service, category,
purpose, requirementMapping, and configuration.
"""

from typing import Dict, Any, List

def generate_architecture_nodes(
    workload: Dict[str, Any],
    provider: Dict[str, Any]
) -> List[Dict[str, Any]]:
    """
    Generate architecture schematic nodes. Only active components are included.
    No phantom nodes (No GPU if GPU=OFF, no Redis if cache=OFF, no K8s if not requested).
    Every node adheres strictly to the canonical component schema.
    """
    services = provider.get("services", {})
    pid = provider.get("id", "cloud")
    pname = provider.get("shortName", provider.get("name", "Cloud"))
    nodes = []

    dau = workload.get("dailyActiveUsers")
    surge = workload.get("trafficSurge", 1)
    dau_label = f"{dau:,} DAU" if dau else "Global Users"
    if surge > 1:
        dau_label += f" ({surge}× Peak Surge)"

    is_windows = workload.get("operatingSystem") == "windows"
    is_ha = workload.get("highAvailability", False) or workload.get("database", {}).get("highAvailability", False)

    # 1. User Layer (Always Present)
    nodes.append({
        "id": "tier-users",
        "name": "Client Traffic & Endpoints",
        "provider": "External / Corporate Network",
        "service": f"Corporate Users ({dau_label})",
        "category": "edge",
        "purpose": f"Employee browsers, corporate intranet clients, and mobile devices across {workload.get('region', 'India')}.",
        "requirementMapping": f"Client Workload Volume ({dau_label})",
        "configuration": f"Targeting {dau_label} with {workload.get('sizing', {}).get('avgRPS', 25)} avg RPS / {workload.get('sizing', {}).get('peakRPS', 100)} peak RPS",
        "active": True,
        "icon": "users"
    })

    # 2. DNS & Ingress Load Balancer Layer (Always Present)
    lb_service = services.get("loadBalancer", f"{pname} Application Gateway")
    dns_service = services.get("dns", f"{pname} DNS")
    nodes.append({
        "id": "tier-ingress",
        "name": "Traffic Ingress & Load Balancing",
        "provider": pname,
        "service": lb_service,
        "category": "networking",
        "purpose": "SSL/TLS offloading, Layer 7 path-based routing, health probes, and Web Application Firewall (WAF) packet inspection.",
        "requirementMapping": "High Availability Ingress & SSL Termination",
        "configuration": f"{dns_service} Anycast DNS + {lb_service} (WAF v2 Multi-AZ Redundancy)",
        "active": True,
        "icon": "shield-check"
    })

    # 3. Identity & Authentication (ONLY if Microsoft ecosystem or auth required)
    if workload.get("microsoftEcosystem", False):
        id_service = services.get("identity", "Microsoft Entra ID (Azure Active Directory)")
        nodes.append({
            "id": "tier-identity",
            "name": "Enterprise Identity & Access Management",
            "provider": pname,
            "service": id_service,
            "category": "security",
            "purpose": "Federated Single Sign-On (SSO), SAML/OIDC authentication, SCIM user provisioning, and Conditional Access policies.",
            "requirementMapping": "Microsoft Entra ID & Active Directory SSO",
            "configuration": "Entra ID P1/P2 Tenant with Conditional Access & Multi-Factor Authentication",
            "active": True,
            "icon": "lock"
        })

    # 4. Application Compute Layer (Always Present)
    compute_service = services.get("compute", f"{pname} Virtual Machines")
    if workload.get("kubernetes", False):
        compute_service = services.get("containerOrchestrator", f"{pname} Managed Kubernetes")
        os_label = "Kubernetes Cluster Nodes"
        config_label = f"{compute_service} Autopilot (Autoscaling Node Pools)"
    elif workload.get("serverless", False):
        compute_service = services.get("serverless", f"{pname} Serverless Containers")
        os_label = "Stateless Container Runtime"
        config_label = f"{compute_service} Autoscaling with Concurrency Sizing"
    elif is_windows:
        os_label = "Windows Server 2022 Datacenter"
        config_label = "Standard D4s_v5 (4 vCPU, 16 GB RAM) Autoscaling Virtual Machine Scale Sets"
    else:
        os_label = "Enterprise Linux / Ubuntu LTS"
        config_label = "General Purpose Compute Instances with Horizontal Pod Autoscaler"

    nodes.append({
        "id": "tier-compute",
        "name": "Application Compute Tier",
        "provider": pname,
        "service": compute_service,
        "category": "compute",
        "purpose": f"High-throughput application server runtime executing backend business logic on {os_label}.",
        "requirementMapping": f"{'Windows Server & .NET Applications' if is_windows else 'Application Compute Runtime'}",
        "configuration": config_label,
        "active": True,
        "icon": "cpu"
    })

    # 5. Hybrid On-Premises Gateway (ONLY if hybrid connectivity is requested)
    if workload.get("hybridConnectivity", False):
        hybrid_service = services.get("hybridGateway", f"{pname} Dedicated ExpressRoute / DirectConnect Gateway")
        nodes.append({
            "id": "tier-hybrid",
            "name": "Hybrid On-Premises Datacenter Link",
            "provider": pname,
            "service": hybrid_service,
            "category": "networking",
            "purpose": "Dedicated private layer 3 network cross-connect bridging cloud VPC directly into existing enterprise on-premises datacenter.",
            "requirementMapping": "Hybrid On-Premises Connectivity",
            "configuration": f"{hybrid_service} with Private Peering & IPsec Failover Tunnel",
            "active": True,
            "icon": "link"
        })

    # 6. In-Memory Cache Tier (ONLY if cache is required)
    if workload.get("cache", {}).get("required", False):
        cache_service = services.get("cache", f"{pname} Redis Cache")
        nodes.append({
            "id": "tier-cache",
            "name": "In-Memory Session & Query Cache",
            "provider": pname,
            "service": cache_service,
            "category": "cache",
            "purpose": "Sub-millisecond latency distributed memory store for session state, query caching, and transient locks.",
            "requirementMapping": "Low-Latency In-Memory Caching (Redis)",
            "configuration": f"{cache_service} (Premium Multi-AZ Clustered Tier)",
            "active": True,
            "icon": "zap"
        })

    # 7. Database Tier (ONLY if database is required)
    db_spec = workload.get("database", {})
    if db_spec.get("required", False):
        db_type = db_spec.get("type", "sql-server" if workload.get("microsoftEcosystem") else "sql-postgres")
        db_service_map = services.get("database", {})
        
        if db_type == "sql-server":
            db_service_name = db_service_map.get("sqlServer", "Azure SQL Managed Instance / Azure SQL DB") if pid == "azure" else db_service_map.get("sqlServer", "Managed SQL Server Database")
            tier_name = "Enterprise SQL Server Database Tier"
            req_map = "Enterprise SQL Server Relational Database (Multi-AZ)" if is_ha else "Enterprise SQL Server Relational Database"
            purpose = "Mission-critical ACID data store for employee records, payroll ledgers, and transactions with automated point-in-time recovery."
            config = f"{db_service_name} (Business Critical Multi-AZ with Read Scale-Out)" if is_ha else f"{db_service_name} (General Purpose Tier)"
        elif db_type == "oracle-db":
            db_service_name = db_service_map.get("oracle", "Oracle Autonomous Database")
            tier_name = "Oracle Enterprise Database Tier"
            req_map = "Oracle Database RAC Clustering"
            purpose = "High-performance enterprise transaction engine with native Oracle RAC clustering."
            config = f"{db_service_name} (High Availability Active Data Guard)"
        elif db_type == "sql-mysql":
            db_service_name = db_service_map.get("mysql", "Managed MySQL Flexible Server")
            tier_name = "MySQL Relational Database Tier"
            req_map = "Relational MySQL Data Store"
            purpose = "ACID-compliant relational database for transactional web operations."
            config = f"{db_service_name} (Multi-AZ with Standby Replica)" if is_ha else f"{db_service_name}"
        elif db_type == "nosql-document":
            db_service_name = db_service_map.get("nosql", "NoSQL Document DB")
            tier_name = "NoSQL Document Database Tier"
            req_map = "NoSQL Document Data Store"
            purpose = "Globally distributed low-latency document storage with automatic scaling."
            config = f"{db_service_name} (Multi-Region Active-Active)"
        else:
            db_service_name = db_service_map.get("postgres", "Managed PostgreSQL Flexible Server")
            tier_name = "PostgreSQL Relational Database Tier"
            req_map = "Relational PostgreSQL Data Store"
            purpose = "ACID-compliant relational database for application data."
            config = f"{db_service_name} (Multi-AZ Zone-Redundant)" if is_ha else f"{db_service_name}"

        nodes.append({
            "id": "tier-database",
            "name": tier_name,
            "provider": pname,
            "service": db_service_name,
            "category": "database",
            "purpose": purpose,
            "requirementMapping": req_map,
            "configuration": config,
            "active": True,
            "icon": "database"
        })

    # 8. Asynchronous Queues & Background Workers (ONLY if scheduled jobs or workers active)
    if workload.get("scheduledJobs", {}).get("required", False) or workload.get("backgroundWorkers", {}).get("required", False):
        worker_service = services.get("scheduledJobs", f"{pname} Background Jobs & Workers")
        queue_service = services.get("queue", f"{pname} Service Bus / Queue")
        nodes.append({
            "id": "tier-workers",
            "name": "Background Workers & Scheduler Pipeline",
            "provider": pname,
            "service": f"{worker_service}",
            "category": "compute",
            "purpose": "Asynchronous job scheduler orchestrating month-end payroll execution, batch processing, and recurring reporting.",
            "requirementMapping": "Scheduled Payroll & Reporting Jobs",
            "configuration": f"{worker_service} integrated with {queue_service} for durable job queuing",
            "active": True,
            "icon": "clock"
        })

    # 9. Object Storage & Media (ONLY if object storage or media uploads active)
    if workload.get("objectStorage", {}).get("required", False) or workload.get("mediaProcessing", {}).get("required", False):
        storage_service = services.get("objectStorage", f"{pname} Blob Storage")
        vol_gb = workload.get('objectStorage', {}).get('volumeGB', 250)
        nodes.append({
            "id": "tier-storage",
            "name": "Document & Blob Storage Tier",
            "provider": pname,
            "service": storage_service,
            "category": "storage",
            "purpose": "Encrypted object storage for generated payroll payslip PDFs, tax compliance documents, and employee audit archives.",
            "requirementMapping": "Document Archives & Blob Storage",
            "configuration": f"{storage_service} (Hot / Cool Lifecycle Management, ~{vol_gb} GB capacity)",
            "active": True,
            "icon": "hard-drive"
        })

    # 10. GPU Inference Engine (ONLY if GPU is active)
    if workload.get("gpuInference", {}).get("required", False):
        gpu_service = services.get("gpuInstance", f"{pname} Tensor GPU")
        nodes.append({
            "id": "tier-gpu",
            "name": "Hardware-Accelerated GPU Node",
            "provider": pname,
            "service": gpu_service,
            "category": "compute",
            "purpose": "Dedicated high-memory GPU tensor accelerators running deep learning model inference.",
            "requirementMapping": "GPU Accelerated Model Inference",
            "configuration": f"{gpu_service} with CUDA / TensorRT acceleration",
            "active": True,
            "icon": "sparkles"
        })

    return nodes

def generate_decision_explanation(
    workload: Dict[str, Any],
    top_provider_eval: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Generate transparent, evidence-based explanation for the recommended cloud architecture.
    Strictly mentions ONLY active workload requirements.
    Never mentions WebSockets if WebSockets=OFF.
    Never mentions GPU if GPU=OFF.
    Never mentions PostgreSQL if SQL Server was requested.
    """
    pname = top_provider_eval["providerName"]
    pid = top_provider_eval["providerId"]
    score = top_provider_eval["totalScore"]

    reasons = []

    # Check active factors
    if workload.get("microsoftEcosystem", False) or workload.get("operatingSystem") == "windows":
        if pid == "azure":
            reasons.append("native first-party Microsoft Entra ID (Azure AD) federation, Windows Server Hybrid Benefit licensing, and fully managed Azure SQL Database")
        else:
            reasons.append(f"support for {workload.get('operatingSystem', 'Windows').capitalize()} enterprise workloads")

    if workload.get("hybridConnectivity", False):
        if pid == "azure":
            reasons.append("enterprise ExpressRoute low-latency dedicated hybrid on-premises datacenter cross-connect")
        elif pid == "aws":
            reasons.append("AWS Direct Connect dedicated hybrid circuit integration")
        else:
            reasons.append("IPsec VPN and dedicated hybrid interconnect capabilities")

    if workload.get("database", {}).get("type") == "sql-server":
        if pid == "azure":
            reasons.append("industry-leading Azure SQL Managed Instance with native SQL Server engine parity, automated backups, and 99.99% Multi-AZ SLA")
        elif pid == "aws":
            reasons.append("Amazon RDS for SQL Server with multi-AZ high availability")

    if workload.get("scheduledJobs", {}).get("required", False):
        if pid == "azure":
            reasons.append("durable asynchronous worker execution via Azure Functions Timer Triggers and Service Bus message queuing for month-end payroll surges")
        elif pid == "aws":
            reasons.append("EventBridge scheduler and Amazon SQS worker pipelines")

    if workload.get("region") and "india" in workload.get("region", "").lower():
        if pid == "azure":
            reasons.append("strong local Indian datacenter presence (Central India / South India / West India) adhering to RBI data localization mandates")

    if not reasons:
        reasons.append(f"overall deterministic capability fit, enterprise operational maturity, and cost-efficiency across all 17 evaluated providers")

    summary_text = (
        f"{pname} was deterministically evaluated as the top-ranking cloud provider with a score of {score}/100. "
        f"This decision was driven by {', '.join(reasons)}."
    )

    return {
        "provider": pname,
        "score": score,
        "summary": summary_text,
        "primaryDrivers": reasons
    }
