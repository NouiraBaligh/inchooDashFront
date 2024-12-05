import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import CreateProduct from "../components/CreateProduct";
import Swal from "sweetalert2";
import UpdateProduct from "../components/UpdateProduct";

const Products = () => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [showUpdateProduct, setShowUpdateProduct] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null); // State for storing product ID
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [itemsPerPage] = useState(5); // Number of orders per page

  const handleEditClick = (productId) => {
    setSelectedProductId(productId); // Set the selected product ID
    setShowUpdateProduct(true); // Show the UpdateProduct component
  };
  const handleDeleteProduct = async (productId) => {
    // Show confirmation alert using SweetAlert2
    const result = await Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer ce produit ?",
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimez-le !",
    });

    // If the user confirms the deletion
    if (result.isConfirmed) {
      try {
        // Send the delete request to the API
        const response = await fetch(
          `http://localhost:8000/api/v1/products/${productId}`,
          {
            method: "DELETE",
            credentials: "include", // Ensure the cookie is sent with the request
          }
        );

        if (response.ok) {
          // Notify the user of successful deletion
          Swal.fire("Supprimé !", "Votre produit a été supprimé.", "success");

          // Remove the deleted product from the state without re-fetching all products
          setData((prevData) =>
            prevData.filter((product) => product._id !== productId)
          );
        } else {
          // If the delete request fails
          Swal.fire(
            "Error",
            "There was an issue deleting the product.",
            "error"
          );
        }
      } catch (error) {
        // Handle any other errors
        Swal.fire(
          "Error",
          "An error occurred while deleting the product.",
          "error"
        );
      }
    }
  };
  // Define fetch function separately
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/products", {
        credentials: "include",
      }); // Adjust endpoint and port as needed
      const products = await response.json();
      setData(products); // Update state with fetched product data
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Call fetchProducts in useEffect
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (formData) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/products", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const result = await response.json();

      if (result.product && result.product._id) {
        // Update the state with the new product without re-fetching all products
        setData((prevData) => [...prevData, result.product]);
      } else {
        console.error("Product created but _id is missing:", result);
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Function to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold  ml-9">Produits :</h1>
            <button
              onClick={() => setShow(true)}
              className="bg-[#1e1e1e] px-4 py-2 font-semibold text-white rounded hover:bg-gray-800"
            >
              Créer
            </button>
          </div>
          <div className="relative text-gray-500 focus-within:text-gray-900 mb-4"></div>
          <div className="overflow-hidden">
            <table className="min-w-full rounded-xl">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                    Produits
                  </th>
                  <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                    Description
                  </th>
                  <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                    prix
                  </th>
                  <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                    En stock
                  </th>
                  <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                    Modifier
                  </th>
                  <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                    Supprimer
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {currentItems.map((product, index) => (
                  <tr
                    key={index}
                    className="bg-white transition-all duration-500 hover:bg-gray-50"
                  >
                    <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                      <div className="flex items-center">
                        <img
                          className="h-12 w-12 rounded-full object-cover mr-2"
                          src={`http://localhost:3000/products_images/${
                            product.img.split("/")[2]
                          }`}
                          alt=""
                          height="100px"
                          width="100px"
                        />

                        <span className="">{product.title}</span>
                      </div>
                    </td>
                    <td className="p-9 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                      {product.description.length > 45
                        ? `${product.description.slice(0, 45)}...`
                        : product.description}
                    </td>

                    <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                      {product.price}
                    </td>
                    <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                      {product.inStock ? (
                        <span className="text-green-500">✔️</span>
                      ) : (
                        <span className="text-red-500">❌</span>
                      )}
                    </td>
                    <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                      <>
                        <FaEdit
                          className=" cursor-pointer m-4"
                          onClick={() => handleEditClick(product._id)} // Pass the product ID
                        />
                      </>
                    </td>
                    <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                      <>
                        <FaTrash
                          className="text-red-500 cursor-pointer m-4"
                          onClick={() => handleDeleteProduct(product._id)}
                        />
                      </>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <nav className="inline-flex items-center p-1 rounded bg-white space-x-2">
            {/* Previous Button */}
            <button
              className={`p-1 rounded border text-black bg-white ${
                currentPage === 1
                  ? "cursor-not-allowed opacity-50"
                  : "hover:text-white hover:bg-blue-600 hover:border-blue-600"
              }`}
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                />
              </svg>
            </button>

            {/* Current Page Indicator */}
            <p className="text-gray-500">
              Page {currentPage} de {Math.ceil(data.length / itemsPerPage)}
            </p>

            {/* Next Button */}
            <button
              className={`p-1 rounded border text-black bg-white ${
                indexOfLastItem >= data.length
                  ? "cursor-not-allowed opacity-50"
                  : "hover:text-white hover:bg-blue-600 hover:border-blue-600"
              }`}
              onClick={() =>
                indexOfLastItem < data.length && paginate(currentPage + 1)
              }
              disabled={indexOfLastItem >= data.length}
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
      <CreateProduct
        show={show}
        onClose={() => setShow(false)}
        onCreate={handleCreateProduct}
      />
      {showUpdateProduct && (
        <UpdateProduct
          productId={selectedProductId}
          onClose={() => setShowUpdateProduct(false)}
          fetchProducts={fetchProducts}
        />
      )}
    </div>
  );
};

export default Products;
