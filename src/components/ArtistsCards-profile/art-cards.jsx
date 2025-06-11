// AdminDashboard.js
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import "./AdminDashboard.css";

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
    <div className="admin-dashboard" dir="rtl">
      <h1>ניהול אמנים</h1>

      <input
        type="text"
        placeholder=" 🔍 חפש אמן לפי שם  ..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
        dir="rtl"
      />

      <div className="artist-card-container">
        {filteredArtists.map((artist) => (
          <div
            key={artist.id}
            className="artist-card"
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
              className="artist-image"
            />
            <div className="artist-info">
              <p>
                <strong></strong> {artist.name}
              </p>
              <p>
                <strong></strong>{" "}
                {artist.place ? artist.place : "לא צויין מקום"}
              </p>
            </div>

            <button
              className="edit-button"
              onClick={(e) => {
                e.stopPropagation();
                goToAdminProfile(artist.id);
              }}
            >
              ערוך
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
