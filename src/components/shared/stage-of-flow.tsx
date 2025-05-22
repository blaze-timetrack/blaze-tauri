import { Button } from "@/components/ui/button";
import { Power, Volume2Icon } from "lucide-react";

function StateOfFlow() {
  return (
    <div className="col-span-full row-span-2 flex justify-between border-t px-4">
      {/* state */}
      <div className="flex h-full items-center gap-4 text-lg">
        <div className="flex items-center">
          <Button variant={"icon_btn"} size={"icon"}>
            <Power />
          </Button>
          {/* <Activity className="text-green-400" /> */}
        </div>
        <p className="">Flow State</p>
      </div>

      {/* music */}
      <div className="flex h-full items-center gap-2">
        <Button></Button>
        <p className="">Silent</p>
        <Volume2Icon className="size-6" />
      </div>
    </div>
  );
}

export default StateOfFlow;
