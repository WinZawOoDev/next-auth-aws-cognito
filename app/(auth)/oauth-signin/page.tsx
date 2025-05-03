import OAuthLoginForm from "@/components/auth/oauth-login-form";
import OAuth2Fail from "@/components/auth/oauth2-fail";
import { SearchParams } from "next/dist/server/request/search-params";


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


  return <OAuthLoginForm authorizationCode={params.code} />;
}
