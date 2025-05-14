"use client";

import AuthForm from "@/components/auth/AuthForm";
import React, {  useState } from "react";
import { SigninData } from "@/types";
import { signinLabelItems } from "./signinLabelItems";
import { useRouter } from "next/navigation";
import { authRepository } from "@/lib/authRepository";
import { getUserActions } from "@/_server-actions/getUserActions";
import {  useSetAtom } from "jotai";
import { userAtom } from "@/atom/userAtom";

const SigninPage = () => {
  const { signin, getSessionUser } = authRepository();
  const setUser = useSetAtom(userAtom)
  const router = useRouter();

  const [signinData, setSigninData] = useState<SigninData>({
    email: "",
    password: "",
  });

  const handleChange = (key: string, value: string | File | null) => {
    setSigninData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSignin = async () => {
    // サインイン処理
    try {
      const authResult = await signin(signinData);
      const sessionUserResult = await getSessionUser();

      if (authResult && !authResult?.success) {
        console.log(authResult.message);
        return;
      }

      if(sessionUserResult && !sessionUserResult?.success) {
        console.log(sessionUserResult.message);
        return;
      }
      
      const userId = sessionUserResult.data?.session?.user.id

      console.log(authResult.message);

      console.log(userId)
      if(userId) {
        const userActionsResult = await getUserActions(userId);
        setUser(userActionsResult.data);
        console.log("ユーザーデータをセット:", userActionsResult.data);
      }

      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthForm
      labelItems={signinLabelItems}
      handleChange={handleChange}
      handleSignin={handleSignin}
      buttonText="Sign In"
      title="Sign In"
    />
  );
};

export default SigninPage;
