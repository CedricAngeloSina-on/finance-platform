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

import { CategoryForm } from "~/features/categories/components/category-form";
import { useCreateCategory } from "~/features/categories/hooks/use-create-category";

import { insertCategorySchema } from "~/server/db/schema/categories";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = insertCategorySchema.pick({
  name: true,
});

type FormValues = z.infer<typeof formSchema>;

export function CreateCategorySheet() {
  const { isOpen, onClose } = useCreateCategory();

  const utils = api.useUtils();

  const createCategory = api.categories.createCategory.useMutation({
    onMutate: () => {
      toast.loading("Creating category");
    },
    onSuccess: async () => {
      await utils.categories.invalidate();
      toast.dismiss();
      toast.success("Category created", {
        duration: 5000,
      });
      onClose();
    },
    onError: () => {
      toast.error("Failed to create category", {
        duration: 5000,
      });
    },
  });

  const onSubmitAction = (values: FormValues) => {
    createCategory.mutate(values);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>New Category</SheetTitle>
          <SheetDescription>Create a new category</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <CategoryForm
            onSubmitAction={onSubmitAction}
            defaultValues={{ name: "" }}
            disabled={createCategory.isPending}
          />
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
  );
}
