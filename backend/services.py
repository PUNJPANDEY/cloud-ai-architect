"""
Cloud AI Architect V2 — Master Canonical Services Catalog
Normalizes, canonicalizes, and validates every cloud service across all 17 supported providers.

Canonical Service Contract:
{
    "id": str,               # Unique canonical service ID (e.g. "azure-compute", "aws-rds-sqlserver")
    "name": str,             # Real official service name (e.g. "Azure Virtual Machines & Container Apps")
    "providerId": str,       # Canonical provider slug (e.g. "azure", "aws", "gcp")
    "providerName": str,     # Real provider display name (e.g. "Microsoft Azure")
    "category": str,         # Standardized category matching UI filters: compute, database, storage, kubernetes, serverless, ai_gpu, networking, security, cache
    "categoryLabel": str,    # Clean display label (e.g. "Compute", "Database", "Networking")
    "description": str,      # Detailed, accurate technical description of what the service does
    "capabilities": List[str]# Extracted capability tags for search and workload matching
}
"""

from typing import Dict, Any, List, Optional
from backend.providers import CLOUD_PROVIDERS

# Standard Category Mapping from raw provider keys to canonical UI categories
CATEGORY_MAP: Dict[str, Dict[str, str]] = {
    "compute": {"category": "compute", "label": "Compute"},
    "containerOrchestrator": {"category": "kubernetes", "label": "Kubernetes"},
    "serverless": {"category": "serverless", "label": "Serverless"},
    "objectStorage": {"category": "storage", "label": "Storage"},
    "dns": {"category": "networking", "label": "Networking"},
    "loadBalancer": {"category": "networking", "label": "Networking"},
    "hybridGateway": {"category": "networking", "label": "Networking"},
    "cdn": {"category": "networking", "label": "Networking"},
    "cache": {"category": "database", "label": "In-Memory Cache"},
    "queue": {"category": "serverless", "label": "Messaging & Queue"},
    "scheduledJobs": {"category": "serverless", "label": "Scheduled Jobs"},
    "gpuInstance": {"category": "ai_gpu", "label": "AI & GPU"},
    "identity": {"category": "security", "label": "Identity & Security"},
    "security": {"category": "security", "label": "Cloud Security"},
    "monitoring": {"category": "security", "label": "Observability & Monitoring"}
}

# Provider-tailored service descriptions
SERVICE_DESCRIPTIONS: Dict[str, Dict[str, str]] = {
    "azure": {
        "dns": "Azure DNS and Traffic Manager provide ultra-reliable global Anycast DNS hosting with automatic latency-based traffic routing and failover.",
        "loadBalancer": "Azure Application Gateway with WAF v2 delivers Layer 7 application routing, automated SSL/TLS offloading, and OWASP-compliant packet inspection.",
        "compute": "Azure Virtual Machines and Container Apps deliver enterprise compute capacity optimized for Windows Server 2022 Datacenter and Linux runtimes.",
        "containerOrchestrator": "Azure Kubernetes Service (AKS) simplifies managed Kubernetes deployments with native Entra ID integration and auto-repairing node pools.",
        "serverless": "Azure Functions (v4 Isolated) provides event-driven serverless execution with dedicated process isolation and enterprise VNet integration.",
        "cache": "Azure Cache for Redis Enterprise delivers fully managed, ultra-low latency in-memory data caching with active geo-replication.",
        "objectStorage": "Azure Blob Storage provides scalable, secure object storage for documents, media, and employee payroll payslip PDF archives.",
        "queue": "Azure Service Bus delivers enterprise message queuing with message ordering, dead-lettering, and publish/subscribe topics.",
        "scheduledJobs": "Azure Functions Timer Trigger and Azure Logic Apps provide resilient cron scheduling for month-end payroll and batch reporting runs.",
        "gpuInstance": "Azure NC and ND-series virtual machines offer NVIDIA A100 Tensor Core GPUs for AI model training and deep learning inference.",
        "hybridGateway": "Azure ExpressRoute Gateway and VPN Gateway establish dedicated private layer-3 network links bridging on-premises datacenters to Azure VPC.",
        "identity": "Microsoft Entra ID (formerly Azure Active Directory) provides enterprise identity federation, Single Sign-On (SSO), and Conditional Access policies.",
        "monitoring": "Azure Monitor and Application Insights provide full-stack telemetry collection, distributed tracing, and automated alerting.",
        "cdn": "Azure Front Door delivers a scalable and secure entry point for fast web applications with integrated global Anycast CDN and DDoS protection.",
        "security": "Microsoft Defender for Cloud and Azure Key Vault provide cloud posture management, cryptographic keys, and secret access controls.",
        "db_sqlServer": "Azure SQL Managed Instance / Azure SQL DB provides mission-critical enterprise SQL Server engine compatibility with automated high availability.",
        "db_postgres": "Azure Database for PostgreSQL Flexible Server delivers managed PostgreSQL with zone-redundant HA and pgvector extension support.",
        "db_mysql": "Azure Database for MySQL Flexible Server provides fully managed MySQL with customizable maintenance windows and automated backups.",
        "db_oracle": "Azure VM with Oracle Linux or high-speed private interconnect to Oracle Cloud Infrastructure (OCI).",
        "db_nosql": "Azure Cosmos DB offers globally distributed, multi-model NoSQL database service with single-digit millisecond latency SLAs."
    },
    "aws": {
        "dns": "Amazon Route 53 delivers highly available and scalable cloud Domain Name System (DNS) web service with health checks and GeoDNS routing.",
        "loadBalancer": "AWS Application Load Balancer (ALB) provides Layer 7 request routing, SSL termination, and native integration with AWS WAF.",
        "compute": "Amazon Elastic Compute Cloud (EC2) provides scalable, resizable compute capacity with extensive Windows Server and Linux instance families.",
        "containerOrchestrator": "Amazon Elastic Kubernetes Service (EKS) runs production-grade Kubernetes clusters across multiple availability zones.",
        "serverless": "AWS Lambda executes code in response to triggers and automatically manages compute fleet scaling with sub-second billing.",
        "cache": "Amazon ElastiCache for Redis delivers fully managed, in-memory caching with sub-millisecond response times for microsecond read operations.",
        "objectStorage": "Amazon Simple Storage Service (S3) provides industry-leading object storage with 99.999999999% (11 9s) data durability and lifecycle management.",
        "queue": "Amazon Simple Queue Service (SQS) offers fully managed message queues for decoupling distributed software systems and microservices.",
        "scheduledJobs": "Amazon EventBridge Scheduler and AWS Batch orchestrate recurring background cron schedules and serverless tasks.",
        "gpuInstance": "Amazon EC2 G5 and P4d instances powered by NVIDIA A10G and A100 GPUs provide high-throughput AI model inference.",
        "hybridGateway": "AWS Direct Connect provides dedicated, private network links between corporate on-premises datacenters and Amazon VPC.",
        "identity": "AWS Identity and Access Management (IAM) and AWS IAM Identity Center deliver fine-grained permission boundaries and multi-account SSO.",
        "monitoring": "Amazon CloudWatch collects operational metrics, monitors resource logs, and triggers automated remediation alarms.",
        "cdn": "Amazon CloudFront delivers content globally with low latency and high transfer speeds via a secure worldwide edge network.",
        "security": "AWS Key Management Service (KMS) and AWS Shield provide centralized hardware encryption keys and perimeter DDoS defense.",
        "db_sqlServer": "Amazon RDS for SQL Server provides managed SQL Server deployments with Multi-AZ database mirroring and automated point-in-time recovery.",
        "db_postgres": "Amazon Aurora PostgreSQL delivers high-performance relational database storage with 3x the throughput of standard PostgreSQL.",
        "db_mysql": "Amazon Aurora MySQL provides enterprise-grade MySQL compatibility with fault-tolerant storage self-healing across 3 AZs.",
        "db_oracle": "Amazon RDS for Oracle manages complex database administrative tasks with Multi-AZ redundancy and enterprise licensing options.",
        "db_nosql": "Amazon DynamoDB is a serverless, key-value and document NoSQL database delivering consistent single-digit millisecond latency at any scale."
    },
    "gcp": {
        "dns": "Google Cloud DNS is a high-performance, resilient, global Anycast DNS service that translates domain names into IP addresses with 100% SLA.",
        "loadBalancer": "Google Cloud Load Balancing provides global, external Layer 7 load balancing with single Anycast IPv4/IPv6 IP and automatic SSL offloading.",
        "compute": "Google Compute Engine (GCE) delivers customizable virtual machines with live migration, custom machine shapes, and fast boot times.",
        "containerOrchestrator": "Google Kubernetes Engine (GKE) is the premier managed Kubernetes service with Autopilot mode for fully automated cluster operations.",
        "serverless": "Google Cloud Run and Cloud Functions execute containerized microservices and stateless functions with automatic scale-to-zero elasticity.",
        "cache": "Google Cloud Memorystore for Redis provides fully managed in-memory data caching with 99.9% availability SLA.",
        "objectStorage": "Google Cloud Storage delivers unified object storage with instant access across storage tiers and multi-region bucket redundancy.",
        "queue": "Google Cloud Pub/Sub provides scalable, durable event ingestion and messaging for stream analytics and asynchronous event-driven pipelines.",
        "scheduledJobs": "Google Cloud Scheduler is a fully managed enterprise cron job scheduler with automatic retries and dead-letter queue support.",
        "gpuInstance": "Compute Engine GPU instances powered by NVIDIA L4, A100, and H100 Tensor Core GPUs provide accelerated GenAI and ML inference.",
        "hybridGateway": "Google Cloud Interconnect provides low-latency, highly available private fiber links connecting on-premises networks to Google Cloud.",
        "identity": "Google Cloud Identity and Cloud IAM provide enterprise workforce identity synchronization and fine-grained role-based access control.",
        "monitoring": "Google Cloud Monitoring and Logging provide real-time performance dashboards, distributed tracing, and automated metric alerts.",
        "cdn": "Google Cloud CDN leverages Google's global private fiber backbone and edge points of presence for fast content delivery.",
        "security": "Cloud KMS and Security Command Center deliver hardware-backed cryptographic keys and comprehensive cloud vulnerability assessments.",
        "db_sqlServer": "Cloud SQL for SQL Server provides fully managed Microsoft SQL Server database instances with automated backups and failover replicas.",
        "db_postgres": "Cloud SQL for PostgreSQL delivers managed PostgreSQL databases with automatic storage expansion and AlloyDB columnar accelerator.",
        "db_mysql": "Cloud SQL for MySQL provides managed MySQL relational database instances with high-availability replication and encryption at rest.",
        "db_oracle": "Bare Metal Solution for Oracle allows enterprise Oracle database workloads to run on certified hardware directly adjacent to Google Cloud.",
        "db_nosql": "Cloud Firestore is a serverless, NoSQL document database built for automatic scaling, high performance, and ease of application development."
    },
    "hetzner": {
        "dns": "Hetzner DNS Console provides fast, authoritative DNS hosting with Anycast nameservers across Europe and the US.",
        "loadBalancer": "Hetzner Cloud Load Balancer distributes incoming traffic across multiple cloud servers with automatic Let's Encrypt SSL certificates.",
        "compute": "Hetzner Cloud Instances (CX, CPX, CCX) deliver exceptional price-to-performance compute powered by AMD EPYC and Intel processors with NVMe SSDs.",
        "containerOrchestrator": "Hetzner Kubernetes (k3s / kubeadm) allows building sovereign, lightweight container clusters on high-speed private cloud networks.",
        "serverless": "Hetzner Cloud Serverless integration enables running lightweight container tasks via Docker and self-hosted OpenFaaS.",
        "cache": "Self-hosted Redis deployed on dedicated Hetzner NVMe instances provides sub-millisecond local in-memory caching.",
        "objectStorage": "Hetzner Object Storage (S3-compatible) and Storage Boxes offer high-capacity, low-cost multi-terabyte data and backup storage.",
        "queue": "Self-hosted RabbitMQ or Redis Queue deployed on Hetzner private networks delivers durable, decoupled message passing.",
        "scheduledJobs": "Linux Systemd Timers and Cron daemons running on persistent Hetzner cloud servers manage scheduled background tasks.",
        "gpuInstance": "Hetzner Dedicated Server GPU options with NVIDIA GeForce / RTX GPUs provide low-cost hardware compute for dedicated workloads.",
        "hybridGateway": "Hetzner vSwitch and WireGuard VPN mesh connect on-premises environments directly into sovereign German and Finnish datacenters.",
        "identity": "Self-hosted Keycloak, OpenLDAP, or third-party OAuth integrations manage authentication with full European data privacy.",
        "monitoring": "Hetzner Cloud Monitoring and Prometheus/Grafana integrations provide server resource usage metrics and automated threshold alerts.",
        "cdn": "Hetzner servers paired with Cloudflare CDN or Fastly edge routing provide rapid global web content delivery.",
        "security": "Hetzner Cloud Firewalls provide stateless network packet filtering and isolated private networks (vSwitch) for all servers.",
        "db_sqlServer": "Windows Server VM with SQL Server Standard/Express running on Hetzner high-performance NVMe block storage.",
        "db_postgres": "Self-managed or managed PostgreSQL running on dedicated Hetzner NVMe instances with automated Barman backup scripts.",
        "db_mysql": "High-performance MySQL / MariaDB deployments optimized for bare-metal and virtualized NVMe disk I/O.",
        "db_oracle": "Self-managed Oracle Database deployed on Hetzner dedicated enterprise hardware.",
        "db_nosql": "ScyllaDB, MongoDB, or Redis key-value clusters hosted on Hetzner private networks."
    },
    "oci": {
        "dns": "Oracle Cloud DNS provides low-latency Anycast DNS resolution with traffic steering and health monitoring.",
        "loadBalancer": "OCI Flexible Load Balancer allows dynamically configuring bandwidth and layer 7 routing rules with zero downtime.",
        "compute": "OCI Compute offers scalable Ampere A1 Arm cores and AMD/Intel compute instances with flexible core-to-memory configuration.",
        "containerOrchestrator": "Oracle Container Engine for Kubernetes (OKE) is a fully managed, scalable, and highly available service to run containerized apps.",
        "serverless": "OCI Functions is a serverless, event-driven compute service powered by the open-source Fn Project engine.",
        "cache": "OCI Cache with Redis provides a fully managed in-memory caching service for low-latency database queries.",
        "objectStorage": "OCI Object Storage provides internet-scale, high-performance storage with 10 TB free monthly egress bandwidth worldwide.",
        "queue": "OCI Queue delivers high-throughput, serverless message queuing with automated retention and dead-letter handling.",
        "scheduledJobs": "OCI Scheduled Tasks and Resource Manager orchestrate periodic cloud maintenance and database backup scripts.",
        "gpuInstance": "OCI GPU instances powered by NVIDIA H100 and A100 Tensor Core GPUs provide top-tier computing for enterprise AI models.",
        "hybridGateway": "OCI FastConnect provides a dedicated, private connection between corporate datacenters and Oracle Cloud Infrastructure.",
        "identity": "OCI IAM provides enterprise identity domains with Single Sign-On, adaptive MFA, and role-based policies.",
        "monitoring": "OCI Monitoring actively collects metric telemetry, alarms on operational thresholds, and streams logs to central repositories.",
        "cdn": "OCI Edge Services deliver distributed content delivery and Web Application Firewall protection.",
        "security": "OCI Vault and Security Zones provide hardware security modules (HSM) and strict policy enforcement for data protection.",
        "db_sqlServer": "Oracle Cloud Infrastructure compute instances running Windows Server with Microsoft SQL Server Enterprise or Web editions.",
        "db_postgres": "OCI Managed PostgreSQL Flexible Server with automated patching, backup retention, and optimized performance.",
        "db_mysql": "MySQL HeatWave Database Service accelerates analytics and transactional queries 100x faster than standard MySQL.",
        "db_oracle": "Oracle Autonomous Database is self-driving, self-securing, and self-repairing with native Real Application Clusters (RAC).",
        "db_nosql": "Oracle NoSQL Database Cloud Service provides multi-region tabular, column-oriented, and document data storage."
    },
    "digitalocean": {
        "dns": "DigitalOcean DNS provides free, reliable Anycast DNS management with automated Let's Encrypt SSL certificate provisioning.",
        "loadBalancer": "DigitalOcean Load Balancers automatically route incoming web traffic across Droplets with health checks and SSL termination.",
        "compute": "DigitalOcean Droplets provide simple, predictable virtual machines with dedicated or shared CPU options and NVMe storage.",
        "containerOrchestrator": "DigitalOcean Kubernetes (DOKS) offers managed Kubernetes with zero control plane fees and automated cluster upgrades.",
        "serverless": "DigitalOcean Functions executes serverless event-driven code without the need to manage infrastructure.",
        "cache": "DigitalOcean Managed Redis provides fully managed, secure in-memory caching with automated failover and daily backups.",
        "objectStorage": "DigitalOcean Spaces delivers S3-compatible object storage with a built-in content delivery network (CDN) for fast asset downloads.",
        "queue": "Worker Droplets or managed Redis streams decouple application tasks and handle background asynchronous processing.",
        "scheduledJobs": "DigitalOcean Functions Cron and Droplet systemd timers run scheduled background maintenance and reporting jobs.",
        "gpuInstance": "DigitalOcean Paperspace GPU droplets deliver NVIDIA H100, A100, and RTX 4000 GPUs for machine learning workloads.",
        "hybridGateway": "DigitalOcean VPC with WireGuard or IPsec VPN gateways connects Droplets securely to private on-premises networks.",
        "identity": "OAuth and token-based authentication integrations managed through developer frameworks and third-party identity providers.",
        "monitoring": "DigitalOcean Monitoring provides free droplet resource telemetry with automated alerts sent to Slack and email.",
        "cdn": "DigitalOcean Spaces CDN distributes static assets globally across edge servers with low latency.",
        "security": "DigitalOcean Cloud Firewalls provide free network-level security rules blocking unauthorized traffic before reaching Droplets.",
        "db_sqlServer": "Microsoft SQL Server deployed on DigitalOcean Windows Server Droplets with dedicated vCPUs.",
        "db_postgres": "DigitalOcean Managed PostgreSQL provides automated failover, daily backups, and connection pooling via PgBouncer.",
        "db_mysql": "DigitalOcean Managed MySQL delivers scalable, reliable relational database hosting with automated patching.",
        "db_oracle": "Custom Docker container or Linux Droplet configured with Oracle Database XE for developer testing.",
        "db_nosql": "DigitalOcean Managed MongoDB delivers document database hosting with automatic scaling and end-to-end encryption."
    },
    "linode": {
        "dns": "Linode DNS Manager provides authoritative Anycast DNS hosting with an intuitive management interface and REST API.",
        "loadBalancer": "Linode NodeBalancers provide high-availability Layer 4 and Layer 7 load balancing with SSL termination.",
        "compute": "Linode Dedicated and Shared CPU instances deliver robust virtual machines powered by AMD EPYC processors.",
        "containerOrchestrator": "Linode Kubernetes Engine (LKE) provides managed Kubernetes clusters with zero control plane charges.",
        "serverless": "Linode developer integrations support containerized microservices and edge worker deployments.",
        "cache": "Self-hosted Redis deployed on Linode high-memory compute instances provides low-latency caching.",
        "objectStorage": "Linode Object Storage provides S3-compatible, globally distributed data storage for media and application archives.",
        "queue": "RabbitMQ or Redis queues running on Linode private networks decouple background application tasks.",
        "scheduledJobs": "Linux cron and systemd timer services manage periodic batch jobs and scheduled operational tasks.",
        "gpuInstance": "Linode GPU instances powered by NVIDIA RTX 6000 Ada and Quadro GPUs accelerate rendering and AI workloads.",
        "hybridGateway": "Akamai Cloud Interconnect and IPsec VPNs link Linode VPCs directly into enterprise on-premises networks.",
        "identity": "Linode user and API token management with two-factor authentication and third-party IAM federation.",
        "monitoring": "Linode Longview provides detailed system monitoring and OS-level performance telemetry for Linux servers.",
        "cdn": "Akamai Connected Cloud edge distribution delivers industry-leading content delivery and DDoS mitigation.",
        "security": "Linode Cloud Firewalls provide stateful packet inspection rules blocking unauthorized network connections.",
        "db_sqlServer": "Microsoft SQL Server running on Linode Windows instances with dedicated SSD storage.",
        "db_postgres": "Linode Managed PostgreSQL provides managed database clusters with automated backups and replication.",
        "db_mysql": "Linode Managed MySQL delivers managed MySQL relational database hosting with automated failover.",
        "db_oracle": "Self-managed Oracle Database running on dedicated Linode compute instances.",
        "db_nosql": "Clustered Cassandra, Couchbase, or MongoDB deployments on Linode private networks."
    },
    "vultr": {
        "dns": "Vultr Global Anycast DNS provides reliable, free DNS resolution across 32+ worldwide datacenter locations.",
        "loadBalancer": "Vultr Load Balancers distribute traffic across compute instances with automated SSL certificates and health probes.",
        "compute": "Vultr Cloud Compute and Optimized Cloud Compute instances offer high-performance virtual servers with NVMe disks.",
        "containerOrchestrator": "Vultr Kubernetes Engine (VKE) provides fully managed Kubernetes with zero cluster management fees.",
        "serverless": "Vultr Serverless Functions enable building event-driven microservices without infrastructure provisioning.",
        "cache": "Vultr Managed Redis provides scalable in-memory caching with high availability and automated backup snapshots.",
        "objectStorage": "Vultr Object Storage delivers affordable S3-compatible storage with predictable monthly pricing.",
        "queue": "Managed Kafka or Redis queues on Vultr private networks support decoupled distributed messaging.",
        "scheduledJobs": "Scheduled cron tasks and automated API triggers manage recurring application workflows.",
        "gpuInstance": "Vultr Cloud GPU provides fractional and full NVIDIA GH200, H100, L40S, and A100 GPUs by the hour.",
        "hybridGateway": "Vultr Direct Connect and BGP routing provide private high-speed networking to existing enterprise infrastructure.",
        "identity": "Vultr IAM with fine-grained API keys, role assignments, and two-factor authentication.",
        "monitoring": "Vultr Cloud Monitoring delivers server health metrics, bandwidth tracking, and custom threshold alerts.",
        "cdn": "Vultr CDN integration with global edge caching across North America, Europe, Asia, and Latin America.",
        "security": "Vultr Native DDoS Protection defends instances against volumetric attacks up to 100 Gbps.",
        "db_sqlServer": "Windows Server instances with Microsoft SQL Server pre-installed on Vultr high-speed NVMe storage.",
        "db_postgres": "Vultr Managed PostgreSQL delivers automated database clustering, maintenance, and point-in-time recovery.",
        "db_mysql": "Vultr Managed MySQL provides fully managed relational database instances with high-availability standbys.",
        "db_oracle": "Self-managed Oracle Linux instances on dedicated Vultr bare-metal hardware.",
        "db_nosql": "Vultr Managed Redis or self-hosted document databases on private Vultr networks."
    },
    "ovhcloud": {
        "dns": "OVHcloud DNS provides robust European Anycast DNS management with DNSSEC protection.",
        "loadBalancer": "OVHcloud Load Balancer distributes incoming HTTP/HTTPS and TCP/UDP traffic across global infrastructure.",
        "compute": "OVHcloud Public Cloud Instances deliver cost-effective compute guaranteed with European data sovereignty.",
        "containerOrchestrator": "OVHcloud Managed Kubernetes Service provides free control plane Kubernetes clusters with native CNCF compliance.",
        "serverless": "OVHcloud AI Endpoints and Serverless Tasks execute stateless containers on demand.",
        "cache": "OVHcloud Managed Databases for Redis provide fast in-memory caching with end-to-end data encryption.",
        "objectStorage": "OVHcloud High Performance Object Storage provides S3-compatible storage compliant with European GDPR regulations.",
        "queue": "OVHcloud Managed Apache Kafka provides robust distributed streaming and message queuing.",
        "scheduledJobs": "Scheduled cron workflows and automated system tasks manage periodic batch processing.",
        "gpuInstance": "OVHcloud AI Training and GPU instances powered by NVIDIA V100 and H100 GPUs for deep learning models.",
        "hybridGateway": "OVHcloud vRack private networking links bare-metal servers, public cloud, and on-premises datacenters.",
        "identity": "OVHcloud IAM provides granular permission policies compliant with European privacy standards.",
        "monitoring": "OVHcloud Metrics and Logs Data Platform provide centralized observability and tracing.",
        "cdn": "OVHcloud Content Delivery Network caches static and dynamic assets across 30+ global edge locations.",
        "security": "Industry-leading Anti-DDoS infrastructure defending all services against massive multi-terabit attacks.",
        "db_sqlServer": "Microsoft SQL Server deployed on OVHcloud Windows Server instances with guaranteed data sovereignty.",
        "db_postgres": "OVHcloud Managed Databases for PostgreSQL with automated backups, high availability, and zero egress fees.",
        "db_mysql": "OVHcloud Managed Databases for MySQL delivering scalable transactional relational database storage.",
        "db_oracle": "Dedicated bare-metal servers configured for enterprise Oracle Database installations.",
        "db_nosql": "OVHcloud Managed Databases for MongoDB and OpenSearch for scalable document storage."
    },
    "alibaba": {
        "dns": "Alibaba Cloud DNS provides intelligent Anycast resolution with global traffic routing and anti-hijacking protection.",
        "loadBalancer": "Server Load Balancer (SLB / ALB) delivers high-concurrency Layer 4 and Layer 7 traffic distribution.",
        "compute": "Elastic Compute Service (ECS) offers scalable compute instances optimized for Asian and global markets.",
        "containerOrchestrator": "Container Service for Kubernetes (ACK) provides enterprise-grade Kubernetes certified by CNCF.",
        "serverless": "Function Compute is an event-driven, fully managed serverless compute service that runs code without provisioning servers.",
        "cache": "ApsaraDB for Redis delivers in-memory database caching with master-replica architecture and automated failover.",
        "objectStorage": "Object Storage Service (OSS) provides secure, durable S3-compatible cloud storage with built-in data processing.",
        "queue": "Message Queue (RocketMQ / Kafka) provides distributed, high-throughput message streaming with sub-millisecond latency.",
        "scheduledJobs": "Serverless Task and SchedulerX deliver distributed task scheduling for high-reliability enterprise cron jobs.",
        "gpuInstance": "GPU-accelerated ECS instances powered by NVIDIA A10 and V100 GPUs for AI training and graphics rendering.",
        "hybridGateway": "Express Connect and Smart Access Gateway link enterprise on-premises networks to Alibaba Cloud VPCs.",
        "identity": "Resource Access Management (RAM) provides centralized identity management and authorization policies.",
        "monitoring": "CloudMonitor collects performance metrics, tracks operational logs, and triggers automated alerts.",
        "cdn": "Alibaba Cloud DCDN provides dynamic and static acceleration across 2,800+ global edge nodes.",
        "security": "Anti-DDoS Pro and Web Application Firewall safeguard applications against malicious traffic and exploits.",
        "db_sqlServer": "ApsaraDB RDS for SQL Server delivers managed Microsoft SQL Server with AlwaysOn high availability.",
        "db_postgres": "ApsaraDB RDS for PostgreSQL provides enterprise relational database hosting with Ganos spatial extensions.",
        "db_mysql": "ApsaraDB RDS for MySQL delivers high-performance MySQL with PolarDB cloud-native architecture.",
        "db_oracle": "ECS bare-metal instances configured with Oracle Linux for enterprise legacy database migrations.",
        "db_nosql": "ApsaraDB for MongoDB and Tablestore offer scalable NoSQL document and wide-column data management."
    },
    "scaleway": {
        "dns": "Scaleway Domains and DNS provides Anycast DNS management with intuitive API controls.",
        "loadBalancer": "Scaleway Load Balancer distributes application traffic across multi-AZ compute instances with SSL offloading.",
        "compute": "Scaleway Instances and Bare Metal offer high-efficiency compute including Apple Silicon M2/M3 options.",
        "containerOrchestrator": "Kubernetes Kapsule and Kosmos manage container clusters natively across Scaleway and multi-cloud nodes.",
        "serverless": "Scaleway Serverless Functions and Containers execute microservices with automatic scale-to-zero pricing.",
        "cache": "Scaleway Managed Redis delivers fully managed in-memory caching with high-availability replication.",
        "objectStorage": "Scaleway Object Storage provides multi-AZ S3-compatible storage with automated lifecycle rules.",
        "queue": "Scaleway Messaging and Queuing provides managed NATS and SQS-compatible distributed message passing.",
        "scheduledJobs": "Scaleway Serverless Cron Triggers schedule recurring background jobs without persistent server costs.",
        "gpuInstance": "Scaleway GPU Instances powered by NVIDIA H100 and L40S GPUs provide enterprise AI compute.",
        "hybridGateway": "Scaleway VPC and Private Network create isolated layer-2 environments connected via secure VPN.",
        "identity": "Scaleway IAM provides fine-grained access policies and API key management with zero vendor lock-in.",
        "monitoring": "Scaleway Cockpit delivers managed Grafana dashboards and unified telemetry for cloud resources.",
        "cdn": "Scaleway Edge Services provide caching and SSL management across European edge locations.",
        "security": "Scaleway Secret Manager and Security Groups protect credentials and enforce network isolation.",
        "db_sqlServer": "Microsoft SQL Server deployed on Scaleway dedicated compute instances with fast block storage.",
        "db_postgres": "Scaleway Managed PostgreSQL provides managed database instances with automated daily backups.",
        "db_mysql": "Scaleway Managed MySQL delivers reliable relational database hosting with automatic failover.",
        "db_oracle": "Self-managed Oracle Database running on Scaleway Dedicated Bare Metal hardware.",
        "db_nosql": "Managed Redis and document databases hosted within Scaleway private VPCs."
    },
    "render": {
        "dns": "Render Custom Domains provides automated global Anycast DNS management with instant Let's Encrypt SSL.",
        "loadBalancer": "Built-in Zero-Config TLS Load Balancer automatically routes traffic and handles zero-downtime deploys.",
        "compute": "Render Web Services and Background Workers run web applications and background processes with automatic git deploys.",
        "containerOrchestrator": "Fully Managed Kubernetes behind the scenes abstracts container orchestration into simple configuration.",
        "serverless": "Render Background Tasks and Webhooks execute ephemeral compute jobs on demand.",
        "cache": "Render Managed Redis provides single-click in-memory caching with persistent storage and metrics.",
        "objectStorage": "Integrated S3 and Cloudflare R2 integrations provide simple storage for application media files.",
        "queue": "Render Background Workers with Redis Queue handle asynchronous task execution and message queues.",
        "scheduledJobs": "Render Cron Jobs provide native UI-driven cron scheduling for recurring batch and maintenance jobs.",
        "gpuInstance": "Render does not natively offer fractional GPUs on standard starter tiers.",
        "hybridGateway": "Private Services networking connects internal applications over an isolated software-defined mesh.",
        "identity": "Application-level authentication integrated with OAuth, Auth0, Clerk, or Supabase.",
        "monitoring": "Render Observability provides built-in metrics, real-time log streaming, and automated health alerts.",
        "cdn": "Global Edge CDN automatically caches static assets and terminates TLS close to end users.",
        "security": "Automated Let's Encrypt SSL certificates, DDoS mitigation, and encrypted environment variables.",
        "db_sqlServer": "SQL Server is not natively supported on Render PaaS; external database connection required.",
        "db_postgres": "Render Fully Managed PostgreSQL delivers automated backups, point-in-time recovery, and connection pooling.",
        "db_mysql": "Dockerized MySQL container running as a private service on Render with attached disk.",
        "db_oracle": "Oracle Database is not supported on Render PaaS.",
        "db_nosql": "Dockerized NoSQL or external MongoDB Atlas integration via private environment secrets."
    },
    "flyio": {
        "dns": "Fly Anycast DNS automatically resolves domain queries to the nearest physical datacenter across 30+ edge locations.",
        "loadBalancer": "Fly Edge Proxy provides global Anycast IPv4/IPv6 routing with automatic SSL termination and health checks.",
        "compute": "Fly Machines run hardware-virtualized Firecracker micro-VMs that boot in under 300 milliseconds worldwide.",
        "containerOrchestrator": "Fly Orchestration Engine coordinates distributed micro-VM deployments close to end users.",
        "serverless": "Scale-to-Zero Fly Machines automatically suspend when idle and wake on incoming HTTP requests.",
        "cache": "Fly Redis powered by Upstash delivers serverless in-memory caching with global edge replication.",
        "objectStorage": "Tigris Object Storage provides globally distributed S3-compatible storage with automated edge caching.",
        "queue": "RabbitMQ or Redis queues running inside dedicated Fly Micro-VMs handle background jobs.",
        "scheduledJobs": "Fly Machine Scheduled Wakeups execute cron tasks at predefined intervals with automatic shutdown.",
        "gpuInstance": "Fly GPUs provide NVIDIA A100, A10, and L40S GPUs billed by the second for low-latency AI inference.",
        "hybridGateway": "Fly WireGuard Private Mesh Network creates encrypted point-to-point tunnels between clouds and on-premises.",
        "identity": "Third-party OAuth, Clerk, or self-hosted authentication running inside Fly micro-VMs.",
        "monitoring": "Fly Grafana and Prometheus provide real-time metrics dashboards and centralized logging.",
        "cdn": "Fly Edge Anycast Routing terminates TCP and TLS connections at the nearest edge datacenter.",
        "security": "Automated TLS certificates, isolated Firecracker hypervisor boundaries, and encrypted WireGuard mesh.",
        "db_sqlServer": "SQL Server is not supported on lightweight Fly micro-VMs; external connection required.",
        "db_postgres": "Fly Postgres provides distributed PostgreSQL clusters with LiteFS and Stolon automated failover.",
        "db_mysql": "Self-hosted MySQL running inside a Fly Micro-VM with attached persistent volume storage.",
        "db_oracle": "Oracle Database is not supported on Fly.io edge infrastructure.",
        "db_nosql": "LiteFS and SQLite replicated globally at the edge with sub-millisecond local reads."
    },
    "railway": {
        "dns": "Railway Edge Domains provide automatic custom domain routing with instant SSL certificate provisioning.",
        "loadBalancer": "Automated Edge Routing handles incoming web traffic with zero configuration and seamless rollbacks.",
        "compute": "Railway Service Deployments provide containerized application hosting with automatic git builds.",
        "containerOrchestrator": "Railway Custom Orchestrator manages multi-service application graphs with private networking.",
        "serverless": "Railway Ephemeral Deployments spin up isolated PR preview environments automatically.",
        "cache": "Railway Managed Redis Plugin provides fast, single-click in-memory key-value caching.",
        "objectStorage": "Plugin integrations with Amazon S3 and Cloudflare R2 for persistent media storage.",
        "queue": "Worker containers connected over private networks handle asynchronous background task queues.",
        "scheduledJobs": "Railway Cron Triggers schedule recurring script execution directly from the web dashboard.",
        "gpuInstance": "GPU compute is not available on standard Railway starter tiers.",
        "hybridGateway": "Private Networking Mesh connects all services in a project over an encrypted internal network.",
        "identity": "Application-level authentication integrated with OAuth, Supabase, or custom auth services.",
        "monitoring": "Railway Observability provides real-time CPU, RAM, and network metrics with log search.",
        "cdn": "Automated edge proxies distribute and cache web application responses worldwide.",
        "security": "Secret variables management with automated environment injection and encrypted storage.",
        "db_sqlServer": "SQL Server is not natively supported on Railway; external database connection recommended.",
        "db_postgres": "Railway Managed PostgreSQL Plugin delivers relational database hosting with automated daily backups.",
        "db_mysql": "Railway Managed MySQL Plugin provides reliable, single-click MySQL database hosting.",
        "db_oracle": "Oracle Database is not supported on Railway.",
        "db_nosql": "Railway MongoDB Plugin provides document database hosting with instant provisioning."
    },
    "proxmox": {
        "dns": "Local DNS, Pi-hole, or BIND9 running in an LXC container provides sovereign local network DNS resolution.",
        "loadBalancer": "HAProxy and Keepalived running in lightweight LXC containers provide high-availability load balancing.",
        "compute": "KVM Virtual Machines and lightweight LXC Containers provide virtualization with direct hardware access.",
        "containerOrchestrator": "k3s and Talos Linux on Proxmox VMs provide lightweight, production-ready Kubernetes clusters.",
        "serverless": "Self-hosted OpenFaaS or Knative on local Kubernetes provides private serverless execution.",
        "cache": "Redis deployed in a dedicated LXC container provides sub-millisecond local in-memory caching.",
        "objectStorage": "MinIO or Ceph Object Gateway provides private S3-compatible object storage across local disks.",
        "queue": "RabbitMQ or Apache Kafka running in dedicated containers handles local distributed messaging.",
        "scheduledJobs": "Linux cron and systemd timers running on bare-metal or VMs execute recurring operational schedules.",
        "gpuInstance": "PCIe GPU Passthrough directly passes physical NVIDIA RTX/Tesla GPUs into virtual machines.",
        "hybridGateway": "Physical Fiber Cross-connects and OPNsense/pfSense routing bridge on-premises networks to public clouds.",
        "identity": "Active Directory, OpenLDAP, or Keycloak federation provides centralized local user identity management.",
        "monitoring": "Proxmox VE Metrics Server with InfluxDB and Grafana provides real-time cluster telemetry.",
        "cdn": "Cloudflare Tunnel integration securely exposes local private services to global internet traffic.",
        "security": "Proxmox Firewall and ZFS encrypted storage pools protect VM disks and enforce network isolation.",
        "db_sqlServer": "Windows Server VM running Microsoft SQL Server with raw NVMe ZFS storage pools for maximum performance.",
        "db_postgres": "Dedicated LXC container running PostgreSQL 16 with ZFS snapshot replication and daily backups.",
        "db_mysql": "Dedicated LXC container running MySQL 8 with high-speed local disk I/O.",
        "db_oracle": "Oracle Linux enterprise virtual machine configured for Oracle Database installations.",
        "db_nosql": "ScyllaDB or MongoDB clusters deployed across multiple Proxmox cluster nodes."
    },
    "openstack": {
        "dns": "Designate (DNS-as-a-Service) provides multi-tenant DNS management with automated zone synchronization.",
        "loadBalancer": "Octavia (Load Balancer-as-a-Service) provides scalable Layer 4 and Layer 7 load balancing across compute nodes.",
        "compute": "Nova (Compute Service) manages bare-metal, virtual machines, and container instances across clusters.",
        "containerOrchestrator": "Magnum provides on-demand orchestration for production Kubernetes and Docker Swarm clusters.",
        "serverless": "Qinling (Function-as-a-Service) provides serverless function execution across OpenStack compute.",
        "cache": "Trove Database Service with Redis plugin provides managed in-memory caching for tenant workloads.",
        "objectStorage": "Swift provides highly available, distributed, and eventually consistent object storage across servers.",
        "queue": "Zaqar provides a multi-tenant messaging and notification service for web and mobile developers.",
        "scheduledJobs": "Mistral (Workflow Service) orchestrates complex tasks and recurring cron workflows across cloud services.",
        "gpuInstance": "Nova GPU vGPU and PCIe Passthrough allocate physical NVIDIA accelerators to tenant instances.",
        "hybridGateway": "Neutron Networking with BGP Dynamic Routing bridges private tenant networks to physical datacenters.",
        "identity": "Keystone provides unified authentication, role authorization, and centralized token validation.",
        "monitoring": "Ceilometer and Aodh provide telemetry collection, resource tracking, and automated alarming.",
        "cdn": "Barbican with external edge caching integrates private cloud services with public CDNs.",
        "security": "Barbican provides secure key management, cryptographic secrets storage, and SSL certificate management.",
        "db_sqlServer": "Trove Database Service or dedicated Windows Nova instances running Microsoft SQL Server Enterprise.",
        "db_postgres": "Trove Database Service with PostgreSQL provides automated provisioning, replication, and backups.",
        "db_mysql": "Trove Database Service with MySQL provides managed relational database hosting.",
        "db_oracle": "Bare Metal Ironic instances running Oracle Linux certified for Oracle Database deployments.",
        "db_nosql": "Trove Cassandra or MongoDB clusters providing scalable distributed document storage."
    },
    "nutanix": {
        "dns": "Nutanix Flow Virtual Networking provides software-defined DNS routing and IP address management.",
        "loadBalancer": "Integrated Flow Virtual Networking delivers automated Layer 4/7 load balancing with microsegmentation.",
        "compute": "Nutanix AHV (Acropolis Hypervisor) provides enterprise-grade hyperconverged virtual machines.",
        "containerOrchestrator": "Nutanix Kubernetes Engine (NKE) provides turnkey, enterprise-grade Kubernetes cluster management.",
        "serverless": "Nutanix Cloud Native integrations provide serverless execution environments on top of AHV.",
        "cache": "Nutanix Database Service (NDB) deployed Redis instances provide fast, in-memory query caching.",
        "objectStorage": "Nutanix Objects provides high-performance, S3-compatible object storage across hyperconverged nodes.",
        "queue": "Apache Kafka deployed on Nutanix hyperconverged storage handles high-throughput message streaming.",
        "scheduledJobs": "Prism Pro Automation Workflows orchestrate recurring maintenance, reporting, and backup cron schedules.",
        "gpuInstance": "Virtual GPU (vGPU) on Nutanix AHV enables sharing physical NVIDIA GPUs among multiple virtual workloads.",
        "hybridGateway": "Nutanix Cloud Clusters (NC2) seamlessly extend private datacenter workloads into AWS and Microsoft Azure.",
        "identity": "Active Directory and Microsoft Entra ID federation provide seamless enterprise Single Sign-On.",
        "monitoring": "Prism Central provides unified multi-cluster management with machine learning-driven capacity forecasting.",
        "cdn": "Enterprise third-party edge integration connects Nutanix applications to global content delivery networks.",
        "security": "Flow Microsegmentation enforces granular security policies between VMs to prevent lateral cyber attacks.",
        "db_sqlServer": "Nutanix Database Service (NDB) for SQL Server provides automated provisioning, patching, and copy data management.",
        "db_postgres": "Nutanix Database Service (NDB) for PostgreSQL delivers automated database clustering and snapshots.",
        "db_mysql": "Nutanix Database Service (NDB) for MySQL provides managed relational database administration.",
        "db_oracle": "Nutanix Database Service (NDB) for Oracle RAC delivers certified enterprise database performance.",
        "db_nosql": "Nutanix Objects and MongoDB deployments provide scalable NoSQL document management."
    }
}

def generate_canonical_services_for_provider(provider: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Generate normalized canonical service objects for a single provider.
    Validates every required field: id, name, providerId, providerName, category, description.
    """
    pid = provider.get("id")
    pname = provider.get("name")
    raw_services = provider.get("services", {})
    provider_descriptions = SERVICE_DESCRIPTIONS.get(pid, {})
    
    canonical_list = []
    
    # Process standard 1-to-1 services
    for key, meta in CATEGORY_MAP.items():
        if key not in raw_services:
            continue
        service_name = raw_services[key]
        if not service_name or not isinstance(service_name, str):
            continue
            
        desc = provider_descriptions.get(key)
        if not desc:
            desc = f"{service_name} provides enterprise {meta['label'].lower()} capabilities on {pname}."
            
        service_id = f"{pid}-{meta['category']}-{key.lower()}"
        capabilities = [meta["label"], pname]
        if "sql" in service_name.lower(): capabilities.append("SQL")
        if "kubernetes" in service_name.lower() or "aks" in service_name.lower() or "eks" in service_name.lower() or "gke" in service_name.lower(): capabilities.append("Kubernetes")
        if "gpu" in service_name.lower() or "nvidia" in service_name.lower(): capabilities.append("GPU")
        if "windows" in service_name.lower(): capabilities.append("Windows Server")
        
        canonical_list.append({
            "id": service_id,
            "name": service_name,
            "providerId": pid,
            "providerName": pname,
            "category": meta["category"],
            "categoryLabel": meta["label"],
            "description": desc,
            "capabilities": capabilities
        })
        
    # Process database variants
    db_raw = raw_services.get("database", {})
    if isinstance(db_raw, dict):
        db_variants = [
            ("sqlServer", "db_sqlServer", "SQL Server Relational Database"),
            ("postgres", "db_postgres", "PostgreSQL Relational Database"),
            ("mysql", "db_mysql", "MySQL Relational Database"),
            ("oracle", "db_oracle", "Oracle Enterprise Database"),
            ("nosql", "db_nosql", "NoSQL Document Database")
        ]
        for sub_key, desc_key, default_label in db_variants:
            db_name = db_raw.get(sub_key)
            if not db_name or not isinstance(db_name, str) or db_name.lower() == "not supported":
                continue
                
            desc = provider_descriptions.get(desc_key)
            if not desc:
                desc = f"{db_name} delivers managed {default_label.lower()} services on {pname}."
                
            service_id = f"{pid}-database-{sub_key.lower()}"
            caps = ["Databases", default_label, pname]
            if sub_key == "sqlServer": caps.append("SQL Server")
            if sub_key == "postgres": caps.append("PostgreSQL")
            
            canonical_list.append({
                "id": service_id,
                "name": db_name,
                "providerId": pid,
                "providerName": pname,
                "category": "database",
                "categoryLabel": "Database",
                "description": desc,
                "capabilities": caps
            })

    return canonical_list

def get_all_canonical_services() -> List[Dict[str, Any]]:
    """
    Returns the complete list of normalized, validated canonical services across all 17 providers.
    Every service is guaranteed to have non-empty id, name, providerId, providerName, category, description.
    """
    all_services = []
    for prov in CLOUD_PROVIDERS:
        prov_services = generate_canonical_services_for_provider(prov)
        all_services.extend(prov_services)
    return all_services

def validate_service_records(services: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Validates a list of service records against the canonical contract.
    Returns validation stats and raises ValueError if any malformed record is found.
    """
    required_keys = ["id", "name", "providerId", "providerName", "category", "description"]
    malformed = []
    
    for i, s in enumerate(services):
        for k in required_keys:
            val = s.get(k)
            if not val or not isinstance(val, str) or val.strip() == "" or val.lower() == "undefined":
                malformed.append({
                    "index": i,
                    "providerId": s.get("providerId"),
                    "serviceName": s.get("name"),
                    "missingKey": k,
                    "actualValue": val
                })
                
    if malformed:
        raise ValueError(f"Validation FAILED: Found {len(malformed)} malformed service records: {malformed[:5]}")
        
    return {
        "valid": True,
        "totalRecords": len(services),
        "providersCovered": len(set(s["providerId"] for s in services))
    }
