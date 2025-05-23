import React from "react";
import { Checkbox } from "../ui/checkbox";

interface PublicCheckProps {
  checked: boolean;
  onChange: () => void;
}

const PublicCheck = ({ checked, onChange }: PublicCheckProps) => {
  return (
    <div className="flex items-center gap-1">
      <Checkbox
        id="public"
        checked={checked}
        onCheckedChange={onChange}
      />
      <label htmlFor="public">Public</label>
    </div>
  );
};

export default PublicCheck;
