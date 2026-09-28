# ☁️ Cloud AI Architect V2

> **Deterministic Multi-Cloud Architecture & Cost Workstation**

Cloud AI Architect V2 (CAA V2) is an interactive cloud architecture decision-support workstation that transforms natural-language workload requirements into a structured technical model, evaluates the workload across **17 cloud providers**, synthesizes an architecture, estimates infrastructure economics, identifies architectural risks and hidden billing traps, and generates infrastructure templates and architecture documentation.

🌐 **Live Demo:** https://cloud-ai-architecv2.netlify.app/
---
## 📸 Dashboard Preview

![Cloud AI Architect V2 Dashboard](./Screenshot%202026-09-28%20235001.png)
### 🏗️ Architecture & Cost

![Architecture and Cost Analysis](./architecture-cost.png)

### ⚠️ Architecture Flaws & Risks

![Architecture Flaws and Risks](./architecture-flaws.png)

# 🧠 What Is Cloud AI Architect?

Choosing a cloud provider is rarely just a matter of comparing VM prices.

A real workload can involve:

- Application scale
- Daily active users
- Traffic surges
- Geographic requirements
- Database technology
- Caching
- Kubernetes
- WebSockets
- GPU inference
- Media processing
- Scheduled jobs
- High availability
- Disaster recovery
- Hybrid connectivity
- Security requirements
- Compliance requirements
- Infrastructure budget
- Operational complexity

Cloud AI Architect starts with the **workload itself**.

Instead of asking:

> "Which cloud is the best?"

CAA asks:

> **"What does this workload actually require, and which providers are technically suitable for it?"**

The application then converts those requirements into a structured workload model and runs a deterministic multi-cloud evaluation.

---

# 🚀 Core Workflow

```text
Natural-Language Workload
          │
          ▼
┌─────────────────────────┐
│ Requirement Extraction  │
└────────────┬────────────┘
             ▼
┌─────────────────────────┐
│ Structured Workload     │
│ Technical Model         │
└────────────┬────────────┘
             ▼
┌─────────────────────────┐
│ Capacity & Cost Sizing  │
└────────────┬────────────┘
             ▼
┌─────────────────────────┐
│ 17-Provider Evaluation  │
└────────────┬────────────┘
             ▼
┌─────────────────────────┐
│ Architecture Synthesis  │
└────────────┬────────────┘
             ▼
┌─────────────────────────┐
│ Risks & Billing Traps   │
└────────────┬────────────┘
             ▼
┌─────────────────────────┐
│ Trade-Off Analysis      │
└────────────┬────────────┘
             ▼
┌─────────────────────────┐
│ Recommendation + Cost   │
└────────────┬────────────┘
             ▼
┌─────────────────────────┐
│ IaC + ADR + Blueprint   │
└─────────────────────────┘
