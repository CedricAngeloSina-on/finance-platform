"use client";

import { AlertTriangle } from "lucide-react";

import { format } from "date-fns";

import { type RouterOutputs } from "~/trpc/react";

import { type ColumnDef } from "@tanstack/react-table";

import { cn, formatCurrency } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import { Checkbox } from "~/components/ui/checkbox";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export type Transaction =
  RouterOutputs["transactions"]["getAllTransactions"][number];

export const columns: ColumnDef<Transaction>[] = [
  {
    id: "id",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <span>{format(row.getValue("date"), "MMMM dd, yyyy")}</span>
    ),
  },
  {
    accessorKey: "account",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account" />
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const category = row.original.category;
      return (
        <div className="flex items-center gap-2">
          {category ? (
            <span>{category}</span>
          ) : (
            <span className="flex items-center gap-1 text-red-400">
              <AlertTriangle className="size-4" /> Uncategorized
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      return (
        <Badge
          className={cn(
            "rounded-full text-sm",
            {
              "bg-emerald-500 hover:bg-emerald-500/80": amount > 0,
            },
            {
              "bg-rose-500 hover:bg-rose-500/80": amount < 0,
            },
          )}
          variant="outline"
        >
          {formatCurrency(amount)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "payee",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payee" />
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions id={row.original.id} />,
  },
];
