import React, { ChangeEvent } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface InputLabelProps {
  label: string;
  type: string;
  name: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputLabel = ({
  label,
  type,
  name,
  placeholder,
  onChange,
}: InputLabelProps) => {
  return (
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

export default InputLabel;
