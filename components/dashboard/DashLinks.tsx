"use client";
import { cn } from "@/lib/utils";
import { HomeIcon, User2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashLinks() {
  const pathname = usePathname();
  const links = [
    {
      iD: 1,
      name: "Dashboard",
      href: "/dashboard",
      icon: HomeIcon,
    },
    {
      iD: 2,
      name: "Invoices",
      href: "/dashboard/invoices",
      icon: User2,
    },
  ];
  return (
    <div>
      {links.map((link) => {
        return (
          <Link
            href={link.href}
            key={link.iD}
            className={cn(
              pathname === link.href
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground",
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary my-2"
            )}
          >
            <link.icon className="size-4" /> {link.name}
          </Link>
        );
      })}
    </div>
  );
}
