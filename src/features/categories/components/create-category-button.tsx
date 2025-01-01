import { Plus } from "lucide-react";

import { useCreateCategory } from "~/features/categories/hooks/use-create-category";

import { Button } from "~/components/ui/button";

export function CreateCategoryButton() {
  const { onOpen } = useCreateCategory();

  return (
    <Button
      onClick={onOpen}
      variant="outline"
      size="sm"
      className="ml-auto hidden h-8 lg:flex"
    >
      <Plus /> New Category
    </Button>
  );
}
