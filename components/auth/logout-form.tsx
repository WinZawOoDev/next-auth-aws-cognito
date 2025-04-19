import { IconLogout } from "@tabler/icons-react";
import React from "react";

export default function LogOutForm({
  formAction,
}: {
  formAction: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={formAction}>
      <button type="submit" className="flex w-full items-center gap-2">
        <IconLogout />
        Log out
      </button>
    </form>
  );
}
