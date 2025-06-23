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
  GroupProgramsPlatformType,
  groupProgramsType,
  zodGroupProgramsSchema,
} from "@/lib/types/store-settings-types.ts";
import { Button } from "@/components/ui/button.tsx";
import { SettingsKeys } from "@/lib/constants/settings-const.tsx";

export function PopupDialogResetGrouping({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const [, , resetGroupedPrograms] = useStoreSettings<
    string,
    groupProgramsType[]
  >(
    SettingsKeys.GROUPING_PROGRAMS,
    [
      {
        name: "zen browser",
        publisher: "browser company",
        category: "browser",
        platform: GroupProgramsPlatformType.WINDOWS,
        point: 0,
      },
      {
        name: "key paint",
        publisher: "Apple Inc.",
        category: "paint",
        platform: GroupProgramsPlatformType.MACOS,
        point: 0,
      },
    ],
    zodGroupProgramsSchema,
  );

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetGroupedPrograms();
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
