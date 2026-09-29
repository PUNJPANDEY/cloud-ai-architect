"""
Cloud AI Architect V2 - Workload Extraction & Natural Language Parser
Converts unstructured English workload prompts into a strictly structured technical model.

Features:
- Robust multi-currency budget parsing (INR Lakhs, Indian commas ₹2,00,000, USD $500, etc.)
- DAU and user volume extraction (e.g. 180,000 daily active employees, 2k DAU, 1.5M users)
- Full coordinated natural language negation resolution with strict precedence
- Vendor ecosystem affinity detection (Microsoft, AWS, GCP, Oracle, Linux/OSS)
- Capacity sizing derivations (RPS, network bandwidth, storage)
"""

import re
from typing import Dict, Any, List, Optional, Tuple

USD_TO_INR_RATE = 86.50

def parse_currency_amount(text: str) -> Optional[Tuple[float, str, float]]:
    """
    Extract budget amount, currency ('INR' or 'USD'), and normalized USD amount.
    Handles Indian numbering with commas: ₹2,00,000, ₹80,000, ₹1,50,000, ₹1 Lakh, ₹20 Lakhs.
    Handles USD: $1,200, $500, 5000 USD.
    Returns: (amount, currency, amount_usd) or None.
    """
    clean_text = text.replace('\xa0', ' ')

    # 1. Indian Lakhs / Crores: e.g. "₹20 Lakhs", "20 lakh", "₹ 1.5 Lakh", "50 lakhs inr"
    lakh_match = re.search(
        r'(?:(?:₹|rs\.?|inr)\s*)?([0-9]+(?:\.[0-9]+)?)\s*(?:lakhs?|lacs?|lac)(?:\s*(?:inr|rs\.?|₹))?',
        clean_text,
        re.IGNORECASE
    )
    if lakh_match:
        val = float(lakh_match.group(1)) * 100000.0
        return (val, "INR", round(val / USD_TO_INR_RATE, 2))

    crore_match = re.search(
        r'(?:(?:₹|rs\.?|inr)\s*)?([0-9]+(?:\.[0-9]+)?)\s*(?:crores?|cr)(?:\s*(?:inr|rs\.?|₹))?',
        clean_text,
        re.IGNORECASE
    )
    if crore_match:
        val = float(crore_match.group(1)) * 10000000.0
        return (val, "INR", round(val / USD_TO_INR_RATE, 2))

    # 2. Explicit INR with currency symbol or keyword: e.g. ₹2,00,000 or Rs. 80,000 or 50,000 INR
    inr_symbol_match = re.search(
        r'(?:₹|rs\.?|inr)\s*([0-9]{1,3}(?:,[0-9]{2,3})+|[0-9]+)(?:\s*(?:k|thousand))?',
        clean_text,
        re.IGNORECASE
    )
    if inr_symbol_match:
        raw_num = inr_symbol_match.group(1).replace(',', '')
        val = float(raw_num)
        if 'k' in inr_symbol_match.group(0).lower() or 'thousand' in inr_symbol_match.group(0).lower():
            val *= 1000.0
        return (val, "INR", round(val / USD_TO_INR_RATE, 2))

    # 3. Explicit USD ($500, $2,000, 1500 USD)
    usd_match = re.search(
        r'(?:\$\s*([0-9]{1,3}(?:,[0-9]{3})+|[0-9]+(?:\.[0-9]+)?)(?:\s*(?:k|thousand))?)|(?:([0-9]{1,3}(?:,[0-9]{3})+|[0-9]+)\s*(?:usd|dollars))',
        clean_text,
        re.IGNORECASE
    )
    if usd_match:
        raw_num = (usd_match.group(1) or usd_match.group(2)).replace(',', '')
        val = float(raw_num)
        if 'k' in (usd_match.group(0) or '').lower() or 'thousand' in (usd_match.group(0) or '').lower():
            val *= 1000.0
        return (val, "USD", round(val, 2))

    # 4. Contextual "budget of 50000" (if text mentions INR / Rupees elsewhere, treat as INR; else USD if <= 5000)
    generic_budget_match = re.search(
        r'budget\s*(?:of|is|capped at|limit(?:ed to)?|:)?\s*([0-9]{1,3}(?:,[0-9]{2,3})+|[0-9]+)',
        clean_text,
        re.IGNORECASE
    )
    if generic_budget_match:
        val = float(generic_budget_match.group(1).replace(',', ''))
        if re.search(r'\b(inr|rupees?|india|mumbai|delhi)\b', clean_text, re.IGNORECASE) or val >= 10000:
            return (val, "INR", round(val / USD_TO_INR_RATE, 2))
        return (val, "USD", round(val, 2))

    return None

def parse_dau(text: str) -> Optional[int]:
    """
    Extract daily active users / employees / visitors.
    e.g. "180,000 daily active employees", "2,000 DAU", "50k users", "1.5M daily active users"
    """
    patterns = [
        r'([0-9]+(?:\.[0-9]+)?)\s*(?:\b(?:m|million)\b)\s*(?:daily\s+active\s+(?:users|employees|visitors|people)|dau|users|employees)',
        r'([0-9]+(?:\.[0-9]+)?)\s*(?:\b(?:k|thousand)\b)\s*(?:daily\s+active\s+(?:users|employees|visitors|people)|dau|users|employees)',
        r'([0-9]{1,3}(?:,[0-9]{3})+|[0-9]+)\s*(?:daily\s+active\s+(?:users|employees|visitors|people)|dau|active\s+employees|users|employees|visitors)',
        r'(?:serving|supporting|for)\s+([0-9]{1,3}(?:,[0-9]{3})+|[0-9]+)\s+(?:users|employees|clients|tenants)'
    ]

    for pat in patterns:
        m = re.search(pat, text, re.IGNORECASE)
        if m:
            raw = m.group(1).replace(',', '')
            val = float(raw)
            matched_str = m.group(0).lower()
            if re.search(r'\b(?:m|million)\b', matched_str):
                val *= 1000000
            elif re.search(r'\b(?:k|thousand)\b', matched_str):
                val *= 1000
            return int(val)

    # Simple DAU fallback if labeled: e.g. "DAU: 25000"
    m_labeled = re.search(r'\bdau\s*[:=]\s*([0-9]{1,3}(?:,[0-9]{3})+|[0-9]+)', text, re.IGNORECASE)
    if m_labeled:
        return int(m_labeled.group(1).replace(',', ''))

    return None

def parse_traffic_surge(text: str) -> Optional[int]:
    """
    Extract traffic surge multiplier.
    Handles:
    - Unicode & ASCII: "4×", "4x", "4X", "4 ×", "4 x"
    - Natural language: "traffic can surge to 4×", "surge up to 4x", "surge to 4x"
    - Word numbers: "four times", "quadruple", "4-fold", "triple", "three times", "double", "two times", "5-fold", "five times"
    - Generic labeled: "traffic surge: 4", "surge: 4x"
    """
    clean_text = text.replace('\xa0', ' ')

    # 1. "surge [up to / to / of] N[x/×]" e.g. "traffic can surge to 4×", "surge to 4x"
    m_surge_to = re.search(r'(?:traffic\s+can\s+surge|surge\s+up|surge)\s+(?:to|up\s+to|by|of)?\s*([0-9]+)\s*[\u00d7xX]?', clean_text, re.IGNORECASE)
    if m_surge_to and m_surge_to.group(1):
        val = int(m_surge_to.group(1))
        if 1 <= val <= 50:
            return min(10, max(1, val))

    # 2. Direct pattern: "([0-9]+)\s*[\u00d7xX]" e.g. "4×", "4x", "10x", "3× peak"
    m_direct = re.search(r'([0-9]+)\s*[\u00d7xX](?:\s*(?:traffic\s+surge|surge|spike|peak|load))?', clean_text, re.IGNORECASE)
    if m_direct:
        val = int(m_direct.group(1))
        if 1 <= val <= 50:
            return min(10, max(1, val))

    # 3. Labeled: "traffic surge: 4", "surge: 3"
    m_labeled = re.search(r'(?:traffic\s*surge|surge\s*multiplier|peak\s*surge)\s*[:=]\s*([0-9]+)\s*[\u00d7xX]?', clean_text, re.IGNORECASE)
    if m_labeled:
        val = int(m_labeled.group(1))
        return min(10, max(1, val))

    # 4. Word-based multipliers
    word_map = [
        (r'\b(?:quadruple|four\s+times|4-fold)\b', 4),
        (r'\b(?:triple|three\s+times|3-fold)\b', 3),
        (r'\b(?:double|two\s+times|twice|2-fold)\b', 2),
        (r'\b(?:five\s+times|5-fold|quintuple)\b', 5),
        (r'\b(?:ten\s+times|10-fold)\b', 10),
    ]
    for pattern, val in word_map:
        if re.search(pattern, clean_text, re.IGNORECASE):
            return val

    # 5. Descriptive keywords fallback
    if re.search(r'\b(high traffic surge|heavy spikes|flash sale|traffic spikes|extreme load)\b', clean_text, re.IGNORECASE):
        return 4
    if re.search(r'\b(moderate surge|traffic bursts)\b', clean_text, re.IGNORECASE):
        return 2

    return None

def parse_region(text: str) -> Optional[str]:
    """
    Extract target geographical region.
    """
    if re.search(r'\b(india|mumbai|delhi|hyderabad|bengaluru|bangalore)\b', text, re.IGNORECASE):
        return "India (ap-south-1 / Central India)"
    if re.search(r'\b(germany|frankfurt|europe|eu|finland|ireland|london|uk)\b', text, re.IGNORECASE):
        return "Europe (eu-central / Frankfurt)"
    if re.search(r'\b(us-east|virginia|us-west|oregon|california|united states|usa)\b', text, re.IGNORECASE):
        return "US East / North America"
    if re.search(r'\b(singapore|tokyo|japan|australia|sydney|apac|asia)\b', text, re.IGNORECASE):
        return "Asia Pacific (Singapore/Tokyo)"
    return None

def extract_negated_terms(text: str) -> List[str]:
    """
    Extract all capability keywords that fall within an explicit natural-language negation scope.
    Handles coordinated negation clauses such as:
    - "No WebSockets, GPU inference, or video processing are required."
    - "No WebSockets, GPU, or media processing."
    - "WebSockets, GPU inference, and video processing are not required."
    - "Without WebSockets, GPU inference, or video processing."
    - "The workload does not require WebSockets, GPU inference, or video processing."
    - "Neither WebSockets nor GPU inference"
    - "Zero GPU, no background jobs"
    """
    negated_matches = set()
    sentences = re.split(r'[.;!\n]', text)
    for sent in sentences:
        s = sent.strip()
        if not s:
            continue
        # Split on contrast words like 'but', 'however', 'although'
        parts = re.split(r'\b(?:but|however|although|whereas)\b', s, flags=re.IGNORECASE)
        for part in parts:
            p = part.strip()
            # 1. Prefix negation
            m_pre = re.search(
                r'\b(?:no|without|zero|neither|does\s+not\s+(?:require|need|use)|doesn\'t\s+(?:require|need|use)|not\s+requiring)\s+(.+)',
                p,
                re.IGNORECASE
            )
            if m_pre:
                clause = m_pre.group(1)
                clause = re.sub(
                    r'\s+(?:are|is)?\s*(?:not\s+required|not\s+needed|required|needed|disabled|unnecessary).*$',
                    '',
                    clause,
                    flags=re.IGNORECASE
                )
                sub_items = re.split(r'[,/]|(?:\s+(?:and|or|nor)\s+)', clause)
                for item in sub_items:
                    item_clean = item.strip().lower()
                    if item_clean:
                        negated_matches.add(item_clean)
                continue

            # 2. Suffix negation
            m_suf = re.search(
                r'(.+?)\s+(?:are|is)\s+(?:not\s+required|not\s+needed|not\s+used|not\s+supported|unnecessary|disabled)',
                p,
                re.IGNORECASE
            )
            if not m_suf:
                m_suf = re.search(r'(.+?)\s+(?:not\s+required|not\s+needed)', p, re.IGNORECASE)
            if not m_suf:
                m_suf = re.search(r'(.+?)\s+(?:is|are)\s+not(?:\s+(?:required|needed|used|supported|necessary|wanted))?[\.\,\;]?$', p, re.IGNORECASE)
            if m_suf:
                clause = m_suf.group(1)
                sub_items = re.split(r'[,/]|(?:\s+(?:and|or|nor)\s+)', clause)
                for item in sub_items:
                    item_clean = item.strip().lower()
                    if item_clean:
                        negated_matches.add(item_clean)

    return list(negated_matches)

def is_capability_negated(capability_keywords: List[str], negated_clauses: List[str]) -> bool:
    """
    Check if any of the capability keywords appear inside any negated clause.
    """
    for clause in negated_clauses:
        for kw in capability_keywords:
            if re.search(r'\b' + re.escape(kw) + r'\b', clause, re.IGNORECASE):
                return True
    return False

def is_capability_positively_mentioned(capability_keywords: List[str], text: str) -> bool:
    """
    Check if any keyword is positively present in the text.
    """
    for kw in capability_keywords:
        if re.search(r'\b' + re.escape(kw) + r'\b', text, re.IGNORECASE):
            return True
    return False

def parse_workload_requirements(
    prompt: str,
    override_budget: Optional[float] = None,
    override_dau: Optional[int] = None,
    override_region: Optional[str] = None,
    override_surge: Optional[int] = None
) -> Dict[str, Any]:
    """
    Primary NLP Workload Extraction Engine.
    Converts raw text + optional structured overrides into a validated, deterministic StructuredWorkload model.
    """
    if not prompt or not prompt.strip():
        return {
            "status": "awaiting_input",
            "error": "Empty prompt provided"
        }

    clean_prompt = prompt.strip()
    negated_clauses = extract_negated_terms(clean_prompt)
    extracted_keywords = []
    negated_capabilities_list = []

    # 1. Budget extraction
    parsed_budget = parse_currency_amount(clean_prompt)
    if override_budget is not None and override_budget > 0:
        monthly_budget = float(override_budget)
        budget_currency = "INR" if monthly_budget > 10000 else "USD"
        monthly_budget_usd = round(monthly_budget / USD_TO_INR_RATE, 2) if budget_currency == "INR" else round(monthly_budget, 2)
    elif parsed_budget:
        monthly_budget, budget_currency, monthly_budget_usd = parsed_budget
    else:
        monthly_budget = None
        budget_currency = "USD"
        monthly_budget_usd = None

    # 2. DAU extraction
    parsed_dau = parse_dau(clean_prompt)
    dau = override_dau if (override_dau is not None and override_dau > 0) else parsed_dau

    # 3. Traffic Surge
    parsed_surge = parse_traffic_surge(clean_prompt)
    traffic_surge = override_surge if (override_surge is not None and override_surge > 0) else (parsed_surge or 1)

    # 4. Region
    parsed_region = parse_region(clean_prompt)
    region = override_region if (override_region and override_region != "auto") else (parsed_region or "Global / Multi-Region")

    # 5. Technical Capabilities with Strict Negation Priority
    # Capability: GPU / Model Inference
    gpu_kws = ["gpu", "gpus", "machine learning", "ml", "deep learning", "model inference", "llm", "ai platform", "vertex", "tensor", "pytorch"]
    gpu_neg = is_capability_negated(gpu_kws, negated_clauses)
    gpu_pos = is_capability_positively_mentioned(gpu_kws, clean_prompt)
    gpu_required = gpu_pos and not gpu_neg
    if gpu_neg:
        negated_capabilities_list.append("GPU / Model Inference")
    elif gpu_required:
        extracted_keywords.append("GPU Acceleration")

    # Capability: WebSockets / Live Connections
    ws_kws = ["websocket", "websockets", "live", "real-time", "realtime", "socket.io", "bidirectional", "live chat", "streaming updates"]
    ws_neg = is_capability_negated(ws_kws, negated_clauses)
    ws_pos = is_capability_positively_mentioned(ws_kws, clean_prompt)
    websockets_required = ws_pos and not ws_neg
    if ws_neg:
        negated_capabilities_list.append("WebSockets / Live Streaming")
    elif websockets_required:
        extracted_keywords.append("WebSockets")

    # Capability: Media / Video / Image Processing
    media_kws = ["media", "video", "videos", "video processing", "transcoding", "media uploads", "audio", "image processing", "ffmpeg"]
    media_neg = is_capability_negated(media_kws, negated_clauses)
    media_pos = is_capability_positively_mentioned(media_kws, clean_prompt)
    media_required = media_pos and not media_neg
    if media_neg:
        negated_capabilities_list.append("Media / Video Processing")
    elif media_required:
        extracted_keywords.append("Media Processing")

    # Capability: Scheduled Jobs / Cron / Background Workers
    jobs_kws = [
        "cron", "scheduled jobs", "scheduled job", "scheduled tasks", "background workers",
        "background jobs", "report generation", "celery", "worker queue", "nightly reports",
        "payroll jobs", "reporting jobs", "scheduled payroll", "scheduled report", "scheduled reporting",
        "scheduled batch", "batch processing", "batch jobs", "recurring jobs", "recurring tasks",
        "job queues", "worker queues", "task queues", "scheduled"
    ]
    jobs_neg = is_capability_negated(jobs_kws, negated_clauses)
    jobs_pos = is_capability_positively_mentioned(jobs_kws, clean_prompt) or bool(
        re.search(r'\b(?:scheduled|recurring|nightly|periodic)\s+[\w\s]{0,30}?(?:jobs|tasks|reports|runs|workers|processing|payroll)\b', clean_prompt, re.IGNORECASE)
    )
    jobs_required = jobs_pos and not jobs_neg
    if jobs_neg:
        negated_capabilities_list.append("Scheduled Jobs / Background Workers")
    elif jobs_required:
        extracted_keywords.append("Scheduled Jobs / Workers")

    # Capability: Database
    db_neg = is_capability_negated(["database", "db", "sql", "postgres", "mysql", "sql server", "relational"], negated_clauses)
    db_type = "none"
    if not db_neg:
        if re.search(r'\b(sql server|mssql|t-sql|azure sql)\b', clean_prompt, re.IGNORECASE):
            db_type = "sql-server"
            extracted_keywords.append("SQL Server")
        elif re.search(r'\b(oracle database|oracle db|autonomous database|exadata)\b', clean_prompt, re.IGNORECASE):
            db_type = "oracle-db"
            extracted_keywords.append("Oracle Database")
        elif re.search(r'\b(postgres|postgresql|timescaledb|alloydb)\b', clean_prompt, re.IGNORECASE):
            db_type = "sql-postgres"
            extracted_keywords.append("PostgreSQL")
        elif re.search(r'\b(mysql|mariadb|heatwave)\b', clean_prompt, re.IGNORECASE):
            db_type = "sql-mysql"
            extracted_keywords.append("MySQL")
        elif re.search(r'\b(mongodb|dynamodb|cosmosdb|firestore|nosql)\b', clean_prompt, re.IGNORECASE):
            db_type = "nosql-document"
            extracted_keywords.append("NoSQL Document DB")
        elif re.search(r'\b(sql|relational|rdbms)\b', clean_prompt, re.IGNORECASE):
            db_type = "sql-postgres"
            extracted_keywords.append("Relational SQL")
        else:
            # Default to postgres if standard application with users
            db_type = "sql-postgres" if (dau and dau > 0) else "none"
    else:
        negated_capabilities_list.append("Database Layer")

    # Capability: Cache
    cache_neg = is_capability_negated(["cache", "caching", "redis", "memcached"], negated_clauses)
    cache_pos = is_capability_positively_mentioned(["redis", "cache", "caching", "memcached"], clean_prompt)
    cache_required = (cache_pos or (dau and dau >= 50000)) and not cache_neg

    # Capability: Operating System & Ecosystem Specifics
    # Windows
    is_windows = bool(re.search(r'\b(windows server|windows vm|iis|dotnet framework|\.net framework|active directory)\b', clean_prompt, re.IGNORECASE))
    if is_windows:
        extracted_keywords.append("Windows Server")

    # Microsoft Ecosystem
    is_microsoft_ecosystem = bool(re.search(
        r'\b(microsoft 365|m365|office 365|o365|microsoft entra id|entra id|azure ad|active directory|power bi|teams|windows server|sql server)\b',
        clean_prompt,
        re.IGNORECASE
    ))
    if is_microsoft_ecosystem:
        extracted_keywords.append("Microsoft Enterprise Ecosystem")

    # AWS Ecosystem
    is_aws_ecosystem = bool(re.search(
        r'\b(aws|amazon web services|dynamodb|aurora|lambda|sqs|kinesis|fargate|route 53|athena)\b',
        clean_prompt,
        re.IGNORECASE
    ))
    if is_aws_ecosystem:
        extracted_keywords.append("AWS Cloud Ecosystem")

    # GCP Ecosystem
    is_gcp_ecosystem = bool(re.search(
        r'\b(gcp|google cloud|bigquery|cloud run|vertex ai|cloud tasks|alloydb|spanner|firestore)\b',
        clean_prompt,
        re.IGNORECASE
    ))
    if is_gcp_ecosystem:
        extracted_keywords.append("Google Cloud Ecosystem")

    # Oracle Ecosystem
    is_oracle_ecosystem = bool(re.search(
        r'\b(oracle|oci|autonomous database|exadata|heatwave)\b',
        clean_prompt,
        re.IGNORECASE
    ))
    if is_oracle_ecosystem:
        extracted_keywords.append("Oracle Database Ecosystem")

    # IBM Ecosystem
    is_ibm_ecosystem = bool(re.search(
        r'\b(ibm cloud|openshift|red hat|mainframe|ibm mq)\b',
        clean_prompt,
        re.IGNORECASE
    ))
    if is_ibm_ecosystem:
        extracted_keywords.append("IBM Enterprise Ecosystem")

    # Multi-Region Requirement
    is_multi_region = bool(re.search(
        r'\b(multi-region|multi region|cross-region|global active-active|global failover)\b',
        clean_prompt,
        re.IGNORECASE
    ))
    if is_multi_region:
        extracted_keywords.append("Multi-Region Architecture")

    # Hybrid on-prem connectivity
    is_hybrid = bool(re.search(
        r'\b(hybrid connectivity|existing datacenter|on-premises|on-prem|expressroute|direct connect|site-to-site|hybrid on-prem|dedicated circuit)\b',
        clean_prompt,
        re.IGNORECASE
    ))
    if is_hybrid:
        extracted_keywords.append("Hybrid On-Premises Connectivity")

    # Kubernetes / Containers / Serverless
    is_k8s = bool(re.search(r'\b(kubernetes|k8s|gke|eks|aks|doks|helm)\b', clean_prompt, re.IGNORECASE))
    if is_k8s:
        extracted_keywords.append("Kubernetes")

    is_serverless = bool(re.search(r'\b(serverless|cloud run|lambda|fargate|azure functions)\b', clean_prompt, re.IGNORECASE))
    if is_serverless:
        extracted_keywords.append("Serverless Architecture")

    # Compliance
    compliance_list = []
    if re.search(r'\b(hipaa)\b', clean_prompt, re.IGNORECASE):
        compliance_list.append("hipaa")
        extracted_keywords.append("HIPAA Compliance")
    if re.search(r'\b(pci|pci-dss)\b', clean_prompt, re.IGNORECASE):
        compliance_list.append("pci-dss")
        extracted_keywords.append("PCI-DSS")
    if re.search(r'\b(gdpr|european privacy)\b', clean_prompt, re.IGNORECASE):
        compliance_list.append("gdpr")
        extracted_keywords.append("GDPR")
    if re.search(r'\b(rbi|rbi-india|indian banking|data localization)\b', clean_prompt, re.IGNORECASE):
        compliance_list.append("rbi-india")
        extracted_keywords.append("RBI India Data Localization")
    if re.search(r'\b(fedramp|government)\b', clean_prompt, re.IGNORECASE):
        compliance_list.append("fedramp")
        extracted_keywords.append("FedRAMP")
    if re.search(r'\b(soc2|soc 2)\b', clean_prompt, re.IGNORECASE):
        compliance_list.append("soc2")
        extracted_keywords.append("SOC 2")

    # High availability & SLA
    is_ha = bool(re.search(r'\b(high availability|99\.99%?|multi-az|multi-region|disaster recovery|fault tolerant)\b', clean_prompt, re.IGNORECASE))
    if is_ha:
        extracted_keywords.append("High Availability (Multi-AZ)")

    # Derived technical metrics from DAU
    # Derived technical metrics from DAU
    eff_dau = dau or 5000  # for sizing estimation calculation
    avg_rps = max(1, int((eff_dau * 12) / 86400))  # 12 reqs/day/user
    peak_rps = avg_rps * traffic_surge

    # Transparent, realistic bandwidth sizing
    explicit_bw_match = re.search(r'([0-9]+(?:\.[0-9]+)?)\s*(?:tb|terabytes?)\s*(?:egress|bandwidth|traffic|outbound)', clean_prompt, re.IGNORECASE)
    if explicit_bw_match:
        est_bandwidth_gb = int(float(explicit_bw_match.group(1)) * 1000)
        bw_basis = f"Explicitly requested {explicit_bw_match.group(1)} TB outbound bandwidth"
        bw_assumption = "User-specified outbound bandwidth requirement."
    else:
        explicit_bw_gb = re.search(r'([0-9]+)\s*(?:gb|gigabytes?)\s*(?:egress|bandwidth|traffic|outbound)', clean_prompt, re.IGNORECASE)
        if explicit_bw_gb:
            est_bandwidth_gb = int(explicit_bw_gb.group(1))
            bw_basis = f"Explicitly requested {est_bandwidth_gb} GB outbound bandwidth"
            bw_assumption = "User-specified outbound bandwidth requirement."
        elif media_required:
            est_bandwidth_gb = max(100, int(eff_dau * 0.015 * 30))
            bw_basis = f"Media/video delivery (~15 MB/user/day) × {eff_dau:,} DAU"
            bw_assumption = "High outbound streaming and uncompressed media asset distribution."
        else:
            # Transactional enterprise / web workload: compressed HTTP/2 payloads + PDF downloads
            est_bandwidth_gb = max(20, int((eff_dau * 0.00008 * 30) + (25 if jobs_required else 0)))
            bw_basis = f"Transactional APIs (~40 KB/req) and month-end PDF exports for {eff_dau:,} users"
            bw_assumption = "Compressed HTTP/2 API responses with edge caching; no uncompressed video streaming."

    # Transparent, realistic object storage sizing
    explicit_storage_tb = re.search(r'([0-9]+(?:\.[0-9]+)?)\s*(?:tb|terabytes?)\s*(?:storage|disk|bucket|object\s+storage)', clean_prompt, re.IGNORECASE)
    if explicit_storage_tb:
        est_storage_gb = int(float(explicit_storage_tb.group(1)) * 1000)
        storage_basis = f"Explicitly requested {explicit_storage_tb.group(1)} TB storage"
        storage_assumption = "User-specified storage volume requirement."
    else:
        explicit_storage_gb = re.search(r'([0-9]+)\s*(?:gb|gigabytes?)\s*(?:storage|disk|bucket|object\s+storage)', clean_prompt, re.IGNORECASE)
        if explicit_storage_gb:
            est_storage_gb = int(explicit_storage_gb.group(1))
            storage_basis = f"Explicitly requested {est_storage_gb} GB storage"
            storage_assumption = "User-specified storage volume requirement."
        elif media_required:
            est_storage_gb = max(100, int(eff_dau * 0.01 * 30))
            storage_basis = f"Raw video & image upload archives for {eff_dau:,} DAU"
            storage_assumption = "Persistent storage of uploaded video and media assets."
        else:
            # Enterprise documents & audit logs: ~1.5 MB per employee archive
            est_storage_gb = max(20, int(eff_dau * 0.0015))
            storage_basis = f"Employee payslip PDF archives & audit compliance for {eff_dau:,} employees"
            storage_assumption = "Structured document archiving with lifecycle tiering to cool blob storage."

    has_explicit_storage = bool(re.search(r'\b(object storage|s3|blob storage|file storage|bucket|document storage|attachment)\b', clean_prompt, re.IGNORECASE))
    storage_needed = media_required or has_explicit_storage or (dau is not None and dau >= 50000 and jobs_required)

    return {
        "status": "parsed",
        "rawPrompt": clean_prompt,
        "dailyActiveUsers": dau,
        "monthlyBudget": monthly_budget,
        "budgetCurrency": budget_currency,
        "monthlyBudgetUSD": monthly_budget_usd,
        "region": region,
        "trafficSurge": traffic_surge,
        "database": {
            "required": (db_type != "none"),
            "type": db_type,
            "highAvailability": is_ha
        },
        "cache": {
            "required": cache_required,
            "type": "redis" if cache_required else "none"
        },
        "objectStorage": {
            "required": storage_needed,
            "volumeGB": est_storage_gb,
            "basis": storage_basis,
            "assumption": storage_assumption
        },
        "websockets": {
            "required": websockets_required,
            "concurrency": int(peak_rps * 15) if websockets_required else 0
        },
        "mediaProcessing": {
            "required": media_required,
            "videoTranscoding": media_required
        },
        "gpuInference": {
            "required": gpu_required,
            "workloadType": "model-inference" if gpu_required else "none"
        },
        "scheduledJobs": {
            "required": jobs_required,
            "frequency": "daily" if jobs_required else "none"
        },
        "backgroundWorkers": {
            "required": jobs_required or media_required,
            "queueType": "cloud-queue" if (jobs_required or media_required) else "none"
        },
        "operatingSystem": "windows" if is_windows else "linux",
        "microsoftEcosystem": is_microsoft_ecosystem,
        "awsEcosystem": is_aws_ecosystem,
        "gcpEcosystem": is_gcp_ecosystem,
        "oracleEcosystem": is_oracle_ecosystem,
        "ibmEcosystem": is_ibm_ecosystem,
        "multiRegion": is_multi_region,
        "hybridConnectivity": is_hybrid,
        "kubernetes": is_k8s,
        "serverless": is_serverless,
        "highAvailability": is_ha,
        "compliance": compliance_list,
        "sizing": {
            "avgRPS": avg_rps,
            "peakRPS": peak_rps,
            "estimatedBandwidthGBMonth": est_bandwidth_gb,
            "bandwidthBasis": bw_basis,
            "bandwidthAssumption": bw_assumption,
            "estimatedStorageGB": est_storage_gb,
            "storageBasis": storage_basis,
            "storageAssumption": storage_assumption
        },
        "extractedKeywords": list(dict.fromkeys(extracted_keywords)),
        "negatedCapabilities": list(dict.fromkeys(negated_capabilities_list))
    }
