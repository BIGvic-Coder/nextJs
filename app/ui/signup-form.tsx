"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) return setError(error.message);

    alert("Signup successful! Check your email to verify your account.");
    window.location.href = "/login";
  };

  return (
    <form
      onSubmit={handleSignup}
      className="w-full max-w-sm p-6 bg-white rounded-xl shadow-lg"
    >
      <h2 className="text-xl font-bold mb-4">Create Account</h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full mb-3 p-2 border rounded"
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full mb-3 p-2 border rounded"
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button className="w-full bg-green-600 text-white py-2 rounded mt-3">
        Sign Up
      </button>

      <a href="/login" className="text-blue-600 text-sm block mt-2">
        Already have an account?
      </a>
    </form>
  );
}
