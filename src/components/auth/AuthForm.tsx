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
import {
  FieldValues,
  Path,
  SubmitHandler,
  useFormContext,
} from "react-hook-form";
import Link from "next/link";

interface AuthFormProps<T extends FieldValues> {
  handleSignup?: SubmitHandler<T>;
  handleSignin?: SubmitHandler<T>;
  labelItems: signupLabelItem[] | signinLabelItemType[];
  buttonText: string;
  title: string;
  description: string;
  isSignup?: boolean;
}

const AuthForm = <T extends FieldValues>({
  handleSignup,
  handleSignin,
  labelItems,
  buttonText,
  title,
  description,
  isSignup,
}: AuthFormProps<T>) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useFormContext<T>();

  const onSubmit: SubmitHandler<T> = isSignup
    ? handleSignup || (() => Promise.resolve())
    : handleSignin || (() => Promise.resolve());

  return (
    <Card className="w-[40%]">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <AvatarComponent />
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <CardContent>
          <div className="grid w-full items-center gap-4">
            {labelItems.map((item) => (
              <div key={item.name}>
                <InputLabel {...item} {...register(item.name as Path<T>)} />
                {errors[item.name as Path<T>] && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors[item.name as Path<T>]?.message as string}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end w-full">
          {buttonText === "Sign In" && (
            <div className="flex items-center justify-between gap-2 w-full">
              <Button variant="link" className="cursor-pointer" asChild>
                <Link href="/signup">Don't have an account?</Link>
              </Button>
              <Button
                disabled={isSubmitting}
                type="submit"
                className="cursor-pointer"
              >
                {buttonText}
              </Button>
            </div>
          )}
          {buttonText === "Sign Up" && (
            <div className="flex items-center justify-between gap-2 w-full">
              <Button variant="link" className="cursor-pointer" asChild>
                <Link href="/signin">Already have an account?</Link>
              </Button>
              <Button
                disabled={isSubmitting}
                type="submit"
                className="cursor-pointer"
              >
                {buttonText}
              </Button>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export default AuthForm;
