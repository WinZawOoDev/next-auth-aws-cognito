export { auth as middleware } from "@/auth";


export const config = {
    matcher: ["/((?!api|register/*|reset-password/*|oauth-signin|_next/static|_next/image|favicon.ico).*)"],
}