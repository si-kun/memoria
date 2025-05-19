import React from "react";
import DatePicker from "react-datepicker";

interface FormDatePicekerProps {
  title: string;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  disabled: boolean;
}

const FormDatePiceker = ({
  title,
  selectedDate,
  setSelectedDate,
  disabled,
}: FormDatePicekerProps) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <span>{title}</span>
      <DatePicker
        disabled={disabled}
        dateFormat={"yyyy/MM/dd HH:mm"}
        locale={"ja"}
        showTimeSelect
        timeIntervals={15}
        timeFormat={"HH:mm"}
        className={`w-full p-2 rounded-md border-2 border-gray-300 text-center ${
          disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "cursor-pointer"
        }`}
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date ?? selectedDate)}
        popperPlacement="bottom-start"
      />
    </div>
  );
};

export default FormDatePiceker;
