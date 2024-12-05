import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const Orders = () => {
  const [data, setData] = useState([]); // State for order data
  const [productsList, setProductsList] = useState([]); // State for all products
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [itemsPerPage] = useState(5); // Number of orders per page

  // Fetch orders and products from the API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersResponse = await fetch(
          "http://localhost:8000/api/v1/orders"
        );
        const orders = await ordersResponse.json();
        setData(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
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

  // Function to get the product name based on the product id
  const getProductNameById = (productId) => {
    const product = productsList.find((product) => product._id === productId);
    return product ? product.title : "Unknown Product";
  };

  // Calculate the index of the first and last items on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Function to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleDeleteOrder = async (orderId) => {
    // Show confirmation alert using SweetAlert2
    const result = await Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer cette commande ?",
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
          `http://localhost:8000/api/v1/orders/${orderId}`,
          {
            method: "DELETE",
            credentials: "include", // Ensure the cookie is sent with the request
          }
        );

        if (response.ok) {
          // Notify the user of successful deletion
          Swal.fire("Supprimé !", "Votre commande a été supprimé.", "success");

          setData((prevData) =>
            prevData.filter((order) => order._id !== orderId)
          );
        } else {
          // If the delete request fails
          Swal.fire("Error", "There was an issue deleting the order.", "error");
        }
      } catch (error) {
        // Handle any other errors
        Swal.fire(
          "Error",
          "An error occurred while deleting the order.",
          "error"
        );
      }
    }
  };
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <h1 className="text-lg font-bold ml-9">Commandes :</h1>
          <div className="relative text-gray-500 focus-within:text-gray-900 mb-4"></div>
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
                            Nom du produit: {getProductNameById(product.id)},
                            Prix: {product.price}, Quantité: {product.quantity}
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
                      {order.notes.length > 35 ? (
                        <>
                          {`${order.notes.slice(0, 35)}...`}

                          <button
                            onClick={() =>
                              Swal.fire({
                                title: "Note complète",
                                text: order.notes,
                                icon: "info",
                                confirmButtonText: "Close",
                              })
                            }
                            class="flex justify-center gap-2 items-center mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-[#604375] hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
                          >
                            Voir Note
                            <svg
                              class="w-8 h-8 justify-end group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45"
                              viewBox="0 0 16 19"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                                class="fill-gray-800 group-hover:fill-gray-800"
                              ></path>
                            </svg>
                          </button>
                        </>
                      ) : (
                        order.notes
                      )}
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
              Page {currentPage} of {Math.ceil(data.length / itemsPerPage)}
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
    </div>
  );
};

export default Orders;
