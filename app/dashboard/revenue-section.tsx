// app/dashboard/revenue-section.tsx
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import { fetchRevenue } from "@/app/lib/data";

// This component isolates the revenue chart section.
// It simulates a slow data fetch to demonstrate Suspense streaming.

export default async function RevenueSection() {
  // Fetch the revenue data (with artificial 3-second delay inside data.ts)
  const revenue = await fetchRevenue();

  return <RevenueChart revenue={revenue} />;
}
