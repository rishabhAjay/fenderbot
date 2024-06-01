import { Guild } from "discord.js";
import { BotEvent } from "../types";
import { configureNewServer } from "../services/serverConfig.service";

const event: BotEvent = {
  name: "guildCreate",
  execute: async (guild: Guild) => {
    if (guild.id) {
      const createObj = {
        serverId: guild.id,
      };
      await configureNewServer(createObj);
    }
    guild.client.log.info(`New Guild Joined: ${JSON.stringify(guild)}`);
  },
};

export default event;
