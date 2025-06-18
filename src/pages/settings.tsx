import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import DynamicSearch from "@/components/extented ui/dynamic-search.tsx";
import { useStoreSettings } from "@/hooks/useStoreSettings.tsx";
import { Edit2, PlusCircle, RotateCcw, Trash } from "lucide-react";
import {
  CategoryStateTypes,
  InstalledApplication,
  zodCategoryStateSchema,
} from "@/lib/types/store-settings-types.ts";
import ToggleSwitchCategory from "@/components/custom ui/toggle-switch-category.tsx";
import { PopupDialogAddCategory } from "@/components/custom ui/popup-dialog-add-category.tsx";
import { PopupDialogResetCategory } from "@/components/custom ui/popup-dialog-reset-category.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

function Settings() {
  const [categoryStates, setCategoryStates] = useStoreSettings<
    string,
    CategoryStateTypes[]
  >("categoryStates", [], zodCategoryStateSchema);
  const sortedCategoryStates = categoryStates.sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  useEffect(() => {
    async function initInstalledApp() {
      try {
        const res = await invoke<InstalledApplication[]>(
          "get_installed_applications",
        );
        console.log("from winreg: ", res);
        const res2 = await invoke("classify_text", {
          text: `what will be the group title of this app? app:\`${res[0].name}\``,
        });
        console.log("from model: ", res2);
      } catch (e) {
        console.log(`Error ${e}`);
      }
    }

    initInstalledApp();
  }, []);

  const settingsList = [
    {
      id: 1,
      name: "Account",
      value: "account",
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you&apos;re
              done.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="tabs-demo-name">Name</Label>
              <Input id="tabs-demo-name" defaultValue="Pedro Duarte" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="tabs-demo-username">Username</Label>
              <Input id="tabs-demo-username" defaultValue="@peduarte" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      ),
    },
    {
      id: 2,
      name: "Activity",
      value: "activity",
      content: <></>,
    },
    {
      id: 3,
      name: "Billing",
      value: "billing",
      content: <></>,
    },
    {
      id: 4,
      name: "Category",
      value: "categories",
      content: (
        <>
          <Card>
            <CardHeader>
              <CardTitle className={"flex w-full justify-between"}>
                <p>Category</p>
                <div className={"flex flex-row-reverse gap-2"}>
                  <PopupDialogAddCategory>
                    <PlusCircle className={"h-5 w-5"} />
                  </PopupDialogAddCategory>
                  <PopupDialogResetCategory>
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
                    <th className={"max-w-[80px] min-w-[80px]"}>
                      Flow Category
                    </th>
                    <th className={"max-w-[80px] min-w-[80px]"}>
                      Work Category
                    </th>
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
                <Separator className={""} />

                <tbody className={"flex w-full flex-col gap-4"}>
                  {sortedCategoryStates.map((categoryState, id) => {
                    const filterCategoryStates = categoryStates.filter(
                      (v) => v.name !== categoryState.name,
                    );
                    return (
                      <tr
                        key={id}
                        className={"flex items-center justify-between lg:gap-4"}
                      >
                        <td className={"px-8 capitalize"}>
                          {categoryState.name}
                        </td>
                        <td
                          className={
                            "flex max-w-[80px] min-w-[80px] justify-center"
                          }
                        >
                          <ToggleSwitchCategory
                            onChange={(v) => {
                              setCategoryStates([
                                ...filterCategoryStates,
                                {
                                  ...categoryState,
                                  state_flow: {
                                    ...categoryState.state_flow,
                                    state: v,
                                  },
                                },
                              ]);
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
                              setCategoryStates([
                                ...filterCategoryStates,
                                {
                                  ...categoryState,
                                  state_work: {
                                    ...categoryState.state_work,
                                    state: v,
                                  },
                                },
                              ]);
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
                              setCategoryStates([
                                ...filterCategoryStates,
                                {
                                  ...categoryState,
                                  state_idle: {
                                    ...categoryState.state_idle,
                                    state: v,
                                  },
                                },
                              ]);
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
                              setCategoryStates([
                                ...filterCategoryStates,
                                {
                                  ...categoryState,
                                  state_block: {
                                    ...categoryState.state_block,
                                    state: v,
                                  },
                                },
                              ]);
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
      ),
    },
    {
      id: 5,
      name: "App Category",
      value: "grouping",
      content: (
        <>
          <Card>
            <CardHeader>
              <CardTitle className={"flex w-full justify-between"}>
                <p>Application Category</p>
                <div className={"flex flex-row-reverse gap-2"}>
                  <PopupDialogResetCategory>
                    <RotateCcw className={"h-5 w-5"} />
                  </PopupDialogResetCategory>
                </div>
              </CardTitle>
              <CardDescription className={"max-w-md"}>
                Change app category. This is like category having multiple
                items(which is app). Based on this we will autostart your flow
                session, breaks, and block distractions.
              </CardDescription>
            </CardHeader>
            <CardContent className=""></CardContent>
            <CardFooter></CardFooter>
          </Card>
        </>
      ),
    },
  ];

  return (
    <div className={"mt-4 flex w-full flex-col gap-4"}>
      <Tabs defaultValue={"account"} className={"flex flex-row gap-4"}>
        <div className={"flex flex-col gap-4"}>
          <div className={"flex items-end py-2 pr-4 text-xl"}>
            <h2>Settings</h2>
          </div>
          <TabsList
            className={
              "bg-muted/90 text-card-foreground flex h-fit w-[220px] flex-col gap-2 rounded-xl"
            }
          >
            {settingsList.map((setting) => (
              <TabsTrigger
                key={setting.id}
                tabIndex={setting.id}
                className={"cursor-pointer justify-start py-2"}
                value={setting.value}
              >
                {setting.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div
          className={"flex max-h-[72vh] w-full flex-col gap-2 overflow-x-auto"}
        >
          <DynamicSearch
            initialValue={true}
            iconOnly={false}
            highInput={true}
            animationWidth={"100%"}
            width={"220px"}
            outerLayerClassName={"pl-0"}
          />

          {settingsList.map((setting) => (
            <TabsContent value={setting.value} key={setting.id}>
              {setting.content}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}

export default Settings;
