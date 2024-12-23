import React, { useState, useEffect } from "react";
import { baseURL } from "../config/config";

const UpdatePromocode = ({ promocodeId, onClose, fetchPromocodes }) => {
  const [title, setTitle] = useState("");
  const [pourcentage, setPourcentage] = useState("");

  // Error states for validation
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchOnePromocode = async () => {
      try {
        const response = await fetch(`${baseURL}/promocode/${promocodeId}`);
        const promocode = await response.json();

        if (response.ok) {
          setTitle(promocode.title);
          setPourcentage(promocode.pourcentage);
        } else {
          console.error("Failed to fetch promocode:", promocode.message);
        }
      } catch (error) {
        console.error("Error fetching promocode:", error);
      }
    };

    if (promocodeId) fetchOnePromocode();
  }, [promocodeId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrors({}); // Reset errors
    setMessage(""); // Reset the message

    const newErrors = {};
    if (!title) newErrors.title = "Titre est requis.";
    if (!pourcentage || isNaN(pourcentage)) {
      newErrors.pourcentage = "Un pourcentage valide est requis.";
    } else if (pourcentage < 1 || pourcentage > 100) {
      newErrors.pourcentage =
        "Le pourcentage doit être compris entre 1 et 100.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Make the API request to update the promocode
      const response = await fetch(`${baseURL}/promocode/${promocodeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, pourcentage }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message); // Success message from API
        setTitle(""); // Clear form fields
        setPourcentage(""); // Clear form fields
        onClose(); // Close modal
        fetchPromocodes(); // Refresh the list of promocodes
      } else {
        setMessage(result.message || "Failed to update promocode.");
      }
    } catch (error) {
      setMessage(error.message || "Failed to update promocode.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50">
      <div className="bg-white w-[400px] p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Modifier PromoCode</h2>
        <button
          onClick={onClose}
          className="absolute m-4 p-1 bg-gray-100 border border-gray-300 rounded-full -top-1 -right-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {/* Title input */}
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-2 w-full p-2 border"
        />
        {errors.title && (
          <p className="text-red-500 m-1 text-sm">{errors.title}</p>
        )}
        {/* Percentage input */}
        <input
          type="number"
          placeholder="Pourcentage"
          value={pourcentage}
          onChange={(e) => setPourcentage(e.target.value)}
          className="mb-2 w-full p-2 border"
        />
        {errors.pourcentage && (
          <p className="text-red-500 m-1 text-sm">{errors.pourcentage}</p>
        )}
        {/* Success or error message */}
        {message && (
          <p
            className={`text-sm ${
              message.includes("success") ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
        {/* Action buttons */}
        <button onClick={handleUpdate} className="bg-blue-500 text-white p-2">
          Modifier
        </button>
        <button
          onClick={onClose}
          className="border border-red-500 bg-red-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-red-600 focus:outline-none focus:shadow-outline"
        >
          Annuler
        </button>{" "}
      </div>
    </div>
  );
};

export default UpdatePromocode;
