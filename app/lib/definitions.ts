/* ------------------------- USER ------------------------- */
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

/* ------------------------- CUSTOMER BASE ------------------------- */
export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

/* ------------------------- INVOICES ------------------------- */
export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  status: "pending" | "paid";
};

/* ------------------------- REVENUE ------------------------- */
export type Revenue = {
  month: string;
  revenue: number;
};

/* ------------------------- LATEST INVOICE TYPES ------------------------- */
export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string; // formatted
  date: string;
};

export type LatestInvoiceRaw = Omit<LatestInvoice, "amount"> & {
  amount: number; // raw from DB
  date: string;
};

/* ------------------------- TABLE ROW FOR INVOICES ------------------------- */
export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: "pending" | "paid";
};

/* ------------------------- CUSTOMER TABLE TYPES ------------------------- */
export type CustomerField = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

/* ------------------------- INVOICE FORM ------------------------- */
export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: "pending" | "paid";
};

/* ------------------------- DYNAMIC INVOICE PAGE PROPS ------------------------- */
export interface InvoicePageProps {
  params: { id: string }; // [id] route
}

/* ------------------------- OPTIONAL HELPER TYPES ------------------------- */
/**
 * Use these types in your pages:
 * CustomersPageProps: { searchParams?: { query?: string | string[] } }
 * InvoiceEditPageProps: InvoicePageProps
 */
