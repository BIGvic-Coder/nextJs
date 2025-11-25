import { notFound } from "next/navigation";
import EditInvoiceForm from "./EditInvoiceForm";
import { fetchInvoiceById, fetchCustomers } from "@/app/lib/data";
import type { CustomerField, InvoiceForm } from "@/app/lib/definitions";

export default async function EditInvoicePage({
  params,
}: {
  params: { id: string };
}): Promise<JSX.Element> {
  const { id } = params;

  if (!id) return notFound();

  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id).catch(() => null),
    fetchCustomers().catch(() => [] as CustomerField[]),
  ]);

  if (!invoice) return notFound();

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">Edit Invoice</h1>
      <EditInvoiceForm invoice={invoice} customers={customers} />
    </div>
  );
}
