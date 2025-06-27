import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import DynamicSearch from "@/components/extented ui/dynamic-search.tsx";
import { settingsTabList } from "@/lib/constants/settings-const.tsx";
import { useBasicStore } from "@/lib/zustand/basic-store.ts";

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
          <TabsList
            className={
              "bg-muted/90 text-card-foreground flex h-fit w-[220px] flex-col gap-2 rounded-xl"
            }
          >
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

          {settingsTabList.map((setting) => (
            <TabsContent value={setting.value} key={setting.id}>
              {<setting.content />}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}

export default Settings;
