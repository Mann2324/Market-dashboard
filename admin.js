import { db } from "./firebase.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function update(asset, value) {
  await updateDoc(doc(db, "prices", asset), {
    today: Number(value)
  });
}

window.save = async () => {
  await update("gold24", gold24.value);
  await update("gold22", gold22.value);
  await update("silver", silver.value);
  await update("copper", copper.value);
  alert("Prices updated");
};
