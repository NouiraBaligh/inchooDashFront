import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import CreatePromocode from "../components/CreatePromocode";
import UpdatePromocode from "../components/UpdatePromocode";
import { baseURL } from "../config/config";

const PromoCodes = () => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [showUpdatePromocode, setShowUpdatePromocode] = useState(false);
  const [selectedPromocodeId, setSelectedPromocodeId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [titleFilter, setTitleFilter] = useState("");
  const [percentageFilter, setPercentageFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const handleEditClick = (promocodeId) => {
    setSelectedPromocodeId(promocodeId);
    setShowUpdatePromocode(true);
  };

  const handleDeletePromocode = async (promocodeId) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer ce promocode ?",
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimez-le !",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${baseURL}/promocode/${promocodeId}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (response.ok) {
          Swal.fire("Supprimé !", "Votre promocode a été supprimé.", "success");
          setData((prevData) =>
            prevData.filter((promocode) => promocode._id !== promocodeId)
          );
        } else {
          Swal.fire(
            "Error",
            "There was an issue deleting the promocode.",
            "error"
          );
        }
      } catch (error) {
        Swal.fire(
          "Error",
          "An error occurred while deleting the promocode.",
          "error"
        );
      }
    }
  };

  const fetchPromocodes = async () => {
    try {
      setLoading(true); // Start loading
      const response = await fetch(`${baseURL}/promocode`, {
        credentials: "include",
      });
      const promocodes = await response.json();
      setData(promocodes);
    } catch (error) {
      console.error("Error fetching promocodes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromocodes();
  }, []);

  const handleCreatePromocode = async ({ title, pourcentage }) => {
    try {
      const response = await fetch(`${baseURL}/promocode`, {
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

  const filteredData = data.filter((promocode) => {
    const matchesTitle = promocode.title
      .toLowerCase()
      .includes(titleFilter.toLowerCase());
    const matchesPercentage = percentageFilter
      ? promocode.pourcentage.toString().includes(percentageFilter)
      : true;
    return matchesTitle && matchesPercentage;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

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
          <div className="flex flex-wrap gap-4 m-5">
            <input
              type="text"
              placeholder="Filtrer par Titre"
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Filtrer par Pourcentage"
              value={percentageFilter}
              onChange={(e) => setPercentageFilter(e.target.value)}
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
                          <div className="flex items-center">
                            {promocode.title}
                          </div>
                        </td>

                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          {promocode.pourcentage}
                        </td>

                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          <>
                            <FaEdit
                              className=" cursor-pointer m-4"
                              onClick={() => handleEditClick(promocode._id)}
                            />
                          </>
                        </td>
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          <>
                            <FaTrash
                              className="text-red-500 cursor-pointer m-4"
                              onClick={() =>
                                handleDeletePromocode(promocode._id)
                              }
                            />
                          </>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

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
