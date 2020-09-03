#!/usr/bin/env node
const TuyAPI = require("tuyapi");
const chalk = require("chalk");
const ora = require("ora");
const yargs = require("yargs");

const sceneArg = yargs.usage("Usage: -s <scene>").option("s", {
  alias: "scene",
  describe: "The scene to set",
  type: "string",
  choices: ["work", "night", "sleep"],
}).argv;

const scenes = {
  night: {
    20: true,
    21: "scene",
    25: "000e0d00002e03e8000000c80000",
  },
  work: {
    20: true,
    21: "scene",
    25: "020e0d0000e80383000003e803e8",
  },
  sleep: {
    20: true,
    21: "white",
    22: 10,
    23: 0,
  },
};

const device = new TuyAPI({
  id: "<your_string_id>",
  key: "<your_string_key>",
  ip: "<your_string_ip>",
  version: 3.3,
});

const isConnecting = ora("finding and connecting to device...\n").start();

// Find device on network
device.find().then(() => {
  // Connect to device
  device.connect();
});

// Add event listeners
device.on("connected", () => {
  isConnecting.succeed("device found and connected!\n");
});

device.on("disconnected", () => {
  ora("disconnected").succeed();
});

device.on("error", (error) => {
  ora("an error ocurred").fail();
  throw new Error(error);
});

device.on("data", (data) => {
  const scene = sceneArg.scene;

  if (scene) {
    const onText = chalk.greenBright("on");
    const sceneText = chalk.greenBright(scene);

    ora({
      text: `turning the light ${onText} and setting to ${sceneText} scene`,
    }).stopAndPersist({ symbol: "💡" });
    device.set({
      multiple: true,
      data: scenes[scene],
    });
  } else {
    const isOn = data.dps[20];
    const stateText = isOn ? "off" : "on";
    const printColor = isOn ? chalk.redBright : chalk.greenBright;

    ora(printColor(`turning the light ${stateText}`)).stopAndPersist({
      symbol: "💡",
    });
    device.set({ dps: 20, set: !isOn });
  }
  ora("done!\n").succeed();

  device.disconnect();
});
