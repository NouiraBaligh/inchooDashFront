import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const Reviews = () => {
  const [data, setData] = useState([]); // State for order data
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [itemsPerPage] = useState(5); // Number of orders per page
  const [starFilter, setStarFilter] = useState(""); // Filter by stars
  const [productFilter, setProductFilter] = useState(""); // Filter by product name
  const [loading, setLoading] = useState(true);

  // Fetch reviews from the API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true); // Start loading
        const messagesResponse = await fetch(
          "http://localhost:8000/api/v1/products/rates"
        );
        const messages = await messagesResponse.json();
        setData(messages);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);
  const handleDeleteReview = async (reviewId) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer cette avis ?",
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
          `http://localhost:8000/api/v1/products/rates/${reviewId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (response.ok) {
          Swal.fire("Supprimé !", "Votre avis a été supprimé.", "success");
          setData((prevData) =>
            prevData.filter((review) => review._id !== reviewId)
          );
        } else {
          Swal.fire(
            "Error",
            "There was an issue deleting the review.",
            "error"
          );
        }
      } catch (error) {
        Swal.fire(
          "Error",
          "An error occurred while deleting the review.",
          "error"
        );
      }
    }
  };

  // Apply filters to the data
  const filteredData = data.filter((review) => {
    const matchesStars =
      starFilter === "" || review.note === parseInt(starFilter);
    const matchesProduct =
      productFilter === "" ||
      review.productName.toLowerCase().includes(productFilter.toLowerCase());

    return matchesStars && matchesProduct;
  });

  // Calculate the index of the first and last items on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Function to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col">
      {/* Filters Section */}
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <h1 className="text-lg font-bold ml-9">Avis :</h1>
          <div className="flex flex-wrap gap-4 m-5">
            {/* Star Filter */}
            <select
              value={starFilter}
              onChange={(e) => setStarFilter(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Note</option>
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>
                  {star} étoile{star > 1 ? "s" : ""}
                </option>
              ))}
            </select>

            {/* Product Name Filter */}
            <input
              type="text"
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              placeholder="Filtrer par Produit"
              className="border p-2 rounded"
            />
          </div>

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
                        Nom
                      </th>
                      <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                        Email
                      </th>
                      <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                        Avis
                      </th>
                      <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                        Note
                      </th>
                      <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                        Produit
                      </th>
                      <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                        Supprimer
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {currentItems.map((avis, index) => (
                      <tr
                        key={index}
                        className="bg-white transition-all duration-500 hover:bg-gray-50"
                      >
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          {avis.name}
                        </td>
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          {avis.email}
                        </td>
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          {avis.review.length > 35 ? (
                            <>
                              {`${avis.review.slice(0, 35)}...`}
                              <button
                                onClick={() =>
                                  Swal.fire({
                                    title: "avis complet",
                                    text: avis.review,
                                    icon: "info",
                                    confirmButtonText: "Fermer",
                                    confirmButtonColor: "#ad9b60",
                                  })
                                }
                                className="shadow-md text-[#ad9b60] hover:bg-[#faf0d2] font-medium text-sm px-3 py-1 border border-[#ad9b60] rounded transition"
                              >
                                Voir plus
                              </button>
                            </>
                          ) : (
                            avis.review
                          )}
                        </td>
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`h-4 w-4 ${
                                  i < avis.note
                                    ? "text-yellow-300"
                                    : "text-gray-300"
                                }`}
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                              </svg>
                            ))}
                          </div>
                        </td>
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          {avis.productName}
                        </td>
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          <>
                            <FaTrash
                              className="text-red-500 cursor-pointer m-4"
                              onClick={() => handleDeleteReview(avis._id)}
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

                <p className="text-gray-500">
                  Page {currentPage} de{" "}
                  {Math.ceil(filteredData.length / itemsPerPage)}
                </p>

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
    </div>
  );
};

export default Reviews;
