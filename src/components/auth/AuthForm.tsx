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

interface AuthFormProps {
  handleChange: (key: string, value: string | File | null) => void;
  handleSignup?: () => void;
  handleSignin?: () => void;
  labelItems: signupLabelItem[] | signinLabelItemType[];
  buttonText: string;
  title: string;
}

const AuthForm = ({
  handleChange,
  handleSignup,
  handleSignin,
  labelItems,
  buttonText,
  title,
}: AuthFormProps) => {
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
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            {labelItems.map((item) => (
              <InputLabel
                key={item.name}
                {...item}
                onChange={(e) =>
                  handleChange(item.name, e.target.value)
                }
              />
            ))}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSignup || handleSignin} className="cursor-pointer">
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
