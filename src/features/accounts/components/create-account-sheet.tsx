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

import { AccountForm } from "~/features/accounts/components/account-form";
import { useCreateAccount } from "~/features/accounts/hooks/use-create-account";

import { insertAccountSchema } from "~/server/db/schema/accounts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = insertAccountSchema.pick({
  name: true,
});

type FormValues = z.infer<typeof formSchema>;

export function CreateAccountSheet() {
  const { isOpen, onClose } = useCreateAccount();

  const utils = api.useUtils();

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
      onClose();
    },
    onError: () => {
      toast.error("Failed to create account", {
        duration: 5000,
      });
    },
  });

  const onSubmitAction = (values: FormValues) => {
    createAccount.mutate(values);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Create a new account to track your transactions
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <AccountForm
            onSubmitAction={onSubmitAction}
            defaultValues={{ name: "" }}
            disabled={createAccount.isPending}
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
