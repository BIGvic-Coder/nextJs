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

export default async function Page(props: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  // ✅ Await searchParams for Next.js async route usage
  const searchParams = await props.searchParams;

  // ✅ Normalize query and page values safely
  const query = searchParams?.query?.trim() ?? "";
  const currentPageRaw = Number(searchParams?.page);
  const currentPage =
    Number.isFinite(currentPageRaw) && currentPageRaw > 0 ? currentPageRaw : 1;

  // ✅ Fetch invoices and total pages concurrently
  const [invoices, totalPages] = await Promise.all([
    fetchFilteredInvoices(query, currentPage),
    fetchInvoicesPages(query),
  ]);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6">
      {/* PAGE HEADER */}
      <div className="flex w-full items-center justify-between mb-6">
        <h1 className={`${lusitana.className} text-3xl font-bold`}>Invoices</h1>
      </div>

      {/* SEARCH INPUT */}
      <div className="mb-6">
        <Search placeholder="Search invoices..." />
      </div>

      {/* TABLE SECTION */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Suspense
          key={`${query}-${currentPage}`}
          fallback={
            <p className="text-center py-6 text-gray-500">
              Loading invoices...
            </p>
          }
        >
          <Table query={query} currentPage={currentPage} />
        </Suspense>
      </div>

      {/* PAGINATION */}
      <div className="mt-8 flex justify-center">
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}
