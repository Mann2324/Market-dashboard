/* ---------------- THEME TOGGLE ---------------- */
const toggleBtn = document.getElementById("themeToggle");
const icon = toggleBtn.querySelector("i");

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  icon.classList.replace("fa-moon", "fa-sun");
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  icon.classList.toggle("fa-moon");
  icon.classList.toggle("fa-sun");
});

/* ---------------- LIVE CRYPTO PRICES ---------------- */
async function loadCryptoPrices() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,silver&vs_currencies=inr&include_24hr_change=true"
"
    );
    const data = await res.json();

    updatePrice("Bitcoin", data.bitcoin.inr, data.bitcoin.inr_24h_change);
    updatePrice("Ethereum", data.ethereum.inr, data.ethereum.inr_24h_change);
    updatePrice("Silver", data.silver.inr, data.silver.inr_24h_change);
    
  } catch (err) {
    console.error("Crypto fetch error", err);
  }
}

/* ---------------- UPDATE UI ---------------- */
function updatePrice(name, price, change) {
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    if (card.querySelector(".label").innerText === name) {
      const priceEl = card.querySelector(".price");
      const arrow = change >= 0 ? "▲" : "▼";
      const color = change >= 0 ? "#16a34a" : "#dc2626";

      priceEl.innerHTML = `
        ₹ ${price.toLocaleString("en-IN")}
        <span style="color:${color}; font-size:13px;">
          ${arrow} ${change.toFixed(2)}%
        </span>
      `;
    }
  });
}

/* ---------------- AUTO REFRESH ---------------- */
loadCryptoPrices();
setInterval(loadCryptoPrices, 60000);
/* ---------------- SENSEX & NIFTY ---------------- */

async function loadIndianIndices() {
  try {
    // Sensex (^BSESN)
    const sensexRes = await fetch(
      "https://query1.finance.yahoo.com/v8/finance/chart/%5EBSESN?interval=1d&range=1d"
    );
    const sensexData = await sensexRes.json();
    const sensexPrice =
      sensexData.chart.result[0].meta.regularMarketPrice;
    const sensexChange =
      sensexData.chart.result[0].meta.regularMarketChangePercent;

    updatePrice("Sensex", sensexPrice, sensexChange);

    // Nifty (^NSEI)
    const niftyRes = await fetch(
      "https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI?interval=1d&range=1d"
    );
    const niftyData = await niftyRes.json();
    const niftyPrice =
      niftyData.chart.result[0].meta.regularMarketPrice;
    const niftyChange =
      niftyData.chart.result[0].meta.regularMarketChangePercent;

    updatePrice("Nifty", niftyPrice, niftyChange);

  } catch (err) {
    console.warn("Index data unavailable", err);
  }
}

// Load once + refresh every 5 minutes
loadIndianIndices();
setInterval(loadIndianIndices, 300000);
