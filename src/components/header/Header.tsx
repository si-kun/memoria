import React from "react";
import { Input } from "../ui/input";
import { Pencil, Search } from "lucide-react";
import { Button } from "../ui/button";

const Header = () => {
  return (
    <header className="w-full h-[60px] bg-gray-100 px-10 z-50 border-b border-gray-200 flex items-center justify-between">
      <h1 className="text-xl font-bold">Memoria</h1>
      <div className="relative w-[40%]">
        <Input className="w-full pl-11" />
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          size={18}
        />
      </div>
      <Button className="bg-blue-500 hover:bg-blue-600 cursor-pointer">
        <Pencil />
        <span>New Note</span>
      </Button>
    </header>
  );
};

export default Header;
