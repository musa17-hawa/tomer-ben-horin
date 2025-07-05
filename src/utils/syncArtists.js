// /src/utils/syncArtists.js
import puppeteer from "puppeteer";
import fetch from "node-fetch";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Init Firebase only once
// if (!global._firebaseAppInitialized) {
//   // initializeApp({
//   //   credential: applicationDefault(),
//   // });
//   const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);
//   initializeApp({
//     credential: cert(serviceAccount),
//   });

//   global._firebaseAppInitialized = true;
// }
import { initializeApp, cert } from "firebase-admin/app";

if (!global._firebaseAppInitialized) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);
  initializeApp({
    credential: cert(serviceAccount),
  });
  global._firebaseAppInitialized = true;
}

const db = getFirestore();
const auth = getAuth();

const CONCURRENCY = 3;
const TIMEOUT = 60000;

async function getArtistDetails(browser, url) {
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: TIMEOUT });

    const emailMatch = (await page.content()).match(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
    );
    const email = emailMatch ? emailMatch[0].toLowerCase() : null;

    const result = await page.evaluate(() => {
      const getText = (selector) =>
        Array.from(document.querySelectorAll(selector))
          .map((el) => el.innerText.trim())
          .join("\n");

      const bio = getText(".elementor-widget-theme-post-content p");
      const subject =
        document
          .querySelector("h2.elementor-heading-title")
          ?.innerText.replace("תחום האומנות:", "")
          .trim() || "";
      const group =
        document
          .querySelector(".jet-listing-dynamic-terms__prefix")
          ?.parentElement.innerText.replace("אזור מגורים:", "")
          .trim() || "";
      const place = group;
      const link =
        Array.from(
          document.querySelectorAll(".jet-listing-dynamic-link__link")
        ).filter(
          (el) => el.href?.includes("http") && !el.href.includes("mailto")
        )[0]?.href || "";
      const image =
        document.querySelector(
          ".elementor-element-843105e img.attachment-full.size-full"
        )?.src || "";

      return { bio, subject, group, place, link, image };
    });

    await page.close();
    await new Promise((r) => setTimeout(r, 200));
    return { email, ...result };
  } catch (err) {
    await page.close();
    throw err;
  }
}

export async function syncArtists() {
  let allArtists = [];
  let pageNumber = 1;
  const perPage = 100;

  while (true) {
    const res = await fetch(
      `https://amutatbh.com/wp-json/wp/v2/artists?per_page=${perPage}&page=${pageNumber}`
    );
    if (!res.ok) break;
    const data = await res.json();
    allArtists = allArtists.concat(data);
    if (data.length < perPage) break;
    pageNumber++;
  }

  console.log(`📆 Total artists fetched: ${allArtists.length}`);

  const browser = await puppeteer.launch({
    headless: true,
    protocolTimeout: 120000,
    args: ["--no-sandbox"],
  });

  for (let i = 0; i < allArtists.length; i += CONCURRENCY) {
    const chunk = allArtists.slice(i, i + CONCURRENCY);
    const promises = chunk.map(async (artist) => {
      const name = artist.title?.rendered?.trim();
      const slug = artist.slug;
      const profileUrl = `https://amutatbh.com/artists/${slug}`;

      try {
        const { email, bio, subject, group, place, link, image } =
          await getArtistDetails(browser, profileUrl);

        if (!email || !name) {
          console.warn(
            `⚠️ Skipping: ${name || "Unknown"} (${email || "no email"})`
          );
          return;
        }

        let uid;
        try {
          const user = await auth.createUser({
            email,
            password: name,
            displayName: name,
          });
          uid = user.uid;
        } catch (err) {
          if (err.code === "auth/email-already-exists") {
            const existingUser = await auth.getUserByEmail(email);
            uid = existingUser.uid;
          } else {
            throw err;
          }
        }

        const docRef = db.collection("users").doc(uid);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          console.log(`⏩ Already exists: ${name} (${email})`);
          return;
        }

        await docRef.set(
          {
            name,
            email,
            uid,
            profileUrl,
            bio,
            subject,
            group,
            place,
            link,
            image,
          },
          { merge: true }
        );

        console.log(`✅ Synced: ${name} (${email})`);
      } catch (err) {
        console.error(`❌ Failed to sync ${name || slug}: ${err.message}`);
      }
    });

    await Promise.allSettled(promises);
  }

  await browser.close();
  console.log("🎉 All artists synced.");
}
