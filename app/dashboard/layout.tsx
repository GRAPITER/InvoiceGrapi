import Image from "next/image";
import Link from "next/link";
import logo from "@/public/solscan-social-preview-removebg-preview.png";
import DashLinks from "@/components/dashboard/DashLinks";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "../utils/auth";
import CheakLogin from "../utils/hook";
import React from "react";
import db from "../utils/db";
import { redirect } from "next/navigation";

async function cheakBoard(userID: string) {
  const data = await db.user.findUnique({
    where: {
      id: userID,
    },
    select: {
      lastName: true,
      firstName: true,
      address: true,
    },
  });

  if (!data?.firstName || !data?.lastName || !data?.address) {
    redirect("/onbording");
  }
}

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await CheakLogin();
  await cheakBoard(session.user?.id as string);
  return (
    <>
      <div className="grid min-h-screen w-full lg:grid-cols-[300px_1fr] md:grid-cols-[220px_1fr]">
        {/* left side div part  */}
        <div className="hidden md:block bg-muted/40 border-r">
          <div className="flex flex-col max-h-screen h-full gap-2">
            <div className="h-14 flex items-center border-b px-4 lg:h-[60px] lg:px-6 overflow-hidden">
              <Link href={"/"} className="flex items-center ">
                <Image src={logo} alt="logo" className="w-14" />
                <p className="text-lg lg:text-2xl font-bold">
                  Invoice<span className="text-blue-600">Manager</span>
                </p>
              </Link>
            </div>
            <div className="flex-1 ">
              <nav className="grid items-start px-2 text-md font-medium lg:px-4">
                <DashLinks />
              </nav>
            </div>
          </div>
        </div>
        {/* now right sode div part start */}
        <div>
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button size={"icon"} variant={"outline"}>
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side={"left"}>
                <DialogTitle>
                  <nav className="mt-10 grid gap-2">
                    <DashLinks />
                  </nav>
                </DialogTitle>
              </SheetContent>
            </Sheet>
            <div className="ml-auto flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size={"icon"}
                    variant={"outline"}
                    className="rounded-full ml-auto"
                  >
                    <User className="size-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={"/dashboard"}>Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={"/dashboard/invoices"}>Invoices</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <form
                      className="w-full"
                      action={async () => {
                        "use server";
                        await signOut();
                      }}
                    >
                      <button className="w-full text-left" type="submit">
                        Log out
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
