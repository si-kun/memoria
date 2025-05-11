"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import InputLabel from "@/components/auth/InputLabel";
import { signupLabelItems } from "./signupLabelItems";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { SignupData } from "@/types";

const SignupPage = () => {

  const [signupData, setSignupData] = useState<SignupData>({
    displayName: "",
    email: "",
    password: "",
    avatar: null,
  });

  const handleChange = (Key: keyof SignupData, value: string | File | null) => {
    setSignupData((prev) => ({
      ...prev,
      [Key]: value,
    }))
  }

  const handleSignup = () => {
    console.log(signupData);
  }

  return (
    <Card className="w-[40%]">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Signup</CardTitle>
            <CardDescription>Create an account to get started.</CardDescription>
          </div>
          <Avatar className="w-12 h-12">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            {signupLabelItems.map((item) => (
              <InputLabel key={item.id} {...item} handleChange={handleChange} />
            ))}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSignup} className="cursor-pointer">Signup</Button>
      </CardFooter>
    </Card>
  );
};

export default SignupPage;
