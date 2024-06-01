import { SlashCommandBuilder, underscore } from "discord.js";
import { SlashCommand } from "../types";
import { configureServerIfNotExists } from "../services/serverConfig.service";
import { buildEmbeddedMessage } from "../services/discord.service";
import { env } from "../env";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("help")
    .setDescription(
      `${env.BOT_NAME} actively watches for malicious links, deletes and logs them.`
    ),
  execute: async (interaction) => {
    const serverId = interaction.guildId;
    if (serverId) {
      await configureServerIfNotExists(serverId);
    }
    const helpFields = [
      {
        name: "set-log-channel(**Administrators only**)",
        value: `- Allows you to configure a logging channel for ${env.BOT_NAME}.`,
      },
      {
        name: "config-list(**Administrators only**)",
        value: `- Shows the configuration list of ${env.BOT_NAME}.`,
      },
      {
        name: "report-server-invite(**Administrators only**)",
        value: `- Allows you to report a false negative discord invite so that we can update our list.`,
      },
      {
        name: "ping",
        value: `- Shows the response time of ${env.BOT_NAME}.`,
      },
      {
        name: "uptime",
        value: `- Shows the uptime of ${env.BOT_NAME}.`,
      },
    ];
    interaction.reply({
      embeds: [
        buildEmbeddedMessage({
          title: "Help",
          description: underscore(
            `**Please find below the slash commands available for ${env.BOT_NAME}**`
          ),
          fields: helpFields,
          footerEnabled: true,
        }),
      ],
    });
  },
  cooldown: 30,
};

export default command;
