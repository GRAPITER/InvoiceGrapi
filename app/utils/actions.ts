"use server";
import db from "@/app/utils/db";
import { parseWithZod } from "@conform-to/zod";
import CheakLogin from "./hook";
import { invoiceSchema, onbordingSchema } from "./schemas";
import { redirect } from "next/navigation";
import { client } from "./mailtrap";
import { format } from "date-fns";
import { formetCurrency } from "./formetCurrency";
import prisma from "@/app/utils/db";
import { revalidatePath } from "next/cache";
import { env } from "node:process";

export async function onbording(prevState: any, formdata: FormData) {
  const session = await CheakLogin();

  const submission = parseWithZod(formdata, {
    schema: onbordingSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await db.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      lastName: submission.value.firstName,
      firstName: submission.value.lastName,
      address: submission.value.address,
    },
  });

  redirect("/dashboard");
}

export async function createInvoice(prevState: any, formData: FormData) {
  const session = await CheakLogin();

  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }
  console.log("submission", submission);
  const data = await db.invoice.create({
    data: {
      clientAddress: submission.value.clientAddress,
      clientEmail: submission.value.clientEmail,
      clientName: submission.value.clientName,
      currency: submission.value.currency,
      date: submission.value.date,
      dueDate: submission.value.dueDate,
      fromAddress: submission.value.fromAddress,
      fromEmail: submission.value.fromEmail,
      fromName: submission.value.fromName,
      invoiceItemDescription: submission.value.invoiceItemDescription,
      invoiceItemQuantity: submission.value.invoiceItemQuantity,
      invoiceItemRate: submission.value.invoiceItemRate,
      invoiceName: submission.value.invoiceName,
      invoiceNumber: submission.value.invoiceNumber,
      status: submission.value.status,
      total: submission.value.total,
      note: submission.value.note,
      userId: session.user?.id,
    },
  });

  const sender = {
    name: "Asjad Ali",
    email: "hello@demomailtrap.com",
  };

  const recipients = [
    {
      email: "asjad.ali5968@gmail.com",
    },
  ];

  client.send({
    from: sender,
    to: recipients,
    template_uuid: "2c053295-5b40-4fa7-8c0b-1406c8ade04f",
    template_variables: {
      clientName: submission.value.clientName,
      invoiceNumber: submission.value.invoiceNumber,
      dueDate: format(new Date(submission.value.date), "dd/MM/yyyy"),
      totalAmount: formetCurrency({
        amount: submission.value.total,
        currency: submission.value.currency as any,
      }),
      invoiceLink:
        process.env.NODE_ENV !== "production"
          ? `http://localhost:3000/api/invoices/${data.id}`
          : `https://invoice-grapi.vercel.app//api/invoices/${data.id}`,
    },
  });

  redirect("/dashboard/invoices");
}

export async function Invoices() {
  const session = await CheakLogin();
  const data = await db.invoice.findMany({
    where: {
      userId: session.user?.id,
    },
    select: {
      id: true,
      invoiceNumber: true,
      clientName: true,
      createdAt: true,
      status: true,
      total: true,
      currency: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}

export async function editInvoices(prevState: any, formData: FormData) {
  const session = await CheakLogin();

  const submission = parseWithZod(formData, { schema: invoiceSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await db.invoice.update({
    where: {
      userId: session.user?.id,
      id: formData.get("id") as string,
    },
    data: {
      clientAddress: submission.value.clientAddress,
      clientEmail: submission.value.clientEmail,
      clientName: submission.value.clientName,
      currency: submission.value.currency,
      date: submission.value.date,
      dueDate: submission.value.dueDate,
      fromAddress: submission.value.fromAddress,
      fromEmail: submission.value.fromEmail,
      fromName: submission.value.fromName,
      invoiceItemDescription: submission.value.invoiceItemDescription,
      invoiceItemQuantity: submission.value.invoiceItemQuantity,
      invoiceItemRate: submission.value.invoiceItemRate,
      invoiceName: submission.value.invoiceName,
      invoiceNumber: submission.value.invoiceNumber,
      status: submission.value.status,
      total: submission.value.total,
      note: submission.value.note,
    },
  });

  const sender = {
    email: "hello@demomailtrap.com",
    name: "Mailtrap Test",
  };
  const recipients = [
    {
      email: "asjad.ali5968@gmail.com",
    },
  ];

  client.send({
    from: sender,
    to: recipients,
    template_uuid: "11df9049-724c-4982-b930-cb3a9bbf0a9b",
    template_variables: {
      clientName: submission.value.clientName,
      invoiceNumber: submission.value.invoiceNumber,
      dueDate: format(new Date(submission.value.date), "dd/MM/yyyy"),
      totalAmount: formetCurrency({
        amount: submission.value.total,
        currency: submission.value.currency as any,
      }),
      invoiceLink:  process.env.NODE_ENV !== "production"
      ? `http://localhost:3000/api/invoices/${data.id}`
      : `https://invoice-grapi.vercel.app//api/invoices/${data.id}`,,
    },
  });

  redirect("/dashboard/invoices");
}

export async function remiderEmail(formData: FormData) {
  const session = await CheakLogin();
  const id = formData.get("id") as string;

  const data = await prisma.invoice.findUnique({
    where: {
      id: id,
      userId: session.user?.id,
    },
  });

  if (!data) {
    throw new Error("there is an error on reminder");
  }

  const sender = {
    email: "hello@demomailtrap.com",
    name: "Mailtrap Test",
  };
  const recipients = [
    {
      email: "asjad.ali5968@gmail.com",
    },
  ];

  client.send({
    from: sender,
    to: recipients,
    template_uuid: "a95fe37b-be69-409c-8172-0f7b0c7e5205",
    template_variables: {},
  });
}

export async function deleteInvoice(formData: FormData) {
  const session = await CheakLogin();
  const id = formData.get("id") as string;

  await prisma.invoice.delete({
    where: {
      id: id,
      userId: session.user?.id,
    },
  });

  revalidatePath("/dashboard/invoices");
}

export async function PaidInvoice(formData: FormData) {
  const session = await CheakLogin();
  const id = formData.get("id") as string;

  await prisma.invoice.update({
    where: {
      userId: session.user?.id,
      id: id,
    },
    data: {
      status: "PAID",
    },
  });
  revalidatePath("/dashboard/invoices");
}
