import prisma from "@/app/utils/db";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import CheakLogin from "@/app/utils/hook";
import { formetCurrency } from "@/app/utils/formetCurrency";

async function getData(userId: string) {
  const data = await prisma.invoice.findMany({
    where: {
      userId: userId,
    },
    select: {
      currency: true,
      id: true,
      clientName: true,
      clientEmail: true,
      total: true,
    },
    take: 7,
  });

  return data;
}

export default async function Recentinvoice() {
  const session = await CheakLogin();
  const data = await getData(session.user?.id as string);
  return (
    <div>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {data.map((info) => (
            <div
              className="flex items-center justify-between pb-7"
              key={info.id}
            >
              <div className="flex gap-4 items-center">
                <p className="h-10 w-10 rounded-full bg-muted flex justify-center items-center font-semibold">
                  {info.clientName.slice(0, 2).toUpperCase()}
                </p>
                <div>
                  <p className="text-sm font-semibold">{info.clientName}</p>
                  <p className="text-sm font-light">{info.clientEmail}</p>
                </div>
              </div>

              <div>
                <p>
                  {formetCurrency({
                    amount: info.total,
                    currency: info.currency as any,
                  })}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
