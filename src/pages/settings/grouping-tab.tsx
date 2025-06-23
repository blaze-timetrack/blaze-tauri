import React from "react";
import { useStoreSettings } from "@/hooks/useStoreSettings.tsx";
import {
  groupProgramsType,
  zodGroupProgramsSchema,
} from "@/lib/types/store-settings-types.ts";
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
import { SettingsKeys } from "@/lib/constants/settings-const.tsx";

function GroupingTab() {
  // @todo @error: div component rendering continuously
  const [groupPrograms, setGroupPrograms] = useStoreSettings<
    string,
    groupProgramsType[]
  >(SettingsKeys.GROUPING_PROGRAMS, [], zodGroupProgramsSchema);
  const sortedCategoryStates = groupPrograms.sort((a, b) =>
    a.name.localeCompare(b.name),
  ); //
  // useEffect(() => {
  //   async function initInstalledApp() {
  //     try {
  //       let res = await invoke<InstalledApplication[]>(
  //         "get_installed_applications",
  //       );
  //       res = res.slice(0, 10);
  //       console.log("from winreg: ", res);
  //       setGroupPrograms([
  //         ...res.map(({ name, publisher }) => ({
  //           name,
  //           publisher,
  //           category: "browser",
  //           platform: GroupProgramsPlatformType.WINDOWS,
  //           point: 0,
  //         })),
  //       ]);
  //       console.log(`sortedCategoryState: ${sortedCategoryStates}`);
  //     } catch (e) {
  //       console.log(`Error ${e}`);
  //     }
  //   }
  //
  //   initInstalledApp();
  // }, []);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className={"flex w-full justify-between"}>
            <p>Application Category</p>
            <div className={"flex flex-row-reverse gap-2"}>
              <PopupDialogAddGrouping>
                <PlusCircle className={"h-5 w-5"} />
              </PopupDialogAddGrouping>
              <PopupDialogResetGrouping>
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
            {sortedCategoryStates.map((v, i) => (
              <div
                key={i}
                className={
                  "text-primary/80 flex items-center justify-between gap-4"
                }
              >
                <p className={"min-w-xs"}>{v.name}</p>
                <div className={"flex items-center gap-1"}>
                  {v.platform === "windows" ? (
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
