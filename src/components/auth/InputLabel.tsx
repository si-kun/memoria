import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useFormContext } from "react-hook-form";

interface InputLabelProps {
  label: string;
  type: string;
  name: string;
  placeholder: string;
}

const InputLabel = ({
  label,
  type,
  name,
  placeholder,
}: InputLabelProps) => {

  const {register} = useFormContext();

  return (
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        type={type}
        id={name}
        placeholder={placeholder}
        {...register(name)}
      />
    </div>
  );
};

export default InputLabel;
