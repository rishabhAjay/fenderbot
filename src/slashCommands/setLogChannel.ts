import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { SlashCommand } from "../types";
import { configureServerIfNotExists } from "../services/serverConfig.service";
import { buildEmbeddedMessage } from "../services/discord.service";
import { updateServerConfigByServerId } from "../repositories/serverConfig.repository";
import { env } from "../env";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("set-log-channel")
    .setDescription(`Allows user to set a log channel for ${env.BOT_NAME}`)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel name")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute: async (interaction) => {
    await interaction.deferReply();
    const serverId = interaction.guildId;
    if (serverId) {
      await configureServerIfNotExists(serverId);
      const channel: string = interaction.options.data[0].value as string;
      try {
        const validatedChannel = await interaction.client.channels.fetch(
          channel
        );
        if (validatedChannel?.type !== 0)
          throw new Error("Invalid Channel type");
        await updateServerConfigByServerId(serverId, { logChannel: channel });
        await interaction.editReply({
          embeds: [
            buildEmbeddedMessage({
              title: "Successfully set the Log Channel!",
              description: `Your Log Channel was configured to be ${validatedChannel.url}`,
            }),
          ],
        });
      } catch (error) {
        await interaction.editReply({
          embeds: [
            buildEmbeddedMessage({
              title: "Failed to set the Log Channel",
              description:
                "Reason: The channel may not exist or an invalid channel type was selected",
            }),
          ],
        });
      }
    }
  },
  cooldown: 30,
};

export default command;
