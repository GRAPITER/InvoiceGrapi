import prisma from "@/app/utils/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Graph from "./Graph";
import CheakLogin from "@/app/utils/hook";
import { format } from "date-fns";

async function getData(userId: string) {
  const rawData = await prisma.invoice.findMany({
    where: {
      userId: userId,
      status: "PAID",
    },
    select: {
      createdAt: true,
      total: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  //to add the total of same date
  const aggregated = rawData.reduce((acc: { [key: string]: number }, curr) => {
    const date = format(new Date(curr.createdAt), "dd MMMM");

    acc[date] = (acc[date] || 0) + curr.total;

    return acc;
  }, {});

  //now make this array

  const arrayData = Object.entries(aggregated).map(([date, amount]) => ({
    date,
    amount,
  }));

  return arrayData;
}

export default async function InvoiceChart() {
  const sesion = await CheakLogin();
  const data = await getData(sesion.user?.id as string);
  console.log(data);
  return (
    <div className="col-span-2">
      <Card>
        <CardHeader>
          <CardTitle>Paid Invoices</CardTitle>
          <CardDescription>
            Invoices which have been paid in the last 30 days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Graph data={data} />
        </CardContent>
      </Card>
    </div>
  );
}
