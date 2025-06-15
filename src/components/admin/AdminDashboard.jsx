import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/config";
import "../exhibitions/Dashboard.css";

const AdminDashboard = () => {
  const [artists, setArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const users = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArtists(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchArtists();
  }, []);

  const filteredArtists = artists.filter((artist) =>
    artist.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const goToAdminProfile = (artistId) => {
    navigate(`/Admiprofile/${artistId}`);
  };

  const goToEdit = (artistId) => {
    navigate(`/edit/${artistId}`);
  };

  return (
    <div className="dashboard-root" dir="rtl">
      <header className="dashboard-header">
        <img
          src="https://amutatbh.com/wp-content/uploads/2021/03/logo-new.svg"
          alt="לוגו"
          className="dashboard-logo"
        />
        <div className="dashboard-greeting">
          <span>ניהול אמנים</span>
        </div>
        <div className="dashboard-nav">
          <button
            className="dashboard-btn"
            onClick={() => navigate('/dashboard')}
          >
            חזור לתערוכות
          </button>
        </div>
      </header>
      <div className="dashboard-actions-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', justifyContent: 'flex-end' }}>
          <div className="dashboard-search-group">
            <input
              className="dashboard-search"
              type="text"
              placeholder=" 🔍 חפש אמן לפי שם  ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1, maxWidth: 320 }}
            />
          </div>
        </div>
      </div>

      <div className="dashboard-cards">
        {filteredArtists.map((artist) => (
          <div
            key={artist.id}
            className="artist-card card-root"
            onClick={() => goToAdminProfile(artist.id)}
            style={{ cursor: "pointer" }}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                goToAdminProfile(artist.id);
              }
            }}
          >
            <img
              src={
                artist.image ||
                "https://www.shutterstock.com/image-vector/picture-icon-vector-photo-gallery-260nw-1908594850.jpg"
              }
              alt={artist.name ? `Profile of ${artist.name}` : "Artist profile"}
              className="artist-image card-image"
            />
            <div className="artist-info card-header">
              <p>
                <strong>{artist.name}</strong> 
              </p>
              <p>
                {artist.place ? artist.place : "לא צויין מקום"}
              </p>
            </div>
            <div className="card-actions">
              <button
                className="edit-button card-btn edit"
                onClick={(e) => {
                  e.stopPropagation();
                  goToAdminProfile(artist.id);
                }}
              >
                ערוך
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard; 