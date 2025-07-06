import cron from "node-cron";
import { syncArtists } from "../src/utils/syncArtists.js";

console.log("🕒 Sync worker running...");

cron.schedule("55 16 * * *", async () => {
  console.log("🔁 Cron: Starting daily artist sync...");
  try {
    await syncArtists();
    console.log("✅ Sync done.");
  } catch (err) {
    console.error("❌ Sync failed:", err);
  }
});
