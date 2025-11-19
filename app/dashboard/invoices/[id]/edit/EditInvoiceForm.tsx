"use client";

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
import { useActionState } from "react";

export default function EditInvoiceForm({
  invoice,
  customers,
}: {
  invoice: InvoiceForm;
  customers: CustomerField[];
}) {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(updateInvoice, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {/* Pass invoice id to server action */}
      <input type="hidden" name="id" value={invoice.id} />

      <div className="rounded-md bg-gray-50 p-6 space-y-6">
        {/* Customer Selector */}
        <div>
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose customer
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              defaultValue={invoice.customer_id}
              className="peer block w-full cursor-pointer rounded-md border border-gray-300 py-2 pl-10 text-sm placeholder:text-gray-500 focus:border-gray-900 focus:outline-none"
              aria-describedby="customer-error"
            >
              <option value="" disabled>
                Select a customer
              </option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="customer-error" aria-live="polite">
            {state.errors?.customerId?.map((err) => (
              <p className="mt-2 text-sm text-red-500" key={err}>
                {err}
              </p>
            ))}
          </div>
        </div>

        {/* Invoice Amount */}
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
            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="amount-error" aria-live="polite">
            {state.errors?.amount?.map((err) => (
              <p className="mt-2 text-sm text-red-500" key={err}>
                {err}
              </p>
            ))}
          </div>
        </div>

        {/* Invoice Status */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Invoice status
          </label>
          <div className="rounded-md border border-gray-300 bg-white px-4 py-3">
            <div
              className="flex gap-6"
              role="radiogroup"
              aria-describedby="status-error"
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  id="pending"
                  name="status"
                  type="radio"
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
                  id="paid"
                  name="status"
                  type="radio"
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
              <p className="mt-2 text-sm text-red-500" key={err}>
                {err}
              </p>
            ))}
          </div>
        </div>

        {/* Form-wide message */}
        {state.message && (
          <p className="mt-4 text-sm text-red-500" role="alert">
            {state.message}
          </p>
        )}
      </div>

      {/* Form buttons */}
      <div className="mt-8 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
