import { DownloadCloudIcon, Mail, MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import { deleteInvoice, PaidInvoice, remiderEmail } from "@/app/utils/actions";
import InvoiceDelete from "./InvoiceDelete";

export default function InvoiceDropActions({ id }: { id: string }) {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"secondary"} size={"icon"}>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem asChild>
            <Link
              href={`/dashboard/invoices/${id}`}
              className="flex items-center gap-2 text-sm"
            >
              <Pencil className="size-4" />
              Edit Invoice
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`/api/invoices/${id}`}
              target="_blank"
              className="flex items-center gap-2"
            >
              <DownloadCloudIcon className="size-4" />
              Download Invoice
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <form action={remiderEmail} className="p-0 m-0">
              <Button
                variant={"secondary"}
                type="submit"
                className="flex p-0 h-4 bg-transparent font-normal hover:rounded-md border-0"
              >
                <input type="hidden" value={id} name="id" />
                <Mail className="size-4 " />
                Reminder Email
              </Button>
            </form>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <InvoiceDelete
              id={id}
              task={"Delete"}
              description={"are you sure you want to delete this invoice!"}
              action={deleteInvoice}
            />
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <InvoiceDelete
              id={id}
              task="Mark as Paid"
              description="are you sure you want to Edit this Invoice"
              action={PaidInvoice}
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
