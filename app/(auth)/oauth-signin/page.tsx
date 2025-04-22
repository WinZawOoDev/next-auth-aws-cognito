import {
  confirmForgotPassword,
  confirmSignUp,
  forgotPassword,
  getOAuth2Token,
  initiateAuth,
  resendConfirmationCode,
  signUp,
} from "@/lib/cognito-identity-client";
import { SearchParams } from "next/dist/server/request/search-params";
import { headers } from "next/headers";
import { permanentRedirect } from "next/navigation";

async function getData() {
  // This artificial delay simulates a slow data fetch
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return { name: "Dashboard Data" };
}

export default async function OAuthSignIn({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = (await searchParams) as { code: string };
  console.log("🚀 ~ params:", params);

  // await signUp({email: 'winzawoo.dev@gmail.com', password: '12@#Wa909AZn$'});

  // await confirmSignUp({ email: "winzawoo.dev@gmail.com", otpCode: "327043" });
  // await resendConfirmationCode('winzawoo.dev@gmail.com');
  // const sessions = await initiateAuth({
  //   email: "winzawoo.dev@gmail.com",
  //   password: "12@#Wa909AZn$",
  // });
  // await forgotPassword('winzawoo.dev@gmail.com')
  // await confirmForgotPassword({
  //   email: "winzawoo.dev@gmail.com",
  //   otpCode: "193480",
  //   newPassword: "12@#Wa909AZn$N",
  //   onFailure(error) {},
  //   onSuccess(success) {},
  // });
  await getOAuth2Token(params.code);

  const data = await getData();

  // if (data) {
  //   permanentRedirect("/");
  // }

  return null;
}
