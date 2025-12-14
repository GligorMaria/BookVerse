import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase/firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import SignInWithGoogle from "../Components/SignInWithGoogle.jsx";

function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-96 p-6 shadow-lg bg-white rounded-md">
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl text-center font-semibold mb-4">Log In</h2>

          <label className="block text-base mb-2">
            Email:
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter email address"
              className="border w-full text-base px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="block text-base mb-2">
            Password:
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
              className="border w-full text-base px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <button
            type="submit"
            className="w-full mt-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Log In
          </button>

          <div className="mt-4">
            <SignInWithGoogle />
          </div>

          <p className="mt-3 text-sm text-center">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LogIn;
