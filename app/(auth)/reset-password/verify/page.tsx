import React from "react";
import AlignedCenterContainer from "@/components/aligned-center-container";
import OTPVerificationForm from "@/components/auth/otp-verification-form";

export default function VerifyPage() {
  return (
    <AlignedCenterContainer>
      <OTPVerificationForm
        title="Verify Your Account"
        redirectPath="/reset-password/new-password"
      />
    </AlignedCenterContainer>
  );
}
