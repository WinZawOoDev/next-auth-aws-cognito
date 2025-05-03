import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  title: string;
  email: string;
  verifyAction: (formData: FormData) => Promise<void>;
  resendAction: (formData: FormData) => Promise<void>;
};

export default function OTPVerificationForm({
  title,
  email,
  verifyAction,
  resendAction,
}: Props) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        {/* <CardTitle className="text-2xl">Verify Your Account</CardTitle> */}
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>
          Enter the 6-digit verification code sent to your email or phone
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={verifyAction} className="space-y-6">
          <div className="flex justify-center">
            <div className="flex gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  name={`digit-${index + 1}`}
                  maxLength={1}
                  className="h-10 w-10 rounded-md border border-input bg-background text-center text-lg shadow-sm"
                  required
                />
              ))}
            </div>
            {/* Hidden input to collect all digits for submission */}
            <input type="hidden" name="otp" id="otp" />
          </div>
          <input type="hidden" name="email" value={email} />
          <Button type="submit" className="w-full">
            Verify
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center">
          Didn't receive a code?{" "}
          <form action={resendAction}>
            <input type="hidden" name="email" value={email} />
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
