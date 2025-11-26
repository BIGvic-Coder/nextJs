export const runtime = "nodejs"; // ✅ Node runtime for Vercel

import { Suspense } from "react";
import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import Pagination from "@/app/ui/invoices/pagination";
import Table from "@/app/ui/invoices/table";
import { fetchFilteredInvoices, fetchInvoicesPages } from "@/app/lib/data";

export default async function InvoicesPage(props: {
  searchParams?: Promise<Record<string, string | string[]>>;
}) {
  // Await the promise so Vercel can handle server-side runtime
  const resolved = await props.searchParams;

  const queryRaw = resolved?.query;
  const pageRaw = resolved?.page;

  const query = Array.isArray(queryRaw) ? queryRaw[0] : queryRaw ?? "";

  const pageNum = Number(Array.isArray(pageRaw) ? pageRaw[0] : pageRaw);
  const currentPage = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;

  const [invoices, totalPages] = await Promise.all([
    fetchFilteredInvoices(query, currentPage),
    fetchInvoicesPages(query),
  ]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex w-full items-center justify-between mb-6">
        <h1 className={`${lusitana.className} text-3xl font-bold`}>Invoices</h1>
      </div>

      <Search placeholder="Search invoices..." />

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 mt-4">
        <Suspense key={`${query}-${currentPage}`} fallback={<p>Loading...</p>}>
          <Table query={query} currentPage={currentPage} />
        </Suspense>
      </div>

      <div className="mt-8 flex justify-center">
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}
