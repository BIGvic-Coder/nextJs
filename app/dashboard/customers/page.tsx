// import CustomersTable from "./table";
// import { fetchFilteredCustomers } from "@/app/lib/data";
// import type { FormattedCustomersTable } from "@/app/lib/definitions";

// export default async function CustomersPage(props: {
//   searchParams?: Promise<Record<string, string | string[]>>;
// }) {
//   const resolved = await props.searchParams;

//   const queryRaw = resolved?.query;
//   const query = Array.isArray(queryRaw) ? queryRaw[0] : queryRaw ?? "";

//   const customers: FormattedCustomersTable[] = await fetchFilteredCustomers(
//     query
//   );

//   return (
//     <div className="p-6 w-full">
//       <h1 className="text-2xl font-bold mb-4">Customers</h1>
//       <CustomersTable customers={customers} />
//     </div>
//   );
// }

// app/dashboard/customers/page.tsx

// app/dashboard/customers/page.tsx

export const runtime = "nodejs"; // ✅ Node runtime for Vercel

import CustomersTable from "./table";
import { fetchFilteredCustomers } from "@/app/lib/data";
import type { FormattedCustomersTable } from "@/app/lib/definitions";

export default async function CustomersPage(props: {
  searchParams?: Promise<Record<string, string | string[]>>; // Must stay a Promise
}) {
  const resolved = await props.searchParams; // await the promise

  const queryRaw = resolved?.query;
  const query = Array.isArray(queryRaw) ? queryRaw[0] : queryRaw ?? "";

  const customers: FormattedCustomersTable[] = await fetchFilteredCustomers(
    query
  );

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      <CustomersTable customers={customers} />
    </div>
  );
}
