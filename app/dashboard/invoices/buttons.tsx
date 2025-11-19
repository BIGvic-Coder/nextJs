"use client";

import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export function UpdateInvoice({ id }: { id: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(`/dashboard/invoices/${id}/edit`)}
      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
    >
      <PencilIcon className="h-4 w-4" />
      Edit
    </button>
  );
}

export function DeleteInvoice({ id }: { id: string }) {
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      console.log(`Deleting invoice ${id}`);
      // Add API call to delete here
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="flex items-center gap-1 text-red-600 hover:text-red-800"
    >
      <TrashIcon className="h-4 w-4" />
      Delete
    </button>
  );
}
