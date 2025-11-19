// console.log("DEBUG POSTGRES_URL:", process.env.POSTGRES_URL);

import postgres from "postgres";
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from "./definitions";
import { formatCurrency } from "./utils";

/**
 * ✅ GLOBAL SQL SINGLETON (Fixes Supabase pool limit)
 */
declare global {
  var __sql: ReturnType<typeof postgres> | undefined;
}

export const sql =
  global.__sql ||
  (global.__sql = postgres(process.env.POSTGRES_URL!, {
    ssl: "require",
    max: 5,
    prepare: false,
  }));

if (process.env.NODE_ENV !== "production") {
  global.__sql = sql;
}

const ITEMS_PER_PAGE = 6;

/* ------------------------- Fetch Revenue ------------------------- */
export async function fetchRevenue() {
  try {
    const data = await sql<Revenue[]>`
      SELECT * FROM revenue ORDER BY month ASC;
    `;
    return data || [];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

/* ------------------------- Latest Invoices ------------------------- */
export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      INNER JOIN customers ON invoices.customer_id = customers.id
      WHERE customers.id IS NOT NULL
      ORDER BY invoices.date DESC
      LIMIT 5;
    `;

    return data.map((invoice) => ({
      ...invoice,
      amount: Number(invoice.amount),
      date: new Date(invoice.date).toISOString(),
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch latest invoices.");
  }
}

/* ------------------------- Dashboard Stats ------------------------- */
export async function fetchCardData() {
  try {
    const [invoiceCount, customerCount, invoiceStatus] = await Promise.all([
      sql`SELECT COUNT(*) AS count FROM invoices;`,
      sql`SELECT COUNT(*) AS count FROM customers;`,
      sql`
        SELECT
          SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS paid,
          SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS pending
        FROM invoices;
      `,
    ]);

    return {
      numberOfInvoices: Number(invoiceCount?.[0]?.count ?? 0),
      numberOfCustomers: Number(customerCount?.[0]?.count ?? 0),
      totalPaidInvoices: formatCurrency(invoiceStatus?.[0]?.paid ?? 0),
      totalPendingInvoices: formatCurrency(invoiceStatus?.[0]?.pending ?? 0),
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch dashboard data.");
  }
}

/* ------------------------- Filtered Invoices ------------------------- */
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const safePage =
    Number.isFinite(currentPage) && currentPage > 0 ? currentPage : 1;
  const offset = (safePage - 1) * ITEMS_PER_PAGE;
  const search = `%${query || ""}%`;

  try {
    return await sql<InvoicesTable[]>`
      SELECT DISTINCT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${search} OR
        customers.email ILIKE ${search} OR
        invoices.amount::text ILIKE ${search} OR
        invoices.date::text ILIKE ${search} OR
        invoices.status ILIKE ${search}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
    `;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

/* ------------------------- Invoice Count ------------------------- */
export async function fetchInvoicesPages(query: string) {
  const search = `%${query || ""}%`;

  try {
    const data = await sql`
      SELECT COUNT(*) AS count
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${search} OR
        customers.email ILIKE ${search} OR
        invoices.amount::text ILIKE ${search} OR
        invoices.date::text ILIKE ${search} OR
        invoices.status ILIKE ${search};
    `;

    return Math.ceil(Number(data?.[0]?.count ?? 0) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total invoice count.");
  }
}

/* ------------------------- Single Invoice By ID ------------------------- */
export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    if (!data.length) throw new Error("Invoice not found.");

    return {
      ...data[0],
      amount: data[0].amount / 100,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}

/* ------------------------- All Customers ------------------------- */
export async function fetchCustomers() {
  try {
    return await sql<CustomerField[]>`
      SELECT id, name, email, image_url
      FROM customers
      ORDER BY name ASC;
    `;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch customers.");
  }
}

/* ------------------------- Filtered Customers (FIXED) ------------------------- */
export async function fetchFilteredCustomers(query: string) {
  const search = `%${query || ""}%`;

  try {
    const data = await sql<CustomersTableType[]>`
      SELECT
        customers.id,
        customers.name,
        customers.email,
        customers.image_url,
        COUNT(invoices.id) AS total_invoices,
        SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
        SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
      FROM customers
      LEFT JOIN invoices ON customers.id = invoices.customer_id
      WHERE
        customers.name ILIKE ${search} OR
        customers.email ILIKE ${search}
      GROUP BY customers.id, customers.name, customers.email, customers.image_url
      ORDER BY customers.name ASC
      LIMIT 50;
    `;

    return data.map((c) => ({
      ...c,
      total_invoices: Number(c.total_invoices) || 0,
      total_pending: Number(c.total_pending) || 0,
      total_paid: Number(c.total_paid) || 0,
    }));
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch customer table.");
  }
}
