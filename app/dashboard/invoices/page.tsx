// app/dashboard/invoices/page.tsx
import { Suspense } from "react";
import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import Pagination from "@/app/ui/invoices/pagination";
import Table from "@/app/ui/invoices/table";
import { fetchFilteredInvoices, fetchInvoicesPages } from "@/app/lib/data";

export const metadata = {
  title: "Invoices",
};

export default async function InvoicesPage(props: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  // ✅ Await searchParams before using it
  const searchParams = await props.searchParams;

  // ✅ Normalize query
  const query = searchParams?.query?.trim() ?? "";

  // ✅ Normalize page
  const pageRaw = Number(searchParams?.page);
  const currentPage = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  // ✅ Fetch invoices and total pages concurrently
  const [invoices, totalPages] = await Promise.all([
    fetchFilteredInvoices(query, currentPage),
    fetchInvoicesPages(query),
  ]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* PAGE HEADER */}
      <div className="flex w-full items-center justify-between mb-6">
        <h1 className={`${lusitana.className} text-3xl font-bold`}>Invoices</h1>
      </div>

      {/* SEARCH INPUT */}
      <div className="mb-6">
        <Search placeholder="Search invoices..." />
      </div>

      {/* TABLE SECTION */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4">
        <Suspense
          key={`${query}-${currentPage}`}
          fallback={<p className="text-center py-6">Loading invoices...</p>}
        >
          <Table query={query} currentPage={currentPage} />
        </Suspense>
      </div>

      {/* PAGINATION */}
      <div className="mt-8 flex justify-center">
        {/* 👇 FIXED: Added currentPage */}
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}
