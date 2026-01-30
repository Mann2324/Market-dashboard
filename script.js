async function loadPrices() {
  const data = await fetch("prices.json").then(r => r.json());

  const body = document.getElementById("priceTableBody");
  body.innerHTML = "";

  const isWeekend = [0,6].includes(new Date().getDay());
  document.getElementById("marketStatus").innerText =
    isWeekend ? "Market Closed" : "Market Open";

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

  body.innerHTML += row(
    "Gold 24K", "10g",
    data.prices.gold24.today,
    data.prices.gold24.yesterday
  );

  body.innerHTML += row(
    "Gold 22K", "10g",
    data.prices.gold22.today,
    data.prices.gold22.yesterday
  );

  body.innerHTML += row(
    "Silver", "1kg",
    data.prices.silver.today,
    data.prices.silver.yesterday
  );

  body.innerHTML += row(
    "Copper", "1kg",
    data.prices.copper.today,
    data.prices.copper.yesterday
  );

  buildTicker(data);
}

function buildTicker(data) {
  if (!data.ticker.enabled) {
    document.getElementById("tickerWrapper").style.display = "none";
    return;
  }

  const t = [];
  const p = data.prices;
  const i = data.ticker.items;

  function item(label, today, prev) {
    const d = today - prev;
    const cls = d >= 0 ? "up" : "down";
    return `<span class="${cls}">
      ${label} ₹${today.toLocaleString("en-IN")}
      ${d>=0?"▲":"▼"}${Math.abs(d).toLocaleString("en-IN")}
    </span>`;
  }

  if (i.gold24) t.push(item("Gold 24K", p.gold24.today, p.gold24.yesterday));
  if (i.gold22) t.push(item("Gold 22K", p.gold22.today, p.gold22.yesterday));
  if (i.silver) t.push(item("Silver", p.silver.today, p.silver.yesterday));
  if (i.copper) t.push(item("Copper", p.copper.today, p.copper.yesterday));

  document.getElementById("ticker").innerHTML = t.join(" · ");
}

loadPrices();
                     
