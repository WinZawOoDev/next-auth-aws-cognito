import React from "react";
import AlignedCenterContainer from "@/components/aligned-center-container";
import OTPVerificationForm from "@/components/auth/otp-verification-form";
import { SearchParams } from "next/dist/server/request/search-params";
import { confirmRegister, resendConfirmCode } from "@/lib/auth/server-actions";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = (await searchParams) as { email: string };

  return (
    <AlignedCenterContainer>
      <OTPVerificationForm
        title="Verify Your Account"
        email={params.email}
        verifyAction={confirmRegister}
        resendAction={resendConfirmCode}
      />
    </AlignedCenterContainer>
  );
}
