import AlignedCenterContainer from "@/components/aligned-center-container";
import NewPasswordForm from "@/components/auth/new-password-form";
import { SearchParams } from "next/dist/server/request/search-params";
import React from "react";

export default async function NewPasswordPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = (await searchParams) as { email: string; otpCode: string };
  // console.log("🚀 ~ params:", params)
  return (
    <AlignedCenterContainer>
      <NewPasswordForm email={params.email} otpCode={params.otpCode} />
    </AlignedCenterContainer>
  );
}
