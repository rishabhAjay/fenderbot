import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  underscore,
  Channel,
} from "discord.js";
import { SlashCommand } from "../types";
import { configureServerIfNotExists } from "../services/serverConfig.service";
import { buildEmbeddedMessage } from "../services/discord.service";
import { getServerConfigByServerId } from "../repositories/serverConfig.repository";
import { env } from "../env";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("config-list")
    .setDescription(`Shows the configuration list for ${env.BOT_NAME}`)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute: async (interaction) => {
    await interaction.deferReply();
    const serverId = interaction.guildId;
    if (serverId) {
      await configureServerIfNotExists(serverId);

      const serverConfig = await getServerConfigByServerId(serverId);
      let channel: Channel | null = null;
      if (serverConfig?.logChannel) {
        channel = await interaction.client.channels.fetch(
          serverConfig.logChannel
        );
      }

      const fields = [
        {
          name: "Log Channel",
          value: channel ? channel.url : "Not Set",
        },
      ];
      await interaction.editReply({
        embeds: [
          buildEmbeddedMessage({
            title: "Configuration List",
            description: underscore(
              `**Please find below the configurations for ${env.BOT_NAME}**`
            ),
            fields,
          }),
        ],
      });
    }
  },
  cooldown: 20,
};

export default command;
