import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import CreateProduct from "../components/CreateProduct";
import Swal from "sweetalert2";
import UpdateProduct from "../components/UpdateProduct";
import { baseURL, URLImg } from "../config/config";

const Products = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [inStockFilter, setInStockFilter] = useState("");
  const [show, setShow] = useState(false);
  const [showUpdateProduct, setShowUpdateProduct] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  const handleEditClick = (productId) => {
    setSelectedProductId(productId);
    setShowUpdateProduct(true);
  };

  const handleDeleteProduct = async (productId) => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete this product?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${baseURL}/products/${productId}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (response.ok) {
          Swal.fire("Deleted!", "Your product has been deleted.", "success");
          setData((prevData) =>
            prevData.filter((product) => product._id !== productId)
          );
        } else {
          Swal.fire("Error", "Failed to delete the product.", "error");
        }
      } catch (error) {
        Swal.fire(
          "Error",
          "An error occurred while deleting the product.",
          "error"
        );
      }
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true); // Start loading
      const response = await fetch(`${baseURL}/products`, {
        credentials: "include",
      });
      const products = await response.json();
      setData(products);
      setFilteredData(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = data;
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (priceFilter) {
      const maxPrice = parseFloat(priceFilter);
      if (!isNaN(maxPrice)) {
        filtered = filtered.filter((product) => {
          return product.price <= maxPrice;
        });
      }
    }
    if (inStockFilter) {
      filtered = filtered.filter((product) =>
        inStockFilter === "true" ? product.inStock : !product.inStock
      );
    }

    setFilteredData(filtered);
  }, [searchTerm, priceFilter, inStockFilter, data]);

  const handleCreateProduct = async (formData) => {
    try {
      const response = await fetch(`${baseURL}/products`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const result = await response.json();

      if (result.product && result.product._id) {
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
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold ml-9">Produits :</h1>
            <button
              onClick={() => setShow(true)}
              className="bg-[#1e1e1e] px-4 py-2 font-semibold text-white rounded hover:bg-gray-800"
            >
              Créer
            </button>
          </div>
          {/* Filters */}
          <div className="flex gap-4 mb-4 px-9">
            <input
              type="text"
              placeholder="Filtrer par produit"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 rounded w-1/3"
            />
            <input
              type="number"
              placeholder="Prix ​​maximum"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="border p-2 rounded w-1/3"
            />
            <select
              value={inStockFilter}
              onChange={(e) => setInStockFilter(e.target.value)}
              className="border p-2 rounded w-1/3"
            >
              <option value="">Tous</option>
              <option value="true">En Stock</option>
              <option value="false">En rupture de stock</option>
            </select>
          </div>
          <div className="relative text-gray-500 focus-within:text-gray-900 mb-4"></div>
          {/* Show "No data available" if there are no filtered items */}
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="flex flex-row gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
                <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.3s]"></div>
                <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
              </div>
            </div>
          ) : filteredData.length === 0 ? (
            <p className="text-center text-red-500">Aucune donnée disponible</p>
          ) : (
            <>
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
                              src={`${URLImg}/products_images/${
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
                  Page {currentPage} de{" "}
                  {Math.ceil(filteredData.length / itemsPerPage)}
                </p>

                {/* Next Button */}
                <button
                  className={`p-1 rounded border text-black bg-white ${
                    indexOfLastItem >= filteredData.length
                      ? "cursor-not-allowed opacity-50"
                      : "hover:text-white hover:bg-blue-600 hover:border-blue-600"
                  }`}
                  onClick={() =>
                    indexOfLastItem < filteredData.length &&
                    paginate(currentPage + 1)
                  }
                  disabled={indexOfLastItem >= filteredData.length}
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
            </>
          )}
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
