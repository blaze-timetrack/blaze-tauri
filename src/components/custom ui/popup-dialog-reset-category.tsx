import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import {
  ActionNameTypes,
  categoryStateTypes,
} from "@/lib/types/store-settings.types.ts";
import { Button } from "@/components/ui/button.tsx";

export function PopupDialogResetCategory({
  children,
  categoryStates,
  setCategoryState,
}: {
  children: React.ReactNode;
  categoryStates: categoryStateTypes[];
  setCategoryState: (
    categoryStates: categoryStateTypes,
    actionName?: ActionNameTypes,
  ) => Promise<string | undefined>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCategoryState(categoryStates[0], ActionNameTypes.RESET);
    setIsOpen(false);
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="w-full max-w-md bg-white p-6 dark:bg-zinc-900">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-white">
            Reset category
          </DialogTitle>
          <DialogDescription className={"text-red-300"}>
            Are you sure you want to reset all categories?
          </DialogDescription>
        </DialogHeader>

        <form className="" onSubmit={onSubmit}>
          <div className={"flex justify-end gap-2"}>
            <Button type={"button"} onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant={"destructive"} type="submit">
              Confirm
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
