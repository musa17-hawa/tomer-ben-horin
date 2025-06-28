import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";
import autoTable from "jspdf-autotable";
import "./AdminAllArtworks.css";
import '../../fonts/Alef-normal.js'; // Import the jsPDF Alef font (must be generated from TTF)

const AdminAllArtworks = () => {
  const { exhibitionId } = useParams();
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const hiddenRefs = useRef({});

  useEffect(() => {
    const fetchAllArtworks = async () => {
      try {
        const all = [];

        // 1. Fetch from centralized exhibition_artworks collection
        const snapshot = await getDocs(
          collection(db, "exhibition_artworks", exhibitionId, "artworks")
        );

        for (const docSnap of snapshot.docs) {
          const data = docSnap.data();
          if (!data.approved) continue;

          let artistData = {
            name: data.artistName || "לא ידוע",
            bio: "",
            subject: "",
            group: "",
            email: "",
            place: "",
            link: "",
            image: "",
          };

          if (data.userId) {
            const artistDoc = await getDoc(doc(db, "users", data.userId));
            if (artistDoc.exists()) {
              artistData = { ...artistData, ...artistDoc.data() };
            }
          }

          all.push({
            ...data,
            id: docSnap.id,
            artist: artistData,
          });
        }

        // 2. Fetch admin-added artworks from exhibitions/{exhibitionId}
        const exhibitionDoc = await getDoc(
          doc(db, "exhibitions", exhibitionId)
        );
        if (exhibitionDoc.exists()) {
          const exData = exhibitionDoc.data();
          if (Array.isArray(exData.artworks)) {
            for (let i = 0; i < exData.artworks.length; i++) {
              const art = exData.artworks[i];
              all.push({
                ...art,
                id: `admin-${i}`,
                artist: {
                  name: art.artist || 'הוספה ע"י מנהל',
                  bio: "",
                  subject: "",
                  group: "",
                  email: "",
                  place: "",
                  link: "",
                  image: "",
                },
              });
            }
          }
        }

        setArtworks(all);
      } catch (err) {
        console.error("שגיאה בטעינת היצירות:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllArtworks();
  }, [exhibitionId]);

  const handleExportPDF = async (artId) => {
    const input = hiddenRefs.current[artId];
    if (!input) return;

    try {
      const canvas = await html2canvas(input, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#fff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      const margin = 10;
      pdf.addImage(
        imgData,
        "PNG",
        margin,
        margin,
        pdfWidth - 2 * margin,
        pdfHeight - 2 * margin
      );
      pdf.save(`artist_profile_${artId}.pdf`);
    } catch (err) {
      console.error("PDF export error:", err);
    }
  };

  // Helper to convert image URL to base64
  async function getImageBase64(url) {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg'));
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  const handleExportAllPDF = async () => {
    console.log("Export PDF for All clicked");
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFont('Alef'); // Set Alef font for Hebrew

    // Add title and subtitle
    doc.setFontSize(24);
    doc.text('תערוכת קיץ', 200, 25, { align: 'right' });
    doc.setFontSize(14);
    doc.text('המרחב החברתי הנגב 8 תל אביב 11/8/24 - 11/10/24', 200, 45, { align: 'right' });

    // Table headers
    const headers = [[
      'ציור', 'גודל', 'טכניקה', 'שם תמונה', 'שם אמן', 'סלולרי', 'מס"ד'
    ]];

    // Prefetch all images as base64
    const imageThumbs = await Promise.all(
      artworks.map(art =>
        art.imageUrl
          ? getImageBase64(art.imageUrl).catch(() => '')
          : Promise.resolve('')
      )
    );

    // Set fixed row height and thumbnail size (adjusted for better fit)
    const rowHeight = 48; // px (increased for better fit)
    const thumbSize = 40; // px (slightly smaller than rowHeight)

    // Data rows
    const dataRows = [];
    let rowNum = 1;
    for (let i = 0; i < artworks.length; i++) {
      const art = artworks[i];
      const phone = art.phone || art.artist?.phone || '';
      const artistName = art.artist?.name || art.artistName || '';
      const artworkName = art.artworkName || art.name || '';
      const technique = art.description || '';
      const size = art.size || '';
      dataRows.push([
        '', // image cell will be filled with thumbnail in didDrawCell
        size,
        technique,
        artworkName,
        artistName,
        phone,
        rowNum
      ]);
      rowNum++;
    }
    autoTable(doc, {
      head: headers,
      body: dataRows,
      styles: { font: 'Alef', fontStyle: 'normal', fontSize: 12, halign: 'right', cellPadding: 2, minCellHeight: rowHeight },
      headStyles: { fillColor: [255, 99, 132], textColor: 255, halign: 'right', font: 'Alef', minCellHeight: 24, fontSize: 13 },
      bodyStyles: { halign: 'right', font: 'Alef' },
      margin: { top: 60, left: 20, right: 20 },
      tableWidth: 'auto',
      columnStyles: {
        0: { cellWidth: rowHeight, minCellHeight: rowHeight, valign: 'middle' }
      },
      didDrawCell: function (data) {
        if (data.column.index === 0 && data.row.index < imageThumbs.length && data.section === 'body') {
          const imgData = imageThumbs[data.row.index];
          if (imgData) {
            // Center the image in the cell
            const x = data.cell.x + (rowHeight - thumbSize) / 2;
            const y = data.cell.y + (rowHeight - thumbSize) / 2;
            doc.addImage(imgData, 'JPEG', x, y, thumbSize, thumbSize);
          }
        }
      },
      tableLineWidth: 0.5,
      tableLineColor: [0, 0, 0],
      theme: 'grid',
      direction: 'rtl',
    });
    doc.save('artists_artworks.pdf');
  };

  return (
    <div className="artworks-review-wrapper">
      <div className="review-header">
        <img
          src="https://amutatbh.com/wp-content/uploads/2021/03/logo-new.svg"
          alt="Logo"
          className="review-logo"
          onClick={() => navigate("/user-dashboard")}
        />
        <h2 className="review-title">כל היצירות</h2>
        <div className="review-buttons">
          <button
            onClick={() => navigate("/user-dashboard")}
            className="header-button"
          >
            חזרה ללוח הניהול
          </button>
          <button
            onClick={() => navigate(`/admin-artworks-review/${exhibitionId}`)}
            className="header-button"
          >
            אישור יצירות
          </button>
          <button
            onClick={handleExportAllPDF}
            className="header-button"
            style={{ background: '#e91e63', color: '#fff', marginRight: 8 }}
          >
            ייצוא PDF לכל המשתתפים
          </button>
        </div>
      </div>

      <div className="artworks-review-container">
        {loading ? (
          <p className="full-message">טוען...</p>
        ) : (
          <div className="cards-grid">
            {artworks.map((art) => (
              <div key={art.id} className="artwork-card">
                {art.imageUrl && (
                  <img
                    src={art.imageUrl}
                    alt={art.name || "ללא שם"}
                    className="artwork-image"
                  />
                )}
                <div className="artwork-info">
                  <h3>{art.name || art.artworkName || "ללא שם"}</h3>
                  <p>
                    <strong>אמן:</strong> {art.artist?.name || "לא ידוע"}
                  </p>
                  <p>
                    <strong>תיאור:</strong> {art.description || "אין תיאור"}
                  </p>
                  <p>
                    <strong>שנת היצור:</strong> {art.year || "-"}
                  </p>
                  <p>
                    <strong>מחיר:</strong> {art.price || "-"}
                  </p>

                  <button
                    className="dashboard-btn"
                    onClick={() => handleExportPDF(art.id)}
                    style={{ marginTop: "10px" }}
                  >
                    יצא פרופיל PDF
                  </button>
                </div>

                <div
                  ref={(el) => (hiddenRefs.current[art.id] = el)}
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    top: 0,
                    width: "210mm",
                    padding: "20px",
                    backgroundColor: "#fff",
                  }}
                  dir="rtl"
                >
                  <h1>{art.artist?.name}</h1>
                  <img
                    src={art.artist?.image || "https://via.placeholder.com/140"}
                    alt="Profile"
                    width={140}
                    height={140}
                    style={{ borderRadius: "50%" }}
                  />
                  <p>{art.artist?.bio || ""}</p>
                  <p>
                    <b>תחום האומנות:</b> {art.artist?.subject || "-"}
                  </p>
                  <p>
                    <b>קבוצת אמנים:</b> {art.artist?.group || "-"}
                  </p>
                  <p>
                    <b>אימייל:</b> {art.artist?.email || "-"}
                  </p>
                  <p>
                    <b>מקום מגורים:</b> {art.artist?.place || "-"}
                  </p>
                  {art.artist?.link && (
                    <QRCodeCanvas value={art.artist.link} size={128} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAllArtworks;
