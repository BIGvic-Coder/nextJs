"use client";

import { useState } from "react";
import { CustomerField, InvoiceForm } from "@/app/lib/definitions";
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { updateInvoice, State } from "@/app/lib/actions";

interface EditInvoiceFormProps {
  invoice: InvoiceForm;
  customers: CustomerField[];
}

export default function EditInvoiceForm({
  invoice,
  customers,
}: EditInvoiceFormProps) {
  const initialState: State = { message: null, errors: {} };
  const [state, setState] = useState<State>(initialState);

  const formAction = async (formData: FormData) => {
    // Pass current state to match your actions.ts signature
    const result = await updateInvoice(state, formData);
    setState(result);
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        await formAction(data);
      }}
      className="space-y-6"
    >
      <input type="hidden" name="id" value={invoice.id} />

      {/* Customer Selector */}
      <div>
        <label htmlFor="customerId" className="mb-2 block text-sm font-medium">
          Choose customer
        </label>
        <div className="relative">
          <select
            id="customerId"
            name="customerId"
            defaultValue={invoice.customer_id}
            className="peer block w-full cursor-pointer rounded-md border border-gray-300 py-2 pl-10 text-sm placeholder:text-gray-500 focus:border-gray-900 focus:outline-none"
            aria-describedby="customer-error"
          >
            <option value="" disabled>
              Select a customer
            </option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 w-[18px] h-[18px] -translate-y-1/2 text-gray-500" />
        </div>
        <div id="customer-error" aria-live="polite">
          {state.errors?.customerId?.map((err) => (
            <p key={err} className="mt-2 text-sm text-red-500">
              {err}
            </p>
          ))}
        </div>
      </div>

      {/* Amount */}
      <div>
        <label htmlFor="amount" className="mb-2 block text-sm font-medium">
          Enter amount
        </label>
        <div className="relative">
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            defaultValue={invoice.amount}
            placeholder="Enter USD amount"
            className="peer block w-full rounded-md border border-gray-300 py-2 pl-10 text-sm placeholder:text-gray-500 focus:border-gray-900 focus:outline-none"
            aria-describedby="amount-error"
          />
          <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 w-[18px] h-[18px] -translate-y-1/2 text-gray-500" />
        </div>
        <div id="amount-error" aria-live="polite">
          {state.errors?.amount?.map((err) => (
            <p key={err} className="mt-2 text-sm text-red-500">
              {err}
            </p>
          ))}
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="mb-2 block text-sm font-medium">Invoice status</label>
        <div className="rounded-md border border-gray-300 bg-white px-4 py-3">
          <div
            className="flex gap-6"
            role="radiogroup"
            aria-describedby="status-error"
          >
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="pending"
                defaultChecked={invoice.status === "pending"}
                className="h-4 w-4 text-gray-600"
              />
              <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                Pending <ClockIcon className="h-4 w-4" />
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="paid"
                defaultChecked={invoice.status === "paid"}
                className="h-4 w-4 text-green-600"
              />
              <span className="flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white">
                Paid <CheckIcon className="h-4 w-4" />
              </span>
            </label>
          </div>
        </div>
        <div id="status-error" aria-live="polite">
          {state.errors?.status?.map((err) => (
            <p key={err} className="mt-2 text-sm text-red-500">
              {err}
            </p>
          ))}
        </div>
      </div>

      {/* General message */}
      {state.message && (
        <p className="mt-4 text-sm text-red-500" role="alert">
          {state.message}
        </p>
      )}

      {/* Buttons */}
      <div className="mt-8 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 hover:bg-gray-200 transition"
        >
          Cancel
        </Link>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
