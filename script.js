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
/* ---------------- 7 DAY CHART ---------------- */

let chartInstance = null;

async function loadChart(asset) {
  let labels = [];
  let prices = [];

  try {
    if (asset === "bitcoin" || asset === "ethereum" || asset === "silver") {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${asset}/market_chart?vs_currency=inr&days=7`
      );
      const data = await res.json();

      data.prices.forEach(item => {
        const date = new Date(item[0]);
        labels.push(date.toLocaleDateString("en-IN"));
        prices.push(item[1]);
      });
    }

    if (asset === "sensex") {
      const res = await fetch(
        "https://query1.finance.yahoo.com/v8/finance/chart/%5EBSESN?interval=1d&range=7d"
      );
      const data = await res.json();
      const timestamps = data.chart.result[0].timestamp;
      const values = data.chart.result[0].indicators.quote[0].close;

      timestamps.forEach((t, i) => {
        labels.push(new Date(t * 1000).toLocaleDateString("en-IN"));
        prices.push(values[i]);
      });
    }

    if (asset === "nifty") {
      const res = await fetch(
        "https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI?interval=1d&range=7d"
      );
      const data = await res.json();
      const timestamps = data.chart.result[0].timestamp;
      const values = data.chart.result[0].indicators.quote[0].close;

      timestamps.forEach((t, i) => {
        labels.push(new Date(t * 1000).toLocaleDateString("en-IN"));
        prices.push(values[i]);
      });
    }

    renderChart(labels, prices, asset.toUpperCase());

  } catch (err) {
    console.warn("Chart load failed", err);
  }
}

function renderChart(labels, data, label) {
  const ctx = document.getElementById("priceChart").getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: data,
        borderColor: "#3b82f6",
        tension: 0.4,
        fill: false
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { display: true },
        y: { display: true }
      }
    }
  });
}

// Load default chart
loadChart("bitcoin");


body.dark .chart-tabs button {
  background: #2563eb;
      }
/* ---------------- MARKET NEWS ---------------- */

const NEWS_API_KEY = "2aca9d2047854078b8f326e718ad5dc7";

async function loadMarketNews() {
  try {
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?category=business&q=market OR crypto OR gold&language=en&pageSize=5&apiKey=${NEWS_API_KEY}`
    );

    const data = await res.json();
    const newsList = document.getElementById("newsList");
    newsList.innerHTML = "";

    data.articles.forEach(article => {
      const li = document.createElement("li");
      li.innerHTML = `
        <a href="${article.url}" target="_blank" style="text-decoration:none;color:inherit;">
          <strong>${article.title}</strong><br/>
          <span style="font-size:12px;color:gray;">
            ${article.source.name}
          </span>
        </a>
      `;
      newsList.appendChild(li);
    });

  } catch (err) {
    console.warn("News fetch failed", err);
  }
}

// Load once + refresh every 10 minutes
loadMarketNews();
setInterval(loadMarketNews, 600000);

