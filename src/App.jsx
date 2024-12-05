import React, { useState, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import Menu from "./components/Menu";
import Home from "./pages/Home";
import Users from "./pages/Users";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import PromoCodes from "./pages/PromoCodes";
import Login from "./pages/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add a loading state

  // Check if the token exists in localStorage on page load
  useEffect(() => {
    const token = localStorage.getItem("token"); // Check for token in localStorage
    if (token) {
      setIsAuthenticated(true); // If token exists, set authenticated to true
    }
    setLoading(false); // After checking, set loading to false
  }, []);

  const Layout = () => {
    if (loading) {
      return (
        <div class="flex items-center justify-center min-h-screen">
          <div class="w-full gap-x-2 flex justify-center items-center">
            <div class="w-5 bg-[#d991c2] animate-pulse h-5 rounded-full animate-bounce"></div>
            <div class="w-5 animate-pulse h-5 bg-[#9869b8] rounded-full animate-bounce"></div>
            <div class="w-5 h-5 animate-pulse bg-[#6756cc] rounded-full animate-bounce"></div>
          </div>
        </div>
      ); // Display a loading state while checking authentication
    }

    if (!isAuthenticated) {
      return <Navigate to="/" replace />; // Redirect to login if not authenticated
    }

    return (
      <div className="flex h-screen">
        <div className="fixed top-0 left-0 z-10">
          <Menu />
        </div>
        <div className="flex-1 p-4 ml-0 sm:ml-[250px]">
          <Outlet />
        </div>
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login onLogin={() => setIsAuthenticated(true)} />,
    },
    {
      path: "/home",
      element: <Layout />,
      children: [
        { path: "", element: <Home /> }, // Default child for /home
      ],
    },
    {
      path: "/users",
      element: <Layout />,
      children: [{ path: "", element: <Users /> }],
    },
    {
      path: "/products",
      element: <Layout />,
      children: [{ path: "", element: <Products /> }],
    },
    {
      path: "/orders",
      element: <Layout />,
      children: [{ path: "", element: <Orders /> }],
    },
    {
      path: "/promocodes",
      element: <Layout />,
      children: [{ path: "", element: <PromoCodes /> }],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
