import prisma from "@/app/utils/db";
import CheakLogin from "@/app/utils/hook";
import EditInvoice from "@/components/invoices/EditInvoice";
import { notFound } from "next/navigation";

async function getData(UserId: string, invoiceId: string) {
  const data = prisma.invoice.findUnique({
    where: {
      userId: UserId,
      id: invoiceId,
    },
  });
  if (!data) {
    return notFound();
  }
  return data;
}

export default async function page({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = await params;
  const session = await CheakLogin();

  const data = await getData(session.user?.id as string, invoiceId);

  return <EditInvoice data={data!} />;
}
