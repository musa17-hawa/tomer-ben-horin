import { syncArtists } from "./src/utils/syncArtists.js";

syncArtists()
  .then(() => {
    console.log("✅ Sync finished.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Sync failed:", err);
    process.exit(1);
  });
