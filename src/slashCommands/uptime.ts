import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";
import { configureServerIfNotExists } from "../services/serverConfig.service";
import { buildEmbeddedMessage } from "../services/discord.service";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { env } from "../env";

dayjs.extend(duration);
const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("uptime")
    .setDescription(`Return uptime of ${env.BOT_NAME}`),
  execute: async (interaction) => {
    const serverId = interaction.guildId;
    if (serverId) {
      await configureServerIfNotExists(serverId);
      const formattedUptime = dayjs
        .duration(interaction.client.uptime)
        .format("Y [Years], M [Months], D [days], H [hrs], m [mins], s [secs]");
      interaction.reply({
        embeds: [
          buildEmbeddedMessage({
            title: "Bot Uptime",
            description: `${formattedUptime}`,
            footerEnabled: true,
          }),
        ],
      });
    }
  },
  cooldown: 10,
};

export default command;
