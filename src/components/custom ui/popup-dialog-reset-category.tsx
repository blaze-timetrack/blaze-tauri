import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { useStoreSettings } from "@/hooks/useStoreSettings.tsx";
import {
  CategoryActionTypes,
  CategoryStateTypes,
  zodCategoryStateSchema,
} from "@/lib/types/store-settings-types.ts";
import { Button } from "@/components/ui/button.tsx";

export function PopupDialogResetCategory({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const [, , resetCategoryStates] = useStoreSettings<
    string,
    CategoryStateTypes[]
  >(
    "categoryStates",
    [
      {
        name: "browser",
        state_flow: {
          state: true,
          action: CategoryActionTypes.ENABLE_CATEGORY,
        },
        state_work: {
          state: true,
          action: CategoryActionTypes.ENABLE_CATEGORY,
        },
        state_idle: {
          state: true,
          action: CategoryActionTypes.ENABLE_CATEGORY,
        },
        state_block: {
          state: true,
          action: CategoryActionTypes.ENABLE_CATEGORY,
        },
      },
      {
        name: "email",
        state_flow: {
          state: true,
          action: CategoryActionTypes.ENABLE_CATEGORY,
        },
        state_work: {
          state: true,
          action: CategoryActionTypes.ENABLE_CATEGORY,
        },
        state_idle: {
          state: true,
          action: CategoryActionTypes.ENABLE_CATEGORY,
        },
        state_block: {
          state: true,
          action: CategoryActionTypes.ENABLE_CATEGORY,
        },
      },
      {
        name: "social",
        state_flow: {
          state: false,
          action: CategoryActionTypes.DISABLE_CATEGORY,
        },
        state_work: {
          state: true,
          action: CategoryActionTypes.ENABLE_CATEGORY,
        },
        state_idle: {
          state: true,
          action: CategoryActionTypes.ENABLE_CATEGORY,
        },
        state_block: {
          state: true,
          action: CategoryActionTypes.DISABLE_CATEGORY,
        },
      },
    ],
    zodCategoryStateSchema,
  );

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetCategoryStates();
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
