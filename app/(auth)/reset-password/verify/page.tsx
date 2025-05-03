import React from "react";
import AlignedCenterContainer from "@/components/aligned-center-container";
import OTPVerificationForm from "@/components/auth/otp-verification-form";
import { SearchParams } from "next/dist/server/request/search-params";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { permanentRedirect } from "next/navigation";
import { resendConfirmationCode } from "@/lib/cognito-identity-client";

// Define OTP validation schema
const otpSchema = z.object({
  otpCode: z
    .string()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d+$/, { message: "OTP must contain only numbers" }),
});

// Server action to verify OTP
async function verifyOTP(formData: FormData) {
  "use server";

  const email = formData.get("email") as string;
  let otpCode: string = "";

  Array.from({ length: 6 }).forEach((_, index) => {
    const digit = formData.get(`digit-${index + 1}`) as string;
    otpCode += digit;
  });

  // Validate OTP format
  const result = otpSchema.safeParse({ otpCode });

  //   if (!result.success) {
  //     return {
  //       success: false,
  //       message: "Invalid OTP format. Please enter 6 digits.",
  //     }
  //   }

  const redirectTo = `/reset-password/new-password?${new URLSearchParams({
    email,
    otpCode,
  })}`;
  revalidatePath(redirectTo);
  permanentRedirect(redirectTo);
}

// Server action to resend OTP
async function resendOTP(formData: FormData) {
  "use server";

  const email = formData.get("email") as string;
  if (!email) {
    throw new Error("Email is required to resend OTP.");
  }
  const resentCode = await resendConfirmationCode(email);
  // Implement logic to resend OTP using the email
  console.log(`Resending OTP to email: ${email}`);
}

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = (await searchParams) as { email: string };
  return (
    <AlignedCenterContainer>
      <OTPVerificationForm
        title="Verify Your Password Reset"
        email={params.email}
        verifyAction={verifyOTP}
        resendAction={resendOTP}
      />
    </AlignedCenterContainer>
  );
}
