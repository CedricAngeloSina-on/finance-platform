"use client";

import { CreateAccountSheet } from "~/features/accounts/components/create-account-sheet";
import { EditAccountSheet } from "~/features/accounts/components/edit-account-sheet";
import { CreateCategorySheet } from "~/features/categories/components/create-category-sheet";
import { EditCategorySheet } from "~/features/categories/components/edit-category-sheet";

export function SheetProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <CreateAccountSheet />
      <EditAccountSheet />
      <CreateCategorySheet />
      <EditCategorySheet />
    </>
  );
}
