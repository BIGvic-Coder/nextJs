export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { Suspense } from "react";
import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import Pagination from "@/app/ui/invoices/pagination";
import Table from "@/app/dashboard/invoices/table";
import { fetchFilteredInvoices, fetchInvoicesPages } from "@/app/lib/data";
import { InvoicesTable } from "@/app/lib/definitions"; // import the correct type

export default async function InvoicesPage() {
  // ✅ Explicit type for invoices
  let invoices: InvoicesTable[] = [];
  let totalPages = 1;

  try {
    [invoices, totalPages] = await Promise.all([
      fetchFilteredInvoices("", 1),
      fetchInvoicesPages(""),
    ]);
  } catch (err) {
    console.error("Failed to fetch invoices:", err);
    invoices = [];
    totalPages = 1;
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 p-4">
      <div className="flex w-full items-center justify-between mb-6">
        <h1 className={`${lusitana.className} text-3xl font-bold`}>Invoices</h1>
      </div>

      <Search placeholder="Search invoices..." />

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 mt-4">
        <Suspense fallback={<p>Loading invoices...</p>}>
          <Table query="" currentPage={1} invoices={invoices} />
        </Suspense>
      </div>

      <div className="mt-8 flex justify-center">
        <Pagination totalPages={totalPages} currentPage={1} />
      </div>
    </div>
  );
}
