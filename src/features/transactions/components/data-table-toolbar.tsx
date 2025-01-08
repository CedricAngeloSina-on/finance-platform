"use client";

import { Trash, X } from "lucide-react";

import { type Row, type Table } from "@tanstack/react-table";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import { useConfirm } from "~/hooks/use-confirm";

import { CreateTransactionButton } from "~/features/transactions/components/create-transaction-button";
import { DataTableViewOptions } from "~/features/transactions/components/data-table-view-options";

interface DataTableToolbarProps<TData> {
  disabled?: boolean;
  onDeleteAction: (rows: Row<TData>[]) => void;
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  disabled,
  onDeleteAction,
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const [confirm, ConfirmationDialog] = useConfirm(
    "Are you sure?",
    table.getFilteredSelectedRowModel().rows.length > 1
      ? "Do you really want to delete these transactions? This process cannot be undone."
      : "Do you really want to delete this transaction? This process cannot be undone.",
  );

  return (
    <div className="flex items-center justify-between pt-4">
      <ConfirmationDialog />
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter payee..."
          value={(table.getColumn("payee")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("payee")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <CreateTransactionButton />
        <DataTableViewOptions table={table} />
        {isFiltered && (
          <Button
            variant="outline"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <div>
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <Button
            variant="destructive"
            className="h-8 px-2 lg:px-3"
            disabled={disabled}
            onClick={async () => {
              const confirmed = await confirm();

              if (confirmed) {
                onDeleteAction(table.getFilteredSelectedRowModel().rows);
                table.resetRowSelection();
              }
            }}
          >
            <Trash />
            Delete ({table.getFilteredSelectedRowModel().rows.length})
          </Button>
        )}
      </div>
    </div>
  );
}
