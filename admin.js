async function saveData() {
  const data = await fetch("prices.json").then(r => r.json());

  data.prices.gold24.today = +gold24Today.value;
  data.prices.gold24.yesterday = +gold24Yesterday.value;

  data.prices.gold22.today = +gold22Today.value;
  data.prices.gold22.yesterday = +gold22Yesterday.value;

  data.prices.silver.today = +silverToday.value;
  data.prices.silver.yesterday = +silverYesterday.value;

  data.prices.copper.today = +copperToday.value;
  data.prices.copper.yesterday = +copperYesterday.value;

  data.ticker.enabled = tickerEnabled.checked;
  data.ticker.items.gold24 = tickGold24.checked;
  data.ticker.items.gold22 = tickGold22.checked;
  data.ticker.items.silver = tickSilver.checked;
  data.ticker.items.copper = tickCopper.checked;
  data.ticker.items.nifty = tickNifty.checked;
  data.ticker.items.sensex = tickSensex.checked;
  data.ticker.items.bitcoin = tickBitcoin.checked;

  data.meta.lastUpdated = new Date().toISOString();

  alert(
    "IMPORTANT:\n\nGitHub Pages cannot auto-write files.\n\n" +
    "Next step:\n" +
    "1. Copy updated values\n" +
    "2. Paste them into prices.json\n" +
    "3. Commit\n\n" +
    "Phase 2 will automate this."
  );
}
