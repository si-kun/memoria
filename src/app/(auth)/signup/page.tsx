"use client";

import { useState } from "react";
import { SignupData } from "@/types";
import { authRepository } from "@/lib/authRepository";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import { signupLabelItems } from './signupLabelItems';
import { singupUser } from "@/_server-actions/signupUser";

const SignupPage = () => {

  const router = useRouter()
  const {signup} = authRepository()
  const [signupData, setSignupData] = useState<SignupData>({
    displayName: "",
    email: "",
    password: "",
    avatar: null,
  });

  const handleChange = (key: string, value: string | File | null) => {
    setSignupData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };


  const handleSignup = async() => {
    try {
      const authResult = await signup(signupData)

      if(!authResult.success) {
        console.log(authResult.message)
      }

      if(authResult.success && authResult.supabaseUserId) {
        const userResult = await singupUser(authResult.supabaseUserId, signupData)
        if(!userResult.success) {
          console.log(userResult.message)
        }
        router.replace("/")
      }

    } catch(error) {
      console.error(error)
    }

  }

  return (
    <AuthForm
    handleChange={handleChange}
    handleSignup={handleSignup}
    labelItems={signupLabelItems}
    buttonText="Signup"
    title="Signup"
    />
  );
};

export default SignupPage;
