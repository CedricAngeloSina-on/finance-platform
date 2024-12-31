"use client";

import { CreateAccountSheet } from "~/features/accounts/components/create-account-sheet";
import { EditAccountSheet } from "~/features/accounts/components/edit-account-sheet";

export function SheetProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <CreateAccountSheet />
      <EditAccountSheet />
    </>
  );
}
