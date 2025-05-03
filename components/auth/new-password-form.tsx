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
import { resetPassword } from "@/lib/auth/server-actions";

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
