// import YTMusic from "ytmusic-api";
//
// const ytmusic = new YTMusic();
// await ytmusic.initialize(/* Optional: Custom cookies */);

import { Command } from "@tauri-apps/plugin-shell";

export const searchMusic = async () => {
  try {
    // const helpCommand = Command.sidecar("sidecar/app", "help");
    // const helpOutput = await helpCommand.execute();
    // const helpResult = helpOutput.stdout;
    // console.log("help result", helpResult);

    const pingMessage = "Tauri";
    const pingCommand = Command.sidecar("sidecar/app", ["ping", pingMessage]);
    const pingOutput = await pingCommand.execute();

    if (pingOutput.code === 0) {
      const pingResponse = pingOutput.stdout;
      console.log(`from sidecar (ping): ${pingResponse}`);
    } else {
      console.error(
        `sidecar error (ping, exit code ${pingOutput.code}): ${pingOutput.stderr}`,
      );
    }

    const pongMessage = "Tauri";
    const pongCommand = Command.sidecar("sidecar/app", ["pong", pongMessage]);
    const pongOutput = await pongCommand.execute();

    if (pongOutput.code === 0) {
      const pongResponse = pongOutput.stdout;
      console.log(`from sidecar (ping): ${pongResponse}`);
    } else {
      console.error(
        `sidecar error (ping, exit code ${pongOutput.code}): ${pongOutput.stderr}`,
      );
    }

    const ytmusicCommand = Command.sidecar("sidecar/app", "ytmusic");
    const ytmusicOutput = await ytmusicCommand.execute();

    if (ytmusicOutput.code === 0) {
      const musicResult = ytmusicOutput.stdout;
      console.log("got musicResult", JSON.parse(JSON.stringify(musicResult)));
    } else {
      console.error(
        `sidecar error (ytmusic, exit code ${ytmusicOutput.code}): ${ytmusicOutput.stderr}`,
      );
    }
  } catch (error) {
    console.error("Error executing sidecar:", error);
  }
};
