import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import { useState } from "react";

function TopBar() {
  const [content, setContent] = useState<any>();

  const connectOnF = async () => {
    // const db = await connectToDB();
    // const res: Array<any> = await db.select("SELECT * FROM users");
    // await db.execute("INSERT INTO users (name, email) VALUES ($1, $2)", [
    //   "Alice",
    //   "alice@example.com",
    // ]);
    // console.log(res);
    // setContent(res[0]);
  };

  return (
    <div
      data-tauri-drag-region={true}
      className="bg-primary/10 border-border col-span-full row-span-2 flex items-center justify-between border-b px-4"
    >
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
        <Button variant={"icon_label_btn_2"}>
          <Activity />
          Flow State
        </Button>
      </div>

      <div>
        <p className={"text-2xl font-bold uppercase"}>Blaze v0.3.4</p>
      </div>

      {/* profile */}
      <div className="flex items-center gap-2">
        <div className="">
          <p className="text-[12px]">Gaurav Verma</p>
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
