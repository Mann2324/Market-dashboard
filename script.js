document.body.insertAdjacentHTML(
  "afterbegin",
  "<div style='color:red;padding:10px'>JS LOADED</div>"
);

import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const cards = document.getElementById("cards");
const table = document.getElementById("priceTable");

const snap = await getDocs(collection(db, "prices"));

snap.forEach(doc => {
  const d = doc.data();
  const diff = d.today - d.yesterday;
  const cls = diff >= 0 ? "up" : "down";

  cards.innerHTML += `
    <div class="card">
      <h4>${d.asset} (${d.unit})</h4>
      <div class="price">₹ ${d.today.toLocaleString("en-IN")}</div>
      <div class="${cls}">
        ${diff>=0?"▲":"▼"} ₹${Math.abs(diff).toLocaleString("en-IN")}
      </div>
    </div>
  `;

  table.innerHTML += `
    <tr>
      <td>${d.asset}</td>
      <td>${d.unit}</td>
      <td>₹ ${d.today}</td>
      <td>₹ ${d.yesterday}</td>
      <td class="${cls}">
        ${diff>=0?"▲":"▼"} ₹${Math.abs(diff)}
      </td>
    </tr>
  `;
});

// Simple static news for now
document.getElementById("news").innerHTML = `
  <div class="news-item">Gold prices steady amid global cues</div>
  <div class="news-item">Silver demand rises in industrial sector</div>
  <div class="news-item">Markets cautious ahead of US data</div>
`;
.ticker-wrap {
  background: #020617;
  overflow: hidden;
  white-space: nowrap;
  border-bottom: 1px solid var(--border);
}

.ticker {
  display: inline-block;
  padding: 12px 0;
  padding-left: 100%;
  animation: scroll 25s linear infinite;
  font-size: 14px;
  color: var(--muted);
}

@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}
