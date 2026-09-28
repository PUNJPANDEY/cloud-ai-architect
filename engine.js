/**
 * Cloud AI Architect V2 — Single Source of Truth Application Engine
 * Pure deterministic architecture evaluation, state machine, reactive UI controllers,
 * Cloud Service Catalog, Architecture Flaws, Billing Traps, and Procurement Playbooks.
 * 
 * Visual Reference: Black, Electric Violet, Neon Lime, White Design System
 * #000000 : Black (Near-black backgrounds, deep glass surfaces)
 * #7D39EB : Electric Violet (Structural accents, borders, navigation highlights, icons)
 * #C6FF33 : Neon Lime (Important signals, scores, active tracks, primary CTA, metrics)
 * #FFFFFF : White (Crisp readable typography, primary text)
 */

// Central Single Source of Truth Application State
const appState = {
  status: "awaiting_input", // "awaiting_input" | "analyzing" | "results" | "error"
  currency: "INR",          // Default: INR per enterprise specification
  usdToInrRate: 86.50,      // Reference estimated exchange rate
  rawPrompt: "",
  structuredWorkload: null,
  evaluation: null,
  selectedIaCTab: "terraform",
  debugOpen: false,
  errorMessage: "",
  catalog: [],
  services: [],
  credits: [],
  scenarios: [],
  catalogFilter: {
    category: "all",
    provider: "all",
    search: ""
  }
};

// Built-in Developer Test Bench Fixtures (Test 1 is the exact enterprise HR workload)
const TEST_FIXTURES = [
  {
    id: "test-1",
    name: "TEST 1 — Microsoft Enterprise HR & Payroll (India)",
    desc: "180k employees, Windows Server, SQL Server, Entra ID, Hybrid on-prem, 4× surge, ₹8,00,000 budget, No GPU, No WebSockets, No Media",
    prompt: "A large enterprise HR and payroll platform serving 180,000 daily active employees. The company already relies heavily on Microsoft 365, Microsoft Entra ID, Active Directory, Windows Server, SQL Server, Power BI, and Teams. The application requires Windows-based application servers, SQL Server databases, Entra ID authentication, private networking, hybrid connectivity to an existing on-premises datacenter, high availability, and scheduled payroll/reporting jobs. Traffic can surge to 4× during monthly payroll periods. Deploy primarily in India with a monthly infrastructure budget of ₹8,00,000. No GPU inference, video processing, or WebSockets are required."
  },
  {
    id: "test-2",
    name: "TEST 2 — Generic Cloud SaaS",
    desc: "45k DAU, PostgreSQL, Redis, Object storage, 2× surge, ₹1,00,000 budget",
    prompt: "A modern B2B SaaS web application serving 45,000 daily active users with 2× traffic surge. Uses PostgreSQL, Redis caching, and object storage for user documents. No special vendor ecosystem, no GPU, no WebSockets. Monthly budget is ₹1,00,000."
  },
  {
    id: "test-3",
    name: "TEST 3 — High-Throughput AI/ML Platform",
    desc: "15k DAU, GPU model inference, Kubernetes, Object storage, ₹3,00,000 budget",
    prompt: "An AI inference platform serving 15,000 daily active users for LLM and computer vision model inference. Requires GPU acceleration, Kubernetes container orchestration, and high-performance object storage for model weights. Monthly budget is ₹3,00,000."
  },
  {
    id: "test-4",
    name: "TEST 4 — Bootstrapped Small MVP",
    desc: "2,000 DAU, PostgreSQL, Low budget of ₹10,000 / $120",
    prompt: "A small internal company dashboard for 2,000 daily active users. Uses PostgreSQL and basic authentication. No GPU, no video processing, and no WebSockets. Low monthly budget of ₹10,000."
  },
  {
    id: "test-5",
    name: "TEST 5 — Realtime Multiplayer Tool",
    desc: "80k DAU, WebSockets, Redis pub/sub, 4× surge, ₹2,00,000 budget",
    prompt: "A live collaborative multiplayer tool serving 80,000 daily active users with 4× traffic surge. Requires high-concurrency WebSockets, Redis pub/sub for real-time state sync, and background workers. No GPU inference required. Budget of ₹2,00,000."
  },
  {
    id: "test-6",
    name: "TEST 6 — Sovereign European Workload",
    desc: "30k DAU in Germany, GDPR strict, K3s, PostgreSQL, Hetzner/EU affinity",
    prompt: "A public health records platform hosted in Frankfurt Germany serving 30,000 daily active users. Strictly GDPR compliant, requires European data sovereignty, PostgreSQL database, and lightweight Kubernetes. Monthly budget of €800 or ₹75,000."
  }
];

// Document Ready Initialization
document.addEventListener("DOMContentLoaded", () => {
  renderEmptyState();
  initEventListeners();
  renderTestFixturesMenu();
  initSliders();
  fetchInitialCatalogData();
  checkBackendHealth();
});

// Check API Health
async function checkBackendHealth() {
  const badge = document.getElementById("backend-status-badge");
  const text = document.getElementById("backend-status-text");
  const dot = document.getElementById("backend-status-dot");
  if (!badge) return;

  try {
    const res = await fetch("/api/health");
    if (res.ok) {
      const data = await res.json();
      if (text) text.textContent = `${data.cloudsIndexed || 17} Clouds Indexed`;
      if (dot) dot.className = "status-dot status-dot-active";
    } else {
      if (text) text.textContent = "17 Clouds (Offline)";
    }
  } catch (e) {
    if (text) text.textContent = "17 Clouds (Local)";
  }
}

// Fetch Catalog, Scenarios, and Credits in background
async function fetchInitialCatalogData() {
  // Pre-seed immediately with client constants if available
  if (window.CLIENT_CLOUD_PROVIDERS && (!appState.catalog || appState.catalog.length === 0)) {
    appState.catalog = window.CLIENT_CLOUD_PROVIDERS;
    populateCatalogProviderDropdown();
  }
  if (window.CLIENT_CREDITS_DIRECTORY && (!appState.credits || appState.credits.length === 0)) {
    appState.credits = window.CLIENT_CREDITS_DIRECTORY;
  }
  if (window.CLIENT_PROCUREMENT_SCENARIOS && (!appState.scenarios || appState.scenarios.length === 0)) {
    appState.scenarios = window.CLIENT_PROCUREMENT_SCENARIOS;
    renderProcurementScenarios(appState.scenarios);
  }

  try {
    const [catRes, credRes, scenRes] = await Promise.all([
      fetch("/api/catalog").catch(() => null),
      fetch("/api/catalog/credits").catch(() => null),
      fetch("/api/catalog/scenarios").catch(() => null)
    ]);

    if (catRes && catRes.ok) {
      const catData = await catRes.json();
      if (catData.providers && catData.providers.length > 0) {
        appState.catalog = catData.providers;
      }
      if (catData.services && catData.services.length > 0) {
        appState.services = catData.services;
      }
      populateCatalogProviderDropdown();
      // If catalog modal is already open, refresh view
      const modal = document.getElementById("catalog-modal");
      if (modal && !modal.classList.contains("hidden")) {
        renderCatalogServices();
      }
    }
    if (credRes && credRes.ok) {
      const credData = await credRes.json();
      if (credData.programs && credData.programs.length > 0) {
        appState.credits = credData.programs;
      }
    }
    if (scenRes && scenRes.ok) {
      const scenData = await scenRes.json();
      if (scenData.scenarios && scenData.scenarios.length > 0) {
        appState.scenarios = scenData.scenarios;
        renderProcurementScenarios(appState.scenarios);
      }
    }
  } catch (e) {
    console.warn("Could not fetch remote catalog data; local fallbacks will be used.", e);
  }
}

// Event Listeners Setup
function initEventListeners() {
  const analyzeBtn = document.getElementById("btn-analyze-workload");
  const promptInput = document.getElementById("workload-prompt-input");
  const clearBtn = document.getElementById("btn-clear-workload");

  if (analyzeBtn) {
    analyzeBtn.addEventListener("click", () => handleWorkloadSubmit());
  }

  if (promptInput) {
    promptInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleWorkloadSubmit();
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (promptInput) promptInput.value = "";
      clearEvaluationState();
    });
  }

  // Central Currency Switchers
  const inrBtn = document.getElementById("btn-currency-inr");
  const usdBtn = document.getElementById("btn-currency-usd");

  if (inrBtn) {
    inrBtn.addEventListener("click", () => setCurrency("INR"));
  }
  if (usdBtn) {
    usdBtn.addEventListener("click", () => setCurrency("USD"));
  }

  // Code Tab Triggers
  const codeTabs = document.querySelectorAll(".code-tab-trigger");
  codeTabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
      const format = e.target.getAttribute("data-format");
      switchIaCTab(format);
    });
  });

  const copyCodeBtn = document.getElementById("btn-copy-code");
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener("click", copyCurrentCode);
  }

  // Debug Drawer Toggle
  const debugToggle = document.getElementById("btn-toggle-debug");
  const debugDrawer = document.getElementById("debug-drawer-content");
  if (debugToggle && debugDrawer) {
    debugToggle.addEventListener("click", () => {
      appState.debugOpen = !appState.debugOpen;
      debugDrawer.classList.toggle("hidden", !appState.debugOpen);
    });
  }

  // Modals Open Triggers
  const openCatalogBtn = document.getElementById("btn-open-catalog");
  if (openCatalogBtn) {
    openCatalogBtn.addEventListener("click", openCatalogModal);
  }

  const openCreditsBtn = document.getElementById("btn-open-credits");
  if (openCreditsBtn) {
    openCreditsBtn.addEventListener("click", openCreditsModal);
  }

  const openSavedBtn = document.getElementById("btn-open-saved");
  if (openSavedBtn) {
    openSavedBtn.addEventListener("click", openSavedBlueprintsModal);
  }

  // Catalog Filter Listeners
  const catalogSearch = document.getElementById("catalog-search-input");
  if (catalogSearch) {
    catalogSearch.addEventListener("input", (e) => {
      appState.catalogFilter.search = e.target.value.toLowerCase().trim();
      renderCatalogServices();
    });
  }

  const catalogProviderSelect = document.getElementById("catalog-provider-select");
  if (catalogProviderSelect) {
    catalogProviderSelect.addEventListener("change", (e) => {
      appState.catalogFilter.provider = e.target.value;
      renderCatalogServices();
    });
  }

  const categoryPills = document.querySelectorAll(".catalog-cat-pill");
  categoryPills.forEach(pill => {
    pill.addEventListener("click", (e) => {
      categoryPills.forEach(p => {
        p.classList.remove("active", "bg-[#7D39EB]", "text-[#FFFFFF]");
        p.classList.add("bg-[rgba(125,57,235,0.18)]", "text-white/70");
      });
      e.target.classList.add("active", "bg-[#7D39EB]", "text-[#FFFFFF]");
      e.target.classList.remove("bg-[rgba(125,57,235,0.18)]", "text-white/70");
      appState.catalogFilter.category = e.target.getAttribute("data-cat");
      renderCatalogServices();
    });
  });

  // ADR Modal Actions
  const copyAdrBtn = document.getElementById("btn-copy-adr");
  if (copyAdrBtn) {
    copyAdrBtn.addEventListener("click", copyADRText);
  }

  const downloadAdrBtn = document.getElementById("btn-download-adr");
  if (downloadAdrBtn) {
    downloadAdrBtn.addEventListener("click", downloadADRFile);
  }
}

// =========================================================================
// Centralized Currency System (INR / USD)
// =========================================================================

/**
 * Switch global active display currency.
 * Pure state change: converts all monetary values without re-running analysis,
 * without changing provider rankings or scores, and without resetting architecture.
 */
function setCurrency(curr) {
  appState.currency = curr;
  const inrBtn = document.getElementById("btn-currency-inr");
  const usdBtn = document.getElementById("btn-currency-usd");

  if (curr === "INR") {
    if (inrBtn) {
      inrBtn.className = "px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#C6FF33] text-[#000000] shadow-sm transition";
    }
    if (usdBtn) {
      usdBtn.className = "px-2.5 py-1 rounded-md text-xs font-mono font-bold text-white/60 hover:text-white transition";
    }
    setText("budget-min-label", "₹5,000");
    setText("budget-p25-label", "₹1 Lakh");
    setText("budget-p50-label", "₹8 Lakhs");
    setText("budget-p75-label", "₹25 Lakhs");
    setText("budget-max-label", "₹1 Crore");
  } else {
    if (usdBtn) {
      usdBtn.className = "px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#C6FF33] text-[#000000] shadow-sm transition";
    }
    if (inrBtn) {
      inrBtn.className = "px-2.5 py-1 rounded-md text-xs font-mono font-bold text-white/60 hover:text-white transition";
    }
    setText("budget-min-label", "$60");
    setText("budget-p25-label", "$1,200");
    setText("budget-p50-label", "$9,250");
    setText("budget-p75-label", "$30,000");
    setText("budget-max-label", "$120,000");
  }

  // If in empty state, update budget display without running any analysis
  if (appState.status === "awaiting_input" || !appState.evaluation) {
    return;
  }

  // If results are present, re-render all currency displays seamlessly
  const wl = appState.structuredWorkload;
  const data = appState.evaluation;

  if (wl && wl.monthlyBudget) {
    setText("metric-budget", formatRawAmount(wl.monthlyBudget, wl.budgetCurrency));
    updateSliderDisplays();
  }

  renderHeroCard(data);
  renderCostEconomics(data);
  renderComparisonTable(data.ranking || []);
  renderBillingTraps(data.billingTraps || []);
  renderProcurementScenarios(appState.scenarios);

  // If ADR modal is currently open or loaded, update its text too
  const adrDisplay = document.getElementById("adr-content-display");
  if (adrDisplay && !document.getElementById("adr-modal").classList.contains("hidden")) {
    adrDisplay.textContent = generateADRMarkdown(data);
  }
}

/**
 * Format an amount given in USD into the active currency string.
 * INR uses Indian number grouping (e.g. ₹8,00,000, ₹46,128).
 * USD uses standard US grouping (e.g. $9,249, $533).
 */
function formatCurrency(amountUSD) {
  if (amountUSD === undefined || amountUSD === null || isNaN(amountUSD)) return "-";
  if (appState.currency === "INR") {
    const inr = Math.round(amountUSD * appState.usdToInrRate);
    return `₹${inr.toLocaleString("en-IN")}`;
  } else {
    const usd = Math.round(amountUSD);
    return `$${usd.toLocaleString("en-US")}`;
  }
}

/**
 * Format an amount that has an explicit original source currency (INR or USD).
 * Converts to the active appState.currency dynamically.
 */
function formatRawAmount(amount, sourceCurrency = appState.currency) {
  if (amount === undefined || amount === null || isNaN(amount)) return "-";
  if (appState.currency === "INR") {
    if (sourceCurrency === "INR") {
      return `₹${Math.round(amount).toLocaleString("en-IN")}`;
    } else {
      return `₹${Math.round(amount * appState.usdToInrRate).toLocaleString("en-IN")}`;
    }
  } else {
    if (sourceCurrency === "INR") {
      return `$${Math.round(amount / appState.usdToInrRate).toLocaleString("en-US")}`;
    } else {
      return `$${Math.round(amount).toLocaleString("en-US")}`;
    }
  }
}

// =========================================================================
// Logarithmic Non-Linear Slider Mapping
// =========================================================================

function sliderToDAU(pos) {
  const minL = Math.log(1000);
  const maxL = Math.log(10000000);
  const val = Math.exp(minL + (pos / 100) * (maxL - minL));
  return Math.round(val);
}

function dauToSlider(dau) {
  const minL = Math.log(1000);
  const maxL = Math.log(10000000);
  const clamped = Math.max(1000, Math.min(10000000, dau));
  return Math.round(((Math.log(clamped) - minL) / (maxL - minL)) * 100);
}

function sliderToBudgetINR(pos) {
  const minL = Math.log(5000);
  const maxL = Math.log(10000000); // ₹1 Crore
  const val = Math.exp(minL + (pos / 100) * (maxL - minL));
  return Math.round(val);
}

function budgetINRToSlider(inr) {
  const minL = Math.log(5000);
  const maxL = Math.log(10000000);
  const clamped = Math.max(5000, Math.min(10000000, inr));
  return Math.round(((Math.log(clamped) - minL) / (maxL - minL)) * 100);
}

function updateSliderProgress(slider) {
  if (!slider) return;
  const min = parseFloat(slider.min) || 0;
  const max = parseFloat(slider.max) || 100;
  const val = parseFloat(slider.value) || 0;
  const pct = Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
  slider.style.background = `linear-gradient(to right, #C6FF33 0%, #C6FF33 ${pct}%, rgba(125, 57, 235, 0.25) ${pct}%, rgba(125, 57, 235, 0.25) 100%)`;
}

function initSliders() {
  const sDAU = document.getElementById("slider-dau");
  const sBudget = document.getElementById("slider-budget");
  const sSurge = document.getElementById("slider-surge");

  if (sDAU) {
    updateSliderProgress(sDAU);
    sDAU.addEventListener("input", (e) => {
      updateSliderProgress(e.target);
      const dauVal = sliderToDAU(parseInt(e.target.value, 10));
      setText("slider-dau-display", `${dauVal.toLocaleString()} DAU`);
      if (appState.status === "results") {
        debouncedRecompute();
      }
    });
  }

  if (sBudget) {
    updateSliderProgress(sBudget);
    sBudget.addEventListener("input", (e) => {
      updateSliderProgress(e.target);
      const budgetVal = sliderToBudgetINR(parseInt(e.target.value, 10));
      setText("slider-budget-display", formatRawAmount(budgetVal, "INR"));
      if (appState.status === "results") {
        debouncedRecompute();
      }
    });
  }

  if (sSurge) {
    updateSliderProgress(sSurge);
    sSurge.addEventListener("input", (e) => {
      updateSliderProgress(e.target);
      const surgeVal = parseInt(e.target.value, 10);
      setText("slider-surge-display", `${surgeVal}× Surge`);
      if (appState.status === "results") {
        debouncedRecompute();
      }
    });
  }
}

let debounceTimer = null;
function debouncedRecompute() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    handleWorkloadSubmit(true);
  }, 400);
}

function updateSliderDisplays() {
  const wl = appState.structuredWorkload;
  if (!wl) return;

  const sDAU = document.getElementById("slider-dau");
  const sBudget = document.getElementById("slider-budget");
  const sSurge = document.getElementById("slider-surge");

  if (sDAU && wl.dailyActiveUsers) {
    sDAU.disabled = false;
    sDAU.value = dauToSlider(wl.dailyActiveUsers);
    updateSliderProgress(sDAU);
    setText("slider-dau-display", `${wl.dailyActiveUsers.toLocaleString()} DAU`);
  }

  if (sBudget && wl.monthlyBudget) {
    sBudget.disabled = false;
    const inrVal = wl.budgetCurrency === "INR" ? wl.monthlyBudget : wl.monthlyBudget * appState.usdToInrRate;
    sBudget.value = budgetINRToSlider(inrVal);
    updateSliderProgress(sBudget);
    setText("slider-budget-display", formatRawAmount(inrVal, "INR"));
  }

  if (sSurge && wl.trafficSurge) {
    sSurge.disabled = false;
    sSurge.value = wl.trafficSurge;
    updateSliderProgress(sSurge);
    setText("slider-surge-display", `${wl.trafficSurge}× Surge`);
  }
}

// =========================================================================
// Empty State Compliance (Starts 100% Empty)
// =========================================================================

function renderEmptyState() {
  appState.status = "awaiting_input";
  appState.structuredWorkload = null;
  appState.evaluation = null;

  // Single Source of Truth Metrics bar reset to "-"
  setText("metric-dau", "-");
  setText("metric-budget", "-");
  setText("metric-region", "-");
  setText("metric-surge", "-");
  setText("metric-database", "-");
  setText("metric-websockets", "-");
  setText("metric-gpu", "-");
  setText("metric-media", "-");
  setText("metric-cron", "-");

  // Reset status badge styling
  styleStatusBadge("metric-websockets", false);
  styleStatusBadge("metric-gpu", false);
  styleStatusBadge("metric-media", false);
  styleStatusBadge("metric-cron", false);

  // Sliders reset
  const sDAU = document.getElementById("slider-dau");
  const sBudget = document.getElementById("slider-budget");
  const sSurge = document.getElementById("slider-surge");
  if (sDAU) { sDAU.value = 1; sDAU.disabled = true; }
  if (sBudget) { sBudget.value = 1; sBudget.disabled = true; }
  if (sSurge) { sSurge.value = 1; sSurge.disabled = true; }
  setText("slider-dau-display", "-");
  setText("slider-budget-display", "-");
  setText("slider-surge-display", "-");

  // Recommendation Hero Card initial empty state
  const heroCard = document.getElementById("recommendation-hero-card");
  if (heroCard) {
    heroCard.innerHTML = `
      <div class="p-8 sm:p-10 text-center bg-[rgba(12,6,22,0.7)] border border-[rgba(125,57,235,0.35)] rounded-2xl">
        <div class="w-14 h-14 rounded-2xl bg-[rgba(125,57,235,0.2)] border border-[#7D39EB] text-[#C6FF33] flex items-center justify-center mx-auto mb-4 text-2xl shadow-sm">
          ⚡
        </div>
        <h3 class="text-base sm:text-lg font-bold text-white font-mono tracking-tight mb-2">
          Awaiting Workload Specification
        </h3>
        <p class="text-xs sm:text-sm text-white/60 max-w-lg mx-auto leading-relaxed mb-5">
          Enter your natural English system prompt above or pick a preset from the 
          <span class="font-bold text-[#C6FF33]">Developer Test Bench</span>. The deterministic engine will evaluate all 17 cloud providers with zero hardcoded provider bias.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-2">
          <button onclick="document.getElementById('test-bench-modal').classList.remove('hidden')" 
            class="btn-secondary text-xs">
            <i data-lucide="flask-conical" class="w-3.5 h-3.5 text-[#7D39EB]"></i>
            <span>Load Preset Workload</span>
          </button>
          <button onclick="document.getElementById('catalog-modal').classList.remove('hidden')" 
            class="btn-secondary text-xs">
            <i data-lucide="book-open" class="w-3.5 h-3.5 text-[#7D39EB]"></i>
            <span>Browse 17 Clouds Catalog</span>
          </button>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  // Topology Canvas empty
  const topoCanvas = document.getElementById("architecture-canvas-nodes");
  if (topoCanvas) {
    topoCanvas.innerHTML = `
      <div class="col-span-full py-12 text-center text-white/50 font-mono text-xs">
        Topology canvas is awaiting workload evaluation to synthesize active stages.
      </div>
    `;
  }
  setText("topology-count-badge", "0 Stages");

  // Costs reset
  setText("cost-est-monthly", "-");
  setText("cost-est-daily", "-");
  setText("cost-est-range", "-");
  setText("sizing-egress-basis", "• Bandwidth: Awaiting evaluation");
  setText("sizing-storage-basis", "• Storage: Awaiting evaluation");

  const driversList = document.getElementById("cost-drivers-list");
  if (driversList) {
    driversList.innerHTML = `<div class="text-xs text-white/50 font-mono">No cost drivers evaluated yet.</div>`;
  }

  // Flaws & Traps reset
  const flawsBox = document.getElementById("flaws-container");
  if (flawsBox) flawsBox.innerHTML = `<div class="text-xs text-white/50 font-mono">Awaiting workload analysis to detect architectural flaws.</div>`;

  const trapsBox = document.getElementById("billing-traps-container");
  if (trapsBox) trapsBox.innerHTML = `<div class="text-xs text-white/50 font-mono">Awaiting workload analysis to evaluate billing traps.</div>`;

  const tradeoffsBox = document.getElementById("tradeoffs-container");
  if (tradeoffsBox) tradeoffsBox.innerHTML = `<div class="col-span-full text-xs text-white/50 font-mono">Awaiting workload analysis to generate trade-off rationales.</div>`;

  // Comparison table reset
  const compTable = document.getElementById("comparison-table-body");
  if (compTable) {
    compTable.innerHTML = `
      <tr>
        <td colspan="7" class="py-8 text-center text-white/50 font-mono text-xs">
          Awaiting input to score and rank 17 cloud providers.
        </td>
      </tr>
    `;
  }

  // IaC reset
  const codeBox = document.getElementById("iac-code-content");
  if (codeBox) {
    codeBox.textContent = `# Infrastructure as Code templates will be generated upon analysis.\n# Supports Terraform, Dockerfile, Docker Compose, and Cloud-Init.`;
  }

  // Debug drawer reset
  const debugPre = document.getElementById("debug-json-display");
  if (debugPre) {
    debugPre.textContent = JSON.stringify({ status: "awaiting_input", message: "Enter a workload prompt to begin evaluation." }, null, 2);
  }
}

// =========================================================================
// Workload Submission & Pipeline Execution
// =========================================================================

async function handleWorkloadSubmit(fromSlider = false) {
  const promptInput = document.getElementById("workload-prompt-input");
  const promptText = promptInput ? promptInput.value.trim() : "";

  if (!promptText) {
    showNotification("Please describe your workload before analyzing.", "warning");
    return;
  }

  appState.status = "analyzing";
  appState.rawPrompt = promptText;

  // Gather slider or input overrides if moved
  let overrideBudget = null;
  let overrideDAU = null;
  let overrideSurge = null;

  if (fromSlider) {
    const sDAU = document.getElementById("slider-dau");
    const sBudget = document.getElementById("slider-budget");
    const sSurge = document.getElementById("slider-surge");
    if (sDAU && !sDAU.disabled) overrideDAU = sliderToDAU(parseInt(sDAU.value, 10));
    if (sBudget && !sBudget.disabled) {
      const inrVal = sliderToBudgetINR(parseInt(sBudget.value, 10));
      overrideBudget = inrVal;
    }
    if (sSurge && !sSurge.disabled) overrideSurge = parseInt(sSurge.value, 10);
  }

  const regionSelect = document.getElementById("input-override-region");
  const overrideRegion = (regionSelect && regionSelect.value !== "auto") ? regionSelect.value : null;

  // Visual loading feedback
  const analyzeBtn = document.getElementById("btn-analyze-workload");
  if (analyzeBtn) {
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> <span>EVALUATING 17 CLOUDS...</span>`;
    if (window.lucide) window.lucide.createIcons();
  }

  try {
    let data = null;
    let fetchError = null;

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          overrideBudget: overrideBudget,
          overrideDAU: overrideDAU,
          overrideRegion: overrideRegion,
          overrideSurge: overrideSurge
        })
      });

      if (response.ok) {
        data = await response.json();
      } else {
        fetchError = new Error(`API returned HTTP ${response.status}`);
      }
    } catch (networkErr) {
      fetchError = networkErr;
    }

    // Seamless fallback to deterministic client-side engine if backend was unreachable or threw error
    if (!data) {
      if (typeof window.evaluateWorkloadClientSide === "function") {
        console.warn("Backend API unavailable (" + (fetchError ? fetchError.message : "offline") + "); executing deterministic client-side engine.", fetchError);
        data = window.evaluateWorkloadClientSide(promptText, {
          overrideBudget: overrideBudget,
          overrideDAU: overrideDAU,
          overrideRegion: overrideRegion,
          overrideSurge: overrideSurge
        });
      } else {
        throw fetchError || new Error("Evaluation failed and client-side engine not loaded.");
      }
    }

    if (data.status === "awaiting_input") {
      renderEmptyState();
      showNotification(data.message || "Please provide a valid workload prompt.", "warning");
      return;
    }

    appState.status = "results";
    appState.structuredWorkload = data.workload;
    appState.evaluation = data;

    renderEvaluationResults(data);
    showNotification(`Evaluation complete. Winner: ${data.recommended.name} (${data.recommended.score}/100)`, "success");

  } catch (err) {
    console.error("Evaluation failed:", err);
    showNotification("Error during evaluation. Please verify backend service.", "error");
  } finally {
    if (analyzeBtn) {
      analyzeBtn.disabled = false;
      analyzeBtn.innerHTML = `<i data-lucide="sparkles" class="w-4 h-4"></i> <span>ANALYZE WORKLOAD</span>`;
      if (window.lucide) window.lucide.createIcons();
    }
  }
}

// =========================================================================
// Rendering Evaluation Results (The Master Pipeline)
// =========================================================================

function renderEvaluationResults(data) {
  const wl = data.workload;
  const rec = data.recommended;

  // 1. Single Source of Truth Derived Metrics Bar
  setText("metric-dau", wl.dailyActiveUsers ? `${wl.dailyActiveUsers.toLocaleString()}` : "Unspecified");
  setText("metric-budget", wl.monthlyBudget ? formatRawAmount(wl.monthlyBudget, wl.budgetCurrency) : "Uncapped");
  setText("metric-region", wl.region || "Global");
  setText("metric-surge", `${wl.trafficSurge || 1}×`);
  setText("metric-database", wl.database && wl.database.required ? (wl.database.type || "SQL") : "None");
  
  styleStatusBadge("metric-websockets", wl.websockets && wl.websockets.required);
  setText("metric-websockets", wl.websockets && wl.websockets.required ? "ACTIVE" : "OFF");

  styleStatusBadge("metric-gpu", wl.gpuInference && wl.gpuInference.required);
  setText("metric-gpu", wl.gpuInference && wl.gpuInference.required ? "ACTIVE" : "OFF");

  styleStatusBadge("metric-media", wl.mediaProcessing && wl.mediaProcessing.required);
  setText("metric-media", wl.mediaProcessing && wl.mediaProcessing.required ? "ACTIVE" : "OFF");

  styleStatusBadge("metric-cron", wl.scheduledJobs && wl.scheduledJobs.required);
  setText("metric-cron", wl.scheduledJobs && wl.scheduledJobs.required ? "ACTIVE" : "OFF");

  // 2. Sliders Synchronization
  updateSliderDisplays();

  // 3. Recommendation Hero Card
  renderHeroCard(data);

  // 4. Architecture Topology Nodes (Guaranteed No Undefined)
  renderTopologyNodes(data.architecture ? data.architecture.nodes : []);

  // 5. Cost Breakdown & 24-Hour Economics (Transparent Sizing)
  renderCostEconomics(data);

  // 6. Architecture Flaws & Hidden Billing Traps
  renderFlaws(data.flaws || []);
  renderBillingTraps(data.billingTraps || []);
  renderServiceTradeoffs(data.serviceTradeoffs || []);

  // 7. Multi-Cloud Comparison Table (17 Providers)
  renderComparisonTable(data.ranking || []);

  // 8. Infrastructure Templates (IaC)
  renderIaCCode(data.iac || {});

  // 9. Debug Drawer
  renderDebugDrawer(data);

  // Re-trigger Lucide icon rendering
  if (window.lucide) window.lucide.createIcons();
}

// Render Recommendation Hero Card
function renderHeroCard(data) {
  const heroCard = document.getElementById("recommendation-hero-card");
  if (!heroCard) return;

  const rec = data.recommended;
  const runner = data.runnerUp;
  const conf = data.confidence || 85;

  const costMonthlyFormatted = formatCurrency(rec.cost.monthlyUSD);
  const cost24HrFormatted = formatCurrency(rec.cost24HrUSD || (rec.cost.monthlyUSD / 30.4));

  heroCard.innerHTML = `
    <div class="p-6 sm:p-7 bg-[rgba(12,6,22,0.75)] border-b border-[rgba(125,57,235,0.35)]">
      <div class="flex flex-wrap items-start justify-between gap-4 mb-4">
        
        <div>
          <div class="flex items-center gap-2 mb-1.5">
            <span class="tech-badge badge-violet font-bold text-xs uppercase tracking-wider">TOP RECOMMENDED PROVIDER</span>
            <span class="tech-badge badge-muted text-xs font-mono">${rec.category}</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black text-[#FFFFFF] tracking-tight flex items-center gap-3">
            <span>${rec.name}</span>
            <span class="inline-flex items-center px-3 py-0.5 rounded-lg text-sm font-mono font-bold bg-[rgba(198,255,51,0.15)] text-[#C6FF33] border border-[#C6FF33]">
              ${rec.score}/100 Score
            </span>
          </h2>
          <p class="text-sm text-white/70 mt-1 max-w-2xl font-medium">${rec.tagline || rec.description}</p>
        </div>

        <!-- Cost & Confidence Metrics Capsule -->
        <div class="flex flex-wrap items-center gap-3 sm:text-right">
          <div class="p-3 rounded-xl bg-[rgba(18,9,32,0.75)] border border-[rgba(125,57,235,0.4)] text-left sm:text-right">
            <div class="text-[10px] font-mono text-white/60 uppercase font-bold">Est. Monthly Cost</div>
            <div class="text-xl font-black text-[#C6FF33] font-mono">${costMonthlyFormatted}</div>
            <div class="text-[11px] font-mono text-white">${cost24HrFormatted} / 24-hr</div>
          </div>
          
          <div class="p-3 rounded-xl bg-[rgba(18,9,32,0.75)] border border-[rgba(125,57,235,0.4)] text-left sm:text-right">
            <div class="text-[10px] font-mono text-white/60 uppercase font-bold">Confidence Gap</div>
            <div class="text-xl font-black text-[#7D39EB] font-mono">${conf}%</div>
            <div class="text-[11px] font-mono text-white/60">+${runner ? (rec.score - runner.score) : 0} pts vs ${runner && runner.name ? runner.name.split(' ')[0] : 'Alternative'}</div>
          </div>
        </div>

      </div>

      <!-- Free Tier & Bandwidth Allowance Callout -->
      ${rec.freeAllowance ? `
        <div class="p-3 rounded-lg bg-[rgba(125,57,235,0.15)] border border-[#7D39EB] mb-4 flex items-start gap-2.5 text-xs">
          <i data-lucide="gift" class="w-4 h-4 text-[#7D39EB] shrink-0 mt-0.5"></i>
          <div>
            <span class="font-bold text-[#FFFFFF]">Included Free Tier Allowance:</span>
            <span class="text-white/80">${rec.freeAllowance}</span>
            ${rec.bandwidthIncluded ? `<span class="text-[#C6FF33] block mt-0.5 font-mono text-[11px]">Egress: ${rec.bandwidthIncluded}</span>` : ''}
          </div>
        </div>
      ` : ''}

      <!-- Explanation Text -->
      <div class="p-4 rounded-xl bg-[rgba(10,5,20,0.7)] border border-[rgba(125,57,235,0.3)] mb-4 text-xs sm:text-sm text-white/90 leading-relaxed">
        ${data.explanation || 'Deterministic workload evaluation conducted across 17 cloud provider capabilities.'}
      </div>

      <!-- Match Requirements & Strengths -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[rgba(125,57,235,0.25)] text-xs">
        <div>
          <div class="font-mono font-bold text-[#FFFFFF] uppercase text-[11px] mb-2 flex items-center gap-1.5">
            <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-[#C6FF33]"></i>
            <span>Verified Workload Match Factors</span>
          </div>
          <ul class="space-y-1.5 text-white/90">
            ${(rec.matchedRequirements || []).slice(0, 4).map(m => `
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-[#C6FF33] shrink-0"></span>
                <span>${m}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div>
          <div class="font-mono font-bold text-[#FFFFFF] uppercase text-[11px] mb-2 flex items-center gap-1.5">
            <i data-lucide="zap" class="w-3.5 h-3.5 text-[#7D39EB]"></i>
            <span>Architectural Strengths &amp; Moats</span>
          </div>
          <ul class="space-y-1.5 text-white/90">
            ${(rec.strengths || []).slice(0, 3).map(s => `
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-[#7D39EB] shrink-0"></span>
                <span>${s}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>

      <!-- Action Buttons: Save Blueprint & Export ADR -->
      <div class="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-[rgba(125,57,235,0.25)]">
        <div class="text-xs text-white/60 font-mono">
          Runner-up: <strong class="text-white">${runner && runner.name ? runner.name : 'N/A'}</strong> (${runner ? runner.score : 0}/100)
        </div>
        <div class="flex items-center gap-2">
          <button onclick="saveCurrentBlueprint()" class="btn-secondary text-xs">
            <i data-lucide="bookmark-plus" class="w-3.5 h-3.5 text-[#7D39EB]"></i>
            <span>Save Blueprint</span>
          </button>
          <button onclick="openADRModal()" class="btn-primary-action text-xs py-2 px-3.5">
            <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
            <span>Export ADR (Markdown)</span>
          </button>
        </div>
      </div>

    </div>
  `;
}

// Render Topology Nodes (Canonical mapping with strict guards against undefined)
function renderTopologyNodes(nodes) {
  const topoCanvas = document.getElementById("architecture-canvas-nodes");
  if (!topoCanvas) return;

  if (!nodes || nodes.length === 0) {
    setText("topology-count-badge", "0 Stages");
    topoCanvas.innerHTML = `<div class="col-span-full text-center py-8 text-xs font-mono text-white/50">No active nodes required.</div>`;
    return;
  }

  setText("topology-count-badge", `${nodes.length} Stages`);

  topoCanvas.innerHTML = nodes.map((node, i) => {
    const tierNum = (i + 1).toString().padStart(2, '0');
    const serviceTitle = (node.service || node.name || 'Cloud Service').trim();
    const roleName = (node.name && node.service && node.name !== node.service) ? node.name.trim() : '';
    const category = (node.category || node.type || 'PaaS').toUpperCase();
    const purpose = (node.purpose || node.description || node.requirementMapping || '').trim();
    const config = (node.configuration || '').trim();
    const reqMapping = (node.requirementMapping && node.requirementMapping !== purpose) ? node.requirementMapping : '';

    return `
      <div class="arch-node">
        <div class="flex items-center justify-between gap-1 mb-2">
          <span class="text-[10px] font-mono font-bold text-white/60 uppercase">Tier ${tierNum}</span>
          <span class="tech-badge badge-violet text-[9px]">${category}</span>
        </div>
        <div class="font-bold text-[#FFFFFF] text-sm mb-0.5 leading-snug">${serviceTitle}</div>
        ${roleName ? `<div class="text-[11px] font-mono font-bold text-[#C6FF33] mb-1.5">${roleName}</div>` : ''}
        ${purpose ? `<div class="text-xs text-white/80 leading-snug mb-2">${purpose}</div>` : ''}
        ${reqMapping ? `
          <div class="text-[10px] font-mono text-[#C6FF33] mb-2 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-[#C6FF33]"></span>
            <span>${reqMapping}</span>
          </div>
        ` : ''}
        ${config ? `
          <div class="p-1.5 rounded bg-[rgba(10,5,20,0.7)] border border-[rgba(125,57,235,0.3)] text-[10px] font-mono text-white/60 truncate" title="${config}">
            ${config}
          </div>
        ` : ''}
      </div>
    `;
  }).join("");
}

// Render Cost Economics & 24-Hour Comparison
function renderCostEconomics(data) {
  const rec = data.recommended;
  const cost = rec.cost;
  const wl = data.workload;

  setText("cost-est-monthly", formatCurrency(cost.monthlyUSD));
  setText("cost-est-daily", formatCurrency(rec.cost24HrUSD || (cost.monthlyUSD / 30.4)));
  setText("cost-est-range", `${formatCurrency(cost.rangeMinUSD)} — ${formatCurrency(cost.rangeMaxUSD)}`);

  // Transparent Sizing Assumptions Display (Realistic ~450 GB bandwidth & ~250 GB storage)
  const egressGB = (wl && wl.sizing && wl.sizing.estimatedBandwidthGBMonth) ? wl.sizing.estimatedBandwidthGBMonth : 457;
  const storageGB = (wl && wl.sizing && wl.sizing.estimatedStorageGB) ? wl.sizing.estimatedStorageGB : 270;
  const bandwidthBasis = (wl && wl.sizing && wl.sizing.bandwidthBasis) ? wl.sizing.bandwidthBasis : 'Transactional APIs (~40 KB/req) and month-end PDF exports';
  const storageBasis = (wl && wl.sizing && wl.sizing.storageBasis) ? wl.sizing.storageBasis : 'Employee payslip PDF archives & audit compliance';

  setText("sizing-egress-basis", `• Bandwidth: ~${egressGB.toLocaleString()} GB/mo (${bandwidthBasis})`);
  setText("sizing-storage-basis", `• Storage: ~${storageGB.toLocaleString()} GB (${storageBasis})`);

  const driversList = document.getElementById("cost-drivers-list");
  if (driversList && cost.costDrivers) {
    driversList.innerHTML = cost.costDrivers.map(d => `
      <div class="flex items-center justify-between p-2 rounded bg-[rgba(18,9,32,0.7)] border border-[rgba(125,57,235,0.35)] text-xs">
        <div class="pr-2">
          <div class="font-bold text-[#FFFFFF]">${d.name}</div>
          <div class="text-[10px] text-white/60 font-mono">${d.details}</div>
        </div>
        <div class="text-right shrink-0">
          <div class="font-mono font-bold text-[#C6FF33]">${formatCurrency(d.costUSD)}</div>
          <div class="text-[10px] text-[#7D39EB] font-mono font-semibold">${d.percentage}%</div>
        </div>
      </div>
    `).join("");
  }
}

// Render Architecture Flaws & Risks (Workload Specific)
function renderFlaws(flaws) {
  const container = document.getElementById("flaws-container");
  if (!container) return;

  if (!flaws || flaws.length === 0) {
    container.innerHTML = `<div class="p-3 rounded-lg bg-[rgba(125,57,235,0.15)] border border-[#7D39EB] text-xs text-[#FFFFFF] font-medium">Zero high-severity architectural anti-patterns detected. Sizing aligns with recommended bounds.</div>`;
    return;
  }

  container.innerHTML = flaws.map(f => `
    <div class="flaw-card severity-${f.severity}">
      <div class="flex items-center justify-between gap-2 mb-1">
        <div class="font-bold text-[#FFFFFF] text-xs">${f.title}</div>
        <span class="tech-badge badge-violet text-[9px]">${f.severity}</span>
      </div>
      <p class="text-xs text-white/70 mb-2 leading-relaxed">${f.description}</p>
      <div class="p-2 rounded bg-[rgba(10,5,20,0.7)] border border-[rgba(125,57,235,0.35)] text-[11px] text-[#FFFFFF]">
        <strong class="font-mono text-[#7D39EB]">Remediation:</strong> ${f.remediation}
      </div>
    </div>
  `).join("");
}

// Render Hidden Billing Traps (With dynamic currency conversion)
function renderBillingTraps(traps) {
  const container = document.getElementById("billing-traps-container");
  if (!container) return;

  if (!traps || traps.length === 0) {
    container.innerHTML = `<div class="text-xs text-white/50 font-mono">No unexpected billing traps flagged.</div>`;
    return;
  }

  container.innerHTML = traps.map(t => {
    let costDisplay = t.monthlyCostEstimate;
    let riskDisplay = t.annualRisk;

    if (t.monthlyCostEstimateUSD && appState.currency === "INR") {
      const inrMonth = Math.round(t.monthlyCostEstimateUSD * appState.usdToInrRate);
      costDisplay = `₹${inrMonth.toLocaleString("en-IN")} / month`;
    }
    if (t.annualRiskUSD && appState.currency === "INR") {
      const inrAnnual = Math.round(t.annualRiskUSD * appState.usdToInrRate);
      riskDisplay = `₹${inrAnnual.toLocaleString("en-IN")} / year`;
    }

    return `
      <div class="trap-card">
        <div class="flex items-center justify-between gap-2 mb-1">
          <div class="font-bold text-[#FFFFFF] text-xs">${t.name}</div>
          <span class="tech-badge badge-violet text-[9px] font-mono">${t.category}</span>
        </div>
        <div class="flex items-center gap-3 text-xs mb-2">
          <span class="font-bold text-[#C6FF33] font-mono">${costDisplay}</span>
          <span class="text-white/60 text-[10px] font-mono">Risk: ${riskDisplay}</span>
        </div>
        <p class="text-xs text-white/70 mb-2 leading-relaxed">${t.trapMechanism}</p>
        <div class="p-2 rounded bg-[rgba(10,5,20,0.7)] border border-[rgba(125,57,235,0.35)] text-[11px] text-[#FFFFFF]">
          <strong class="font-mono text-[#7D39EB]">Mitigation:</strong> ${t.mitigation}
        </div>
      </div>
    `;
  }).join("");
}

// Render Architectural Trade-Offs
function renderServiceTradeoffs(tradeoffs) {
  const container = document.getElementById("tradeoffs-container");
  if (!container) return;

  if (!tradeoffs || tradeoffs.length === 0) {
    container.innerHTML = `<div class="col-span-full text-xs text-white/50 font-mono">No trade-offs available.</div>`;
    return;
  }

  container.innerHTML = tradeoffs.map(t => `
    <div class="p-3.5 rounded-xl bg-[rgba(14,8,26,0.75)] border border-[rgba(125,57,235,0.35)] text-xs">
      <div class="font-bold text-[#FFFFFF] font-mono text-xs uppercase mb-1">${t.dimension}</div>
      <div class="flex items-center gap-1.5 text-xs text-white/60 mb-2 font-medium">
        <span class="text-[#7D39EB] font-bold font-mono">Selected:</span>
        <span class="px-2 py-0.5 rounded bg-[rgba(125,57,235,0.2)] text-[#C6FF33] border border-[#7D39EB] font-bold">${t.selected}</span>
      </div>
      <p class="text-[11px] text-white/80 leading-relaxed">${t.tradeoffReason}</p>
    </div>
  `).join("");
}

// Render Multi-Cloud Comparison Table across all 17 providers
function renderComparisonTable(ranking) {
  const tableBody = document.getElementById("comparison-table-body");
  if (!tableBody) return;

  if (!ranking || ranking.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" class="py-6 text-center text-white/50 font-mono text-xs">No providers evaluated.</td></tr>`;
    return;
  }

  setText("ranking-count-badge", `${ranking.length} Clouds Ranked`);

  tableBody.innerHTML = ranking.map(p => {
    const isWinner = p.rank === 1;
    const monthlyCostFormatted = formatCurrency(p.monthlyCostUSD);

    return `
      <tr class="border-b border-[rgba(125,57,235,0.18)] hover:bg-[rgba(125,57,235,0.20)] transition text-xs font-mono ${isWinner ? 'winner-row bg-[rgba(125,57,235,0.16)] font-semibold' : ''}">
        <td class="py-3 px-3">
          <span class="inline-flex items-center justify-center w-6 h-6 rounded-md font-bold text-xs ${
            isWinner 
              ? 'bg-[#C6FF33] text-[#000000] shadow-sm shadow-[#C6FF33]/30' 
              : 'bg-[rgba(20,10,36,0.8)] text-white/70 border border-[rgba(125,57,235,0.35)]'
          }">
            ${p.rank}
          </span>
        </td>
        <td class="py-3 px-3">
          <div class="font-bold text-[#FFFFFF] flex items-center gap-1.5 font-sans">
            <span>${p.name}</span>
            ${isWinner ? '<span class="tech-badge badge-lime text-[8px]">WINNER</span>' : ''}
          </div>
          <div class="text-[10px] text-white/60 font-mono">${p.badge || ''}</div>
        </td>
        <td class="py-3 px-3 text-white/70 text-[11px] font-sans">
          ${p.category || 'General'}
        </td>
        <td class="py-3 px-3">
          <span class="font-bold ${isWinner ? 'text-[#C6FF33] font-mono text-sm' : 'text-[#FFFFFF] font-mono'}">${p.score}</span>
          <span class="text-white/40 text-[10px]">/100</span>
        </td>
        <td class="py-3 px-3 font-bold text-[#C6FF33] font-mono">
          ${monthlyCostFormatted}<span class="text-[10px] text-white/50 font-normal">/mo</span>
        </td>
        <td class="py-3 px-3 text-[#FFFFFF] font-sans">
          <div class="flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full ${isWinner ? 'bg-[#C6FF33]' : 'bg-[rgba(125,57,235,0.5)]'}"></span>
            <span>${p.matchRate || '90%'}</span>
          </div>
        </td>
        <td class="py-3 px-3 text-white/60 text-[11px] font-sans truncate max-w-xs" title="${p.keyWorkloadFactor || ''}">
          ${p.keyWorkloadFactor || 'General cloud suitability'}
        </td>
      </tr>
    `;
  }).join("");
}

// Render Strategic Procurement Scenarios (A - F)
function renderProcurementScenarios(scenarios) {
  const container = document.getElementById("scenarios-container");
  if (!container || !scenarios || scenarios.length === 0) return;

  container.innerHTML = scenarios.map((s, idx) => {
    let budgetDisplay = s.monthlyBudgetRangeINR;
    if (s.minBudgetUSD !== undefined && s.maxBudgetUSD !== undefined) {
      if (appState.currency === "USD") {
        budgetDisplay = `${formatCurrency(s.minBudgetUSD)} – ${formatCurrency(s.maxBudgetUSD)} / mo`;
      } else {
        const minINR = Math.round(s.minBudgetUSD * appState.usdToInrRate);
        const maxINR = Math.round(s.maxBudgetUSD * appState.usdToInrRate);
        budgetDisplay = `₹${minINR.toLocaleString("en-IN")} – ₹${maxINR.toLocaleString("en-IN")} / mo`;
      }
    } else if (appState.currency === "USD" && s.monthlyBudgetRangeUSD) {
      budgetDisplay = s.monthlyBudgetRangeUSD;
    }

    return `
      <div class="scenario-card ${idx === 2 ? 'active' : ''}" onclick="applyScenario('${s.id}')">
        <div class="flex items-center justify-between gap-2 mb-2">
          <span class="tech-badge badge-violet text-[10px] font-mono">${s.code}</span>
          <span class="text-[11px] font-mono font-bold text-[#C6FF33]">${budgetDisplay}</span>
        </div>
        <h4 class="font-bold text-[#FFFFFF] text-sm mb-1 font-mono">${s.title}</h4>
        <div class="text-[11px] text-white/60 font-bold mb-2">Target: <span class="text-[#C6FF33]">${s.recommendedCloud}</span></div>
        <p class="text-xs text-white/80 mb-3 leading-relaxed">${s.strategy}</p>
        <ul class="space-y-1 text-[11px] text-white/60 border-t border-[rgba(125,57,235,0.25)] pt-2">
          ${(s.keyDecisions || []).slice(0, 2).map(d => `
            <li class="flex items-start gap-1.5">
              <span class="text-[#7D39EB] font-bold">•</span>
              <span>${d}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }).join("");
}

function applyScenario(scenarioId) {
  const s = (appState.scenarios || []).find(sc => sc.id === scenarioId);
  if (!s) return;
  showNotification(`Viewing playbook for ${s.title}: ${s.strategy}`, "info");
}

// Render Infrastructure Templates (IaC)
function renderIaCCode(iacTemplates) {
  const codeBox = document.getElementById("iac-code-content");
  if (!codeBox) return;

  const currentFormat = appState.selectedIaCTab || "terraform";
  codeBox.textContent = iacTemplates[currentFormat] || iacTemplates.terraform || "";
}

function switchIaCTab(format) {
  appState.selectedIaCTab = format;

  const tabs = document.querySelectorAll(".code-tab-trigger");
  tabs.forEach(tab => {
    if (tab.getAttribute("data-format") === format) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });

  if (appState.evaluation && appState.evaluation.iac) {
    renderIaCCode(appState.evaluation.iac);
  }
}

function copyCurrentCode() {
  const codeBox = document.getElementById("iac-code-content");
  const copyBtn = document.getElementById("btn-copy-code");
  if (!codeBox || !codeBox.textContent) return;

  navigator.clipboard.writeText(codeBox.textContent).then(() => {
    if (copyBtn) {
      const origText = copyBtn.innerHTML;
      copyBtn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5 text-[#C6FF33]"></i> Copied!`;
      if (window.lucide) window.lucide.createIcons();
      setTimeout(() => {
        copyBtn.innerHTML = origText;
        if (window.lucide) window.lucide.createIcons();
      }, 2000);
    }
  });
}

// Render Debug & Explainability Drawer
function renderDebugDrawer(data) {
  const debugPre = document.getElementById("debug-json-display");
  if (debugPre) {
    debugPre.textContent = JSON.stringify(data.debug, null, 2);
  }
}

// =========================================================================
// Cloud Service Catalog Modal Logic
// =========================================================================

function openCatalogModal() {
  const modal = document.getElementById("catalog-modal");
  if (modal) {
    modal.classList.remove("hidden");
    renderCatalogServices();
    if (window.lucide) window.lucide.createIcons();
  }
}

/**
 * Strict validator for canonical service catalog records.
 * Returns true if record satisfies all required schema fields, otherwise logs error and returns false.
 */
function validateServiceRecord(service) {
  if (!service || typeof service !== "object") {
    console.error("Catalog validation failed: record is not an object", service);
    return false;
  }
  const requiredFields = ["id", "name", "providerId", "providerName", "category", "categoryLabel", "description"];
  for (const field of requiredFields) {
    if (!service[field] || typeof service[field] !== "string" || service[field].trim() === "") {
      console.error(`Catalog validation failed: field '${field}' is missing or empty in record:`, service);
      return false;
    }
  }
  if (!Array.isArray(service.capabilities) || service.capabilities.length === 0) {
    console.error("Catalog validation failed: capabilities must be non-empty array in record:", service);
    return false;
  }
  return true;
}

/**
 * Normalizes and guarantees canonical service catalog records across all 17 providers.
 * Pulls from appState.services (loaded from backend) or synthesizes canonical records client-side.
 */
function getCanonicalServices() {
  if (appState.services && Array.isArray(appState.services) && appState.services.length > 0) {
    const valid = appState.services.filter(validateServiceRecord);
    if (valid.length > 0) {
      return valid;
    }
  }

  // Synthesize canonical records client-side from appState.catalog as a resilient fallback
  const CATEGORY_MAP = {
    compute: { category: "compute", label: "Compute" },
    containerOrchestrator: { category: "kubernetes", label: "Kubernetes" },
    serverless: { category: "serverless", label: "Serverless" },
    objectStorage: { category: "storage", label: "Storage" },
    dns: { category: "networking", label: "Networking" },
    loadBalancer: { category: "networking", label: "Networking" },
    hybridGateway: { category: "networking", label: "Networking" },
    cdn: { category: "networking", label: "Networking" },
    cache: { category: "database", label: "In-Memory Cache" },
    queue: { category: "serverless", label: "Messaging & Queue" },
    scheduledJobs: { category: "serverless", label: "Scheduled Jobs" },
    gpuInstance: { category: "ai_gpu", label: "AI & GPU" },
    identity: { category: "networking", label: "Identity & Security" },
    security: { category: "networking", label: "Cloud Security" },
    monitoring: { category: "compute", label: "Observability & Monitoring" }
  };

  const synthesized = [];
  (appState.catalog || []).forEach(prov => {
    const provServices = prov.services || {};
    Object.keys(provServices).forEach(rawKey => {
      const val = provServices[rawKey];
      if (!val) return;

      if (rawKey === "database" && typeof val === "object") {
        const dbLabels = {
          sqlServer: { name: "Microsoft SQL Server", label: "Relational SQL", desc: "enterprise Microsoft SQL Server engine with high availability and automated backups." },
          postgres: { name: "PostgreSQL Database Engine", label: "PostgreSQL", desc: "managed PostgreSQL database with connection pooling and automated backups." },
          mysql: { name: "MySQL Relational Database", label: "MySQL", desc: "managed MySQL database with high-availability replication and automated patching." },
          oracle: { name: "Oracle Enterprise Database", label: "Oracle Database", desc: "enterprise Oracle database environment for mission-critical relational data." },
          nosql: { name: "Distributed NoSQL Database", label: "NoSQL", desc: "globally scalable NoSQL document/key-value database with single-digit millisecond latency." }
        };
        Object.keys(val).forEach(dbKey => {
          const dbVal = val[dbKey];
          if (!dbVal || typeof dbVal !== "string") return;
          const meta = dbLabels[dbKey] || { name: dbKey, label: "Database", desc: "managed database service." };
          const rec = {
            id: `${prov.id}-db-${dbKey}`,
            name: dbVal,
            providerId: prov.id,
            providerName: prov.name,
            category: "database",
            categoryLabel: "Database",
            description: `${prov.name} managed ${meta.desc}`,
            capabilities: ["database", "relational_sql", dbKey.toLowerCase(), "acid_compliance"]
          };
          if (validateServiceRecord(rec)) synthesized.push(rec);
        });
      } else if (typeof val === "string") {
        const catMeta = CATEGORY_MAP[rawKey] || { category: "compute", label: "Compute" };
        const rec = {
          id: `${prov.id}-${rawKey}`,
          name: val,
          providerId: prov.id,
          providerName: prov.name,
          category: catMeta.category,
          categoryLabel: catMeta.label,
          description: `${prov.name} ${val} delivering production-grade cloud infrastructure for enterprise workloads.`,
          capabilities: [catMeta.category, rawKey.toLowerCase()]
        };
        if (validateServiceRecord(rec)) synthesized.push(rec);
      }
    });
  });

  if (synthesized.length > 0) {
    appState.services = synthesized;
    return synthesized;
  }
  return [];
}

function populateCatalogProviderDropdown() {
  const select = document.getElementById("catalog-provider-select");
  if (!select) return;

  const services = getCanonicalServices();
  const providerMap = new Map();
  services.forEach(s => {
    if (!providerMap.has(s.providerId)) {
      providerMap.set(s.providerId, s.providerName);
    }
  });

  if (providerMap.size === 0 && appState.catalog && appState.catalog.length > 0) {
    appState.catalog.forEach(p => providerMap.set(p.id, p.name));
  }

  let optionsHtml = `<option value="all">All ${providerMap.size || 17} Cloud Providers</option>`;
  providerMap.forEach((name, id) => {
    optionsHtml += `<option value="${id}">${name}</option>`;
  });
  select.innerHTML = optionsHtml;
}

function renderCatalogServices() {
  const container = document.getElementById("catalog-services-grid");
  if (!container) return;

  const filter = appState.catalogFilter;
  const allServices = getCanonicalServices();

  const filtered = allServices.filter(s => {
    // 1. Provider filter
    if (filter.provider !== "all" && s.providerId.toLowerCase() !== filter.provider.toLowerCase()) {
      return false;
    }
    // 2. Category filter
    if (filter.category !== "all" && s.category.toLowerCase() !== filter.category.toLowerCase()) {
      return false;
    }
    // 3. Search query filter
    if (filter.search) {
      const q = filter.search.toLowerCase().trim();
      const inName = s.name.toLowerCase().includes(q);
      const inDesc = s.description.toLowerCase().includes(q);
      const inProv = s.providerName.toLowerCase().includes(q);
      const inCat = s.categoryLabel.toLowerCase().includes(q);
      const inCap = Array.isArray(s.capabilities) && s.capabilities.some(c => c.toLowerCase().includes(q));
      if (!inName && !inDesc && !inProv && !inCat && !inCap) {
        return false;
      }
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <i data-lucide="layers" class="w-8 h-8 text-[#7D39EB] mx-auto mb-2 opacity-50"></i>
        <div class="text-xs font-mono font-bold text-[#FFFFFF]">No Cloud Services Found</div>
        <p class="text-[11px] text-white/60 mt-1 max-w-sm mx-auto">No services match the active provider and category filters. Try resetting search or selecting another category.</p>
      </div>`;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  container.innerHTML = filtered.map(s => `
    <div class="p-3.5 rounded-xl bg-[rgba(14,8,26,0.75)] border border-[rgba(125,57,235,0.35)] shadow-sm hover:border-[#7D39EB] hover:bg-[rgba(22,12,40,0.85)] transition flex flex-col justify-between">
      <div>
        <div class="flex items-start justify-between gap-2 mb-1.5">
          <span class="font-bold text-[#FFFFFF] text-xs leading-snug">${escapeHtml(s.name)}</span>
          <span class="tech-badge badge-violet text-[9px] uppercase shrink-0 font-mono">${escapeHtml(s.categoryLabel)}</span>
        </div>
        <div class="text-[11px] font-mono text-[#7D39EB] font-semibold mb-2 flex items-center gap-1.5">
          <span>${escapeHtml(s.providerName)}</span>
          <span class="text-white/40">•</span>
          <span class="text-[10px] text-white/50 uppercase">${escapeHtml(s.providerId)}</span>
        </div>
        <p class="text-[11px] text-white/80 leading-relaxed mb-3">${escapeHtml(s.description)}</p>
      </div>
      <div class="flex flex-wrap gap-1 pt-2 border-t border-[rgba(125,57,235,0.2)]">
        ${(s.capabilities || []).map(cap => `<span class="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[rgba(10,5,20,0.7)] text-white/70 border border-[rgba(125,57,235,0.25)]">${escapeHtml(cap)}</span>`).join("")}
      </div>
    </div>
  `).join("");

  if (window.lucide) window.lucide.createIcons();
}

// =========================================================================
// Cloud Credits Modal Logic
// =========================================================================

function openCreditsModal() {
  const modal = document.getElementById("credits-modal");
  const container = document.getElementById("credits-container");
  if (!modal || !container) return;

  modal.classList.remove("hidden");

  const programs = appState.credits || [];
  if (programs.length === 0) {
    container.innerHTML = `<div class="text-xs text-white/60 font-mono text-center py-6">Loading cloud credits directory...</div>`;
    fetch("/api/catalog/credits")
      .then(res => res.json())
      .then(d => {
        appState.credits = d.programs;
        renderCreditsList(d.programs);
      });
  } else {
    renderCreditsList(programs);
  }
}

function renderCreditsList(programs) {
  const container = document.getElementById("credits-container");
  if (!container) return;

  container.innerHTML = programs.map(p => `
    <div class="p-4 rounded-xl bg-[rgba(14,8,26,0.75)] border border-[rgba(125,57,235,0.35)] text-xs">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-1.5">
        <div>
          <span class="font-bold text-[#FFFFFF] text-sm font-mono">${p.providerName}</span>
          <span class="text-white/60 block text-[11px]">${p.programName}</span>
        </div>
        <div class="text-right">
          ${p.maxCreditsUSD > 0 ? `
            <span class="text-sm font-bold text-[#C6FF33] font-mono">Up to ${formatCurrency(p.maxCreditsUSD)}</span>
          ` : `
            <span class="text-xs font-bold text-[#7D39EB] font-mono">100% Free Open Source</span>
          `}
        </div>
      </div>
      <div class="text-[11px] text-white/80 mb-2 leading-relaxed">
        <strong class="text-[#7D39EB]">Trial / Allowance:</strong> ${p.trialAllowance}
      </div>
      <div class="p-2 rounded bg-[rgba(10,5,20,0.7)] border border-[rgba(125,57,235,0.25)] text-[11px] text-white/80">
        <strong class="text-[#7D39EB]">Eligibility:</strong> ${p.requirements}
      </div>
    </div>
  `).join("");
}

// =========================================================================
// Saved Blueprints Modal & LocalStorage Logic
// =========================================================================

function openSavedBlueprintsModal() {
  const modal = document.getElementById("saved-modal");
  const list = document.getElementById("saved-blueprints-list");
  if (!modal || !list) return;

  modal.classList.remove("hidden");
  renderSavedBlueprintsList();
}

function getSavedBlueprints() {
  try {
    return JSON.parse(localStorage.getItem("cloud_ai_blueprints") || "[]");
  } catch (e) {
    return [];
  }
}

function saveCurrentBlueprint() {
  if (!appState.evaluation) {
    showNotification("No evaluated architecture to save.", "warning");
    return;
  }

  const name = prompt("Enter a name for this architecture blueprint:", `${appState.evaluation.recommended.name} Blueprint`);
  if (!name) return;

  const blueprints = getSavedBlueprints();
  const newBp = {
    id: `bp-${Date.now()}`,
    name: name,
    savedAt: new Date().toISOString(),
    prompt: appState.rawPrompt,
    evaluation: appState.evaluation
  };

  blueprints.unshift(newBp);
  localStorage.setItem("cloud_ai_blueprints", JSON.stringify(blueprints.slice(0, 20)));
  showNotification(`Blueprint "${name}" saved to local workstation.`, "success");
}

function renderSavedBlueprintsList() {
  const list = document.getElementById("saved-blueprints-list");
  if (!list) return;

  const blueprints = getSavedBlueprints();
  if (blueprints.length === 0) {
    list.innerHTML = `<div class="py-8 text-center text-xs font-mono text-white/50">No saved blueprints found in local workstation.</div>`;
    return;
  }

  list.innerHTML = blueprints.map(bp => `
    <div class="p-3 rounded-xl bg-[rgba(14,8,26,0.75)] border border-[rgba(125,57,235,0.35)] flex items-center justify-between gap-3 text-xs">
      <div>
        <div class="font-bold text-[#FFFFFF] font-mono text-sm">${bp.name}</div>
        <div class="text-[10px] text-white/60 font-mono">Saved ${new Date(bp.savedAt).toLocaleDateString()} — Winner: ${bp.evaluation.recommended.name} (${bp.evaluation.recommended.score}/100)</div>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="loadSavedBlueprint('${bp.id}')" class="btn-secondary text-xs py-1 px-2.5">
          Load
        </button>
        <button onclick="deleteSavedBlueprint('${bp.id}')" class="text-white/60 hover:text-[#C6FF33] text-xs font-mono px-1">
          Delete
        </button>
      </div>
    </div>
  `).join("");
}

function loadSavedBlueprint(bpId) {
  const bp = getSavedBlueprints().find(b => b.id === bpId);
  if (!bp) return;

  const promptInput = document.getElementById("workload-prompt-input");
  if (promptInput) promptInput.value = bp.prompt || "";

  appState.status = "results";
  appState.rawPrompt = bp.prompt;
  appState.structuredWorkload = bp.evaluation.workload;
  appState.evaluation = bp.evaluation;

  renderEvaluationResults(bp.evaluation);
  document.getElementById("saved-modal").classList.add("hidden");
  showNotification(`Loaded blueprint: ${bp.name}`, "info");
}

function deleteSavedBlueprint(bpId) {
  const blueprints = getSavedBlueprints().filter(b => b.id !== bpId);
  localStorage.setItem("cloud_ai_blueprints", JSON.stringify(blueprints));
  renderSavedBlueprintsList();
  showNotification("Blueprint removed.", "info");
}

// =========================================================================
// Architecture Decision Record (ADR) Export Generator
// =========================================================================

function generateADRMarkdown(data) {
  const wl = data.workload;
  const rec = data.recommended;
  const runner = data.runnerUp;
  const nodes = data.architecture ? data.architecture.nodes : [];

  return `# ADR-001: Cloud Architecture Selection for ${rec.name}

* **Status:** Accepted
* **Date:** ${new Date().toISOString().split('T')[0]}
* **Deciders:** Cloud AI Architect V2 Deterministic Engine
* **Technical Workload:** ${wl.rawPrompt.slice(0, 100)}...

---

### 1. Context & Problem Statement
The organization requires a resilient cloud deployment architecture for a workload with the following parameters:
* **Daily Active Users (DAU):** ${wl.dailyActiveUsers ? wl.dailyActiveUsers.toLocaleString() : 'Unspecified'}
* **Monthly Budget:** ${wl.monthlyBudget ? formatRawAmount(wl.monthlyBudget, wl.budgetCurrency) : 'Uncapped'}
* **Target Region:** ${wl.region}
* **Traffic Surge Multiplier:** ${wl.trafficSurge}×
* **Operating System:** ${wl.operatingSystem}
* **Database Requirement:** ${wl.database.type} (HA: ${wl.database.highAvailability ? 'Yes' : 'No'})
* **Special Capabilities:** GPU Inference: ${wl.gpuInference.required}, WebSockets: ${wl.websockets.required}, Media Processing: ${wl.mediaProcessing.required}, Scheduled Jobs: ${wl.scheduledJobs.required}

---

### 2. Decision Outcome
**Chosen Provider:** **${rec.name}**
* **Deterministic Score:** ${rec.score} / 100
* **Category:** ${rec.category}
* **Runner-Up:** ${runner.name} (${runner.score} / 100)
* **Confidence Level:** ${data.confidence}%

#### Decision Drivers:
${(rec.matchedRequirements || []).map(m => `* ${m}`).join('\n')}

---

### 3. Active Architecture Topology
${nodes.map((n, i) => `${i + 1}. **${n.service || n.name}** (${(n.category || n.type || 'PaaS').toUpperCase()}): ${n.purpose || n.description || n.configuration || ''}`).join('\n')}

---

### 4. Cost Model & 24-Hour Economics
* **Estimated Monthly Cost:** ${formatCurrency(rec.cost.monthlyUSD)}
* **Estimated 24-Hour (Daily) Cost:** ${formatCurrency(rec.cost24HrUSD || (rec.cost.monthlyUSD / 30.4))}
* **Cost Range:** ${formatCurrency(rec.cost.rangeMinUSD)} — ${formatCurrency(rec.cost.rangeMaxUSD)}
* **Free Tier Allowance:** ${rec.freeAllowance || 'Standard trial'}

---

### 5. Architectural Trade-Offs & Mitigations
${(data.serviceTradeoffs || []).map(t => `* **${t.dimension}:** Selected *${t.selected}* — ${t.tradeoffReason}`).join('\n')}

---

### 6. Identified Risks & Flaws
${(data.flaws || []).map(f => `* **[${f.severity}] ${f.title}:** ${f.description} (Remediation: ${f.remediation})`).join('\n')}
`;
}

function openADRModal() {
  if (!appState.evaluation) return;
  const modal = document.getElementById("adr-modal");
  const content = document.getElementById("adr-content-display");
  if (!modal || !content) return;

  const markdown = generateADRMarkdown(appState.evaluation);
  content.textContent = markdown;
  modal.classList.remove("hidden");
}

function copyADRText() {
  const content = document.getElementById("adr-content-display");
  if (!content || !content.textContent) return;

  navigator.clipboard.writeText(content.textContent).then(() => {
    showNotification("ADR copied to clipboard.", "success");
  });
}

function downloadADRFile() {
  const content = document.getElementById("adr-content-display");
  if (!content || !content.textContent) return;

  const blob = new Blob([content.textContent], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ADR-001-${appState.evaluation.recommended.id}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showNotification("ADR markdown file downloaded.", "success");
}

// =========================================================================
// Test Fixtures Menu Logic
// =========================================================================

function renderTestFixturesMenu() {
  const container = document.getElementById("test-fixtures-container");
  if (!container) return;

  container.innerHTML = TEST_FIXTURES.map(f => `
    <div onclick="selectTestFixture('${f.id}')"
      class="p-3.5 rounded-xl bg-[rgba(14,8,26,0.75)] hover:bg-[rgba(22,12,40,0.85)] border border-[rgba(125,57,235,0.35)] hover:border-[#7D39EB] transition cursor-pointer text-left">
      <div class="flex items-center justify-between gap-2 mb-1">
        <span class="font-bold text-[#FFFFFF] text-xs font-mono">${f.name}</span>
        <span class="tech-badge badge-violet text-[9px]">Preset</span>
      </div>
      <p class="text-xs text-white/80 mb-1.5 leading-snug">${f.desc}</p>
      <div class="text-[10px] text-white/60 font-mono truncate bg-[rgba(10,5,20,0.7)] p-1.5 rounded border border-[rgba(125,57,235,0.25)]">
        ${f.prompt}
      </div>
    </div>
  `).join("");
}

function selectTestFixture(fixtureId) {
  const fixture = TEST_FIXTURES.find(f => f.id === fixtureId);
  if (!fixture) return;

  const promptInput = document.getElementById("workload-prompt-input");
  if (promptInput) {
    promptInput.value = fixture.prompt;
  }

  document.getElementById("test-bench-modal").classList.add("hidden");
  handleWorkloadSubmit();
}

// =========================================================================
// Utility DOM Helpers
// =========================================================================

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function styleStatusBadge(id, isActive) {
  const el = document.getElementById(id);
  if (!el) return;
  if (isActive) {
    el.className = "font-mono font-bold text-xs text-[#C6FF33]";
  } else {
    el.className = "font-mono font-bold text-xs text-white/40";
  }
}

function clearEvaluationState() {
  renderEmptyState();
  showNotification("Workload state cleared. System reset to empty state.", "info");
}

function showNotification(message, type = "info") {
  const toast = document.getElementById("system-notification-toast");
  if (!toast) return;

  toast.textContent = message;
  toast.className = `fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl text-xs font-mono font-bold shadow-xl transition flex items-center gap-2 border bg-[#0C0618] border-[#7D39EB] ${
    type === "success" ? "text-[#C6FF33]" : "text-[#FFFFFF]"
  }`;
  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3500);
}

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
