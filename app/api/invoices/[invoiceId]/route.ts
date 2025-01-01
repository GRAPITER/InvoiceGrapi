import { jsPDF } from "jspdf";

import prisma from "@/app/utils/db";
import { formetCurrency } from "@/app/utils/formetCurrency";
import { NextResponse } from "next/server";
import { format } from "date-fns";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  const { invoiceId } = await params;

  const data = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
    },
  });

  if (!data) {
    return NextResponse.json({ error: "invoice not found" }, { status: 404 });
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  //set font
  doc.setFont("helvetica");

  //set header
  doc.setFontSize(24);
  doc.text(data.invoiceName, 20, 20);

  //set from section
  doc.setFontSize(12);
  doc.text("From:", 20, 40);
  doc.setFontSize(10);
  doc.text([data.fromName, data.fromEmail, data.fromAddress], 20, 45);

  //set client section
  doc.setFontSize(12);
  doc.text("Bill to:", 20, 70);
  doc.setFontSize(10);
  doc.text([data.clientName, data.clientEmail, data.clientAddress], 20, 75);

  //set client section
  doc.setFontSize(10);
  doc.text(`Invoice Number: #${data.invoiceNumber}`, 120, 40);
  doc.text(`Date: ${format(new Date(data.date), "dd MMMM,yyyy")}`, 120, 45);
  doc.text(`Due date: Net ${data.dueDate}`, 120, 50);

  //item table header
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Description", 20, 100);
  doc.text("Quantity", 100, 100);
  doc.text("Rate", 130, 100);
  doc.text("Total", 160, 100);

  //table line
  doc.line(20, 102, 190, 102);

  //table value
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(data.invoiceItemDescription, 20, 110);
  doc.text(data.invoiceItemQuantity.toString(), 100, 110);
  doc.text(
    formetCurrency({
      amount: data.invoiceItemRate,
      currency: data.currency as any,
    }),
    130,
    110
  );

  doc.text(
    formetCurrency({ amount: data.total, currency: data.currency as any }),
    160,
    110
  );
  //total section
  doc.line(20, 115, 190, 115);
  doc.setFont("helvetica", "bold");
  doc.text(`Total (${data.currency})`, 130, 130);
  doc.text(
    formetCurrency({ amount: data.total, currency: data.currency as any }),
    160,
    130
  );

  //Additional Note
  if (data.note) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Note:", 20, 150);
    doc.text(data.note, 20, 155);
  }

  //doc output as buffer
  const pdfFile = doc.output("arraybuffer");

  return new NextResponse(pdfFile, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
    },
  });
}
