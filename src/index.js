fetch = require("node-fetch");
const controller = require("./controls");

const help = ["caffeinate", "pair", ...require("./controls.json")];

const receiver = Object.keys(controller).reduce((acc, key) => {
  acc[key] = async (release = true) =>
    await controller[key]("192.168.1.118", release);
  return acc;
}, {});

const asyncSleep = async () => {
  await receiver.RC_SLEEP();
  await new Promise(resolve => setTimeout(resolve, 500));
  await receiver.RC_SLEEP();
};

const command = process.argv[2];

switch (command) {
  case "help":
    console.log("Available commands:");
    help.forEach(message => console.log(message));
    break;
  case "caffeinate":
    asyncSleep();
    setInterval(function() {
      asyncSleep();
    }, 5 * 60 * 1000);
    break;
  case "pair":
    receiver.RC_IPOD(false);
    setTimeout(() => receiver.RC_RELEASE(), 7 * 1000);
    break;
  default:
    if (typeof receiver[command] === "function") {
      receiver[command]();
    } else {
      console.log(`${command} is not a valid command`);
    }
    break;
}
