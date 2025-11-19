"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase } from "@/app/lib/supabaseclient";

// -----------------------------
// ZOD VALIDATION SCHEMA
// -----------------------------
const InvoiceSchema = z.object({
  id: z.string().optional(),
  customerId: z
    .string({
      invalid_type_error: "Please select a customer.",
      required_error: "Customer is required.",
    })
    .min(1, "Please select a customer."),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
});

// Result type returned to the client form
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

// --------------------------------------------------
// CREATE INVOICE
// --------------------------------------------------
export async function createInvoice(prevState: State, formData: FormData) {
  const validated = InvoiceSchema.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Missing fields. Failed to create invoice.",
    };
  }

  const { customerId, amount, status } = validated.data;

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  const { error } = await supabase.from("invoices").insert({
    customer_id: customerId,
    amount: amountInCents,
    status,
    date,
  });

  if (error) return { message: "Database Error: Failed to create invoice." };

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

// --------------------------------------------------
// UPDATE INVOICE
// --------------------------------------------------
export async function updateInvoice(prevState: State, formData: FormData) {
  const validated = InvoiceSchema.safeParse({
    id: formData.get("id"),
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Missing fields. Failed to update invoice.",
    };
  }

  const { id, customerId, amount, status } = validated.data;

  const { error } = await supabase
    .from("invoices")
    .update({
      customer_id: customerId,
      amount: amount * 100,
      status,
    })
    .eq("id", id);

  if (error) {
    return { message: "Database Error: Failed to update invoice." };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}
