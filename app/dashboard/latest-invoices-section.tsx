// app/dashboard/latest-invoices-section.tsx
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import { fetchLatestInvoices } from "@/app/lib/data";

// This component isolates the latest invoices section.
// It fetches invoice data for Suspense streaming.

export default async function LatestInvoicesSection() {
  const latestInvoices = await fetchLatestInvoices();

  return <LatestInvoices latestInvoices={latestInvoices} />;
}
