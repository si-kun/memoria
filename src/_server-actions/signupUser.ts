"use server"

import { SignupData } from "@/types"
import { prisma } from "@/utils/prisma/prismaClient"

export const singupUser = async(userId: string, signupData: SignupData) => {
   try {
    const user = await prisma.user.create({
        data: {
            id: userId,
            email: signupData.email,
            displayName: signupData.displayName,
            imageUrl: null,
        }
    })

    return {
        success: true,
        message: "User created successfully",
        data: user,
    }
   }catch(error) {
    return {
        success: false,
        message: "Failed to signup user",
        error: error,
    }
   }
}