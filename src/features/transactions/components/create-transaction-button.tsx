import { Plus } from "lucide-react";

import { useCreateTransaction } from "~/features/transactions/hooks/use-create-transaction";

import { Button } from "~/components/ui/button";

export function CreateTransactionButton() {
  const { onOpen } = useCreateTransaction();

  return (
    <Button
      onClick={onOpen}
      variant="outline"
      size="sm"
      className="ml-auto hidden h-8 lg:flex"
    >
      <Plus /> New Transaction
    </Button>
  );
}
