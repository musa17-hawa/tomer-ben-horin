const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const { syncArtists } = require("../src/utils/syncArtists");

exports.scheduledSyncArtists = functions.pubsub
  .schedule("0 3 * * *") // Every day at 06:00 AM
  .timeZone("Asia/Jerusalem")
  .onRun(async (context) => {
    console.log("🚀 Running scheduled artist sync...");
    await syncArtists();
    console.log("✅ Artist sync completed.");
  });
