"""
Cloud AI Architect V2 - Infrastructure Code Generator
Generates valid, tailored Terraform, Dockerfile, Docker Compose, and Cloud-Init
strictly reflecting the chosen provider and active workload architecture.
"""

from typing import Dict, Any

def generate_terraform(workload: Dict[str, Any], provider: Dict[str, Any]) -> str:
    pid = provider.get("id", "azure")
    services = provider.get("services", {})
    region_raw = workload.get("region", "us-east")
    has_db = workload.get("database", {}).get("required", False)
    db_type = workload.get("database", {}).get("type", "sql-postgres")
    has_cache = workload.get("cache", {}).get("required", False)
    has_storage = workload.get("objectStorage", {}).get("required", False)
    has_gpu = workload.get("gpuInference", {}).get("required", False)
    has_hybrid = workload.get("hybridConnectivity", False)

    if pid == "azure":
        region = "centralindia" if "india" in region_raw.lower() else "eastus"
        tf = f"""# Cloud AI Architect V2 - Generated Terraform Specification
# Target: Microsoft Azure
# Workload: {workload.get('rawPrompt', 'Enterprise Platform')[:60]}...

terraform {{
  required_version = ">= 1.5.0"
  required_providers {{
    azurerm = {{
      source  = "hashicorp/azurerm"
      version = "~> 3.90.0"
    }}
  }}
}}

provider "azurerm" {{
  features {{}}
}}

resource "azurerm_resource_group" "main" {{
  name     = "rg-architect-prod"
  location = "{region}"
  tags = {{
    Environment = "Production"
    Engine      = "Cloud-AI-Architect-V2"
  }}
}}

resource "azurerm_virtual_network" "vnet" {{
  name                = "vnet-architect"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
}}

resource "azurerm_subnet" "app_subnet" {{
  name                 = "snet-application"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}}
"""
        if has_hybrid:
            tf += f"""
# Dedicated Hybrid Datacenter Connectivity
resource "azurerm_express_route_circuit" "erc" {{
  name                  = "erc-onprem-interconnect"
  resource_group_name   = azurerm_resource_group.main.name
  location              = azurerm_resource_group.main.location
  service_provider_name = "Equinix"
  peering_location      = "Mumbai"
  bandwidth_in_mbps     = 1000
  sku {{
    tier   = "Standard"
    family = "MeteredData"
  }}
}}
"""
        if has_db:
            if db_type == "sql-server":
                tf += f"""
# Enterprise SQL Server on Azure
resource "azurerm_mssql_server" "sql_server" {{
  name                         = "sql-architect-primary"
  resource_group_name          = azurerm_resource_group.main.name
  location                     = azurerm_resource_group.main.location
  version                      = "12.0"
  administrator_login          = "cloudadmin"
  administrator_login_password = "ChangeMeSuperSecure2026!"
  minimum_tls_version          = "1.2"
  azuread_administrator {{
    login_username = "EntraID-Admin"
    object_id      = "00000000-0000-0000-0000-000000000000"
  }}
}}

resource "azurerm_mssql_database" "sql_db" {{
  name      = "db-production"
  server_id = azurerm_mssql_server.sql_server.id
  sku_name  = "GP_Gen5_4"
}}
"""
            else:
                tf += f"""
# Flexible PostgreSQL Server on Azure
resource "azurerm_postgresql_flexible_server" "postgres" {{
  name                   = "psql-architect-primary"
  resource_group_name    = azurerm_resource_group.main.name
  location               = azurerm_resource_group.main.location
  version                = "15"
  delegated_subnet_id    = azurerm_subnet.app_subnet.id
  administrator_login    = "psqladmin"
  administrator_password = "ChangeMeSuperSecure2026!"
  sku_name               = "GP_Standard_D4ds_v4"
}}
"""
        if has_cache:
            tf += """
resource "azurerm_redis_cache" "redis" {
  name                = "redis-architect-cache"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  capacity            = 2
  family              = "C"
  sku_name            = "Standard"
  enable_non_ssl_port = false
  minimum_tls_version = "1.2"
}
"""
        if has_storage:
            tf += """
resource "azurerm_storage_account" "storage" {
  name                     = "starchitectmedia2026"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "ZRS"
  min_tls_version          = "TLS1_2"
}
"""
        return tf.strip()

    elif pid == "aws":
        region = "ap-south-1" if "india" in region_raw.lower() else "us-east-1"
        tf = f"""# Cloud AI Architect V2 - Generated Terraform Specification
# Target: Amazon Web Services (AWS)
# Region: {region}

terraform {{
  required_version = ">= 1.5.0"
  required_providers {{
    aws = {{
      source  = "hashicorp/aws"
      version = "~> 5.30.0"
    }}
  }}
}}

provider "aws" {{
  region = "{region}"
}}

resource "aws_vpc" "main" {{
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = {{
    Name = "vpc-architect-prod"
  }}
}}

resource "aws_subnet" "public" {{
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
}}
"""
        if has_db:
            tf += """
resource "aws_db_instance" "primary_db" {
  allocated_storage    = 100
  engine               = "postgres"
  engine_version       = "15"
  instance_class       = "db.r6g.large"
  username             = "masteruser"
  password             = "ChangeMeSuperSecure2026!"
  skip_final_snapshot  = true
  multi_az             = true
}
"""
        if has_storage:
            tf += """
resource "aws_s3_bucket" "assets" {
  bucket = "s3-architect-app-assets-prod"
}
"""
        return tf.strip()

    else:
        # Generic cloud terraform for Hetzner / DigitalOcean / OCI / GCP
        return f"""# Cloud AI Architect V2 - Generated Terraform Specification
# Target: {provider.get('name')}
# Architecture Stack: {services.get('compute')} + {services.get('loadBalancer')}

terraform {{
  required_version = ">= 1.5.0"
}}

# Automated provisioning configuration for {provider.get('shortName')}
# Active Capabilities:
# - Database: {services.get('database', {}).get(db_type, 'Managed Data Store')}
# - In-Memory Cache: {services.get('cache', 'None')}
# - Object Storage: {services.get('objectStorage', 'None')}
"""

def generate_dockerfile(workload: Dict[str, Any]) -> str:
    is_windows = workload.get("operatingSystem") == "windows"
    if is_windows:
        return """# Cloud AI Architect V2 - Optimized Production Dockerfile
# Base: Microsoft Windows Server Core (.NET Enterprise Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:8.0-windowsservercore-ltsc2022 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0-windowsservercore-ltsc2022 AS build
WORKDIR /src
COPY ["EnterpriseApp.csproj", "./"]
RUN dotnet restore "./EnterpriseApp.csproj"
COPY . .
RUN dotnet build "EnterpriseApp.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "EnterpriseApp.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EnterpriseApp.dll"]
"""
    else:
        return """# Cloud AI Architect V2 - Optimized Multi-Stage Linux Container
# Lightweight, secure non-root alpine image
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

USER nextjs
EXPOSE 3000
CMD ["node", "dist/index.js"]
"""

def generate_docker_compose(workload: Dict[str, Any]) -> str:
    has_db = workload.get("database", {}).get("required", False)
    db_type = workload.get("database", {}).get("type", "sql-postgres")
    has_cache = workload.get("cache", {}).get("required", False)
    has_workers = workload.get("scheduledJobs", {}).get("required", False) or workload.get("backgroundWorkers", {}).get("required", False)

    compose = """version: '3.8'

services:
  app:
    build: .
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
"""
    if has_db:
        compose += "      - DATABASE_URL=postgres://user:password@db:5432/app_production\n"
    if has_cache:
        compose += "      - REDIS_URL=redis://cache:6379\n"

    if has_db:
        if db_type == "sql-server":
            compose += """
  db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    restart: always
    environment:
      - ACCEPT_EULA=Y
      - MSSQL_SA_PASSWORD=ChangeMeSuperSecure2026!
    ports:
      - "1433:1433"
    volumes:
      - mssql_data:/var/opt/mssql
"""
        else:
            compose += """
  db:
    image: postgres:15-alpine
    restart: always
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=app_production
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
"""
    if has_cache:
        compose += """
  cache:
    image: redis:7-alpine
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
"""
    if has_workers:
        compose += """
  worker:
    build: .
    command: npm run worker
    restart: unless-stopped
    environment:
      - ROLE=background_worker
"""

    compose += "\nvolumes:\n"
    if has_db:
        compose += "  mssql_data:\n" if db_type == "sql-server" else "  postgres_data:\n"
    if has_cache:
        compose += "  redis_data:\n"

    return compose.strip()

def generate_cloud_init(workload: Dict[str, Any], provider: Dict[str, Any]) -> str:
    pname = provider.get("name", "Cloud Server")
    return f"""#cloud-config
# Cloud AI Architect V2 - Automated Host Initialization
# Target: {pname}
package_update: true
package_upgrade: true

packages:
  - curl
  - git
  - ufw
  - docker.io
  - docker-compose-plugin
  - htop

groups:
  - docker

users:
  - default
  - name: deployer
    gecos: Deployment Automation User
    groups: [sudo, docker]
    shell: /bin/bash
    sudo: ALL=(ALL) NOPASSWD:ALL

runcmd:
  - systemctl enable docker
  - systemctl start docker
  - ufw default deny incoming
  - ufw default allow outgoing
  - ufw allow 22/tcp
  - ufw allow 80/tcp
  - ufw allow 443/tcp
  - ufw --force enable
  - echo "Cloud AI Architect node initialized successfully on {pname}." > /etc/motd
"""
