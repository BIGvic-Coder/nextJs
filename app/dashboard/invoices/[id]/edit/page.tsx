import { fetchInvoiceById, fetchCustomers } from "@/app/lib/data";
import EditInvoiceForm from "./EditInvoiceForm";
import { InvoiceForm, CustomerField } from "@/app/lib/definitions";

interface Props {
  params: { id: string };
}

export default async function EditInvoicePage({ params }: Props) {
  const { id } = params;

  const invoice = await fetchInvoiceById(id);
  const customers = await fetchCustomers();

  return (
    <div>
      <EditInvoiceForm invoice={invoice} customers={customers} />
    </div>
  );
}
