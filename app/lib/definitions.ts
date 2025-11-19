// This file contains type definitions for your data.

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  status: "pending" | "paid";
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string; // formatted
};

export type LatestInvoiceRaw = Omit<LatestInvoice, "amount"> & {
  amount: number; // raw from DB
};

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

/* ------------------------- CUSTOMER TYPES ------------------------- */

// Raw DB result - numbers only
export type CustomerField = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

// Raw DB from fetchFilteredCustomers()
export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

// UI formatted values (when needed)
export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number; // NOW NUMBER (not string)
  total_paid: number; // NOW NUMBER (not string)
};

/* ------------------------- INVOICE FORM ------------------------- */

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: "pending" | "paid";
};
