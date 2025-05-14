

import { SigninData, SignupData } from "@/types";
import { supabase } from "@/utils/supabase/client";

export const authRepository =  () => {
  const signup = async (signupData: SignupData) => {

    try {
      const result = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            displayName: signupData.displayName,
          },
        },
      });
  
      if (result.error) {
        throw new Error("Failed to signup");
      }

      const supabaseUserId = result.data.user?.id
  
      return {
        success: true,
        message: "Signup successful",
        data: result,
        supabaseUserId: supabaseUserId,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Signup failed",
        data: null,
      };
    }
  }

  const signin = async(signinData: SigninData) => {
    try {
      const result = await supabase.auth.signInWithPassword({
        email: signinData.email,
        password: signinData.password,
      })

      if(result.error) {
        throw new Error("Failed to signin")
      }
      return {
        success: true,
        message: "Signin successful",
        data: result,
      }
      
    } catch(error) {
      return {
        success: false,
        message: "Signin failed",
        data: null,
        error: error,
      }
    }
  }

  const getSessionUser = async() => {
    try {
      const {data, error} = await supabase.auth.getSession()

      if(error) {
        return {
          success: false,
          message: "Failed to get user",
          data: null,
          error: error,
        }
      }

      return {
        success: true,
        message: "User fetched successfully",
        data: data,
      }
      
    } catch(error) {
      return {
        success: false,
        message: "Failed to get user",
        data: null,
        error: error,
      }
    }
  }



  return {
    signup,
    signin,
    getSessionUser,
  }
};
