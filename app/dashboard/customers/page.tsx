import { fetchFilteredCustomers } from "@/app/lib/data";
import { formatCustomers } from "@/app/lib/utils";
import CustomersTable from "./table";

export default async function CustomersPage() {
  try {
    // Fetch all customers
    const rawCustomers = await fetchFilteredCustomers("");

    // Format and deduplicate customers safely
    const formattedCustomers = formatCustomers(rawCustomers || []).filter(
      (value, index, self) => index === self.findIndex((c) => c.id === value.id)
    );

    return (
      <div className="p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">Customers</h1>
        <p className="mb-4 text-gray-700">
          Below are your current customers and their balances:
        </p>

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
