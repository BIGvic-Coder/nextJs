// app/invoices/[id]/page.tsx
import { notFound } from "next/navigation";
import EditInvoiceForm from "./EditInvoiceForm";
import { fetchInvoiceById, fetchCustomers } from "@/app/lib/data";
import type { InvoiceForm, CustomerField } from "@/app/lib/definitions";

interface PageParams {
  id: string;
  [key: string]: string | string[];
}

export default async function EditInvoicePage({
  params,
}: {
  params: PageParams;
}) {
  const id = params.id;

  if (!id) return notFound();

  // Fetch invoice + customers
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id).catch(() => null),
    fetchCustomers().catch(() => [] as CustomerField[]),
  ]);

  // Invoice not found → 404
  if (!invoice) return notFound();

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">Edit Invoice</h1>
      <EditInvoiceForm invoice={invoice} customers={customers} />
    </div>
  );
}
