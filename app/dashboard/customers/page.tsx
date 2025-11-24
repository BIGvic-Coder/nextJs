import { notFound } from "next/navigation";
import CustomersTable from "./table";
import { fetchFilteredCustomers } from "@/app/lib/data";
import type { FormattedCustomersTable } from "@/app/lib/definitions";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string }>;
}) {
  const resolved = await searchParams;
  const query = resolved?.query || "";

  const customers: FormattedCustomersTable[] = await fetchFilteredCustomers(
    query
  ).catch(() => []);

  if (!customers || customers.length === 0) return notFound();

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      <CustomersTable customers={customers} />
    </div>
  );
}
