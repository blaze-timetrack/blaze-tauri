import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Edit2, PlusCircle, RotateCcw, Trash } from "lucide-react";
import { PopupDialogResetCategory } from "@/components/custom ui/popup-dialog-reset-category.tsx";
import ToggleSwitchCategory from "@/components/custom ui/toggle-switch-category.tsx";
import { useSettingStore } from "@/lib/zustand/store.ts";
import { ActionNameTypes } from "@/lib/types/store-settings-types.ts";
import { PopupDialogAddCategory } from "@/components/custom ui/popup-dialog-add-category.tsx";

function CategoryTab() {
  const categoryStates = useSettingStore((state) => state.categoryStates);
  const setCategoryState = useSettingStore((state) => state.setCategoryState);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className={"flex w-full justify-between"}>
            <p>Category</p>
            <div className={"flex flex-row-reverse gap-2"}>
              <PopupDialogAddCategory
                setCategoryState={setCategoryState}
                categoryStates={categoryStates}
              >
                <PlusCircle className={"h-5 w-5"} />
              </PopupDialogAddCategory>
              <PopupDialogResetCategory
                setCategoryState={setCategoryState}
                categoryStates={categoryStates}
              >
                <RotateCcw className={"h-5 w-5"} />
              </PopupDialogResetCategory>
            </div>
          </CardTitle>
          <CardDescription className={"max-w-md"}>
            Make changes to category states. Category will be handle flows,
            work, idle detection and distraction blocking.
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          {/* heading */}
          <table className={"flex flex-col gap-6"}>
            <thead className={""}>
              <tr className={"flex items-center justify-between"}>
                <th className={"px-4 text-start"}>Categories</th>
                <th className={"max-w-[80px] min-w-[80px]"}>Flow Category</th>
                <th className={"max-w-[80px] min-w-[80px]"}>Work Category</th>
                <th className={"max-w-[120px] min-w-[120px]"}>
                  Idle detection enable
                </th>
                <th className={"max-w-[80px] min-w-[80px]"}>
                  Block distractions
                </th>
                <th className={"md:min-w-4"}></th>
              </tr>
            </thead>

            {/*@todo did cannot in a chile of table*/}
            {/*<Separator className={""} />*/}

            <tbody className={"flex w-full flex-col gap-4"}>
              {categoryStates.map((categoryState, id) => {
                return (
                  <tr
                    key={id}
                    className={"flex items-center justify-between lg:gap-4"}
                  >
                    <td className={"px-8 capitalize"}>{categoryState.name}</td>
                    <td
                      className={
                        "flex max-w-[80px] min-w-[80px] justify-center"
                      }
                    >
                      <ToggleSwitchCategory
                        onChange={(v) => {
                          setCategoryState(
                            {
                              ...categoryState,
                              state_flow: {
                                ...categoryState.state_flow,
                                state: v,
                              },
                            },
                            ActionNameTypes.UPDATE,
                          );
                        }}
                        defaultChecked={categoryState.state_flow.state}
                        action={categoryState.state_flow.action}
                      />
                    </td>
                    <td
                      className={
                        "flex max-w-[80px] min-w-[80px] justify-center"
                      }
                    >
                      <ToggleSwitchCategory
                        onChange={(v) => {
                          setCategoryState(
                            {
                              ...categoryState,
                              state_work: {
                                ...categoryState.state_work,
                                state: v,
                              },
                            },
                            ActionNameTypes.UPDATE,
                          );
                        }}
                        defaultChecked={categoryState.state_work.state}
                        action={categoryState.state_work.action}
                      />
                    </td>
                    <td
                      className={
                        "flex max-w-[80px] min-w-[80px] justify-center"
                      }
                    >
                      <ToggleSwitchCategory
                        onChange={(v) => {
                          setCategoryState(
                            {
                              ...categoryState,
                              state_idle: {
                                ...categoryState.state_idle,
                                state: v,
                              },
                            },
                            ActionNameTypes.UPDATE,
                          );
                        }}
                        defaultChecked={categoryState.state_idle.state}
                        action={categoryState.state_idle.action}
                      />
                    </td>
                    <td
                      className={
                        "flex max-w-[80px] min-w-[80px] justify-center"
                      }
                    >
                      <ToggleSwitchCategory
                        onChange={(v) => {
                          setCategoryState(
                            {
                              ...categoryState,
                              state_block: {
                                ...categoryState.state_block,
                                state: v,
                              },
                            },
                            ActionNameTypes.UPDATE,
                          );
                        }}
                        defaultChecked={categoryState.state_block.state}
                        action={categoryState.state_block.action}
                      />
                    </td>
                    <td className={"ml-4 flex gap-2 lg:ml-0"}>
                      <Edit2
                        className={
                          "h-4 w-4 cursor-pointer text-gray-400 transition-colors hover:text-gray-300"
                        }
                      />
                      <Trash
                        className={
                          "h-4 w-4 cursor-pointer text-gray-400 transition-colors hover:text-gray-300"
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* body */}
          </table>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </>
  );
}

export default CategoryTab;
