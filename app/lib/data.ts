console.log("DEBUG POSTGRES_URL:", process.env.POSTGRES_URL);

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

//  Use SSL safely for Supabase
const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: { rejectUnauthorized: false },
});

const ITEMS_PER_PAGE = 6;

/* ------------------------- Fetch Revenue ------------------------- */
export async function fetchRevenue() {
  try {
    const data = await sql<Revenue[]>`SELECT * FROM revenue ORDER BY month ASC`;
    return data;
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
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5;
    `;

    // ✅ The `postgres` client returns an array directly, not `rows`
    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));

    return latestInvoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

/* ------------------------- Dashboard Card Data ------------------------- */
export async function fetchCardData() {
  try {
    const [invoiceCount, customerCount, invoiceStatus] = await Promise.all([
      sql`SELECT COUNT(*) FROM invoices`,
      sql`SELECT COUNT(*) FROM customers`,
      sql`
        SELECT
          SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS paid,
          SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS pending
        FROM invoices;
      `,
    ]);

    const numberOfInvoices = Number(invoiceCount[0].count ?? "0");
    const numberOfCustomers = Number(customerCount[0].count ?? "0");
    const totalPaidInvoices = formatCurrency(invoiceStatus[0].paid ?? "0");
    const totalPendingInvoices = formatCurrency(
      invoiceStatus[0].pending ?? "0"
    );

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}

/* ------------------------- Filtered Invoices ------------------------- */
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable[]>`
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
        customers.name ILIKE ${"%" + query + "%"} OR
        customers.email ILIKE ${"%" + query + "%"} OR
        invoices.amount::text ILIKE ${"%" + query + "%"} OR
        invoices.date::text ILIKE ${"%" + query + "%"} OR
        invoices.status ILIKE ${"%" + query + "%"}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
    `;

    return invoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

/* ------------------------- Invoices Pages ------------------------- */
export async function fetchInvoicesPages(query: string) {
  try {
    const data = await sql`
      SELECT COUNT(*)
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${"%" + query + "%"} OR
        customers.email ILIKE ${"%" + query + "%"} OR
        invoices.amount::text ILIKE ${"%" + query + "%"} OR
        invoices.date::text ILIKE ${"%" + query + "%"} OR
        invoices.status ILIKE ${"%" + query + "%"};
    `;

    return Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
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

/* ------------------------- Fetch All Customers ------------------------- */
export async function fetchCustomers() {
  try {
    const customers = await sql<CustomerField[]>`
      SELECT id, name, email, image_url
      FROM customers
      ORDER BY name ASC;
    `;
    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all customers.");
  }
}

/* ------------------------- Filtered Customers ------------------------- */
export async function fetchFilteredCustomers(query: string) {
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
        customers.name ILIKE ${"%" + query + "%"} OR
        customers.email ILIKE ${"%" + query + "%"}
      GROUP BY customers.id, customers.name, customers.email, customers.image_url
      ORDER BY customers.name ASC;
    `;

    return data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch customer table.");
  }
}
