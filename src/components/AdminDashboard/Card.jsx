import React from "react";
import { FaEdit, FaTrash, FaInfoCircle } from "react-icons/fa";

const Card = ({
  title,
  description,
  imageUrl,
  status,
  startDate,
  endDate,
  onEdit,
  onDelete,
  onDetails,
}) => {
  const formattedStartDate =
    startDate && startDate.toDate
      ? startDate.toDate().toLocaleDateString("he-IL")
      : startDate;

  const formattedEndDate =
    endDate && endDate.toDate
      ? endDate.toDate().toLocaleDateString("he-IL")
      : endDate;

  const statusColor =
    status === "פתוחה"
      ? "bg-green-100 text-green-700"
      : status === "סגורה"
      ? "bg-red-100 text-red-700"
      : "bg-gray-100 text-gray-600";

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-md overflow-hidden transform transition hover:scale-[1.01] hover:shadow-lg text-right font-sans flex flex-col">
      <div className="relative">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-52 object-cover object-center rounded-t-2xl"
        />
        <div
          className={`absolute top-3 right-3 px-3 py-1 text-sm rounded-full ${statusColor}`}
        >
          {status}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-grow">
        <h3 className="text-2xl font-bold text-pink-600">{title}</h3>
        <p className="text-gray-700 line-clamp-3">{description}</p>

        <div className="text-sm text-gray-500 space-y-1">
          <div>
            <span className="font-medium">תאריך התחלה:</span>{" "}
            {formattedStartDate}
          </div>
          <div>
            <span className="font-medium">תאריך סיום:</span> {formattedEndDate}
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center gap-2 text-sm">
          <button
            onClick={onDetails}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-800 hover:underline"
          >
            <FaInfoCircle />
            פרטים
          </button>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg flex items-center gap-1"
            >
              <FaEdit />
              עריכה
            </button>
            <button
              onClick={onDelete}
              className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-lg flex items-center gap-1"
            >
              <FaTrash />
              מחיקה
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
