import { fetchFilteredInvoices } from "@/app/lib/data";

export default async function InvoicesPage() {
  const invoices = await fetchFilteredInvoices("", 1); // fetch all invoices

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>
      <p className="mb-4">Below are your most recent invoices:</p>

      <table className="min-w-full border border-gray-200 rounded-lg shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Customer</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Amount</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice: any) => (
            <tr key={invoice.id} className="border-t">
              <td className="px-4 py-2">{invoice.name}</td>
              <td className="px-4 py-2">{invoice.email}</td>
              <td className="px-4 py-2">{invoice.amount}</td>
              <td className="px-4 py-2">{invoice.status}</td>
              <td className="px-4 py-2">
                {new Date(invoice.date).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
