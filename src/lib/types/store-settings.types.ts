import { z } from "zod";
import { JSX } from "react";

// states
export type StateTypes =
  | "FETCH"
  | "TRACKING"
  | "FLOW"
  | "BREAK"
  | "MEETING"
  | "WORKOUT"
  | "NO_TRACKING";

// music
export interface MusicTypes {
  name: string;
  value: string;
}

// theme && theme mode
export type ThemeTypes = "dark" | "light" | "system";

export type ThemeModeTypes = "default" | "mono" | "catppuccin";

// category states
export enum CategoryActionTypes {
  DISABLE_CATEGORY = "DISABLE_CATEGORY",
  ENABLE_CATEGORY = "ENABLE_CATEGORY",
}

const categoryStateSchema = z.object({
  state: z.boolean(),
  action: z.nativeEnum(CategoryActionTypes),
});
export const categoryStateTypeSchema = z.object({
  name: z.string().min(3).max(20),
  state_flow: categoryStateSchema,
  state_work: categoryStateSchema,
  state_idle: categoryStateSchema,
  state_block: categoryStateSchema,
});
export type categoryStateTypes = z.infer<typeof categoryStateTypeSchema>;
export const zodCategoryStateSchema = z.array(categoryStateTypeSchema).min(0);

//  group programs (based on category)
export type GroupProgramsPlatformType =
  | "ANY"
  | "WINDOWS"
  | "MACOS"
  | "LINUX"
  | "ANDROID";

export const groupProgramsTypeSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "program name must be at least 3 characters.",
    })
    .max(20),
  publisher: z.string().min(3).max(20).optional(),
  category: z.string().min(3).max(20),
  platform: z.enum(["ANY", "WINDOWS", "MACOS", "LINUX", "ANDROID"]),
  point: z.number().optional(),
});
export type groupProgramsType = z.infer<typeof groupProgramsTypeSchema>;
export const zodGroupProgramsSchema = z.array(groupProgramsTypeSchema).min(0);

export enum ActionNameTypes {
  SET = "SET",
  UPDATE = "UPDATE",
  "RESET" = "RESET",
  "DELETE" = "DELETE",
  "CLEAR" = "CLEAR",
}

export interface InstalledApplication {
  name: string;
  version: string | undefined;
  publisher: string | undefined;
  install_date: string | undefined;
  install_path: string | undefined;
}

export interface dropdownElementListTypes {
  label: string;
  icon: JSX.ElementType;
  value: boolean;
}
