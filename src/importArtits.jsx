import { useEffect, useState } from "react";
import axios from "axios";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase"; // your firebase config file

const ImportArtists = () => {
  const [imported, setImported] = useState(false);
  const [error, setError] = useState("");

  const fetchAndSaveArtists = async () => {
    try {
      const response = await axios.get(
        "https://amutatbh.com/wp-json/wp/v2/artists"
      );
      const artists = response.data;

      for (const artist of artists) {
        const {
          title,
          content,
          acf, // custom fields
        } = artist;

        const name = title.rendered;
        const bio = content.rendered.replace(/<[^>]+>/g, ""); // strip HTML
        const subject = acf?.area_of_art || "";
        const group = acf?.group || "";
        const email = acf?.email || "";
        const place = acf?.place || "";
        const image = acf?.profile_picture?.url || "";

        // Save to Firestore
        await addDoc(collection(db, "artists"), {
          name,
          bio,
          subject,
          group,
          email,
          place,
          image,
          importedAt: new Date(),
        });
      }

      setImported(true);
    } catch (err) {
      console.error("Error importing artists:", err);
      setError("Failed to import artist data.");
    }
  };

  useEffect(() => {
    fetchAndSaveArtists();
  }, []);

  return (
    <div>
      {imported ? "✅ Artists imported successfully!" : "⏳ Importing..."}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ImportArtists;
