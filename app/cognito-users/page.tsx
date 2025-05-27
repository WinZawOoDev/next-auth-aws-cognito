import { CognitoUsersDataTable } from "@/components/cognito-users";
import { listUsers } from "@/lib/auth/cognito-identity-client";
import React from "react";

export default async function Page() {
  const cognitoUsers = await listUsers();

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 mx-2 md:gap-6 md:py-6">
          <CognitoUsersDataTable data={cognitoUsers!} />
        </div>
      </div>
    </div>
  );
}
