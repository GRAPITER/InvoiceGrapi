import InfoInvoice from "@/components/dashboard/InfoInvoice";
import InvoiceChart from "@/components/dashboard/InvoiceChart";
import Recentinvoice from "@/components/dashboard/Recentinvoice";
import { Suspense } from "react";
import Loading from "../loading";

export default async function page() {
  return (
    <Suspense fallback={<Loading />}>
      <InfoInvoice />
      <div className="grid lg:grid-cols-3 gap-3 lg:gap-6 mt-6">
        <InvoiceChart />
        <Recentinvoice />
      </div>
    </Suspense>
  );
}
