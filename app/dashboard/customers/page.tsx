import { fetchFilteredCustomers } from "@/app/lib/data";
import { formatCustomers } from "@/app/lib/utils";
import CustomersTable from "./table";
import Search from "@/app/ui/search";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams?: { query?: string | string[] };
}) {
  try {
    // ✅ Awaited / normalized query
    const query = Array.isArray(searchParams?.query)
      ? searchParams.query[0].trim()
      : searchParams?.query?.trim() || "";

    // ✅ Fetch filtered customers based on the query
    const rawCustomers = await fetchFilteredCustomers(query);

    // ✅ Format, deduplicate, and convert numeric fields safely
    const formattedCustomers = formatCustomers(rawCustomers || [])
      .filter(
        (value, index, self) =>
          index === self.findIndex((c) => c.id === value.id)
      )
      .map((c) => ({
        ...c,
        total_invoices: Number(c.total_invoices) || 0,
        total_paid: Number(c.total_paid) || 0,
        total_pending: Number(c.total_pending) || 0,
      }));

    return (
      <div className="p-6 w-full">
        {/* Header with search bar */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Customers</h1>
          <Search placeholder="Search customers..." />
        </div>

        <p className="mb-4 text-gray-700">
          Below are your current customers and their balances:
        </p>

        {/* Conditional rendering */}
        {formattedCustomers.length > 0 ? (
          <CustomersTable customers={formattedCustomers} />
        ) : (
          <p className="text-gray-500">No customers found.</p>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error loading customers:", error);
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Customers</h1>
        <p className="text-red-500">
          Failed to load customer data. Please try again later.
        </p>
      </div>
    );
  }
}
