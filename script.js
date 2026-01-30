import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const cards = document.getElementById("cards");
const table = document.getElementById("priceTable");

async function loadPrices() {
  try {
    const snap = await getDocs(collection(db, "prices"));

    cards.innerHTML = "";
    table.innerHTML = "";

    snap.forEach(doc => {
      const d = doc.data();

      const diff = d.today - d.yesterday;
      const cls = diff >= 0 ? "up" : "down";
      const arrow = diff >= 0 ? "▲" : "▼";

      // CARD
      cards.innerHTML += `
        <div class="card">
          <h4>${d.asset} (${d.unit})</h4>
          <div class="price">₹ ${d.today.toLocaleString("en-IN")}</div>
          <div class="${cls}">
            ${arrow} ₹ ${Math.abs(diff).toLocaleString("en-IN")}
          </div>
        </div>
      `;

      // TABLE ROW
      table.innerHTML += `
        <tr>
          <td>${d.asset}</td>
          <td>${d.unit}</td>
          <td>₹ ${d.today.toLocaleString("en-IN")}</td>
          <td>₹ ${d.yesterday.toLocaleString("en-IN")}</td>
          <td class="${cls}">
            ${arrow} ₹ ${Math.abs(diff).toLocaleString("en-IN")}
          </td>
        </tr>
      `;
    });

  } catch (err) {
    console.error("Firestore error:", err);
    cards.innerHTML = "<p style='color:red'>Failed to load prices</p>";
  }
}

loadPrices();
