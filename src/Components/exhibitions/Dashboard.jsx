import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import Card from "./Card";
import GalleryCard from "../galleries/GalleryCard";
import ExhibitionModal from "./ExhibitionModal";
import GalleryModal from "../galleries/GalleryModal";
import GalleryEditModal from "../galleries/GalleryEditModal";
import ExhibitionEditModal from "./ExhibitionEditModal";
import ExhibitionDetailsModal from "../artworks/ExhibitionDetailsModal";
import AdminDashboard from "../../Components/admin/AdminDashboard";
import DeleteConfirmModal from "./DeleteConfirmModal";
import {
  createExhibition,
  getAllExhibitions,
  updateExhibition,
  deleteExhibition,
} from "../../services/exhibitionService";
import {
  createGallery,
  getAllGalleries,
  updateGallery,
  deleteGallery,
} from "../../services/galleryService";
import { uploadToImgBB } from "../../utils/imgbb";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun } from "docx";
import { db } from "../../firebase/config";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import logo from '../../assets/logob.png';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Dashboard = () => {
  const [viewMode, setViewMode] = useState("exhibitions"); // "exhibitions" or "galleries"
  const [cardsData, setCardsData] = useState([]);
  const [galleriesData, setGalleriesData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galleryEditModalOpen, setGalleryEditModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedExhibition, setSelectedExhibition] = useState(null);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [showArtists, setShowArtists] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 10;
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (viewMode === "exhibitions") {
      loadExhibitions();
    } else {
      loadGalleries();
    }
  }, [viewMode]);

  const loadExhibitions = async () => {
    try {
      setLoading(true);
      const data = await getAllExhibitions();
      setCardsData(data);
    } catch (err) {
      setError("Failed to load exhibitions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadGalleries = async () => {
    try {
      setLoading(true);
      const data = await getAllGalleries();
      setGalleriesData(data);
    } catch (err) {
      setError("Failed to load galleries");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddExhibition = async (data) => {
    try {
      setLoading(true);
      let imageUrl = data.imageUrl;
      if (data.image) {
        imageUrl = await uploadToImgBB(data.image);
      }
      const exhibitionData = {
        ...data,
        imageUrl: imageUrl || null,
        image: null,
      };
      await createExhibition(exhibitionData);
      await loadExhibitions();
      showToast("התערוכה נוספה בהצלחה!");
    } catch (err) {
      setError("Failed to add exhibition");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGallery = async (data) => {
    try {
      setLoading(true);
      let imageUrl = data.imageUrl;
      if (data.image) {
        imageUrl = await uploadToImgBB(data.image);
      }
      const galleryData = {
        ...data,
        imageUrl: imageUrl || null,
        image: null,
      };
      await createGallery(galleryData);
      await loadGalleries();
      showToast("הגלריה נוספה בהצלחה!");
    } catch (err) {
      setError("Failed to add gallery");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditExhibition = async (data) => {
    try {
      setLoading(true);
      let imageUrl = selectedExhibition.imageUrl;
      if (data.image) {
        imageUrl = await uploadToImgBB(data.image);
      }
      const exhibitionData = {
        ...data,
        imageUrl: imageUrl || null,
        image: null,
      };
      await updateExhibition(selectedExhibition.id, exhibitionData);
      await loadExhibitions();
      showToast("התערוכה עודכנה בהצלחה!");
    } catch (err) {
      setError("Failed to update exhibition");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditGallery = async (data) => {
    try {
      setLoading(true);
      let imageUrl = selectedGallery.imageUrl;
      if (data.image) {
        imageUrl = await uploadToImgBB(data.image);
      }
      const galleryData = {
        ...data,
        imageUrl: imageUrl || null,
        image: null,
      };
      await updateGallery(selectedGallery.id, galleryData);
      await loadGalleries();
      showToast("הגלריה עודכנה בהצלחה!");
    } catch (err) {
      setError("Failed to update gallery");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      setLoading(true);
      if (viewMode === "exhibitions") {
        await deleteExhibition(id);
        await loadExhibitions();
        showToast("התערוכה נמחקה בהצלחה!");
      } else {
        await deleteGallery(id);
        await loadGalleries();
        showToast("הגלריה נמחקה בהצלחה!");
      }
    } catch (err) {
      setError(
        `Failed to delete ${
          viewMode === "exhibitions" ? "exhibition" : "gallery"
        }`
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = (id) => {
    setItemToDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDeleteId) {
      await handleDeleteItem(itemToDeleteId);
      setDeleteModalOpen(false);
      setItemToDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setItemToDeleteId(null);
  };

  const handleToggleMode = () => {
    setViewMode(viewMode === "exhibitions" ? "galleries" : "exhibitions");
    setSearch("");
    setCurrentPage(1);
  };

  const normalizeStatus = (status) => {
    if (!status) return "";
    if (["פתוחה", "open"].includes(status)) return "פתוחה";
    if (["סגורה", "closed"].includes(status)) return "סגורה";
    return status;
  };

  const currentData = viewMode === "exhibitions" ? cardsData : galleriesData;
  const filteredCards = currentData.filter((card) => {
    const searchTerm = search.toLowerCase().trim();
    const cardTitle = (card.title || "").toLowerCase();
    const cardDescription = (card.description || "").toLowerCase();
    const matchesSearch =
      searchTerm === "" ||
      cardTitle.includes(searchTerm) ||
      cardDescription.includes(searchTerm);
    const cardStatus = normalizeStatus(card.status);
    const filterStatus = normalizeStatus(statusFilter);
    const matchesStatus = filterStatus === "all" || cardStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
  const paginatedCards = filteredCards.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );

  const handleEditClick = (item) => {
    if (viewMode === "exhibitions") {
      setSelectedExhibition(item);
      setEditModalOpen(true);
    } else {
      setSelectedGallery(item);
      setGalleryEditModalOpen(true);
    }
  };

  const handleDetailsClick = (item) => {
    if (viewMode === "exhibitions") {
      setSelectedExhibition(item);
      setDetailsModalOpen(true);
    } else {
      setSelectedGallery(item);
    }
  };

  // Helper to fetch all artworks for an exhibition (approved only)
  const fetchExhibitionArtworks = async (exhibitionId) => {
    const all = [];
    try {
      // 1. Centralized collection
      const snapshot = await getDocs(collection(db, "exhibition_artworks", exhibitionId, "artworks"));
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        if (!data.approved) continue;
        let artistData = { name: data.artistName || "לא ידוע", email: "", phone: "" };
        if (data.userId) {
          const artistDoc = await getDoc(doc(db, "users", data.userId));
          if (artistDoc.exists()) {
            artistData = { ...artistData, ...artistDoc.data() };
          }
        }
        all.push({ ...data, id: docSnap.id, artist: artistData });
      }
      // 2. Admin-added artworks
      const exhibitionDoc = await getDoc(doc(db, "exhibitions", exhibitionId));
      if (exhibitionDoc.exists()) {
        const exData = exhibitionDoc.data();
        if (Array.isArray(exData.artworks)) {
          for (let i = 0; i < exData.artworks.length; i++) {
            const art = exData.artworks[i];
            all.push({ ...art, id: `admin-${i}`, artist: { name: art.artist || 'הוספה ע"י מנהל', email: "", phone: "" } });
          }
        }
      }
    } catch (error) {
      console.error("Error fetching artworks:", error);
    }
    return all;
  };

  // Helper to fetch logo as ArrayBuffer
  const getLogoArrayBuffer = async () => {
    try {
      const response = await fetch(logo);
      if (!response.ok) {
        throw new Error(`Failed to fetch logo: ${response.status}`);
      }
      return await response.arrayBuffer();
    } catch (error) {
      console.error("Error fetching logo:", error);
      return null;
    }
  };

  // Helper function to sanitize filename
  const sanitizeFilename = (filename) => {
    return filename
      .replace(/[<>:"/\\|?*]/g, '') // Remove invalid characters
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .trim();
  };

  // Helper function to detect if text is primarily Hebrew
  const isHebrewText = (text) => {
    const hebrewRegex = /[\u0590-\u05FF]/;
    const hebrewMatches = text.match(/[\u0590-\u05FF]/g);
    const totalChars = text.replace(/\s/g, '').length;
    return hebrewMatches && hebrewMatches.length / totalChars > 0.5;
  };

  const handleDownloadLabels = async (exhibitionId) => {
    try {
      console.log('Download button pressed for exhibition:', exhibitionId);
      
      const artworks = await fetchExhibitionArtworks(exhibitionId);
      console.log('Fetched artworks:', artworks);
      
      if (!artworks.length) {
        alert('אין תוויות להורדה עבור תערוכה זו');
        return;
      }

      // Get exhibition name for filename
      const exhibition = cardsData.find(ex => ex.id === exhibitionId);
      const exhibitionName = exhibition ? exhibition.title : 'תערוכה';
      const sanitizedName = sanitizeFilename(exhibitionName);

      const logoArrayBuffer = await getLogoArrayBuffer();
      console.log('Logo ArrayBuffer loaded:', logoArrayBuffer ? 'Success' : 'Failed');
      
      // Create labels for all artworks
      const labels = artworks.map((art) => {
        const artist = art.artist || {};
        return {
          artistName: artist.name || '',
          labelTitle: art.artworkName || art.name || '',
          email: artist.email || '',
          phone: artist.phone || art.phone || '',
          extra: `${art.technique || ''}  ${art.size || ''}`.trim(),
          price: art.price && art.price.trim() !== '' ? art.price : 'נא לפנות לאמן',
        };
      });

      const labelsPerPage = 6; // 3 rows × 2 columns
      const totalPages = Math.ceil(labels.length / labelsPerPage);
      const sections = [];

      // Create pages
      for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
        const startIndex = pageIndex * labelsPerPage;
        const endIndex = Math.min(startIndex + labelsPerPage, labels.length);
        const pageLabels = labels.slice(startIndex, endIndex);

        // Fill the page with 6 labels (3 rows × 2 columns)
        const page = [];
        for (let i = 0; i < labelsPerPage; i++) {
          page.push(pageLabels[i] || null);
        }

        const tableRows = [];
        
        // Create 3 rows
        for (let row = 0; row < 3; row++) {
          const cells = [];
          // Create 2 columns per row
          for (let col = 0; col < 2; col++) {
            const labelIndex = row * 2 + col;
            const label = page[labelIndex];
            
            if (label) {
              const cellChildren = [];
              
              // Add logo if available
              if (logoArrayBuffer) {
                cellChildren.push(
                  new Paragraph({
                    children: [
                      new ImageRun({
                        data: logoArrayBuffer,
                        transformation: { 
                          width: 80, 
                          height: 30 
                        }
                      })
                    ],
                    alignment: "center",
                    spacing: { after: 100 }
                  })
                );
              }
              
              // Artist Name with proper RTL handling
              const artistNameText = label.artistName;
              const isArtistNameHebrew = isHebrewText(artistNameText);
              cellChildren.push(
                new Paragraph({
                  children: [
                    new TextRun({ 
                      text: 'שם אמן: ', 
                      bold: true, 
                      size: 28, 
                      font: "Arial",
                      rightToLeft: true
                    }),
                    new TextRun({ 
                      text: artistNameText, 
                      size: 28, 
                      font: "Arial",
                      rightToLeft: isArtistNameHebrew
                    })
                  ],
                  alignment: "center",
                  spacing: { after: 60 },
                  bidirectional: true
                })
              );
              
              // Artwork Title with proper RTL handling
              const titleText = label.labelTitle;
              const isTitleHebrew = isHebrewText(titleText);
              cellChildren.push(
                new Paragraph({
                  children: [
                    new TextRun({ 
                      text: 'שם יצירה: ', 
                      bold: true, 
                      size: 26, 
                      font: "Arial",
                      rightToLeft: true
                    }),
                    new TextRun({ 
                      text: titleText, 
                      size: 26, 
                      font: "Arial",
                      rightToLeft: isTitleHebrew
                    })
                  ],
                  alignment: "center",
                  spacing: { after: 60 },
                  bidirectional: true
                })
              );
              
              // Email (always LTR)
              cellChildren.push(
                new Paragraph({
                  children: [
                    new TextRun({ 
                      text: 'דוא"ל: ', 
                      bold: true, 
                      size: 22, 
                      font: "Arial",
                      rightToLeft: true
                    }),
                    new TextRun({ 
                      text: label.email, 
                      color: "0000FF", 
                      size: 22, 
                      font: "Arial",
                      rightToLeft: false
                    })
                  ],
                  alignment: "center",
                  spacing: { after: 40 },
                  bidirectional: true
                })
              );
              
              // Phone (always LTR for numbers)
              cellChildren.push(
                new Paragraph({
                  children: [
                    new TextRun({ 
                      text: 'טלפון: ', 
                      bold: true, 
                      size: 22, 
                      font: "Arial",
                      rightToLeft: true
                    }),
                    new TextRun({ 
                      text: label.phone, 
                      color: "0000FF", 
                      size: 22, 
                      font: "Arial",
                      rightToLeft: false
                    })
                  ],
                  alignment: "center",
                  spacing: { after: 40 },
                  bidirectional: true
                })
              );
              
              // Extra Info (technique + size) with proper RTL handling
              if (label.extra.trim()) {
                const isExtraHebrew = isHebrewText(label.extra);
                cellChildren.push(
                  new Paragraph({
                    children: [
                      new TextRun({ 
                        text: label.extra, 
                        size: 22,
                        font: "Arial",
                        rightToLeft: isExtraHebrew
                      })
                    ],
                    alignment: "center",
                    bidirectional: true
                  })
                );
              }
              
              // Price with proper RTL handling
              const priceText = label.price;
              const isPriceHebrew = isHebrewText(priceText);
              cellChildren.push(
                new Paragraph({
                  children: [
                    new TextRun({ 
                      text: 'מחיר: ', 
                      bold: true, 
                      size: 22, 
                      font: "Arial",
                      rightToLeft: true
                    }),
                    new TextRun({ 
                      text: priceText, 
                      size: 22, 
                      font: "Arial",
                      rightToLeft: isPriceHebrew
                    })
                  ],
                  alignment: "center",
                  bidirectional: true
                })
              );
              
              cells.push(new TableCell({
                children: cellChildren,
                verticalAlign: 'center',
                margins: {
                  top: 150,
                  bottom: 150,
                  left: 100,
                  right: 100
                },
                borders: {
                  top: { style: 'single', size: 1, color: 'CCCCCC' },
                  bottom: { style: 'single', size: 1, color: 'CCCCCC' },
                  left: { style: 'single', size: 1, color: 'CCCCCC' },
                  right: { style: 'single', size: 1, color: 'CCCCCC' }
                }
              }));
            } else {
              // Empty cell
              cells.push(new TableCell({ 
                children: [new Paragraph('')], 
                verticalAlign: 'center',
                margins: {
                  top: 150,
                  bottom: 150,
                  left: 100,
                  right: 100
                },
                borders: {
                  top: { style: 'single', size: 1, color: 'CCCCCC' },
                  bottom: { style: 'single', size: 1, color: 'CCCCCC' },
                  left: { style: 'single', size: 1, color: 'CCCCCC' },
                  right: { style: 'single', size: 1, color: 'CCCCCC' }
                }
              }));
            }
          }
          
          tableRows.push(new TableRow({ 
            children: cells,
            height: { value: 1500, rule: 'atLeast' }
          }));
        }
        
        sections.push({
          children: [
            new Table({ 
              rows: tableRows,
              width: { size: 100, type: 'pct' },
              columnWidths: [5000, 5000] // 2 equal columns
            })
          ],
          properties: {
            page: {
              margin: {
                top: 720,
                right: 720,
                bottom: 720,
                left: 720
              }
            }
          }
        });
      }

      const doc = new Document({
        sections: sections
      });

      const blob = await Packer.toBlob(doc);
      
      // Use exhibition name in filename
      const filename = `${sanitizedName}-labels.docx`;
      saveAs(blob, filename);
      
      showToast(`תוויות הורדו בהצלחה! (${totalPages} עמודים)`);
      
    } catch (error) {
      console.error('Error generating labels:', error);
      alert('Failed to generate labels. Please try again.');
    }
  };

  // Helper to fetch artist bio for a given user and exhibition
  const fetchArtistBio = async (userId, exhibitionId) => {
    // Try exhibition-specific bio first
    const bioDocRef = doc(db, "users", userId, "registrations", exhibitionId, "artworks", "bio");
    const bioSnap = await getDoc(bioDocRef);
    if (bioSnap.exists()) {
      return { ...bioSnap.data(), userId };
    }
    // Fallback to main profile
    const userDocRef = doc(db, "users", userId);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
      return { ...userSnap.data(), userId };
    }
    return null;
  };

  // Helper to render a bio to a hidden DOM node and return the node
  const renderBioToNode = (bio) => {
    // Create a container
    const container = document.createElement("div");
    container.style.width = "210mm";
    container.style.minHeight = "297mm";
    container.style.padding = "20mm";
    container.style.background = "#fff";
    container.style.fontFamily = "'Arial', sans-serif";
    container.style.color = "#222";
    container.style.boxSizing = "border-box";
    container.dir = "rtl";
    container.innerHTML = `
      <div style="text-align:center;margin-bottom:20px;">
        <img src="${bio.imageUrl || bio.image || 'https://via.placeholder.com/140'}" alt="Profile" style="width:140px;height:140px;border-radius:50%;margin-bottom:15px;object-fit:cover;border:3px solid #4a90e2;" />
        <h1 style="margin:0;font-size:28px;font-weight:700;">${bio.name || ''}</h1>
      </div>
      <section style="margin-bottom:15px;"><h2 style="font-size:20px;margin-bottom:6px;border-bottom:1px solid #ddd;padding-bottom:4px;">אימייל</h2><p style="font-size:16px;">${bio.email || ''}</p></section>
      ${bio.group ? `<section style="margin-bottom:15px;"><h2 style="font-size:20px;margin-bottom:6px;border-bottom:1px solid #ddd;padding-bottom:4px;">קבוצת אמנים</h2><p style="font-size:16px;">${bio.group}</p></section>` : ''}
      <section style="margin-bottom:15px;"><h2 style="font-size:20px;margin-bottom:6px;border-bottom:1px solid #ddd;padding-bottom:4px;">תחום האומנות</h2><p style="font-size:16px;">${bio.subject || ''}</p></section>
      <section style="margin-bottom:15px;"><h2 style="font-size:20px;margin-bottom:6px;border-bottom:1px solid #ddd;padding-bottom:4px;">אזור מגורים</h2><p style="font-size:16px;">${bio.place || ''}</p></section>
      <section style="margin-bottom:15px;"><h2 style="font-size:20px;margin-bottom:6px;border-bottom:1px solid #ddd;padding-bottom:4px;">ביו</h2><p style="font-size:16px;line-height:1.5;white-space:pre-wrap;">${bio.bio || ''}</p></section>
      ${bio.link ? `<div style="text-align:center;margin-top:20px;"><h2 style="font-size:18px;margin-bottom:12px;">QR Code</h2><img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(bio.link)}" width="150" height="150" /><p style="margin-top:10px;font-size:14px;color:#555;">${bio.link}</p></div>` : ''}
    `;
    document.body.appendChild(container);
    return container;
  };

  // Handler to download all artist bios as PDF
  const handleDownloadArtistBios = async (exhibitionId) => {
    try {
      const artworks = await fetchExhibitionArtworks(exhibitionId);
      // Only include approved artworks
      const approvedArtworks = artworks.filter(a => a.approved);
      // Get unique userIds
      const userIds = Array.from(new Set(approvedArtworks.map(a => a.userId).filter(Boolean)));
      if (!userIds.length) {
        alert('אין אמנים מאושרים להורדה עבור תערוכה זו');
        return;
      }
      // Fetch all bios
      const bios = [];
      for (const userId of userIds) {
        const bio = await fetchArtistBio(userId, exhibitionId);
        if (bio) bios.push(bio);
      }
      if (!bios.length) {
        alert('לא נמצאו דפי אמן להורדה');
        return;
      }
      // Generate PDF
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      for (let i = 0; i < bios.length; i++) {
        const node = renderBioToNode(bios[i]);
        // Wait for images to load
        await new Promise(resolve => setTimeout(resolve, 300));
        const canvas = await html2canvas(node, { scale: 2, useCORS: true, backgroundColor: '#fff' });
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        document.body.removeChild(node);
        if (i < bios.length - 1) pdf.addPage();
      }
      // Get exhibition name for filename
      const exhibition = cardsData.find(ex => ex.id === exhibitionId);
      const exhibitionName = exhibition ? exhibition.title : 'תערוכה';
      const sanitizedName = sanitizeFilename(exhibitionName);
      pdf.save(`${sanitizedName}-artist-bios.pdf`);
      showToast('דפי אמנים הורדו בהצלחה!');
    } catch (error) {
      console.error('Error generating artist bios PDF:', error);
      alert('שגיאה ביצירת PDF. נסה שוב.');
    }
  };

  if (loading) return <div className="text-center p-4">טוען...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <img
          src="https://amutatbh.com/wp-content/uploads/2021/03/logo-new.svg"
          alt="לוגו"
          className="dashboard-logo"
        />
        <div className="dashboard-greeting">
          <span>ברוך הבא, אדמין</span>
        </div>
        <div className="dashboard-nav">
          <button
            className="dashboard-btn artists"
            onClick={() => navigate("/admin-dashboard")}
          >
            דף אמנים
          </button>
        </div>
      </header>

      <div className="dashboard-root">
        <div className="dashboard-actions-row">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              width: "100%",
            }}
          >
            <div className="dashboard-search-group">
              <input
                className="dashboard-search"
                type="text"
                placeholder={
                  viewMode === "exhibitions"
                    ? "     חפש לפי שם תערוכה"
                    : "חפש לפי שם גלריה"
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flex: 1, maxWidth: 320 }}
              />
              <FaSearch className="dashboard-search-icon" />
            </div>
            <button
              className="dashboard-btn"
              onClick={handleToggleMode}
              style={{ minWidth: 160 }}
            >
              {viewMode === "exhibitions" ? "חפש בגלריות" : "חפש בתערוכות"}
            </button>
            <select
              className="dashboard-status-dropdown"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ minWidth: 140 }}
            >
              <option value="all">
                {viewMode === "exhibitions" ? "סנן תערוכות" : "סנן גלריות"}
              </option>
              <option value="פתוחה">פתוחות</option>
              <option value="סגורה">סגורות</option>
            </select>
            <button
              className="dashboard-btn add-exhibition"
              onClick={() =>
                viewMode === "exhibitions"
                  ? setModalOpen(true)
                  : setGalleryModalOpen(true)
              }
              type="button"
            >
              {viewMode === "exhibitions" ? "+ הוסף תערוכה" : "+ הוסף גלריה"}
            </button>
          </div>
        </div>

        {showArtists ? (
          <AdminDashboard />
        ) : (
          <>
            <div className="dashboard-cards">
              {paginatedCards.map((card) =>
                viewMode === "exhibitions" ? (
                  <Card
                    key={card.id}
                    exhibitionId={card.id}
                    title={card.title}
                    description={card.description}
                    imageUrl={card.imageUrl}
                    status={card.status}
                    startDate={card.startDate}
                    endDate={card.endDate}
                    onEdit={() => handleEditClick(card)}
                    onDelete={() => handleDeleteRequest(card.id)}
                    onCreateLabels={() => handleDownloadLabels(card.id)}
                    onDownloadArtistBios={() => handleDownloadArtistBios(card.id)}
                    onDetails={() => handleDetailsClick(card)}
                  />
                ) : (
                  <GalleryCard
                    key={card.id}
                    galleryId={card.id}
                    title={card.title}
                    description={card.description}
                    imageUrl={card.imageUrl}
                    status={card.status}
                    location={card.location}
                    onEdit={() => handleEditClick(card)}
                    onDelete={() => handleDeleteRequest(card.id)}
                    onDetails={() => handleDetailsClick(card)}
                  />
                )
              )}
            </div>

            {totalPages > 1 && (
              <div className="dashboard-pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`dashboard-page-btn ${
                      currentPage === i + 1 ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        <ExhibitionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleAddExhibition}
        />

        <GalleryModal
          isOpen={galleryModalOpen}
          onClose={() => setGalleryModalOpen(false)}
          onSave={handleAddGallery}
        />

        {selectedGallery && (
          <GalleryEditModal
            isOpen={galleryEditModalOpen}
            onClose={() => {
              setGalleryEditModalOpen(false);
              setSelectedGallery(null);
            }}
            onSave={handleEditGallery}
            gallery={selectedGallery}
          />
        )}

        {selectedExhibition && (
          <ExhibitionEditModal
            isOpen={editModalOpen}
            onClose={() => {
              setEditModalOpen(false);
              setSelectedExhibition(null);
            }}
            onSave={handleEditExhibition}
            exhibition={selectedExhibition}
          />
        )}

        {selectedExhibition && (
          <ExhibitionDetailsModal
            isOpen={detailsModalOpen}
            onClose={() => {
              setDetailsModalOpen(false);
              setSelectedExhibition(null);
            }}
            exhibition={selectedExhibition}
            onUpdateArtworks={(updatedArtworks) => {
              const updatedExhibitions = cardsData.map((exh) =>
                exh.id === selectedExhibition.id
                  ? { ...exh, artworks: updatedArtworks }
                  : exh
              );
              setCardsData(updatedExhibitions);
            }}
          />
        )}

        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />

        {toast && <div className="toast-message">{toast}</div>}
      </div>
    </div>
  );
};

export default Dashboard;