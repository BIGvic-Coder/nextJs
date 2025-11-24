import {
  Revenue,
  CustomersTableType,
  FormattedCustomersTable,
} from "./definitions";

// ✅ Format cents → USD (use for display only)
export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

// ✅ Format date nicely for UI
export const formatDateToLocal = (
  dateStr: string,
  locale: string = "en-US"
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

// ✅ Build chart Y-axis safely
export const generateYAxis = (revenue: Revenue[] = []) => {
  const yAxisLabels: string[] = [];

  if (!Array.isArray(revenue) || revenue.length === 0) {
    return { yAxisLabels: ["$0K"], topLabel: 0 };
  }

  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

// ✅ Pagination for invoices/customers
export const generatePagination = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

// ✅ Correct formatter for fetched customer rows — returns numbers
export function formatCustomers(
  rows: CustomersTableType[]
): FormattedCustomersTable[] {
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    image_url: row.image_url,
    total_invoices: row.total_invoices ?? 0,
    total_pending: Number(row.total_pending) || 0, // keep as number
    total_paid: Number(row.total_paid) || 0, // keep as number
  }));
}
