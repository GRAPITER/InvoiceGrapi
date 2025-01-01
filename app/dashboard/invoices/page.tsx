import Loading from "@/app/loading";
import InvoiceTable from "@/components/invoices/InvoiceTable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function page() {
  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-semibold mb-1">
                invoices
              </CardTitle>
              <CardDescription className="capitalize">
                manage your invoices here
              </CardDescription>
            </div>
            <div>
              <Button>
                <Link
                  href="/dashboard/invoices/create"
                  className="flex items-center justify-between gap-2"
                >
                  <PlusIcon className="size-4 " /> Create Invoice
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Loading />}>
            <InvoiceTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
