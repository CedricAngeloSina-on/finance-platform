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

import { useGetAccount } from "~/features/accounts/hooks/use-get-account";

export function DataTableRowActions({ id }: { id: string }) {
  const [confirm, ConfirmationDialog] = useConfirm(
    "Are you sure?",
    "Do you really want to delete this account? This process cannot be undone.",
  );
  const { onOpen } = useGetAccount();
  const utils = api.useUtils();

  const deleteAccount = api.accounts.deleteAccount.useMutation({
    onSuccess: async () => {
      await utils.accounts.invalidate();
      toast.success("Account deleted");
    },
    onError: () => {
      toast.error("Failed to delete account");
    },
  });

  const onDelete = async () => {
    const confirmed = await confirm();

    if (confirmed) {
      deleteAccount.mutate({ id });
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
            disabled={deleteAccount.isPending}
            onClick={() => onOpen(id)}
          >
            <Edit />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={deleteAccount.isPending}
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
