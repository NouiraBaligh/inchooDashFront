import React, { useState } from "react";

const CreateProduct = ({ show, onClose, onCreate }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [img, setImg] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [price, setPrice] = useState("");
  const [inStock, setInStock] = useState(true);
  const [category, setCategory] = useState(""); // Updated state for single category

  // Error states for validation
  const [errors, setErrors] = useState({});

  const handleCreate = async () => {
    // Clear previous errors
    setErrors({});

    // Check for empty fields
    let validationErrors = {};
    if (!title) validationErrors.title = "Tiitre est requis";
    if (!description) validationErrors.description = "Description est requis.";
    if (!price) validationErrors.price = "Prix est requis.";
    if (!imgFile) validationErrors.imgFile = "Image est requis."; // Image upload validation
    if (!category) validationErrors.category = "Catégorie est requis."; // Category validation

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Stop the function if there are validation errors
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", parseFloat(price));
    formData.append("inStock", inStock);
    formData.append("category", category); // Append the single category

    if (imgFile) {
      formData.append("productImage", imgFile);
    } else {
      formData.append("productImage", img);
    }

    await onCreate(formData);

    // Clear the form data after product creation
    setTitle("");
    setDescription("");
    setImg("");
    setImgFile(null);
    setPrice("");
    setInStock(true);
    setCategory("");
    onClose();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImgFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImg(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50">
      <div className="bg-white w-[400px] p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Créer Nouveau Produit</h2>
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

        {/* Image upload section */}
        <div className="mb-2 flex justify-center items-center">
          <label htmlFor="file-input" className="cursor-pointer">
            {img ? (
              <img
                src={img}
                alt="Product Preview"
                className="w-40 h-50 object-cover rounded-full"
              />
            ) : (
              <img
                src="/input-pictures.png"
                alt="Upload"
                className="w-40 h-50 object-cover rounded-full"
              />
            )}
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        {errors.imgFile && (
          <p className="text-red-500 text-sm m-1">{errors.imgFile}</p>
        )}

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

        {/* Description input */}
        <textarea
          type="text"
          placeholder="Description"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-2 w-full p-2 border"
        />
        {errors.description && (
          <p className="text-red-500 text-sm m-1">{errors.description}</p>
        )}

        {/* Price input */}
        <input
          type="number"
          placeholder="Prix"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mb-2 w-full p-2 border"
        />
        {errors.price && (
          <p className="text-red-500 m-1 text-sm">{errors.price}</p>
        )}

        {/* Category select input */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mb-2 w-full p-2 border"
        >
          <option value="">Sélectionnez une catégorie</option>
          <option value="SOINS DE PEAU">SOINS DE PEAU</option>
          <option value="SOINS DE VISAGE">SOINS DE VISAGE</option>
          <option value="SOINS CAPILLAIRES">SOINS CAPILLAIRES</option>
          <option value="PARFUMS MAISON">PARFUMS MAISON</option>
          <option value="PARFUMS CHEVEUX ET CORPS">
            PARFUMS CHEVEUX ET CORPS
          </option>
          <option value="PACKS">PACKS</option>
          <option value="ACCESOIRES">ACCESOIRES</option>
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm m-1">{errors.category}</p>
        )}

        {/* In stock checkbox */}
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="mr-2"
          />
          En Stock
        </label>

        {/* Action buttons */}
        <button onClick={handleCreate} className="bg-blue-500 text-white p-2">
          Créer Produit
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

export default CreateProduct;
