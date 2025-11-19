"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabaseclient";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    // redirect after login
    window.location.href = "/dashboard";
  }

  return (
    <form
      onSubmit={handleLogin}
      className="w-full max-w-sm mx-auto mt-10 p-6 bg-white shadow-md rounded"
    >
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        className="w-full border p-2 rounded mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full border p-2 rounded mb-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Login
      </button>

      <a href="/signup" className="text-blue-600 text-sm block mt-3">
        Create an account
      </a>
    </form>
  );
}
