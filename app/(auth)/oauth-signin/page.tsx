import OAuth2Fail from "@/components/auth/oauth2-fail";
import { getOAuth2Token } from "@/lib/cognito-identity-client";
import { SearchParams } from "next/dist/server/request/search-params";

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
  // console.log("🚀 ~ params:", params);

  if (!params.code) {
    return <OAuth2Fail />;
  }

  const tokens = await getOAuth2Token(params.code);
  console.log("🚀 ~ tokens:", tokens);

  // const data = await getData();

  // if (data) {
  //   permanentRedirect("/");
  // }

  return null;
}
