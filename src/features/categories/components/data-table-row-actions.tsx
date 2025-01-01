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

import { useGetCategory } from "~/features/categories/hooks/use-get-category";

export function DataTableRowActions({ id }: { id: string }) {
  const [confirm, ConfirmationDialog] = useConfirm(
    "Are you sure?",
    "Do you really want to delete this category? This process cannot be undone.",
  );
  const { onOpen } = useGetCategory();
  const utils = api.useUtils();

  const deleteCategory = api.categories.deleteCategory.useMutation({
    onSuccess: async () => {
      await utils.categories.invalidate();
      toast.success("Category deleted");
    },
    onError: () => {
      toast.error("Failed to delete category");
    },
  });

  const onDelete = async () => {
    const confirmed = await confirm();

    if (confirmed) {
      deleteCategory.mutate({ id });
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
            disabled={deleteCategory.isPending}
            onClick={() => onOpen(id)}
          >
            <Edit />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={deleteCategory.isPending}
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
