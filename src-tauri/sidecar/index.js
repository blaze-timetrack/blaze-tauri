const YTMusic = require("ytmusic-api");
const command = process.argv[2];

switch (command) {
  case "ping":
    const message = process.argv[3];
    console.log(`ping, ${message}`); // Response sent to stdout
    break;
  case "pong":
    const messagePong = process.argv[3];
    console.log(`pong, ${messagePong}`); // Response sent to stdout
    break;
  case "help":
    console.log("helping...");
    break;
  case "ytmusic":
    const ytmusic = new YTMusic();
    ytmusic.initialize(/* Optional: Custom cookies */).then((v) => {
      v.search("Never gonna give you up").then(songs => {
        console.log(songs);  // Response sent to stdout
      });
    });
    break;
  default:
    console.error(`unknown command ${command}`);
    process.exit(1);
}
