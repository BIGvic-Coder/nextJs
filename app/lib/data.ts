// app/lib/data.ts
import { supabaseServer } from "./supabase-server";
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from "./definitions";
import { formatCurrency } from "./utils";

const ITEMS_PER_PAGE = 6;

/* ------------------------- Fetch Revenue ------------------------- */
export async function fetchRevenue(): Promise<Revenue[]> {
  const { data, error } = await supabaseServer
    .from("revenue")
    .select("*")
    .order("month", { ascending: true });

  if (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }

  return data || [];
}

/* ------------------------- Latest Invoices ------------------------- */
export async function fetchLatestInvoices(): Promise<LatestInvoiceRaw[]> {
  const { data, error } = await supabaseServer
    .from("invoices")
    .select(
      `
      id,
      amount,
      date,
      status,
      customers:customer_id (name, email, image_url)
    `
    )
    .order("date", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch latest invoices.");
  }

  return (data || []).map((inv: any) => ({
    id: inv.id,
    amount: Number(inv.amount),
    date: new Date(inv.date).toISOString(),
    status: inv.status,
    name: inv.customers?.name,
    email: inv.customers?.email,
    image_url: inv.customers?.image_url,
  }));
}

/* ------------------------- Filtered Invoices ------------------------- */
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
): Promise<InvoicesTable[]> {
  const safePage = currentPage > 0 ? currentPage : 1;
  const from = (safePage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const filter = `%${query}%`;

  const { data, error } = await supabaseServer
    .from("invoices")
    .select(
      `
      id,
      customer_id,
      amount,
      date,
      status,
      customers:customer_id (name, email, image_url)
    `
    )
    .or(
      `
      customers.name.ilike.${filter},
      customers.email.ilike.${filter},
      amount::text.ilike.${filter},
      status.ilike.${filter}
    `
    )
    .range(from, to)
    .order("date", { ascending: false });

  if (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }

  return (data || []).map((inv: any) => ({
    id: inv.id,
    customer_id: inv.customer_id,
    amount: Number(inv.amount),
    date: inv.date,
    status: inv.status,
    name: inv.customers?.name,
    email: inv.customers?.email,
    image_url: inv.customers?.image_url,
  }));
}

/* ------------------------- Invoice Count ------------------------- */
export async function fetchInvoicesPages(query: string): Promise<number> {
  const filter = `%${query}%`;

  const { count, error } = await supabaseServer
    .from("invoices")
    .select("id", { count: "exact" })
    .or(
      `
      customers.name.ilike.${filter},
      customers.email.ilike.${filter},
      amount::text.ilike.${filter},
      status.ilike.${filter}
    `
    );

  if (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total invoice count.");
  }

  return Math.ceil((count || 0) / ITEMS_PER_PAGE);
}

/* ------------------------- Single Invoice By ID ------------------------- */
export async function fetchInvoiceById(id: string): Promise<InvoiceForm> {
  const { data, error } = await supabaseServer
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }

  return {
    ...data,
    amount: Number(data.amount) / 100,
  };
}

/* ------------------------- All Customers ------------------------- */
export async function fetchCustomers(): Promise<CustomerField[]> {
  const { data, error } = await supabaseServer
    .from("customers")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch customers.");
  }

  return data || [];
}

/* ------------------------- Filtered Customers ------------------------- */
export async function fetchFilteredCustomers(
  query: string
): Promise<CustomersTableType[]> {
  const filter = `%${query}%`;

  const { data, error } = await supabaseServer
    .from("customers")
    .select(
      `
      id,
      name,
      email,
      image_url,
      invoices:invoices (
        status,
        amount
      )
    `
    )
    .or(
      `
      name.ilike.${filter},
      email.ilike.${filter}
    `
    )
    .order("name", { ascending: true });

  if (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch customers.");
  }

  return (data || []).map((c: any) => {
    const invoices = c.invoices || [];

    return {
      id: c.id,
      name: c.name,
      email: c.email,
      image_url: c.image_url,
      total_invoices: invoices.length,
      total_pending: invoices
        .filter((i: any) => i.status === "pending")
        .reduce((sum: number, i: any) => sum + Number(i.amount), 0),
      total_paid: invoices
        .filter((i: any) => i.status === "paid")
        .reduce((sum: number, i: any) => sum + Number(i.amount), 0),
    };
  });
}

/* ------------------------- DASHBOARD CARD DATA ------------------------- */
export async function fetchCardData() {
  const { count: totalPaidInvoicesRaw, error: paidError } =
    await supabaseServer.from("invoices").select("id", { count: "exact" }).eq("status", "paid");
  if (paidError) throw paidError;

  const { count: totalPendingInvoicesRaw, error: pendingError } =
    await supabaseServer.from("invoices").select("id", { count: "exact" }).eq("status", "pending");
  if (pendingError) throw pendingError;

  const { count: numberOfInvoicesRaw, error: invoiceError } =
    await supabaseServer.from("invoices").select("id", { count: "exact" });
  if (invoiceError) throw invoiceError;

  const { count: numberOfCustomersRaw, error: customerError } =
    await supabaseServer.from("customers").select("id", { count: "exact" });
  if (customerError) throw customerError;

  return {
    totalPaidInvoices: String(totalPaidInvoicesRaw || 0),
    totalPendingInvoices: String(totalPendingInvoicesRaw || 0),
    numberOfInvoices: numberOfInvoicesRaw || 0,
    numberOfCustomers: numberOfCustomersRaw || 0,
  };
}
