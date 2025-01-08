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

import { AccountForm } from "~/features/accounts/components/account-form";
import { useGetAccount } from "~/features/accounts/hooks/use-get-account";

import { updateAccountSchema } from "~/server/db/schema/accounts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = updateAccountSchema.pick({
  id: true,
  name: true,
});

type FormValues = z.infer<typeof formSchema>;

export function EditAccountSheet() {
  const { isOpen, onClose, id } = useGetAccount();
  const [confirm, ConfirmationDialog] = useConfirm(
    "Are you sure?",
    "Do you really want to delete this account? This process cannot be undone.",
  );

  const utils = api.useUtils();

  const getAccount = api.accounts.getAccount.useQuery(
    { id: id },
    { enabled: !!id },
  );

  const defaultValues = getAccount.data
    ? { name: getAccount.data.name }
    : { name: "" };

  const deleteAccount = api.accounts.deleteAccount.useMutation({
    onMutate: () => {
      toast.loading("Deleting account");
    },
    onSuccess: async () => {
      await utils.accounts.getAllAccounts.invalidate();
      toast.dismiss();
      toast.success("Account deleted", {
        duration: 5000,
      });
      onClose();
    },
    onError: () => {
      toast.dismiss();
      toast.error("Failed to delete account", {
        duration: 5000,
      });
    },
  });

  const onDelete = async () => {
    const confirmed = await confirm();

    if (confirmed && id) {
      deleteAccount.mutate({ id });
    }
  };

  const updateAccount = api.accounts.updateAccount.useMutation({
    onMutate: () => {
      toast.loading("updating account");
    },
    onSuccess: async () => {
      await utils.accounts.invalidate();
      toast.dismiss();
      toast.success("Account updated", {
        duration: 5000,
      });
      onClose();
    },
    onError: () => {
      toast.error("Failed to update account", {
        duration: 5000,
      });
    },
  });

  const onSubmitAction = (values: FormValues) => {
    updateAccount.mutate({ id, ...values });
  };

  return (
    <>
      <ConfirmationDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>
              Edit account an existing account
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            {!getAccount.isPending || deleteAccount.isPending ? (
              <AccountForm
                id={id}
                defaultValues={defaultValues}
                disabled={updateAccount.isPending}
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
