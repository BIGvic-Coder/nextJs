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

const ITEMS_PER_PAGE = 6;

/* ------------------------- Fetch Revenue ------------------------- */
export async function fetchRevenue(): Promise<Revenue[]> {
  if (!supabaseServer) return [];
  const { data, error } = await supabaseServer
    .from("revenue")
    .select("*")
    .order("month", { ascending: true });

  if (error) {
    console.error("Database Error:", error);
    return [];
  }
  return data || [];
}

/* ------------------------- Latest Invoices ------------------------- */
export async function fetchLatestInvoices(): Promise<LatestInvoiceRaw[]> {
  if (!supabaseServer) return [];

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
    return [];
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
  if (!supabaseServer) return [];

  const safePage = currentPage > 0 ? currentPage : 1;
  const from = (safePage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  let supabaseQuery = supabaseServer
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
    .range(from, to)
    .order("date", { ascending: false });

  if (query?.trim()) {
    const filter = `%${query.trim()}%`;
    supabaseQuery = supabaseQuery.or(
      `customers.name.ilike.${filter},customers.email.ilike.${filter},amount::text.ilike.${filter},status.ilike.${filter}`
    );
  }

  const { data, error } = await supabaseQuery;
  if (error) {
    console.error("Database Error:", error);
    return [];
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
  if (!supabaseServer) return 0;

  let supabaseQuery = supabaseServer
    .from("invoices")
    .select("id", { count: "exact" });

  if (query?.trim()) {
    const filter = `%${query.trim()}%`;
    supabaseQuery = supabaseQuery.or(
      `customers.name.ilike.${filter},customers.email.ilike.${filter},amount::text.ilike.${filter},status.ilike.${filter}`
    );
  }

  const { count, error } = await supabaseQuery;
  if (error) {
    console.error("Database Error:", error);
    return 0;
  }

  return Math.ceil((count || 0) / ITEMS_PER_PAGE);
}

/* ------------------------- Single Invoice By ID ------------------------- */
export async function fetchInvoiceById(
  id: string
): Promise<InvoiceForm | null> {
  if (!supabaseServer) return null;

  const { data, error } = await supabaseServer
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Database Error:", error);
    return null;
  }

  return {
    ...data,
    amount: Number(data.amount) / 100,
  };
}

/* ------------------------- All Customers ------------------------- */
export async function fetchCustomers(): Promise<CustomerField[]> {
  if (!supabaseServer) return [];
  const { data, error } = await supabaseServer
    .from("customers")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Database Error:", error);
    return [];
  }
  return data || [];
}

/* ------------------------- Filtered Customers ------------------------- */
export async function fetchFilteredCustomers(
  query: string
): Promise<CustomersTableType[]> {
  if (!supabaseServer) return [];

  let supabaseQuery = supabaseServer
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
    .order("name", { ascending: true });

  if (query?.trim()) {
    const filter = `%${query.trim()}%`;
    supabaseQuery = supabaseQuery.or(
      `name.ilike.${filter},email.ilike.${filter}`
    );
  }

  const { data, error } = await supabaseQuery;
  if (error) {
    console.error("Database Error:", error);
    return [];
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
  if (!supabaseServer)
    return {
      totalPaidInvoices: "0",
      totalPendingInvoices: "0",
      numberOfInvoices: 0,
      numberOfCustomers: 0,
    };

  const { count: totalPaidInvoicesRaw, error: paidError } = await supabaseServer
    .from("invoices")
    .select("id", { count: "exact" })
    .eq("status", "paid");
  if (paidError) console.error(paidError);

  const { count: totalPendingInvoicesRaw, error: pendingError } =
    await supabaseServer
      .from("invoices")
      .select("id", { count: "exact" })
      .eq("status", "pending");
  if (pendingError) console.error(pendingError);

  const { count: numberOfInvoicesRaw, error: invoiceError } =
    await supabaseServer.from("invoices").select("id", { count: "exact" });
  if (invoiceError) console.error(invoiceError);

  const { count: numberOfCustomersRaw, error: customerError } =
    await supabaseServer.from("customers").select("id", { count: "exact" });
  if (customerError) console.error(customerError);

  return {
    totalPaidInvoices: String(totalPaidInvoicesRaw || 0),
    totalPendingInvoices: String(totalPendingInvoicesRaw || 0),
    numberOfInvoices: numberOfInvoicesRaw || 0,
    numberOfCustomers: numberOfCustomersRaw || 0,
  };
}
