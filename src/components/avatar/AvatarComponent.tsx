import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const AvatarComponent = () => {
  return (
    <Avatar className="w-12 h-12">
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
};

export default AvatarComponent;
