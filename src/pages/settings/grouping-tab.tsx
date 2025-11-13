import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  AppWindowIcon,
  AppWindowMac,
  PlusCircle,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { PopupDialogAddGrouping } from "@/components/custom ui/popup-dialog-add-grouping.tsx";
import { PopupDialogResetGrouping } from "@/components/custom ui/popup-dialog-reset-grouping.tsx";
import { useSettingStore } from "@/lib/zustand/setting-store.ts";

function GroupingTab() {
  // @todo @error: div component rendering continuously
  const groupPrograms = useSettingStore((state) => state.groupedPrograms);
  const setGroupProgram = useSettingStore((state) => state.setGroupedProgram);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className={"flex w-full justify-between"}>
            <p>Application Category</p>
            <div className={"flex flex-row-reverse gap-2"}>
              <PopupDialogAddGrouping
                setGroupedProgram={setGroupProgram}
                groupedPrograms={groupPrograms}
              >
                <PlusCircle className={"h-5 w-5"} />
              </PopupDialogAddGrouping>
              <PopupDialogResetGrouping
                setGroupedProgram={setGroupProgram}
                groupedPrograms={groupPrograms}
              >
                <RotateCcw className={"h-5 w-5"} />
              </PopupDialogResetGrouping>
            </div>
          </CardTitle>
          <CardDescription className={"max-w-md"}>
            Change app category. This is like category having multiple
            items(which is app). Based on this we will autostart your flow
            session, breaks, and block distractions.
          </CardDescription>
          {/* @todo change files */}
          <div className={"mt-3 flex gap-2"}>
            <Button variant={"outline"}>Default</Button>
            <Button variant={"icon_btn"}>
              <PlusCircle className={"h-5 w-5"} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="border-border mx-6 space-y-4 rounded-md border px-4 py-2">
          <div
            className={
              "text-muted-foreground flex items-center justify-between gap-8 text-start"
            }
          >
            <p className={"min-w-xs"}>Name</p>
            <div className={"flex gap-1"}>
              <p className={""}>Category</p>
            </div>
            <p className={"text-start"}>Publisher</p>
          </div>
          <div className={"flex w-full flex-col gap-2"}>
            {groupPrograms.map((v, i) => (
              <div
                key={i}
                className={
                  "text-primary/80 flex items-center justify-between gap-4"
                }
              >
                <p className={"min-w-xs lowercase"}>{v.name}</p>
                <div className={"flex items-center gap-1"}>
                  {v.platform === "WINDOWS" ? (
                    <AppWindowIcon className={"h-4 w-4"} />
                  ) : (
                    <AppWindowMac className={"h-4 w-4"} />
                  )}
                  <p className={""}>{">"}</p>
                  <p className={""}>{v.category}</p>
                </div>
                <p className={""}>{v.publisher}</p>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </>
  );
}

export default GroupingTab;
