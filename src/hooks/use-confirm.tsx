import { useState } from "react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

export const useConfirm = (
  title: string,
  message: string,
): [() => Promise<unknown>, () => JSX.Element] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () =>
    new Promise((resolve) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <Dialog open={promise !== null} onOpenChange={handleCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <Button onClick={handleConfirm} type="button" variant="destructive">
            Confirm
          </Button>
          <Button onClick={handleCancel} type="button" variant="secondary">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [confirm, ConfirmationDialog];
};
