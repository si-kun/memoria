import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import InputLabel from "./InputLabel";
import { Button } from "../ui/button";
import { signupLabelItem } from "@/app/(auth)/signup/signupLabelItems";
import { signinLabelItemType } from "@/app/(auth)/signin/signinLabelItems";
import AvatarComponent from "../avatar/AvatarComponent";
import { useFormContext, SubmitHandler, FieldValues } from "react-hook-form";

interface AuthFormProps {
  handleSignup?: SubmitHandler<FieldValues>;
  handleSignin?: SubmitHandler<FieldValues>;
  labelItems: signupLabelItem[] | signinLabelItemType[];
  buttonText: string;
  title: string;
}

const AuthForm = ({
  handleSignup,
  handleSignin,
  labelItems,
  buttonText,
  title,
}: AuthFormProps) => {
  const {
    register,
    handleSubmit,
  } = useFormContext();

  return (
    <Card className="w-[40%]">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>Create an account to get started.</CardDescription>
          </div>
          <AvatarComponent />
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit((handleSignup ?? handleSignin)!)} className="flex flex-col gap-4">
        <CardContent>
          <div className="grid w-full items-center gap-4">
            {labelItems.map((item) => (
              <InputLabel key={item.name} {...item} {...register(item.name)} />
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" className="cursor-pointer">
            {buttonText}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AuthForm;
