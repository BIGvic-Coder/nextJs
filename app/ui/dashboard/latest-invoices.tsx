"use client";

import Image from "next/image";
import { formatCurrency, formatDateToLocal } from "@/app/lib/utils";
import { lusitana } from "@/app/ui/fonts";

type LatestInvoice = {
  id: string;
  amount: number;
  name: string;
  email: string;
  image_url: string;
  date: string;
};

export default function LatestInvoices({
  latestInvoices,
}: {
  latestInvoices?: LatestInvoice[]; // ← optional and safe
}) {
  // ✅ Guard against undefined
  if (!latestInvoices || latestInvoices.length === 0) {
    return (
      <div className="col-span-4 rounded-xl bg-gray-50 p-4 shadow-sm text-center text-gray-500">
        No recent invoices found.
      </div>
    );
  }

  return (
    <div className="col-span-4 rounded-xl bg-gray-50 shadow-sm">
      <div className="p-4">
        <h2 className={`${lusitana.className} text-lg font-semibold`}>
          Latest Invoices
        </h2>
      </div>

      {/* ✅ Invoice list */}
      <div className="bg-white px-6">
        {latestInvoices.map((invoice) => (
          <div
            key={invoice.id}
            className="flex items-center justify-between border-b py-4 last:border-none"
          >
            <div className="flex items-center gap-4">
              <Image
                src={invoice.image_url || "/default-avatar.png"}
                alt={invoice.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-medium">{invoice.name}</p>
                <p className="text-sm text-gray-500">{invoice.email}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-medium">{formatCurrency(invoice.amount)}</p>
              <p className="text-sm text-gray-500">
                {formatDateToLocal(invoice.date)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
