// app/dashboard/(overview)/page.tsx
export const dynamic = "force-dynamic"; // prevents static prerendering

import { Card } from "@/app/ui/dashboard/cards";
import LatestInvoicesWrapper from "@/app/ui/dashboard/latest-invoices-wrapper";
import { lusitana } from "@/app/ui/fonts";

export const metadata = {
  title: "Dashboard Overview",
};

export default function OverviewPage() {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-8">
      <h1 className={`${lusitana.className} text-3xl font-bold`}>
        Dashboard Overview
      </h1>

      {/* Example card */}
      <Card title="Welcome" value="-" type="collected" />

      {/* Latest invoices (dynamic) */}
      <LatestInvoicesWrapper />
    </div>
  );
}
