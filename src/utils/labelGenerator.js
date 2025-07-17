<<<<<<< HEAD
import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  ImageRun,
  AlignmentType,
  WidthType,
  VerticalAlign,
  BorderStyle,
} from "docx";
import { db } from "../firebase/config";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

const sanitizeFilename = (filename) =>
  filename
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, "_")
    .trim();

const getLogoArrayBuffer = async () => {
  try {
    const response = await fetch("/logob.png");
    if (!response.ok) throw new Error("Failed to fetch logo");
    return await response.arrayBuffer();
  } catch (error) {
    console.error("Error fetching logo:", error);
    return null;
  }
};

const fetchExhibitionArtworks = async (exhibitionId) => {
  const all = [];
  const snapshot = await getDocs(
    collection(db, "exhibition_artworks", exhibitionId, "artworks")
  );

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    if (!data.approved) continue;

    let artistData = { name: data.artistName || "לא ידוע" };

    if (data.userId) {
      const artistDoc = await getDoc(doc(db, "users", data.userId));
      if (artistDoc.exists()) {
        artistData = { ...artistData, ...artistDoc.data() };
      }
    }

    all.push({ ...data, id: docSnap.id, artist: artistData });
  }

  return all;
};
=======
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
>>>>>>> master

export const handleDownloadLabels = async (
  exhibitionId,
  cardsData,
  showToast = console.log
) => {
  try {
<<<<<<< HEAD
    const artworks = await fetchExhibitionArtworks(exhibitionId);
    if (!artworks.length) return alert("אין תוויות להורדה עבור תערוכה זו");

    const exhibition = cardsData.find((ex) => ex.id === exhibitionId);
    const exhibitionName = exhibition ? exhibition.title : "תערוכה";
    const sanitizedName = sanitizeFilename(exhibitionName);
    const logoArrayBuffer = await getLogoArrayBuffer();

    const labels = artworks.map((art) => {
      const artist = art.artist || {};
      return {
        artistName: artist.name || "",
        artistNameEng: artist.nameEng || artist.name || "",
        artworkTitle: art.artworkName || art.name || "",
        email: artist.email || "",
        phone: artist.phone || art.phone || "",
        size: art.size || "",
        technique: art.technique || "",
        price:
          art.price && art.price.trim() !== "" ? art.price : "נא לפנות לאמן",
      };
    });

    const labelsPerPage = 6;
    const totalPages = Math.ceil(labels.length / labelsPerPage);
    const sections = [];

    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
      const pageLabels = labels.slice(
        pageIndex * labelsPerPage,
        pageIndex * labelsPerPage + labelsPerPage
      );
      while (pageLabels.length < labelsPerPage) pageLabels.push(null);

      const rows = [];

      for (let row = 0; row < 3; row++) {
        const cells = [];

        for (let col = 0; col < 2; col++) {
          const label = pageLabels[row * 2 + col];

          const children = [];

          if (label) {
            // Header row: Artist name (left) + Logo (right)
            children.push(
              new Paragraph({
                bidirectional: true,
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: label.artistName,
                    font: "Arial",
                    bold: true,
                    size: 20,
                  }),
                  new TextRun({
                    text: "                ", // Multiple spaces to push logo to right
                  }),
                  ...(logoArrayBuffer
                    ? [
                        new ImageRun({
                          data: logoArrayBuffer,
                          transformation: { width: 80, height: 25 },
                        }),
                      ]
                    : []),
                  new TextRun({
                    text: "  ",
                  }),
                  new TextRun({
                    text: label.artistNameEng,
                    font: "Arial",
                    bold: true,
                    size: 20,
                  }),
                ],
              }),

              // Artwork title centered bold and larger
              new Paragraph({
                alignment: AlignmentType.CENTER,
                bidirectional: true,
                children: [
                  new TextRun({
                    text: label.artworkTitle,
                    font: "Arial",
                    bold: true,
                    size: 24,
                  }),
                ],
              }),

              // Contact info: email (left) + phone (right)
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                bidirectional: true,
                children: [
                  new TextRun({
                    text: label.email,
                    color: "0000FF",
                    font: "Arial",
                    size: 18,
                  }),
                  new TextRun({
                    text: "                            ", // Spaces to separate
                  }),
                  new TextRun({
                    text: label.phone,
                    color: "0000FF",
                    font: "Arial",
                    size: 18,
                  }),
                ],
              }),

              // Price and technique info - right aligned
              new Paragraph({
                alignment: AlignmentType.DISTRIBUTED,
                bidirectional: false,
                children: [
                  new TextRun({
                    text: ` ${label.price} :מחיר`,
                    font: "Arial",
                    size: 18,
                  }),
                  new TextRun({
                    text: "                                    ", // Tab spaces to push to right
                  }),
                  new TextRun({
                    text: `${label.size} ${label.technique}`.trim(),
                    font: "Arial",
                    size: 18,
                  }),
                ],
              })
            );

            cells.push(
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children,
                margins: { top: 150, bottom: 150, left: 150, right: 150 },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
                  bottom: {
                    style: BorderStyle.SINGLE,
                    size: 2,
                    color: "000000",
                  },
                  left: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
                  right: {
                    style: BorderStyle.SINGLE,
                    size: 2,
                    color: "000000",
                  },
                },
              })
            );
          } else {
            cells.push(
              new TableCell({
                children: [new Paragraph("")],
                borders: {
                  top: { style: BorderStyle.NONE },
                  bottom: { style: BorderStyle.NONE },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE },
                },
              })
            );
          }
        }

        rows.push(new TableRow({ children: cells }));
      }

      sections.push({
        children: [
          new Table({
            rows,
            width: { size: 100, type: WidthType.PERCENTAGE },
            columnWidths: [5000, 5000],
          }),
        ],
      });
    }

    const doc = new Document({ sections });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${sanitizedName}-labels.docx`);
    showToast(`✔️ תוויות הורדו בהצלחה (${totalPages} עמודים)`);
  } catch (error) {
    console.error("Label generation error:", error);
=======
    // Wait for the DOM to update/render the labels
    const container = document.getElementById("labels-pdf-container");
    if (!container) {
      alert("לא נמצאו תוויות להורדה");
      return;
    }

    // Wait for images to load if you have any
    const images = container.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map(
        (img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((res) => {
                img.onload = img.onerror = res;
              })
      )
    );

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#fff",
    });

    const imgData = canvas.toDataURL("image/png", 1.0);
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

    const exhibition = cardsData.find((ex) => ex.id === exhibitionId);
    const exhibitionName = exhibition ? exhibition.title : "labels";
    pdf.save(`${exhibitionName}-labels.pdf`);
    showToast(`✔️ תוויות הורדו בהצלחה`);
  } catch (error) {
    console.error("Label PDF generation error:", error);
>>>>>>> master
    alert("שגיאה בהורדת התוויות. נסה שוב.");
  }
};
