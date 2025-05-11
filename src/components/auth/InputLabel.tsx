import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { SignupData } from "@/types";

interface InputLabelProps {
  label: string;
  name: string;
  id: string;
  placeholder: string;
  type: string;
  handleChange: (Key: keyof SignupData, value: string | File | null) => void;
}

const InputLabel = ({
  label,
  name,
  id,
  placeholder,
  type,
  handleChange,
}: InputLabelProps) => {
  return (
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        onChange={(e) => handleChange(name as keyof SignupData, e.target.value)}
      />
    </div>
  );
};

export default InputLabel;
