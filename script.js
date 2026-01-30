/* ================= CORE LOAD ================= */
async function loadAll() {
  const data = await fetch("prices.json").then(r => r.json());
  renderTable(data);
  await loadLiveMarkets(data);
  loadNews();
}

/* ================= DATE & MARKET ================= */
function isWeekend() {
  return [0,6].includes(new Date().getDay());
}

/* ================= TABLE ================= */
function renderTable(data) {
  const body = document.getElementById("priceTableBody");
  body.innerHTML = "";

  document.getElementById("marketStatus").innerText =
    isWeekend() ? "Market Closed" : "Market Open";

  document.getElementById("lastUpdated").innerText =
    new Date().toLocaleDateString("en-IN", {
      day:"numeric", month:"long", year:"numeric"
    });

  function row(name, unit, today, prev) {
    const diff = today - prev;
    const cls = diff >= 0 ? "up" : "down";
    return `
      <tr>
        <td>${name}</td>
        <td>${unit}</td>
        <td>₹ ${today.toLocaleString("en-IN")}</td>
        <td>₹ ${prev.toLocaleString("en-IN")}</td>
        <td class="${cls}">
          ${diff >= 0 ? "▲" : "▼"} ₹${Math.abs(diff).toLocaleString("en-IN")}
        </td>
      </tr>
    `;
  }

  body.innerHTML += row("Gold 24K","10g",data.prices.gold24.today,data.prices.gold24.yesterday);
  body.innerHTML += row("Gold 22K","10g",data.prices.gold22.today,data.prices.gold22.yesterday);
  body.innerHTML += row("Silver","1kg",data.prices.silver.today,data.prices.silver.yesterday);
  body.innerHTML += row("Copper","1kg",data.prices.copper.today,data.prices.copper.yesterday);
}

/* ================= LIVE MARKETS ================= */
async function loadLiveMarkets(data) {
  const tickerItems = [];
  const i = data.ticker.items;

  // Bitcoin
  if (i.bitcoin) {
    const r = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=inr&include_24hr_change=true");
    const d = await r.json();
    tickerItems.push(tick("Bitcoin", d.bitcoin.inr, d.bitcoin.inr_24h_change, "%"));
  }

  // Sensex
  if (i.sensex) {
    const r = await fetch("https://query1.finance.yahoo.com/v8/finance/chart/%5EBSESN");
    const d = await r.json();
    const m = d.chart.result[0].meta;
    tickerItems.push(tick("Sensex", m.regularMarketPrice, m.regularMarketChangePercent, "%"));
  }

  // Nifty
  if (i.nifty) {
    const r = await fetch("https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI");
    const d = await r.json();
    const m = d.chart.result[0].meta;
    tickerItems.push(tick("Nifty", m.regularMarketPrice, m.regularMarketChangePercent, "%"));
  }

  buildTicker(data, tickerItems);
}

/* ================= TICKER ================= */
function tick(label, price, change, unit) {
  const cls = change >= 0 ? "up" : "down";
  return `<span class="${cls}">
    ${label} ${price.toLocaleString("en-IN")}
    ${change>=0?"▲":"▼"}${Math.abs(change).toFixed(2)}${unit}
  </span>`;
}

function buildTicker(data, autoItems) {
  if (!data.ticker.enabled) {
    document.getElementById("tickerWrapper").style.display = "none";
    return;
  }

  const p = data.prices;
  const i = data.ticker.items;
  const t = [];

  function manual(label, today, prev) {
    const d = today - prev;
    return `<span class="${d>=0?"up":"down"}">
      ${label} ₹${today.toLocaleString("en-IN")}
      ${d>=0?"▲":"▼"}${Math.abs(d).toLocaleString("en-IN")}
    </span>`;
  }

  if (i.gold24) t.push(manual("Gold 24K",p.gold24.today,p.gold24.yesterday));
  if (i.gold22) t.push(manual("Gold 22K",p.gold22.today,p.gold22.yesterday));
  if (i.silver) t.push(manual("Silver",p.silver.today,p.silver.yesterday));
  if (i.copper) t.push(manual("Copper",p.copper.today,p.copper.yesterday));

  document.getElementById("ticker").innerHTML =
    [...t, ...autoItems].join(" · ");
}

/* ================= NEWS (RSS – NO CORS) ================= */
async function loadNews() {
  const r = await fetch("https://api.allorigins.win/raw?url=https://feeds.feedburner.com/ndtvprofit-latest");
  const t = await r.text();
  const xml = new DOMParser().parseFromString(t,"text/xml");
  const items = [...xml.querySelectorAll("item")].slice(0,5);

  document.getElementById("newsList").innerHTML =
    items.map(i=>`
      <div style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,.05)">
        <div>${i.querySelector("title").textContent}</div>
        <div style="font-size:11px;color:#94a3b8">NDTV Profit</div>
      </div>
    `).join("");
}

/* ================= INIT ================= */
loadAll();
