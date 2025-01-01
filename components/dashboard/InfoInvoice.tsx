import { CheckCheck, EqualNot, PersonStandingIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import prisma from "@/app/utils/db";
import CheakLogin from "@/app/utils/hook";
import { formetCurrency } from "@/app/utils/formetCurrency";

async function getData(userId: string) {
  const [data, paidInvoice, unpaidInvoices] = await Promise.all([
    prisma.invoice.findMany({
      where: {
        userId: userId,
      },
      select: {
        total: true,
      },
    }),
    prisma.invoice.findMany({
      where: {
        userId: userId,
        status: "PAID",
      },
      select: {
        id: true,
      },
    }),
    prisma.invoice.findMany({
      where: {
        userId: userId,
        status: "PENDING",
      },
      select: {
        id: true,
      },
    }),
  ]);

  return { data, paidInvoice, unpaidInvoices };
}

export default async function InfoInvoice() {
  const session = await CheakLogin();
  const data = await getData(session.user?.id as string);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="w-full flex justify-between items-center p-0">
            <div>
              <p className="font-normal">Total Revenue</p>
            </div>
            <div>
              <p className="text-muted-foreground text-lg font-semibold">$</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">
            {formetCurrency({
              amount: data.data.reduce(
                (acc, invoice) => acc + invoice.total,
                0
              ),
              currency: "USD",
            })}
          </p>
          <p className="pt-3 text-sm text-muted-foreground">
            Based on the last 30 Days
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="w-full flex justify-between items-center p-0">
            <div>
              <p className="font-normal">Total Invoice Issued</p>
            </div>
            <div>
              <p className="text-muted-foreground text-lg font-semibold">
                <PersonStandingIcon />
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">+{data.data.length}</p>
          <p className="pt-3 text-sm text-muted-foreground">
            Total Invoice Issued!
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="w-full flex justify-between items-center p-0">
            <div>
              <p className="font-normal">Paid Invoices</p>
            </div>
            <div>
              <p className="text-muted-foreground text-lg font-semibold">
                <CheckCheck />
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">+{data.paidInvoice.length}</p>
          <p className="pt-3 text-sm text-muted-foreground capitalize">
            total invoices which have been paid!
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="w-full flex justify-between items-center p-0">
            <div>
              <p className="font-normal">Unpaid Invoices</p>
            </div>
            <div>
              <p className="text-muted-foreground text-lg font-semibold">
                <EqualNot />
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">
            +{data.unpaidInvoices.length}
          </p>
          <p className="pt-3 text-sm text-muted-foreground">
            total invoices which have not been paid!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
