import { z } from "zod";

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

export type CategoryStateTypes = z.infer<typeof categoryStateTypeSchema>;

export const DefaultCategoryState: CategoryStateTypes = {
  name: "",
  state_flow: {
    state: true,
    action: CategoryActionTypes.ENABLE_CATEGORY,
  },
  state_work: {
    state: true,
    action: CategoryActionTypes.ENABLE_CATEGORY,
  },
  state_block: {
    state: true,
    action: CategoryActionTypes.ENABLE_CATEGORY,
  },
  state_idle: {
    state: true,
    action: CategoryActionTypes.ENABLE_CATEGORY,
  },
};

export const zodCategoryStateSchema = z.array(categoryStateTypeSchema).min(0);
