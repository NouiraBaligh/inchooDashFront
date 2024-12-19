import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const Messages = () => {
  const [data, setData] = useState([]); // State for message data
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [itemsPerPage] = useState(5); // Number of messages per page
  const [filterEmail, setFilterEmail] = useState(""); // State for email filter
  const [loading, setLoading] = useState(true);

  // Fetch messages from the API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true); // Start loading
        const messagesResponse = await fetch(
          "http://localhost:8000/api/v1/users/messages"
        );
        const messages = await messagesResponse.json();
        setData(messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);
  const handleDeleteMessage = async (msgId) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer cette message ?",
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
          `http://localhost:8000/api/v1/users/messages/${msgId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (response.ok) {
          Swal.fire("Supprimé !", "Votre message a été supprimé.", "success");
          setData((prevData) => prevData.filter((msg) => msg._id !== msgId));
        } else {
          Swal.fire(
            "Error",
            "There was an issue deleting the message.",
            "error"
          );
        }
      } catch (error) {
        Swal.fire(
          "Error",
          "An error occurred while deleting the message.",
          "error"
        );
      }
    }
  };
  // Filter messages by email
  const filteredData = data.filter((msg) =>
    msg.email.toLowerCase().includes(filterEmail.toLowerCase())
  );

  // Calculate the index of the first and last items on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Function to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <h1 className="text-lg font-bold ml-9">Messages :</h1>
          <div className="flex flex-wrap gap-4 m-5">
            <input
              type="text"
              placeholder="Filtrer par email"
              value={filterEmail}
              onChange={(e) => setFilterEmail(e.target.value)}
              className="border p-2 rounded "
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
                        Email
                      </th>
                      <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                        Sujet
                      </th>
                      <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                        Contenu
                      </th>
                      <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                        Supprimer
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {currentItems.map((msg, index) => (
                      <tr
                        key={index}
                        className="bg-white transition-all duration-500 hover:bg-gray-50"
                      >
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          {msg.email}
                        </td>
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          {msg.sujet}
                        </td>

                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          <div className="flex items-center gap-2">
                            {msg.message.length > 35 ? (
                              <>
                                {`${msg.message.slice(0, 35)}...`}
                                <button
                                  onClick={() =>
                                    Swal.fire({
                                      title: "Message complet",
                                      text: msg.message,
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
                              msg.message
                            )}
                          </div>
                        </td>
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          <>
                            <FaTrash
                              className="text-red-500 cursor-pointer m-4"
                              onClick={() => handleDeleteMessage(msg._id)}
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
    </div>
  );
};

export default Messages;
