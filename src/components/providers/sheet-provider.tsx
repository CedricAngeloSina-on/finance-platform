"use client";

import { NewAccountSheet } from "~/features/accounts/components/create-account-sheet";

export function SheetProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <NewAccountSheet />
    </>
  );
}
