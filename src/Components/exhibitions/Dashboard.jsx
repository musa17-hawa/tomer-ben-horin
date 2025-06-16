import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import Card from "./Card";
import ExhibitionModal from "./ExhibitionModal";
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
import { uploadToImgBB } from "../../utils/imgbb";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const initialCardsData = [
  { title: "תערוכה", count: 5, date: "11.6.2025", status: "פתוחה" },
  { title: "תערוכה", count: 4, date: "20.6.2025", status: "סגורה" },
  { title: "תערוכה", count: 3, date: "7.7.2025", status: "פתוחה" },
  { title: "תערוכה", count: 2, date: "22.6.2025", status: "סגורה" },
  { title: "תערוכה", count: 1, date: "28.5.2025", status: "סגורה" },
  { title: "תערוכה", count: 10, date: "17.5.2025", status: "סגורה" },
  { title: "תערוכה", count: 9, date: "30.6.2025", status: "סגורה" },
  { title: "תערוכה", count: 8, date: "9.6.2025", status: "פתוחה" },
  { title: "תערוכה", count: 7, date: "27.6.2025", status: "סגורה" },
  { title: "תערוכה", count: 6, date: "17.6.2025", status: "סגורה" },
];

const Dashboard = () => {
  const [cardsData, setCardsData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedExhibitionIdx, setSelectedExhibitionIdx] = useState(null);
  const [showArtists, setShowArtists] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 10;
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'open', 'closed'
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [exhibitionToDeleteId, setExhibitionToDeleteId] = useState(null);
  const navigate = useNavigate();
  // Helper to normalize status
  const normalizeStatus = (status) => {
    if (!status) return "";
    if (["פתוחה", "open"].includes(status)) return "פתוחה";
    if (["סגורה", "closed"].includes(status)) return "סגורה";
    return status;
  };
  const filteredCards = cardsData.filter((card) => {
    const searchTerm = search.toLowerCase().trim();
    const cardTitle = (card.title || "").toLowerCase();
    const cardDescription = (card.description || "").toLowerCase();

    console.log("Search Term:", searchTerm); // Debug log
    console.log("Card Title:", cardTitle, "Card Description:", cardDescription); // Debug log

    const matchesSearch =
      searchTerm === "" ||
      cardTitle.includes(searchTerm) ||
      cardDescription.includes(searchTerm);

    const cardStatus = normalizeStatus(card.status);
    const filterStatus = normalizeStatus(statusFilter);

    console.log("Status Filter:", filterStatus); // Debug log
    console.log("Card Status:", cardStatus); // Debug log

    const matchesStatus = filterStatus === "all" || cardStatus === filterStatus;

    console.log(
      "Matches Search:",
      matchesSearch,
      "Matches Status:",
      matchesStatus
    ); // Debug log

    return matchesSearch && matchesStatus;
  });
  console.log("Filtered Cards (after filter):", filteredCards); // Debug log
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
  const paginatedCards = filteredCards.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );

  useEffect(() => {
    loadExhibitions();
  }, []);

  const loadExhibitions = async () => {
    try {
      setLoading(true);
      const data = await getAllExhibitions();
      console.log("Loaded exhibitions:", data); // Debug log
      setCardsData(data);
    } catch (err) {
      setError("Failed to load exhibitions");
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
        image: null, // Don't store the file object
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

  const handleEditExhibition = async (data) => {
    try {
      setLoading(true);
      const exhibition = cardsData[selectedExhibitionIdx];
      let imageUrl = exhibition.imageUrl;
      if (data.image) {
        imageUrl = await uploadToImgBB(data.image);
      }

      const exhibitionData = {
        ...data,
        imageUrl: imageUrl || null,
        image: null, // Don't store the file object
      };

      await updateExhibition(exhibition.id, exhibitionData);
      await loadExhibitions();
      showToast("התערוכה עודכנה בהצלחה!");
    } catch (err) {
      setError("Failed to update exhibition");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (id) => {
    try {
      setLoading(true);
      await deleteExhibition(id);
      await loadExhibitions();
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
      await handleDeleteCard(exhibitionToDeleteId);
      setDeleteModalOpen(false);
      setExhibitionToDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setExhibitionToDeleteId(null);
  };

  const handleCreateLabels = (idx) => {
    alert("פונקציית יצור לייבלים תתווסף בקרוב");
  };

  const handleEditClick = (idx) => {
    setSelectedExhibitionIdx(idx);
    setEditModalOpen(true);
  };

  const handleDetailsClick = (idx) => {
    setSelectedExhibitionIdx(idx);
    setDetailsModalOpen(true);
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
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
              placeholder="חפש לפי שם תערוכה"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, maxWidth: 320 }}
            />
            <FaSearch className="dashboard-search-icon" />
          </div>
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
      {showArtists ? (
        <AdminDashboard />
      ) : (
        <>
          <div className="dashboard-cards">
            {paginatedCards.map((card, idx) => (
              <Card
                key={card.id}
                exhibitionId={card.id}
                title={card.title}
                description={card.description}
                imageUrl={card.imageUrl}
                status={card.status}
                startDate={card.startDate}
                endDate={card.endDate}
                onEdit={() => handleEditClick(filteredCards.indexOf(card))}
                onDelete={() => handleDeleteRequest(card.id)}
                onCreateLabels={() =>
                  handleCreateLabels(filteredCards.indexOf(card))
                }
                onDetails={() =>
                  handleDetailsClick(filteredCards.indexOf(card))
                }
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="dashboard-pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`pagination-btn ${
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
      {selectedExhibitionIdx !== null && (
        <ExhibitionEditModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleEditExhibition}
          exhibition={cardsData[selectedExhibitionIdx]}
        />
      )}
      {selectedExhibitionIdx !== null && (
        <ExhibitionDetailsModal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          exhibition={cardsData[selectedExhibitionIdx]}
          onUpdateArtworks={(updatedArtworks) => {
            const updatedExhibitions = cardsData.map((exh, idx) =>
              idx === selectedExhibitionIdx
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
