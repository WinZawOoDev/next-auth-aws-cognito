"use server";

import { signIn, signOut, auth } from "@/auth";
import {
    signOut as cognitoSignOut,
    confirmForgotPassword,
    confirmSignUp,
    forgotPassword,
    resendConfirmationCode,
    signUp
} from "./cognito-identity-client"
import { otpSchema, registerSchema, resetPasswordSchema } from "./validator";
import { permanentRedirect, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";


export async function registerUser(prevState: any, formData: FormData) {

    // Extract form data
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    // Validate form data
    const result = registerSchema.safeParse({
        name,
        email,
        password,
        confirmPassword,
    })

    // If validation fails, return errors
    if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        return {
            success: false,
            errors: {
                name: errors.name?.[0],
                email: errors.email?.[0],
                password: errors.password?.[0],
                confirmPassword: errors.confirmPassword?.[0],
            },
        }
    }

    try {

        const registered = await signUp({ email, password });
        console.log("🚀 ~ registerUser ~ registered:", registered);

        return redirect(`/register/verify?${new URLSearchParams({ email })}`);

    } catch (error) {
        return {
            success: false,
            errors: {
                form: "An error occurred during registration. Please try again.",
            },
        }
    }
}


export async function confirmRegister(formData: FormData) {
    const email = formData.get("email") as string;
    const otpCode = formData.get("otpCode") as string;

    const confirmed = await confirmSignUp({ email, otpCode });
}


export async function resendConfirmCode(formData: FormData) {
    const email = formData.get("email") as string;
    const resend = await resendConfirmationCode(email);
}


export async function logIn(prevState: any, formData: FormData): Promise<{ message: string, error: string }> {
    formData.append("redirectTo", "/");
    const sessions = await signIn("credentials", formData);
    return {
        message: "Login successful",
        error: "",
    }
}


export async function passwordForgot(formData: FormData) {

    // Get email from form data
    const email = formData.get("email") as string;

    const requestedForgot = await forgotPassword(email);

    redirect(`/reset-password/verify?${new URLSearchParams({ email })}`);
}

export async function confirmResetPassword(formData: FormData) {

    const email = formData.get("email") as string;
    let otpCode: string = "";

    Array.from({ length: 6 }).forEach((_, index) => {
        const digit = formData.get(`digit-${index + 1}`) as string;
        otpCode += digit;
    });

    // Validate OTP format
    // const result = otpSchema.safeParse({ otpCode });

    // if (!result.success) {
    //     return {
    //         success: false,
    //         message: "Invalid OTP format. Please enter 6 digits.",
    //     }
    // }

    const redirectTo = `/reset-password/new-password?${new URLSearchParams({
        email,
        otpCode,
    })}`;

    revalidatePath(redirectTo);
    permanentRedirect(redirectTo);
}

export async function resetPassword(formData: FormData) {

    console.log("🚀 ~ resetPassword ~ formData:", formData);
    // Get form data
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const email = formData.get("email") as string;
    const otpCode = formData.get("otpCode") as string;

    // Validate password format
    // const result = resetPasswordSchema.safeParse({ password, confirmPassword });

    //   if (!result.success) {
    //     const errors = result.error.flatten().fieldErrors;
    //     return {
    //       success: false,
    //       message: Object.values(errors)[0]?.[0] || "Invalid password format.",
    //     };
    //   }

    const confirmed = await confirmForgotPassword({
        email,
        otpCode,
        newPassword: password,
    });

    revalidatePath("/login");
    permanentRedirect("/login");

}

export async function logOut() {
    const session = await auth();
    await cognitoSignOut(session?.accessToken as string);
    await signOut({ redirectTo: "/" });
}


