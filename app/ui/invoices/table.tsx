import { fetchFilteredInvoices } from "@/app/lib/data";
import InvoiceStatus from "@/app/dashboard/invoices/status";

export default async function Table({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  // Fetch invoices directly on the server
  const invoices = await fetchFilteredInvoices(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-white p-2 md:pt-0">
          {invoices.length === 0 ? (
            <p className="text-sm text-gray-500">No invoices found.</p>
          ) : (
            invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="mb-2 flex items-center justify-between border-b border-gray-200 pb-2"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {invoice.name}
                  </p>
                  <p className="text-xs text-gray-500">{invoice.email}</p>
                </div>
                <InvoiceStatus status={invoice.status} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
