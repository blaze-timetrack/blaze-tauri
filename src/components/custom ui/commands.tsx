"use client";

import * as React from "react";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@/lib/utils.ts";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";

export function Commands({
  commandsOpen,
  setCommandsOpen,
}: {
  commandsOpen: boolean;
  setCommandsOpen: (commandOpen: boolean) => void;
}) {
  return (
    <>
      <CommandDialog
        open={commandsOpen}
        onOpenChange={(v) => {
          setCommandsOpen(v);
        }}
        className={"rounded-lg border shadow-md md:min-w-[450px]"}
      >
        <CommandInput placeholder="Type a command or search..." />
        <ScrollArea className={"max-h-[300px]"} scrollHideDelay={0}>
          <CommandPrimitive.List data-slot="command-list" className={cn("")}>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <Calendar />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem>
                <Smile />
                <span>Search Emoji</span>
              </CommandItem>
              <CommandItem>
                <Calculator />
                <span>Calculator</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <User />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <CreditCard />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Settings />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandPrimitive.List>
        </ScrollArea>
      </CommandDialog>
    </>
  );
}
