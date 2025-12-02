// app/ui/dashboard/latest-invoices-wrapper.tsx
import LatestInvoices from "./latest-invoices";
import { fetchLatestInvoices } from "@/app/lib/data";
import { LatestInvoiceRaw } from "@/app/lib/definitions";
import { supabaseServer } from "@/app/lib/supabase-server";

export const dynamic = "force-dynamic"; // prevents prerendering ETIMEDOUT

export default async function LatestInvoicesWrapper() {
  // If the Supabase client is not initialized, return empty data
  if (!supabaseServer) {
    console.warn("Supabase client not initialized. Returning empty invoices.");
    return <LatestInvoices latestInvoices={[]} />;
  }

  let latestInvoices: LatestInvoiceRaw[] = [];

  try {
    latestInvoices = await fetchLatestInvoices();
  } catch (err) {
    console.error("Failed to fetch latest invoices:", err);
    latestInvoices = [];
  }

  return <LatestInvoices latestInvoices={latestInvoices} />;
}
