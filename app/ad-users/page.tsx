import { ADUsersDataTable } from "@/components/ad-users";
import { getAllUsers } from "@/lib/active-directory";
import React from "react";

export default async function Page() {
  const users = (await getAllUsers({
    username: "wzo@kbz.bank",
    password: "1#$!30WeER0",
  })) as ActiveDirectoryUser[];

  const mappedUsers = users
    .map((user, index) => ({
      id: index + 1,
      ...user,
      lastLogonTimestamp: Array.isArray(user.lastLogonTimestamp)
        ? user.lastLogonTimestamp.join(", ")
        : user.lastLogonTimestamp,
    }))
    .filter((user) => user.displayName.length > 0);
  // console.log("🚀 ~ mappedUsers ~ mappedUsers:", mappedUsers)

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 mx-2 md:gap-6 md:py-6">
          <ADUsersDataTable data={mappedUsers} />
        </div>
      </div>
    </div>
  );
}
