import { Plus } from "lucide-react";

import { useCreateAccount } from "~/features/accounts/hooks/use-create-account";

import { Button } from "~/components/ui/button";

export function CreateAccountButton() {
  const { onOpen } = useCreateAccount();

  return (
    <Button
      onClick={onOpen}
      variant="outline"
      size="sm"
      className="ml-auto hidden h-8 lg:flex"
    >
      <Plus /> New Account
    </Button>
  );
}
