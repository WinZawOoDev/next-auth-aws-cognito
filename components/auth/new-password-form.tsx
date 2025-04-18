import { z } from "zod";
import { permanentRedirect, redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { revalidatePath } from "next/cache";
import { confirmForgotPassword } from "@/lib/cognito-auth-provider";

// Define password validation schema
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Server action to reset password
async function resetPassword(formData: FormData) {
  "use server";
  console.log("🚀 ~ resetPassword ~ formData:", formData);
  // Get form data
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const email = formData.get("email") as string;
  const otpCode = formData.get("otpCode") as string;

  // Validate password format
  const result = passwordSchema.safeParse({ password, confirmPassword });

  //   if (!result.success) {
  //     const errors = result.error.flatten().fieldErrors;
  //     return {
  //       success: false,
  //       message: Object.values(errors)[0]?.[0] || "Invalid password format.",
  //     };
  //   }

  confirmForgotPassword({
    email,
    otpCode,
    newPassword: password,
    onSuccess(data) {
      console.log("🚀 ~ onSuccess ~ data:", data);
    },
    onFailure(error) {
      console.error("Error resetting password:", error);
    },
  });

  revalidatePath("/login");
  permanentRedirect("/login");
}

export default function NewPasswordForm({
  email,
  otpCode,
}: {
  email: string;
  otpCode: string;
}) {
  console.log("🚀 ~ otpCode:", otpCode);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Create New Password</CardTitle>
        <CardDescription>Enter and confirm your new password</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={resetPassword} className="space-y-6">
          {/* Hidden fields to pass email and token */}
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="otpCode" value={otpCode} />

          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input id="password" name="password" type="password" required />
            <p className="text-xs text-muted-foreground">
              Password must be at least 8 characters and include uppercase,
              lowercase, and numbers
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
