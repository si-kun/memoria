"use client";

import { userAtom } from "@/atom/userAtom";
import { useAtom } from "jotai";

export default function Home() {
  const [user, setUser] = useAtom(userAtom);

  if(!user) {
    return <div>Loading...</div>
  }

  return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        Home
      </div>
  );
}
