"use client";
import { supabase } from "@/app/lib/supabaseClient";

export default function Sidebar() {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <aside className="w-64 bg-blue-600 text-white flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 px-6 py-4 text-2xl font-bold">
          🌐 <span>Acme</span>
        </div>

        <nav className="mt-6 space-y-2 px-3">
          <a
            href="/dashboard"
            className="block rounded-lg px-4 py-2 hover:bg-blue-500"
          >
            Home
          </a>
          <a
            href="/dashboard/invoices"
            className="block rounded-lg px-4 py-2 hover:bg-blue-500"
          >
            Invoices
          </a>
          <a
            href="/dashboard/customers"
            className="block rounded-lg px-4 py-2 hover:bg-blue-500"
          >
            Customers
          </a>
        </nav>
      </div>

      <div className="p-4 border-t border-blue-500">
        <button
          onClick={handleSignOut}
          className="w-full rounded-md bg-blue-700 px-4 py-2 hover:bg-blue-800 transition"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
