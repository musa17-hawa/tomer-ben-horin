// /api/sync.js
import { syncArtists } from "../src/utils/syncArtists.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    await syncArtists();
    res.status(200).send("✅ Artists synced successfully");
  } catch (err) {
    console.error("❌ Sync failed:", err.message);
    res.status(500).send("❌ Sync failed: " + err.message);
  }
}
