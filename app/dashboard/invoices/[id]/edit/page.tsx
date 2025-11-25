import EditInvoiceForm from "../EditInvoiceForm";
import type { InvoiceForm } from "@/app/lib/definitions";

// Params MUST be typed as a Promise for Next.js
type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditInvoicePage({ params }: PageProps) {
  const { id } = await params;

  const invoice = await fetchInvoice(id);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Edit Invoice {id}</h1>
      <EditInvoiceForm invoice={invoice} />
    </div>
  );
}

// Fake DB call
async function fetchInvoice(id: string): Promise<InvoiceForm> {
  return {
    id,
    customer_id: "123",
    amount: 100,
    status: "pending",
  };
}

// generateMetadata MUST use the same async params type
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;

  return {
    title: `Edit Invoice ${id}`,
  };
}
