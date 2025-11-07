import { Suspense } from "react";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import Cards from "@/app/ui/dashboard/cards";
import { lusitana } from "@/app/ui/fonts";
import {
  fetchRevenue,
  fetchLatestInvoices,
  fetchCardData,
} from "@/app/lib/data";
console.log("DEBUG fetching data...");
const revenue = await fetchRevenue();
console.log("DEBUG revenue:", revenue);

const latestInvoices = await fetchLatestInvoices();
console.log("DEBUG latest invoices:", latestInvoices);

const cardData = await fetchCardData();
console.log("DEBUG card data:", cardData);

export default async function Page() {
  // Fetch dashboard data from Supabase or SQL database
  const revenue = await fetchRevenue();
  const latestInvoices = await fetchLatestInvoices();
  const {
    totalPaidInvoices,
    totalPendingInvoices,
    numberOfInvoices,
    numberOfCustomers,
  } = await fetchCardData();

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Cards
          totalPaidInvoices={totalPaidInvoices}
          totalPendingInvoices={totalPendingInvoices}
          numberOfInvoices={numberOfInvoices}
          numberOfCustomers={numberOfCustomers}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<div>Loading revenue chart...</div>}>
          <RevenueChart revenue={revenue} />
        </Suspense>
        <Suspense fallback={<div>Loading latest invoices...</div>}>
          <LatestInvoices latestInvoices={latestInvoices} />
        </Suspense>
      </div>
    </main>
  );
}
