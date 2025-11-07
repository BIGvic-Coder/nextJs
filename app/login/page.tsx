"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("✅ Logged in successfully!");
      // Optional redirect after login
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    }
  };

  // ✅ Handle signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage(
        "✅ Signup successful! Please check your email to verify your account."
      );
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        Log in or Sign up to Acme
      </h1>

      <form className="flex flex-col gap-4 w-full max-w-sm bg-white p-8 rounded-lg shadow">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2"
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-500 text-sm">{message}</p>}

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={handleLogin}
            className="rounded-md bg-blue-500 px-4 py-2 text-white font-semibold hover:bg-blue-400"
          >
            Log In
          </button>

          <button
            type="button"
            onClick={handleSignup}
            className="rounded-md bg-green-500 px-4 py-2 text-white font-semibold hover:bg-green-400"
          >
            Sign Up
          </button>
        </div>
      </form>
    </main>
  );
}
