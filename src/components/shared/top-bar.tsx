import ThemeDropdown from "@/components/custom ui/theme-dropdown";
import { Button } from "@/components/ui/button";
import { Activity, Search } from "lucide-react";

function TopBar() {
  return (
    <div className="bg-primary/10 border-border col-span-full row-span-2 flex items-center justify-between border-b px-4">
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
        <div className="flex gap-2">
          <ThemeDropdown />
          <Button variant={"icon_label_btn"}>
            <Activity />
            Flow State
          </Button>
          <Button variant={"icon_label_btn"} size={"icon"}>
            <Search />
          </Button>
        </div>
      </div>

      <div>
        <p className={"pr-20 text-2xl font-bold uppercase lg:pr-36 xl:pr-40"}>
          Blaze
        </p>
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
