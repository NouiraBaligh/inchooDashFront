import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const Orders = () => {
  const [data, setData] = useState([]); // State for order data
  const [productsList, setProductsList] = useState([]); // State for all products
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [itemsPerPage] = useState(5); // Number of orders per page
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    maxPrice: "",
    city: "",
    product: "",
  }); // State for filters

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true); // Start loading
        const ordersResponse = await fetch(
          "http://localhost:8000/api/v1/orders"
        );
        const orders = await ordersResponse.json();
        setData(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const productsResponse = await fetch(
          "http://localhost:8000/api/v1/products",
          {
            credentials: "include",
          }
        );
        const products = await productsResponse.json();
        setProductsList(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchOrders();
    fetchProducts();
  }, []);

  const getProductNameById = (productId) => {
    const product = productsList.find((product) => product._id === productId);
    return product ? product.title : "Unknown Product";
  };

  const handleDeleteOrder = async (orderId) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer cette commande ?",
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimez-le !",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/orders/${orderId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (response.ok) {
          Swal.fire("Supprimé !", "Votre commande a été supprimée.", "success");
          setData((prevData) =>
            prevData.filter((order) => order._id !== orderId)
          );
        } else {
          Swal.fire("Error", "There was an issue deleting the order.", "error");
        }
      } catch (error) {
        Swal.fire(
          "Error",
          "An error occurred while deleting the order.",
          "error"
        );
      }
    }
  };

  // Filter logic
  const filteredData = data.filter((order) => {
    const matchesPrice =
      filters.maxPrice === "" ||
      order.totalPrice <= parseFloat(filters.maxPrice);
    const matchesCity =
      filters.city === "" ||
      order.city.toLowerCase().includes(filters.city.toLowerCase());
    const matchesProduct =
      filters.product === "" ||
      order.products.some((product) =>
        getProductNameById(product.id)
          .toLowerCase()
          .includes(filters.product.toLowerCase())
      );

    return matchesPrice && matchesCity && matchesProduct;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <h1 className="text-lg font-bold ml-9">Commandes :</h1>
          {/* Filter Section */}
          <div className="flex space-x-4 p-4">
            <input
              type="number"
              placeholder="Prix maximum"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: e.target.value })
              }
              className="border p-2 rounded"
            />
            <select
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="">Villes</option>
              <option value="Tunis">Tunis</option>
              <option value="Sfax">Sfax</option>
              <option value="Sousse">Sousse</option>
              <option value="Kairouan">Kairouan</option>{" "}
              <option value="Bizerte">Bizerte</option>
              <option value="Gabès">Gabès</option>
              <option value="Ariana">Ariana</option>
              <option value="Gafsa">Gafsa</option>
              <option value="Monastir">Monastir</option>
              <option value="Nabeul">Nabeul</option>
              <option value="Mahdia">Mahdia</option>
              <option value="Ben Arous">Ben Arous</option>
              <option value="Kasserine">Kasserine</option>
              <option value="Médenine">Médenine</option>
              <option value="Kebili">Kebili</option>
              <option value="Tozeur">Tozeur</option>
              <option value="Siliana">Siliana</option>
              <option value="Zaghouan">Zaghouan</option>
              <option value="Jendouba">Jendouba</option>
              <option value="Béja">Béja</option>
              <option value="Le Kef">Le Kef</option>
              <option value="Sidi Bouzid">Sidi Bouzid</option>
              <option value="Tataouine">Tataouine</option>
              <option value="Manouba">Manouba</option>
            </select>

            <input
              type="text"
              placeholder="Produit du commande"
              value={filters.product}
              onChange={(e) =>
                setFilters({ ...filters, product: e.target.value })
              }
              className="border p-2 rounded"
            />
          </div>{" "}
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
                        Prénom
                      </th>
                      <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                        Nom
                      </th>
                      <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                        Commandes
                      </th>
                      <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                        Prix total
                      </th>
                      <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                        Téléphone
                      </th>
                      <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                        Deuxième téléphone
                      </th>
                      <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                        Email
                      </th>
                      <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                        Ville
                      </th>
                      <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                        Adresse
                      </th>
                      <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                        Notes
                      </th>
                      <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                        Supprimer
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {currentItems.map((order, index) => (
                      <tr
                        key={index}
                        className="bg-white transition-all duration-500 hover:bg-gray-50"
                      >
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          {order.name}
                        </td>
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          {order.prename}
                        </td>
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          {order.products.map((product, index) => (
                            <div key={index}>
                              <span>
                                Nom du produit: {getProductNameById(product.id)}
                                , Prix: {product.price}, Quantité:{" "}
                                {product.quantity}
                              </span>
                            </div>
                          ))}
                        </td>
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          {order.totalPrice}
                        </td>
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          {order.phone}
                        </td>
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          {order.secondPhone}
                        </td>
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          {order.email}
                        </td>
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          {order.city}
                        </td>
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          {order.adresse}
                        </td>
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          <div className="flex items-center gap-2">
                            {order.notes.length > 35 ? (
                              <>
                                {`${order.notes.slice(0, 35)}...`}

                                <button
                                  onClick={() =>
                                    Swal.fire({
                                      title: "Note complète",
                                      text: order.notes,
                                      icon: "info",
                                      confirmButtonText: "Fermer",
                                    })
                                  }
                                  className="shadow-md text-[#ad9b60] hover:bg-[#faf0d2] font-medium text-sm px-3 py-1 border border-[#ad9b60] rounded transition"
                                >
                                  Voir Note
                                </button>
                              </>
                            ) : (
                              order.notes
                            )}
                          </div>
                        </td>
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          <>
                            <FaTrash
                              className="text-red-500 cursor-pointer m-4"
                              onClick={() => handleDeleteOrder(order._id)}
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
              </nav>{" "}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
