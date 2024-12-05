import { useState } from "react";
import { FaSignOutAlt, FaBars } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Menu = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation(); // Get the current route
  const navigate = useNavigate(); // To navigate to the login page after logout

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to check if the link is active
  const isActive = (path) => location.pathname === path;

  // Logout function
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");

    // Optionally, redirect to the login page after logout
    navigate("/"); // Adjust the path based on your login route
  };

  return (
    <div>
      {/* Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 bg-[#007bff] text-white p-2 rounded-full sm:hidden"
        onClick={toggleSidebar}
      >
        <FaBars size={20} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-[250px] bg-white shadow-xl transform transition-transform duration-300 z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 sm:static`}
      >
        <nav className="h-full flex flex-col py-6 font-[sans-serif] overflow-auto">
          <a href="javascript:void(0)" className="text-center">
            <img
              src="/logoInchoo.png"
              alt="logo"
              className="w-[160px] inline"
            />
          </a>

          <ul className="space-y-3 my-8 flex-1">
            <li>
              <Link
                to="/home"
                className={`text-sm flex items-center ${
                  isActive("/")
                    ? "text-[#007bff] bg-gray-100 border-r-[5px] border-[#077bff]"
                    : "text-black"
                } px-8 py-4 transition-all`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="w-[18px] h-[18px] mr-4"
                  viewBox="0 0 512 512"
                >
                  <path d="M122.39 165.78h244.87c10.49 0 19-8.51 19-19s-8.51-19-19-19H122.39c-10.49 0-19 8.51-19 19s8.51 19 19 19zm164.33 99.44c0-10.49-8.51-19-19-19H122.39c-10.49 0-19 8.51-19 19s8.51 19 19 19h145.33c10.49 0 19-8.51 19-19z" />
                </svg>
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className={`text-sm flex items-center ${
                  isActive("/products")
                    ? "text-[#007bff] bg-gray-100 border-r-[5px] border-[#077bff]"
                    : "text-black"
                } px-8 py-4 transition-all`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="w-[18px] h-[18px] mr-4"
                  viewBox="0 0 512 512"
                >
                  <path d="M197.332 170.668h-160C16.746 170.668 0 153.922 0 133.332v-96C0 16.746 16.746 0 37.332 0h160c20.59 0 37.336 16.746 37.336 37.332v96c0 20.59-16.746 37.336-37.336 37.336zM37.332 32A5.336 5.336 0 0 0 32 37.332v96a5.337 5.337 0 0 0 5.332 5.336h160a5.338 5.338 0 0 0 5.336-5.336v-96A5.337 5.337 0 0 0 197.332 32zm160 480h-160C16.746 512 0 495.254 0 474.668v-224c0-20.59 16.746-37.336 37.332-37.336h160c20.59 0 37.336 16.746 37.336 37.336v224c0 20.586-16.746 37.332-37.336 37.332zm-160-266.668A5.337 5.337 0 0 0 32 250.668v224A5.336 5.336 0 0 0 37.332 480h160a5.337 5.337 0 0 0 5.336-5.332v-224a5.338 5.338 0 0 0-5.336-5.336z" />
                </svg>
                <span>Produits</span>
              </Link>
            </li>
            <li>
              <Link
                to="/orders"
                className={`text-sm flex items-center ${
                  isActive("/orders")
                    ? "text-[#007bff] bg-gray-100 border-r-[5px] border-[#077bff]"
                    : "text-black"
                } px-8 py-4 transition-all`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="w-[18px] h-[18px] mr-4"
                  viewBox="0 0 511.414 511.414"
                >
                  <path
                    d="M497.695 108.838a16.002 16.002 0 0 0-9.92-14.8L261.787 1.2a16.003 16.003 0 0 0-12.16 0L23.639 94.038a16 16 0 0 0-9.92 14.8v293.738a16 16 0 0 0 9.92 14.8l225.988 92.838a15.947 15.947 0 0 0 12.14-.001c.193-.064-8.363 3.445 226.008-92.837a16 16 0 0 0 9.92-14.8zm-241.988 76.886-83.268-34.207L352.39 73.016l88.837 36.495zm-209.988-51.67 71.841 29.513v83.264c0 8.836 7.164 16 16 16s16-7.164 16-16v-70.118l90.147 37.033v257.797L45.719 391.851zM255.707 33.297l55.466 22.786-179.951 78.501-61.035-25.074zm16 180.449 193.988-79.692v257.797l-193.988 79.692z"
                    data-original="#000000"
                  />
                </svg>
                <span>Commandes</span>
              </Link>
            </li>
            <li>
              <Link
                to="/promocodes"
                className={`text-sm flex items-center ${
                  isActive("/promocodes")
                    ? "text-[#007bff] bg-gray-100 border-r-[5px] border-[#077bff]"
                    : "text-black"
                } px-8 py-4 transition-all`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="w-[18px] h-[18px] mr-4"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M13 .5H3A2.503 2.503 0 0 0 .5 3v10A2.503 2.503 0 0 0 3 15.5h10a2.503 2.503 0 0 0 2.5-2.5V3A2.503 2.503 0 0 0 13 .5ZM14.5 13a1.502 1.502 0 0 1-1.5 1.5H3A1.502 1.502 0 0 1 1.5 13v-.793l3.5-3.5 1.647 1.647a.5.5 0 0 0 .706 0L10.5 7.207V8a.5.5 0 0 0 1 0V6a.502.502 0 0 0-.5-.5H9a.5.5 0 0 0 0 1h.793L7 9.293 5.354 7.647a.5.5 0 0 0-.707 0L1.5 10.793V3A1.502 1.502 0 0 1 3 1.5h10A1.502 1.502 0 0 1 14.5 3Z"
                    data-original="#000000"
                  />
                </svg>
                <span>Promocodes</span>
              </Link>
            </li>
          </ul>

          <div className="flex flex-wrap items-center cursor-pointer border-t border-gray-300 px-4 py-4">
            <li
              className="flex items-center text-[20px] cursor-pointer mt-[20px] transition-colors duration-100"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-[15px] text-[#007bff]" />
              Déconnexion
            </li>
          </div>
        </nav>
      </div>

      {/* Overlay (for closing sidebar on click) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Menu;
