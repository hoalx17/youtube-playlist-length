const path = require("path");
const envFilePath = path.join(__dirname, "../../../.env");
require("dotenv").config({ path: envFilePath });
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const chalk = require("chalk");
const axios = require("axios");
const _ = require("lodash");

const { ON_RELEASE, MSG } = require("../../../constant");

const { DOMAIN_ADDRESS } = process.env;

yargs(hideBin(process.argv))
  .version("0.1.0")
  .scriptName("ypl")
  .epilogue(`For more information: ${DOMAIN_ADDRESS}`)
  .usage("Usage: $0 <command> [options]")
  .command("playlist", "[options]: Get Youtube Playlist metadata", async (yargs) => {
    yargs
      .option("url", {
        description: "Playlist URL",
        requiresArg: true,
        type: "string",
      })
      .option("speed", {
        description: "Playback speed",
        type: "number",
        default: 2,
      })
      .option("startIndex", {
        description: "Index of first video",
        type: "number",
        default: 1,
      })
      .option("endIndex", {
        description: "Index of last video (not included)",
        type: "number",
        default: undefined,
      })
      .demandOption("url", "Please provide url option to work with this tool");

    try {
      let playlistEndpoint;
      const { url, speed, startIndex, endIndex } = yargs.argv;
      if (endIndex) {
        playlistEndpoint = `${DOMAIN_ADDRESS}/api/v1/playlist?playlistUrl=${encodeURIComponent(
          url
        )}&speed=${speed}&startIndex=${startIndex}&endIndex=${endIndex}`;
      } else {
        playlistEndpoint = `${DOMAIN_ADDRESS}/api/v1/playlist?playlistUrl=${encodeURIComponent(url)}&speed=${speed}&startIndex=${startIndex}`;
      }
      console.log(playlistEndpoint);
      console.log(chalk.yellow(`Getting playlist length, please wait...`));
      const response = await axios.get(playlistEndpoint);
      const data = response.data;
      const [originIdsLength, uniqueIdsLength] = data.payload?.length;
      const duplicatedIds = data.payload?.duplicatedIds;
      const [originItemDurations, uniqueItemDurations, requireItemDurations] = data.payload?.duration;
      console.log(`Total: ${chalk.green(originIdsLength)} videos, with ${chalk.red(originIdsLength - uniqueIdsLength)} videos duplicated!`);
      if (!_.isEmpty(duplicatedIds)) {
        console.log(chalk.red("DUPLICATED VIDEO ID: "));
        duplicatedIds.forEach((v, i, o) => console.log(chalk.strikethrough(`https://www.youtube.com/watch?v=${v}`)));
      }
      console.log(`Total Length (Origin at 1.00X): ${originItemDurations}`);
      console.log(`Total Length (Unique at 1.00X): ${chalk.yellow(uniqueItemDurations)}`);
      console.log(`Total Length (Unique at ${speed.toFixed(2)}X): ${chalk.green(requireItemDurations)}`);
    } catch (error) {
      ON_RELEASE || console.error(chalk.red(`${MSG.CLI_EXECUTION_FAILURE}: ${error}`));
    }
  })
  .demandCommand(1, "Need at least one command")
  .parse();
