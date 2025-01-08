"use client";

import { api } from "~/trpc/react";
import { toast } from "sonner";
import { type z } from "zod";

import { convertAmountFromMiliunits } from "~/lib/utils";
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

import { TransactionForm } from "~/features/transactions/components/transaction-form";
import { useGetTransaction } from "~/features/transactions/hooks/use-get-transaction";

import { updateTransactionSchema } from "~/server/db/schema/transactions";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = updateTransactionSchema.omit({
  id: true,
});

type FormValues = z.infer<typeof formSchema>;

export function EditTransactionSheet() {
  const { isOpen, onClose, id } = useGetTransaction();
  const [confirm, ConfirmationDialog] = useConfirm(
    "Are you sure?",
    "Do you really want to delete this transaction? This process cannot be undone.",
  );

  const utils = api.useUtils();

  const getTransaction = api.transactions.getTransaction.useQuery(
    { id: id },
    {
      enabled: !!id,
      select: (transaction) =>
        transaction && {
          ...transaction,
          amount: convertAmountFromMiliunits(transaction.amount),
        },
    },
  );

  const deleteTransaction = api.transactions.deleteTransaction.useMutation({
    onMutate: () => {
      toast.loading("Deleting transaction");
    },
    onSuccess: async () => {
      await utils.transactions.getAllTransactions.invalidate();
      toast.dismiss();
      toast.success("Transaction deleted", {
        duration: 5000,
      });
      onClose();
    },
    onError: () => {
      toast.error("Failed to delete transaction", { duration: 5000 });
    },
  });

  const onDelete = async () => {
    const confirmed = await confirm();

    if (confirmed && id) {
      deleteTransaction.mutate({ id });
    }
  };

  const updateTransaction = api.transactions.updateTransaction.useMutation({
    onMutate: () => {
      toast.loading("Updating transaction");
    },
    onSuccess: async () => {
      await utils.transactions.invalidate();
      toast.dismiss();
      toast.success("Transaction updated", {
        duration: 5000,
      });
      onClose();
    },
    onError: () => {
      toast.error("Failed to update transaction", { duration: 5000 });
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
    updateTransaction.mutate({ id, ...values });
  };

  const disabled =
    createAccount.isPending ||
    createCategory.isPending ||
    updateTransaction.isPending;

  const isLoading =
    getTransaction.isLoading || accounts.isLoading || categories.isLoading;

  const isPending =
    deleteTransaction.isPending ||
    createAccount.isPending ||
    createCategory.isPending ||
    updateTransaction.isPending;

  const defaultValues = getTransaction.data
    ? {
        date: getTransaction.data.date
          ? new Date(getTransaction.data.date)
          : new Date(),
        amount: getTransaction.data.amount.toString() ?? "",
        payee: getTransaction.data.payee ?? "",
        account_id: getTransaction.data.account_id ?? "",
        notes: getTransaction.data.notes ?? "",
        category_id: getTransaction.data.category_id ?? "",
      }
    : {
        date: new Date(),
        amount: "",
        payee: "",
        account_id: "",
        notes: "",
        category_id: "",
      };

  return (
    <>
      <ConfirmationDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>Edit an existing transaction</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            {isLoading || isPending ? (
              <h1>LOADING</h1>
            ) : (
              <TransactionForm
                id={id}
                onSubmitAction={onSubmitAction}
                defaultValues={defaultValues}
                disabled={disabled}
                accountOptions={accountOptions}
                onCreateAccount={onCreateAccount}
                categoryOptions={categoryOptions}
                onCreateCategory={onCreateCategory}
                onDelete={onDelete}
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
    </>
  );
}
