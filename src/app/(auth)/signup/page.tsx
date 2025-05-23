"use client";

import { SignupData } from "@/types";
import { authRepository } from "@/lib/authRepository";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import { signupLabelItems } from "./signupLabelItems";
import { singupUser } from "@/_server-actions/signupUser";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const signupSchema = z.object({
  displayName: z.string().min(1, {message: "Display name is required"}),
  email: z.string().email({message: "Invalid email address"}),
  password: z.string().min(8, {message: "Password must be at least 8 characters long"}),
  avatar: z.instanceof(File).optional(),
})

const SignupPage = () => {
  const methods = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      avatar: undefined,
    },
  });

  const router = useRouter();
  const { signup } = authRepository();

  const handleSignup = async () => {
    try {
      const authResult = await signup(methods.getValues());

      if (!authResult.success) {
        console.log(authResult.message);
      }

      if (authResult.success && authResult.supabaseUserId) {
        const userResult = await singupUser(
          authResult.supabaseUserId,
          methods.getValues()
        );
        if (!userResult.success) {
          console.log(userResult.message);
        }
        router.replace("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider {...methods}>
      <AuthForm
        handleSignup={handleSignup}
        labelItems={signupLabelItems}
        buttonText="Signup"
        title="Signup"
      />
    </FormProvider>
  );
};

export default SignupPage;
