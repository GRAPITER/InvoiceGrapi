import { auth } from "@/app/utils/auth";

import Link from "next/link";
import { RainbowButton } from "../ui/rainbow-button";

export default async function ButtonMain() {
  const session = await auth();
  return (
    <div className="">
      <RainbowButton>
        {!session?.user?.id ? (
          <Link href={"/login"}>Login here</Link>
        ) : (
          <Link href={"/dashboard"}>Start Here</Link>
        )}
      </RainbowButton>
    </div>
  );
}
