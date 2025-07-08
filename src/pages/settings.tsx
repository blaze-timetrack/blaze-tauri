import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import DynamicSearch from "@/components/extented ui/dynamic-search.tsx";
import { settingsTabList } from "@/lib/constants/settings-const.tsx";
import { useBasicStore } from "@/lib/zustand/basic-store.ts";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";

function Settings() {
  const settingsTab = useBasicStore((state) => state.settingTab);
  const setSettingsTab = useBasicStore((state) => state.setSettingTab);

  return (
    <div className={"mt-4 flex w-full flex-col gap-4"}>
      <Tabs
        value={settingsTab}
        onValueChange={setSettingsTab}
        className={"flex flex-row gap-4"}
      >
        <div className={"flex flex-col gap-4"}>
          <div className={"flex items-end py-2 pr-4 text-xl"}>
            <h2>Settings</h2>
          </div>
          <div className={"gap-4"}>
            <ScrollArea
              className={
                "bg-muted/90 text-card-foreground h-[62vh] w-[220px] rounded-xl"
              }
              scrollHideDelay={0}
            >
              <TabsList className={"flex h-fit w-full flex-col gap-2"}>
                {settingsTabList.map((setting) => (
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
            </ScrollArea>
            <div className={""}></div>
          </div>
        </div>

        <div className={"w-full"}>
          <DynamicSearch
            initialValue={true}
            iconOnly={false}
            highInput={true}
            animationWidth={"100%"}
            width={"220px"}
            outerLayerClassName={"pl-0"}
          />
          <div
            className={
              "flex max-h-[72vh] w-full flex-col gap-2 overflow-x-auto"
            }
          >
            {settingsTabList.map((setting) => (
              <TabsContent value={setting.value} key={setting.id}>
                {<setting.content />}
              </TabsContent>
            ))}
          </div>
        </div>
      </Tabs>
    </div>
  );
}

export default Settings;
