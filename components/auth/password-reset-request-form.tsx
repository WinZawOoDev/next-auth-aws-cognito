import { z } from "zod";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { forgotPassword } from "@/lib/cognito-auth-provider";

// Define email validation schema
const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

// Server action to request password reset
async function requestPasswordReset(formData: FormData) {
  "use server";

  // Get email from form data
  const email = formData.get("email") as string;

  // Validate email format
  const result = emailSchema.safeParse({ email });

  forgotPassword({
    email,
    onSuccess(data) {
      console.log("🚀 ~ onSuccess ~ data:", data);
    },
    inputVerificationCode(data) {
      console.log("🚀 ~ inputVerificationCode ~ data:", data);
    },
    onFailure(error) {},
  });

  redirect(`/reset-password/verify?${new URLSearchParams({ email })}`);
}

export default function PasswordResetRequestForm() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a verification code to
          reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={requestPasswordReset} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Send Reset Code
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-sm text-center">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-primary underline-offset-4 hover:underline"
          >
            Back to login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
