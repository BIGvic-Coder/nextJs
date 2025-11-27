// app/dashboard/customers/page.tsx

import { Suspense } from "react";
import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import CustomersTable from "./table";
import type { FormattedCustomersTable } from "@/app/lib/definitions";
import { fetchFilteredCustomers } from "@/app/lib/data";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string }>;
}) {
  const params = await searchParams;
  const query = params?.query ?? "";

  const customers: FormattedCustomersTable[] = await fetchFilteredCustomers(
    query
  );

  return (
    <div className="w-full max-w-5xl mx-auto mt-8">
      <div className="flex w-full items-center justify-between mb-6">
        <h1 className={`${lusitana.className} text-3xl font-bold`}>
          Customers
        </h1>
      </div>

      <Search placeholder="Search customers..." />

      <Suspense fallback={<p>Loading customers...</p>}>
        <CustomersTable customers={customers} />
      </Suspense>
    </div>
  );
}
