import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous errors
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      // Handle unsuccessful response
      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Invalid email or password");
      }

      // Handle successful response
      const data = await response.json();
      console.log("Full response:", data); // Log the full response

      // Correctly access the token from the response
      if (data.data && data.data.token) {
        localStorage.setItem("token", data.data.token); // Store token in localStorage
        onLogin(); // Notify parent component of successful login
        navigate("/home"); // Navigate to the home page
      } else {
        throw new Error("No token found in response");
      }
    } catch (err) {
      setError(err.message); // Display error message
    }
  };

  return (
    <div className="relative py-9 sm:max-w-xl sm:mx-auto">
      <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
        <div className="max-w-md mx-auto">
          <div className="flex items-center space-x-5 justify-center">
            <img
              src="/logoInchoo.png"
              alt="logo"
              className="w-[160px] inline"
            />
          </div>
          <form className="mt-5" onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-sm">{error}</p>}{" "}
            {/* Display error */}
            <label
              className="font-semibold text-sm text-gray-600 pb-1 block"
              htmlFor="login"
            >
              E-mail
            </label>
            <input
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              type="email"
              id="login"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label
              className="font-semibold text-sm text-gray-600 pb-1 block"
              htmlFor="password"
            >
              Mot de passe
            </label>
            <input
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              className="py-2 px-4 bg-[#d1b262] hover:bg-[#e6bc51] focus:ring-[#ffd978] focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
              type="submit"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
