/* ===== THEME TOGGLE ===== */
const toggleBtn = document.getElementById("themeToggle");
const icon = toggleBtn.querySelector("i");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  icon.classList.replace("fa-moon", "fa-sun");
}

toggleBtn.onclick = () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  icon.classList.toggle("fa-moon");
  icon.classList.toggle("fa-sun");
};

/* ===== UPDATE PRICE ===== */
function updatePrice(name, price, change = 0) {
  document.querySelectorAll(".card").forEach(card => {
    if (card.querySelector(".label").innerText === name) {
      const el = card.querySelector(".price");
      el.classList.remove("skeleton");
      const arrow = change >= 0 ? "▲" : "▼";
      const color = change >= 0 ? "#16a34a" : "#dc2626";
      el.innerHTML = `₹ ${price.toLocaleString("en-IN")}
        <span style="color:${color};font-size:12px;">
          ${arrow} ${change.toFixed(2)}%
        </span>`;
    }
  });
}

/* ===== CRYPTO + SILVER ===== */
async function loadCrypto() {
  const r = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,silver&vs_currencies=inr&include_24hr_change=true"
  );
  const d = await r.json();
  updatePrice("Bitcoin", d.bitcoin.inr, d.bitcoin.inr_24h_change);
  updatePrice("Ethereum", d.ethereum.inr, d.ethereum.inr_24h_change);
  updatePrice("Silver", d.silver.inr, d.silver.inr_24h_change);
}
loadCrypto();
setInterval(loadCrypto, 60000);

/* ===== GOLD (GoldAPI) ===== */
const GOLD_API_KEY = "goldapi-c1v6w5sml0pd769-io";

async function loadGold() {
  const r = await fetch("https://www.goldapi.io/api/XAU/INR", {
    headers: { "x-access-token": GOLD_API_KEY }
  });
  const d = await r.json();
  updatePrice("Gold", d.price / 31.1035, d.ch || 0);
}
loadGold();
setInterval(loadGold, 300000);

/* ===== SENSEX / NIFTY ===== */
async function loadIndices() {
  const s = await fetch("https://query1.finance.yahoo.com/v8/finance/chart/%5EBSESN?range=1d&interval=1d");
  const sd = await s.json();
  updatePrice("Sensex",
    sd.chart.result[0].meta.regularMarketPrice,
    sd.chart.result[0].meta.regularMarketChangePercent
  );

  const n = await fetch("https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI?range=1d&interval=1d");
  const nd = await n.json();
  updatePrice("Nifty",
    nd.chart.result[0].meta.regularMarketPrice,
    nd.chart.result[0].meta.regularMarketChangePercent
  );
}
loadIndices();
setInterval(loadIndices, 300000);

/* ===== NEWS (NewsAPI) ===== */
const NEWS_API_KEY = "2aca9d2047854078b8f326e718ad5dc7";

async function loadNews() {
  const r = await fetch(
    `https://newsapi.org/v2/top-headlines?category=business&language=en&pageSize=5&apiKey=${NEWS_API_KEY}`
  );
  const d = await r.json();
  const list = document.getElementById("newsList");
  list.innerHTML = "";
  d.articles.forEach(a => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${a.url}" target="_blank">
      <strong>${a.title}</strong><br>
      <span style="font-size:12px;color:gray">${a.source.name}</span>
    </a>`;
    list.appendChild(li);
  });
}
loadNews();
setInterval(loadNews, 600000);

/* ===== CHART ===== */
let chart;
async function loadChart(asset) {
  let labels=[], data=[];
  if (["bitcoin","ethereum","silver"].includes(asset)) {
    const r = await fetch(`https://api.coingecko.com/api/v3/coins/${asset}/market_chart?vs_currency=inr&days=7`);
    const d = await r.json();
    d.prices.forEach(p=>{
      labels.push(new Date(p[0]).toLocaleDateString("en-IN"));
      data.push(p[1]);
    });
  } else {
    const sym = asset==="sensex"?"%5EBSESN":"%5ENSEI";
    const r = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${sym}?range=7d&interval=1d`);
    const d = await r.json();
    d.chart.result[0].timestamp.forEach((t,i)=>{
      labels.push(new Date(t*1000).toLocaleDateString("en-IN"));
      data.push(d.chart.result[0].indicators.quote[0].close[i]);
    });
  }

  if (chart) chart.destroy();
  chart = new Chart(document.getElementById("priceChart"), {
    type: "line",
    data: { labels, datasets:[{ data, borderColor:"#3b82f6", tension:0.4 }] },
    options:{ plugins:{legend:{display:false}} }
  });
}
loadChart("bitcoin");
              
