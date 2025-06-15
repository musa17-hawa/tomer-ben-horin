import React, { useState, useEffect } from "react";
import "./UserDashboard.css";
import { getExhibitionsByStatus } from "../services/exhibitionService";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Placeholder for user name, replace with actual user data if available
  const userName = "משתמש";
  const navigate = useNavigate();

  useEffect(() => {
    loadExhibitions();
  }, []);

  const loadExhibitions = async () => {
    try {
      setLoading(true);
      // Get only open exhibitions
      const data = await getExhibitionsByStatus("open");
      setExhibitions(data);
    } catch (err) {
      setError("Failed to load exhibitions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredExhibitions = exhibitions.filter((exhibition) =>
    exhibition.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="dashboard-root">
      <div className="dashboard-actions">
        <input
          className="dashboard-search"
          type="text"
          placeholder="חפש לפי שם תערוכה"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="dashboard-cards">
        {filteredExhibitions.map((exhibition) => (
          <div key={exhibition.id} className="exhibition-card">
            {exhibition.imageUrl && (
              <img
                src={exhibition.imageUrl}
                alt={exhibition.title}
                className="exhibition-image"
              />
            )}
            <h3 className="exhibition-title">{exhibition.title}</h3>
            <p className="exhibition-location">{exhibition.location}</p>
            <p className="exhibition-date">
              {new Date(exhibition.startDate).toLocaleDateString()} -{" "}
              {new Date(exhibition.endDate).toLocaleDateString()}
            </p>
            <span className="exhibition-status">פתוחה</span>
            <button
              className="exhibition-btn"
              onClick={() =>
                navigate(`/register-artwork?exhibitionId=${exhibition.id}`)
              }
            >
              הרשמה לתערוכה
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
