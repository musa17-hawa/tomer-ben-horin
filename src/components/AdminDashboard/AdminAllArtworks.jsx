import React, { useEffect, useState, useRef } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  documentId,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";
import { Document, Packer, Paragraph, TextRun, Media } from "docx";
import { saveAs } from "file-saver";
import { handleDownloadLabels } from "../../utils/labelGenerator";

// Proxy helper for CORS-bypassed image loading
const withCorsProxy = (url) =>
  `https://corsproxy.io/?${encodeURIComponent(url)}`;
const isRemote = (url) => /^https?:\/\//.test(url);

const AllArtworksByExhibition = () => {
  console.log("DEBUG: AllArtworksByExhibition rendered");
  const [exhibitions, setExhibitions] = useState([]);
  const [selectedExId, setSelectedExId] = useState(null);
  const [selectedArtworks, setSelectedArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingArtworks, setLoadingArtworks] = useState(false);
  const [artworksCache, setArtworksCache] = useState({});
  const [registrations, setRegistrations] = useState({});
  const printRefs = useRef({});
  const tableRef = useRef();
  const tableRefMulti = useRef();
  const tableRefSingle = useRef();
  const logob = "/logob.png";
  const artistRefs = useRef({});

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const snapshot = await getDocs(collection(db, "exhibitions"));

        const exs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "ללא שם",
            location: data.location || "לא צויין מיקום",
            startDate: data.startDate || null,
            endDate: data.endDate || null,
            artworksMeta: data.artworks || [],
            forSingleArtist: data.forSingleArtist || false, // ✅ Add this line
          };
        });

        setExhibitions(exs);
        if (exs.length > 0) {
          setSelectedExId(exs[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch exhibitions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExhibitions();
  }, []);

  useEffect(() => {
    if (!selectedExId || artworksCache[selectedExId]) {
      setSelectedArtworks(artworksCache[selectedExId] || []);
      return;
    }

    const fetchArtworks = async () => {
      setLoadingArtworks(true);
      try {
        const artworks = [];
        const userIdMap = new Map();
        const userIdsToFetch = new Set();

        const artDocs = await getDocs(
          collection(db, "exhibition_artworks", selectedExId, "artworks")
        );

        artDocs.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.approved) {
            artworks.push({ ...data, id: docSnap.id });
            if (data.userId) userIdsToFetch.add(data.userId);
          }
        });

        const chunks = Array.from(userIdsToFetch).reduce((acc, uid, idx) => {
          const i = Math.floor(idx / 10);
          if (!acc[i]) acc[i] = [];
          acc[i].push(uid);
          return acc;
        }, []);

        for (const chunk of chunks) {
          const q = query(
            collection(db, "users"),
            where(documentId(), "in", chunk)
          );
          const usersSnap = await getDocs(q);
          usersSnap.forEach((doc) => {
            userIdMap.set(doc.id, doc.data());
          });
        }

        for (const art of artworks) {
          if (art.userId && userIdMap.has(art.userId)) {
            art.artist = userIdMap.get(art.userId);
            const regRef = doc(
              db,
              "users",
              art.userId,
              "registrations",
              selectedExId
            );
            const regSnap = await getDoc(regRef);
            if (regSnap.exists()) {
              setRegistrations((prev) => ({
                ...prev,
                [art.id]: regSnap.data(),
              }));
            }
          }
        }

        const ex = exhibitions.find((e) => e.id === selectedExId);
        if (Array.isArray(ex?.artworksMeta)) {
          const forSingleArtist = ex?.forSingleArtist || false;

          ex.artworksMeta.forEach((a, i) => {
            artworks.push({
              ...a,
              id: `admin-${i}`,
              artist:
                typeof a.artist === "string"
                  ? { name: a.artist }
                  : a.artist || { name: "הוספה ע״י מנהל" },
              artworkName: forSingleArtist ? a.description || a.name : a.name,
              description: forSingleArtist
                ? a.name || a.description
                : a.description,
            });
          });
        }

        setArtworksCache((prev) => ({ ...prev, [selectedExId]: artworks }));
        setSelectedArtworks(artworks);
      } catch (err) {
        console.error("Error loading artworks", err);
      } finally {
        setLoadingArtworks(false);
      }
    };

    fetchArtworks();
  }, [selectedExId]);

  const generatePDF = async (art) => {
    const ref = printRefs.current[art.id];
    if (!ref) return;

    const images = ref.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map((img) => {
        return new Promise((resolve) => {
          if (img.complete && img.naturalWidth !== 0) resolve();
          else {
            img.onload = resolve;
            img.onerror = resolve;
          }
        });
      })
    );

    const canvas = await html2canvas(ref, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
    });
    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    const artistName =
      art.userId && art.artist
        ? art.artist.name
        : art.artist?.name || art.artist || "הוספה ע״י מנהל";

    pdf.save(`${artistName}-profile.pdf`);
  };

  const generatePDFTable = async () => {
    // const element = tableRef.current;
    const element = isSingleArtistEx
      ? tableRefSingle.current
      : tableRefMulti.current;

    if (!element) return;

    const images = element.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((res) => {
              img.onload = img.onerror = res;
            })
      )
    );

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    const title =
      exhibitions.find((e) => e.id === selectedExId)?.title || "artworks";
    pdf.save(`${title}-artworks.pdf`);
  };

  const generateAllArtistsPDF = async () => {
    const uniqueArtists = getUniqueArtists();
    console.log("Unique artists:", uniqueArtists);
    console.log("Artist refs before PDF:", artistRefs.current);
    if (uniqueArtists.length === 0) {
      alert("No artists found. Please select artworks first.");
      return;
    }
    const pdf = new jsPDF("p", "mm", "a4");
    for (let i = 0; i < uniqueArtists.length; i++) {
      const artist = uniqueArtists[i];
      const key = artist.uid || artist.email || artist.name;
      const ref = artistRefs.current[key];
      console.log(`Rendering artist page for:`, artist, ref);
      if (!ref) continue;
      const images = ref.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((res) => {
                img.onload = img.onerror = res;
              })
        )
      );
      const canvas = await html2canvas(ref, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    }
    pdf.save("all-artists.pdf");
  };

  const currentEx = exhibitions.find((e) => e.id === selectedExId);
  const isSingleArtistEx = currentEx?.forSingleArtist;

  const formatDate = (dateObj) => {
    if (!dateObj) return "-";
    try {
      return new Date(dateObj).toLocaleDateString("he-IL", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "-";
    }
  };
  const cellStyle = {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "center",
    verticalAlign: "middle",
  };
  // const handleDownloadLabels = async () => {
  //   if (!selectedArtworks.length) return;

  //   const doc = new Document();

  //   const logoArrayBuffer = await fetch(logob).then((res) => res.arrayBuffer());
  //   const logoImage = Media.addImage(doc, logoArrayBuffer, 100, 50);

  //   // selectedArtworks.forEach((art, idx) => {
  //   //   const artistName =
  //   //     art.artist?.name || "הוספה ע" + String.fromCharCode(8221) + "י מנהל";
  //   //   const name = art.artworkName || art.name || "";
  //   //   const size = art.size || "";
  //   //   const technique = art.technique || "";
  //   //   const price = art.price || "";

  //   //   doc.addSection({
  //   //     children: [
  //   //       new Paragraph({
  //   //         children: [
  //   //           logoImage,
  //   //           new TextRun({ text: "\n\nשם האמן: " + artistName, bold: true }),
  //   //           new TextRun("\nשם היצירה: " + name),
  //   //           new TextRun("\nגודל: " + size),
  //   //           new TextRun("\nטכניקה: " + technique),
  //   //           new TextRun(
  //   //             "\nמחיר: " + price + " ש" + String.fromCharCode(8222)
  //   //           ),
  //   //           new TextRun("\n_________________________\n\n\n"),
  //   //         ],
  //   //       }),
  //   //     ],
  //   //   });
  //   // });
  //   selectedArtworks.forEach((art, idx) => {
  //     const artistName =
  //       art.artist?.name || "הוספה ע" + String.fromCharCode(8221) + "י מנהל";
  //     const name = art.artworkName || art.name || "";
  //     const size = art.size || "";
  //     const technique = art.technique || "";
  //     const price = art.price || "";
  //     const year = art.year || "-";
  //     const desc = art.description || "-";

  //     const isSingle = isSingleArtistEx;

  //     const children = isSingle
  //       ? [
  //           logoImage,
  //           new TextRun({ text: "\n\nשם היצירה: " + name, bold: true }),
  //           new TextRun("\nשנה: " + year),
  //           new TextRun("\nגודל: " + size),
  //           new TextRun("\nתיאור: " + desc),
  //           new TextRun("\nטכניקה: " + technique),
  //           new TextRun("\nמחיר: " + price + " ש" + String.fromCharCode(8222)),
  //           new TextRun("\n_________________________\n\n\n"),
  //         ]
  //       : [
  //           logoImage,
  //           new TextRun({ text: "\n\nשם האמן: " + artistName, bold: true }),
  //           new TextRun("\nשם היצירה: " + name),
  //           new TextRun("\nגודל: " + size),
  //           new TextRun("\nטכניקה: " + technique),
  //           new TextRun("\nמחיר: " + price + " ש" + String.fromCharCode(8222)),
  //           new TextRun("\n_________________________\n\n\n"),
  //         ];

  //     doc.addSection({
  //       children: [new Paragraph({ children })],
  //     });
  //   });

  //   const blob = await Packer.toBlob(doc);
  //   saveAs(blob, `${currentEx?.title || "labels"}-labels.docx`);
  // };

  // const handleDownloadLabels = async () => {
  //   if (!selectedArtworks.length) return;

  //   const sections = [];

  //   for (const art of selectedArtworks) {
  //     const artistName = art.artist?.name || "הוספה ע״י מנהל";
  //     const name = art.artworkName || art.name || "ללא שם";
  //     const size = art.size || "-";
  //     const technique = art.technique || "-";
  //     const price = art.price || "-";
  //     const year = art.year || "-";
  //     const desc = art.description || "-";
  //     const isSingle = isSingleArtistEx;

  //     let logoImage;
  //     try {
  //       const res = await fetch("/logob.png");
  //       if (!res.ok) throw new Error("Logo fetch failed");
  //       const arrayBuffer = await res.arrayBuffer();
  //       // Note: We'll add the image to the document later
  //     } catch (err) {
  //       console.warn("⚠️ Failed to load logo image:", err);
  //     }

  //     const children = [
  //       ...(isSingle
  //         ? [
  //             new TextRun({ text: "\n\nשם היצירה: " + name, bold: true }),
  //             new TextRun({ text: "\nשנה: " + year }),
  //             new TextRun({ text: "\nגודל: " + size }),
  //             new TextRun({ text: "\nתיאור: " + desc }),
  //             new TextRun({ text: "\nטכניקה: " + technique }),
  //             new TextRun({ text: "\nמחיר: " + price + " ש״ח" }),
  //           ]
  //         : [
  //             new TextRun({ text: "\n\nשם האמן: " + artistName, bold: true }),
  //             new TextRun({ text: "\nשם היצירה: " + name }),
  //             new TextRun({ text: "\nגודל: " + size }),
  //             new TextRun({ text: "\nטכניקה: " + technique }),
  //             new TextRun({ text: "\nמחיר: " + price + " ש״ח" }),
  //           ]),
  //       new TextRun({ text: "\n_________________________\n\n\n" }),
  //     ];

  //     sections.push({
  //       children: [new Paragraph({ children })],
  //     });
  //   }

  //   // Create document with sections in constructor
  //   const doc = new Document({
  //     creator: "Art Exhibition System",
  //     title: `${currentEx?.title || "Exhibition"} Labels`,
  //     sections: sections,
  //   });

  //   try {
  //     const blob = await Packer.toBlob(doc);
  //     const title = currentEx?.title || "labels";
  //     saveAs(blob, `${title}-labels.docx`);
  //   } catch (err) {
  //     console.error("❌ Failed to generate Word file:", err);
  //   }
  // };
  const getUniqueArtists = () => {
    const unique = [];
    const seen = new Set();
    selectedArtworks.forEach((art) => {
      const artist =
        art.userId && art.artist
          ? art.artist
          : typeof art.artist === "string"
          ? { name: art.artist }
          : art.artist;
      // Use a unique key for each artist (uid, email, or name as fallback)
      const uniqueKey = artist?.uid || artist?.email || artist?.name;
      if (artist && uniqueKey && !seen.has(uniqueKey)) {
        seen.add(uniqueKey);
        unique.push(artist);
      }
    });
    return unique;
  };
  return (
    <div className="min-h-screen bg-gradient-to-br py-10 px-4" dir="rtl">
      <h1 className="text-4xl font-extrabold text-center text-pink-700 mb-12 drop-shadow">
        יצירות לפי תערוכה
      </h1>

      {/* Exhibition Selector */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {exhibitions.map((ex) => (
          <button
            key={ex.id}
            onClick={() => setSelectedExId(ex.id)}
            className={`px-5 py-2 text-sm font-medium rounded-full shadow transition duration-300 ${
              selectedExId === ex.id
                ? "bg-pink-600 text-white scale-105"
                : "bg-white text-pink-700 border border-pink-200 hover:bg-pink-100"
            }`}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="text-center mb-10 space-y-4 gap-3">
        <button
          onClick={() => {
            console.log("PINK BUTTON CLICKED");
            generateAllArtistsPDF();
          }}
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-full shadow transition m-4"
        >
          הורד את כל ה-PDFים
        </button>

        <button
          className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded-full shadow transition ml-4"
          onClick={generatePDFTable}
        >
          הורד את כל היצירות בטבלה
        </button>
        <button
          onClick={() => handleDownloadLabels(selectedExId, exhibitions, alert)}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-6 rounded-full shadow transition"
        >
          הורד תוויות
        </button>
      </div>

      {loading || loadingArtworks ? (
        <p className="text-center text-lg text-gray-600 animate-pulse">
          טוען נתונים...
        </p>
      ) : selectedArtworks.length > 0 ? (
        <>
          <div className="px-2 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-10 max-w-screen-xl mx-auto">
              {/* Existing cards remain unchanged */}
              {selectedArtworks.map((art) => {
                const reg = registrations[art.id];
                const artist =
                  art.userId && art.artist
                    ? art.artist
                    : typeof art.artist === "string"
                    ? { name: art.artist }
                    : art.artist || { name: "הוספה ע״י מנהל" };

                const imageSrc = artist.image || "/placeholder.jpg";
                const imageForPDF = /^https?:\/\//.test(imageSrc)
                  ? `https://corsproxy.io/?${encodeURIComponent(imageSrc)}`
                  : imageSrc;

                return (
                  <div
                    key={art.id}
                    className="bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden hover:shadow-2xl transform hover:scale-[1.05] hover:-translate-y-1 transition duration-300 w-full max-w-[350px] mx-auto"
                  >
                    <img
                      src={art.imageUrl}
                      alt={art.artworkName}
                      onError={(e) => (e.target.src = "/placeholder.jpg")}
                      className="w-full h-64 object-cover rounded-t-3xl"
                    />
                    <div className="p-6 space-y-3 text-base">
                      {/* <h3 className="text-xl font-bold text-pink-700">
                        {art.artworkName || "ללא שם"}
                      </h3> */}
                      <h3 className="text-xl font-bold text-pink-700">
                        {art.userId
                          ? art.artworkName || "ללא שם"
                          : art.name || "ללא שם"}
                      </h3>
                      {/* 
                      <p>
                        <span className="font-bold">אמן:</span>{" "}
                        {artist.name || "לא ידוע"}
                      </p> */}
                      <p>
                        <span className="font-bold">אמן:</span>{" "}
                        {art.userId
                          ? artist.name || "לא ידוע"
                          : typeof art.artist === "string"
                          ? art.artist
                          : art.artist?.name || "הוספה ע״י מנהל"}
                      </p>

                      <p>
                        <span className="font-bold">תיאור:</span>{" "}
                        {art.description || "אין תיאור"}
                      </p>
                      <p>
                        <span className="font-bold">שנה:</span>{" "}
                        {art.year || "-"}
                      </p>
                      <button
                        onClick={() => generatePDF(art)}
                        className="mt-3 w-full bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold py-2.5 rounded-xl shadow"
                      >
                        הורד פרופיל PDF
                      </button>
                    </div>

                    {/* PDF Layout (hidden) */}
                    <div
                      ref={(el) => (printRefs.current[art.id] = el)}
                      style={{ position: "absolute", left: "-9999px", top: 0 }}
                      className="text-black bg-white w-[794px] h-[1123px] overflow-hidden"
                    >
                      <img
                        src="/up.jpg"
                        alt="Header"
                        className="w-full"
                        crossOrigin="anonymous"
                      />
                      <div className="px-10 py-6 text-right font-sans">
                        <h2 className="text-3xl font-bold mb-2">
                          {artist.name || "יצירה ללא שם אמן"}
                        </h2>

                        {(reg?.place || artist.place) && (
                          <p className="text-lg mb-4">
                            {reg?.place || artist.place}
                          </p>
                        )}

                        {(artist.image || reg?.image) && (
                          <div className="flex gap-6 mb-4">
                            <img
                              src={imageForPDF}
                              alt="Artist"
                              className="w-48 h-48 object-cover rounded-xl border shadow"
                              crossOrigin="anonymous"
                            />

                            {(reg?.email ||
                              reg?.phone ||
                              reg?.link ||
                              artist.email ||
                              artist.phone ||
                              artist.link) && (
                              <div className="flex flex-col justify-center text-right text-blue-600 text-lg ">
                                {(reg?.phone || artist.phone) && (
                                  <a href={`tel:${reg?.phone || artist.phone}`}>
                                    {reg?.phone || artist.phone}
                                  </a>
                                )}

                                {(reg?.email || artist.email) && (
                                  <a
                                    className="p-3"
                                    href={`mailto:${
                                      reg?.email || artist.email
                                    }`}
                                  >
                                    {reg?.email || artist.email}
                                  </a>
                                )}
                                {(reg?.link || artist.link) && (
                                  <QRCodeCanvas
                                    value={reg?.link || artist.link}
                                    size={100}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        <p className="whitespace-pre-line text-[16px] leading-relaxed mt-6">
                          {reg?.bio ||
                            artist.bio ||
                            "לא קיימת ביוגרפיה זמינה ליצירה זו."}
                        </p>
                      </div>
                      <img
                        src="/down.jpg"
                        alt="Footer"
                        className="w-full absolute bottom-0 left-0"
                        crossOrigin="anonymous"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Always render the hidden label container for PDF export */}
          {/* Pixel-perfect business card style for PDF export */}
          {console.log("DEBUG: selectedArtworks for labels", selectedArtworks)}
          <style>{`
            #labels-pdf-container {
              display: grid;
              grid-template-columns: repeat(2, 397px);
              grid-template-rows: repeat(3, 374px);
              width: 794px;
              height: 1123px;
              gap: 0;
              background: #fff;
              position: absolute;
              left: -9999px;
              top: 0;
              direction: rtl;
            }
            .label-card {
              border: 1px solid #222;
              width: 397px;
              height: 374px;
              box-sizing: border-box;
              padding: 0 16px 0 16px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              font-family: Arial, sans-serif;
              background: #fff;
            }
            .label-card .logo-row {
              display: flex;
              flex-direction: row;
              align-items: flex-start;
              justify-content: space-between;
              margin-top: 8px;
            }
            .label-card .logo-row img {
              width: 110px;
              height: auto;
              margin-left: 8px;
            }
            .label-card .artist-name {
              font-weight: bold;
              font-size: 22px;
              text-align: right;
              margin-top: 8px;
              margin-right: 8px;
              white-space: nowrap;
            }
            .label-card .artwork-name {
              font-weight: bold;
              font-size: 18px;
              text-align: center;
              margin: 8px 0;
              min-height: 38px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .label-card .contact-info {
              color: #1976d2;
              font-size: 15px;
              text-align: right;
              margin-bottom: 4px;
              display: flex;
              flex-direction: row-reverse;
              justify-content: space-between;
              align-items: center;
            }
            .label-card .details-row {
              font-size: 13px;
              text-align: right;
              display: flex;
              flex-direction: row-reverse;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 8px;
            }
          `}</style>
          <div id="labels-pdf-container">
            {selectedArtworks.map((art) => {
              const artist =
                art.userId && art.artist
                  ? art.artist
                  : typeof art.artist === "string"
                  ? { name: art.artist }
                  : art.artist || { name: 'הוספה ע"י מנהל' };
              console.log("DEBUG: label card", { art, artist });
              return (
                <div className="label-card" key={art.id}>
                  <div className="logo-row">
                    <img src="/logob.png" alt="Logo" />
                    <div className="artist-name">{artist.name}</div>
                  </div>
                  <div className="artwork-name">
                    {art.artworkName || art.name || "-"}
                  </div>
                  <div className="contact-info">
                    <span style={{ marginLeft: 8, direction: "ltr" }}>
                      {artist.email || "-"}
                    </span>
                    <span style={{ direction: "ltr" }}>
                      {artist.phone || "-"}
                    </span>
                  </div>
                  <div className="details-row">
                    <span style={{ marginLeft: 8 }}>{art.size || "-"}</span>
                    <span style={{ marginLeft: 8 }}>
                      {art.technique || "-"}
                    </span>
                    <span>מחיר: {art.price || "לפנות לאמן"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="text-center text-gray-600 text-lg font-semibold mt-12">
          לא נמצאו יצירות לתערוכה זו 🎨
        </div>
      )}
      {/* Hidden printable table */}
      {/* Hidden printable table */}
      {!isSingleArtistEx && (
        <div
          ref={tableRefMulti}
          style={{ position: "absolute", left: "-9999px", top: 0 }}
          dir="rtl"
        >
          <div
            style={{
              padding: "40px",
              fontFamily: "Arial, sans-serif",
              direction: "rtl",
            }}
          >
            {/* Logo at the top */}
            <img
              src="/logob.png"
              alt="Logo"
              style={{
                height: "80px",
                marginBottom: "20px",
                display: "block",
                marginRight: "auto",
                marginLeft: "auto",
              }}
            />

            <h1
              style={{
                color: "#e91e63",
                margin: "0 auto",
                textAlign: "center",
              }}
            >
              {currentEx?.title}
            </h1>
            <h3 style={{ textAlign: "center" }}>
              מיקום: {currentEx?.location || "-"}
            </h3>
            <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
              תאריכים: {formatDate(currentEx?.startDate)} -{" "}
              {formatDate(currentEx?.endDate)}
            </h3>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "20px",
                direction: "rtl",
                fontSize: "14px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f8f8f8" }}>
                  <th style={cellStyle}>תמונה</th>
                  <th style={cellStyle}>גודל</th>
                  <th style={cellStyle}>טכניקה</th>
                  <th style={cellStyle}>שם התמונה</th>
                  <th style={cellStyle}>שם אמן</th>
                  <th style={cellStyle}>סלולרי</th>
                  <th style={cellStyle}>מס'</th>
                </tr>
              </thead>
              <tbody>
                {selectedArtworks.map((art, index) => (
                  <tr key={art.id}>
                    <td style={cellStyle}>
                      <img
                        src={art.imageUrl}
                        alt="art"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td style={cellStyle}>{art.size || "-"}</td>
                    <td style={cellStyle}>{art.technique || "-"}</td>
                    <td style={cellStyle}>
                      {art.userId ? art.artworkName || "-" : art.name || "-"}
                    </td>
                    <td style={cellStyle}>
                      {art.userId
                        ? art.artist?.name || "-"
                        : typeof art.artist === "string"
                        ? art.artist
                        : art.artist?.name || "הוספה ע״י מנהל"}
                    </td>

                    <td style={cellStyle}>
                      {art.phone || art.artist?.phone || "-"}
                    </td>
                    <td style={cellStyle}>{index + 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Hidden printable single-artist layout */}
      {isSingleArtistEx && (
        <div
          ref={tableRefSingle}
          style={{ position: "absolute", left: "-9999px", top: 0 }}
          dir="rtl"
        >
          <div
            style={{
              padding: "40px",
              fontFamily: "Arial, sans-serif",
              direction: "rtl",
            }}
          >
            <img
              src="/logob.png"
              alt="Logo"
              style={{
                height: "80px",
                marginBottom: "20px",
                display: "block",
                marginRight: "auto",
                marginLeft: "auto",
              }}
            />
            <h1
              style={{
                color: "#c2185b",
                textAlign: "center",
                marginBottom: "10px",
              }}
            >
              תערוכת {currentEx?.title}
            </h1>

            <h2 style={{ textAlign: "center", margin: "0" }}>
              {selectedArtworks[0]?.artist?.name || "שם אמן"}
            </h2>

            <h3 style={{ textAlign: "center", margin: "5px 0" }}>
              {selectedArtworks[0]?.artist?.place || "מקום מגורים"}
            </h3>

            <p style={{ textAlign: "center", marginBottom: "10px" }}>
              <strong>
                {selectedArtworks[0]?.artist?.phone || "000000000000"}
              </strong>{" "}
              |
              <span style={{ margin: "0 10px" }}>
                {selectedArtworks[0]?.artist?.email || "-"}
              </span>
            </p>

            <h4 style={{ textAlign: "center", marginBottom: "20px" }}>
              תאריך פתיחה: {formatDate(currentEx?.startDate)}
            </h4>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                direction: "rtl",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f0f0f0" }}>
                  <th style={cellStyle}>תמונה</th>
                  <th style={cellStyle}>גודל</th>
                  <th style={cellStyle}>תיאור היצירה</th>
                  <th style={cellStyle}>שם היצירה</th>
                  <th style={cellStyle}>תאריך יצירה</th>
                  <th style={cellStyle}>מס'</th>
                </tr>
              </thead>
              <tbody>
                {selectedArtworks.map((art, index) => (
                  <tr key={art.id}>
                    <td style={cellStyle}>
                      <img
                        src={art.imageUrl}
                        alt="art"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td style={cellStyle}>{art.size || "-"}</td>
                    <td style={cellStyle}>{art.description || "-"}</td>
                    <td style={cellStyle}>
                      {art.artworkName || art.name || "-"}
                    </td>
                    <td style={cellStyle}>{art.year || "-"}</td>
                    <td style={cellStyle}>{index + 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Hidden printable artist profiles for PDF generation */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        {getUniqueArtists().map((artist) => (
          <div
            key={artist.uid || artist.email || artist.name}
            ref={(el) =>
              (artistRefs.current[artist.uid || artist.email || artist.name] =
                el)
            }
            className="text-black bg-white w-[794px] h-[1123px] overflow-hidden"
          >
            <img
              src="/up.jpg"
              alt="Header"
              className="w-full"
              crossOrigin="anonymous"
            />
            <div className="px-10 py-6 text-right font-sans">
              <h2 className="text-3xl font-bold mb-2">
                {artist.name || "יצירה ללא שם אמן"}
              </h2>
              {artist.place && <p className="text-lg mb-4">{artist.place}</p>}
              {artist.image && (
                <div className="flex gap-6 mb-4">
                  <img
                    src={
                      /^https?:\/\//.test(artist.image)
                        ? `https://corsproxy.io/?${encodeURIComponent(
                            artist.image
                          )}`
                        : artist.image
                    }
                    alt="Artist"
                    className="w-48 h-48 object-cover rounded-xl border shadow"
                    crossOrigin="anonymous"
                  />
                  <div className="flex flex-col justify-center text-right text-blue-600 text-lg ">
                    {artist.phone && (
                      <a href={`tel:${artist.phone}`}>{artist.phone}</a>
                    )}
                    {artist.email && (
                      <a className="p-3" href={`mailto:${artist.email}`}>
                        {artist.email}
                      </a>
                    )}
                    {artist.link && (
                      <QRCodeCanvas value={artist.link} size={100} />
                    )}
                  </div>
                </div>
              )}
              <p className="whitespace-pre-line text-[16px] leading-relaxed mt-6">
                {artist.bio || "לא קיימת ביוגרפיה זמינה ליצירה זו."}
              </p>
            </div>
            <img
              src="/down.jpg"
              alt="Footer"
              className="w-full absolute bottom-0 left-0"
              crossOrigin="anonymous"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllArtworksByExhibition;
