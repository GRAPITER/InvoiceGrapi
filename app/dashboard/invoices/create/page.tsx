import prisma from "@/app/utils/db";
import CheakLogin from "@/app/utils/hook";
import CreateInvoice from "@/components/invoices/CreateInvoice";
import { Card, CardContent } from "@/components/ui/card";

async function BordingScan(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      firstName: true,
      lastName: true,
      email: true,
      address: true,
    },
  });

  return data;
}

export default async function page() {
  const session = await CheakLogin();
  const data = await BordingScan(session.user?.id as string);
  return (
    <div>
      <Card className="max-w-5xl mx-auto w-full">
        <CardContent className="p-6">
          <CreateInvoice
            firstName={data?.firstName as string}
            lastName={data?.lastName as string}
            email={data?.email as string}
            address={data?.address as string}
          />
        </CardContent>
      </Card>
    </div>
  );
}
