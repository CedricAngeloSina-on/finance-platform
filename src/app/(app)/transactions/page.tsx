"use client";

import { toast } from "sonner";
import { api } from "~/trpc/react";

import { Card, CardContent } from "~/components/ui/card";

import { columns } from "~/features/transactions/components/columns";
import { DataTable } from "~/features/transactions/components/data-table";
import { convertAmountFromMiliunits } from "~/lib/utils";

export default function Transactions() {
  const utils = api.useUtils();

  const transactions = api.transactions.getAllTransactions.useQuery(
    {},
    {
      //this selects the amount field from the data and converts to the original value
      select: (data) =>
        data.map((transaction) => ({
          ...transaction,
          amount: convertAmountFromMiliunits(transaction.amount),
        })),
    },
  );

  const deleteTransactions = api.transactions.deleteTransactions.useMutation({
    onMutate: () => {
      toast.loading("Deleting transactions(s)");
    },
    onSuccess: async () => {
      await utils.transactions.invalidate();
      toast.dismiss();
      toast.success("Transactions(s) deleted", {
        duration: 5000,
      });
    },
    onError: () => {
      toast.error("Failed to delete transaction(s)", {
        duration: 5000,
      });
    },
  });

  const disabled = transactions.isPending ?? deleteTransactions.isPending;

  return (
    <div>
      <Card className="">
        <CardContent>
          <div>
            {transactions.isPending && <h1>LOADING</h1>}
            {transactions.data && (
              <DataTable
                data={transactions.data}
                columns={columns}
                disabled={disabled}
                onDeleteAction={(rows) => {
                  const ids = rows.map((row) => row.original.id);
                  deleteTransactions.mutate({ ids });
                }}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
