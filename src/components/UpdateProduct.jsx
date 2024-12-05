import React, { useState, useEffect } from "react";

function UpdateProduct({ onClose, productId, fetchProducts }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [inStock, setInStock] = useState(false);
  const [img, setImg] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [category, setCategory] = useState("");

  // Error states for validation
  const [errors, setErrors] = useState({});

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

  useEffect(() => {
    const fetchOneProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/products/${productId}`
        );
        const product = await response.json();

        if (response.ok) {
          setTitle(product.title);
          setDescription(product.description);
          setPrice(product.price);
          setInStock(product.inStock);
          setImg(product.img);
          setCategory(product.category); // Set category state
        } else {
          console.error("Failed to fetch product:", product.message);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (productId) fetchOneProduct();
  }, [productId]);

  // Function to update product
  const updateProduct = async () => {
    setErrors({}); // Clear previous errors
    let validationErrors = {};

    // Validate fields
    if (!title) validationErrors.title = "Tiitre est requis";
    if (!description) validationErrors.description = "Description est requis.";
    if (!price) validationErrors.price = "Prix est requis.";
    if (!imgFile && !img) validationErrors.imgFile = "Image est requis.";
    if (!category) validationErrors.category = "Catégorie est requis.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("inStock", inStock);
    formData.append("category", category); // Add category to form data

    if (imgFile) {
      formData.append("productImage", imgFile);
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/products/${productId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        const updatedProduct = await response.json();
        setImg(updatedProduct.img);
        onClose();
        fetchProducts();
      } else {
        console.error("Failed to update product:", await response.json());
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50">
      <div className="bg-white w-[400px] p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Modifier Produit</h2>
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

        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-2 w-full p-2 border"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}

        <textarea
          type="text"
          placeholder="Description"
          rows="5"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-2 w-full p-2 border"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}

        <input
          type="number"
          placeholder="Prix"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mb-2 w-full p-2 border"
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price}</p>
        )}
        {/* Category dropdown */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mb-2 w-full p-2 border"
        >
          <option value="">Sélectionnez une catégorie</option>
          <option value="Produits peau">Produits peau</option>
          <option value="Produits visage">Produits visage</option>
          <option value="Produits intimes">Produits intimes</option>
          <option value="Produits capillaires">Produits capillaires</option>
          <option value="Produits de rasage">Produits de rasage</option>
          <option value="Produits d'hygiène et de bien être">
            Produits d'hygiène et de bien être
          </option>
          <option value="Bakhour">Bakhour</option>
          <option value="Packs">Packs</option>
          <option value="Coffrets">Coffrets</option>
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category}</p>
        )}

        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="mr-2"
          />
          En Stock
        </label>

        <button onClick={updateProduct} className="bg-blue-500 text-white p-2">
          Modifier
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
}

export default UpdateProduct;
