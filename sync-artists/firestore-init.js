const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // make sure this JSON file is in sync-artists folder

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = { db, admin };
