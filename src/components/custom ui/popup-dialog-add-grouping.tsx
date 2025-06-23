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
  GroupProgramsPlatformType,
  groupProgramsType,
  groupProgramsTypeSchema,
  zodGroupProgramsSchema,
} from "@/lib/types/store-settings-types.ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { SettingsKeys } from "@/lib/constants/settings-const.tsx";

export function PopupDialogAddGrouping({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<groupProgramsType>({
    resolver: zodResolver(groupProgramsTypeSchema),
    defaultValues: {
      name: "",
      platform: GroupProgramsPlatformType.WINDOWS,
      category: "browser",
      point: 0,
    },
  });

  const [groupedPrograms, setGroupedPrograms] = useStoreSettings<
    string,
    groupProgramsType[]
  >(SettingsKeys.GROUPING_PROGRAMS, [], zodGroupProgramsSchema);

  const onSubmit = (value: groupProgramsType) => {
    console.log(value);
    setGroupedPrograms([...groupedPrograms, value]);
    setIsOpen(false);
    form.reset();
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
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-2 flex flex-col space-y-4"
          >
            <FormField
              control={form.control}
              name={"name"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Name</FormLabel>
                  <FormControl>
                    <Input type={"text"} placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"category"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Name</FormLabel>
                  <FormControl>
                    {/*  input */}
                    <Input
                      type={"text"}
                      placeholder="program name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"platform"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <FormControl>
                    {/*  input */}
                    <Input type={"text"} placeholder="platform" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className={"mt-2"} type="submit">
              Submit
            </Button>
          </form>
        </Form>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
