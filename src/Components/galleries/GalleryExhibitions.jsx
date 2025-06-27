import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../exhibitions/Dashboard.css";
import Card from "../exhibitions/Card";
import ExhibitionModal from "../exhibitions/ExhibitionModal";
import ExhibitionEditModal from "../exhibitions/ExhibitionEditModal";
import ExhibitionDetailsModal from "../artworks/ExhibitionDetailsModal";
import DeleteConfirmModal from "../exhibitions/DeleteConfirmModal";
import {
  createExhibition,
  updateExhibition,
  deleteExhibition,
  getExhibitionsByGallery,
} from "../../services/exhibitionService";
import { getGalleryById } from "../../services/galleryService";
import { uploadToImgBB } from "../../utils/imgbb";
import { FaSearch } from "react-icons/fa";

const GalleryExhibitions = () => {
  const { galleryId } = useParams();
  const navigate = useNavigate();
  const [gallery, setGallery] = useState(null);
  const [exhibitions, setExhibitions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedExhibition, setSelectedExhibition] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("date");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [exhibitionToDeleteId, setExhibitionToDeleteId] = useState(null);
  const cardsPerPage = 10;

  useEffect(() => {
    loadGalleryAndExhibitions();
  }, [galleryId]);

  const loadGalleryAndExhibitions = async () => {
    try {
      setLoading(true);
      const [galleryData, exhibitionsData] = await Promise.all([
        getGalleryById(galleryId),
        getExhibitionsByGallery(galleryId)
      ]);
      setGallery(galleryData);
      setExhibitions(exhibitionsData);
    } catch (err) {
      setError("Failed to load gallery and exhibitions");
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
        galleryId: galleryId,
        imageUrl: imageUrl || null,
        image: null,
        artworks: data.artworks || []
      };

      const newExhibition = await createExhibition(exhibitionData);
      
      // Save artworks with admin approval
      if (data.artworks && data.artworks.length > 0) {
        // Auto-approve admin created artworks
        const approvedArtworks = data.artworks.map(artwork => ({
          ...artwork,
          approved: true,
          createdByAdmin: true
        }));
        
        // Update exhibition with approved artworks
        await updateExhibition(newExhibition.id, {
          ...exhibitionData,
          artworks: approvedArtworks
        });
      }

      await loadGalleryAndExhibitions();
      showToast("התערוכה נוספה בהצלחה!");
    } catch (err) {
      setError("Failed to add exhibition");
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
        galleryId: galleryId,
        imageUrl: imageUrl || null,
        image: null,
        artworks: data.artworks || selectedExhibition.artworks || []
      };

      // Auto-approve any new artworks added by admin
      if (data.artworks) {
        const approvedArtworks = data.artworks.map(artwork => ({
          ...artwork,
          approved: true,
          createdByAdmin: true
        }));
        exhibitionData.artworks = approvedArtworks;
      }

      await updateExhibition(selectedExhibition.id, exhibitionData);
      await loadGalleryAndExhibitions();
      showToast("התערוכה עודכנה בהצלחה!");
    } catch (err) {
      setError("Failed to update exhibition");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExhibition = async (id) => {
    try {
      setLoading(true);
      await deleteExhibition(id);
      await loadGalleryAndExhibitions();
      showToast("התערוכה נמחקה בהצלחה!");
    } catch (err) {
      setError("Failed to delete exhibition");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = (id) => {
    setExhibitionToDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (exhibitionToDeleteId) {
      await handleDeleteExhibition(exhibitionToDeleteId);
      setDeleteModalOpen(false);
      setExhibitionToDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setExhibitionToDeleteId(null);
  };

  const handleEditClick = (exhibition) => {
    setSelectedExhibition(exhibition);
    setEditModalOpen(true);
  };

  const handleDetailsClick = (exhibition) => {
    setSelectedExhibition(exhibition);
    setDetailsModalOpen(true);
  };

  const handleUpdateArtworks = (updatedArtworks) => {
    // Auto-approve artworks created by admin
    const approvedArtworks = updatedArtworks.map(artwork => ({
      ...artwork,
      approved: true,
      createdByAdmin: true
    }));
    
    const updatedExhibitions = exhibitions.map((exh) =>
      exh.id === selectedExhibition.id
        ? { ...exh, artworks: approvedArtworks }
        : exh
    );
    setExhibitions(updatedExhibitions);
  };

  // Filter and sort exhibitions
  const filteredAndSortedExhibitions = exhibitions
    .filter((exhibition) => {
      const searchTerm = search.toLowerCase().trim();
      const titleMatch = (exhibition.title || "").toLowerCase().includes(searchTerm);
      const descMatch = (exhibition.description || "").toLowerCase().includes(searchTerm);
      
      const statusMatch = statusFilter === "all" || 
        (statusFilter === "פתוחה" && exhibition.status === "open") ||
        (statusFilter === "סגורה" && exhibition.status === "closed");
      
      return (titleMatch || descMatch) && statusMatch;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.startDate || 0) - new Date(a.startDate || 0);
      } else if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "");
      } else if (sortBy === "status") {
        return (a.status || "").localeCompare(b.status || "");
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredAndSortedExhibitions.length / cardsPerPage);
  const paginatedExhibitions = filteredAndSortedExhibitions.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );

  if (loading) return <div className="text-center p-4">טוען...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="dashboard-root">
      <header className="dashboard-header">
        <img
          src="https://amutatbh.com/wp-content/uploads/2021/03/logo-new.svg"
          alt="לוגו"
          className="dashboard-logo"
        />
        <div className="dashboard-greeting">
          <span>תערוכות בגלריה: {gallery?.title}</span>
        </div>
        <div className="dashboard-nav">
          <button
            className="dashboard-btn"
            onClick={() => navigate("/user-dashboard")}
          >
            חזור לדשבורד
          </button>
        </div>
      </header>
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
              placeholder="חפש תערוכות בגלריה זו"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, maxWidth: 320 }}
            />
            <FaSearch className="dashboard-search-icon" />
          </div>
          <select
            className="dashboard-status-dropdown"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ minWidth: 140 }}
          >
            <option value="date">מיין לפי תאריך</option>
            <option value="title">מיין לפי שם</option>
            <option value="status">מיין לפי סטטוס</option>
          </select>
          <select
            className="dashboard-status-dropdown"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ minWidth: 140 }}
          >
            <option value="all">סנן תערוכות</option>
            <option value="פתוחה">פתוחות</option>
            <option value="סגורה">סגורות</option>
          </select>
          <button
            className="dashboard-btn add-exhibition"
            onClick={() => setModalOpen(true)}
            type="button"
          >
            + הוסף תערוכה
          </button>
        </div>
      </div>

      <div className="dashboard-cards">
        {paginatedExhibitions.map((exhibition) => (
          <Card
            key={exhibition.id}
            exhibitionId={exhibition.id}
            title={exhibition.title}
            description={exhibition.description}
            imageUrl={exhibition.imageUrl}
            status={exhibition.status}
            startDate={exhibition.startDate}
            endDate={exhibition.endDate}
            onEdit={() => handleEditClick(exhibition)}
            onDelete={() => handleDeleteRequest(exhibition.id)}
            onCreateLabels={() => {}}
            onDetails={() => handleDetailsClick(exhibition)}
          />
        ))}
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

      <ExhibitionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddExhibition}
      />
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
          onUpdateArtworks={handleUpdateArtworks}
        />
      )}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      {toast && <div className="toast-message">{toast}</div>}
    </div>
  );
};

export default GalleryExhibitions;