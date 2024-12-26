import { useCreateAccount } from "~/features/accounts/hooks/use-create-account";

import { Button } from "~/components/ui/button";

export function CreateAccountButton() {
  const { onOpen } = useCreateAccount();

  return (
    <Button onClick={onOpen} variant="outline">
      Add new account
    </Button>
  );
}
