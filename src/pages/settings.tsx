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
            Make changes to your account here. Click save when you&apos;re done.
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
    name: "Categories",
    value: "categories",
    content: <></>,
  },
  {
    id: 5,
    name: "Grouping",
    value: "grouping",
    content: <></>,
  },
];

function Settings() {
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

        <div className={"flex w-full flex-col gap-2"}>
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
