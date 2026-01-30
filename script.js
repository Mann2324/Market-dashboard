import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const cards = document.getElementById("cards");
const table = document.getElementById("priceTable");

async function loadPrices() {
  try {
    const snap = await getDocs(collection(db, "prices"));

    if (snap.empty) {
      cards.innerHTML = "<p>No data found</p>";
      return;
    }

    snap.forEach(doc => {
      const d = doc.data();
      const diff = d.today - d.yesterday;
      const cls = diff >= 0 ? "up" : "down";

      // Cards
      cards.innerHTML += `
        <div class="card">
          <h4>${d.asset} (${d.unit})</h4>
          <div class="price">₹ ${d.today.toLocaleString("en-IN")}</div>
          <div class="${cls}">
            ${diff >= 0 ? "▲" : "▼"} ₹ ${Math.abs(diff).toLocaleString("en-IN")}
          </div>
        </div>
      `;

      // Table
      table.innerHTML += `
        <tr>
          <td>${d.asset}</td>
          <td>${d.unit}</td>
          <td>₹ ${d.today.toLocaleString("en-IN")}</td>
          <td>₹ ${d.yesterday.toLocaleString("en-IN")}</td>
          <td class="${cls}">
            ${diff >= 0 ? "▲" : "▼"} ₹ ${Math.abs(diff).toLocaleString("en-IN")}
          </td>
        </tr>
      `;
    });

  } catch (e) {
    console.error(e);
    document.body.insertAdjacentHTML(
      "afterbegin",
      "<p style='color:red'>Failed to load prices</p>"
    );
  }
}

loadPrices();
                 
