"use server";

import { signOut } from "@/auth";

export async function logOut(formData: FormData) {
    console.log("🚀 ~ logOut ~ formData:", formData)
    await signOut({ redirectTo: "/login", redirect: true });
}
