// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getExhibitionsByStatus } from "../../services/exhibitionService";
// import { auth, db } from "../../firebase/config";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination, Navigation, EffectCoverflow } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "swiper/css/effect-coverflow";

// const ExhibitionsList = () => {
//   const [exhibitions, setExhibitions] = useState([]);
//   const [user, setUser] = useState(null);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentExhibitionIndex, setCurrentExhibitionIndex] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         const userDoc = await getDoc(doc(db, "users", currentUser.uid));
//         if (userDoc.exists()) {
//           setUser({ uid: currentUser.uid, ...userDoc.data() });
//         }
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     const loadExhibitions = async () => {
//       try {
//         const data = await getExhibitionsByStatus("open");
//         setExhibitions(data);
//       } catch (err) {
//         setError("Failed to load exhibitions");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadExhibitions();
//   }, []);

//   const filteredExhibitions = exhibitions.filter((exhibition) =>
//     exhibition.title.toLowerCase().includes(search.toLowerCase())
//   );

//   if (loading) return <div className="text-center mt-10 text-lg">טוען...</div>;
//   if (error)
//     return <div className="text-center mt-10 text-red-600">{error}</div>;

//   return (
//     <div
//       dir="rtl"
//       className="min-h-screen py-16 px-4 font-sans bg-[url('https://amutatbh.com/wp-content/uploads/2021/03/wall-bg.jpg')] bg-cover bg-center bg-no-repeat bg-opacity-10 backdrop-brightness-95"
//     >
//       <header className="text-center mb-10">
//         <h1 className="text-5xl font-extrabold text-[#fd3470]">
//           🎨 ברוך הבא אמן/ית
//         </h1>
//         <p className="text-gray-700 text-lg mt-3">
//           בחר תערוכה והגש את יצירותיך
//         </p>
//       </header>

//       <div className="flex justify-center mb-6">
//         <input
//           type="text"
//           placeholder="🔍 חפש לפי שם תערוכה"
//           className="w-full max-w-lg p-4 rounded-full shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#fd3470]"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       <Swiper
//         effect="coverflow"
//         grabCursor
//         centeredSlides
//         slidesPerView={2.6}
//         loop
//         spaceBetween={5}
//         modules={[EffectCoverflow, Pagination, Navigation]}
//         coverflowEffect={{
//           rotate: 30,
//           stretch: 0,
//           depth: 200,
//           modifier: 1,
//           slideShadows: false,
//         }}
//         pagination={{
//           clickable: true,
//           bulletActiveClass: "swiper-pagination-bullet-active !bg-[#fd3470]",
//         }}
//         navigation
//         className="max-w-5xl mx-auto"
//         onSlideChange={(swiper) => {
//           setCurrentExhibitionIndex(swiper.realIndex);
//         }}
//       >
//         {filteredExhibitions.map((exhibition) => (
//           <SwiperSlide key={exhibition.id}>
//             <div
//               className="cursor-pointer rounded-md overflow-hidden shadow-xl transform transition duration-500 hover:scale-105 w-72 h-[420px] mx-auto"
//               onClick={() => {
//                 navigate(
//                   `/artist-dashboard/edit-bio?exhibitionId=${exhibition.id}`
//                 );
//               }}
//             >
//               <img
//                 src={exhibition.imageUrl}
//                 alt={exhibition.title}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>

//       {filteredExhibitions.length > 0 && (
//         <section className="mt-14 text-center max-w-2xl mx-auto px-6 bg-white bg-opacity-90 rounded-xl shadow-lg p-6">
//           <h2 className="text-3xl font-bold text-[#fd3470] mb-3">
//             {filteredExhibitions[currentExhibitionIndex]?.title}
//           </h2>
//           <p className="text-md text-gray-700 mb-4">
//             {filteredExhibitions[currentExhibitionIndex]?.description}
//           </p>
//           <p className="text-sm text-gray-600 italic">
//             {filteredExhibitions[currentExhibitionIndex]?.location} |{" "}
//             {new Date(
//               filteredExhibitions[currentExhibitionIndex]?.startDate
//             ).toLocaleDateString()}{" "}
//             -{" "}
//             {new Date(
//               filteredExhibitions[currentExhibitionIndex]?.endDate
//             ).toLocaleDateString()}
//           </p>
//         </section>
//       )}
//     </div>
//   );
// };

// export default ExhibitionsList;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getExhibitionsByStatus } from "../../services/exhibitionService";
import { auth, db } from "../../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

const ExhibitionsList = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentExhibitionIndex, setCurrentExhibitionIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUser({ uid: currentUser.uid, ...userDoc.data() });
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadExhibitions = async () => {
      try {
        const data = await getExhibitionsByStatus("open");
        setExhibitions(data);
      } catch (err) {
        setError("Failed to load exhibitions");
      } finally {
        setLoading(false);
      }
    };
    loadExhibitions();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const filteredExhibitions = exhibitions.filter((exhibition) =>
    exhibition.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-center mt-10 text-lg">טוען...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <div
      dir="rtl"
      className="min-h-screen pt-36 px-4 font-sans bg-[url('https://amutatbh.com/wp-content/uploads/2021/03/wall-bg.jpg')] bg-cover bg-center bg-no-repeat bg-opacity-10 backdrop-brightness-95"
    >
      <div className="bg-white rounded-xl shadow-md px-6 py-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50 mx-4  width full">
        <div className="flex items-center gap-4">
          <img
            src="https://amutatbh.com/wp-content/uploads/2021/03/logo-new.svg"
            alt="Logo"
            className="h-14"
          />
          <div className="text-right">
            <h1 className="text-3xl font-bold text-[#fd3470]">
              שלום {user?.name || "אמן/ית"}
            </h1>
            <p className="text-gray-600 text-sm">בחר תערוכה והגש את יצירותיך</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="bg-[#fd3470] text-white px-4 py-2 rounded-lg text-sm hover:bg-pink-600"
        >
          התנתק
        </button>
      </div>

      <nav className="flex justify-center gap-6 mt-4 mb-10 text-lg font-medium text-pink-600">
        <button
          onClick={() => navigate("/artist-dashboard")}
          className="hover:underline"
        >
          התערוכות שלי
        </button>
        <button
          onClick={() => navigate("/artist-dashboard/my-artworks")}
          className="hover:underline"
        >
          העבודות שלי
        </button>
        <button
          onClick={() => navigate("/artist-dashboard/profile")}
          className="hover:underline"
        >
          עריכת פרופיל
        </button>
      </nav>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="🔍 חפש לפי שם תערוכה"
          className="w-full max-w-lg p-4 rounded-full shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#fd3470]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Swiper
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView={2.6}
        loop
        spaceBetween={5}
        modules={[EffectCoverflow, Pagination, Navigation]}
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 200,
          modifier: 1,
          slideShadows: false,
        }}
        pagination={{
          clickable: true,
          bulletActiveClass: "swiper-pagination-bullet-active !bg-[#fd3470]",
        }}
        navigation
        className="max-w-5xl mx-auto"
        onSlideChange={(swiper) => {
          setCurrentExhibitionIndex(swiper.realIndex);
        }}
      >
        {filteredExhibitions.map((exhibition) => (
          <SwiperSlide key={exhibition.id}>
            <div
              className="cursor-pointer rounded-md overflow-hidden shadow-xl transform transition duration-500 hover:scale-105 w-72 h-[420px] mx-auto"
              onClick={() => {
                navigate(
                  `/artist-dashboard/edit-bio?exhibitionId=${exhibition.id}`
                );
              }}
            >
              <img
                src={exhibition.imageUrl}
                alt={exhibition.title}
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {filteredExhibitions.length > 0 && (
        <section className="mt-14 text-center max-w-2xl mx-auto px-6 bg-white bg-opacity-90 rounded-xl shadow-lg p-6">
          <h2 className="text-3xl font-bold text-[#fd3470] mb-3">
            {filteredExhibitions[currentExhibitionIndex]?.title}
          </h2>
          <p className="text-md text-gray-700 mb-4">
            {filteredExhibitions[currentExhibitionIndex]?.description}
          </p>
          <p className="text-sm text-gray-600 italic">
            {filteredExhibitions[currentExhibitionIndex]?.location} |{" "}
            {new Date(
              filteredExhibitions[currentExhibitionIndex]?.startDate
            ).toLocaleDateString()}{" "}
            -{" "}
            {new Date(
              filteredExhibitions[currentExhibitionIndex]?.endDate
            ).toLocaleDateString()}
          </p>
        </section>
      )}
    </div>
  );
};

export default ExhibitionsList;
