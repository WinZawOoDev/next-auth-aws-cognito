"use client";

import { signIn } from "next-auth/react";
import React, { useEffect } from "react";

type Props = {
  authorizationCode: string;
};

export default function OAuthLoginForm({ authorizationCode }: Props) {
  async function loginWithOauth2() {
    await signIn("credentials", {
      redirect: true,
      redirectTo: "/",
      authorizationCode,
    });
  }

  useEffect(() => {
    loginWithOauth2();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-2">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-lg font-medium">OAuth2 Signing In...</p>
      </div>
    </div>
  );
}
