// app/ui/dashboard/card-wrapper.tsx
import { fetchCardData } from "@/app/lib/data";
import Cards from "@/app/ui/dashboard/cards";

export default async function CardWrapper() {
  const {
    totalPaidInvoices,
    totalPendingInvoices,
    numberOfInvoices,
    numberOfCustomers,
  } = await fetchCardData();

  return (
    <Cards
      totalPaidInvoices={totalPaidInvoices} // string
      totalPendingInvoices={totalPendingInvoices} // string
      numberOfInvoices={numberOfInvoices} // number
      numberOfCustomers={numberOfCustomers} // number
    />
  );
}
