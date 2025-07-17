import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title
);

const AdminStats = () => {
  const [stats, setStats] = useState({
    artists: 0,
    exhibitions: 0,
    artworks: 0,
    artworksByExhibition: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersSnap, exhibitionsSnap] = await Promise.all([
          getDocs(collection(db, "users")),
          getDocs(collection(db, "exhibitions")),
        ]);

        let totalArtworks = 0;

        const artworksByEx = await Promise.all(
          exhibitionsSnap.docs.map(async (docSnap) => {
            const ex = docSnap.data();
            const exId = docSnap.id;

            const snap = await getDocs(
              collection(db, "exhibition_artworks", exId, "artworks")
            );

            let approvedCount = 0;
            snap.forEach((a) => {
              if (a.data().approved) approvedCount++;
            });

            const adminCount = Array.isArray(ex.artworks)
              ? ex.artworks.length
              : 0;

            const total = approvedCount + adminCount;
            totalArtworks += total;

            return {
              name: ex.title || "ללא שם",
              count: total,
            };
          })
        );

        setStats({
          artists: usersSnap.size,
          exhibitions: exhibitionsSnap.size,
          artworks: totalArtworks,
          artworksByExhibition: artworksByEx,
        });
      } catch (err) {
        console.error("Error loading stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const pieData = {
    labels: stats.artworksByExhibition.map((e) => e.name),
    datasets: [
      {
        data: stats.artworksByExhibition.map((e) => e.count),
        backgroundColor: [
          "#fd3470",
          "#feb47b",
          "#7e57c2",
          "#26c6da",
          "#66bb6a",
          "#ec407a",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: stats.artworksByExhibition.map((e) => e.name),
    datasets: [
      {
        label: "מספר יצירות בתערוכה",
        data: stats.artworksByExhibition.map((e) => e.count),
        backgroundColor: "#fd3470",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white-10 p-8" dir="rtl">
      <h1 className="text-4xl font-bold text-center text-pink-700 mb-10">
        דף סטטיסטיקות
      </h1>

      {loading ? (
        <div className="text-center text-lg text-pink-600">טוען נתונים...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-10">
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-pink-500">
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                אמנים רשומים
              </h2>
              <p className="text-4xl text-pink-700">{stats.artists}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-pink-500">
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                מספר תערוכות
              </h2>
              <p className="text-4xl text-pink-700">{stats.exhibitions}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-pink-500">
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                סך כל היצירות
              </h2>
              <p className="text-4xl text-pink-700">{stats.artworks}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-center text-lg font-bold text-pink-700 mb-4">
                יצירות לפי תערוכה
              </h3>
              <Pie data={pieData} />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-center text-lg font-bold text-pink-700 mb-4">
                יצירות לפי תערוכה
              </h3>
              <Bar data={barData} options={{ indexAxis: "y" }} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminStats;
