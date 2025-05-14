"use client";

import { authRepository } from "@/lib/authRepository";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { userAtom } from "@/atom/userAtom";
import { getUserActions } from "@/_server-actions/getUserActions";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { getSessionUser } = authRepository();
  const [user, setUser] = useAtom(userAtom);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessionUser = async () => {
      try {

        if(user) {
          return
        }

        const result = await getSessionUser();
        const session = result.data?.session

        if (!result.success || !session?.user.id) {
          router.replace("/signin");
          return;
        }

        const userId = session.user.id
        const sessionUserResult = await getUserActions(userId)

        if(sessionUserResult && sessionUserResult.success && sessionUserResult.data) {
          setUser(sessionUserResult.data)
        } else {
          router.replace("/signin")
        }

      } catch (error) {
        // エラー処理
        console.log(error);
        router.replace("/signin");
      } finally {
        setIsLoading(false)
      }
    };

    fetchSessionUser();
  }, [router, getSessionUser, setUser, user]);

  if(isLoading) {
    return <div>Loading...</div>
  }

  if(!user) {
    return null
  }

  return <div>{children}</div>;
};

export default AuthGuard;
