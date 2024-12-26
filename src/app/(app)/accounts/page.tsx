"use client";

import { api } from "~/trpc/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { CreateAccountButton } from "~/features/accounts/components/create-account-button";

export default function Accounts() {
  const { data: accounts } = api.accounts.getAllAccounts.useQuery();

  return (
    <div>
      <Card className="max-w-lg">
        <CardContent>
          <CreateAccountButton />
          <h1 className="text-primary">
            {accounts?.map((account) => (
              <div key={account.id}>{account.name}</div>
            ))}
          </h1>
        </CardContent>
      </Card>
    </div>
  );
}
