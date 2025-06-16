import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";

export function PopupDialog({ children }: { children: React.ReactNode }) {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="w-full max-w-md bg-white p-6 dark:bg-zinc-900">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-white">
            Create category
          </DialogTitle>
        </DialogHeader>
        <form className="mt-6 flex flex-col space-y-4" onSubmit={onSubmit}>
          <label htmlFor="categoryName" className="sr-only">
            Category
          </label>
          <input
            id="categoryName"
            type="text"
            className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-base text-zinc-900 outline-hidden focus:ring-2 focus:ring-black/5 sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-white/5"
            placeholder="Enter category name"
          />
          <button
            className="inline-flex items-center justify-center self-end rounded-lg bg-black px-4 py-2 text-sm font-medium text-zinc-50 dark:bg-white dark:text-zinc-900"
            type="submit"
          >
            Create
          </button>
        </form>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
