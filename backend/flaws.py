"""
Cloud AI Architect V2 — Architecture Flaws, Billing Traps & Procurement Engine
Detects architectural anti-patterns, evaluates hidden cloud billing traps,
synthesizes architectural trade-offs, and provides procurement scenarios and cloud credit intelligence.
Strictly technology-aligned: never recommends PostgreSQL mitigations for SQL Server workloads.
"""

from typing import Dict, Any, List

def analyze_architecture_flaws(workload: Dict[str, Any], provider: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Identifies deterministic architectural risks and engineering bottlenecks based on workload parameters.
    Grounded strictly in the workload's actual technologies.
    """
    flaws = []
    pid = provider.get("id")
    dau = workload.get("dailyActiveUsers") or 5000
    traffic_surge = workload.get("trafficSurge") or 1
    ha = workload.get("highAvailability", False) or workload.get("database", {}).get("highAvailability", False)
    db = workload.get("database", {})
    db_type = db.get("type", "none")
    os_type = workload.get("operatingSystem", "linux")

    # Flaw 1: Burstable CPU Exhaustion under Surge
    if traffic_surge >= 3:
        flaws.append({
            "severity": "HIGH",
            "type": "Performance Bottleneck",
            "title": "Burstable CPU Credit Depletion Risk",
            "description": f"Under a {traffic_surge}× traffic surge during month-end payroll periods, burstable VM tiers (e.g. Azure B-series, AWS t4g/t3) will rapidly exhaust CPU credits, leading to severe CPU throttling down to 10–20% baseline performance.",
            "remediation": "Configure auto-scaling with dedicated general-purpose CPU instances (e.g. Azure D-series D4s_v5 or AWS m6i) with Virtual Machine Scale Sets and metric-based scaling rules."
        })

    # Flaw 2: Database Connection Pool Exhaustion (Strictly Technology Aligned)
    if dau >= 50000 and traffic_surge >= 2 and db.get("required"):
        if db_type == "sql-server":
            remediation = "Tune ADO.NET / SqlClient connection pooling limits (Max Pool Size=200) in backend application connection strings, leverage Azure SQL Database connection governance, and route heavy payroll reporting jobs to Read Scale-Out replicas."
            title = "SQL Server Connection Pool Saturation under Payroll Surge"
            desc = f"High concurrent volume ({dau:,} DAU with {traffic_surge}× payroll surge) can spawn hundreds of simultaneous SQL queries, exhausting worker threads and connection limits on the SQL Server instance."
        elif db_type in ["sql-postgres", "postgres"]:
            remediation = "Deploy PgBouncer or AWS RDS Proxy in front of the PostgreSQL cluster to pool and multiplex database connections efficiently."
            title = "PostgreSQL Connection Pool Saturation"
            desc = f"High concurrent volume ({dau:,} DAU with {traffic_surge}× surge) can exceed max_connections on PostgreSQL, causing connection drops."
        else:
            remediation = f"Implement application-level connection pooling and read replicas to prevent database connection limits from being exhausted during {traffic_surge}× traffic surges."
            title = "Database Connection Saturation"
            desc = f"Concurrent transaction spikes can exhaust maximum database connections on the cluster."

        flaws.append({
            "severity": "HIGH",
            "type": "Database Resiliency",
            "title": title,
            "description": desc,
            "remediation": remediation
        })

    # Flaw 3: Single Availability Zone Point of Failure
    if not ha and dau >= 20000:
        flaws.append({
            "severity": "CRITICAL",
            "type": "High Availability Risk",
            "title": "Single Availability Zone Single Point of Failure (SPOF)",
            "description": "The current workload lacks an explicit Multi-AZ configuration. An underlying datacenter hardware failure or zone-level network outage will result in total application downtime.",
            "remediation": "Enable multi-AZ deployment across at least 2 availability zones with an application load balancer and multi-AZ database read replicas."
        })

    # Flaw 4: Unmanaged Self-Hosted Database Risk
    if pid in ["hetzner", "proxmox", "openstack"] and db.get("required"):
        flaws.append({
            "severity": "MEDIUM",
            "type": "Operational Overhead",
            "title": "Self-Managed Database Operational Risk",
            "description": "Running databases directly on raw virtual instances lacks automated Point-In-Time Recovery (PITR), automated patch management, and automated failover orchestration.",
            "remediation": "Implement automated database backup automation to S3-compatible object storage with periodic restore drills and automated systemd health monitors."
        })

    # Flaw 5: Third-Party Windows Licensing Waste (ONLY when running Windows on non-Azure hyperscalers)
    if os_type == "windows" and pid in ["aws", "gcp"]:
        flaws.append({
            "severity": "MEDIUM",
            "type": "Licensing Inefficiency",
            "title": "Third-Party Windows Server & SQL Server License Markup",
            "description": f"Running Windows Server and SQL Server on {provider.get('name')} incurs third-party SPLA licensing fees without the Azure Hybrid Benefit discount.",
            "remediation": "Audit existing enterprise Microsoft Software Assurance (SA) agreements to verify BYOL (Bring Your Own License) eligibility to avoid double-paying for Windows and SQL Server licenses."
        })

    return flaws

def analyze_billing_traps(workload: Dict[str, Any], provider: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Identifies hidden cloud billing traps and surprise cost drivers.
    Only includes traps strictly relevant to the active workload architecture.
    """
    traps = []
    pid = provider.get("id")
    ha = workload.get("highAvailability", False) or workload.get("database", {}).get("highAvailability", False)
    is_hybrid = workload.get("hybridConnectivity", False)

    # Trap 1: Managed NAT Gateway Fixed Tax (Only if private subnets/networking used)
    if pid in ["aws", "azure", "gcp"] and (workload.get("operatingSystem") == "windows" or is_hybrid):
        traps.append({
            "name": "Managed NAT Gateway Fixed Tax",
            "category": "Networking",
            "monthlyCostEstimateUSD": 34.0,
            "annualRiskUSD": 816.0,
            "monthlyCostEstimate": "$32.85 – $35.00 / month per AZ",
            "annualRisk": "$390 – $1,260 / year",
            "trapMechanism": "Hyperscalers charge ~$0.045/hr per NAT Gateway simply for existing, even if 0 bytes of traffic traverse the private subnet, plus data processing fees.",
            "mitigation": "Use private service endpoints / VPC endpoints for cloud services so internal traffic avoids the NAT Gateway."
        })

    # Trap 2: Inter-AZ & Multi-AZ Cross-Zone Data Transfer Tax (Only if Multi-AZ is active)
    if pid in ["aws", "gcp", "azure"] and ha:
        traps.append({
            "name": "Inter-AZ & Multi-AZ Data Replication Tax",
            "category": "Data Transfer",
            "monthlyCostEstimateUSD": 45.0,
            "annualRiskUSD": 540.0,
            "monthlyCostEstimate": "$0.01 – $0.02 / GB each way",
            "annualRisk": "$300 – $1,200 / year",
            "trapMechanism": "Synchronous database replication across availability zones and cross-AZ application tier chatter incurs bidirectional network transfer charges.",
            "mitigation": "Keep application servers in the same availability zones as the primary database replicas and use Azure Private Link / AWS VPC Endpoints."
        })

    # Trap 3: 24/7 Idle Staging & Dev Environments (Universal DevOps Trap)
    traps.append({
        "name": "Zombie Non-Production Resources",
        "category": "Compute & Database",
        "monthlyCostEstimateUSD": 180.0,
        "annualRiskUSD": 2160.0,
        "monthlyCostEstimate": "35% – 50% of non-prod cloud invoice",
        "annualRisk": "$1,500 – $8,000+ / year",
        "trapMechanism": "Staging and pre-production Windows/SQL Server environments remain running 24/7 over nights and weekends, accumulating 70% idle charges.",
        "mitigation": "Implement automated startup/shutdown schedules (e.g. Azure Automation or Lambda cron) to stop non-prod VMs at 7 PM and start at 8 AM on weekdays."
    })

    # Trap 4: Broadcom VMware License Hike Trap (Only if hybrid on-prem is involved)
    if is_hybrid or pid in ["proxmox", "nutanix", "openstack"]:
        traps.append({
            "name": "Broadcom VMware 300%–500% License Hike",
            "category": "Virtualization Licensing",
            "monthlyCostEstimateUSD": 850.0,
            "annualRiskUSD": 10200.0,
            "monthlyCostEstimate": "$350 – $1,200 / CPU core / year",
            "annualRisk": "$15,000 – $150,000+ / datacenter",
            "trapMechanism": "Broadcom's transition from perpetual licenses to per-core subscription bundles has increased VMware renewal costs by 3× to 5× across enterprise datacenters.",
            "mitigation": "Migrate on-prem workloads to Azure/AWS IaaS via ExpressRoute, or transition local virtualization to Proxmox VE / Nutanix AHV."
        })

    return traps

def get_service_tradeoffs(workload: Dict[str, Any], recommended_provider: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Synthesizes architectural trade-offs tailored to the workload.
    Strictly aligns with the selected database and operating system.
    """
    rec_name = recommended_provider.get("name", "Recommended Provider")
    pid = recommended_provider.get("id", "azure")
    dau = workload.get("dailyActiveUsers") or 5000
    is_windows = workload.get("operatingSystem") == "windows"
    db_type = workload.get("database", {}).get("type", "none")

    if db_type == "sql-server":
        db_paas = "Azure SQL Managed Instance / Azure SQL DB" if pid == "azure" else "Managed SQL Server PaaS (RDS)"
        db_iaas = "Self-Managed SQL Server on Windows VM"
        db_selected = db_paas
        db_reason = f"At {dau:,} DAU, managed {db_paas} provides automated Multi-AZ failover, automated point-in-time recovery (PITR), and Azure Hybrid Benefit licensing, saving 20+ DBA operational hours/month over self-managing SQL Server on VMs."
    elif db_type == "oracle-db":
        db_paas = "Oracle Autonomous Database"
        db_iaas = "Self-Managed Oracle on Compute VM"
        db_selected = db_paas
        db_reason = "Autonomous Database offloads tuning, patching, and RAC clustering while eliminating third-party Oracle licensing markups."
    else:
        db_paas = "Managed Relational Database PaaS"
        db_iaas = "Self-Managed Database on VM"
        db_selected = db_paas
        db_reason = f"At {dau:,} DAU, managed PaaS offloads automated Multi-AZ failovers, OS patching, and automated transaction log backups."

    return [
        {
            "dimension": "Database Architecture",
            "optionA": f"Managed Cloud PaaS ({db_paas})",
            "optionB": f"Self-Managed VM ({db_iaas})",
            "selected": db_selected,
            "tradeoffReason": db_reason
        },
        {
            "dimension": "Compute Hosting Model",
            "optionA": "Serverless / Container Apps (Azure Container Apps, Cloud Run)",
            "optionB": "Dedicated Provisioned Virtual Machines (VMs)",
            "selected": "Dedicated Provisioned VMs" if is_windows else "Container PaaS / Autoscaling VMs",
            "tradeoffReason": "Windows Server enterprise applications require persistent runtime state and Active Directory domain join, favoring dedicated provisioned compute with VM Scale Sets over ephemeral stateless containers." if is_windows else "Autoscaling container compute provides sub-second elasticity for fluctuating traffic spikes with zero idle cost during off-peak hours."
        },
        {
            "dimension": "High Availability Strategy",
            "optionA": "Multi-Availability Zone Active-Passive",
            "optionB": "Single-Zone with Automated Daily Snapshots",
            "selected": "Multi-Availability Zone Active-Passive",
            "tradeoffReason": "Multi-AZ guarantees a 99.99% SLA and automatic failover in under 60 seconds without data loss, which is essential for enterprise business continuity."
        },
        {
            "dimension": "Provider Ecosystem Choice",
            "optionA": f"{rec_name} (Optimized Winner)",
            "optionB": "Multi-Cloud / Alternative Cloud Split",
            "selected": rec_name,
            "tradeoffReason": f"Consolidating on {rec_name} maximizes native Microsoft Entra ID / M365 integration, eliminates cross-cloud egress bandwidth fees, and leverages enterprise volume discounting."
        }
    ]

# 6 Canonical Procurement Scenarios (A - F) with numeric USD thresholds for dynamic currency conversion
PROCUREMENT_SCENARIOS: List[Dict[str, Any]] = [
    {
        "id": "scenario-a",
        "code": "Scenario A",
        "title": "Early-Stage Bootstrapped MVP",
        "idealFor": "Startups, indie hackers, pre-revenue prototypes",
        "recommendedCloud": "Hetzner Cloud / Render / DigitalOcean",
        "minBudgetUSD": 10.0,
        "maxBudgetUSD": 100.0,
        "monthlyBudgetRangeUSD": "$10 – $100 / month",
        "monthlyBudgetRangeINR": "₹850 – ₹8,500 / month",
        "strategy": "Maximize runway, leverage generous free tiers, and avoid hyperscaler managed services taxes.",
        "keyDecisions": [
            "Use Hetzner €4/mo NVMe instances or DigitalOcean $6 Droplets",
            "Deploy SQLite or single-node Dockerized PostgreSQL instead of $50/mo managed databases",
            "Place behind free Cloudflare CDN for edge caching and DDoS shield",
            "Zero NAT gateway or enterprise IAM overhead"
        ],
        "exitMilestone": "Upgrade when monthly revenue exceeds $5,000 or DAU passes 10,000."
    },
    {
        "id": "scenario-b",
        "code": "Scenario B",
        "title": "High-Growth VC-Backed Scaleup",
        "idealFor": "Series A/B SaaS, rapid customer growth, sudden traffic spikes",
        "recommendedCloud": "Amazon Web Services (AWS) or Google Cloud (GCP)",
        "minBudgetUSD": 1000.0,
        "maxBudgetUSD": 15000.0,
        "monthlyBudgetRangeUSD": "$1,000 – $15,000 / month",
        "monthlyBudgetRangeINR": "₹85,000 – ₹12,50,000 / month",
        "strategy": "Maximize developer velocity, utilize $100k startup cloud credits, and deploy managed autoscaling.",
        "keyDecisions": [
            "AWS EKS with Karpenter auto-scaling or GCP GKE Autopilot",
            "Managed multi-AZ Aurora Serverless or Cloud SQL PostgreSQL",
            "Apply for AWS Activate / Google for Startups $100,000 credits",
            "Automate all deployments via Terraform and GitHub Actions CI/CD"
        ],
        "exitMilestone": "Begin reserved instance / savings plan commitments once workload reaches predictable baseline."
    },
    {
        "id": "scenario-c",
        "code": "Scenario C",
        "title": "Regulated Enterprise & Microsoft Core",
        "idealFor": "Banking, healthcare, HR, ERP, compliance-heavy corporate environments",
        "recommendedCloud": "Microsoft Azure",
        "minBudgetUSD": 5000.0,
        "maxBudgetUSD": 100000.0,
        "monthlyBudgetRangeUSD": "$5,000 – $100,000+ / month",
        "monthlyBudgetRangeINR": "₹4,25,000 – ₹85,00,000+ / month",
        "strategy": "Seamless integration with Microsoft 365, Entra ID (Azure AD), ExpressRoute hybrid on-prem, and enterprise compliance.",
        "keyDecisions": [
            "Leverage Azure Hybrid Benefit for existing Windows Server and SQL Server licenses",
            "Deploy dedicated ExpressRoute circuit to connect on-premises datacenters",
            "Enforce Conditional Access and Privileged Identity Management (PIM) via Entra ID",
            "Maintain SOC 2, HIPAA, and ISO 27001 regulatory compliance certifications"
        ],
        "exitMilestone": "Quarterly enterprise agreement (EA) true-up reviews."
    },
    {
        "id": "scenario-d",
        "code": "Scenario D",
        "title": "European Sovereign Cloud & Privacy",
        "idealFor": "EU public sector, healthcare, GDPR-strict enterprise data",
        "recommendedCloud": "Hetzner Cloud / OVHcloud / Scaleway",
        "minBudgetUSD": 50.0,
        "maxBudgetUSD": 3000.0,
        "monthlyBudgetRangeUSD": "$50 – $3,000 / month",
        "monthlyBudgetRangeINR": "₹4,200 – ₹2,55,000 / month",
        "strategy": "100% European jurisdiction, zero US CLOUD Act data seizure exposure, and exceptional price-to-performance.",
        "keyDecisions": [
            "Host entirely in Frankfurt (Germany), Paris (France), or Helsinki (Finland)",
            "Strict GDPR Article 28 Data Processing Agreements (DPA) included natively",
            "Unmetered high-speed European transit with zero surprise egress markups",
            "K3s lightweight Kubernetes on bare-metal and cloud NVMe instances"
        ],
        "exitMilestone": "Scale across multiple EU availability zones for geographical disaster recovery."
    },
    {
        "id": "scenario-e",
        "code": "Scenario E",
        "title": "AI/ML Model Inference & Heavy Compute",
        "idealFor": "LLM fine-tuning, computer vision, high-concurrency generative AI pipelines",
        "recommendedCloud": "Oracle Cloud (OCI) / GCP / RunPod",
        "minBudgetUSD": 2000.0,
        "maxBudgetUSD": 50000.0,
        "monthlyBudgetRangeUSD": "$2,000 – $50,000 / month",
        "monthlyBudgetRangeINR": "₹1,70,000 – ₹42,50,000 / month",
        "strategy": "Procure cost-effective NVIDIA H100/A100/L4 GPU clusters with ultra-low RDMA network latency.",
        "keyDecisions": [
            "OCI bare-metal GPU shapes with 3.2 Tbps cluster networking at lowest per-hour GPU cost",
            "GCP Vertex AI / Cloud Run with GPU acceleration for pay-per-second serverless inference",
            "10 TB free monthly egress bandwidth on OCI prevents multi-thousand-dollar model download egress bills",
            "Triton Inference Server with vLLM for optimized token throughput"
        ],
        "exitMilestone": "Reserve 1-year GPU capacity commitments to secure 40%+ cost discounts."
    },
    {
        "id": "scenario-f",
        "code": "Scenario F",
        "title": "VMware Exit & On-Premises Modernization",
        "idealFor": "Private datacenter operators, enterprise virtualization, Broadcom price escapees",
        "recommendedCloud": "Proxmox VE / Nutanix Enterprise Cloud / Hybrid",
        "minBudgetUSD": 0.0,
        "maxBudgetUSD": 500.0,
        "monthlyBudgetRangeUSD": "$0 license fee (Proxmox) or Hardware OpEx",
        "monthlyBudgetRangeINR": "₹0 software license fee",
        "strategy": "Migrate virtualized server estates away from Broadcom/VMware ESXi to open-source KVM hypervisors or HCI.",
        "keyDecisions": [
            "Proxmox VE cluster with Ceph distributed storage and integrated Proxmox Backup Server (PBS)",
            "Live VM migration with zero licensing cost per CPU core",
            "Hybrid connectivity to public cloud via WireGuard / IPsec VPN tunnels for cloud bursting",
            "Reclaims 70%+ of ongoing hypervisor operational licensing expenditure"
        ],
        "exitMilestone": "Complete hypervisor migration wave within 6 months ahead of VMware contract renewal."
    }
]

# Cloud Credits & Startup Programs Directory for all 17 providers
CLOUD_CREDITS_DIRECTORY: List[Dict[str, Any]] = [
    {
        "providerId": "azure",
        "providerName": "Microsoft Azure",
        "programName": "Microsoft for Startups Founders Hub",
        "maxCreditsUSD": 150000,
        "trialAllowance": "$200 trial credit (30 days) + 12 months free services (750h B1s compute, 64GB SSD, 5GB Blob Storage)",
        "creditCardReq": "Yes",
        "requirements": "Available to startups building software; no funding required for initial $1,000–$5,000 tier; scaling to $150k with verified VC/accelerator affiliation.",
        "specialPerks": "Free GitHub Enterprise seats, Microsoft 365 Business Standard, and up to $2,500 OpenAI credits."
    },
    {
        "providerId": "aws",
        "providerName": "Amazon Web Services (AWS)",
        "programName": "AWS Activate Founders & Portfolio",
        "maxCreditsUSD": 100000,
        "trialAllowance": "Free Tier for 12 months (750h t2.micro/t3.micro, 5GB S3, 750h RDS db.t3.micro, 1M Lambda requests)",
        "creditCardReq": "Yes",
        "requirements": "Founders tier ($1,000) for bootstrapped startups; Portfolio tier ($10,000–$100,000) for startups associated with approved venture funds/accelerators.",
        "specialPerks": "AWS Business Support credits and architectural reviews with AWS Solutions Architects."
    },
    {
        "providerId": "gcp",
        "providerName": "Google Cloud Platform (GCP)",
        "programName": "Google for Startups Cloud Program",
        "maxCreditsUSD": 200000,
        "trialAllowance": "$300 credit for 90 days + Always Free Tier (e2-micro instance, Cloud Run 2M requests, Cloud Functions 2M)",
        "creditCardReq": "Yes",
        "requirements": "Startups founded within 5 years; up to $2,000 for bootstrapped; up to $200,000 over 2 years for funded startups (Seed to Series A).",
        "specialPerks": "Google Workspace credits, Vertex AI credits, and direct Google Cloud engineering mentorship."
    },
    {
        "providerId": "oci",
        "providerName": "Oracle Cloud Infrastructure (OCI)",
        "programName": "Oracle for Startups & Always Free",
        "maxCreditsUSD": 10000,
        "trialAllowance": "$300 trial credit (30 days) + Always Free Tier (4 Arm Ampere cores, 24GB RAM, 2 Autonomous DBs, 200GB block, 10TB egress)",
        "creditCardReq": "Yes",
        "requirements": "Always Free tier available to everyone indefinitely; Oracle for Startups provides 70% cloud discounts for 2 years plus migration credits.",
        "specialPerks": "10 TB free monthly egress bandwidth worldwide and free Autonomous Database instances."
    },
    {
        "providerId": "digitalocean",
        "providerName": "DigitalOcean",
        "programName": "DigitalOcean Hatch Program",
        "maxCreditsUSD": 10000,
        "trialAllowance": "$200 credit for 60 days for new signups",
        "creditCardReq": "Yes",
        "requirements": "Hatch provides 12 months of cloud infrastructure credits ($1,000–$10,000) for startups in approved partner accelerators and incubators.",
        "specialPerks": "Free technical training, priority support, and developer community marketing amplification."
    },
    {
        "providerId": "hetzner",
        "providerName": "Hetzner Cloud",
        "programName": "Hetzner Developer & Education Credits",
        "maxCreditsUSD": 500,
        "trialAllowance": "€20 new user signup promo credits with partner codes; unmetered 20 TB monthly traffic included per server",
        "creditCardReq": "Yes (or PayPal)",
        "requirements": "Developer grants available for notable open-source projects and educational initiatives upon application.",
        "specialPerks": "Lowest compute pricing in Europe (€3.79/mo for 2 vCPU, 4GB RAM) with zero vendor lock-in."
    },
    {
        "providerId": "linode",
        "providerName": "Linode (Akamai Connected Cloud)",
        "programName": "Linode Startup & Developer Program",
        "maxCreditsUSD": 5000,
        "trialAllowance": "$100 credit for 60 days for new accounts",
        "creditCardReq": "Yes",
        "requirements": "Akamai Startup Program provides credits, enterprise DDoS mitigation, and global edge distribution for early-stage builders.",
        "specialPerks": "Native integration with Akamai global content delivery network and edge computing."
    },
    {
        "providerId": "vultr",
        "providerName": "Vultr",
        "programName": "Vultr Cloud Innovators Program",
        "maxCreditsUSD": 25000,
        "trialAllowance": "$100–$250 trial credit (30 days) on signups with partner promo codes",
        "creditCardReq": "Yes",
        "requirements": "Targeted at AI startups, web3, and SaaS founders building high-scale compute infrastructure across 32+ global regions.",
        "specialPerks": "Extensive fractional NVIDIA GPU availability (A100, L40S, GH200) with global BGP peering."
    },
    {
        "providerId": "ovhcloud",
        "providerName": "OVHcloud",
        "programName": "OVHcloud Startup Program",
        "maxCreditsUSD": 100000,
        "trialAllowance": "€200 public cloud trial voucher",
        "creditCardReq": "Yes",
        "requirements": "Fast-Track tier (€10,000 credits) and Scale tier (up to €100,000 credits) for European startups prioritizing data sovereignty.",
        "specialPerks": "100% GDPR European data sovereignty with zero US CLOUD Act jurisdiction."
    },
    {
        "providerId": "alibaba",
        "providerName": "Alibaba Cloud",
        "programName": "Alibaba Cloud Startup Accelerator",
        "maxCreditsUSD": 50000,
        "trialAllowance": "$300–$1,200 Free Trial credit packages for enterprise and developer accounts",
        "creditCardReq": "Yes",
        "requirements": "Open to startups looking to expand in Asian, Chinese, and Middle Eastern markets with local entity support.",
        "specialPerks": "Unrivaled connectivity in Mainland China (ICP license support) and Southeast Asia."
    },
    {
        "providerId": "scaleway",
        "providerName": "Scaleway",
        "programName": "Scaleway Startup Programs (Early & Growth Stage)",
        "maxCreditsUSD": 36000,
        "trialAllowance": "Free tier for Stardust instances and 75GB Object Storage free every month",
        "creditCardReq": "Yes",
        "requirements": "Early Stage provides €3,600 in credits for 6 months; Growth Stage provides up to €36,000 for venture-backed teams.",
        "specialPerks": "Paris and Amsterdam green datacenters (zero air conditioning, 100% renewable energy)."
    },
    {
        "providerId": "render",
        "providerName": "Render",
        "programName": "Render for Startups",
        "maxCreditsUSD": 5000,
        "trialAllowance": "Generous free tier: Free Static Sites, Free Web Services (750 hrs/mo), and Free PostgreSQL for 90 days",
        "creditCardReq": "No (for free tier)",
        "requirements": "Startup accelerator affiliation (Y Combinator, Techstars, etc.) provides $1,000–$5,000 in hosting credits.",
        "specialPerks": "Zero-DevOps automated Git push deployments with native SSL and previews."
    },
    {
        "providerId": "flyio",
        "providerName": "Fly.io",
        "programName": "Fly.io Developer Allowance",
        "maxCreditsUSD": 1000,
        "trialAllowance": "Free allowance: Up to 3 shared-cpu-1x 256MB VMs, 3GB persistent volume storage, 160GB outbound data",
        "creditCardReq": "Yes (pre-authorization)",
        "requirements": "Developer grants available for innovative edge applications and distributed systems.",
        "specialPerks": "Run Docker containers physically close to users across 30+ global edge locations."
    },
    {
        "providerId": "railway",
        "providerName": "Railway",
        "programName": "Railway for Startups & Builders",
        "maxCreditsUSD": 2500,
        "trialAllowance": "$5 monthly free usage credit on Hobby tier with zero setup fee",
        "creditCardReq": "No (for free trial)",
        "requirements": "Startup program provides credits for venture-backed and incubator teams.",
        "specialPerks": "One-click templates for 100+ open-source stacks with instant infrastructure provisioning."
    },
    {
        "providerId": "proxmox",
        "providerName": "Proxmox VE",
        "programName": "Open Source Community (100% Free AGPLv3)",
        "maxCreditsUSD": 0,
        "trialAllowance": "Fully featured, unlimited cores and VMs, completely free forever with no license key required",
        "creditCardReq": "No",
        "requirements": "None. Free community repositories available; optional paid enterprise support subscriptions available per CPU socket.",
        "specialPerks": "Zero vendor lock-in, native KVM/LXC virtualization, Ceph clustering, and automated Proxmox Backup Server integration."
    },
    {
        "providerId": "openstack",
        "providerName": "OpenStack",
        "programName": "OpenInfra Foundation Open Source",
        "maxCreditsUSD": 0,
        "trialAllowance": "100% Open Source (Apache 2.0 license) with zero software licensing costs",
        "creditCardReq": "No",
        "requirements": "Requires bare-metal hardware and infrastructure engineering expertise to deploy and operate.",
        "specialPerks": "Complete private cloud ownership with standard AWS-compatible APIs and sovereign datacenter control."
    },
    {
        "providerId": "nutanix",
        "providerName": "Nutanix Enterprise Cloud",
        "programName": "Nutanix Community Edition & Test Drive",
        "maxCreditsUSD": 5000,
        "trialAllowance": "Free Nutanix Community Edition (CE) for lab testing; free online Guided Test Drive in cloud",
        "creditCardReq": "No",
        "requirements": "Enterprise POC trials with Nutanix sales engineers for datacenter modernization and VMware replacement.",
        "specialPerks": "Turnkey Hyperconverged Infrastructure (HCI) with AHV hypervisor and single-pane management."
    }
]
