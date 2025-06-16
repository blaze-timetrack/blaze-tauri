import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { useStoreSettings } from "@/hooks/useStoreSettings.tsx";
import {
  CategoryStateTypes,
  DefaultCategoryState,
  zodCategoryStateSchema,
} from "@/lib/types/store-settings-types.ts";
import { Button } from "@/components/ui/button.tsx";

export function PopupDialogAddCategory({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const [categoryStates, setCategoryStates] = useStoreSettings<
    string,
    CategoryStateTypes[]
  >("categoryStates", [], zodCategoryStateSchema);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // @ts-ignore
    const name = e.target?.categoryName.value
      .toLowerCase()
      .toString() as string;
    setCategoryStates([
      ...categoryStates,
      {
        ...DefaultCategoryState,
        name: name,
      },
    ]);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="w-full max-w-md bg-white p-6 dark:bg-zinc-900">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-white">
            Create category
          </DialogTitle>
          <DialogDescription className={"text-zinc-500"}>
            Enter the name of the category you want to create.
          </DialogDescription>
        </DialogHeader>
        <form className="mt-2 flex flex-col space-y-4" onSubmit={onSubmit}>
          <label htmlFor="categoryName" className="sr-only">
            Category
          </label>
          <input
            id="categoryName"
            type="text"
            className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-base text-zinc-900 outline-hidden focus:ring-2 focus:ring-black/5 sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-white/5"
            placeholder="Enter category name"
          />
          <Button
            className="inline-flex items-center justify-center self-end rounded-lg bg-black px-4 py-2 text-sm font-medium text-zinc-50 dark:bg-white dark:text-zinc-900"
            type="submit"
          >
            Create
          </Button>
        </form>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
