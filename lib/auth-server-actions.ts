"use server";

import { signOut } from "@/auth";
import { signOut as cognitoSignOut } from "@/lib/cognito-auth-provider"

export async function logOut(formData: FormData) {
    cognitoSignOut()
    await signOut({ redirectTo: "/login", redirect: true });
}
