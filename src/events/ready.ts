import { ActivityType, Client } from "discord.js";
import { BotEvent } from "../types";
import {
  importDictionaryBlacklistJob,
  importDomainWhitelistJob,
} from "../services/cron.service";

const event: BotEvent = {
  name: "ready",
  once: true,
  execute: (client: Client) => {
    setInterval(() => {
      client.user?.setPresence({
        activities: [
          {
            name: `${client.guilds.cache.size} guilds (/help)`,
            type: ActivityType.Watching,
          },
        ],
        status: "online",
      });
    }, 9000);

    client.log.info(`💪 Logged in as ${client.user?.tag}`);
    importDictionaryBlacklistJob.start();
    importDomainWhitelistJob.start();
  },
};

export default event;
