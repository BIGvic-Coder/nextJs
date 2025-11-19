"use client";

import Image from "next/image";
import { FormattedCustomersTable } from "@/app/lib/definitions";

export default function CustomersTable({
  customers,
}: {
  customers: FormattedCustomersTable[];
}) {
  if (!customers || customers.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">No customers found.</div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
      <table className="min-w-full">
        <thead className="bg-gray-100 text-left text-sm font-semibold">
          <tr>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3 text-center">Total Invoices</th>
            <th className="px-4 py-3 text-center">Total Paid</th>
            <th className="px-4 py-3 text-center">Total Pending</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr
              key={customer.id}
              className="border-t hover:bg-gray-50 transition-colors"
            >
              <td className="flex items-center gap-3 px-4 py-3">
                <Image
                  src={customer.image_url}
                  alt={customer.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="font-medium text-gray-900">
                  {customer.name}
                </span>
              </td>

              <td className="px-4 py-3 text-gray-700">{customer.email}</td>

              <td className="px-4 py-3 text-center text-gray-800">
                {customer.total_invoices}
              </td>

              <td className="px-4 py-3 text-center text-green-600 font-medium">
                {customer.total_paid}
              </td>

              <td className="px-4 py-3 text-center text-yellow-600 font-medium">
                {customer.total_pending}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
