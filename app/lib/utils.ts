import {
  Revenue,
  CustomersTableType,
  FormattedCustomersTable,
} from "./definitions";

// ✅ Format cents → USD
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

// ✅ Build chart Y-axis
export const generateYAxis = (revenue: Revenue[]) => {
  const yAxisLabels = [];
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

// ✅ Correct formatter for fetched customer rows
// ✅ Correct formatter for fetched customer rows
export function formatCustomers(
  rows: CustomersTableType[]
): FormattedCustomersTable[] {
  return rows.map((row) => {
    // Ensure values are valid numbers before formatting
    const pending = Number(row.total_pending) || 0;
    const paid = Number(row.total_paid) || 0;

    return {
      id: row.id,
      name: row.name,
      email: row.email,
      image_url: row.image_url,
      total_invoices: row.total_invoices ?? 0,
      total_pending: formatCurrency(pending),
      total_paid: formatCurrency(paid),
    };
  });
}
