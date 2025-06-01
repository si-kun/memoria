"use client";

import { Input } from "../ui/input";
import { Pencil, Search } from "lucide-react";
import { Button } from "../ui/button";
import AvatarComponent from "../avatar/AvatarComponent";
import { usePathname, useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { searchTarmAtom } from "@/atom/searchAtom";

const Header = () => {
  const router = useRouter();
  const url = usePathname();
  console.log(url);

  const [searchTerm, setSearchTerm] = useAtom(searchTarmAtom)

  const writtingText = url.includes("add-note")
    ? "Writing..."
    : url.includes("edit")
    ? "Editing..."
    : "New Note";

 


  return (
    <header className="w-full h-[60px] bg-gray-200 px-10 py-4 z-50 border-b border-gray-200 flex items-center justify-between">
      <h1 className="text-xl font-bold">Memoria</h1>
      <div className="relative w-[40%]">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          size={18}
        />
        <Input
          className="w-full pl-11"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-4">
        <Button
          className={`bg-blue-500 hover:bg-blue-600 ${
            writtingText !== "New Note" ? "animate-pulse" : ""
          }
          ${
            writtingText === "Editing..."
              ? "cursor-not-allowed"
              : "cursor-pointer"
          }`}
          onClick={() => {
            if (writtingText === "Editing...") return;
            router.push("/add-note");
          }}
        >
          <Pencil />
          <span>{writtingText}</span>
        </Button>
        <AvatarComponent />
      </div>
    </header>
  );
};

export default Header;
