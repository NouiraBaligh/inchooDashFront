import React, { useState } from "react";

const CreatePromocode = ({ show, onClose, onCreate, fetchPromocodes }) => {
  const [title, setTitle] = useState("");
  const [pourcentage, setPourcentage] = useState("");

  // Error states for validation
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleCreate = async (e) => {
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
      const result = await onCreate({ title, pourcentage });
      setMessage(result.message); // Success message from API
      if (result.success) {
        setTitle("");
        setPourcentage("");
        onClose();
        fetchPromocodes();
      }
    } catch (error) {
      setMessage(error.message); // Error message
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50">
      <div className="bg-white w-[400px] p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Créer PromoCode</h2>
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

        <input
          type="number"
          placeholder="Pourcentage"
          value={pourcentage}
          onChange={(e) => setPourcentage(e.target.value)}
          className="mb-2 w-full p-2 border"
        />
        {errors.title && (
          <p className="text-red-500 m-1 text-sm">{errors.pourcentage}</p>
        )}

        {/* Action buttons */}
        <button onClick={handleCreate} className="bg-blue-500 text-white p-2">
          Créer
        </button>
        <button
          onClick={onClose}
          className="border border-red-500 bg-red-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-red-600 focus:outline-none focus:shadow-outline"
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

export default CreatePromocode;
