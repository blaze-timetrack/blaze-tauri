import { Button } from "@/components/ui/button.tsx";
import { useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";

function Categories() {
  const getPrograms = useCallback(async () => {
    const programs = await invoke("get_programs");
    console.log(programs);
  }, [invoke]);
  return (
    <div className="">
      <p className=""></p>
      <Button onClick={() => getPrograms()} variant={"ghost"}>
        Get Programs
      </Button>
    </div>
  );
}

export default Categories;
