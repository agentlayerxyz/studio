import { config } from "dotenv";
import { LaunchpadSdk } from "@agentstudio/sdk";

config();

const launchpad = new LaunchpadSdk();

export default async function main() {
  const [basicInfo, tokenInfo] = await Promise.all([
    launchpad.info.getBasicInfo({ format: "object" }),
    launchpad.info.getTokenInfo(),
  ]);

  console.log({ basicInfo, tokenInfo });
}

main();
