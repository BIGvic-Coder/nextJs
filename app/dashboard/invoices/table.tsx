// app/dashboard/invoices/table.tsx

import { fetchFilteredInvoices } from "@/app/lib/data";
import InvoiceStatus from "@/app/dashboard/invoices/status";

interface Invoice {
  id: string;
  name: string;
  email: string;
  amount: number;
  date: string;
  status: string;
}

export default async function Table({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  // Let TypeScript infer the DB type
  const invoices = await fetchFilteredInvoices(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-white p-2 md:pt-0">
          {invoices.length === 0 ? (
            <p className="text-sm text-gray-500 p-4">No invoices found.</p>
          ) : (
            invoices.map((invoice: Invoice) => (
              <div
                key={invoice.id}
                className="mb-2 flex items-center justify-between border-b border-gray-200 pb-2"
              >
                <div>
                  {/* Display Customer Name & Email */}
                  <p className="font-medium">{invoice.name}</p>
                  <p className="text-sm text-gray-500">{invoice.email}</p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">${invoice.amount}</p>
                  <p className="text-xs text-gray-500">{invoice.date}</p>
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
