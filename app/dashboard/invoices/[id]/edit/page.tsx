import EditInvoiceForm from "../EditInvoiceForm";
import { InvoiceForm } from "@/app/lib/definitions";

// Fetch invoice by ID
async function fetchInvoice(id: string): Promise<InvoiceForm> {
  return {
    id,
    customer_id: "123",
    amount: 100,
    status: "pending", // ✅ typed correctly
  };
}

// Async page component
export default async function EditInvoicePage({ params }: any) {
  const id = params?.id as string;
  const invoice = await fetchInvoice(id);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Edit Invoice {id}</h1>
      <EditInvoiceForm invoice={invoice} />
    </div>
  );
}

// Optional metadata
export async function generateMetadata({ params }: any) {
  const id = params?.id as string;
  return { title: `Edit Invoice ${id}` };
}
