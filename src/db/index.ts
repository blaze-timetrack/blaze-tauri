import Database from "@tauri-apps/plugin-sql";

export const connectToDB = async () => {
  return await Database.load("sqlite:test.db");
};
