"use client";
import React, { useRef, useState } from "react";
import { motion, MotionConfig, Transition } from "motion/react";
import useClickOutside from "@/hooks/useClickOutside";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { cn } from "@/lib/utils.ts";

const transition: Transition = {
  type: "spring",
  bounce: 0.1,
  duration: 0.2,
};

function ButtonDynamicSearch({
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  return (
    <Button
      className="relative flex shrink-0 scale-100 appearance-none items-center justify-center rounded-lg transition-colors select-none focus-visible:ring-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
      type="button"
      variant={"icon_label_btn_2"}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </Button>
  );
}

export default function DynamicSearch({
  initialValue = false,
  animationWidth = "300px",
  width = "98px",
  iconOnly = true,
  highInput = false,
  outerLayerClassName,
}: {
  initialValue?: boolean;
  animationWidth?: string;
  width?: string;
  iconOnly?: boolean;
  highInput?: boolean;
  outerLayerClassName?: string;
}) {
  const [isOpen, setIsOpen] = useState(initialValue);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => {
    setIsOpen(false);
  });

  return (
    <MotionConfig transition={transition}>
      <div className="" ref={containerRef}>
        <div className="h-full w-full rounded-xl">
          <motion.div
            animate={{
              // @todo: here I want to remove the width
              width: isOpen ? animationWidth : width,
            }}
            initial={false}
          >
            <div className={cn("overflow-hidden p-2", outerLayerClassName)}>
              {!isOpen ? (
                <div className="flex space-x-2">
                  <ButtonDynamicSearch
                    onClick={() => setIsOpen(true)}
                    ariaLabel="Search notes"
                  >
                    <Search className="h-5 w-5" />
                    {!iconOnly && "Search"}
                  </ButtonDynamicSearch>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <ButtonDynamicSearch
                    onClick={() => setIsOpen(false)}
                    ariaLabel="Back"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </ButtonDynamicSearch>
                  <div className="relative w-full">
                    {highInput ? (
                      <Input
                        className="h-9 w-full rounded-lg border border-zinc-950/10 bg-transparent p-2 placeholder-zinc-500 focus:outline-hidden dark:border-zinc-500/30"
                        autoFocus
                        placeholder="Search notes"
                      />
                    ) : (
                      <input
                        className="h-9 w-full rounded-lg border border-zinc-950/10 bg-transparent p-2 placeholder-zinc-500 focus:outline-hidden dark:border-zinc-500/30"
                        autoFocus
                        placeholder="Search notes"
                      />
                    )}
                    <div className="absolute top-0 right-1 flex h-full items-center justify-center"></div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </MotionConfig>
  );
}
