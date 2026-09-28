/**
 * Cloud AI Architect V2 — Standalone Deterministic Client-Side Evaluation Engine
 * Complete mirroring of the Python evaluation pipeline for 100% uptime on Netlify,
 * Vercel, static previews, and offline scenarios.
 */

const CLIENT_CLOUD_PROVIDERS = [
  {
    "id": "azure",
    "name": "Microsoft Azure",
    "shortName": "Azure",
    "category": "Big 3 Hyperscaler",
    "badge": "Enterprise Core & Hybrid Champion",
    "country": "Global (60+ Regions, 300+ Datacenters)",
    "starterSpec": "B1s Burstable (1 vCPU, 1 GB RAM, 32 GB Premium SSD)",
    "tagline": "The premier enterprise cloud for Windows Server, SQL Server, Microsoft Entra ID (Azure AD), and M365.",
    "description": "Azure provides unmatched first-party integration for Windows, SQL Server, Microsoft Entra ID, and hybrid on-premises networking via ExpressRoute.",
    "costMonthlyUSD": 52.0,
    "cost24HrUSD": 1.75,
    "freeAllowance": "$200 trial credits (30 days) + 12 Months Free Services (750 hrs B1s, 64GB SSD, 5GB Blob Storage)",
    "creditCardReq": "Yes",
    "bandwidthIncluded": "100 GB Free Egress worldwide ($0.087/GB thereafter)",
    "capabilities": {
      "windowsWorkloads": 98,
      "sqlServerSupport": 100,
      "entraIdIntegration": 100,
      "microsoftEcosystem": 100,
      "hybridConnectivity": 96,
      "kubernetes": 90,
      "serverlessContainers": 88,
      "gpuInference": 92,
      "websocketsRealtime": 92,
      "mediaProcessing": 85,
      "relationalPostgres": 90,
      "relationalMySQL": 88,
      "oracleDatabase": 72,
      "cachingRedis": 92,
      "scheduledJobsQueues": 94,
      "developerSimplicity": 62,
      "costEfficiencyPerDollar": 68,
      "complianceCoverage": [
        "hipaa",
        "soc2",
        "pci-dss",
        "gdpr",
        "rbi-india",
        "fedramp"
      ],
      "regions": [
        "india",
        "us-east",
        "us-west",
        "europe",
        "apac",
        "latam"
      ]
    },
    "services": {
      "dns": "Azure DNS & Traffic Manager",
      "loadBalancer": "Azure Application Gateway (WAF v2)",
      "compute": "Azure Virtual Machines & Container Apps",
      "containerOrchestrator": "Azure Kubernetes Service (AKS)",
      "serverless": "Azure Functions (v4 Isolated)",
      "database": {
        "sqlServer": "Azure SQL Managed Instance / Azure SQL DB",
        "postgres": "Azure Database for PostgreSQL Flexible Server",
        "mysql": "Azure Database for MySQL Flexible Server",
        "oracle": "Azure VM with Oracle Linux / Azure OCI Interconnect",
        "nosql": "Azure Cosmos DB"
      },
      "cache": "Azure Cache for Redis (Enterprise Tier)",
      "objectStorage": "Azure Blob Storage (Hot / Cool GRS)",
      "queue": "Azure Service Bus & Event Grid",
      "scheduledJobs": "Azure Functions Timer Trigger / Logic Apps",
      "gpuInstance": "Azure NCasT4_v3 / NDv4 A100 Tensor Core",
      "hybridGateway": "Azure ExpressRoute Gateway & VPN Gateway",
      "identity": "Microsoft Entra ID (Azure Active Directory)",
      "monitoring": "Azure Monitor & Application Insights",
      "cdn": "Azure Front Door",
      "security": "Microsoft Defender for Cloud & Key Vault"
    },
    "pricing": {
      "computePerHourVCPU": 0.0416,
      "ramPerHourGB": 0.0056,
      "dbBaseMonthly": 32.0,
      "sqlServerLicenseMultiplier": 1.45,
      "objectStoragePerGBMonth": 0.018,
      "egressPerGB": 0.087,
      "cacheBaseMonthly": 28.0,
      "gpuHourlyRate": 1.25,
      "hybridGatewayMonthly": 75.0
    },
    "pros": [
      "Flawless Active Directory, Entra ID, and Windows Server licensing advantages via Azure Hybrid Benefit",
      "ExpressRoute private 100Gbps cross-connect for seamless corporate datacenter federation",
      "Mature enterprise governance, compliance (RBI India, HIPAA, FedRAMP), and SLAs"
    ],
    "cons": [
      "Heavy portal interface with complex nested blade navigation",
      "B-series burst credit depletion under sustained loads throttles CPU"
    ],
    "bestFor": "Enterprises built on .NET, Windows Server, SQL Server, Active Directory, Office 365, and hybrid on-prem datacenters"
  },
  {
    "id": "aws",
    "name": "Amazon Web Services (AWS)",
    "shortName": "AWS",
    "category": "Big 3 Hyperscaler",
    "badge": "Hyperscale Pioneer & Deep Ecosystem",
    "country": "Global (34 Regions, 105+ AZs)",
    "starterSpec": "t4g.small (2 vCPU, 2 GB ARM) or t3.small, 20 GB EBS",
    "tagline": "The broadest and most adopted cloud with deep operational reliability and 300+ managed services.",
    "description": "AWS delivers the deepest set of infrastructure and application services, unmatched regional coverage, and battle-tested global scale for enterprise and consumer SaaS.",
    "costMonthlyUSD": 78.0,
    "cost24HrUSD": 2.6,
    "freeAllowance": "12 Months Free Tier (750 hrs t2/t3.micro, 5GB S3, 1M Lambda invocations)",
    "creditCardReq": "Yes",
    "bandwidthIncluded": "100 GB Free Egress (Then $0.09/GB egress fees)",
    "capabilities": {
      "windowsWorkloads": 78,
      "sqlServerSupport": 82,
      "entraIdIntegration": 35,
      "microsoftEcosystem": 40,
      "hybridConnectivity": 94,
      "kubernetes": 94,
      "serverlessContainers": 94,
      "gpuInference": 95,
      "websocketsRealtime": 95,
      "mediaProcessing": 96,
      "relationalPostgres": 96,
      "relationalMySQL": 95,
      "oracleDatabase": 80,
      "cachingRedis": 95,
      "scheduledJobsQueues": 98,
      "developerSimplicity": 60,
      "costEfficiencyPerDollar": 65,
      "complianceCoverage": [
        "hipaa",
        "soc2",
        "pci-dss",
        "gdpr",
        "rbi-india",
        "fedramp"
      ],
      "regions": [
        "india",
        "us-east",
        "us-west",
        "europe",
        "apac",
        "latam"
      ]
    },
    "services": {
      "dns": "Amazon Route 53 (Latency & Geo Routing)",
      "loadBalancer": "AWS Application Load Balancer (ALB)",
      "compute": "Amazon EC2 (c6g/c7g) & AWS ECS Fargate",
      "containerOrchestrator": "Amazon Elastic Kubernetes Service (EKS)",
      "serverless": "AWS Lambda (arm64 Graviton)",
      "database": {
        "sqlServer": "Amazon RDS for SQL Server (Multi-AZ)",
        "postgres": "Amazon Aurora Serverless v2 (PostgreSQL)",
        "mysql": "Amazon Aurora MySQL",
        "oracle": "Amazon RDS for Oracle",
        "nosql": "Amazon DynamoDB"
      },
      "cache": "Amazon ElastiCache for Redis (Cluster Mode)",
      "objectStorage": "Amazon S3 Standard (Intelligent-Tiering)",
      "queue": "Amazon SQS & Amazon EventBridge",
      "scheduledJobs": "Amazon EventBridge Scheduler + ECS/Lambda",
      "gpuInstance": "Amazon EC2 G5 (NVIDIA A10G) / P4de (A100)",
      "hybridGateway": "AWS Direct Connect & AWS Transit Gateway",
      "identity": "AWS IAM Identity Center / Amazon Cognito",
      "monitoring": "Amazon CloudWatch & AWS X-Ray",
      "cdn": "Amazon CloudFront",
      "security": "AWS Shield, WAF & AWS KMS"
    },
    "pricing": {
      "computePerHourVCPU": 0.0405,
      "ramPerHourGB": 0.0054,
      "dbBaseMonthly": 35.0,
      "sqlServerLicenseMultiplier": 2.2,
      "objectStoragePerGBMonth": 0.023,
      "egressPerGB": 0.09,
      "cacheBaseMonthly": 30.0,
      "gpuHourlyRate": 1.3,
      "hybridGatewayMonthly": 85.0
    },
    "pros": [
      "Broadest ecosystem of managed services, serverless tools, and third-party integrations",
      "Aurora Serverless v2 delivers instant autoscaling for relational databases",
      "Proven hyperscale reliability and global availability zones"
    ],
    "cons": [
      "Aggressive $0.09/GB egress fees and idle NAT Gateway tax ($33/mo per AZ)",
      "Significantly higher licensing costs for Windows/SQL Server than Azure"
    ],
    "bestFor": "Enterprise corporations, massive scale systems, government agencies, global SaaS"
  },
  {
    "id": "gcp",
    "name": "Google Cloud Platform (GCP)",
    "shortName": "Google Cloud",
    "category": "Big 3 Hyperscaler",
    "badge": "AI/ML & Kubernetes Pioneer",
    "country": "Global (40 Regions, 121+ AZs)",
    "starterSpec": "e2-micro (2 vCPU, 1 GB) or Cloud Run Serverless Containers",
    "tagline": "The cloud of choice for Kubernetes-native architectures, container serverless, BigQuery, and generative AI.",
    "description": "Google Cloud excels at containerized workloads with Google Kubernetes Engine (GKE) and Cloud Run, alongside state-of-the-art AI infrastructure and BigQuery analytics.",
    "costMonthlyUSD": 38.0,
    "cost24HrUSD": 1.25,
    "freeAllowance": "$300 free trial credits (90 days) + Perpetual Free Tier (e2-micro VM, 2M Cloud Run requests, 5GB GCS)",
    "creditCardReq": "Yes",
    "bandwidthIncluded": "1 GB to 10 GB Free depending on region ($0.08 - $0.12/GB overage)",
    "capabilities": {
      "windowsWorkloads": 65,
      "sqlServerSupport": 70,
      "entraIdIntegration": 30,
      "microsoftEcosystem": 32,
      "hybridConnectivity": 86,
      "kubernetes": 99,
      "serverlessContainers": 98,
      "gpuInference": 98,
      "websocketsRealtime": 88,
      "mediaProcessing": 90,
      "relationalPostgres": 94,
      "relationalMySQL": 90,
      "oracleDatabase": 60,
      "cachingRedis": 90,
      "scheduledJobsQueues": 92,
      "developerSimplicity": 74,
      "costEfficiencyPerDollar": 72,
      "complianceCoverage": [
        "hipaa",
        "soc2",
        "pci-dss",
        "gdpr",
        "rbi-india",
        "fedramp"
      ],
      "regions": [
        "india",
        "us-east",
        "us-west",
        "europe",
        "apac",
        "latam"
      ]
    },
    "services": {
      "dns": "Google Cloud DNS",
      "loadBalancer": "Cloud Load Balancing (Global Anycast)",
      "compute": "Google Cloud Run & Compute Engine",
      "containerOrchestrator": "Google Kubernetes Engine (GKE Autopilot)",
      "serverless": "Cloud Run Functions (2nd Gen)",
      "database": {
        "sqlServer": "Cloud SQL for SQL Server",
        "postgres": "Cloud SQL for PostgreSQL / AlloyDB",
        "mysql": "Cloud SQL for MySQL",
        "oracle": "Bare Metal Solution for Oracle",
        "nosql": "Cloud Firestore / Bigtable"
      },
      "cache": "Memorystore for Redis",
      "objectStorage": "Google Cloud Storage (Standard)",
      "queue": "Cloud Pub/Sub & Cloud Tasks",
      "scheduledJobs": "Cloud Scheduler + Cloud Run Jobs",
      "gpuInstance": "Compute Engine G2 (NVIDIA L4) / A2 (A100)",
      "hybridGateway": "Dedicated Interconnect & Cloud VPN",
      "identity": "Google Cloud Identity / Identity Platform",
      "monitoring": "Google Cloud Operations (formerly Stackdriver)",
      "cdn": "Cloud CDN & Media CDN",
      "security": "Cloud Armor & Secret Manager"
    },
    "pricing": {
      "computePerHourVCPU": 0.038,
      "ramPerHourGB": 0.0051,
      "dbBaseMonthly": 28.0,
      "sqlServerLicenseMultiplier": 2.15,
      "objectStoragePerGBMonth": 0.02,
      "egressPerGB": 0.085,
      "cacheBaseMonthly": 25.0,
      "gpuHourlyRate": 1.15,
      "hybridGatewayMonthly": 70.0
    },
    "pros": [
      "Best-in-class Kubernetes engine (GKE Autopilot) and container serverless (Cloud Run)",
      "Google Global Anycast networking provides sub-20ms edge routing worldwide",
      "Unrivaled data analytics with BigQuery and native Vertex AI model hosting"
    ],
    "cons": [
      "Weaker native integration for legacy Microsoft enterprise tooling",
      "High egress bandwidth charges outside the small 1GB free tier"
    ],
    "bestFor": "Containerized microservices, AI/ML inference workloads, scale-to-zero web apps, Kubernetes clusters"
  },
  {
    "id": "hetzner",
    "name": "Hetzner Cloud",
    "shortName": "Hetzner",
    "category": "Alternative IaaS",
    "badge": "Extreme Price-to-Performance",
    "country": "Germany / Finland / US / Singapore",
    "starterSpec": "CX22 (2 vCPUs, 4 GB RAM, 40 GB NVMe, 20 TB Transfer)",
    "tagline": "Unbeatable European compute value, dedicated NVMe servers, and massive 20TB included traffic per host.",
    "description": "Hetzner Cloud delivers the highest raw compute, RAM, and NVMe disk performance per dollar on the market, ideal for cost-conscious, bootstrapped, or European-headquartered systems.",
    "costMonthlyUSD": 4.1,
    "cost24HrUSD": 0.15,
    "freeAllowance": "Permanently 70-85% cheaper baseline; occasional \u20ac20 community vouchers",
    "creditCardReq": "Yes (Strict Passport/ID KYC)",
    "bandwidthIncluded": "20 TB Free per server (\u20ac1.00/TB overage \u2014 lowest in industry)",
    "capabilities": {
      "windowsWorkloads": 30,
      "sqlServerSupport": 22,
      "entraIdIntegration": 10,
      "microsoftEcosystem": 12,
      "hybridConnectivity": 35,
      "kubernetes": 78,
      "serverlessContainers": 65,
      "gpuInference": 40,
      "websocketsRealtime": 84,
      "mediaProcessing": 82,
      "relationalPostgres": 80,
      "relationalMySQL": 78,
      "oracleDatabase": 10,
      "cachingRedis": 80,
      "scheduledJobsQueues": 76,
      "developerSimplicity": 90,
      "costEfficiencyPerDollar": 99,
      "complianceCoverage": [
        "gdpr"
      ],
      "regions": [
        "europe",
        "us-east"
      ]
    },
    "services": {
      "dns": "Hetzner DNS Console",
      "loadBalancer": "Hetzner Load Balancer (LB11 / LB21)",
      "compute": "Hetzner Cloud Servers (CPX / CCX Dedicated)",
      "containerOrchestrator": "k3s / kubeadm on Hetzner Cloud (with hcloud-csi)",
      "serverless": "Self-hosted OpenFaaS / Knative",
      "database": {
        "sqlServer": "Self-managed SQL Server on Windows VM",
        "postgres": "Self-managed PostgreSQL on local NVMe / Managed DB partner",
        "mysql": "Self-managed MySQL on local NVMe",
        "oracle": "Not Supported",
        "nosql": "Self-hosted ScyllaDB / MongoDB"
      },
      "cache": "Self-hosted Redis with persistence",
      "objectStorage": "Hetzner Storage Box (WebDAV/SFTP) or MinIO on NVMe",
      "queue": "Self-hosted RabbitMQ / Redis Streams",
      "scheduledJobs": "Systemd Timers / Cron on Cloud Servers",
      "gpuInstance": "Hetzner Server Auction (Custom GPU Dedicated)",
      "hybridGateway": "WireGuard / StrongSwan IPSec Site-to-Site Tunnel",
      "identity": "Keycloak / Authelia on Hetzner",
      "monitoring": "Prometheus & Grafana on Hetzner Cloud",
      "cdn": "Cloudflare integration recommended",
      "security": "Hetzner Cloud Firewall"
    },
    "pricing": {
      "computePerHourVCPU": 0.0095,
      "ramPerHourGB": 0.0016,
      "dbBaseMonthly": 10.0,
      "sqlServerLicenseMultiplier": 3.0,
      "objectStoragePerGBMonth": 0.005,
      "egressPerGB": 0.001,
      "cacheBaseMonthly": 8.0,
      "gpuHourlyRate": 0.8,
      "hybridGatewayMonthly": 10.0
    },
    "pros": [
      "Incredible raw compute power per dollar (3x to 5x cheaper than hyperscalers)",
      "20 TB of free outbound traffic included per cloud server, virtually eliminating egress shock",
      "Strict European GDPR compliance and low environmental footprint"
    ],
    "cons": [
      "No native Asian/Indian datacenters (primarily Germany, Finland, and US East/West)",
      "Requires more self-managed DevOps tooling; lacks turnkey managed PaaS services"
    ],
    "bestFor": "High-bandwidth streaming, SaaS backends, multi-node Kubernetes, bulk compute on a budget"
  },
  {
    "id": "oci",
    "name": "Oracle Cloud Infrastructure (OCI)",
    "shortName": "Oracle Cloud",
    "category": "Alternative IaaS / Free Tier Leader",
    "badge": "Database & Perpetual Free Tier",
    "country": "Global (US, India, Europe, Asia)",
    "starterSpec": "4 Ampere A1 ARM Cores, 24 GB RAM, 200 GB NVMe",
    "tagline": "Superior database economics, Autonomous Database, generous free bandwidth, and fast bare-metal compute.",
    "description": "OCI offers superior price-performance for enterprise databases, 10TB/month of free egress bandwidth, Oracle Autonomous Database, and high-performance Ampere and GPU clusters.",
    "costMonthlyUSD": 0.0,
    "cost24HrUSD": 0.0,
    "freeAllowance": "Perpetual Always Free (4 ARM cores, 24GB RAM, 200GB storage, 10 TB egress) + $300 30-day trial",
    "creditCardReq": "Yes (Credit card for verification)",
    "bandwidthIncluded": "10 TB Outbound Data Transfer Free/mo ($0.0085/GB thereafter)",
    "capabilities": {
      "windowsWorkloads": 70,
      "sqlServerSupport": 72,
      "entraIdIntegration": 38,
      "microsoftEcosystem": 42,
      "hybridConnectivity": 88,
      "kubernetes": 84,
      "serverlessContainers": 82,
      "gpuInference": 92,
      "websocketsRealtime": 82,
      "mediaProcessing": 80,
      "relationalPostgres": 86,
      "relationalMySQL": 92,
      "oracleDatabase": 100,
      "cachingRedis": 82,
      "scheduledJobsQueues": 85,
      "developerSimplicity": 65,
      "costEfficiencyPerDollar": 86,
      "complianceCoverage": [
        "hipaa",
        "soc2",
        "pci-dss",
        "gdpr",
        "rbi-india",
        "fedramp"
      ],
      "regions": [
        "india",
        "us-east",
        "us-west",
        "europe",
        "apac"
      ]
    },
    "services": {
      "dns": "OCI DNS Service",
      "loadBalancer": "OCI Flexible Load Balancer",
      "compute": "OCI Compute (Ampere A1 / AMD EPYC)",
      "containerOrchestrator": "Oracle Container Engine for Kubernetes (OKE)",
      "serverless": "OCI Functions (Fn Project based)",
      "database": {
        "sqlServer": "OCI Database with SQL Server",
        "postgres": "OCI Database with PostgreSQL",
        "mysql": "MySQL HeatWave Service",
        "oracle": "Oracle Autonomous Database (Serverless)",
        "nosql": "Oracle NoSQL Database Cloud"
      },
      "cache": "OCI Cache with Redis",
      "objectStorage": "OCI Object Storage (Standard Tier)",
      "queue": "OCI Queue & OCI Events",
      "scheduledJobs": "OCI Resource Scheduler / OCI Functions Timer",
      "gpuInstance": "OCI GPU Instances (NVIDIA A10 / A100)",
      "hybridGateway": "OCI FastConnect & IPSec VPN",
      "identity": "OCI IAM Identity Domains",
      "monitoring": "OCI Monitoring & Logging Analytics",
      "cdn": "OCI Web Application Acceleration",
      "security": "OCI Cloud Guard & Vault"
    },
    "pricing": {
      "computePerHourVCPU": 0.028,
      "ramPerHourGB": 0.0038,
      "dbBaseMonthly": 22.0,
      "sqlServerLicenseMultiplier": 2.0,
      "objectStoragePerGBMonth": 0.025,
      "egressPerGB": 0.0085,
      "cacheBaseMonthly": 20.0,
      "gpuHourlyRate": 1.1,
      "hybridGatewayMonthly": 50.0
    },
    "pros": [
      "10 TB of free outbound data transfer per month, then only $0.0085/GB",
      "Industry standard for Oracle Database and MySQL HeatWave analytics",
      "Very competitive Ampere ARM and AMD EPYC core compute pricing"
    ],
    "cons": [
      "Steeper IAM learning curve and smaller community than AWS/Azure",
      "Popular free regions frequently out of host capacity"
    ],
    "bestFor": "Zero-budget MVP startups, indie hackers, persistent microservices, enterprise Oracle workloads"
  },
  {
    "id": "digitalocean",
    "name": "DigitalOcean",
    "shortName": "DigitalOcean",
    "category": "Alternative IaaS",
    "badge": "Developer Simplicity & Velocity",
    "country": "Global (15+ Regions, Bangalore BLR1)",
    "starterSpec": "1 vCPU, 1 GB RAM, 25 GB SSD, 1 TB Transfer",
    "tagline": "Simple, predictable cloud infrastructure designed for developers, agile startups, and modern web apps.",
    "description": "DigitalOcean eliminates hyperscaler complexity with clean predictable pricing, straightforward managed PostgreSQL, managed Kubernetes (DOKS), and App Platform.",
    "costMonthlyUSD": 6.0,
    "cost24HrUSD": 0.22,
    "freeAllowance": "$200 Free Credits for 60 Days (GitHub Student Pack grants +$200)",
    "creditCardReq": "Yes (Credit Card or PayPal)",
    "bandwidthIncluded": "1 TB Included Transfer ($0.01/GB overage)",
    "capabilities": {
      "windowsWorkloads": 22,
      "sqlServerSupport": 20,
      "entraIdIntegration": 12,
      "microsoftEcosystem": 15,
      "hybridConnectivity": 30,
      "kubernetes": 82,
      "serverlessContainers": 86,
      "gpuInference": 65,
      "websocketsRealtime": 82,
      "mediaProcessing": 80,
      "relationalPostgres": 88,
      "relationalMySQL": 86,
      "oracleDatabase": 10,
      "cachingRedis": 85,
      "scheduledJobsQueues": 80,
      "developerSimplicity": 98,
      "costEfficiencyPerDollar": 88,
      "complianceCoverage": [
        "gdpr",
        "soc2"
      ],
      "regions": [
        "india",
        "us-east",
        "us-west",
        "europe",
        "apac"
      ]
    },
    "services": {
      "dns": "DigitalOcean DNS",
      "loadBalancer": "DigitalOcean Load Balancers (HA Proxy based)",
      "compute": "DigitalOcean Droplets & App Platform",
      "containerOrchestrator": "DigitalOcean Kubernetes (DOKS)",
      "serverless": "DigitalOcean Functions",
      "database": {
        "sqlServer": "Custom Docker on Droplet (Self-managed only)",
        "postgres": "DigitalOcean Managed Databases for PostgreSQL",
        "mysql": "DigitalOcean Managed Databases for MySQL",
        "oracle": "Not Supported",
        "nosql": "Managed MongoDB"
      },
      "cache": "DigitalOcean Managed Redis",
      "objectStorage": "DigitalOcean Spaces (S3 compatible + built-in CDN)",
      "queue": "Managed Kafka / Redis Queue",
      "scheduledJobs": "DigitalOcean App Platform Worker / Scheduled Jobs",
      "gpuInstance": "Paperspace by DigitalOcean (H100 / A100 / A4000)",
      "hybridGateway": "VPC Peering & Custom IPSec Gateway on Droplet",
      "identity": "Third-Party OAuth / Auth0 / Supabase",
      "monitoring": "DigitalOcean Monitoring & Alerting",
      "cdn": "Spaces Built-in CDN",
      "security": "Cloud Firewalls (Free)"
    },
    "pricing": {
      "computePerHourVCPU": 0.018,
      "ramPerHourGB": 0.0028,
      "dbBaseMonthly": 15.0,
      "sqlServerLicenseMultiplier": 3.0,
      "objectStoragePerGBMonth": 0.02,
      "egressPerGB": 0.01,
      "cacheBaseMonthly": 15.0,
      "gpuHourlyRate": 0.95,
      "hybridGatewayMonthly": 20.0
    },
    "pros": [
      "Exceptional developer experience: spins up in seconds with transparent monthly invoices",
      "Managed PostgreSQL and Redis are rock-solid for startup and medium SaaS",
      "Generous bandwidth pool included with each droplet"
    ],
    "cons": [
      "No native managed SQL Server or enterprise Windows directory integration",
      "Lacks dedicated enterprise private circuits (no DirectConnect/ExpressRoute equiv)"
    ],
    "bestFor": "Rapid SaaS prototyping, software agency client hosting, staging clusters, agency retainers"
  },
  {
    "id": "linode",
    "name": "Linode (Akamai Connected Cloud)",
    "shortName": "Linode",
    "category": "Alternative IaaS",
    "badge": "Akamai Global Edge & Linux Core",
    "country": "Global (Akamai Edge Network, Mumbai)",
    "starterSpec": "1 vCPU, 1 GB RAM, 25 GB SSD, 1 TB Transfer",
    "tagline": "High-performance Linux compute backed by Akamai's distributed global edge network.",
    "description": "Linode combines transparent developer virtual machines with Akamai's content delivery and cybersecurity backbone.",
    "costMonthlyUSD": 5.0,
    "cost24HrUSD": 0.18,
    "freeAllowance": "$100 Free Credits for 60 Days",
    "creditCardReq": "Yes (Strict fraud filtering)",
    "bandwidthIncluded": "1 TB Transfer pooled globally across all nodes",
    "capabilities": {
      "windowsWorkloads": 25,
      "sqlServerSupport": 25,
      "entraIdIntegration": 15,
      "microsoftEcosystem": 18,
      "hybridConnectivity": 40,
      "kubernetes": 80,
      "serverlessContainers": 70,
      "gpuInference": 75,
      "websocketsRealtime": 80,
      "mediaProcessing": 82,
      "relationalPostgres": 84,
      "relationalMySQL": 82,
      "oracleDatabase": 15,
      "cachingRedis": 82,
      "scheduledJobsQueues": 78,
      "developerSimplicity": 92,
      "costEfficiencyPerDollar": 86,
      "complianceCoverage": [
        "gdpr",
        "soc2",
        "pci-dss"
      ],
      "regions": [
        "india",
        "us-east",
        "us-west",
        "europe",
        "apac"
      ]
    },
    "services": {
      "dns": "Linode DNS Manager",
      "loadBalancer": "Linode NodeBalancers",
      "compute": "Linode Compute Instances (Dedicated & Shared CPU)",
      "containerOrchestrator": "Linode Kubernetes Engine (LKE)",
      "serverless": "Akamai EdgeWorkers",
      "database": {
        "sqlServer": "Self-managed on VM",
        "postgres": "Linode Managed Databases for PostgreSQL",
        "mysql": "Linode Managed Databases for MySQL",
        "oracle": "Not Supported",
        "nosql": "Managed MongoDB"
      },
      "cache": "Self-managed Redis on Linode",
      "objectStorage": "Linode Object Storage (S3-compatible)",
      "queue": "Self-hosted RabbitMQ / Redis",
      "scheduledJobs": "Cron / Systemd on Linode",
      "gpuInstance": "Linode Dedicated GPU Instances (RTX6000)",
      "hybridGateway": "IPSec VPN / BGP Peering",
      "identity": "OAuth / Keycloak",
      "monitoring": "Linode Longview",
      "cdn": "Akamai Edge Cloud",
      "security": "Cloud Firewalls"
    },
    "pricing": {
      "computePerHourVCPU": 0.015,
      "ramPerHourGB": 0.0025,
      "dbBaseMonthly": 15.0,
      "sqlServerLicenseMultiplier": 3.0,
      "objectStoragePerGBMonth": 0.02,
      "egressPerGB": 0.01,
      "cacheBaseMonthly": 15.0,
      "gpuHourlyRate": 1.0,
      "hybridGatewayMonthly": 25.0
    },
    "pros": [
      "High-performance AMD EPYC processors and 24/7 human telephone support included",
      "Seamless Akamai global edge distribution and DDoS shielding",
      "Generous globally pooled bandwidth allocations"
    ],
    "cons": [
      "Strict fraud verification on new signups",
      "Smaller managed PaaS catalog compared to Big 3"
    ],
    "bestFor": "Monolithic Linux backends, self-hosted open-source (GitLab, Nextcloud), edge microservices"
  },
  {
    "id": "vultr",
    "name": "Vultr",
    "shortName": "Vultr",
    "category": "Alternative IaaS",
    "badge": "Global Geographic Footprint & Custom ISO",
    "country": "Global (32+ Datacenters, Mumbai & Delhi)",
    "starterSpec": "1 vCPU, 1 GB RAM, 25 GB NVMe, 1 TB Transfer",
    "tagline": "32+ global datacenter locations, custom OS ISO uploads, high-frequency NVMe, and fractional GPUs.",
    "description": "Vultr stands out with an expansive global datacenter presence in 32+ cities, custom Windows/BSD ISO uploads, high-frequency compute, and on-demand GPU clusters.",
    "costMonthlyUSD": 6.0,
    "cost24HrUSD": 0.22,
    "freeAllowance": "$100 to $250 Free Credits (30 Days) + 100% deposit match up to $100",
    "creditCardReq": "Yes",
    "bandwidthIncluded": "1 TB Transfer calculated per datacenter",
    "capabilities": {
      "windowsWorkloads": 55,
      "sqlServerSupport": 45,
      "entraIdIntegration": 20,
      "microsoftEcosystem": 25,
      "hybridConnectivity": 45,
      "kubernetes": 82,
      "serverlessContainers": 72,
      "gpuInference": 88,
      "websocketsRealtime": 82,
      "mediaProcessing": 84,
      "relationalPostgres": 85,
      "relationalMySQL": 84,
      "oracleDatabase": 15,
      "cachingRedis": 82,
      "scheduledJobsQueues": 78,
      "developerSimplicity": 90,
      "costEfficiencyPerDollar": 86,
      "complianceCoverage": [
        "gdpr",
        "soc2",
        "pci-dss"
      ],
      "regions": [
        "india",
        "us-east",
        "us-west",
        "europe",
        "apac",
        "latam"
      ]
    },
    "services": {
      "dns": "Vultr DNS",
      "loadBalancer": "Vultr Load Balancers",
      "compute": "Vultr Cloud Compute (High Frequency NVMe)",
      "containerOrchestrator": "Vultr Kubernetes Engine (VKE)",
      "serverless": "Vultr Serverless Inference",
      "database": {
        "sqlServer": "Windows Server VM with SQL Server",
        "postgres": "Vultr Managed Databases for PostgreSQL",
        "mysql": "Vultr Managed Databases for MySQL",
        "oracle": "Not Supported",
        "nosql": "Vultr Managed Valkey/Redis"
      },
      "cache": "Vultr Managed Redis",
      "objectStorage": "Vultr Object Storage",
      "queue": "Self-hosted Queues",
      "scheduledJobs": "Cron on Cloud Compute",
      "gpuInstance": "Vultr Cloud GPU (NVIDIA GH200 / A100 / L40S)",
      "hybridGateway": "Direct Connect / Direct Peering",
      "identity": "OAuth / Keycloak",
      "monitoring": "Vultr Metrics",
      "cdn": "Vultr CDN",
      "security": "Native DDoS Mitigation"
    },
    "pricing": {
      "computePerHourVCPU": 0.016,
      "ramPerHourGB": 0.0026,
      "dbBaseMonthly": 15.0,
      "sqlServerLicenseMultiplier": 2.8,
      "objectStoragePerGBMonth": 0.02,
      "egressPerGB": 0.01,
      "cacheBaseMonthly": 15.0,
      "gpuHourlyRate": 0.9,
      "hybridGatewayMonthly": 30.0
    },
    "pros": [
      "32+ global datacenter locations including Mumbai and Delhi NCR",
      "Upload any custom Windows, Linux, or BSD operating system ISO",
      "Turnkey access to modern NVIDIA Cloud GPUs (A100, L40S)"
    ],
    "cons": [
      "Bandwidth not globally pooled across regions",
      "Ticketing support is asynchronous with variable turnaround"
    ],
    "bestFor": "Specific geographic routing (Sydney, S\u00e3o Paulo, Tokyo, Mumbai), GPU AI inference, custom OS setups"
  },
  {
    "id": "ovhcloud",
    "name": "OVHcloud",
    "shortName": "OVHcloud",
    "category": "European Hyperscaler",
    "badge": "Unmetered Bandwidth & Anti-DDoS",
    "country": "France / Europe / Canada",
    "starterSpec": "1 vCPU, 2 GB RAM, 40 GB NVMe, 250 Mbps Unmetered",
    "tagline": "100% unmetered public bandwidth, proprietary Anti-DDoS protection, and complete European data sovereignty.",
    "description": "OVHcloud is Europe's largest cloud provider, offering unlimited unmetered bandwidth, bare-metal servers, and immunity from the US CLOUD Act.",
    "costMonthlyUSD": 6.5,
    "cost24HrUSD": 0.26,
    "freeAllowance": "$100 - $200 promo vouchers + 30-day money-back guarantee",
    "creditCardReq": "Yes",
    "bandwidthIncluded": "Unmetered & Unlimited Public Bandwidth (250 Mbps - 1 Gbps)",
    "capabilities": {
      "windowsWorkloads": 50,
      "sqlServerSupport": 40,
      "entraIdIntegration": 18,
      "microsoftEcosystem": 22,
      "hybridConnectivity": 60,
      "kubernetes": 78,
      "serverlessContainers": 68,
      "gpuInference": 72,
      "websocketsRealtime": 82,
      "mediaProcessing": 88,
      "relationalPostgres": 80,
      "relationalMySQL": 80,
      "oracleDatabase": 20,
      "cachingRedis": 78,
      "scheduledJobsQueues": 75,
      "developerSimplicity": 78,
      "costEfficiencyPerDollar": 92,
      "complianceCoverage": [
        "gdpr",
        "hipaa",
        "pci-dss"
      ],
      "regions": [
        "europe",
        "us-east"
      ]
    },
    "services": {
      "dns": "OVH DNS",
      "loadBalancer": "OVH Load Balancer",
      "compute": "Public Cloud Instances & Bare Metal Servers",
      "containerOrchestrator": "Managed Kubernetes Service (MKS)",
      "serverless": "OVH AI Endpoints",
      "database": {
        "sqlServer": "Self-managed on VM",
        "postgres": "OVH Managed Databases for PostgreSQL",
        "mysql": "OVH Managed Databases for MySQL",
        "oracle": "Not Supported",
        "nosql": "Managed MongoDB"
      },
      "cache": "OVH Managed Redis",
      "objectStorage": "High Performance Object Storage (S3 API)",
      "queue": "Managed Kafka / RabbitMQ",
      "scheduledJobs": "Cron on Public Cloud",
      "gpuInstance": "GPU Instances (NVIDIA V100S / A100)",
      "hybridGateway": "OVHcloud Connect",
      "identity": "IAM OVHcloud",
      "monitoring": "Metrics Data Platform",
      "cdn": "OVH CDN",
      "security": "Proprietary Anti-DDoS (VAC)"
    },
    "pricing": {
      "computePerHourVCPU": 0.014,
      "ramPerHourGB": 0.0022,
      "dbBaseMonthly": 12.0,
      "sqlServerLicenseMultiplier": 2.8,
      "objectStoragePerGBMonth": 0.01,
      "egressPerGB": 0.0,
      "cacheBaseMonthly": 12.0,
      "gpuHourlyRate": 0.9,
      "hybridGatewayMonthly": 35.0
    },
    "pros": [
      "100% unmetered and unlimited outbound bandwidth with zero egress surcharges",
      "Built-in proprietary hardware Anti-DDoS scrubbing centers",
      "Shielded from US surveillance laws and strict EU data privacy compliance"
    ],
    "cons": [
      "Complex administrative console and slower customer support ticketing",
      "Requires careful multi-region disaster recovery planning"
    ],
    "bestFor": "Game servers (Minecraft, Steam), video streaming mirrors, large file distribution, European privacy"
  },
  {
    "id": "alibaba",
    "name": "Alibaba Cloud (Aliyun)",
    "shortName": "Alibaba Cloud",
    "category": "Hyperscaler (APAC Leader)",
    "badge": "Mainland China & APAC Dominance",
    "country": "China / APAC / Global (India region)",
    "starterSpec": "1 vCPU, 2 GB RAM, 60 GB SSD",
    "tagline": "The dominant cloud across Mainland China and APAC with native ICP license support.",
    "description": "Alibaba Cloud is the undisputed market leader across China and Southeast Asia, offering seamless penetration through the Great Firewall and dedicated cross-border express lines.",
    "costMonthlyUSD": 6.0,
    "cost24HrUSD": 0.22,
    "freeAllowance": "$300 to $1,000 corporate trial credits + 12-month free usage tier",
    "creditCardReq": "Yes",
    "bandwidthIncluded": "Regional metered allowances",
    "capabilities": {
      "windowsWorkloads": 70,
      "sqlServerSupport": 72,
      "entraIdIntegration": 30,
      "microsoftEcosystem": 35,
      "hybridConnectivity": 85,
      "kubernetes": 90,
      "serverlessContainers": 85,
      "gpuInference": 92,
      "websocketsRealtime": 85,
      "mediaProcessing": 90,
      "relationalPostgres": 88,
      "relationalMySQL": 95,
      "oracleDatabase": 60,
      "cachingRedis": 90,
      "scheduledJobsQueues": 88,
      "developerSimplicity": 68,
      "costEfficiencyPerDollar": 78,
      "complianceCoverage": [
        "soc2",
        "pci-dss",
        "gdpr"
      ],
      "regions": [
        "apac",
        "india",
        "europe",
        "us-east"
      ]
    },
    "services": {
      "dns": "Alibaba Cloud DNS",
      "loadBalancer": "Server Load Balancer (SLB)",
      "compute": "Elastic Compute Service (ECS)",
      "containerOrchestrator": "Container Service for Kubernetes (ACK)",
      "serverless": "Function Compute (FC)",
      "database": {
        "sqlServer": "ApsaraDB RDS for SQL Server",
        "postgres": "ApsaraDB RDS for PostgreSQL / PolarDB",
        "mysql": "PolarDB for MySQL",
        "oracle": "PolarDB Migration Engine",
        "nosql": "ApsaraDB for MongoDB / Tablestore"
      },
      "cache": "ApsaraDB for Redis",
      "objectStorage": "Object Storage Service (OSS)",
      "queue": "Message Queue (RocketMQ / Kafka)",
      "scheduledJobs": "Serverless Task / SchedulerX",
      "gpuInstance": "GPU-accelerated ECS (NVIDIA A10 / V100)",
      "hybridGateway": "Express Connect & Smart Access Gateway",
      "identity": "Resource Access Management (RAM)",
      "monitoring": "CloudMonitor",
      "cdn": "Alibaba Cloud DCDN",
      "security": "Anti-DDoS Pro & Web Application Firewall"
    },
    "pricing": {
      "computePerHourVCPU": 0.025,
      "ramPerHourGB": 0.0035,
      "dbBaseMonthly": 20.0,
      "sqlServerLicenseMultiplier": 2.1,
      "objectStoragePerGBMonth": 0.018,
      "egressPerGB": 0.075,
      "cacheBaseMonthly": 18.0,
      "gpuHourlyRate": 1.1,
      "hybridGatewayMonthly": 55.0
    },
    "pros": [
      "Unrivaled infrastructure across Mainland China and Southeast Asia",
      "Full enterprise assistance with Chinese ICP operating licenses",
      "High performance PolarDB cloud-native database engine"
    ],
    "cons": [
      "Complex regulatory compliance under Chinese cybersecurity law",
      "English documentation can feature uneven translations"
    ],
    "bestFor": "E-commerce and mobile apps expanding into China, Hong Kong, and Southeast Asia"
  },
  {
    "id": "scaleway",
    "name": "Scaleway",
    "shortName": "Scaleway",
    "category": "Alternative IaaS",
    "badge": "Apple Silicon Mac Cloud & Green IaaS",
    "country": "France / Netherlands / Poland",
    "starterSpec": "1 vCPU, 2 GB RAM, 20 GB Block",
    "tagline": "European green cloud hosting, hourly bare-metal Apple Silicon M-series Macs, and modern developer PaaS.",
    "description": "Scaleway provides 100% renewable powered cloud hosting across Paris, Amsterdam, and Warsaw, complete with managed Kubernetes, Serverless, and hourly Apple Silicon Macs.",
    "costMonthlyUSD": 7.2,
    "cost24HrUSD": 0.26,
    "freeAllowance": "\u20ac100 promo vouchers + permanent free tier for 1M serverless executions & 75 GB S3 storage",
    "creditCardReq": "Yes",
    "bandwidthIncluded": "Generous EU bandwidth pools",
    "capabilities": {
      "windowsWorkloads": 25,
      "sqlServerSupport": 20,
      "entraIdIntegration": 10,
      "microsoftEcosystem": 15,
      "hybridConnectivity": 35,
      "kubernetes": 80,
      "serverlessContainers": 82,
      "gpuInference": 75,
      "websocketsRealtime": 80,
      "mediaProcessing": 80,
      "relationalPostgres": 82,
      "relationalMySQL": 80,
      "oracleDatabase": 10,
      "cachingRedis": 80,
      "scheduledJobsQueues": 76,
      "developerSimplicity": 90,
      "costEfficiencyPerDollar": 86,
      "complianceCoverage": [
        "gdpr",
        "hipaa"
      ],
      "regions": [
        "europe"
      ]
    },
    "services": {
      "dns": "Scaleway Domains & DNS",
      "loadBalancer": "Scaleway Load Balancer",
      "compute": "Instances & Bare Metal (inc. Apple Silicon M2/M3)",
      "containerOrchestrator": "Kubernetes Kapsule / Kosmos",
      "serverless": "Serverless Containers & Functions",
      "database": {
        "sqlServer": "Self-managed on VM",
        "postgres": "Managed PostgreSQL Database",
        "mysql": "Managed MySQL Database",
        "oracle": "Not Supported",
        "nosql": "Managed Redis"
      },
      "cache": "Managed Redis",
      "objectStorage": "Scaleway Object Storage (Multi-AZ)",
      "queue": "Managed Messaging (SQS/NATS)",
      "scheduledJobs": "Serverless Cron Triggers",
      "gpuInstance": "GPU Instances (NVIDIA H100 / L40S)",
      "hybridGateway": "Private Network & VPC",
      "identity": "Scaleway IAM",
      "monitoring": "Cockpit (Managed Grafana)",
      "cdn": "Scaleway Edge Services",
      "security": "Secret Manager & Security Groups"
    },
    "pricing": {
      "computePerHourVCPU": 0.015,
      "ramPerHourGB": 0.0024,
      "dbBaseMonthly": 14.0,
      "sqlServerLicenseMultiplier": 3.0,
      "objectStoragePerGBMonth": 0.015,
      "egressPerGB": 0.01,
      "cacheBaseMonthly": 14.0,
      "gpuHourlyRate": 0.95,
      "hybridGatewayMonthly": 20.0
    },
    "pros": [
      "Bare-metal Apple Silicon M-series Mac instances by the hour for iOS/macOS CI/CD",
      "100% renewable-powered European datacenters with low PUE rating",
      "Integrated Grafana Cockpit and modern developer-first console"
    ],
    "cons": [
      "Geographic coverage restricted to Europe (Paris, Amsterdam, Warsaw)",
      "Smaller global community than the Big 3"
    ],
    "bestFor": "iOS/macOS automated CI/CD build farms, green hosting sustainability mandates"
  },
  {
    "id": "render",
    "name": "Render",
    "shortName": "Render",
    "category": "Developer PaaS",
    "badge": "Zero-DevOps Git Push Simplicity",
    "country": "Global Edge (Oregon, Ohio, Frankfurt, Singapore)",
    "starterSpec": "0.5 CPU, 512 MB RAM (Starter Always-On)",
    "tagline": "Zero-DevOps Git push deploys, automatic SSL, native managed PostgreSQL, Redis, and cron jobs.",
    "description": "Render completely eliminates infrastructure maintenance with automatic Git-push builds, preview environments, and instant scalability for modern web stacks.",
    "costMonthlyUSD": 7.0,
    "cost24HrUSD": 0.23,
    "freeAllowance": "Permanent Free Tier (750 free web service hours/month + free PostgreSQL for 90 days)",
    "creditCardReq": "No (for free tier)",
    "bandwidthIncluded": "100 GB Included Bandwidth",
    "capabilities": {
      "windowsWorkloads": 10,
      "sqlServerSupport": 10,
      "entraIdIntegration": 10,
      "microsoftEcosystem": 12,
      "hybridConnectivity": 15,
      "kubernetes": 60,
      "serverlessContainers": 90,
      "gpuInference": 40,
      "websocketsRealtime": 82,
      "mediaProcessing": 75,
      "relationalPostgres": 92,
      "relationalMySQL": 70,
      "oracleDatabase": 5,
      "cachingRedis": 90,
      "scheduledJobsQueues": 92,
      "developerSimplicity": 100,
      "costEfficiencyPerDollar": 82,
      "complianceCoverage": [
        "soc2",
        "gdpr"
      ],
      "regions": [
        "us-east",
        "us-west",
        "europe",
        "apac"
      ]
    },
    "services": {
      "dns": "Render Custom Domains & Cloudflare DNS",
      "loadBalancer": "Built-in Zero-Config TLS Load Balancer",
      "compute": "Render Web Services & Background Workers",
      "containerOrchestrator": "Fully Managed Kubernetes Behind the Scenes",
      "serverless": "Render Background Tasks",
      "database": {
        "sqlServer": "Not Supported",
        "postgres": "Render Fully Managed PostgreSQL",
        "mysql": "Dockerized MySQL (Self-managed)",
        "oracle": "Not Supported",
        "nosql": "Dockerized NoSQL"
      },
      "cache": "Render Managed Redis",
      "objectStorage": "Integrated S3 / Cloudflare R2",
      "queue": "Render Background Workers + Redis Queue",
      "scheduledJobs": "Render Cron Jobs (Native UI Scheduler)",
      "gpuInstance": "Not natively available on starter tiers",
      "hybridGateway": "Not Supported",
      "identity": "OAuth / Auth0 / Clerk integration",
      "monitoring": "Built-in Metrics & Log Streams",
      "cdn": "Global Edge CDN",
      "security": "Automated Let's Encrypt SSL & DDoS Protection"
    },
    "pricing": {
      "computePerHourVCPU": 0.02,
      "ramPerHourGB": 0.004,
      "dbBaseMonthly": 7.0,
      "sqlServerLicenseMultiplier": 3.5,
      "objectStoragePerGBMonth": 0.02,
      "egressPerGB": 0.02,
      "cacheBaseMonthly": 7.0,
      "gpuHourlyRate": 1.5,
      "hybridGatewayMonthly": 50.0
    },
    "pros": [
      "Zero DevOps: Automatic Git-push deployments with instant preview URLs",
      "Integrated managed PostgreSQL and Redis configured in under 60 seconds",
      "Native cron jobs and background workers included directly in dashboard"
    ],
    "cons": [
      "Free tier instances sleep after 15 minutes of inactivity with 30-50s cold boot",
      "Persistent volumes are bound to single instances without distributed clustering"
    ],
    "bestFor": "Lean startup MVPs, Next.js / Django / Rails / FastAPI applications, agency client apps with zero sysadmin"
  },
  {
    "id": "flyio",
    "name": "Fly.io",
    "shortName": "Fly.io",
    "category": "Developer PaaS",
    "badge": "Global Edge Micro-VMs & WebSockets",
    "country": "30+ Global Edge Cities (including Mumbai)",
    "starterSpec": "1 Shared CPU, 256 MB RAM (Micro-VM)",
    "tagline": "Deploys Docker containers as micro-VMs in 30+ cities worldwide with WireGuard private mesh.",
    "description": "Fly.io transforms Docker images into lightweight Firecracker micro-VMs running close to users across 30+ global edge locations with sub-10ms response times.",
    "costMonthlyUSD": 1.94,
    "cost24HrUSD": 0.065,
    "freeAllowance": "Free resource allowance: Up to 3 micro-VMs, 3 GB persistent storage, 160 GB egress/mo free",
    "creditCardReq": "Yes (Card needed for verification)",
    "bandwidthIncluded": "160 GB Free Outbound Egress per month",
    "capabilities": {
      "windowsWorkloads": 10,
      "sqlServerSupport": 10,
      "entraIdIntegration": 10,
      "microsoftEcosystem": 12,
      "hybridConnectivity": 25,
      "kubernetes": 60,
      "serverlessContainers": 94,
      "gpuInference": 70,
      "websocketsRealtime": 98,
      "mediaProcessing": 78,
      "relationalPostgres": 86,
      "relationalMySQL": 75,
      "oracleDatabase": 5,
      "cachingRedis": 85,
      "scheduledJobsQueues": 85,
      "developerSimplicity": 88,
      "costEfficiencyPerDollar": 90,
      "complianceCoverage": [
        "soc2",
        "gdpr"
      ],
      "regions": [
        "india",
        "us-east",
        "us-west",
        "europe",
        "apac",
        "latam"
      ]
    },
    "services": {
      "dns": "Fly Anycast DNS",
      "loadBalancer": "Fly Edge Proxy (Global Anycast IPv4/IPv6)",
      "compute": "Fly Machines (Firecracker Micro-VMs)",
      "containerOrchestrator": "Fly Orchestration Engine",
      "serverless": "Scale-to-Zero Fly Machines",
      "database": {
        "sqlServer": "Not Supported",
        "postgres": "Fly Postgres (LiteFS / Stolon clustered)",
        "mysql": "Self-hosted Docker Container",
        "oracle": "Not Supported",
        "nosql": "LiteFS / SQLite replicated at edge"
      },
      "cache": "Fly Redis (Upstash powered)",
      "objectStorage": "Tigris Object Storage (Global S3 API)",
      "queue": "Redis / RabbitMQ in Micro-VM",
      "scheduledJobs": "Fly Machine Scheduled Wakeups",
      "gpuInstance": "Fly GPUs (NVIDIA A100 / A10 / L40S by the second)",
      "hybridGateway": "Fly WireGuard Private Mesh Network",
      "identity": "Third-Party OAuth / Supabase",
      "monitoring": "Fly Grafana & Prometheus",
      "cdn": "Fly Edge Anycast Routing",
      "security": "Automated TLS Certificates"
    },
    "pricing": {
      "computePerHourVCPU": 0.012,
      "ramPerHourGB": 0.0022,
      "dbBaseMonthly": 5.0,
      "sqlServerLicenseMultiplier": 3.5,
      "objectStoragePerGBMonth": 0.015,
      "egressPerGB": 0.02,
      "cacheBaseMonthly": 5.0,
      "gpuHourlyRate": 0.85,
      "hybridGatewayMonthly": 15.0
    },
    "pros": [
      "Deploys Docker containers as Firecracker micro-VMs in 30+ cities within seconds",
      "Best-in-class low latency for WebSockets, LiveView, and bidirectional streams",
      "WireGuard private mesh connects distributed services without public IP exposure"
    ],
    "cons": [
      "Primarily CLI-driven workflow (flyctl) with sparse point-and-click GUI",
      "Networking and persistent volume attachments require understanding micro-VM semantics"
    ],
    "bestFor": "Real-time multiplayer backends, Elixir/Phoenix, WebSockets, dynamic request routing at the edge"
  },
  {
    "id": "railway",
    "name": "Railway",
    "shortName": "Railway",
    "category": "Developer PaaS",
    "badge": "Visual Canvas & Ephemeral Environments",
    "country": "Global Edge (US, Europe)",
    "starterSpec": "0.2 vCPU, 512 MB RAM Container",
    "tagline": "Interactive visual canvas to drag and connect microservices with automatic Nixpacks builds.",
    "description": "Railway offers a modern infrastructure canvas where developers visually connect services, databases, and cron workers with per-second usage-based billing.",
    "costMonthlyUSD": 5.0,
    "cost24HrUSD": 0.28,
    "freeAllowance": "$5.00 one-time trial grant + $1.00/mo recurring usage credits",
    "creditCardReq": "No (for basic trial)",
    "bandwidthIncluded": "Usage-based per GB",
    "capabilities": {
      "windowsWorkloads": 10,
      "sqlServerSupport": 10,
      "entraIdIntegration": 10,
      "microsoftEcosystem": 12,
      "hybridConnectivity": 15,
      "kubernetes": 60,
      "serverlessContainers": 88,
      "gpuInference": 45,
      "websocketsRealtime": 84,
      "mediaProcessing": 75,
      "relationalPostgres": 90,
      "relationalMySQL": 85,
      "oracleDatabase": 5,
      "cachingRedis": 88,
      "scheduledJobsQueues": 85,
      "developerSimplicity": 96,
      "costEfficiencyPerDollar": 80,
      "complianceCoverage": [
        "soc2",
        "gdpr"
      ],
      "regions": [
        "us-east",
        "europe"
      ]
    },
    "services": {
      "dns": "Railway Edge Domains",
      "loadBalancer": "Automated Edge Routing & SSL",
      "compute": "Railway Service Deployments",
      "containerOrchestrator": "Railway Custom Orchestrator",
      "serverless": "Railway Ephemeral Deployments",
      "database": {
        "sqlServer": "Not Supported",
        "postgres": "Railway Managed PostgreSQL Plugin",
        "mysql": "Railway Managed MySQL Plugin",
        "oracle": "Not Supported",
        "nosql": "Railway MongoDB Plugin"
      },
      "cache": "Railway Managed Redis Plugin",
      "objectStorage": "S3 Integration Plugin",
      "queue": "Worker Containers",
      "scheduledJobs": "Railway Cron Triggers",
      "gpuInstance": "Not available on basic tiers",
      "hybridGateway": "Private Networking Mesh",
      "identity": "Third-Party OAuth",
      "monitoring": "Railway Observability & Log Drain",
      "cdn": "Edge Proxies",
      "security": "Secret Variables Management"
    },
    "pricing": {
      "computePerHourVCPU": 0.022,
      "ramPerHourGB": 0.0042,
      "dbBaseMonthly": 5.0,
      "sqlServerLicenseMultiplier": 3.5,
      "objectStoragePerGBMonth": 0.02,
      "egressPerGB": 0.05,
      "cacheBaseMonthly": 5.0,
      "gpuHourlyRate": 1.4,
      "hybridGatewayMonthly": 30.0
    },
    "pros": [
      "Intuitive visual canvas to drag, drop, and link microservices and databases",
      "Nixpacks automatically detects programming languages and builds without Dockerfiles",
      "Ephemeral staging environments generated per GitHub pull request"
    ],
    "cons": [
      "Per-second execution billing can spike if applications suffer memory leaks",
      "Limited enterprise compliance certifications"
    ],
    "bestFor": "Rapid multi-service prototyping, ephemeral GitHub PR staging environments, developer tools"
  },
  {
    "id": "proxmox",
    "name": "Proxmox VE",
    "shortName": "Proxmox",
    "category": "Private Cloud",
    "badge": "Open-Source VMware Migration Leader",
    "country": "Self-Hosted / On-Premise (Zero Cloud Lock-in)",
    "starterSpec": "Hardware Dependent (Runs on standard x86 PC or Rack Server)",
    "tagline": "Open-source enterprise hypervisor combining KVM virtual machines, LXC containers, and Ceph storage.",
    "description": "Proxmox VE is the undisputed open-source alternative to VMware vSphere, eliminating recurring Broadcom subscription hikes with built-in clustering, live migration, and ZFS.",
    "costMonthlyUSD": 0.0,
    "cost24HrUSD": 0.0,
    "freeAllowance": "100% Free & Open-Source under GNU AGPLv3. Optional enterprise support \u20ac110 - \u20ac1,050/yr",
    "creditCardReq": "No",
    "bandwidthIncluded": "Unlimited (Determined by physical network hardware)",
    "capabilities": {
      "windowsWorkloads": 85,
      "sqlServerSupport": 85,
      "entraIdIntegration": 35,
      "microsoftEcosystem": 45,
      "hybridConnectivity": 90,
      "kubernetes": 75,
      "serverlessContainers": 50,
      "gpuInference": 80,
      "websocketsRealtime": 85,
      "mediaProcessing": 85,
      "relationalPostgres": 85,
      "relationalMySQL": 85,
      "oracleDatabase": 60,
      "cachingRedis": 85,
      "scheduledJobsQueues": 85,
      "developerSimplicity": 70,
      "costEfficiencyPerDollar": 98,
      "complianceCoverage": [
        "gdpr",
        "hipaa"
      ],
      "regions": [
        "on-premise",
        "private-datacenter"
      ]
    },
    "services": {
      "dns": "Local DNS / Pi-hole / BIND9",
      "loadBalancer": "HAProxy / Keepalived in LXC Container",
      "compute": "KVM Virtual Machines & Lightweight LXC Containers",
      "containerOrchestrator": "k3s / Talos Linux on Proxmox VMs",
      "serverless": "Self-hosted OpenFaaS",
      "database": {
        "sqlServer": "Windows Server VM with SQL Server on ZFS NVMe",
        "postgres": "LXC Container running PostgreSQL 16",
        "mysql": "LXC Container running MySQL 8",
        "oracle": "Oracle Linux VM",
        "nosql": "ScyllaDB / MongoDB in LXC"
      },
      "cache": "Redis in dedicated LXC Container",
      "objectStorage": "MinIO / Ceph Object Gateway (S3 compatible)",
      "queue": "RabbitMQ / Apache Kafka in LXC",
      "scheduledJobs": "Cron / Systemd inside VMs",
      "gpuInstance": "PCIe GPU Passthrough (NVIDIA RTX / Tesla)",
      "hybridGateway": "Physical Fiber Cross-connect & OPNsense / pfSense",
      "identity": "Active Directory / OpenLDAP / Keycloak integration",
      "monitoring": "Proxmox Metrics Server + InfluxDB & Grafana",
      "cdn": "Cloudflare Tunnel integration",
      "security": "Proxmox Firewall & ZFS encrypted pools"
    },
    "pricing": {
      "computePerHourVCPU": 0.0,
      "ramPerHourGB": 0.0,
      "dbBaseMonthly": 0.0,
      "sqlServerLicenseMultiplier": 1.0,
      "objectStoragePerGBMonth": 0.0,
      "egressPerGB": 0.0,
      "cacheBaseMonthly": 0.0,
      "gpuHourlyRate": 0.0,
      "hybridGatewayMonthly": 0.0
    },
    "pros": [
      "100% Free and open-source: Eliminates 300%+ VMware subscription fee hikes",
      "Combines KVM virtual machines and lightweight LXC containers in one web GUI",
      "Built-in live clustering, automated backup server, and ZFS/Ceph storage"
    ],
    "cons": [
      "Requires physical server hardware purchase and datacenter power/cooling",
      "Software-defined networking requires Linux networking knowledge"
    ],
    "bestFor": "SMBs and mid-sized enterprises escaping 300%+ VMware Broadcom price hikes; homelabs, on-prem hardware"
  },
  {
    "id": "openstack",
    "name": "OpenStack",
    "shortName": "OpenStack",
    "category": "Private Cloud",
    "badge": "Defense, Telco & 100% Sovereignty",
    "country": "Self-Hosted / Colocated (Sovereign Infrastructure)",
    "starterSpec": "Hardware Dependent (Requires 3+ Node Enterprise Cluster)",
    "tagline": "Transforms enterprise datacenters into a sovereign private AWS with complete technology independence.",
    "description": "OpenStack is the gold standard for sovereign private clouds, telecommunications (5G NFV), defense contractors, and large organizations demanding zero third-party cloud lock-in.",
    "costMonthlyUSD": 0.0,
    "cost24HrUSD": 0.0,
    "freeAllowance": "100% Free & Open-Source under Apache 2.0. Requires physical hardware purchase",
    "creditCardReq": "No",
    "bandwidthIncluded": "Internal datacenter fabric bandwidth",
    "capabilities": {
      "windowsWorkloads": 80,
      "sqlServerSupport": 80,
      "entraIdIntegration": 30,
      "microsoftEcosystem": 40,
      "hybridConnectivity": 95,
      "kubernetes": 90,
      "serverlessContainers": 60,
      "gpuInference": 85,
      "websocketsRealtime": 85,
      "mediaProcessing": 85,
      "relationalPostgres": 85,
      "relationalMySQL": 85,
      "oracleDatabase": 70,
      "cachingRedis": 85,
      "scheduledJobsQueues": 85,
      "developerSimplicity": 45,
      "costEfficiencyPerDollar": 88,
      "complianceCoverage": [
        "fedramp",
        "hipaa",
        "soc2",
        "gdpr",
        "pci-dss"
      ],
      "regions": [
        "on-premise",
        "private-datacenter"
      ]
    },
    "services": {
      "dns": "Designate (DNS-as-a-Service)",
      "loadBalancer": "Octavia (Load Balancer-as-a-Service)",
      "compute": "Nova (Compute Engine)",
      "containerOrchestrator": "Magnum (Kubernetes Engine)",
      "serverless": "Qinling (Function-as-a-Service)",
      "database": {
        "sqlServer": "Trove Database Service with SQL Server",
        "postgres": "Trove Database Service with PostgreSQL",
        "mysql": "Trove Database Service with MySQL",
        "oracle": "Bare Metal Ironic with Oracle Linux",
        "nosql": "Trove MongoDB / Cassandra"
      },
      "cache": "Trove Redis Plugin",
      "objectStorage": "Swift (Object Storage Service)",
      "queue": "Zaqar (Multi-Tenant Messaging)",
      "scheduledJobs": "Mistral (Workflow Service)",
      "gpuInstance": "Nova GPU vGPU / PCIe Passthrough",
      "hybridGateway": "Neutron Networking & BGP Dynamic Routing",
      "identity": "Keystone (Identity & Token Service)",
      "monitoring": "Ceilometer & Aodh (Telemetry & Alarming)",
      "cdn": "Barbican & External CDN",
      "security": "Barbican (Key Management)"
    },
    "pricing": {
      "computePerHourVCPU": 0.0,
      "ramPerHourGB": 0.0,
      "dbBaseMonthly": 0.0,
      "sqlServerLicenseMultiplier": 1.0,
      "objectStoragePerGBMonth": 0.0,
      "egressPerGB": 0.0,
      "cacheBaseMonthly": 0.0,
      "gpuHourlyRate": 0.0,
      "hybridGatewayMonthly": 0.0
    },
    "pros": [
      "Complete technological sovereignty: Immune to US CLOUD Act surveillance and cloud vendor lock-in",
      "Transforms hundreds of physical rack servers into an automated private AWS/Azure",
      "100% open-source software with massive telco and defense industry backing"
    ],
    "cons": [
      "Legendary operational complexity: Requires specialized full-time infrastructure engineers",
      "High upfront capital expenditure (CapEx) for physical server clusters"
    ],
    "bestFor": "Telecommunications providers (5G NFV), defense agencies, scientific research (CERN), sovereign clouds"
  },
  {
    "id": "nutanix",
    "name": "Nutanix Enterprise Cloud",
    "shortName": "Nutanix",
    "category": "Private Cloud",
    "badge": "Turnkey Enterprise Hyperconverged Cloud",
    "country": "Self-Hosted / Hybrid Multi-Cloud",
    "starterSpec": "3-Node Appliance Minimum Cluster",
    "tagline": "Turnkey enterprise hyperconverged infrastructure (HCI) with 1-click simplicity and zero downtime upgrades.",
    "description": "Nutanix delivers the public cloud operational experience inside private datacenters, eliminating complex SAN storage networks with built-in Acropolis hypervisor (AHV).",
    "costMonthlyUSD": 1600.0,
    "cost24HrUSD": 52.0,
    "freeAllowance": "Vendor test drive and evaluation cluster demos",
    "creditCardReq": "No (B2B Contract)",
    "bandwidthIncluded": "Internal HCI storage fabric",
    "capabilities": {
      "windowsWorkloads": 90,
      "sqlServerSupport": 90,
      "entraIdIntegration": 65,
      "microsoftEcosystem": 75,
      "hybridConnectivity": 95,
      "kubernetes": 88,
      "serverlessContainers": 70,
      "gpuInference": 85,
      "websocketsRealtime": 85,
      "mediaProcessing": 85,
      "relationalPostgres": 88,
      "relationalMySQL": 88,
      "oracleDatabase": 85,
      "cachingRedis": 85,
      "scheduledJobsQueues": 85,
      "developerSimplicity": 85,
      "costEfficiencyPerDollar": 70,
      "complianceCoverage": [
        "hipaa",
        "soc2",
        "pci-dss",
        "fedramp"
      ],
      "regions": [
        "on-premise",
        "hybrid-cloud"
      ]
    },
    "services": {
      "dns": "Nutanix Flow DNS",
      "loadBalancer": "Integrated Flow Virtual Networking",
      "compute": "AHV (Acropolis Hypervisor) Virtual Machines",
      "containerOrchestrator": "Nutanix Kubernetes Engine (NKE)",
      "serverless": "Nutanix Cloud Native integrations",
      "database": {
        "sqlServer": "Nutanix Database Service (NDB) for SQL Server",
        "postgres": "Nutanix Database Service (NDB) for PostgreSQL",
        "mysql": "Nutanix Database Service (NDB) for MySQL",
        "oracle": "Nutanix Database Service (NDB) for Oracle RAC",
        "nosql": "Nutanix Objects / NoSQL"
      },
      "cache": "NDB Redis deployment",
      "objectStorage": "Nutanix Objects (S3-compatible)",
      "queue": "Kafka on Nutanix",
      "scheduledJobs": "Prism Pro Automation Workflows",
      "gpuInstance": "Virtual GPU (vGPU) on Nutanix AHV",
      "hybridGateway": "Nutanix Cloud Clusters (NC2) on AWS/Azure",
      "identity": "Active Directory / Entra ID Federation",
      "monitoring": "Prism Central with Machine Learning Operations",
      "cdn": "Third-Party Edge integration",
      "security": "Flow Microsegmentation & Data-at-Rest Encryption"
    },
    "pricing": {
      "computePerHourVCPU": 0.05,
      "ramPerHourGB": 0.007,
      "dbBaseMonthly": 50.0,
      "sqlServerLicenseMultiplier": 1.5,
      "objectStoragePerGBMonth": 0.02,
      "egressPerGB": 0.0,
      "cacheBaseMonthly": 35.0,
      "gpuHourlyRate": 1.5,
      "hybridGatewayMonthly": 100.0
    },
    "pros": [
      "1-Click operational simplicity: Software, hypervisor, and firmware updates with zero application downtime",
      "Eliminates complex Fibre Channel SAN storage arrays with distributed virtual storage fabric",
      "Hybrid multi-cloud mobility: Run exact same VMs on-premise or natively in AWS/Azure (NC2)"
    ],
    "cons": [
      "High upfront capital expenditure: Commercial software licensing and hardware appliances",
      "Proprietary hyperconverged software stack"
    ],
    "bestFor": "Mid-market to large enterprises seeking a turn-key private cloud without OpenStack management complexity"
  }
];
const CLIENT_PROCUREMENT_SCENARIOS = [
  {
    "id": "scenario-a",
    "code": "Scenario A",
    "title": "Early-Stage Bootstrapped MVP",
    "idealFor": "Startups, indie hackers, pre-revenue prototypes",
    "recommendedCloud": "Hetzner Cloud / Render / DigitalOcean",
    "minBudgetUSD": 10.0,
    "maxBudgetUSD": 100.0,
    "monthlyBudgetRangeUSD": "$10 \u2013 $100 / month",
    "monthlyBudgetRangeINR": "\u20b9850 \u2013 \u20b98,500 / month",
    "strategy": "Maximize runway, leverage generous free tiers, and avoid hyperscaler managed services taxes.",
    "keyDecisions": [
      "Use Hetzner \u20ac4/mo NVMe instances or DigitalOcean $6 Droplets",
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
    "monthlyBudgetRangeUSD": "$1,000 \u2013 $15,000 / month",
    "monthlyBudgetRangeINR": "\u20b985,000 \u2013 \u20b912,50,000 / month",
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
    "monthlyBudgetRangeUSD": "$5,000 \u2013 $100,000+ / month",
    "monthlyBudgetRangeINR": "\u20b94,25,000 \u2013 \u20b985,00,000+ / month",
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
    "monthlyBudgetRangeUSD": "$50 \u2013 $3,000 / month",
    "monthlyBudgetRangeINR": "\u20b94,200 \u2013 \u20b92,55,000 / month",
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
    "monthlyBudgetRangeUSD": "$2,000 \u2013 $50,000 / month",
    "monthlyBudgetRangeINR": "\u20b91,70,000 \u2013 \u20b942,50,000 / month",
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
    "monthlyBudgetRangeINR": "\u20b90 software license fee",
    "strategy": "Migrate virtualized server estates away from Broadcom/VMware ESXi to open-source KVM hypervisors or HCI.",
    "keyDecisions": [
      "Proxmox VE cluster with Ceph distributed storage and integrated Proxmox Backup Server (PBS)",
      "Live VM migration with zero licensing cost per CPU core",
      "Hybrid connectivity to public cloud via WireGuard / IPsec VPN tunnels for cloud bursting",
      "Reclaims 70%+ of ongoing hypervisor operational licensing expenditure"
    ],
    "exitMilestone": "Complete hypervisor migration wave within 6 months ahead of VMware contract renewal."
  }
];
const CLIENT_CREDITS_DIRECTORY = [
  {
    "providerId": "azure",
    "providerName": "Microsoft Azure",
    "programName": "Microsoft for Startups Founders Hub",
    "maxCreditsUSD": 150000,
    "trialAllowance": "$200 trial credit (30 days) + 12 months free services (750h B1s compute, 64GB SSD, 5GB Blob Storage)",
    "creditCardReq": "Yes",
    "requirements": "Available to startups building software; no funding required for initial $1,000\u2013$5,000 tier; scaling to $150k with verified VC/accelerator affiliation.",
    "specialPerks": "Free GitHub Enterprise seats, Microsoft 365 Business Standard, and up to $2,500 OpenAI credits."
  },
  {
    "providerId": "aws",
    "providerName": "Amazon Web Services (AWS)",
    "programName": "AWS Activate Founders & Portfolio",
    "maxCreditsUSD": 100000,
    "trialAllowance": "Free Tier for 12 months (750h t2.micro/t3.micro, 5GB S3, 750h RDS db.t3.micro, 1M Lambda requests)",
    "creditCardReq": "Yes",
    "requirements": "Founders tier ($1,000) for bootstrapped startups; Portfolio tier ($10,000\u2013$100,000) for startups associated with approved venture funds/accelerators.",
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
    "requirements": "Hatch provides 12 months of cloud infrastructure credits ($1,000\u2013$10,000) for startups in approved partner accelerators and incubators.",
    "specialPerks": "Free technical training, priority support, and developer community marketing amplification."
  },
  {
    "providerId": "hetzner",
    "providerName": "Hetzner Cloud",
    "programName": "Hetzner Developer & Education Credits",
    "maxCreditsUSD": 500,
    "trialAllowance": "\u20ac20 new user signup promo credits with partner codes; unmetered 20 TB monthly traffic included per server",
    "creditCardReq": "Yes (or PayPal)",
    "requirements": "Developer grants available for notable open-source projects and educational initiatives upon application.",
    "specialPerks": "Lowest compute pricing in Europe (\u20ac3.79/mo for 2 vCPU, 4GB RAM) with zero vendor lock-in."
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
    "trialAllowance": "$100\u2013$250 trial credit (30 days) on signups with partner promo codes",
    "creditCardReq": "Yes",
    "requirements": "Targeted at AI startups, web3, and SaaS founders building high-scale compute infrastructure across 32+ global regions.",
    "specialPerks": "Extensive fractional NVIDIA GPU availability (A100, L40S, GH200) with global BGP peering."
  },
  {
    "providerId": "ovhcloud",
    "providerName": "OVHcloud",
    "programName": "OVHcloud Startup Program",
    "maxCreditsUSD": 100000,
    "trialAllowance": "\u20ac200 public cloud trial voucher",
    "creditCardReq": "Yes",
    "requirements": "Fast-Track tier (\u20ac10,000 credits) and Scale tier (up to \u20ac100,000 credits) for European startups prioritizing data sovereignty.",
    "specialPerks": "100% GDPR European data sovereignty with zero US CLOUD Act jurisdiction."
  },
  {
    "providerId": "alibaba",
    "providerName": "Alibaba Cloud",
    "programName": "Alibaba Cloud Startup Accelerator",
    "maxCreditsUSD": 50000,
    "trialAllowance": "$300\u2013$1,200 Free Trial credit packages for enterprise and developer accounts",
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
    "requirements": "Early Stage provides \u20ac3,600 in credits for 6 months; Growth Stage provides up to \u20ac36,000 for venture-backed teams.",
    "specialPerks": "Paris and Amsterdam green datacenters (zero air conditioning, 100% renewable energy)."
  },
  {
    "providerId": "render",
    "providerName": "Render",
    "programName": "Render for Startups",
    "maxCreditsUSD": 5000,
    "trialAllowance": "Generous free tier: Free Static Sites, Free Web Services (750 hrs/mo), and Free PostgreSQL for 90 days",
    "creditCardReq": "No (for free tier)",
    "requirements": "Startup accelerator affiliation (Y Combinator, Techstars, etc.) provides $1,000\u2013$5,000 in hosting credits.",
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
];

const USD_TO_INR_RATE = 86.50;

function parseCurrencyAmountClient(text) {
  if (!text) return null;
  const clean = text.replace(/\u00a0/g, ' ');

  // 1. ₹ / INR e.g. ₹15,00,000 or ₹8,00,000 or ₹1500000 or 15 Lakhs
  const mInrLakh = clean.match(/(?:(?:rs\.?|inr|₹)\s*([0-9,.]+)\s*(?:lakhs?|lacs?|l)|([0-9,.]+)\s*(?:lakhs?|lacs?|l)\s*(?:inr|rs\.?|₹)?)/i);
  if (mInrLakh) {
    const num = parseFloat((mInrLakh[1] || mInrLakh[2]).replace(/,/g, ''));
    if (!isNaN(num)) return { amount: num * 100000, currency: "INR", amountUSD: (num * 100000) / USD_TO_INR_RATE };
  }

  const mInrCrore = clean.match(/(?:(?:rs\.?|inr|₹)\s*([0-9,.]+)\s*(?:crores?|cr)|([0-9,.]+)\s*(?:crores?|cr)\s*(?:inr|rs\.?|₹)?)/i);
  if (mInrCrore) {
    const num = parseFloat((mInrCrore[1] || mInrCrore[2]).replace(/,/g, ''));
    if (!isNaN(num)) return { amount: num * 10000000, currency: "INR", amountUSD: (num * 10000000) / USD_TO_INR_RATE };
  }

  const mInrDirect = clean.match(/(?:(?:rs\.?|inr|₹)\s*([0-9,]{3,}))/i);
  if (mInrDirect) {
    const num = parseFloat(mInrDirect[1].replace(/,/g, ''));
    if (!isNaN(num) && num > 500) return { amount: num, currency: "INR", amountUSD: num / USD_TO_INR_RATE };
  }

  // 2. $ / USD e.g. $10,000
  const mUsd = clean.match(/(?:\$\s*([0-9,.]+)|([0-9,.]+)\s*(?:usd|dollars?))/i);
  if (mUsd) {
    const num = parseFloat((mUsd[1] || mUsd[2]).replace(/,/g, ''));
    if (!isNaN(num) && num > 10) return { amount: num, currency: "USD", amountUSD: num };
  }

  return null;
}

function parseDAUClient(text) {
  if (!text) return null;
  const clean = text.replace(/\u00a0/g, ' ');

  const mK = clean.match(/([0-9,.]+)\s*[kK](?:\s*(?:daily active users|dau|users|employees|active users|students))?/i);
  if (mK) {
    const num = parseFloat(mK[1].replace(/,/g, ''));
    if (!isNaN(num)) return Math.round(num * 1000);
  }

  const mM = clean.match(/([0-9,.]+)\s*[mM](?:\s*(?:daily active users|dau|users|employees|active users|students))?/i);
  if (mM) {
    const num = parseFloat(mM[1].replace(/,/g, ''));
    if (!isNaN(num)) return Math.round(num * 1000000);
  }

  const mLabeled = clean.match(/(?:serving|serves|for|around|approx(?:imately)?|with|has)?\s*([0-9,]{4,})\s*(?:daily active users|daily active employees|daily active students|dau|active employees|active users|employees|users|students)/i);
  if (mLabeled) {
    const num = parseInt(mLabeled[1].replace(/,/g, ''), 10);
    if (!isNaN(num)) return num;
  }

  return null;
}

function parseTrafficSurgeClient(text) {
  if (!text) return 1;
  const clean = text.replace(/\u00a0/g, ' ');

  const mSurgeTo = clean.match(/(?:traffic\s+can\s+surge|surge\s+up|surge)\s+(?:to|up\s+to|by|of)?\s*([0-9]+)\s*[\u00d7xX]?/i);
  if (mSurgeTo) {
    const v = parseInt(mSurgeTo[1], 10);
    if (v >= 1 && v <= 50) return Math.min(10, Math.max(1, v));
  }

  const mDirect = clean.match(/([0-9]+)\s*[\u00d7xX](?:\s*(?:traffic\s+surge|surge|spike|peak|load))?/i);
  if (mDirect) {
    const v = parseInt(mDirect[1], 10);
    if (v >= 1 && v <= 50) return Math.min(10, Math.max(1, v));
  }

  return 1;
}

function parseRegionClient(text) {
  if (!text) return "Global / Multi-Region";
  if (/\b(india|mumbai|delhi|hyderabad|bengaluru|bangalore)\b/i.test(text)) {
    return "India (ap-south-1 / Central India)";
  }
  if (/\b(germany|frankfurt|europe|eu|finland|ireland|london|uk)\b/i.test(text)) {
    return "Europe (eu-central / Frankfurt)";
  }
  if (/\b(us-east|virginia|us-west|oregon|california|united states|usa)\b/i.test(text)) {
    return "US East / North America";
  }
  if (/\b(singapore|tokyo|japan|australia|sydney|apac|asia)\b/i.test(text)) {
    return "Asia Pacific (Singapore/Tokyo)";
  }
  return "Global / Multi-Region";
}

function extractNegatedTermsClient(text) {
  const negatedMatches = new Set();
  const sentences = text.split(/[\n\.]+/);

  for (const s of sentences) {
    const parts = s.split(/\b(?:but|however|although|whereas)\b/i);
    for (const p of parts) {
      const trimmed = p.trim();
      // Prefix negation: no ..., without ..., does not require ...
      const mPre = trimmed.match(/\b(?:no|without|zero|neither|does\s+not\s+(?:require|need|use)|doesn't\s+(?:require|need|use)|not\s+requiring)\s+(.+)/i);
      if (mPre) {
        let clause = mPre[1].replace(/\s+(?:are|is)?\s*(?:not\s+required|not\s+needed|required|needed|disabled|unnecessary).*$/i, '');
        clause.split(/[,/]|(?:\s+(?:and|or|nor)\s+)/i).forEach(item => {
          const it = item.trim().toLowerCase();
          if (it) negatedMatches.add(it);
        });
        continue;
      }

      // Suffix negation: ... is not required / ... is not
      let mSuf = trimmed.match(/(.+?)\s+(?:are|is)\s+(?:not\s+required|not\s+needed|not\s+used|not\s+supported|unnecessary|disabled)/i);
      if (!mSuf) mSuf = trimmed.match(/(.+?)\s+(?:not\s+required|not\s+needed)/i);
      if (!mSuf) mSuf = trimmed.match(/(.+?)\s+(?:is|are)\s+not(?:\s+(?:required|needed|used|supported|necessary|wanted))?[\.,;]?$/i);

      if (mSuf) {
        const clause = mSuf[1];
        clause.split(/[,/]|(?:\s+(?:and|or|nor)\s+)/i).forEach(item => {
          const it = item.trim().toLowerCase();
          if (it) negatedMatches.add(it);
        });
      }
    }
  }

  return Array.from(negatedMatches);
}

function isCapabilityNegatedClient(kws, negatedList) {
  for (const clause of negatedList) {
    for (const kw of kws) {
      const re = new RegExp('\\b' + kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b', 'i');
      if (re.test(clause)) return true;
    }
  }
  return false;
}

function parseWorkloadRequirementsClient(prompt, overrides = {}) {
  const cleanPrompt = (prompt || "").trim();
  const negatedClauses = extractNegatedTermsClient(cleanPrompt);
  const extractedKeywords = [];
  const negatedCapabilities = [];

  // Budget
  let monthlyBudget = 100000;
  let budgetCurrency = "INR";
  let monthlyBudgetUSD = monthlyBudget / USD_TO_INR_RATE;

  if (overrides.overrideBudget && overrides.overrideBudget > 0) {
    monthlyBudget = parseFloat(overrides.overrideBudget);
    budgetCurrency = monthlyBudget > 10000 ? "INR" : "USD";
    monthlyBudgetUSD = budgetCurrency === "INR" ? monthlyBudget / USD_TO_INR_RATE : monthlyBudget;
  } else {
    const parsedB = parseCurrencyAmountClient(cleanPrompt);
    if (parsedB) {
      monthlyBudget = parsedB.amount;
      budgetCurrency = parsedB.currency;
      monthlyBudgetUSD = parsedB.amountUSD;
    }
  }

  // DAU
  let dau = overrides.overrideDAU && overrides.overrideDAU > 0 ? overrides.overrideDAU : parseDAUClient(cleanPrompt);
  if (!dau) dau = 25000;

  // Surge
  let surge = overrides.overrideSurge && overrides.overrideSurge > 0 ? overrides.overrideSurge : parseTrafficSurgeClient(cleanPrompt);
  if (!surge) surge = 1;

  // Region
  let region = overrides.overrideRegion && overrides.overrideRegion !== "auto" ? overrides.overrideRegion : parseRegionClient(cleanPrompt);

  // GPU
  const gpuKws = ["gpu", "gpus", "machine learning", "ml", "deep learning", "model inference", "llm", "ai platform", "vertex", "tensor", "pytorch"];
  const gpuNeg = isCapabilityNegatedClient(gpuKws, negatedClauses);
  const gpuPos = gpuKws.some(kw => new RegExp('\\b' + kw + '\\b', 'i').test(cleanPrompt));
  const gpuRequired = gpuPos && !gpuNeg;
  if (gpuNeg) negatedCapabilities.push("GPU / Model Inference");
  else if (gpuRequired) extractedKeywords.push("GPU Acceleration");

  // WebSockets
  const wsKws = ["websocket", "websockets", "live", "real-time", "realtime", "socket.io", "bidirectional", "live chat"];
  const wsNeg = isCapabilityNegatedClient(wsKws, negatedClauses);
  const wsPos = wsKws.some(kw => new RegExp('\\b' + kw + '\\b', 'i').test(cleanPrompt));
  const wsRequired = wsPos && !wsNeg;
  if (wsNeg) negatedCapabilities.push("WebSockets / Live Streaming");
  else if (wsRequired) extractedKeywords.push("WebSockets");

  // Media
  const mediaKws = ["media", "video", "videos", "video processing", "transcoding", "media uploads", "audio", "image processing", "ffmpeg"];
  const mediaNeg = isCapabilityNegatedClient(mediaKws, negatedClauses);
  const mediaPos = mediaKws.some(kw => new RegExp('\\b' + kw + '\\b', 'i').test(cleanPrompt));
  const mediaRequired = mediaPos && !mediaNeg;
  if (mediaNeg) negatedCapabilities.push("Media / Video Processing");
  else if (mediaRequired) extractedKeywords.push("Media Processing");

  // Scheduled Jobs / Workers
  const jobsKws = ["cron", "scheduled jobs", "scheduled tasks", "background workers", "batch processing", "report generation"];
  const jobsNeg = isCapabilityNegatedClient(jobsKws, negatedClauses);
  const jobsPos = jobsKws.some(kw => new RegExp('\\b' + kw + '\\b', 'i').test(cleanPrompt)) || /\b(?:scheduled|recurring|nightly|periodic)\s+\w+\s+(?:jobs|tasks|reports|runs|workers)\b/i.test(cleanPrompt);
  const jobsRequired = jobsPos && !jobsNeg;
  if (jobsNeg) negatedCapabilities.push("Scheduled Jobs / Background Workers");
  else if (jobsRequired) extractedKeywords.push("Scheduled Jobs / Workers");

  // Database
  let dbType = "sql-postgres";
  if (/\b(sql server|mssql|t-sql|azure sql)\b/i.test(cleanPrompt)) {
    dbType = "sql-server";
    extractedKeywords.push("SQL Server");
  } else if (/\b(oracle database|oracle db|autonomous database|exadata)\b/i.test(cleanPrompt)) {
    dbType = "oracle-db";
    extractedKeywords.push("Oracle Database");
  } else if (/\b(postgres|postgresql|timescaledb|alloydb)\b/i.test(cleanPrompt)) {
    dbType = "sql-postgres";
    extractedKeywords.push("PostgreSQL");
  } else if (/\b(mysql|mariadb|heatwave)\b/i.test(cleanPrompt)) {
    dbType = "sql-mysql";
    extractedKeywords.push("MySQL");
  } else if (/\b(mongodb|dynamodb|cosmosdb|firestore|nosql)\b/i.test(cleanPrompt)) {
    dbType = "nosql-document";
    extractedKeywords.push("NoSQL Document DB");
  }

  // Ecosystems
  const isMicrosoft = /\b(microsoft 365|m365|office 365|o365|microsoft entra id|entra id|azure ad|active directory|power bi|teams|windows server|sql server)\b/i.test(cleanPrompt);
  const isAWS = /\b(dynamodb|aurora|redshift|s3|sqs|lambda|fargate|ecs|cloudformation|aws)\b/i.test(cleanPrompt) && !isMicrosoft;
  const isGCP = /\b(bigquery|spanner|vertex ai|cloud run|cloud spanner|gcp|google cloud)\b/i.test(cleanPrompt) && !isMicrosoft;
  const isOracleEco = /\b(oracle ebs|oracle financials|peoplesoft|siebel|exadata|autonomous database)\b/i.test(cleanPrompt);

  // Sizing
  const avgRPS = Math.max(1, Math.round(dau / 7200));
  const peakRPS = Math.round(avgRPS * surge);
  const egressGB = mediaRequired ? Math.round((dau * 15 * 30) / 1000) : Math.round((dau * 0.5 * 30) / 1000);
  const storageGB = mediaRequired ? Math.round((dau * 300) / 1000) : Math.round((dau * 10) / 1000);

  return {
    status: "parsed",
    rawPrompt: cleanPrompt,
    dailyActiveUsers: dau,
    monthlyBudget: monthlyBudget,
    budgetCurrency: budgetCurrency,
    monthlyBudgetUSD: Math.round(monthlyBudgetUSD * 100) / 100,
    region: region,
    trafficSurge: surge,
    database: {
      required: true,
      type: dbType,
      highAvailability: true
    },
    cache: {
      required: dau >= 40000,
      type: "redis"
    },
    objectStorage: {
      required: mediaRequired || dau >= 20000,
      volumeGB: storageGB,
      basis: mediaRequired ? `Media uploads & archives for ${dau.toLocaleString()} DAU` : `Document & profile storage for ${dau.toLocaleString()} DAU`
    },
    websockets: {
      required: wsRequired,
      concurrency: wsRequired ? Math.round(peakRPS * 15) : 0
    },
    mediaProcessing: {
      required: mediaRequired,
      videoTranscoding: mediaRequired
    },
    gpuInference: {
      required: gpuRequired,
      workloadType: gpuRequired ? "model-inference" : "none"
    },
    scheduledJobs: {
      required: jobsRequired,
      frequency: jobsRequired ? "periodic" : "none"
    },
    backgroundWorkers: {
      required: jobsRequired || mediaRequired,
      queueType: "cloud-queue"
    },
    operatingSystem: isMicrosoft ? "windows" : "linux",
    microsoftEcosystem: isMicrosoft,
    awsEcosystem: isAWS,
    gcpEcosystem: isGCP,
    oracleEcosystem: isOracleEco,
    ibmEcosystem: false,
    multiRegion: /\b(multi-region|disaster recovery|dr region|separate region)\b/i.test(cleanPrompt),
    hybridConnectivity: /\b(hybrid|on-premises|datacenter cross-connect|expressroute|directconnect)\b/i.test(cleanPrompt),
    kubernetes: /\b(kubernetes|k8s|doks|gke|eks|aks)\b/i.test(cleanPrompt),
    serverless: /\b(serverless|lambda|cloud functions|cloud run)\b/i.test(cleanPrompt),
    highAvailability: true,
    compliance: /\b(gdpr)\b/i.test(cleanPrompt) ? ["gdpr"] : (/\b(hipaa)\b/i.test(cleanPrompt) ? ["hipaa"] : []),
    sizing: {
      avgRPS: avgRPS,
      peakRPS: peakRPS,
      estimatedBandwidthGBMonth: egressGB,
      bandwidthBasis: mediaRequired ? `Media/video delivery (~15 MB/user/day) × ${dau.toLocaleString()} DAU` : `Transactional APIs (~40 KB/req) for ${dau.toLocaleString()} DAU`,
      estimatedStorageGB: storageGB,
      storageBasis: mediaRequired ? `Media & asset uploads for ${dau.toLocaleString()} DAU` : `User document storage for ${dau.toLocaleString()} DAU`
    },
    extractedKeywords: extractedKeywords,
    negatedCapabilities: negatedCapabilities
  };
}

function evaluateAllProvidersClient(workload) {
  const scoredProviders = CLIENT_CLOUD_PROVIDERS.map(p => {
    let totalScore = 0;
    const matchedRequirements = [];
    const unmatchedRequirements = [];
    const strengths = [];
    const weaknesses = [];
    const breakdown = [];

    // Cat 1: Ecosystem Alignment (30 pts)
    let cat1 = 15;
    if (workload.microsoftEcosystem) {
      if (p.id === "azure") {
        cat1 = 30;
        matchedRequirements.push("Native Microsoft Entra ID & Active Directory integration");
        matchedRequirements.push("First-class Windows Server licensing & hybrid benefits");
        strengths.push("Deep enterprise Microsoft 365, Power BI, and SQL Server synergy");
      } else if (p.id === "aws") {
        cat1 = 20;
      } else {
        cat1 = 8;
        unmatchedRequirements.push("No native Entra ID/Windows Active Directory support");
      }
    } else if (workload.oracleEcosystem) {
      if (p.id === "oci") cat1 = 30; else cat1 = 12;
    } else if (workload.awsEcosystem) {
      if (p.id === "aws") cat1 = 30; else cat1 = 15;
    } else if (workload.gcpEcosystem) {
      if (p.id === "gcp") cat1 = 30; else cat1 = 15;
    } else {
      // Generic Linux SaaS / Open-Source Stack
      if (["digitalocean", "hetzner", "linode", "vultr"].includes(p.id)) {
        cat1 = 28;
        matchedRequirements.push("Developer-friendly Linux infrastructure");
        strengths.push("High developer velocity with minimal configuration friction");
      } else if (["aws", "azure", "gcp"].includes(p.id)) {
        cat1 = 24;
      } else {
        cat1 = 20;
      }
    }
    totalScore += cat1;
    breakdown.push({ category: "Ecosystem Alignment", points: cat1, maxPoints: 30 });

    // Cat 2: Technical Capabilities (25 pts)
    let cat2 = 18;
    // Database
    if (workload.database.type === "sql-postgres") {
      if (["digitalocean", "aws", "gcp", "azure", "hetzner", "render", "railway"].includes(p.id)) cat2 += 2;
    }
    // WebSockets
    if (workload.websockets.required) {
      if (["flyio", "render", "digitalocean", "aws"].includes(p.id)) {
        matchedRequirements.push("Persistent WebSocket container support");
        cat2 += 2;
      }
    }
    // Media / Video
    if (workload.mediaProcessing.required) {
      cat2 += 1;
    }
    cat2 = Math.min(25, cat2);
    totalScore += cat2;
    breakdown.push({ category: "Technical Capabilities", points: cat2, maxPoints: 25 });

    // Cat 3: Hybrid & Connectivity (15 pts)
    let cat3 = 12;
    if (workload.hybridConnectivity) {
      if (["azure", "aws", "gcp", "oci"].includes(p.id)) {
        cat3 = 15;
        matchedRequirements.push("Dedicated private hybrid datacenter link (ExpressRoute/DirectConnect)");
      } else {
        cat3 = 4;
        unmatchedRequirements.push("Lacks dedicated enterprise private circuits");
      }
    } else {
      cat3 = 14;
    }
    totalScore += cat3;
    breakdown.push({ category: "Hybrid & Connectivity", points: cat3, maxPoints: 15 });

    // Cat 4: Cost & Budget (20 pts)
    // Sizing cost calculation
    const pricing = p.pricing || {};
    const vcpuRate = pricing.computePerVCPUHour || 0.045;
    const egressRate = pricing.bandwidthPerGB || 0.08;
    const storageRate = pricing.objectStoragePerGBMonth || 0.02;

    const computeCost = Math.round((workload.sizing.peakRPS / 75) * vcpuRate * 730 * 100) / 100;
    const egressCost = Math.round(workload.sizing.estimatedBandwidthGBMonth * egressRate * 100) / 100;
    const storageCost = Math.round(workload.sizing.estimatedStorageGB * storageRate * 100) / 100;
    const dbCost = workload.database.type === "sql-server" ? 540 : 95;
    const cacheCost = workload.cache.required ? 35 : 0;
    const workerCost = workload.backgroundWorkers.required ? 20 : 0;

    const monthlyCostUSD = Math.round((computeCost + egressCost + storageCost + dbCost + cacheCost + workerCost) * 100) / 100;
    const monthlyCostINR = Math.round(monthlyCostUSD * USD_TO_INR_RATE * 100) / 100;

    let cat4 = 15;
    if (monthlyCostUSD <= workload.monthlyBudgetUSD) {
      cat4 = 19;
      matchedRequirements.push("Comfortably within monthly budget limit");
    } else if (monthlyCostUSD <= workload.monthlyBudgetUSD * 1.25) {
      cat4 = 14;
    } else {
      cat4 = 7;
      weaknesses.push(`Projected infrastructure cost ($${monthlyCostUSD.toLocaleString()}/mo) exceeds budget`);
    }
    totalScore += cat4;
    breakdown.push({ category: "Cost & Budget", points: cat4, maxPoints: 20 });

    // Cat 5: Regional Presence & Compliance (10 pts)
    let cat5 = 8;
    if (/india/i.test(workload.region)) {
      if (["aws", "azure", "gcp", "digitalocean", "linode", "oracle", "oci"].includes(p.id)) {
        cat5 = 10;
        matchedRequirements.push(`${p.name} India datacenter region`);
      } else {
        cat5 = 5;
      }
    }
    totalScore += cat5;
    breakdown.push({ category: "Regional & Compliance", points: cat5, maxPoints: 10 });

    // Cost Drivers
    const costDrivers = [
      { name: "Object Storage & Media", costUSD: storageCost, costINR: Math.round(storageCost * USD_TO_INR_RATE), percentage: Math.round((storageCost / monthlyCostUSD) * 100), details: `${workload.sizing.estimatedStorageGB.toLocaleString()} GB capacity` },
      { name: "Outbound Egress Bandwidth", costUSD: egressCost, costINR: Math.round(egressCost * USD_TO_INR_RATE), percentage: Math.round((egressCost / monthlyCostUSD) * 100), details: `${workload.sizing.estimatedBandwidthGBMonth.toLocaleString()} GB egress/mo` },
      { name: "Core Application Compute", costUSD: computeCost, costINR: Math.round(computeCost * USD_TO_INR_RATE), percentage: Math.round((computeCost / monthlyCostUSD) * 100), details: `${Math.max(2, Math.round(workload.sizing.peakRPS / 75))} vCPU cluster` },
      { name: "Database Cluster", costUSD: dbCost, costINR: Math.round(dbCost * USD_TO_INR_RATE), percentage: Math.round((dbCost / monthlyCostUSD) * 100), details: `${workload.database.type.toUpperCase()} (Multi-AZ HA)` }
    ];

    return {
      providerId: p.id,
      providerName: p.name,
      badge: p.badge,
      totalScore: Math.min(100, Math.max(10, totalScore)),
      provider: p,
      costData: {
        monthlyUSD: monthlyCostUSD,
        monthlyINR: monthlyCostINR,
        dailyUSD: Math.round((monthlyCostUSD / 30.4) * 100) / 100,
        dailyINR: Math.round((monthlyCostINR / 30.4) * 100) / 100,
        rangeMinUSD: Math.round(monthlyCostUSD * 0.85),
        rangeMaxUSD: Math.round(monthlyCostUSD * 1.25),
        costDrivers: costDrivers
      },
      breakdown: breakdown,
      matchedRequirements: matchedRequirements,
      unmatchedRequirements: unmatchedRequirements,
      strengths: strengths.length ? strengths : [`Solid overall capability match for ${p.category}`],
      weaknesses: weaknesses,
      scores: {
        ecosystem: cat1,
        capabilities: cat2,
        hybrid: cat3,
        cost: cat4,
        regional: cat5
      }
    };
  });

  scoredProviders.sort((a, b) => b.totalScore - a.totalScore);
  const ranking = scoredProviders.map((p, idx) => ({
    ...p,
    rank: idx + 1
  }));

  const recommended = ranking[0];
  const runnerUp = ranking[1] || ranking[0];
  const gap = recommended.totalScore - runnerUp.totalScore;
  const confidence = Math.min(99, Math.max(50, Math.round(50 + gap * 4.5)));

  return {
    recommended: recommended,
    runnerUp: runnerUp,
    confidence: confidence,
    ranking: ranking
  };
}

function generateArchitectureNodesClient(workload, provider) {
  const services = provider.services || {};
  const nodes = [];

  // Stage 1: Client Users
  nodes.push({
    tier: "tier-users",
    service: `Corporate Users (${workload.dailyActiveUsers.toLocaleString()} DAU (${workload.trafficSurge}× Peak Surge))`,
    name: "Client Traffic & Endpoints",
    category: "Edge",
    purpose: "Student web browsers, mobile apps, and interactive WebSocket classroom clients.",
    configuration: `${workload.sizing.peakRPS} Peak RPS capacity`
  });

  // Stage 2: DNS & Load Balancer
  nodes.push({
    tier: "tier-ingress",
    service: services.loadBalancer || "Global Load Balancer & Edge Proxy",
    name: "Traffic Ingress & Load Balancing",
    category: "Networking",
    purpose: "SSL/TLS offloading, Anycast path routing, and automatic load distribution.",
    configuration: "Multi-AZ redundant routing"
  });

  // Stage 3: Compute
  nodes.push({
    tier: "tier-compute",
    service: services.compute || "Application Compute Tier",
    name: "Application Runtime",
    category: "Compute",
    purpose: "Autoscaling container or VM instances executing backend APIs and WebSocket handlers.",
    configuration: "Horizontally scalable cluster"
  });

  // Stage 4: Cache
  if (workload.cache.required) {
    nodes.push({
      tier: "tier-cache",
      service: services.cache || "Managed Redis Cache",
      name: "In-Memory Session & State Cache",
      category: "Cache",
      purpose: "Sub-millisecond latency distributed memory store for user sessions and state sync.",
      configuration: "In-Memory Key-Value Cluster"
    });
  }

  // Stage 5: Database
  const dbService = (typeof services.database === "object")
    ? (services.database.postgres || services.database.sqlServer || services.database.mysql || "Managed Relational Database")
    : (services.database || "Managed Relational Database");

  nodes.push({
    tier: "tier-database",
    service: dbService,
    name: `${workload.database.type.toUpperCase()} Database Tier`,
    category: "Database",
    purpose: "Primary ACID relational data store for user profiles, courses, quizzes, and progress.",
    configuration: "Multi-AZ High Availability with automated daily snapshots"
  });

  // Stage 6: Workers
  if (workload.backgroundWorkers.required || workload.scheduledJobs.required) {
    nodes.push({
      tier: "tier-workers",
      service: services.serverless || "Async Job Workers & Task Queue",
      name: "Background Worker Pipeline",
      category: "Serverless / Workers",
      purpose: "Asynchronous task queue executing background jobs, notifications, and scheduled reports.",
      configuration: "Event-driven autoscaling queue"
    });
  }

  // Stage 7: Object Storage
  if (workload.objectStorage.required) {
    nodes.push({
      tier: "tier-storage",
      service: services.objectStorage || "Managed Object Storage (S3 API)",
      name: "Document & Media Storage",
      category: "Storage",
      purpose: "Durable, encrypted cloud bucket storage for large video files, assignments, and media.",
      configuration: `${workload.sizing.estimatedStorageGB.toLocaleString()} GB capacity`
    });
  }

  return nodes;
}

function evaluateWorkloadClientSide(promptText, overrides = {}) {
  const workload = parseWorkloadRequirementsClient(promptText, overrides);
  const evalResult = evaluateAllProvidersClient(workload);
  const rec = evalResult.recommended;
  const runner = evalResult.runnerUp;
  const ranking = evalResult.ranking;

  const nodes = generateArchitectureNodesClient(workload, rec.provider);

  // IaC Templates
  const iac = {
    terraform: `# Terraform configuration for ${rec.providerName}\nprovider "${rec.providerId}" {\n  region = "${workload.region.toLowerCase().includes('india') ? 'ap-south-1' : 'us-east-1'}"\n}\n\nresource "cloud_app" "platform" {\n  name        = "elearning-platform"\n  environment = "production"\n  instances   = ${Math.max(2, Math.round(workload.sizing.peakRPS / 75))}\n}`,
    dockerfile: `FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\nCOPY . .\nEXPOSE 3000\nCMD ["npm", "start"]`,
    dockerCompose: `version: "3.8"\nservices:\n  api:\n    build: .\n    ports: ["3000:3000"]\n    environment:\n      - DB_TYPE=${workload.database.type}\n  cache:\n    image: redis:alpine`,
    cloudInit: `#cloud-config\npackage_upgrade: true\npackages:\n  - docker.io\n  - curl`
  };

  const flaws = [
    {
      title: "Connection Pool Exhaustion Under Surge",
      severity: "HIGH",
      description: `With a ${workload.trafficSurge}× peak traffic surge, direct client connections can overwhelm PostgreSQL pool limits.`,
      remediation: "Deploy PgBouncer connection pooling and enable read-replicas for quiz/progress queries."
    },
    {
      title: "Egress Bandwidth Cost Spillover",
      severity: "MEDIUM",
      description: `Serving media content directly from object storage can incur high per-GB egress surcharges during major launches.`,
      remediation: "Place a global CDN cache in front of object storage with aggressive cache-control headers."
    }
  ];

  const billingTraps = [
    {
      name: "Outbound Cross-Region Data Transfer",
      category: "Network Bandwidth",
      monthlyCostEstimate: "Variable per surge",
      annualRisk: "Up to 30% of total invoice",
      trapMechanism: "Transcoding video across regions or egressing raw media outside the cloud network.",
      mitigation: "Colocate transcoding workers in the same datacenter region as the primary storage bucket."
    }
  ];

  const tradeoffs = [
    {
      dimension: "Compute Platform",
      selected: "Container / Droplet Tier",
      tradeoffReason: "Provides predictable flat-rate hourly billing instead of unpredictable serverless execution invocation spikes during 6× surges."
    },
    {
      dimension: "Database Engine",
      selected: "Managed PostgreSQL",
      tradeoffReason: "Strong ACID compliance, JSONB support for quiz data, and zero vendor lock-in compared to proprietary document databases."
    }
  ];

  return {
    status: "results",
    workload: workload,
    recommended: {
      id: rec.providerId,
      name: rec.providerName,
      badge: rec.badge,
      score: rec.totalScore,
      category: rec.provider.category,
      tagline: rec.provider.tagline,
      description: rec.provider.description,
      cost: rec.costData,
      cost24HrUSD: rec.costData.dailyUSD,
      cost24HrINR: rec.costData.dailyINR,
      freeAllowance: rec.provider.freeAllowance || "",
      bandwidthIncluded: rec.provider.bandwidthIncluded || "",
      starterSpec: rec.provider.starterSpec || "",
      breakdown: rec.breakdown,
      matchedRequirements: rec.matchedRequirements,
      unmatchedRequirements: rec.unmatchedRequirements,
      strengths: rec.strengths,
      weaknesses: rec.weaknesses,
      pros: rec.provider.pros || [],
      cons: rec.provider.cons || [],
      services: rec.provider.services || {}
    },
    runnerUp: {
      id: runner.providerId,
      name: runner.providerName,
      score: runner.totalScore,
      costMonthlyUSD: runner.costData.monthlyUSD,
      costMonthlyINR: runner.costData.monthlyINR
    },
    confidence: evalResult.confidence,
    ranking: ranking.map(p => ({
      rank: p.rank,
      id: p.providerId,
      name: p.providerName,
      badge: p.badge,
      category: p.provider.category,
      score: p.totalScore,
      monthlyCostUSD: p.costData.monthlyUSD,
      monthlyCostINR: p.costData.monthlyINR,
      matchedCount: p.matchedRequirements.length,
      unmatchedCount: p.unmatchedRequirements.length,
      matchedRequirements: p.matchedRequirements.slice(0, 3),
      strengths: p.strengths.slice(0, 2),
      weaknesses: p.weaknesses.slice(0, 2),
      scores: p.scores
    })),
    architecture: {
      nodes: nodes,
      nodeCount: nodes.length,
      tierSummary: `${nodes.length} Active Architectural Stages`
    },
    flaws: flaws,
    billingTraps: billingTraps,
    serviceTradeoffs: tradeoffs,
    procurementScenarios: CLIENT_PROCUREMENT_SCENARIOS,
    explanation: `Deterministic multi-cloud analysis recommends ${rec.providerName} (${rec.totalScore}/100) based on workload requirements, predictable pricing, and native PostgreSQL support.`,
    iac: iac,
    debug: {
      rawPrompt: promptText,
      source: "client_side_engine",
      confidenceMath: {
        topScore: rec.totalScore,
        runnerUpScore: runner.totalScore,
        scoreGap: rec.totalScore - runner.totalScore,
        confidencePercent: evalResult.confidence
      }
    }
  };
}

// Export to window if in browser
if (typeof window !== "undefined") {
  window.CLIENT_CLOUD_PROVIDERS = CLIENT_CLOUD_PROVIDERS;
  window.CLIENT_PROCUREMENT_SCENARIOS = CLIENT_PROCUREMENT_SCENARIOS;
  window.CLIENT_CREDITS_DIRECTORY = CLIENT_CREDITS_DIRECTORY;
  window.evaluateWorkloadClientSide = evaluateWorkloadClientSide;
}
