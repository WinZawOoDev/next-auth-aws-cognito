import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define OTP validation schema
const otpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d+$/, { message: "OTP must contain only numbers" }),
});

// Server action to verify OTP
async function verifyOTP(formData: FormData) {
  "use server";

  // Get OTP from form data
  const otp = formData.get("otp") as string;

  // Validate OTP format
  const result = otpSchema.safeParse({ otp });

  //   if (!result.success) {
  //     return {
  //       success: false,
  //       message: "Invalid OTP format. Please enter 6 digits.",
  //     }
  //   }
}

// Server action to resend OTP
async function resendOTP() {
  "use server";

  // Here you would implement the logic to resend the OTP
  // This is a placeholder for the actual resend logic
}

export default function OTPVerificationForm() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Verify Your Account</CardTitle>
        <CardDescription>
          Enter the 6-digit verification code sent to your email or phone
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={verifyOTP} className="space-y-6">
          <div className="flex justify-center">
            <div className="flex gap-2">
              {/* Individual digit inputs for OTP */}
              <input
                type="text"
                inputMode="numeric"
                name="digit-1"
                maxLength={1}
                className="h-10 w-10 rounded-md border border-input bg-background text-center text-lg shadow-sm"
                required
              />
              <input
                type="text"
                inputMode="numeric"
                name="digit-2"
                maxLength={1}
                className="h-10 w-10 rounded-md border border-input bg-background text-center text-lg shadow-sm"
                required
              />
              <input
                type="text"
                inputMode="numeric"
                name="digit-3"
                maxLength={1}
                className="h-10 w-10 rounded-md border border-input bg-background text-center text-lg shadow-sm"
                required
              />
              <input
                type="text"
                inputMode="numeric"
                name="digit-4"
                maxLength={1}
                className="h-10 w-10 rounded-md border border-input bg-background text-center text-lg shadow-sm"
                required
              />
              <input
                type="text"
                inputMode="numeric"
                name="digit-5"
                maxLength={1}
                className="h-10 w-10 rounded-md border border-input bg-background text-center text-lg shadow-sm"
                required
              />
              <input
                type="text"
                inputMode="numeric"
                name="digit-6"
                maxLength={1}
                className="h-10 w-10 rounded-md border border-input bg-background text-center text-lg shadow-sm"
                required
              />
            </div>

            {/* Hidden input to collect all digits for submission */}
            <input type="hidden" name="otp" id="otp" />
          </div>

          <Button type="submit" className="w-full">
            Verify
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center">
          Didn't receive a code?{" "}
          <form action={resendOTP}>
            <button
              type="submit"
              className="text-primary underline-offset-4 hover:underline"
            >
              Resend code
            </button>
          </form>
        </div>
      </CardFooter>
    </Card>
  );
}
