import Image from "next/image";
import Link from "next/link";
import logo from "@/public/solscan-social-preview-removebg-preview.png";
import ButtonMain from "./ButtonMain";
export default function Navbar() {
  return (
    <div className="flex justify-between items-center">
      <Link href={"/"} className="flex items-center">
        <Image src={logo} alt="Logo" className="w-28 h-14" />
        <p className="text-2xl font-bold">
          Invoices<span className="text-blue-500">Grapi</span>
        </p>
      </Link>
      <ButtonMain />
    </div>
  );
}
