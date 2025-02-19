"use client";

import { toast } from "sonner";
import { api } from "~/trpc/react";

import { Card, CardContent } from "~/components/ui/card";

import { columns } from "~/features/categories/components/columns";
import { DataTable } from "~/features/categories/components/data-table";

export default function Categories() {
  const utils = api.useUtils();

  const categories = api.categories.getAllCategories.useQuery();
  const deleteCategories = api.categories.deleteCategories.useMutation({
    onMutate: () => {
      toast.loading("Deleting categories(s)");
    },
    onSuccess: async () => {
      await utils.categories.invalidate();
      toast.dismiss();
      toast.success("Category(s) deleted", { duration: 5000 });
    },
    onError: () => {
      toast.dismiss();
      toast.error("Failed to delete category(s)", { duration: 5000 });
    },
  });

  const disabled = categories.isPending ?? deleteCategories.isPending;

  return (
    <div>
      <Card className="">
        <CardContent>
          <div>
            {categories.isPending && <h1>LOADING</h1>}
            {categories.data && (
              <DataTable
                data={categories.data}
                columns={columns}
                disabled={disabled}
                onDeleteAction={(rows) => {
                  const ids = rows.map((row) => row.original.id);
                  deleteCategories.mutate({ ids });
                }}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
