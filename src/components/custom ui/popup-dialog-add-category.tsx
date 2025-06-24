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
import { Button } from "@/components/ui/button.tsx";
import { defaultCategoryState } from "@/lib/constants/settings-const.tsx";
import {
  ActionNameTypes,
  categoryStateTypes,
} from "@/lib/types/store-settings-types.ts";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input.tsx";

export function PopupDialogAddCategory({
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

  const formSchema = z.object({
    category: z.string().min(3).max(20),
  });

  const form = useForm({ resolver: zodResolver(formSchema) });

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    // @ts-ignore
    const res = await setCategoryState(
      {
        ...defaultCategoryState,
        name: value.category,
      },
      ActionNameTypes.SET,
    );
    if (res === "") setIsOpen(false);
    if (res === "already_exists") {
      form.setError("category", {
        type: "validate",
        message: "the category already present.",
      });
    }
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
        <Form {...form}>
          <form
            className="mt-2 flex flex-col space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name={"category"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input type={"text"} placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*<label htmlFor="categoryName" className="sr-only">*/}
            {/*  Category*/}
            {/*</label>*/}
            {/*<input*/}
            {/*  id="categoryName"*/}
            {/*  type="text"*/}
            {/*  className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-base text-zinc-900 outline-hidden focus:ring-2 focus:ring-black/5 sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-white/5"*/}
            {/*  placeholder="Enter category name"*/}
            {/*/>*/}
            <Button
              className="inline-flex items-center justify-center self-end rounded-lg bg-black px-4 py-2 text-sm font-medium text-zinc-50 dark:bg-white dark:text-zinc-900"
              type="submit"
            >
              Create
            </Button>
          </form>
        </Form>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
