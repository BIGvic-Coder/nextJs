// app/ui/dashboard/latest-invoices-wrapper.tsx
import LatestInvoices from "./latest-invoices";
import { fetchLatestInvoices } from "@/app/lib/data";
import { LatestInvoiceRaw } from "@/app/lib/definitions";

export const dynamic = "force-dynamic"; // prevents prerendering ETIMEDOUT

export default async function LatestInvoicesWrapper() {
  let latestInvoices: LatestInvoiceRaw[] = [];

  try {
    latestInvoices = await fetchLatestInvoices();
  } catch (err) {
    console.error("Failed to fetch latest invoices:", err);
    latestInvoices = [];
  }

  return <LatestInvoices latestInvoices={latestInvoices} />;
}
