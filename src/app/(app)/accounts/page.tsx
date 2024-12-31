"use client";

import { toast } from "sonner";
import { api } from "~/trpc/react";

import { Card, CardContent } from "~/components/ui/card";

import { columns } from "~/features/accounts/components/columns";
import { DataTable } from "~/features/accounts/components/data-table";

export default function Accounts() {
  const utils = api.useUtils();

  const accounts = api.accounts.getAllAccounts.useQuery();
  const deleteAccounts = api.accounts.deleteAccounts.useMutation({
    onSuccess: async () => {
      await utils.accounts.invalidate();
      toast.success("Account(s) deleted");
    },
    onError: () => {
      toast.error("Failed to delete accounts");
    },
  });

  const disabled = accounts.isPending ?? deleteAccounts.isPending;

  return (
    <div>
      <Card className="">
        <CardContent>
          <div>
            {accounts.isPending && <h1>LOADING</h1>}
            {accounts.data && (
              <DataTable
                data={accounts.data}
                columns={columns}
                disabled={disabled}
                onDeleteAction={(rows) => {
                  const ids = rows.map((row) => row.original.id);
                  deleteAccounts.mutate({ ids });
                }}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
