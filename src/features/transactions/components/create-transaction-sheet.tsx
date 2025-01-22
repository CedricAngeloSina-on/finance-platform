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

import { TransactionForm } from "~/features/transactions/components/transaction-form";
import { useCreateTransaction } from "~/features/transactions/hooks/use-create-transaction";

import { insertTransactionSchema } from "~/server/db/schema/transactions";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = insertTransactionSchema.omit({
  id: true,
});

type FormValues = z.infer<typeof formSchema>;

export function CreateTransactionSheet() {
  const { isOpen, onClose } = useCreateTransaction();

  const utils = api.useUtils();

  const createTransaction = api.transactions.createTransaction.useMutation({
    onMutate: () => {
      toast.loading("Creating transaction");
    },
    onSuccess: async () => {
      await utils.transactions.invalidate();
      toast.dismiss();
      toast.success("Transaction created", {
        duration: 5000,
      });
      onClose();
    },
    onError: () => {
      toast.error("Failed to create transaction", { duration: 5000 });
    },
  });

  // this part handle all the fetching and creating the account options
  const accounts = api.accounts.getAllAccounts.useQuery(undefined, {
    enabled: !!isOpen,
  });
  const createAccount = api.accounts.createAccount.useMutation({
    onMutate: () => {
      toast.loading("Creating account");
    },
    onSuccess: async () => {
      await utils.accounts.invalidate();
      toast.dismiss();
      toast.success("Account created", {
        duration: 5000,
      });
    },
    onError: () => {
      toast.error("Failed to create account", { duration: 5000 });
    },
  });
  const onCreateAccount = (name: string) => createAccount.mutate({ name });
  const accountOptions = (accounts.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  // this part handle all the fetching and creating the category options
  const categories = api.categories.getAllCategories.useQuery(undefined, {
    enabled: !!isOpen,
  });
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
    },
    onError: () => {
      toast.error("Failed to create category", { duration: 5000 });
    },
  });
  const onCreateCategory = (name: string) => createCategory.mutate({ name });
  const categoryOptions = (categories.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const onSubmitAction = (values: FormValues) => {
    createTransaction.mutate(values);
  };

  const disabled =
    createAccount.isPending ||
    createCategory.isPending ||
    createTransaction.isPending;

  const isLoading = accounts.isLoading || categories.isLoading;

  const defaultValues = {
    date: new Date(),
    amount: "",
    payee: "",
    account_id: "",
    notes: "",
    category_id: "",
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>Add a new transaction</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {isLoading ? (
            <h1>LOADING</h1>
          ) : (
            <TransactionForm
              onSubmitAction={onSubmitAction}
              defaultValues={defaultValues}
              disabled={disabled}
              accountOptions={accountOptions}
              onCreateAccount={onCreateAccount}
              categoryOptions={categoryOptions}
              onCreateCategory={onCreateCategory}
            />
          )}
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
