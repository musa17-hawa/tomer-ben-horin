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
      setError(`Failed to delete ${viewMode === "exhibitions" ? "exhibition" : "gallery"}`);
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
              placeholder={viewMode === "exhibitions" ? "חפש לפי שם תערוכה" : "חפש לפי שם גלריה"}
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
            <option value="all">{viewMode === "exhibitions" ? "סנן תערוכות" : "סנן גלריות"}</option>
            <option value="פתוחה">פתוחות</option>
            <option value="סגורה">סגורות</option>
          </select>
          <button
            className="dashboard-btn add-exhibition"
            onClick={() => viewMode === "exhibitions" ? setModalOpen(true) : setGalleryModalOpen(true)}
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
                  onCreateLabels={() => {}}
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
  );
};

export default Dashboard;