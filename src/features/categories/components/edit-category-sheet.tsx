"use client";

import { api } from "~/trpc/react";
import { toast } from "sonner";
import { type z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";

import { useConfirm } from "~/hooks/use-confirm";

import { CategoryForm } from "~/features/categories/components/category-form";
import { useGetCategory } from "~/features/categories/hooks/use-get-category";

import { updateCategorySchema } from "~/server/db/schema/categories";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = updateCategorySchema.pick({
  id: true,
  name: true,
});

type FormValues = z.infer<typeof formSchema>;

export function EditCategorySheet() {
  const { isOpen, onClose, id } = useGetCategory();
  const [confirm, ConfirmationDialog] = useConfirm(
    "Are you sure?",
    "Do you really want to delete this account? This process cannot be undone.",
  );

  const utils = api.useUtils();

  const getCategory = api.categories.getCategory.useQuery(
    { id: id },
    { enabled: !!id },
  );

  const defaultValues = getCategory.data
    ? { name: getCategory.data.name }
    : { name: "" };

  const deleteCategory = api.categories.deleteCategory.useMutation({
    onSuccess: async () => {
      await utils.categories.getAllCategories.invalidate();
      toast.success("Category deleted");
      onClose();
    },
    onError: () => {
      toast.error("Failed to delete Category");
    },
  });

  const onDelete = async () => {
    const confirmed = await confirm();

    if (confirmed && id) {
      deleteCategory.mutate({ id });
    }
  };

  const updateCategory = api.categories.updateCategory.useMutation({
    onSuccess: async () => {
      await utils.categories.invalidate();
      toast.success("Category updated");
      onClose();
    },
    onError: () => {
      toast.error("Failed to update category");
    },
  });

  const onSubmitAction = (values: FormValues) => {
    updateCategory.mutate({ id, ...values });
  };

  return (
    <>
      <ConfirmationDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Edit Category</SheetTitle>
            <SheetDescription>Edit an existing category</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            {!getCategory.isPending || deleteCategory.isPending ? (
              <CategoryForm
                id={id}
                defaultValues={defaultValues}
                disabled={updateCategory.isPending}
                onSubmitAction={onSubmitAction}
                onDelete={onDelete}
              />
            ) : null}
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button className="w-full" variant="secondary">
                Cancel
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
