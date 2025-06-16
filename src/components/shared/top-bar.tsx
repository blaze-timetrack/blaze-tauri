import ThemeDropdown from "@/components/custom ui/theme-dropdown";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { connectToDB } from "@/db";
import DynamicSearch from "@/components/extented ui/dynamic-search";

function TopBar() {
  const [content, setContent] = useState<any>();

  const connectOnF = async () => {
    const db = await connectToDB();
    // await db.execute("INSERT INTO users (name, email) VALUES ($1, $2)", [
    //   "Alice",
    //   "alice@example.com",
    // ]);
    const res: Array<any> = await db.select("SELECT * FROM users");
    // console.log(res);
    setContent(res[0]);
  };

  useEffect(() => {
    connectOnF()
      .then()
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <div
      data-tauri-drag-region={true}
      className="bg-primary/10 border-border col-span-full row-span-2 flex items-center justify-between border-b px-4"
    >
      {/* logo */}
      <div className="flex gap-8">
        {/*<Button variant={"icon_btn"} size={"icon"}>*/}
        {/*  <img*/}
        {/*    src="/images/StoreLogo.png"*/}
        {/*    alt=""*/}
        {/*    width={"26px"}*/}
        {/*    height={"26px"}*/}
        {/*  />*/}
        {/*</Button>*/}

        {/* fast-command */}
        <div className="flex items-center gap-2">
          <ThemeDropdown />
          <Button variant={"icon_label_btn_2"}>
            <Activity />
            Flow State
          </Button>
          <DynamicSearch outerLayerClassName={"pl-0"} />
        </div>
      </div>

      <div>
        <p className={"pr-36 text-2xl font-bold uppercase xl:pr-40"}>Blaze</p>
      </div>

      {/* profile */}
      <div className="flex items-center gap-2">
        <div className="">
          <p className="text-[12px]">{content?.name}</p>
          <p className="text-muted-foreground text-end text-[10px]">
            @GrvExplorer
          </p>
        </div>
        <Button variant={"icon_btn"} size={"icon"}>
          <img src="/images/user 1.png" alt="" />
        </Button>
      </div>
    </div>
  );
}

export default TopBar;
