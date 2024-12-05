import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import CreatePromocode from "../components/CreatePromocode";
import UpdatePromocode from "../components/UpdatePromocode";

const PromoCodes = () => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [showUpdatePromocode, setShowUpdatePromocode] = useState(false);
  const [selectedPromocodeId, setSelectedPromocodeId] = useState(null); // State for storing promocode ID
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [itemsPerPage] = useState(5); // Number of orders per page

  const handleEditClick = (promocodeId) => {
    setSelectedPromocodeId(promocodeId); // Set the selected promocode ID
    setShowUpdatePromocode(true); // Show the UpdatePromocode component
  };
  const handleDeletePromocode = async (promocodeId) => {
    // Show confirmation alert using SweetAlert2
    const result = await Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer ce promocode ?",
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
          `http://localhost:8000/api/v1/promocode/${promocodeId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (response.ok) {
          // Notify the user of successful deletion
          Swal.fire("Supprimé !", "Votre promocode a été supprimé.", "success");

          setData((prevData) =>
            prevData.filter((promocode) => promocode._id !== promocodeId)
          );
        } else {
          // If the delete request fails
          Swal.fire(
            "Error",
            "There was an issue deleting the promocode.",
            "error"
          );
        }
      } catch (error) {
        // Handle any other errors
        Swal.fire(
          "Error",
          "An error occurred while deleting the promocode.",
          "error"
        );
      }
    }
  };

  // Define fetch function separately
  const fetchPromocodes = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/promocode", {
        credentials: "include",
      }); // Adjust endpoint and port as needed
      const promocodes = await response.json();
      setData(promocodes);
    } catch (error) {
      console.error("Error fetching promocodes:", error);
    }
  };

  // Call fetchPromocodes in useEffect
  useEffect(() => {
    fetchPromocodes();
  }, []);

  const handleCreatePromocode = async ({ title, pourcentage }) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/promocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, pourcentage }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create promocode.");
      }

      const result = await response.json();
      return {
        success: true,
        message: result.message,
        promocode: result.promocode,
      };
    } catch (error) {
      console.error("Error creating promocode:", error);
      return { success: false, message: error.message };
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
            <h1 className="text-lg font-bold  ml-9">Promocodes :</h1>
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
                    promocodes
                  </th>
                  <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                    pourcentage
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
                {currentItems.map((promocode, index) => (
                  <tr
                    key={index}
                    className="bg-white transition-all duration-500 hover:bg-gray-50"
                  >
                    <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                      <div className="flex items-center">{promocode.title}</div>
                    </td>

                    <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                      {promocode.pourcentage}
                    </td>

                    <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                      <>
                        <FaEdit
                          className=" cursor-pointer m-4"
                          onClick={() => handleEditClick(promocode._id)} // Pass the promocode ID
                        />
                      </>
                    </td>
                    <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                      <>
                        <FaTrash
                          className="text-red-500 cursor-pointer m-4"
                          onClick={() => handleDeletePromocode(promocode._id)}
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
      {show && (
        <CreatePromocode
          show={show}
          onClose={() => setShow(false)}
          onCreate={handleCreatePromocode}
          fetchPromocodes={fetchPromocodes}
        />
      )}
      {showUpdatePromocode && (
        <UpdatePromocode
          promocodeId={selectedPromocodeId}
          onClose={() => setShowUpdatePromocode(false)}
          fetchPromocodes={fetchPromocodes}
        />
      )}
    </div>
  );
};

export default PromoCodes;
