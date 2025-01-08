"use client";

import { Edit, MoreHorizontal, Trash } from "lucide-react";

import { api } from "~/trpc/react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { useConfirm } from "~/hooks/use-confirm";

import { useGetTransaction } from "~/features/transactions/hooks/use-get-transaction";

export function DataTableRowActions({ id }: { id: string }) {
  const [confirm, ConfirmationDialog] = useConfirm(
    "Are you sure?",
    "Do you really want to delete this transaction? This process cannot be undone.",
  );
  const { onOpen } = useGetTransaction();
  const utils = api.useUtils();

  const deleteTransaction = api.transactions.deleteTransaction.useMutation({
    onMutate: () => {
      toast.loading("Deleting transaction");
    },
    onSuccess: async () => {
      await utils.transactions.invalidate();
      toast.dismiss();
      toast.success("Transaction deleted", {
        duration: 5000,
      });
    },
    onError: () => {
      toast.error("Failed to delete transaction", { duration: 5000 });
    },
  });

  const onDelete = async () => {
    const confirmed = await confirm();

    if (confirmed) {
      deleteTransaction.mutate({ id });
    }
  };

  return (
    <>
      <ConfirmationDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={deleteTransaction.isPending}
            onClick={() => onOpen(id)}
          >
            <Edit />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={deleteTransaction.isPending}
            onClick={onDelete}
          >
            <Trash />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
