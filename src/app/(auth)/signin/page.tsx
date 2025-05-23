"use client";

import AuthForm from "@/components/auth/AuthForm";
import { SigninData } from "@/types";
import { signinLabelItems } from "./signinLabelItems";
import { useRouter } from "next/navigation";
import { authRepository } from "@/lib/authRepository";
import { getUserActions } from "@/_server-actions/getUserActions";
import { useSetAtom } from "jotai";
import { userAtom } from "@/atom/userAtom";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const SigninPage = () => {
  const { signin, getSessionUser } = authRepository();
  const setUser = useSetAtom(userAtom);
  const router = useRouter();

  const methods = useForm<SigninData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { getValues} =  methods;


  const handleSignin = async () => {
    // サインイン処理
    try {
      const {email, password} = getValues();
      console.log(email, password);
      const signinData = {email, password};
      const authResult = await signin(signinData);
      const sessionUserResult = await getSessionUser();

      if (authResult && !authResult?.success) {
        toast.error(authResult.message);
        return;
      }

      if (sessionUserResult && !sessionUserResult?.success) {
        toast.error(sessionUserResult.message);
        return;
      }

      const userId = sessionUserResult.data?.session?.user.id;

      if (userId) {
        const userActionsResult = await getUserActions(userId);
        setUser(userActionsResult.data);
      }

      router.push("/");
    } catch (error) {
      toast.error("ログインに失敗しました");
      console.log(error);
    }
  };

  return (
    <FormProvider {...methods}>
      <AuthForm
        labelItems={signinLabelItems}
        handleSignin={handleSignin}
        buttonText="Sign In"
        title="Sign In"
      />
    </FormProvider>
  );
};

export default SigninPage;
