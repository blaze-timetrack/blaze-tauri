import { useState } from "react";
import { CategoryActionTypes } from "@/lib/types/store-settings.types.ts";
import { cn } from "@/lib/utils.ts";

interface IToggleSwitchProps {
  onChange?: (value: boolean) => void;
  defaultChecked?: boolean;
  action?: CategoryActionTypes;
}

const ToggleSwitchCategory = ({
  onChange,
  defaultChecked,
  action = CategoryActionTypes.ENABLE_CATEGORY,
}: IToggleSwitchProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(defaultChecked ?? false);
  const disabledAction = action === CategoryActionTypes.DISABLE_CATEGORY;

  const handleCheckboxChange = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    onChange?.(newCheckedState);
  };

  return (
    <>
      <label className="flex cursor-pointer items-center select-none">
        <div className="relative">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => {
              if (action === CategoryActionTypes.ENABLE_CATEGORY) {
                handleCheckboxChange();
              }
            }}
            className="sr-only"
          />
          <div
            className={cn(
              `box block h-8 w-14 rounded-full bg-gray-700 ${isChecked && !disabledAction ? "bg-green-600" : ""} ${disabledAction && isChecked ? "cursor-not-allowed bg-green-600/50" : ""} ${disabledAction && !isChecked ? "cursor-not-allowed bg-gray-700/50" : ""}`,
            )}
          />
          <div
            className={`absolute top-1 left-1 flex h-6 w-6 items-center justify-center rounded-full transition ${
              isChecked && !disabledAction
                ? "bg-foreground/75 translate-x-full"
                : "bg-foreground/50"
            } ${disabledAction && !isChecked ? "cursor-not-allowed bg-gray-500" : ""} ${disabledAction && isChecked && "bg-foreground/10 translate-x-full cursor-not-allowed"} `}
          />
        </div>
      </label>
    </>
  );
};

export default ToggleSwitchCategory;
