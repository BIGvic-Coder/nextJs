// app/dashboard/invoices/status.tsx

interface StatusProps {
  status: string;
}

export default function InvoiceStatus({ status }: StatusProps) {
  const isPaid = status.toLowerCase() === "paid";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
        isPaid ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {isPaid ? "Paid" : "Pending"}
    </span>
  );
}
