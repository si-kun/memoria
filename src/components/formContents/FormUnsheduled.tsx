import { Calendar } from "lucide-react";
import React from "react";
import { Checkbox } from "../ui/checkbox";
import { ToggleKey } from "@/app/(private)/add-note/page";

interface FormUnsheduledProps {
  checked: boolean;
  onChange: (checked: boolean, key: ToggleKey) => void;
}

const FormUnsheduled = ({ checked, onChange }: FormUnsheduledProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2 items-center mb-1">
        <Calendar className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-500">Schedule</span>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="scheduled"
          checked={checked}
          onCheckedChange={(checked) =>
            onChange(checked as boolean, "unScheduled")
          }
        />
        <label
          htmlFor="scheduled"
          className=" leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Unscheduled
        </label>
      </div>
    </div>
  );
};

export default FormUnsheduled;
