# Cloud AI Architect ☁️

**Autonomous Multi-Cloud Infrastructure Design**  
*"Don't just calculate cloud costs. Architect your stack autonomously."*

This web platform implements the 15-slide pitch deck pipeline:
1. **Requirement Intake & NLP Heuristics:** Natural language requirement prompt with quick case study presets (*Momo Delivery App*, *Real-Time Chat*, *Exam Results 500k Spike*, *B2B SaaS*).
2. **Interactive Stress Sliders:** Real-time controls for Monthly Budget (₹ INR), Daily Active Users (DAU), Peak Surge Multiplier, and Workload Tags.
3. **Deterministic Multi-Cloud Scoring Matrix:** Evaluates Cloud Run + Supabase, AWS Lambda, Modern PaaS, and Traditional EC2/RDS across Budget Adherence (35%), DevOps Simplicity (35%), and Performance Elasticity (30%).
4. **TCO Pricing & Savings Model:** Displays low-vs-peak monthly cost in ₹ INR and calculates exact monthly savings vs traditional baseline infrastructure.
5. **Proactive Billing Trap Detector:** Flags silent cost traps like idle AWS NAT Gateways (~₹2,800/mo), provisioned DBs (~₹1,900/mo), and egress fees.
6. **1-Click Infrastructure as Code:** Exports production-ready `Dockerfile`, `docker-compose.yml`, and Terraform `main.tf`.

---

## How to Run

### Via Python 3 (Recommended)
```powershell
cd "C:\Users\PUNJ PANDEY\.gemini\antigravity\scratch\cloud_ai_architect"
python serve.py
```
Open **`http://localhost:3000`** in your browser.

### Direct Browser Launch
Double-click [`index.html`](./index.html) to open directly in Google Chrome or Edge without any server setup.
