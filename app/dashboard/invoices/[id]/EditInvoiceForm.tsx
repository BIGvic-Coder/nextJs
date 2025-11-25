"use client";

import { useState } from "react";
import { InvoiceForm } from "@/app/lib/definitions";

type Props = {
  invoice: InvoiceForm;
};

export default function EditInvoiceForm({ invoice }: Props) {
  // State with explicit types
  const [amount, setAmount] = useState<number>(invoice.amount);
  const [status, setStatus] = useState<InvoiceForm["status"]>(invoice.status);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Replace this with actual save logic
    console.log({ amount, status });
  };

  // Handle input change for amount
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  // Handle select change for status
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "pending" || value === "paid") {
      setStatus(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col">
        Amount:
        <input
          type="number"
          value={amount}
          onChange={handleAmountChange}
          className="border p-2 rounded mt-1"
        />
      </label>

      <label className="flex flex-col">
        Status:
        <select
          value={status}
          onChange={handleStatusChange}
          className="border p-2 rounded mt-1"
        >
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>
      </label>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Save
      </button>
    </form>
  );
}
